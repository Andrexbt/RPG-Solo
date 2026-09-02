import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const oldPath = "outputs/mvp-checklist-2026-08-24/RPG Solo MVP Checklist - atualizado 2026-08-24.xlsx";
const newPath = "outputs/mvp-checklist-2026-09-02/RPG Solo MVP Checklist - atualizado 2026-09-02.xlsx";
const previewDir = ".codex-tmp-mvp-update/preview-after";
const oldBook = await SpreadsheetFile.importXlsx(await FileBlob.load(oldPath));
const newBook = await SpreadsheetFile.importXlsx(await FileBlob.load(newPath));

for (const sheetName of ["Guerreiro N1", "Mago N1", "Ladino N1", "Clérigo N1"]) {
  const oldSheet = oldBook.worksheets.getItem(sheetName);
  const newSheet = newBook.worksheets.getItem(sheetName);
  newSheet.getRange("G110:H110").copyFrom(oldSheet.getRange("G110:H110"), "all");
  newSheet.getRange("G109:H109").values = [[
    "Checagens de sintaxe e testes manuais do editor, aventura, combate e planejador tático",
    "Os módulos novos passaram nos testes manuais descritos, mas falta uma regressão integral em navegador e integrar o planejador ao turno real."
  ]];
  const blob = await newBook.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
  const safe = sheetName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase();
  await fs.writeFile(`${previewDir}/${safe}.png`, new Uint8Array(await blob.arrayBuffer()));
}

const exported = await SpreadsheetFile.exportXlsx(newBook);
await exported.save(newPath);
