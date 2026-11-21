"""Build the Lastrofit visual identity presentation as a vector PDF."""

from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import simpleSplit


ROOT = Path(__file__).resolve().parents[1]
FONT_DIR = ROOT / "brand" / "fonts"
OUT = ROOT / "output" / "pdf" / "Lastrofit_Brandbook.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

for name, file in [
    ("Manrope", "Manrope-regular.ttf"),
    ("ManropeMed", "Manrope-medium.ttf"),
    ("ManropeSemi", "Manrope-semibold.ttf"),
    ("ManropeBold", "Manrope-bold.ttf"),
    ("Barlow", "BarlowCondensed-Regular.ttf"),
    ("BarlowBold", "BarlowCondensed-Bold.ttf"),
]:
    pdfmetrics.registerFont(TTFont(name, str(FONT_DIR / file)))

W, H = 960, 540
PAPER = "#F6F4EE"
WHITE = "#FFFFFF"
INK = "#17212C"
MUTED = "#4C5A66"
BLUE = "#2344C6"
BLUE_DARK = "#142879"
BLUE_PALE = "#EAEFF7"
CORAL = "#FF7152"
CORAL_PALE = "#FFE2D8"
LIME = "#D7F069"
BORDER = "#B9C4D0"
GREEN = "#1D6C50"
WARN = "#835000"
RED = "#B42335"

c = canvas.Canvas(str(OUT), pagesize=(W, H), pageCompression=1)
c.setTitle("Lastrofit - Brandbook visual | Direcao Tracao")
c.setAuthor("Lastrofit / Codex")
c.setSubject("Identidade visual, logotipo, cores, tipografia e aplicacoes conceituais")


def color(v):
    return HexColor(v)


def box(x, y, w, h, fill, radius=0, stroke=None, sw=1):
    c.setFillColor(color(fill))
    if stroke:
        c.setStrokeColor(color(stroke))
        c.setLineWidth(sw)
    else:
        c.setStrokeColor(color(fill))
    if radius:
        c.roundRect(x, H-y-h, w, h, radius, fill=1, stroke=int(bool(stroke)))
    else:
        c.rect(x, H-y-h, w, h, fill=1, stroke=int(bool(stroke)))


def line(x1, y1, x2, y2, stroke, sw=1):
    c.setStrokeColor(color(stroke))
    c.setLineWidth(sw)
    c.line(x1, H-y1, x2, H-y2)


def circle(x, y, r, fill, stroke=None, sw=1):
    c.setFillColor(color(fill))
    c.setStrokeColor(color(stroke or fill))
    c.setLineWidth(sw)
    c.circle(x, H-y, r, fill=1, stroke=int(bool(stroke)))


def text(x, y, s, font="Manrope", size=12, fill=INK):
    c.setFont(font, size)
    c.setFillColor(color(fill))
    c.drawString(x, H-y-size, s)


def right_text(x, y, s, font="Manrope", size=12, fill=INK):
    c.setFont(font, size)
    c.setFillColor(color(fill))
    c.drawRightString(x, H-y-size, s)


def para(x, y, content, width, font="Manrope", size=12, leading=18, fill=INK):
    yy = y
    for paragraph in content.split("\n"):
        for row in simpleSplit(paragraph, font, size, width):
            text(x, yy, row, font, size, fill)
            yy += leading
        if paragraph == "":
            yy += leading / 2
    return yy


def label(x, y, s, fill=BLUE):
    text(x, y, s.upper(), "ManropeBold", 9, fill)


def title(x, y, s, size=48, fill=INK):
    text(x, y, s, "BarlowBold", size, fill)


def mark(x, y, size, fill=BLUE):
    # L: vertical anchor, horizontal base, raised terminal.
    points = [(12, 10), (34, 10), (34, 58), (64, 58),
              (64, 48), (84, 48), (84, 78), (12, 78)]
    p = c.beginPath()
    for i, (px, py) in enumerate(points):
        ax, ay = x + px*size/96, H-(y + py*size/96)
        if i == 0:
            p.moveTo(ax, ay)
        else:
            p.lineTo(ax, ay)
    p.close()
    c.setFillColor(color(fill))
    c.drawPath(p, fill=1, stroke=0)


def logo(x, y, size=45, dark=False, mono=False):
    fg = WHITE if dark else INK
    accent = WHITE if mono and dark else (INK if mono else BLUE)
    mark(x, y, size, accent)
    tx = x + size*1.08
    ty = y + size*0.18
    fs = size*0.50
    text(tx, ty, "lastro", "ManropeBold", fs, fg)
    tw = pdfmetrics.stringWidth("lastro", "ManropeBold", fs)
    text(tx+tw-0.5, ty, "fit", "ManropeBold", fs, accent)


def base(page, section, dark=False):
    box(0, 0, W, H, BLUE_DARK if dark else PAPER)
    line(50, 42, 910, 42, "#596BB7" if dark else BORDER, 0.7)
    label(50, 21, "LASTROFIT / IDENTIDADE VISUAL", WHITE if dark else BLUE)
    right_text(910, 21, section.upper(), "ManropeBold", 9, WHITE if dark else MUTED)
    line(50, 501, 910, 501, "#596BB7" if dark else BORDER, 0.7)
    text(50, 511, "DIREÇÃO TRAÇÃO  ·  NOVEMBRO 2026", "ManropeMed", 8, WHITE if dark else MUTED)
    right_text(910, 511, f"{page:02d} / 12", "ManropeMed", 8, WHITE if dark else MUTED)


def next_page():
    c.showPage()


# 01 - cover
box(0, 0, W, H, BLUE)
box(688, 0, 272, H, BLUE_DARK)
mark(47, 48, 133, WHITE)
text(50, 205, "lastrofit", "ManropeBold", 78, WHITE)
title(50, 304, "UMA BASE PARA SEGUIR", 54, WHITE)
title(50, 356, "EM MOVIMENTO.", 54, WHITE)
text(52, 464, "BRANDBOOK VISUAL  /  CONCEITO TRAÇÃO", "ManropeBold", 12, WHITE)
text(52, 491, "Identidade, sistema e aplicações conceituais", "Manrope", 11, WHITE)
line(724, 92, 878, 92, CORAL, 11)
line(724, 170, 810, 170, WHITE, 11)
line(810, 170, 810, 138, WHITE, 11)
circle(810, 138, 12, LIME)
line(724, 250, 878, 250, CORAL, 11)
line(724, 330, 810, 330, WHITE, 11)
line(810, 330, 810, 298, WHITE, 11)
circle(810, 298, 12, LIME)
text(725, 435, "BASE", "BarlowBold", 26, WHITE)
text(725, 466, "AVANÇO", "BarlowBold", 26, WHITE)
next_page()

# 02 - strategy
base(2, "Estratégia")
label(50, 70, "01 / IDEIA DE MARCA")
title(50, 88, "Movimento com lastro.", 52)
para(50, 155, "O Lastrofit ajuda pessoas a transformar intenção em uma rotina de treinos que consigam organizar, acompanhar e manter.", 470, "ManropeMed", 17, 25)
box(50, 280, 474, 155, WHITE, 12)
label(72, 303, "PROPOSTA DE VALOR")
para(72, 327, "Organize sua semana de treinos, veja seu caminho e avance no seu ritmo.", 430, "ManropeBold", 21, 31)
para(72, 397, "Clareza de ferramenta. Energia de marca esportiva. Acolhimento para diferentes níveis.", 420, "Manrope", 10.5, 15, MUTED)
box(565, 80, 345, 355, BLUE, 17)
label(592, 106, "TRÊS PRINCÍPIOS", WHITE)
for yy, num, head, body in [
    (143, "01", "COMEÇAR", "O primeiro passo precisa ser claro."),
    (240, "02", "SEGUIR", "A semana dá estrutura ao movimento."),
    (337, "03", "PERCEBER", "O avanço é visível e honesto."),
]:
    text(592, yy, num, "BarlowBold", 33, CORAL)
    text(655, yy+4, head, "BarlowBold", 25, WHITE)
    para(655, yy+41, body, 217, "Manrope", 10.5, 14, WHITE)
next_page()

# 03 - symbol construction
base(3, "Símbolo")
label(50, 70, "02 / SIGNO CENTRAL")
title(50, 87, "O L de avanço", 52)
para(50, 150, "Uma haste que ancora. Uma base que percorre. Um terminal que sobe um módulo e sugere o próximo passo.", 350, "Manrope", 14, 21)
box(50, 277, 350, 165, WHITE, 12)
label(72, 300, "CONSTRUÇÃO")
para(72, 325, "Malha de 12 × 12 módulos. Traço largo, espaço interno aberto e geometria legível em 16, 24 e 32 px. O símbolo não depende de gradiente nem de detalhes finos.", 305, "Manrope", 11.5, 19)
box(440, 80, 470, 365, WHITE, 16)
for xx in range(465, 896, 28):
    line(xx, 97, xx, 426, BLUE_PALE, 0.6)
for yy in range(97, 427, 28):
    line(465, yy, 895, yy, BLUE_PALE, 0.6)
mark(532, 111, 250, BLUE)
line(520, 389, 836, 389, CORAL, 2)
circle(836, 389, 4, CORAL)
text(536, 401, "ÂNCORA", "ManropeBold", 9, MUTED)
right_text(838, 401, "PRÓXIMO PASSO", "ManropeBold", 9, MUTED)
next_page()

# 04 - logo variations
base(4, "Logotipo")
label(50, 69, "03 / SISTEMA DE ASSINATURAS")
title(50, 87, "Reconhecível em qualquer escala", 46)
box(50, 157, 410, 126, WHITE, 12)
label(70, 172, "PRINCIPAL")
logo(78, 202, 70)
box(480, 157, 430, 126, BLUE, 12)
label(500, 172, "NEGATIVA", WHITE)
logo(510, 202, 70, dark=True, mono=True)
box(50, 299, 270, 135, INK, 12)
label(68, 317, "ÍCONE / APP", WHITE)
mark(152, 328, 93, WHITE)
box(338, 299, 271, 135, WHITE, 12)
label(356, 317, "MONOCROMÁTICA")
logo(365, 359, 52, mono=True)
box(627, 299, 283, 135, BLUE_PALE, 12)
label(646, 317, "ÁREA DE RESPIRO")
box(660, 350, 216, 55, BLUE_PALE, 0, BLUE, 0.8)
logo(677, 359, 43)
text(50, 453, "Mínimos propostos: símbolo 16 px; assinatura 120 px. Validar em protótipo e após checagem de similaridade.", "Manrope", 10, MUTED)
next_page()

# 05 - color
base(5, "Cores")
label(50, 69, "04 / PALETA")
title(50, 87, "Energia com direção", 49)
swatches = [
    (50, 153, 250, 168, BLUE, "AZUL LASTRO", "#2344C6", WHITE),
    (312, 153, 171, 168, CORAL, "IMPULSO", "#FF7152", INK),
    (495, 153, 171, 168, LIME, "ENERGIA", "#D7F069", INK),
    (678, 153, 232, 168, INK, "TINTA", "#17212C", WHITE),
    (50, 333, 250, 102, PAPER, "PAPEL", "#F6F4EE", INK),
    (312, 333, 171, 102, WHITE, "SUPERFÍCIE", "#FFFFFF", INK),
    (495, 333, 171, 102, BLUE_PALE, "APOIO", "#EAEFF7", INK),
    (678, 333, 232, 102, CORAL_PALE, "ACENTO SUAVE", "#FFE2D8", INK),
]
for x,y,w,h,fill,name,code,fg in swatches:
    box(x,y,w,h,fill,10, BORDER if fill in (WHITE,PAPER) else None)
    text(x+17,y+16,name,"ManropeBold",9,fg)
    text(x+17,y+h-38,code,"ManropeBold",14,fg)
text(50, 454, "Uso: superfícies claras predominam. Azul orienta a ação. Coral e lima marcam momentos, sem competir com o conteúdo.", "Manrope", 10, MUTED)
next_page()

# 06 - color accessibility & states
base(6, "Cores e estados")
label(50, 69, "05 / APLICAÇÃO FUNCIONAL")
title(50, 87, "Contraste que sustenta o uso", 47)
cards = [
    (50, 158, BLUE, WHITE, "PRIMÁRIO", "7,74:1", "Branco sobre azul"),
    (273, 158, PAPER, INK, "LEITURA", "14,80:1", "Tinta sobre papel"),
    (496, 158, CORAL, INK, "ACENTO", "6,00:1", "Tinta sobre coral"),
    (719, 158, WHITE, MUTED, "SECUNDÁRIO", "7,09:1", "Cinza sobre branco"),
]
for x,y,bg,fg,name,ratio,desc in cards:
    box(x,y,191,168,bg,12, BORDER if bg in (PAPER,WHITE) else None)
    text(x+17,y+18,name,"ManropeBold",9,fg)
    text(x+17,y+51,ratio,"BarlowBold",37,fg)
    para(x+17,y+114,desc,155,"ManropeMed",10.5,15,fg)
label(50, 353, "ESTADOS SEMÂNTICOS")
for x, cc, name in [(50,GREEN,"SUCESSO"),(271,WARN,"ATENÇÃO"),(492,RED,"ERRO"),(713,BLUE,"INFORMAÇÃO")]:
    box(x,381,197,55,WHITE,9, BORDER)
    box(x,381,9,55,cc)
    text(x+24,399,name,"ManropeBold",11,cc)
para(50, 450, "WCAG 2.2 AA: textos comuns ≥ 4,5:1; textos grandes e informações não textuais essenciais ≥ 3:1. Coral não serve como texto sobre branco.", 860, "Manrope", 9.5, 14, MUTED)
next_page()

# 07 - typography
base(7, "Tipografia")
label(50, 69, "06 / SISTEMA TIPOGRÁFICO")
title(50, 87, "Força na mensagem. Calma na leitura.", 43)
box(50, 155, 528, 290, WHITE, 12)
label(74, 178, "BARLOW CONDENSED / TÍTULOS")
text(72, 198, "PRÓXIMO PASSO", "BarlowBold", 57, BLUE)
text(74, 271, "Aa Bb Cc 0123456789", "Barlow", 31, INK)
line(74, 325, 554, 325, BORDER)
text(74, 342, "H1 72/74   H2 56/60   H3 40/44", "ManropeSemi", 13, INK)
para(74, 377, "Títulos em caixa de frase. Caixa alta apenas para rótulos curtos e peças de campanha.", 450, "Manrope", 10.5, 17, MUTED)
box(595, 155, 315, 290, BLUE_PALE, 12)
label(618, 178, "MANROPE / INTERFACE")
text(618, 205, "Sua semana", "ManropeBold", 27, INK)
para(618, 251, "Planeje com clareza. Acompanhe o que foi feito e encontre o próximo passo sem excesso de informação.", 260, "Manrope", 13, 21)
line(618, 348, 885, 348, BORDER)
text(618, 365, "16/26 corpo  ·  14/20 label", "ManropeSemi", 11, INK)
text(618, 391, "01  02  03  04", "ManropeBold", 20, BLUE)
text(50, 459, "Fontes sob SIL Open Font License. Amostras no PDF usam os arquivos das famílias propostas.", "Manrope", 10, MUTED)
next_page()

# 08 - visual language
base(8, "Linguagem gráfica")
label(50, 69, "07 / VOCABULÁRIO VISUAL")
title(50, 87, "Um percurso, muitos contextos", 48)
box(50, 160, 550, 266, WHITE, 14)
label(72, 180, "MARCOS DE PROGRESSO")
line(100, 270, 480, 270, BLUE, 9)
circle(100,270,13,BLUE)
circle(280,270,13,CORAL)
circle(480,270,13,LIME,BLUE,2)
text(75,312,"COMEÇAR","BarlowBold",24,INK)
text(252,312,"SEGUIR","BarlowBold",24,INK)
text(445,312,"VER","BarlowBold",24,INK)
para(73, 365, "Linhas e marcos só aparecem quando representam etapas, sequência ou posição real.", 482, "Manrope", 11, 18, MUTED)
box(620, 160, 290, 80, BLUE, 10)
label(640, 177, "RAIOS")
text(640, 196, "08  /  12  /  20 px", "ManropeBold", 20, WHITE)
box(620, 251, 290, 80, CORAL_PALE, 10)
label(640, 268, "ESPAÇAMENTOS")
text(640, 287, "04  08  12  16  24  32", "ManropeBold", 15, INK)
box(620, 342, 290, 84, BLUE_PALE, 10)
label(640, 359, "MOVIMENTO")
text(640, 378, "120 / 180 / 240 ms", "ManropeBold", 17, INK)
text(50, 450, "Ícones simples; fotografia de pessoas reais; formas úteis; sombra apenas para sobreposição. Sem brilho ou gradiente decorativo.", "Manrope", 10, MUTED)
next_page()

# 09 - desktop landing concept
base(9, "Landing page")
label(50, 68, "08 / APLICAÇÃO CONCEITUAL")
title(50, 86, "Landing page", 49)
box(50, 150, 860, 302, WHITE, 11, BORDER)
logo(72, 164, 34)
right_text(885, 173, "Entrar", "ManropeSemi", 10, BLUE)
line(69, 208, 891, 208, BLUE_PALE)
label(75, 232, "TREINO COM DIREÇÃO")
text(74, 252, "TREINAR COMEÇA", "BarlowBold", 45, INK)
text(74, 298, "COM UM PASSO POSSÍVEL.", "BarlowBold", 40, BLUE)
para(77, 359, "Organize sua jornada e encontre um caminho claro para a sua rotina.", 365, "Manrope", 10.5, 16, MUTED)
box(76, 408, 139, 31, BLUE, 7)
text(91, 415, "Criar minha conta  →", "ManropeBold", 9, WHITE)
box(487, 230, 382, 197, BLUE_PALE, 11)
label(508, 247, "SEU CAMINHO")
line(524, 338, 824, 338, BLUE, 6)
for xx, cc in [(524,BLUE),(674,CORAL),(824,LIME)]:
    circle(xx,338,10,cc, BLUE if cc==LIME else None)
text(509, 365, "Organizar", "ManropeSemi", 10, INK)
text(648, 365, "Treinar", "ManropeSemi", 10, INK)
text(799, 365, "Seguir", "ManropeSemi", 10, INK)
text(509, 394, "VISÃO DE PRODUTO", "ManropeBold", 8, MUTED)
text(50, 464, "Composição editorial; uma ação principal; identidade visível antes da dobra móvel. Mockup, não tela implementada.", "Manrope", 10, MUTED)
next_page()

# 10 - mobile and auth
base(10, "Mobile e autenticação")
label(50, 69, "09 / APLICAÇÃO CONCEITUAL")
title(50, 87, "Do primeiro contato à conta", 45)
def phone(x,y,w,h,bg=WHITE):
    box(x,y,w,h,INK,21)
    box(x+5,y+5,w-10,h-10,bg,17)
    box(x+w/2-23,y+8,46,5,INK,2)

phone(87,158,200,315)
logo(102,181,25)
label(103,234,"SEU COMEÇO")
text(102,253,"UM PASSO", "BarlowBold",32,INK)
text(102,285,"POSSÍVEL.", "BarlowBold",32,BLUE)
para(104,333,"Um caminho mais claro para seguir em movimento.",156,"Manrope",9,13,MUTED)
box(103,405,168,34,BLUE,6)
text(133,415,"Criar minha conta", "ManropeBold",8,WHITE)
phone(380,158,200,315)
logo(396,181,25)
text(398,231,"Entre no seu", "BarlowBold",26,INK)
text(398,255,"espaço", "BarlowBold",26,INK)
text(398,290,"E-mail", "ManropeSemi",9,INK)
box(397,308,166,29,WHITE,5,BORDER)
text(398,348,"Senha", "ManropeSemi",9,INK)
box(397,366,166,29,WHITE,5,BORDER)
box(397,415,166,31,BLUE,6)
text(458,423,"Entrar", "ManropeBold",9,WHITE)
box(624,167,280,277,BLUE_PALE,12)
label(647,190,"REGRA DE EXPERIÊNCIA")
title(646,218,"Clareza primeiro.",32)
para(648,267,"O símbolo reduz de escala sem perder leitura. Campos têm rótulos persistentes. Uma ação domina cada tela; as demais permanecem visíveis, mas discretas.",223,"Manrope",11,18)
text(50, 485, "Mockups conceituais. Fluxo de autenticação existente não foi alterado.", "Manrope", 9, MUTED)
next_page()

# 11 - product application
base(11, "Produto")
label(50, 69, "10 / APLICAÇÃO CONCEITUAL")
title(50, 87, "Rotina organizada, sem ruído", 45)
box(50, 153, 860, 304, WHITE, 12, BORDER)
box(50, 153, 156, 304, BLUE_DARK, 12)
mark(70,171,36,WHITE)
text(70, 241, "Início", "ManropeBold", 10, WHITE)
text(70, 274, "Semana", "ManropeMed", 10, WHITE)
text(70, 307, "Perfil", "ManropeMed", 10, WHITE)
label(232, 172, "BEM-VINDO DE VOLTA")
text(231, 191, "Sua semana começa aqui.", "BarlowBold", 32, INK)
box(231, 243, 405, 165, BLUE_PALE, 10)
label(251, 263, "PLANEJAMENTO SEMANAL")
for i, day in enumerate(["S","T","Q","Q","S","S","D"]):
    xx=249+i*54
    box(xx,300,38,61, WHITE if i!=2 else BLUE, 7)
    text(xx+13,310,day,"ManropeBold",9,INK if i!=2 else WHITE)
    circle(xx+19,346,3, BLUE if i==2 else BORDER)
text(251, 380, "Sua semana ainda está vazia.", "ManropeMed", 9, MUTED)
box(654, 243, 232, 165, WHITE, 10, BORDER)
label(674, 262, "PRÓXIMO PASSO")
text(674, 292, "Organize seus", "BarlowBold", 25, INK)
text(674, 321, "treinos.", "BarlowBold", 25, BLUE)
para(674, 358, "Estado vazio honesto até haver dados reais.", 192, "Manrope", 9, 14, MUTED)
text(50, 468, "Visão futura do sistema visual aplicada à área interna; não representa treinos ou métricas já disponíveis.", "Manrope", 10, MUTED)
next_page()

# 12 - extensions + handoff
base(12, "Desdobramentos")
label(50, 69, "11 / ECOSSISTEMA")
title(50, 87, "A mesma marca em cada ponto", 45)
box(50, 153, 271, 270, BLUE, 12)
label(70, 172, "PEÇA SOCIAL", WHITE)
mark(72, 205, 77, WHITE)
text(70, 293, "UM PASSO", "BarlowBold", 34, WHITE)
text(70, 331, "DE CADA VEZ.", "BarlowBold", 34, WHITE)
line(71, 391, 300, 391, CORAL, 8)
box(338, 153, 253, 270, PAPER, 12, BORDER)
label(357, 172, "ÍCONE DE APLICATIVO")
box(396, 225, 138, 138, BLUE, 27)
mark(417, 243, 97, WHITE)
box(608, 153, 302, 270, WHITE, 12, BORDER)
label(630, 172, "PEÇA EDITORIAL")
text(629, 218, "A ROTINA", "BarlowBold", 38, INK)
text(629, 258, "GANHA CAMINHO.", "BarlowBold", 38, BLUE)
line(631, 340, 864, 340, BLUE, 7)
circle(865,340,10,CORAL)
para(630, 370, "Identidade reconhecível sem depender do logotipo em toda composição.", 243, "Manrope", 9.5, 14, MUTED)
text(50, 448, "Próximo passo: validar símbolo, assinatura e direção; testar aplicações e contraste; produzir assets finais.", "ManropeSemi", 10, INK)
next_page()

c.save()

# Portable, editable vector symbol assets. The wordmark remains vector in the PDF.
logo_dir = ROOT / "brand" / "logo"
logo_dir.mkdir(parents=True, exist_ok=True)
path = "M12 10 H34 V58 H64 V48 H84 V78 H12 Z"
for filename, fill in [("lastrofit-symbol-blue.svg", BLUE), ("lastrofit-symbol-white.svg", WHITE)]:
    (logo_dir / filename).write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="Símbolo Lastrofit">'
        f'<path fill="{fill}" d="{path}"/></svg>\n', encoding="utf-8")

print(OUT)
