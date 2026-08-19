import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "C:/Users/Lenovo/Desktop/RPG Solo/RPG Solo - Fontes do Projeto/RPG Solo MVP Checklist - personagens nivel 1 auditados.xlsx";
const outputDir = "C:/Users/Lenovo/Documents/RPG Solo/outputs/mvp-checklist-2026-08-18";
const outputPath = `${outputDir}/RPG Solo MVP Checklist - atualizado 2026-08-18.xlsx`;
const previewDir = `${outputDir}/previews`;

await fs.mkdir(previewDir, { recursive: true });

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const main = workbook.worksheets.getItem("Página1");
const mainRange = main.getUsedRange();
const mainValues = mainRange.values;

const completedMainItems = [
  { statusCol: 6, label: "Recursos disponíveis" },
  { statusCol: 6, label: "Efeitos temporários" },
  { statusCol: 6, label: "Manter a reação até ela ser usada" },
  { statusCol: 8, label: "Custo de ação ou ação bônus" },
  { statusCol: 8, label: "Mostrar a habilidade no combate" },
  { statusCol: 8, label: "Verificar se pode ser usada" },
  { statusCol: 8, label: "Consumir o recurso" },
  { statusCol: 8, label: "Aplicar o efeito" },
  { statusCol: 8, label: "Atualizar a interface" },
  { statusCol: 8, label: "Impedir uso sem recursos" },
];

for (const item of completedMainItems) {
  const labelCol = item.statusCol + 1;
  const rowIndex = mainValues.findIndex((row) => row[labelCol] === item.label);

  if (rowIndex < 0) {
    throw new Error(`Item não encontrado na checklist principal: ${item.label}`);
  }

  main.getCell(rowIndex, item.statusCol).values = [["☑"]];
}

const auditUpdates = {
  "ESC-01": {
    status: "☑",
    evidence: "criacao-personagem.js: rulesVersion \"2024\"; personagem-dados.js: normalização do contrato salvo.",
    observation: "A edição de regras passou a fazer parte explícita do personagem canônico.",
  },
  "ESC-03": {
    status: "☑",
    evidence: "criacao-personagem.js: schemaVersion, nivel, niveisPorClasse e xp; personagem-dados.js centraliza normalização e persistência.",
    observation: "Criação, ficha, aventura e combate agora partem do mesmo contrato versionado.",
  },
  "CLA-02": {
    status: "☑",
    evidence: "criacao-personagem.js inicializa nivel 1 e niveisPorClasse; personagem-dados.js normaliza personagens antigos.",
    observation: "Nível total e nível da classe são salvos de forma consistente.",
  },
  "CLA-03": {
    status: "◐",
    evidence: "criacao-personagem.js e personagem-dados.js inicializam e preservam xp: 0; o PDF apresenta o valor inicial.",
    observation: "O dado está no contrato e persiste, mas ainda falta exibição integrada e concessão de XP.",
  },
  "INT-03": {
    status: "☑",
    evidence: "personagem-dados.js centraliza leitura, normalização, adição, atualização e exclusão; schemaVersion identifica o formato.",
    observation: "As páginas deixaram de gravar listas concorrentes diretamente no localStorage.",
  },
  "INT-04": {
    status: "☑",
    evidence: "PersonagemDados.buscarSalvoPorId() alimenta ficha, aventura e seleção; fluxos foram retestados após a centralização.",
    observation: "Personagens existentes e novos reabrem sem perda observada nos testes manuais.",
  },
  "INT-07": {
    status: "◐",
    evidence: "Persistência, motor de dados, câmera, HUD, comandos, narrativa e fluxo de combate foram separados em módulos próprios.",
    observation: "A arquitetura avançou, mas ainda restam cálculos repetidos e dependências globais a reduzir.",
  },
  "QA-01": {
    status: "◐",
    evidence: "Fluxos manuais confirmados: criação, salvamento, reabertura, entrada na aventura, iniciativa, ataque, dano, turnos e Segundo Fôlego.",
    observation: "Ainda falta repetir o caminho completo com exportação PDF e todas as classes concluídas.",
  },
  "QA-09": {
    status: "◐",
    evidence: "Criação, Meus Personagens, Ver Personagem e Aventura usam PersonagemDados e a ficha compartilhada; fluxos foram retestados.",
    observation: "A base é comum, mas a paridade de todas as explicações e recursos ainda não está completa.",
  },
  "QA-10": {
    status: "◐",
    evidence: "node --check passou em todos os JavaScripts; scripts locais foram auditados; criação, aventura e combate passaram em testes manuais.",
    observation: "Falta automatizar a validação HTML e o teste de navegador para transformar este item em completo.",
  },
};

for (const sheetName of ["Guerreiro N1", "Mago N1", "Ladino N1", "Clérigo N1"]) {
  const sheet = workbook.worksheets.getItem(sheetName);
  const values = sheet.getUsedRange().values;

  for (const [id, update] of Object.entries(auditUpdates)) {
    const rowIndex = values.findIndex((row) => row[1] === id);

    if (rowIndex < 0) {
      throw new Error(`${id} não encontrado em ${sheetName}`);
    }

    sheet.getCell(rowIndex, 0).values = [[update.status]];
    sheet.getCell(rowIndex, 6).values = [[update.evidence]];
    sheet.getCell(rowIndex, 7).values = [[update.observation]];
  }

  const statusValues = sheet.getRange("A7:A111").values.flat();
  const completed = statusValues.filter((value) => value === "☑").length;
  const partial = statusValues.filter((value) => value === "◐").length;
  const pending = statusValues.filter((value) => value === "☐").length;
  const applicable = completed + partial + pending;

  sheet.getRange("B2").values = [[applicable ? completed / applicable : 0]];
  sheet.getRange("D2").values = [[completed]];
  sheet.getRange("F2").values = [[partial]];
  sheet.getRange("H2").values = [[pending]];
  sheet.getRange("A3").values = [[
    "Auditoria conservadora de 2026-08-18: ☑ completo | ◐ parcialmente funcional | ☐ pendente | N/A fora do recorte. Evidências atualizadas após a reestruturação modular e os testes manuais de criação, aventura e combate.",
  ]];
}

const refreshedMainValues = main.getUsedRange().values;
const statuses = refreshedMainValues.flat().filter((value) => value === "☑" || value === "☐");
const completed = statuses.filter((value) => value === "☑").length;
const total = statuses.length;
const progress = total ? completed / total : 0;
const filledBlocks = Math.round(progress * 20);

main.getRange("A1").values = [[`${completed} / ${total}`]];
main.getRange("A2").values = [["█".repeat(filledBlocks) + "░".repeat(20 - filledBlocks)]];
main.getRange("A3").values = [[progress]];

const history = workbook.worksheets.getItem("Histórico");
history.getRange("A5:D5").copyTo(history.getRange("A7:D7"), "all");
history.getRange("A7:D7").values = [[
  new Date("2026-08-18T00:00:00-03:00"),
  completed,
  progress,
  "Reestruturação concluída: persistência centralizada; motores de dados e câmera separados; tabuleiro, HUD, comandos, narrativa e fluxo de combate modularizados; criação dividida entre regras da ficha e magias. Testes manuais de criação, aventura, combate, modificadores, dados e Segundo Fôlego aprovados.",
]];
history.getRange("A7").setNumberFormat("dd/mm/yyyy");
history.getRange("C7").setNumberFormat("0.00%");
history.getRange("D7").format.wrapText = true;
history.getRange("A7:D7").format.rowHeight = 48;

const keyCheck = await workbook.inspect({
  kind: "table",
  range: "Página1!A1:J20",
  include: "values,formulas",
  tableMaxRows: 20,
  tableMaxCols: 10,
  maxChars: 12000,
});
console.log("KEY_CHECK");
console.log(keyCheck.ndjson);

const errorScan = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
console.log("ERROR_SCAN");
console.log(errorScan.ndjson);

for (const sheetName of [
  "Página1",
  "Histórico",
  "Padrão Nível 1",
  "Guerreiro N1",
  "Mago N1",
  "Ladino N1",
  "Clérigo N1",
]) {
  const preview = await workbook.render({
    sheetName,
    autoCrop: "all",
    scale: 1,
    format: "png",
  });
  const safeName = sheetName.replace(/[\\/:*?"<>|]/g, "_");
  await fs.writeFile(
    `${previewDir}/${safeName}.png`,
    new Uint8Array(await preview.arrayBuffer()),
  );
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);

console.log(JSON.stringify({ outputPath, completed, total, progress }));
