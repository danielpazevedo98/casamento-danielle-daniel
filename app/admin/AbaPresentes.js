"use client";
import { useMemo, useState } from "react";
import { CATEGORIAS, FAIXAS, naFaixa } from "@/lib/evento";
import { normalizar, reais } from "@/lib/formato";
import IlustracaoPresente from "@/components/IlustracaoPresente";
import { Aviso, Barra, Cartao, Contador, ModalAcao, Rotulo, Tabela, Tag, api, cls, falhou, useAviso } from "./ui";

// Reduz a foto no navegador antes de enviar (lado maior com ~1000px), para a
// lista carregar rapido no celular dos convidados.
async function reduzirImagem(arquivo, max = 1000) {
  const bmp = await createImageBitmap(arquivo);
  const escala = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * escala);
  canvas.height = Math.round(bmp.height * escala);
  canvas.getContext("2d").drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return new Promise((ok) => canvas.toBlob(ok, "image/webp", 0.85));
}

function EditarPresente({ presente, onFechar, recarregar }) {
  const aviso = useAviso();
  const [f, setF] = useState({
    nome: presente?.nome || "",
    descricao: presente?.descricao || "",
    preco: presente?.preco ?? "",
    categoria: presente?.categoria || CATEGORIAS[0].nome,
    emoji: presente?.emoji || "🎁",
    imagem_url: presente?.imagem_url || null,
    publicado: presente ? presente.publicado : true,
  });
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const muda = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const enviarFoto = async (e) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    setEnviandoFoto(true);
    try {
      const blob = await reduzirImagem(arquivo);
      const form = new FormData();
      form.append("arquivo", blob, blob.type === "image/webp" ? "imagem.webp" : "imagem.png");
      const r = await api("upload", { method: "POST", corpo: form });
      if (r.error) throw new Error(r.error.message);
      setF((atual) => ({ ...atual, imagem_url: r.data.url }));
    } catch (erro) {
      aviso("Não consegui enviar a imagem: " + erro.message);
    }
    setEnviandoFoto(false);
  };

  const salvar = async () => {
    const nome = f.nome.trim();
    const preco = Number(String(f.preco).replace(",", "."));
    if (!nome) return falhou(aviso, "O nome é obrigatório");
    if (!(preco > 0) || preco % 10 !== 0) return falhou(aviso, "O preço precisa ser um múltiplo de R$ 10");
    const registro = {
      nome,
      descricao: f.descricao.trim() || null,
      preco,
      categoria: f.categoria,
      emoji: f.emoji.trim() || "🎁",
      imagem_url: f.imagem_url,
      publicado: f.publicado,
    };
    const r = presente
      ? await api("presentes", { method: "PATCH", corpo: { id: presente.id, ...registro } })
      : await api("presentes", { method: "POST", corpo: registro });
    if (r.error) return falhou(aviso, r.error.message);
    aviso(presente ? "Presente atualizado" : "Presente adicionado");
    await recarregar();
  };

  return (
    <ModalAcao titulo={presente ? "Editar presente" : "Novo presente"} onFechar={onFechar} onSalvar={salvar}>
      <div className="w-32 mx-auto border border-dust">
        <IlustracaoPresente presente={f} />
      </div>
      <div className="flex justify-center gap-2 mt-2">
        <label className={`${cls.mini} cursor-pointer`}>
          {enviandoFoto ? "Enviando..." : f.imagem_url ? "Trocar imagem" : "Enviar imagem"}
          <input type="file" accept="image/*" className="hidden" onChange={enviarFoto} disabled={enviandoFoto} />
        </label>
        {f.imagem_url && (
          <button className={cls.mini} onClick={() => setF({ ...f, imagem_url: null })}>Usar o emoji</button>
        )}
      </div>

      <Rotulo htmlFor="p_nome">Nome</Rotulo>
      <input id="p_nome" className={cls.campo} value={f.nome} onChange={muda("nome")} />
      <Rotulo htmlFor="p_desc">Descrição curta</Rotulo>
      <textarea id="p_desc" rows={2} className={`${cls.campo} resize-none`} value={f.descricao} onChange={muda("descricao")} />
      <div className="grid grid-cols-[1fr_1fr_5rem] gap-3">
        <div>
          <Rotulo htmlFor="p_preco">Preço (R$)</Rotulo>
          <input id="p_preco" inputMode="numeric" className={cls.campo} value={f.preco} onChange={muda("preco")} />
        </div>
        <div>
          <Rotulo htmlFor="p_cat">Categoria</Rotulo>
          <select id="p_cat" className={cls.campo} value={f.categoria} onChange={muda("categoria")}>
            {CATEGORIAS.map((c) => <option key={c.nome}>{c.nome}</option>)}
          </select>
        </div>
        <div>
          <Rotulo htmlFor="p_emoji">Emoji</Rotulo>
          <input id="p_emoji" className={`${cls.campo} text-center`} value={f.emoji} onChange={muda("emoji")} maxLength={8} />
        </div>
      </div>
      <p className={`${cls.sub} mt-1`}>Preço sempre múltiplo de R$ 10.</p>
      <label className="flex items-center gap-2 mt-4 cursor-pointer">
        <input type="checkbox" className="w-4 h-4 accent-wine" checked={f.publicado} onChange={(e) => setF({ ...f, publicado: e.target.checked })} />
        Mostrar na lista do site
      </label>
      <p className={`${cls.sub} mt-1`}>Desmarcado, o presente fica guardado só aqui no admin.</p>
    </ModalAcao>
  );
}

export default function AbaPresentes({ dados, recarregar }) {
  const aviso = useAviso();
  const [busca, setBusca] = useState("");
  const [noSite, setNoSite] = useState("");
  const [situacao, setSituacao] = useState("");
  const [faixa, setFaixa] = useState("");
  const [categoria, setCategoria] = useState("");
  const [modal, setModal] = useState(null);

  // Quem esta segurando cada presente (reservado ou ja dado).
  const escolha = useMemo(() => {
    const m = {};
    for (const c of dados.claims) if (c.gift_id && (c.status === "pendente" || c.status === "confirmado")) m[c.gift_id] = c;
    return m;
  }, [dados.claims]);

  const filtrados = dados.presentes.filter((p) => {
    if (busca && !normalizar(p.nome).includes(normalizar(busca).trim())) return false;
    if (noSite === "sim" && !p.publicado) return false;
    if (noSite === "nao" && p.publicado) return false;
    if (situacao === "livre" && escolha[p.id]) return false;
    if (situacao === "escolhido" && !escolha[p.id]) return false;
    if (!naFaixa(p.preco, faixa)) return false;
    if (categoria && p.categoria !== categoria) return false;
    return true;
  });

  const aparecendo = dados.presentes.filter((p) => p.publicado && !escolha[p.id]).length;
  const escolhidos = dados.presentes.filter((p) => escolha[p.id]).length;
  const guardados = dados.presentes.filter((p) => !p.publicado && !escolha[p.id]).length;

  const alternar = async (p) => {
    const r = await api("presentes", { method: "PATCH", corpo: { id: p.id, publicado: !p.publicado } });
    if (r.error) return aviso("Erro: " + r.error.message);
    aviso(p.publicado ? `"${p.nome}" saiu do site (continua guardado aqui)` : `"${p.nome}" agora aparece no site`);
    recarregar();
  };

  const fechar = () => setModal(null);

  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Cartao n={aparecendo} r="APARECENDO NO SITE" cor="text-green-800" />
        <Cartao n={guardados} r="GUARDADOS (FORA DO SITE)" />
        <Cartao n={escolhidos} r="JÁ ESCOLHIDOS" />
        <Cartao n={dados.presentes.length} r="TOTAL DE PRESENTES" />
      </div>

      <Barra>
        <input className={`${cls.filtro} flex-1 min-w-[180px]`} placeholder="Buscar presente..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        <select className={cls.filtro} value={noSite} onChange={(e) => setNoSite(e.target.value)} aria-label="No site">
          <option value="">No site e guardados</option>
          <option value="sim">Só os marcados para o site</option>
          <option value="nao">Só os guardados</option>
        </select>
        <select className={cls.filtro} value={situacao} onChange={(e) => setSituacao(e.target.value)} aria-label="Situação">
          <option value="">Livres e escolhidos</option>
          <option value="livre">Só os livres</option>
          <option value="escolhido">Só os já escolhidos</option>
        </select>
        <select className={cls.filtro} value={faixa} onChange={(e) => setFaixa(e.target.value)} aria-label="Faixa de preço">
          {FAIXAS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select className={cls.filtro} value={categoria} onChange={(e) => setCategoria(e.target.value)} aria-label="Categoria">
          <option value="">Todas as categorias</option>
          {CATEGORIAS.map((c) => <option key={c.nome}>{c.nome}</option>)}
        </select>
      </Barra>
      <Barra>
        <button className={cls.btn} onClick={() => setModal({ tipo: "editar", presente: null })}>+ Novo presente</button>
        <button className={cls.btnSec} disabled={!filtrados.length} onClick={() => setModal({ tipo: "lote", publicado: true })}>
          Pôr os {filtrados.length} filtrados no site
        </button>
        <button className={cls.btnSec} disabled={!filtrados.length} onClick={() => setModal({ tipo: "lote", publicado: false })}>
          Guardar os {filtrados.length} filtrados
        </button>
        <Contador>{filtrados.length} de {dados.presentes.length}</Contador>
      </Barra>

      <Tabela
        colunas={6}
        vazio={filtrados.length ? null : "Nenhum presente com esses filtros."}
        cabecalho={
          <>
            <th className={`${cls.th} w-14`}></th>
            <th className={cls.th}>Presente</th>
            <th className={cls.th}>Preço</th>
            <th className={cls.th}>No site</th>
            <th className={cls.th}>Situação</th>
            <th className={cls.th}></th>
          </>
        }
      >
        {filtrados.map((p) => {
          const c = escolha[p.id];
          return (
            <tr key={p.id} className={p.publicado ? "hover:bg-blush/50" : "bg-stone-50 text-wine/70"}>
              <td className={cls.td}>
                <div className="w-10 border border-dust/60">
                  <IlustracaoPresente presente={p} tamanho="mini" />
                </div>
              </td>
              <td className={cls.td}>
                <b>{p.nome}</b>
                <div className={cls.sub}>{p.categoria}</div>
              </td>
              <td className={`${cls.td} whitespace-nowrap`}>{reais(p.preco)}</td>
              <td className={cls.td}>
                <button onClick={() => alternar(p)} title="Clique para mudar">
                  {p.publicado ? <Tag tipo="vai">no site</Tag> : <Tag>guardado</Tag>}
                </button>
              </td>
              <td className={cls.td}>
                {!c ? (
                  <Tag tipo="Verde">Livre</Tag>
                ) : c.status === "confirmado" ? (
                  <>
                    <Tag tipo="confirmado">Recebido</Tag>
                    <div className={cls.sub}>{c.nome}</div>
                  </>
                ) : (
                  <>
                    <Tag tipo="destaque">{c.informado_em ? "Avisou que pagou" : "Reservado"}</Tag>
                    <div className={cls.sub}>{c.nome}</div>
                  </>
                )}
              </td>
              <td className={cls.td}>
                <div className="flex flex-wrap justify-end gap-1.5">
                  <button className={cls.mini} onClick={() => setModal({ tipo: "editar", presente: p })}>Editar</button>
                  {c && <button className={cls.mini} onClick={() => setModal({ tipo: "liberar", presente: p, claim: c })}>Liberar</button>}
                  <button className={cls.miniPerigo} onClick={() => setModal({ tipo: "excluir", presente: p })}>Excluir</button>
                </div>
              </td>
            </tr>
          );
        })}
      </Tabela>

      {modal?.tipo === "editar" && <EditarPresente presente={modal.presente} onFechar={fechar} recarregar={recarregar} />}
      {modal?.tipo === "lote" && (
        <ModalAcao
          titulo={modal.publicado ? "Pôr no site" : "Guardar"}
          textoSalvar="Confirmar"
          onFechar={fechar}
          onSalvar={async () => {
            const r = await api("presentes", { method: "PATCH", corpo: { ids: filtrados.map((p) => p.id), publicado: modal.publicado } });
            if (r.error) return falhou(aviso, "Erro: " + r.error.message);
            aviso(modal.publicado ? `${filtrados.length} presentes marcados para o site` : `${filtrados.length} presentes guardados`);
            await recarregar();
          }}
        >
          {modal.publicado
            ? <>Os <b>{filtrados.length}</b> presentes da lista filtrada passam a aparecer no site (menos os que já foram escolhidos, que continuam fora).</>
            : <>Os <b>{filtrados.length}</b> presentes da lista filtrada saem do site e ficam guardados aqui. Nada é apagado.</>}
        </ModalAcao>
      )}
      {modal?.tipo === "liberar" && (
        <ModalAcao
          titulo="Liberar presente"
          textoSalvar="Liberar"
          onFechar={fechar}
          onSalvar={async () => {
            const r = await api("pagamentos", { method: "PATCH", corpo: { id: modal.claim.id, status: "cancelado" } });
            if (r.error) return falhou(aviso, "Erro: " + r.error.message);
            aviso("Presente liberado");
            await recarregar();
          }}
        >
          <b>{modal.presente.nome}</b> volta a ficar livre no site, e o presente de <b>{modal.claim.nome}</b> (
          {reais(modal.claim.valor)}) fica marcado como cancelado em Pagamentos.
          {modal.claim.status === "confirmado" && (
            <Aviso>Esse presente já foi marcado como recebido. Só libere se o dinheiro foi devolvido ou não chegou.</Aviso>
          )}
        </ModalAcao>
      )}
      {modal?.tipo === "excluir" && (
        <ModalAcao
          titulo="Excluir presente"
          textoSalvar="Excluir"
          onFechar={fechar}
          onSalvar={async () => {
            const r = await api(`presentes?id=${modal.presente.id}`, { method: "DELETE" });
            if (r.error) return falhou(aviso, "Erro: " + r.error.message);
            aviso("Presente excluído");
            await recarregar();
          }}
        >
          Vai apagar <b>{modal.presente.nome}</b> da lista. Não dá para desfazer.
          {escolha[modal.presente.id] && (
            <Aviso>
              {escolha[modal.presente.id].nome} já escolheu esse presente. O pagamento continua guardado em Pagamentos,
              mas prefira clicar em &ldquo;no site&rdquo; para só esconder.
            </Aviso>
          )}
        </ModalAcao>
      )}
    </section>
  );
}
