import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "C:/Users/Lenovo/Documents/RPG Solo/outputs/mvp-checklist-2026-09-02/RPG Solo MVP Checklist - atualizado 2026-09-02.xlsx";
const outputDir = "C:/Users/Lenovo/Documents/RPG Solo/outputs/mvp-checklist-2026-09-09";
const outputPath = `${outputDir}/RPG Solo MVP Checklist - atualizado 2026-09-09.xlsx`;
const previewDir = "C:/Users/Lenovo/Documents/RPG Solo/.codex-tmp/mvp-context-update/previews-after";

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));

const guerreiro = workbook.worksheets.getItem("Guerreiro N1");
guerreiro.getRange("A3").values = [[
  "Retomada em 09/09/2026. Próximo passo: reauditar o Guerreiro nível 1 no Laboratório DEV contra as regras oficiais de D&D 2024. O status histórico não equivale ao novo aceite. Começar por Maestrias em Armas e exigir banco, criação, ficha, regra, interface, persistência e testes automatizados.",
]];
guerreiro.getRange("A3:H3").format.wrapText = true;
guerreiro.getRange("A3:H3").format.rowHeight = 42;

const historico = workbook.worksheets.getItem("Histórico");
historico.getRange("A11:D11").copyFrom(
  historico.getRange("A10:D10"),
  "all",
);
historico.getRange("A11:D11").values = [[
  new Date("2026-09-09T12:00:00-03:00"),
  223,
  0.565989847715736,
  "Contagem formal preservada. A produção visual das armas foi encerrada e o Guerreiro nível 1 voltou para reauditoria integral após mudanças em combate, equipamentos, arremessos e interface. Próximo passo: criar a auditoria automatizada no Laboratório DEV e começar pela comprovação das Maestrias em Armas.",
]];
historico.getRange("A11").setNumberFormat("dd/mm/yyyy");
historico.getRange("C11").setNumberFormat("0.00%");
historico.getRange("D11").format.wrapText = true;
historico.getRange("A11:D11").format.rowHeight = 54;

workbook.recalculate();

const guerreiroCheck = await workbook.inspect({
  kind: "table",
  range: "'Guerreiro N1'!A1:H8",
  include: "values,formulas",
  tableMaxRows: 8,
  tableMaxCols: 8,
  maxChars: 8000,
});
console.log(guerreiroCheck.ndjson);

const historicoCheck = await workbook.inspect({
  kind: "table",
  range: "'Histórico'!A8:D11",
  include: "values,formulas",
  tableMaxRows: 6,
  tableMaxCols: 4,
  maxChars: 8000,
});
console.log(historicoCheck.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

await fs.mkdir(previewDir, { recursive: true });
for (const sheetName of ["Guerreiro N1", "Histórico"]) {
  const preview = await workbook.render({
    sheetName,
    autoCrop: "all",
    scale: 1,
    format: "png",
  });
  await fs.writeFile(
    `${previewDir}/${sheetName}.png`,
    new Uint8Array(await preview.arrayBuffer()),
  );
}

await fs.mkdir(outputDir, { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(`OUTPUT ${outputPath}`);
