import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "outputs/mvp-checklist-2026-08-24/RPG Solo MVP Checklist - atualizado 2026-08-24.xlsx";
const outputDir = "outputs/mvp-checklist-2026-09-02";
const outputPath = `${outputDir}/RPG Solo MVP Checklist - atualizado 2026-09-02.xlsx`;
const previewDir = ".codex-tmp-mvp-update/preview-after";

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));

const auditNote = "Auditoria conservadora de 2026-09-02: ☑ completo | ◐ parcialmente funcional | ☐ pendente | N/A fora do recorte. Evidências atualizadas após objetivos e resultados de batalha, terreno/visão/cobertura, zona de controle, editor de mapa e planejador tático dos inimigos.";

for (const sheetName of ["Guerreiro N1", "Mago N1", "Ladino N1", "Clérigo N1"]) {
  const sheet = workbook.worksheets.getItem(sheetName);
  sheet.getRange("A3").values = [[auditNote]];

  sheet.getRange("G39:H39").values = [[
    "banco-especies.js; combate.js; movimento de 6 células = 9 m; terreno difícil e bloqueios",
    "O combate usa 6 células para 9 m e o cálculo de rota respeita terreno difícil, bloqueios e cantos inválidos. A conversão canônica de todas as velocidades ainda requer auditoria."
  ]];
  sheet.getRange("G68:H68").values = [[
    "banco-equipamentos.js; combate.js; linha de visão e cobertura direcional",
    "Ataques à distância validam alcance normal/longo, aplicam desvantagem no alcance longo ou sob ameaça adjacente e respeitam cobertura e bloqueio total."
  ]];
  sheet.getRange("G81:H81").values = [[
    "combate.js: movimento, ação, ação bônus, reação; Desengajar e ataques de oportunidade",
    "Movimento, ação, ação bônus e reação por ataque de oportunidade funcionam; ação livre ainda não possui cobertura completa."
  ]];
  sheet.getRange("G83:H83").values = [[
    "combate.js; fluxo-combate-aventura.js; aventuras/a-fuga.js; editor-terreno.js",
    "Alcance, linha de visão, cobertura parcial/3/4 e bloqueio total funcionam para ataques e salvaguardas de Destreza. Aliados, objetos, pontos e áreas ainda não formam um sistema genérico completo."
  ]];
  sheet.getRange("G98:H98").values = [[
    "interface-combate.js; combate.js; modal de confirmação de zona de controle",
    "A interface informa indisponibilidade e chama atenção ao risco de sair da zona de controle; a cobertura de todas as ações e alvos possíveis ainda é parcial."
  ]];
  sheet.getRange("G103:H103").values = [[
    "Testes manuais de alcance normal, longo e insuficiente; movimento, terreno, cobertura e bloqueio",
    "Os limites táticos novos foram exercitados, mas ainda faltam uma matriz sistemática de mínimos/máximos e o limite 20 explícito."
  ]];
  sheet.getRange("G107:H107").values = [[
    "Testes manuais de movimento, reação, alvo, alcance, cobertura, condições e efeitos",
    sheetName === "Guerreiro N1"
      ? "As categorias aplicáveis ao Guerreiro foram ampliadas com reação e zona de controle; concentração continua fora do recorte atual."
      : "Movimento, reação, alvo, alcance, cobertura e condições foram exercitados na base comum; duração e concentração das classes mágicas continuam incompletas."
  ]];
  sheet.getRange("G110:H110").values = [[
    "Checagens de sintaxe e testes manuais do editor, aventura, combate e planejador tático",
    "Os módulos novos passaram nos testes manuais descritos, mas falta uma regressão integral em navegador e integrar o planejador ao turno real."
  ]];
}

const history = workbook.worksheets.getItem("Histórico");
history.getRange("A10:D10").copyFrom(history.getRange("A9:D9"), "all");
history.getRange("A10:D10").values = [[
  new Date("2026-09-02T12:00:00-03:00"),
  223,
  223 / 394,
  "A Fuga permaneceu na macroetapa 3/6. Foram consolidados objetivos e resultados contextuais de batalha, finais centralizados, terreno e visão editáveis, cobertura direcional, alcance, zona de controle e ataques de oportunidade. O planejador tático com cinco perfis foi testado isoladamente; falta integrá-lo ao turno real dos inimigos."
]];
history.getRange("A10").setNumberFormat("dd/mm/yyyy");
history.getRange("C10").setNumberFormat("0.0%");
history.getRange("D10").format.wrapText = true;
history.getRange("A10:D10").format.rowHeightPx = 72;

for (const sheetName of ["Página1", "Histórico", "Padrão Nível 1", "Guerreiro N1", "Mago N1", "Ladino N1", "Clérigo N1"]) {
  const blob = await workbook.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
  const safe = sheetName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase();
  await fs.writeFile(`${previewDir}/${safe}.png`, new Uint8Array(await blob.arrayBuffer()));
}

const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(outputPath);
console.log(outputPath);
