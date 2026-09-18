"use client";
import { dataHora, reais } from "@/lib/formato";
import { Cartao, Secao, Tabela, Tag, TagPresenca, cls } from "./ui";

const soma = (lista) => lista.reduce((s, c) => s + Number(c.valor || 0), 0);

export default function AbaPainel({ dados, irPara }) {
  const verdes = dados.convidados.filter((c) => c.lista === "Verde");
  const vao = verdes.filter((c) => c.presenca === "vai").length;
  const nao = verdes.filter((c) => c.presenca === "nao_vai").length;

  const recebidos = dados.claims.filter((c) => c.status === "confirmado");
  const pixPendentes = dados.claims.filter((c) => c.status === "pendente" && c.metodo === "pix");
  const avisaram = pixPendentes.filter((c) => c.informado_em);
  // Reservados ou recebidos: sao os que seguram o presente fora do site.
  const ativos = dados.claims.filter((c) => c.status === "pendente" || c.status === "confirmado");
  const presentesRecentes = ativos.slice(0, 12);
  const ocupados = new Set(ativos.map((c) => c.gift_id));
  const livresNoSite = dados.presentes.filter((p) => p.publicado && !ocupados.has(p.id)).length;

  const respostas = dados.convidados
    .filter((c) => c.presenca)
    .sort((a, b) => (b.rsvp_em || "").localeCompare(a.rsvp_em || ""));

  return (
    <section>
      <Secao>CONFIRMAÇÕES</Secao>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Cartao n={vao} r="VÃO COMPARECER" cor="text-green-800" />
        <Cartao n={nao} r="NÃO VÃO" cor="text-red-800" />
        <Cartao n={verdes.length - vao - nao} r="AINDA NÃO RESPONDERAM" />
        <Cartao n={verdes.length} r="CONVIDADOS NO SITE" />
      </div>

      <Secao>PRESENTES</Secao>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Cartao n={recebidos.length} r="PRESENTES RECEBIDOS" cor="text-green-800" />
        <Cartao n={reais(soma(recebidos))} r="VALOR RECEBIDO" cor="text-green-800" />
        <Cartao n={pixPendentes.length} r={`PIX A CONFERIR · ${avisaram.length} AVISARAM QUE PAGARAM`} />
        <Cartao n={livresNoSite} r="PRESENTES LIVRES NO SITE" />
      </div>

      <Secao>ÚLTIMOS PRESENTES</Secao>
      <Tabela
        colunas={4}
        vazio={presentesRecentes.length ? null : "Ninguém presenteou ainda."}
        cabecalho={
          <>
            <th className={cls.th}>Quem</th>
            <th className={cls.th}>Presente</th>
            <th className={cls.th}>Situação</th>
            <th className={`${cls.th} hidden md:table-cell`}>Quando</th>
          </>
        }
      >
        {presentesRecentes.map((c) => (
          <tr key={c.id}>
            <td className={cls.td}>
              <b>{c.nome}</b>
              {c.mensagem && <div className={`${cls.sub} italic line-clamp-2 max-w-xs`}>“{c.mensagem}”</div>}
            </td>
            <td className={cls.td}>
              {c.presente_nome}
              <div className={cls.sub}>{reais(c.valor)} · {c.metodo === "cartao" ? "cartão" : c.metodo}</div>
            </td>
            <td className={cls.td}>
              {c.status === "confirmado" ? (
                <Tag tipo="confirmado">Recebido</Tag>
              ) : c.informado_em ? (
                <Tag tipo="destaque">Avisou que pagou</Tag>
              ) : (
                <Tag>Pendente</Tag>
              )}
            </td>
            <td className={`${cls.td} ${cls.sub} hidden md:table-cell`}>{dataHora(c.criado_em)}</td>
          </tr>
        ))}
      </Tabela>
      {dados.claims.length > presentesRecentes.length && (
        <button className={`${cls.mini} mt-2`} onClick={() => irPara("pagamentos")}>Ver todos em Pagamentos →</button>
      )}

      <Secao>ÚLTIMAS CONFIRMAÇÕES DE PRESENÇA</Secao>
      <Tabela
        colunas={4}
        vazio={respostas.length ? null : "Nenhuma confirmação ainda."}
        cabecalho={
          <>
            <th className={cls.th}>Convidado</th>
            <th className={cls.th}>Resposta</th>
            <th className={`${cls.th} hidden md:table-cell`}>Preenchido por</th>
            <th className={`${cls.th} hidden md:table-cell`}>Quando</th>
          </>
        }
      >
        {respostas.slice(0, 30).map((c) => (
          <tr key={c.id}>
            <td className={cls.td}>{c.nome}</td>
            <td className={cls.td}><TagPresenca p={c.presenca} /></td>
            <td className={`${cls.td} ${cls.sub} hidden md:table-cell`}>{c.confirmado_por || "—"}</td>
            <td className={`${cls.td} ${cls.sub} hidden md:table-cell`}>{dataHora(c.rsvp_em)}</td>
          </tr>
        ))}
      </Tabela>
      {respostas.length > 30 && (
        <button className={`${cls.mini} mt-2`} onClick={() => irPara("convidados")}>Ver todas em Convidados →</button>
      )}
    </section>
  );
}
