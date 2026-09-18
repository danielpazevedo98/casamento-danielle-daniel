"use client";
import { useMemo, useState } from "react";
import { supabaseNavegador } from "@/lib/supabase";
import { dataHora, normalizar, reais } from "@/lib/formato";
import { Barra, Cartao, Contador, ModalAcao, Rotulo, Tabela, Tag, cls, falhou, useAviso } from "./ui";

const METODOS = { pix: "Pix", cartao: "Cartão", outro: "Outro" };

// Presente dado fora do site (dinheiro no envelope, Pix direto na chave...).
function RegistrarPorFora({ dados, onFechar, recarregar }) {
  const db = supabaseNavegador();
  const aviso = useAviso();
  const [f, setF] = useState({ nome: "", giftId: "", valor: "", metodo: "pix", mensagem: "" });
  const muda = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const escolherPresente = (e) => {
    const p = dados.presentes.find((x) => String(x.id) === e.target.value);
    setF({ ...f, giftId: e.target.value, valor: p ? String(p.preco) : f.valor });
  };

  const salvar = async () => {
    const valor = Number(String(f.valor).replace(",", "."));
    if (!f.nome.trim()) return falhou(aviso, "Diga quem deu o presente");
    if (!(valor > 0)) return falhou(aviso, "Coloque o valor recebido");
    const presente = dados.presentes.find((x) => String(x.id) === f.giftId);
    const agora = new Date().toISOString();
    const r = await db.from("gift_claims").insert({
      codigo: "DD" + crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase(),
      gift_id: presente?.id ?? null,
      presente_nome: presente?.nome || "Presente em dinheiro",
      nome: f.nome.trim(),
      mensagem: f.mensagem.trim() || null,
      valor,
      metodo: f.metodo,
      status: "confirmado",
      confirmado_em: agora,
    });
    if (r.error) return falhou(aviso, "Erro: " + r.error.message);
    aviso("Presente registrado");
    await recarregar();
  };

  return (
    <ModalAcao titulo="Registrar presente recebido" onFechar={onFechar} onSalvar={salvar}>
      <Rotulo htmlFor="r_nome">Quem deu</Rotulo>
      <input id="r_nome" className={cls.campo} value={f.nome} onChange={muda("nome")} autoFocus />
      <Rotulo htmlFor="r_pres">Presente (opcional)</Rotulo>
      <select id="r_pres" className={cls.campo} value={f.giftId} onChange={escolherPresente}>
        <option value="">Presente em dinheiro (sem item da lista)</option>
        {dados.presentes.map((p) => (
          <option key={p.id} value={p.id}>{p.nome} · {reais(p.preco)}</option>
        ))}
      </select>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Rotulo htmlFor="r_valor">Valor (R$)</Rotulo>
          <input id="r_valor" inputMode="decimal" className={cls.campo} value={f.valor} onChange={muda("valor")} />
        </div>
        <div>
          <Rotulo htmlFor="r_met">Como pagou</Rotulo>
          <select id="r_met" className={cls.campo} value={f.metodo} onChange={muda("metodo")}>
            {Object.entries(METODOS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>
      <Rotulo htmlFor="r_msg">Recado (opcional)</Rotulo>
      <textarea id="r_msg" rows={2} className={`${cls.campo} resize-none`} value={f.mensagem} onChange={muda("mensagem")} />
    </ModalAcao>
  );
}

export default function AbaPagamentos({ dados, recarregar }) {
  const db = supabaseNavegador();
  const aviso = useAviso();
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("pendente");
  const [metodo, setMetodo] = useState("");
  const [modal, setModal] = useState(null);

  const filtrados = useMemo(() => {
    const q = normalizar(busca).trim();
    return dados.claims.filter((c) => {
      if (q && !normalizar(`${c.nome} ${c.presente_nome} ${c.codigo} ${c.email || ""}`).includes(q)) return false;
      if (status && c.status !== status) return false;
      if (metodo && c.metodo !== metodo) return false;
      return true;
    });
  }, [dados.claims, busca, status, metodo]);

  const total = (s) => dados.claims.filter((c) => c.status === s).reduce((t, c) => t + Number(c.valor), 0);

  const mudarStatus = async (c, novo) => {
    const r = await db
      .from("gift_claims")
      .update({ status: novo, confirmado_em: novo === "confirmado" ? new Date().toISOString() : null })
      .eq("id", c.id);
    if (r.error) return falhou(aviso, "Erro: " + r.error.message);
    aviso(novo === "confirmado" ? `Presente de ${c.nome} confirmado 💝` : novo === "cancelado" ? "Marcado como cancelado" : "Voltou para pendente");
    await recarregar();
  };

  const fechar = () => setModal(null);

  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <Cartao n={reais(total("confirmado"))} r="RECEBIDO" cor="text-green-800" />
        <Cartao n={reais(total("pendente"))} r="A CONFERIR" />
        <Cartao n={dados.claims.filter((c) => c.status === "pendente" && c.informado_em).length} r="AVISARAM QUE PAGARAM" />
      </div>

      <Barra>
        <input className={`${cls.filtro} flex-1 min-w-[180px]`} placeholder="Buscar nome, presente ou código..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        <select className={cls.filtro} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Situação">
          <option value="pendente">A conferir</option>
          <option value="confirmado">Recebidos</option>
          <option value="cancelado">Cancelados</option>
          <option value="">Todos</option>
        </select>
        <select className={cls.filtro} value={metodo} onChange={(e) => setMetodo(e.target.value)} aria-label="Forma de pagamento">
          <option value="">Pix e cartão</option>
          {Object.entries(METODOS).map(([v, l]) => <option key={v} value={v}>Só {l.toLowerCase()}</option>)}
        </select>
        <button className={cls.btn} onClick={() => setModal({ tipo: "registrar" })}>+ Registrar recebido</button>
        <Contador>{filtrados.length} de {dados.claims.length}</Contador>
      </Barra>
      <p className={`${cls.sub} mb-3`}>
        Pix fica &ldquo;a conferir&rdquo; até vocês verem o dinheiro na conta: procure pelo valor ou pelo código (ele aparece
        no extrato em alguns bancos). Cartão é confirmado sozinho pelo Mercado Pago.
      </p>

      <Tabela
        colunas={5}
        vazio={filtrados.length ? null : "Nada por aqui com esses filtros."}
        cabecalho={
          <>
            <th className={cls.th}>Quem</th>
            <th className={cls.th}>Presente</th>
            <th className={cls.th}>Situação</th>
            <th className={`${cls.th} hidden md:table-cell`}>Quando</th>
            <th className={cls.th}></th>
          </>
        }
      >
        {filtrados.map((c) => (
          <tr key={c.id} className="hover:bg-blush/50 align-top">
            <td className={cls.td}>
              <b>{c.nome}</b>
              {c.email && <div className={cls.sub}>{c.email}</div>}
              {c.mensagem && <div className="text-[12.5px] italic text-wine mt-1 max-w-sm whitespace-pre-line">“{c.mensagem}”</div>}
            </td>
            <td className={cls.td}>
              {c.presente_nome}
              <div className={cls.sub}>
                {reais(c.valor)} · {METODOS[c.metodo]} · <span className="font-mono">{c.codigo}</span>
              </div>
            </td>
            <td className={cls.td}>
              {c.status === "confirmado" ? (
                <Tag tipo="confirmado">Recebido</Tag>
              ) : c.status === "cancelado" ? (
                <Tag tipo="cancelado">Cancelado</Tag>
              ) : c.informado_em ? (
                <Tag tipo="destaque">Avisou que pagou</Tag>
              ) : (
                <Tag>{c.metodo === "cartao" ? "Aguardando cartão" : "Gerou o Pix"}</Tag>
              )}
            </td>
            <td className={`${cls.td} ${cls.sub} hidden md:table-cell whitespace-nowrap`}>
              {dataHora(c.criado_em)}
              {c.confirmado_em && <div>recebido {dataHora(c.confirmado_em)}</div>}
            </td>
            <td className={cls.td}>
              <div className="flex flex-wrap justify-end gap-1.5">
                {c.status === "pendente" ? (
                  <>
                    <button className={cls.mini} onClick={() => mudarStatus(c, "confirmado")}>Confirmar recebimento</button>
                    <button className={cls.miniPerigo} onClick={() => setModal({ tipo: "cancelar", claim: c })}>Cancelar</button>
                  </>
                ) : (
                  <button className={cls.mini} onClick={() => mudarStatus(c, "pendente")}>Voltar para a conferir</button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </Tabela>

      {modal?.tipo === "registrar" && <RegistrarPorFora dados={dados} onFechar={fechar} recarregar={recarregar} />}
      {modal?.tipo === "cancelar" && (
        <ModalAcao titulo="Cancelar presente" textoSalvar="Cancelar presente" onFechar={fechar} onSalvar={() => mudarStatus(modal.claim, "cancelado")}>
          Marca o presente de <b>{modal.claim.nome}</b> ({reais(modal.claim.valor)}) como cancelado. Use quando o
          dinheiro não chegou ou a pessoa gerou o Pix e desistiu. Dá para voltar atrás depois.
        </ModalAcao>
      )}
    </section>
  );
}
