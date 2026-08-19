from pathlib import Path

from pypdf import PdfReader, PdfWriter
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


SOURCE = Path(r"C:\Users\Lenovo\Desktop\RPG Solo\RPG Solo - Fontes do Projeto\rpg-solo-transmissor-de-contexto.pdf")
WORK = Path(r"C:\Users\Lenovo\Documents\RPG Solo\tmp\pdfs")
SUPPLEMENT = WORK / "transmissor-suplemento-3.pdf"
MERGED = WORK / "rpg-solo-transmissor-de-contexto-atualizado.pdf"
OUTPUT = Path(r"C:\Users\Lenovo\Documents\RPG Solo\output\pdf\rpg-solo-transmissor-de-contexto.pdf")

PAGE_W, PAGE_H = A4
INK = colors.HexColor("#2b211b")
ACCENT = colors.HexColor("#b77a2c")
GREEN = colors.HexColor("#55755a")
PAPER = colors.HexColor("#f7f1e4")
TABLE_HEAD = colors.HexColor("#241b17")
TABLE_ALT = colors.HexColor("#efe4cf")
LINE = colors.HexColor("#ccb993")


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.setStrokeColor(ACCENT)
    canvas.setLineWidth(0.6)
    canvas.line(21 * mm, 15 * mm, PAGE_W - 21 * mm, 15 * mm)
    canvas.setFillColor(colors.HexColor("#6f665e"))
    canvas.setFont("Helvetica", 7)
    canvas.drawString(21 * mm, 10 * mm, "RPG Solo - Transmissor de Contexto - Suplemento 3.0")
    canvas.drawRightString(PAGE_W - 21 * mm, 10 * mm, f"Pagina {doc.page + 27}")
    canvas.restoreState()


def styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "Title", parent=base["Title"], fontName="Times-Bold", fontSize=26,
            leading=30, textColor=INK, spaceAfter=8 * mm,
        ),
        "h1": ParagraphStyle(
            "H1", parent=base["Heading1"], fontName="Times-Bold", fontSize=22,
            leading=25, textColor=INK, spaceAfter=5 * mm,
        ),
        "h2": ParagraphStyle(
            "H2", parent=base["Heading2"], fontName="Helvetica-Bold", fontSize=13,
            leading=16, textColor=INK, spaceBefore=3 * mm, spaceAfter=2 * mm,
        ),
        "body": ParagraphStyle(
            "Body", parent=base["BodyText"], fontName="Helvetica", fontSize=9.2,
            leading=13.2, textColor=INK, spaceAfter=2.4 * mm,
        ),
        "bullet": ParagraphStyle(
            "Bullet", parent=base["BodyText"], fontName="Helvetica", fontSize=9.2,
            leading=13.2, leftIndent=5 * mm, firstLineIndent=-3 * mm,
            bulletIndent=0, textColor=INK, spaceAfter=1.8 * mm,
        ),
        "small": ParagraphStyle(
            "Small", parent=base["BodyText"], fontName="Helvetica", fontSize=7.7,
            leading=10.2, textColor=INK,
        ),
        "table_head": ParagraphStyle(
            "TableHead", parent=base["BodyText"], fontName="Helvetica-Bold", fontSize=7.7,
            leading=9.2, textColor=colors.white,
        ),
        "table": ParagraphStyle(
            "Table", parent=base["BodyText"], fontName="Helvetica", fontSize=7.5,
            leading=9.4, textColor=INK,
        ),
        "cover": ParagraphStyle(
            "Cover", parent=base["Title"], fontName="Helvetica-Bold", fontSize=18,
            leading=24, alignment=TA_CENTER, textColor=INK,
        ),
    }


S = styles()


def p(text, style="body"):
    return Paragraph(text, S[style])


def bullet(text):
    return Paragraph(f"•&nbsp;&nbsp;{text}", S["bullet"])


def table(rows, widths, header=True):
    data = []
    for row_idx, row in enumerate(rows):
        style = "table_head" if header and row_idx == 0 else "table"
        data.append([p(cell, style) for cell in row])
    t = Table(data, colWidths=widths, repeatRows=1 if header else 0, hAlign="LEFT")
    commands = [
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.4, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    if header:
        commands.append(("BACKGROUND", (0, 0), (-1, 0), TABLE_HEAD))
    for row_idx in range(1 if header else 0, len(rows)):
        if row_idx % 2 == 0:
            commands.append(("BACKGROUND", (0, row_idx), (-1, row_idx), TABLE_ALT))
    t.setStyle(TableStyle(commands))
    return t


def callout(title, text):
    content = p(f"<b>{title}</b><br/>{text}", "body")
    box = Table([[content]], colWidths=[166 * mm])
    box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#faf7ef")),
        ("BOX", (0, 0), (-1, -1), 0.7, GREEN),
        ("LINEBEFORE", (0, 0), (0, -1), 3, GREEN),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    return box


def build_supplement():
    WORK.mkdir(parents=True, exist_ok=True)
    frame = Frame(21 * mm, 20 * mm, PAGE_W - 42 * mm, PAGE_H - 38 * mm, id="normal")
    doc = BaseDocTemplate(
        str(SUPPLEMENT), pagesize=A4, leftMargin=21 * mm, rightMargin=21 * mm,
        topMargin=18 * mm, bottomMargin=20 * mm,
    )
    doc.addPageTemplates(PageTemplate(id="main", frames=[frame], onPage=footer))

    story = []
    story += [Spacer(1, 22 * mm), p("RPG SOLO", "cover"), Spacer(1, 5 * mm)]
    story += [p("SUPLEMENTO DE STATUS E ROTA DE LANÇAMENTO", "cover"), Spacer(1, 7 * mm)]
    story += [p("Atualização cumulativa do Transmissor de Contexto após a reestruturação modular e a auditoria da checklist do MVP.", "body")]
    story += [Spacer(1, 10 * mm)]
    story += [table([
        ["VERSAO", "DATA-BASE", "BRANCH", "CHECKLIST"],
        ["3.0", "18 de agosto de 2026", "main", "146 de 394 (37,06%)"],
    ], [27 * mm, 48 * mm, 35 * mm, 56 * mm])]
    story += [Spacer(1, 9 * mm)]
    story += [callout(
        "Regra de leitura desta atualização",
        "O percentual formal mede itens concluídos da checklist. Ele não equivale diretamente à maturidade técnica nem à distância de uma versão vertical jogável. O código atual continua sendo a fonte de verdade.",
    )]
    story += [Spacer(1, 8 * mm)]
    story += [p("Fontes desta versão", "h2")]
    story += [bullet("Repositório local na branch main, sincronizado com origin/main em 18 de agosto de 2026.")]
    story += [bullet("Checklist atualizada: RPG Solo MVP Checklist - atualizado 2026-08-18.xlsx.")]
    story += [bullet("Testes manuais confirmados durante a reestruturação e o desenvolvimento do combate.")]
    story += [bullet("Versões 1.0 e 2.0 deste Transmissor, preservadas nas páginas anteriores.")]
    story += [PageBreak()]

    story += [p("26. Panorama atual do desenvolvimento", "h1")]
    story += [p("O projeto deixou de ser apenas um protótipo técnico e passou a constituir um produto jogável incompleto. A base de criação, aventura, dados e combate existe; o trabalho principal agora é fechar o ciclo de jogo, persistir consequências e completar o conteúdo ofertado.")]
    story += [p("Progresso e maturidade", "h2")]
    story += [table([
        ["Medida", "Estimativa", "Interpretação"],
        ["Checklist formal", "37,06%", "146 de 394 itens concluídos com evidência."],
        ["Fundação técnica", "65% a 70%", "Estimativa editorial: arquitetura e sistemas-base já estão estabelecidos."],
        ["Vertical jogável com Guerreiro", "70% a 80%", "Estimativa editorial: falta principalmente fechar persistência, recursos e aventura."],
        ["MVP formal com quatro classes", "40% a 50%", "Estimativa editorial: Mago, Ladino e Clérigo ainda ampliam muito o escopo."],
    ], [53 * mm, 31 * mm, 82 * mm])]
    story += [p("Entregas confirmadas desde o suplemento anterior", "h2")]
    for item in [
        "Câmera, mapa, grid e tokens foram estabilizados no padrão de batalha adotado; pan, zoom e limites funcionam no teste atual.",
        "A caixa de dados voltou a mostrar modificadores e resultados e permite excluir lançamentos com o botão direito sem abrir o menu do navegador.",
        "Iniciativa, ataques, dano, crítico, turnos, vitória, derrota e Segundo Fôlego foram testados manualmente.",
        "Persistência de personagens foi centralizada em personagem-dados.js.",
        "Dados, câmera, renderização, HUD, comandos, narrativa, fluxo de combate, regras de criação e magias foram separados em módulos próprios.",
        "A correção do ataque narrativo voltou a comparar corretamente o resultado com a CA do alvo.",
        "A sintaxe dos arquivos JavaScript foi verificada após a reestruturação.",
    ]:
        story += [bullet(item)]
    story += [p("Estado do repositório", "h2")]
    story += [p("A branch main está alinhada com origin/main. O commit mais recente observado é “Finaliza reestruturacao dos modulos de aventura e personagem”. As pastas de saída e arquivos temporários locais não pertencem ao produto.")]
    story += [PageBreak()]

    story += [p("27. Bloqueios reais para lançamento", "h1")]
    story += [p("Os bloqueios principais deixaram de ser visuais. Eles estão no fechamento do ciclo de jogo e na cobertura funcional do recorte prometido.")]
    story += [table([
        ["Prioridade", "Bloqueio", "Critério para considerar resolvido"],
        ["1", "Persistência pós-combate", "PV, recursos, condições, recompensas e XP retornam ao personagem e permanecem após recarregar."],
        ["2", "Transição combate-aventura", "Vitória e derrota conduzem à cena correta, atualizam memórias e não duplicam consequências."],
        ["3", "Guerreiro nível 1", "Segundo Fôlego, usos, recuperação, equipamentos, armas, maestrias e talentos ofertados funcionam juntos."],
        ["4", "A Fuga", "A aventura pode ser concluída do início ao fim, incluindo caminhos, testes, batalhas e encerramento."],
        ["5", "Classes restantes", "Mago, Ladino e Clérigo nível 1 atendem aos critérios completos do recorte ofertado."],
        ["6", "Qualidade pública", "Responsividade, acessibilidade, revisão editorial, testes finais e licenças visuais estão documentados."],
    ], [17 * mm, 53 * mm, 96 * mm])]
    story += [p("Sistemas ainda incompletos", "h2")]
    for item in [
        "Motor genérico de efeitos: alcance, área, duração, condições e cobertura ampla de gatilhos.",
        "Economia de ações: reação, ação livre, recursos e sincronização completa entre interface e estado.",
        "Armas, maestrias, talentos e habilidades: cobertura completa apenas do que for oferecido ao jogador.",
        "Magias: consumo de espaços, concentração, ataque, salvaguarda, cura, duração e área.",
        "Progressão: conceder 100 XP uma única vez e preparar o estado para evolução futura.",
        "Espécies e criação: concluir todos os traços aplicáveis ao recorte exibido.",
        "Automação de testes: ainda não há uma bateria suficiente para substituir a validação manual integral.",
    ]:
        story += [bullet(item)]
    story += [callout(
        "Bloqueio de distribuição",
        "As origens, autorias e licenças dos recursos visuais precisam ser registradas antes de uma distribuição pública ampla. Isso não impede testes privados ou uma Alpha fechada.",
    )]
    story += [PageBreak()]

    story += [p("28. Estratégia de lançamento em duas metas", "h1")]
    story += [p("A recomendação atual é não esperar pelas quatro classes para validar o produto. Primeiro deve existir uma experiência vertical pequena, completa e persistente. Depois essa base será ampliada até o MVP formal definido pela checklist.")]
    story += [p("Meta A - Alpha vertical jogável", "h2")]
    for item in [
        "Criação e salvamento de personagem.",
        "Somente Guerreiro nível 1; opções incompletas ficam escondidas ou claramente indisponíveis.",
        "A Fuga completa, com pelo menos um combate integrado.",
        "Vitória, derrota, retorno à narrativa e encerramento da aventura.",
        "PV, recursos, memórias, recompensas e 100 XP persistidos.",
        "Fechar e reabrir sem perder progresso nem duplicar recompensas.",
        "Uso integral sem console ou comandos manuais.",
    ]:
        story += [bullet(item)]
    story += [p("Meta B - MVP formal", "h2")]
    for item in [
        "Mago, Ladino e Clérigo nível 1 completos.",
        "Conjuração básica, áreas, condições e concentração necessárias ao conteúdo ofertado.",
        "Motor de efeitos e economia de ações ampliados.",
        "A Fuga testada com todas as classes disponíveis.",
        "Rodada final de acessibilidade, responsividade, conteúdo, testes e licenças.",
    ]:
        story += [bullet(item)]
    story += [callout(
        "Decisão recomendada",
        "A Alpha vertical deve ser tratada como instrumento de validação e teste, não como substituta silenciosa do MVP formal. O escopo formal continua contendo as quatro classes enquanto a checklist não for alterada.",
    )]
    story += [p("Por que essa ordem", "h2")]
    story += [p("Fechar uma aventura com uma classe valida criação, ficha, narrativa, dados, combate, persistência e retorno em um único percurso. Construir primeiro todas as classes aumentaria o volume de regras antes de provar que o ciclo central funciona como produto.")]
    story += [PageBreak()]

    story += [p("29. Rota recomendada de desenvolvimento", "h1")]
    story += [table([
        ["Etapa", "Objetivo", "Saída verificável"],
        ["1/6", "Fechar o contrato aventura-combate", "Definir e persistir PV, recursos, condições, resultado, recompensa, XP, próxima cena e memórias."],
        ["2/6", "Concluir Guerreiro nível 1", "Tudo o que a interface oferece ao Guerreiro funciona e persiste."],
        ["3/6", "Terminar A Fuga", "Todos os caminhos necessários, combates, vitória, derrota e encerramento podem ser jogados."],
        ["4/6", "Salvar e retomar", "Reabrir durante ou após a aventura preserva estado e não duplica consequências."],
        ["5/6", "Estabilizar a Alpha", "Bateria manual formal, correções de fluxo, textos, responsividade e opções incompletas ocultas."],
        ["6/6", "Expandir ao MVP formal", "Implementar e testar Mago, Ladino e Clérigo sobre a base validada."],
    ], [19 * mm, 56 * mm, 91 * mm])]
    story += [p("Próxima intervenção - etapa 1/6", "h2")]
    story += [p("Antes de escrever muitas cenas novas ou retomar mudanças visuais, mapear o estado que entra no combate, o estado que muda durante o encontro e o estado que precisa retornar à aventura. A implementação deve ter uma única função de consolidação, idempotente, para impedir recompensas e XP duplicados.")]
    story += [p("Critérios de aceitação da etapa 1/6", "h2")]
    for item in [
        "A vitória retorna à cena configurada e registra a memória correta.",
        "A derrota segue o destino configurado sem preservar um estado impossível.",
        "PV e recursos usados no combate aparecem corretamente na ficha após o retorno.",
        "100 XP é concedido uma única vez quando aplicável.",
        "Recarregar a página não reaplica o resultado do combate.",
        "O mesmo contrato funciona para combates futuros sem lógica exclusiva de A Fuga.",
    ]:
        story += [bullet(item)]
    story += [p("Orientação para conteúdo", "h2")]
    story += [p("A escrita de A Fuga deve ser retomada na etapa 3/6. Pequenos trechos podem ser usados antes disso como casos de teste, mas a expansão narrativa principal deve esperar o contrato de persistência e retorno, para evitar retrabalho.")]
    story += [PageBreak()]

    story += [p("30. Registro consolidado e retomada", "h1")]
    story += [table([
        ["Campo", "Registro"],
        ["Data-base", "18 de agosto de 2026"],
        ["Frente concluída", "Reestruturação modular de personagem, dados, câmera, combate, aventura e criação."],
        ["Testes confirmados", "Criação, salvamento, entrada na aventura, iniciativa, ataque, dano, turnos, Segundo Fôlego, modificadores, resultado de dados, exclusão por botão direito, pan e zoom."],
        ["Checklist", "146 de 394 itens concluídos (37,06%)."],
        ["Git", "main alinhada com origin/main; commit observado: 66cd3c1."],
        ["Decisão", "Priorizar Alpha vertical com Guerreiro antes da expansão para quatro classes."],
        ["Próximo passo", "Etapa 1/6: contrato e persistência do ciclo aventura-combate."],
    ], [44 * mm, 122 * mm])]
    story += [p("Resumo executivo para a próxima conversa", "h2")]
    story += [callout(
        "Onde estamos",
        "A base técnica está madura, mas o produto ainda não fecha de forma persistente o ciclo criação - aventura - combate - consequência - retomada. A prioridade não é um novo redesenho visual nem ampliar imediatamente as classes; é concluir esse ciclo com o Guerreiro e terminar A Fuga como Alpha vertical.",
    )]
    story += [Spacer(1, 5 * mm)]
    for item in [
        "Ler este suplemento junto às versões anteriores, mas usar código e checklist atuais como fonte de verdade.",
        "Não reverter a modularização recente nem recriar responsabilidades nos antigos arquivos coordenadores.",
        "Manter dados descritivos, motores interpretativos, interfaces de apresentação e persistência separados.",
        "Tratar a próxima tarefa como 1/6 até que todos os critérios de aceitação do contrato aventura-combate estejam confirmados.",
        "Depois de cada etapa, atualizar checklist, testes confirmados, commit e este registro cumulativo.",
    ]:
        story += [bullet(item)]
    story += [Spacer(1, 9 * mm), p("FIM DO SUPLEMENTO 3.0", "cover")]

    doc.build(story)


def merge():
    writer = PdfWriter()
    for path in (SOURCE, SUPPLEMENT):
        reader = PdfReader(str(path))
        for page in reader.pages:
            writer.add_page(page)
    MERGED.parent.mkdir(parents=True, exist_ok=True)
    with MERGED.open("wb") as stream:
        writer.write(stream)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_bytes(MERGED.read_bytes())


if __name__ == "__main__":
    build_supplement()
    merge()
    print(OUTPUT)
