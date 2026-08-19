import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "C:/Users/Lenovo/Desktop/RPG Solo/RPG Solo - Fontes do Projeto/RPG Solo MVP Checklist - personagens nivel 1 auditados.xlsx";
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));

for (const name of ["Guerreiro N1", "Mago N1", "Ladino N1", "Clérigo N1"]) {
  const sheet = workbook.worksheets.getItem(name);
  const values = sheet.getUsedRange().values;
  console.log(`SHEET:${name}`);
  values.forEach((row, index) => {
    console.log(`${index + 1}\t${row.map((value) => value ?? "").join("\t")}`);
  });
}
