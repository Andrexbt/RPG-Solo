import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "outputs/mvp-checklist-2026-09-02/RPG Solo MVP Checklist - atualizado 2026-09-02.xlsx";
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

for (const [sheetId, range] of [
  ["Página1", "A1:AJ5"],
  ["Histórico", "A8:D10"],
  ["Guerreiro N1", "A1:H3"],
  ["Guerreiro N1", "A39:H39"],
  ["Guerreiro N1", "A68:H68"],
  ["Guerreiro N1", "A81:H83"],
  ["Guerreiro N1", "A98:H110"],
]) {
  const result = await workbook.inspect({ kind: "region", sheetId, range, maxChars: 9000, tableMaxRows: 20, tableMaxCols: 10, tableMaxCellChars: 500 });
  console.log(result.ndjson);
}

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 200 },
  maxChars: 12000,
});
console.log(errors.ndjson);
