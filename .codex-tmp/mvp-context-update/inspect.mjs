import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "C:/Users/Lenovo/Documents/RPG Solo/outputs/mvp-checklist-2026-09-02/RPG Solo MVP Checklist - atualizado 2026-09-02.xlsx";
const previewDir = "C:/Users/Lenovo/Documents/RPG Solo/.codex-tmp/mvp-context-update/previews-before";

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const summary = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 12000,
  tableMaxRows: 12,
  tableMaxCols: 10,
  tableMaxCellChars: 180,
});
console.log(summary.ndjson);

const matches = await workbook.inspect({
  kind: "match",
  searchTerm: "Guerreiro|Maestria|Próximo|arma|Arremesso",
  options: { useRegex: true, maxResults: 200 },
  maxChars: 18000,
});
console.log(matches.ndjson);

await fs.mkdir(previewDir, { recursive: true });
for (const sheet of workbook.worksheets.items) {
  const preview = await workbook.render({
    sheetName: sheet.name,
    autoCrop: "all",
    scale: 1,
    format: "png",
  });
  const safeName = sheet.name.replace(/[<>:"/\\|?*]/g, "_");
  await fs.writeFile(`${previewDir}/${safeName}.png`, new Uint8Array(await preview.arrayBuffer()));
  console.log(`PREVIEW ${sheet.name}: ${previewDir}/${safeName}.png`);
}
