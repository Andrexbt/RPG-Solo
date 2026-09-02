import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "../outputs/mvp-checklist-2026-08-24/RPG Solo MVP Checklist - atualizado 2026-08-24.xlsx";
const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const overview = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 12000,
  tableMaxRows: 12,
  tableMaxCols: 12,
  tableMaxCellChars: 140,
});

console.log(overview.ndjson);

for (const sheet of workbook.worksheets.items) {
  const used = sheet.getUsedRange();
  console.log(`SHEET ${sheet.name} USED ${used?.address ?? "none"}`);
  if (used) {
    const region = await workbook.inspect({
      kind: "region",
      sheetId: sheet.name,
      range: used.address.split("!").pop(),
      maxChars: 30000,
      tableMaxRows: 250,
      tableMaxCols: 16,
      tableMaxCellChars: 220,
    });
    console.log(region.ndjson);
  }
}

await fs.mkdir("preview-before", { recursive: true });
for (const sheet of workbook.worksheets.items) {
  const preview = await workbook.render({
    sheetName: sheet.name,
    autoCrop: "all",
    scale: 1,
    format: "png",
  });
  await fs.writeFile(
    `preview-before/${sheet.name.replaceAll(/[\\/:*?\"<>|]/g, "_")}.png`,
    new Uint8Array(await preview.arrayBuffer()),
  );
}
