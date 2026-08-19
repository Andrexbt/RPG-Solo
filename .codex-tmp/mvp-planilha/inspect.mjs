import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "C:/Users/Lenovo/Desktop/RPG Solo/RPG Solo - Fontes do Projeto/RPG Solo MVP Checklist - personagens nivel 1 auditados.xlsx";
const previewDir = "C:/Users/Lenovo/Documents/RPG Solo/.codex-tmp/mvp-planilha/previews";

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const overview = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 20000,
  tableMaxRows: 12,
  tableMaxCols: 12,
  tableMaxCellChars: 160,
});

console.log("OVERVIEW");
console.log(overview.ndjson);

const sheetInspection = await workbook.inspect({
  kind: "sheet",
  include: "id,name",
  maxChars: 10000,
});

const sheets = sheetInspection.ndjson
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line))
  .filter((item) => item.kind === "sheet");

for (const sheetInfo of sheets) {
  const sheetName = sheetInfo.name;
  const region = await workbook.inspect({
    kind: "region",
    sheetId: sheetName,
    range: "A1:Z200",
    maxChars: 30000,
    tableMaxRows: 200,
    tableMaxCols: 26,
    tableMaxCellChars: 240,
  });

  console.log(`REGION:${sheetName}`);
  console.log(region.ndjson);

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
