import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = await FileBlob.load("outputs/mvp-checklist-2026-08-24/RPG Solo MVP Checklist - atualizado 2026-08-24.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);

for (const term of [
  "aventura|combate|terreno|cobertura|visão|oportunidade|inimig|inteligência|objetivo|vitória|derrota|linha de efeito|alcance|movimento",
  "REG-04|REG-06|INT-06|INT-08|INT-09|QA-01|QA-04|QA-08|QA-10",
]) {
  const result = await workbook.inspect({
    kind: "match",
    searchTerm: term,
    options: { useRegex: true, maxResults: 300 },
    maxChars: 30000,
  });
  console.log(result.ndjson);
}

for (const sheetName of ["Guerreiro N1", "Mago N1", "Ladino N1", "Clérigo N1", "Histórico"]) {
  const result = await workbook.inspect({
    kind: "region",
    sheetId: sheetName,
    range: sheetName === "Histórico" ? "A1:D15" : "A100:H114",
    maxChars: 18000,
    tableMaxRows: 30,
    tableMaxCols: 10,
    tableMaxCellChars: 300,
  });
  console.log(result.ndjson);
}
