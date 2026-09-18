"use client";
import { useMemo, useState } from "react";
import { normalizar } from "@/lib/formato";
import { Aviso, Barra, Contador, ModalAcao, Rotulo, Tabela, Tag, TagPresenca, api, cls, falhou, useAviso } from "./ui";

const NOVO_GRUPO = "novo";

function EditarConvidado({ convidado, dados, onFechar, recarregar }) {
  const aviso = useAviso();
  const [f, setF] = useState({
    nome: convidado?.nome || "",
    origem: convidado?.origem || "Daniel",
    categoria: convidado?.categoria || "Família",
    lista: convidado?.lista || "Verde",
    grupo: convidado?.grupo_id ? String(convidado.grupo_id) : "",
  });
  const muda = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const salvar = async () => {
    const nome = f.nome.trim();
    if (!nome) return falhou(aviso, "O nome é obrigatório");

    let grupoId = f.grupo ? Number(f.grupo) : null;
    if (f.grupo === NOVO_GRUPO) {
      const r = await api("grupos", { method: "POST" });
      if (r.error) return falhou(aviso, "Erro: " + r.error.message);
      grupoId = r.data.id;
    }
    const registro = { nome, origem: f.origem, categoria: f.categoria, lista: f.lista, grupo_id: grupoId };
    const r = convidado
      ? await api("convidados", { method: "PATCH", corpo: { id: convidado.id, ...registro } })
      : await api("convidados", { method: "POST", corpo: registro });
    if (r.error) return falhou(aviso, "Erro: " + r.error.message);
    aviso(convidado ? "Convidado atualizado" : "Convidado adicionado");
    await recarregar();
  };

  const membros = (id) => dados.convidados.filter((c) => c.grupo_id === id).map((c) => c.nome).join(", ");

  return (
    <ModalAcao titulo={convidado ? "Editar convidado" : "Novo convidado"} onFechar={onFechar} onSalvar={salvar}>
      <Rotulo htmlFor="c_nome">Nome</Rotulo>
      <input id="c_nome" className={cls.campo} value={f.nome} onChange={muda("nome")} autoFocus />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Rotulo htmlFor="c_origem">Convidado de</Rotulo>
          <select id="c_origem" className={cls.campo} value={f.origem} onChange={muda("origem")}>
            <option>Daniel</option>
            <option>Danielle</option>
          </select>
        </div>
        <div>
          <Rotulo htmlFor="c_cat">Categoria</Rotulo>
          <select id="c_cat" className={cls.campo} value={f.categoria} onChange={muda("categoria")}>
            <option>Família</option>
            <option>Amigos</option>
          </select>
        </div>
      </div>
      <Rotulo htmlFor="c_lista">Status (só Verde aparece no site)</Rotulo>
      <select id="c_lista" className={cls.campo} value={f.lista} onChange={muda("lista")}>
        <option>Verde</option>
        <option>Amarelo</option>
        <option>Vermelho</option>
      </select>
      <Rotulo htmlFor="c_grupo">Grupo (quem confirma presença junto)</Rotulo>
      <select id="c_grupo" className={cls.campo} value={f.grupo} onChange={muda("grupo")}>
        <option value="">Sem grupo</option>
        <option value={NOVO_GRUPO}>+ Criar um grupo novo</option>
        {dados.grupos.map((g) => (
          <option key={g.id} value={g.id}>
            {g.id} — {membros(g.id).slice(0, 50) || "vazio"}
          </option>
        ))}
      </select>
    </ModalAcao>
  );
}

export default function AbaConvidados({ dados, recarregar }) {
  const aviso = useAviso();
  const [busca, setBusca] = useState("");
  const [lista, setLista] = useState("");
  const [presenca, setPresenca] = useState("");
  const [modal, setModal] = useState(null);

  const filtrados = useMemo(() => {
    const q = normalizar(busca).trim();
    return dados.convidados.filter((c) => {
      if (q && !normalizar(c.nome).includes(q)) return false;
      if (lista === "(sem)" && c.lista) return false;
      if (lista && lista !== "(sem)" && c.lista !== lista) return false;
      if (presenca === "pendente" && c.presenca) return false;
      if (presenca && presenca !== "pendente" && c.presenca !== presenca) return false;
      return true;
    });
  }, [dados.convidados, busca, lista, presenca]);

  const marcar = async (c, p) => {
    const r = await api("convidados", {
      method: "PATCH",
      corpo: { id: c.id, presenca: p, rsvp_em: new Date().toISOString(), confirmado_por: "Anotado pelos noivos" },
    });
    if (r.error) return aviso("Erro: " + r.error.message);
    aviso(`${c.nome} → ${p === "vai" ? "Vai" : "Não vai"}`);
    recarregar();
  };

  const fechar = () => setModal(null);

  return (
    <section>
      <Barra>
        <input className={`${cls.filtro} flex-1 min-w-[180px]`} placeholder="Buscar convidado..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        <select className={cls.filtro} value={lista} onChange={(e) => setLista(e.target.value)} aria-label="Status">
          <option value="">Todos os status</option>
          <option value="Verde">Verde (aparece no site)</option>
          <option value="Amarelo">Amarelo</option>
          <option value="Vermelho">Vermelho</option>
          <option value="(sem)">Sem status</option>
        </select>
        <select className={cls.filtro} value={presenca} onChange={(e) => setPresenca(e.target.value)} aria-label="Presença">
          <option value="">Confirmados e pendentes</option>
          <option value="vai">Só quem vai</option>
          <option value="nao_vai">Só quem não vai</option>
          <option value="pendente">Só pendentes</option>
        </select>
        <button className={cls.btn} onClick={() => setModal({ tipo: "editar", convidado: null })}>+ Novo convidado</button>
        <Contador>{filtrados.length} de {dados.convidados.length}</Contador>
      </Barra>

      <Tabela
        colunas={6}
        vazio={filtrados.length ? null : "Nenhum convidado com esses filtros."}
        cabecalho={
          <>
            <th className={cls.th}>Nome</th>
            <th className={`${cls.th} hidden md:table-cell`}>Grupo</th>
            <th className={`${cls.th} hidden md:table-cell`}>Origem</th>
            <th className={cls.th}>Status</th>
            <th className={cls.th}>Presença</th>
            <th className={cls.th}></th>
          </>
        }
      >
        {filtrados.map((c) => {
          const junto = c.grupo_id ? dados.convidados.filter((x) => x.grupo_id === c.grupo_id && x.id !== c.id) : [];
          return (
            <tr key={c.id} className="hover:bg-blush/50">
              <td className={cls.td}>
                <b>{c.nome}</b>
                {junto.length > 0 && <div className={cls.sub}>com {junto.map((x) => x.nome).join(", ")}</div>}
              </td>
              <td className={`${cls.td} hidden md:table-cell`}>{c.grupo_id || "—"}</td>
              <td className={`${cls.td} ${cls.sub} hidden md:table-cell`}>{c.origem || "—"} · {c.categoria || "—"}</td>
              <td className={cls.td}>{c.lista ? <Tag tipo={c.lista}>{c.lista}</Tag> : <Tag>—</Tag>}</td>
              <td className={cls.td}>
                <TagPresenca p={c.presenca} />
                {c.confirmado_por && <div className={`${cls.sub} hidden md:block`}>por {c.confirmado_por}</div>}
              </td>
              <td className={cls.td}>
                <div className="flex flex-wrap justify-end gap-1.5">
                  <button className={cls.mini} onClick={() => setModal({ tipo: "editar", convidado: c })}>Editar</button>
                  {c.presenca ? (
                    <button className={cls.mini} onClick={() => setModal({ tipo: "desfazer", convidado: c })}>Desfazer resposta</button>
                  ) : (
                    <>
                      <button className={cls.mini} onClick={() => marcar(c, "vai")}>Vai</button>
                      <button className={cls.mini} onClick={() => marcar(c, "nao_vai")}>Não vai</button>
                    </>
                  )}
                  <button className={cls.miniPerigo} onClick={() => setModal({ tipo: "excluir", convidado: c })}>Excluir</button>
                </div>
              </td>
            </tr>
          );
        })}
      </Tabela>

      {modal?.tipo === "editar" && (
        <EditarConvidado convidado={modal.convidado} dados={dados} onFechar={fechar} recarregar={recarregar} />
      )}
      {modal?.tipo === "desfazer" && (
        <ModalAcao
          titulo="Desfazer resposta"
          textoSalvar="Confirmar"
          onFechar={fechar}
          onSalvar={async () => {
            const r = await api("convidados", {
              method: "PATCH",
              corpo: { id: modal.convidado.id, presenca: null, rsvp_em: null, confirmado_por: null },
            });
            if (r.error) return falhou(aviso, "Erro: " + r.error.message);
            aviso("Resposta desfeita");
            await recarregar();
          }}
        >
          A resposta de <b>{modal.convidado.nome}</b> volta a ficar pendente, e essa pessoa reaparece na busca do site
          para confirmar de novo.
        </ModalAcao>
      )}
      {modal?.tipo === "excluir" && (
        <ModalAcao
          titulo="Excluir convidado"
          textoSalvar="Excluir"
          onFechar={fechar}
          onSalvar={async () => {
            const r = await api(`convidados?id=${modal.convidado.id}`, { method: "DELETE" });
            if (r.error) return falhou(aviso, "Erro: " + r.error.message);
            aviso("Convidado excluído");
            await recarregar();
          }}
        >
          Vai apagar <b>{modal.convidado.nome}</b> de vez. Não dá para desfazer.
          <Aviso>Se a ideia é só tirar do site, prefira editar e mudar o status para Vermelho: assim o nome continua guardado.</Aviso>
        </ModalAcao>
      )}
    </section>
  );
}
