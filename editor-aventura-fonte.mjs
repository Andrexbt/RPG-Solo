import { parse } from "./vendor/acorn/acorn.mjs";

function nomeMembro(no) {
  if (!no?.computed && no?.property?.type === "Identifier") return no.property.name;
  if (no?.computed && no?.property?.type === "Literal") return no.property.value;
  return null;
}

function encontrarObjetoAventura(arvore, aventuraId) {
  for (const comando of arvore.body) {
    const expressao = comando.type === "ExpressionStatement" ? comando.expression : null;
    if (expressao?.type !== "AssignmentExpression" || expressao.operator !== "=") continue;
    const esquerda = expressao.left;
    if (esquerda?.type !== "MemberExpression") continue;
    if (esquerda.object?.type !== "Identifier" || esquerda.object.name !== "bancoAventuras") continue;
    if (nomeMembro(esquerda) !== aventuraId) continue;
    if (expressao.right?.type !== "ObjectExpression") continue;
    return expressao.right;
  }
  throw new Error(`Não foi encontrado o objeto bancoAventuras.${aventuraId}.`);
}

function nomePropriedade(propriedade) {
  if (propriedade.computed) {
    return propriedade.key?.type === "Literal" ? propriedade.key.value : null;
  }
  if (propriedade.key?.type === "Identifier") return propriedade.key.name;
  if (propriedade.key?.type === "Literal") return propriedade.key.value;
  return null;
}

function avancarNoCaminho(no, parte, caminhoPercorrido) {
  if (no.type === "ObjectExpression") {
    const propriedade = no.properties.find((item) =>
      item.type === "Property" && String(nomePropriedade(item)) === String(parte),
    );
    if (propriedade) return propriedade.value;
  }

  if (no.type === "ArrayExpression" && Number.isInteger(Number(parte))) {
    const indice = Number(parte);
    if (indice >= 0 && indice < no.elements.length && no.elements[indice]) return no.elements[indice];
  }

  throw new Error(`O caminho ${[...caminhoPercorrido, parte].join(" › ")} não existe no objeto original.`);
}

export function localizarValorAventura(fonte, aventuraId, caminho) {
  const arvore = parse(fonte, {
    ecmaVersion: "latest",
    sourceType: "script",
    locations: true,
  });
  let noAtual = encontrarObjetoAventura(arvore, aventuraId);
  const percorrido = [];

  for (const parte of caminho) {
    noAtual = avancarNoCaminho(noAtual, parte, percorrido);
    percorrido.push(parte);
  }

  return {
    inicio: noAtual.start,
    fim: noAtual.end,
    linhaInicial: noAtual.loc.start.line,
    colunaInicial: noAtual.loc.start.column + 1,
    linhaFinal: noAtual.loc.end.line,
    colunaFinal: noAtual.loc.end.column + 1,
    codigoAtual: fonte.slice(noAtual.start, noAtual.end),
  };
}

function localizarNoAventura(fonte, aventuraId, caminho) {
  const arvore = parse(fonte, {
    ecmaVersion: "latest",
    sourceType: "script",
    locations: true,
  });
  let noAtual = encontrarObjetoAventura(arvore, aventuraId);
  const percorrido = [];
  for (const parte of caminho) {
    noAtual = avancarNoCaminho(noAtual, parte, percorrido);
    percorrido.push(parte);
  }
  return noAtual;
}

function decomporDestinoAventura(no, aventuraId) {
  const caminhoInvertido = [];
  let atual = no;
  while (atual?.type === "MemberExpression") {
    const parte = nomeMembro(atual);
    if (parte === null) return null;
    caminhoInvertido.push(parte);
    atual = atual.object;
  }
  if (atual?.type !== "Identifier" || atual.name !== "bancoAventuras") return null;
  const partes = caminhoInvertido.reverse();
  if (partes.shift() !== aventuraId || !partes.length) return null;
  return partes;
}

export function extrairAlteracoesDoBlocoGerado(fonte, aventuraId) {
  const inicioMarcador = fonte.indexOf("/* RPG_SOLO_EDITOR_INICIO");
  const fimMarcador = fonte.indexOf("/* RPG_SOLO_EDITOR_FIM */");
  if (inicioMarcador < 0 || fimMarcador < inicioMarcador) return [];

  const arvore = parse(fonte, { ecmaVersion: "latest", sourceType: "script" });
  const alteracoes = [];
  for (const comando of arvore.body) {
    if (comando.start <= inicioMarcador || comando.end >= fimMarcador) continue;
    const expressao = comando.type === "ExpressionStatement" ? comando.expression : null;
    if (expressao?.type !== "AssignmentExpression" || expressao.operator !== "=") continue;
    const caminho = decomporDestinoAventura(expressao.left, aventuraId);
    if (!caminho) continue;
    const valor = expressao.right.type === "Literal"
      ? expressao.right.value
      : expressao.right.type === "TemplateLiteral" && expressao.right.expressions.length === 0
        ? expressao.right.quasis[0].value.cooked
        : undefined;
    if (valor === undefined) {
      throw new Error(`O bloco gerado contém um valor não suportado em ${caminho.join(" › ")}.`);
    }
    alteracoes.push({
      caminho,
      valor,
    });
  }
  return alteracoes;
}

function escaparTemplate(texto) {
  return texto
    .replaceAll("\\", "\\\\")
    .replaceAll("`", "\\`")
    .replaceAll("${", "\\${");
}

export function valorComoCodigo(valor, codigoAnterior = "", colunaInicial = 1) {
  if (typeof valor !== "string") return JSON.stringify(valor);
  if (!valor.includes("\n") && !codigoAnterior.startsWith("`")) return JSON.stringify(valor);
  const recuo = " ".repeat(Math.max(0, colunaInicial - 1));
  return `\`${escaparTemplate(valor).replaceAll("\n", `\n${recuo}`)}\``;
}

export function aplicarAlteracoesNoObjeto(fonte, aventuraId, alteracoes) {
  const renomes = alteracoes.filter((a) => a.caminho.at(-1) === "__editorId");
  if (renomes.length) {
    const editada = aplicarAlteracoesNoObjeto(fonte, aventuraId,
      alteracoes.filter((a) => a.caminho.at(-1) !== "__editorId"));
    return renomearIdsNaFonte(editada, aventuraId, renomes);
  }
  const porCaminho = new Map();
  alteracoes.forEach((alteracao) =>
    porCaminho.set(alteracao.caminho.map(String).join("\u001f"), alteracao),
  );

  const substituicoes = [...porCaminho.values()].map((alteracao) => {
    try {
      const local = localizarValorAventura(fonte, aventuraId, alteracao.caminho);
      return {
        inicio: local.inicio,
        fim: local.fim,
        codigo: alteracao.codigoValor ?? valorComoCodigo(
          alteracao.valor,
          local.codigoAtual,
          local.colunaInicial,
        ),
      };
    } catch (erro) {
      const caminhoPai = alteracao.caminho.slice(0, -1);
      const propriedade = alteracao.caminho.at(-1);
      if (!["titulo", "id"].includes(propriedade)) throw erro;
      const pai = localizarNoAventura(fonte, aventuraId, caminhoPai);
      if (pai.type !== "ObjectExpression") throw erro;
      const colunaPropriedade = pai.properties[0]?.loc?.start?.column ?? (pai.loc.end.column + 1);
      const recuo = " ".repeat(colunaPropriedade);
      const quebra = fonte.includes("\r\n") ? "\r\n" : "\n";
      const codigoValor = valorComoCodigo(alteracao.valor);
      return {
        inicio: pai.start + 1,
        fim: pai.start + 1,
        codigo: `${quebra}${recuo}${propriedade}: ${codigoValor},`,
      };
    }
  }).sort((a, b) => b.inicio - a.inicio);

  let resultado = fonte;
  substituicoes.forEach(({ inicio, fim, codigo }) => {
    resultado = resultado.slice(0, inicio) + codigo + resultado.slice(fim);
  });
  return resultado;
}

// Renomes são resolvidos juntos sobre a mesma árvore, preservando os demais trechos.
export function renomearIdsNaFonte(fonte, aventuraId, alteracoes) {
  const raiz = localizarNoAventura(fonte, aventuraId, []);
  const mudancas = new Map();
  const renomes = alteracoes.map(({ caminho, valor }) => {
    if (!/^[a-z][a-zA-Z0-9_]*$/.test(valor) || ["constructor", "prototype", "__proto__"].includes(valor)) {
      throw new Error(`ID inválido: ${valor}`);
    }
    const alvo = caminho.slice(0, -1);
    const estrutural = alvo.length === 2 || (alvo.length === 4 && alvo[2] === "etapas");
    const tipo = estrutural ? (alvo.length === 2 ? "cena" : "etapa") : (alvo.at(-1) === "teste" ? "teste" : "escolha");
    const no = localizarNoAventura(fonte, aventuraId, alvo);
    const id = no.properties.find((p) => nomePropriedade(p) === "id");
    const antigo = estrutural ? alvo.at(-1) : id?.value?.value;
    if (!estrutural && typeof alvo.at(-1) === "number") {
      const grupo = localizarNoAventura(fonte, aventuraId, alvo.slice(0, -1));
      if (grupo.elements.some((outro) => outro && outro !== no && outro.start !== no.start && outro.properties?.some((p) => nomePropriedade(p) === "id" && p.value.value === valor))) {
        throw new Error(`Já existe uma escolha com ID ${valor}.`);
      }
    }
    if (estrutural) {
      const pai = localizarNoAventura(fonte, aventuraId, alvo.slice(0, -1));
      if (valor !== antigo && pai.properties.some((p) => nomePropriedade(p) === valor)) {
        throw new Error(`Já existe um elemento com ID ${valor}.`);
      }
      const propriedade = pai.properties.find((p) => nomePropriedade(p) === antigo);
      mudancas.set(propriedade.key.start, { inicio: propriedade.key.start, fim: propriedade.key.end, codigo: valor });
    } else if (id) {
      mudancas.set(id.value.start, { inicio: id.value.start, fim: id.value.end, codigo: JSON.stringify(valor) });
    } else {
      mudancas.set(no.start + 1, { inicio: no.start + 1, fim: no.start + 1, codigo: ` id: ${JSON.stringify(valor)},` });
    }
    return { tipo, antigo, novo: valor, cena: alvo[1] };
  });
  function visitar(no, caminho = [], cena = null) {
    if (no.type === "ArrayExpression") {
      no.elements.forEach((filho, i) => filho && visitar(filho, [...caminho, i], cena));
    } else if (no.type === "ObjectExpression") {
      const literal = (nome) => no.properties.find((p) => nomePropriedade(p) === nome)?.value?.value;
      const contexto = literal("cenaId") ?? literal("cenaOrigemId") ?? literal("proximaCena") ?? cena;
      for (const p of no.properties) {
        if (p.type !== "Property") continue;
        const chave = nomePropriedade(p);
        if (p.value.type === "Literal") {
          const r = renomes.find((r) => r.antigo !== undefined && p.value.value === r.antigo && (
            (r.tipo === "cena" && ["cenaInicial", "proximaCena", "cenaId", "cenaOrigemId"].includes(chave)) ||
            (r.tipo === "etapa" && contexto === r.cena && ["etapaInicial", "proximaEtapa", "etapaId", "etapaOrigemId"].includes(chave)) ||
            (r.tipo === "escolha" && contexto === r.cena && ["escolhaId", "caminhoId", "caminhoOrigemId"].includes(chave)) ||
            (r.tipo === "teste" && contexto === r.cena && chave === "testeId")
          ));
          if (r) mudancas.set(p.value.start, { inicio: p.value.start, fim: p.value.end, codigo: JSON.stringify(r.novo) });
        }
        visitar(p.value, [...caminho, chave], caminho.length === 1 && caminho[0] === "cenas" ? chave : contexto);
      }
    }
  }
  visitar(raiz);
  let resultado = fonte;
  for (const m of [...mudancas.values()].sort((a, b) => b.inicio - a.inicio)) {
    resultado = resultado.slice(0, m.inicio) + m.codigo + resultado.slice(m.fim);
  }
  parse(resultado, { ecmaVersion: "latest" });
  return resultado;
}

export function removerBlocoGerado(fonte) {
  const expressao = /\r?\n?\/\* RPG_SOLO_EDITOR_INICIO[\s\S]*?\/\* RPG_SOLO_EDITOR_FIM \*\/\r?\n?/;
  return fonte.replace(expressao, "\n").trimEnd() + "\n";
}
