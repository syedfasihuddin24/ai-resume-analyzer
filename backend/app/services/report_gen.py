import io
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table,
    TableStyle, HRFlowable,
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

C_PAGE   = colors.HexColor("#FAFAF9")
C_WHITE  = colors.white
C_DARK   = colors.HexColor("#1C1917")
C_BODY   = colors.HexColor("#3C3836")
C_MUTED  = colors.HexColor("#78716C")
C_BORDER = colors.HexColor("#E7E5E4")
C_VIOLET = colors.HexColor("#7C3AED")
C_PINK   = colors.HexColor("#DB2777")
C_TEAL   = colors.HexColor("#0891B2")
C_GREEN  = colors.HexColor("#059669")
C_AMBER  = colors.HexColor("#D97706")
C_RED    = colors.HexColor("#DC2626")
C_INDIGO = colors.HexColor("#4F46E5")
C_ORANGE = colors.HexColor("#EA580C")


def _score_color(score: int):
    if score >= 75: return C_GREEN
    if score >= 50: return C_AMBER
    return C_RED


def _score_label(score: int) -> str:
    if score >= 75: return "Excellent"
    if score >= 50: return "Good"
    if score >= 30: return "Fair"
    return "Needs Work"


def _st(name, **kwargs):
    d = dict(fontName="Helvetica", fontSize=8, textColor=C_BODY, leading=11)
    d.update(kwargs)
    return ParagraphStyle(name, **d)


def _hr(color=C_BORDER, thickness=0.5, before=2, after=5):
    return HRFlowable(
        width="100%", thickness=thickness,
        color=color, spaceBefore=before, spaceAfter=after,
    )


def _section_heading(text, color=C_VIOLET):
    return Paragraph(text, _st(
        f"sh_{text[:8]}",
        fontName="Helvetica-Bold", fontSize=9,
        textColor=color, spaceBefore=0, spaceAfter=1,
    ))


def _solid_bar(score, max_val, bar_w, color):
    try:
        pct     = max(0.0, min(score / max(max_val, 1), 1.0))
        fill_w  = max(2.0, bar_w * pct)
        empty_w = max(2.0, bar_w * (1.0 - pct))

        f = Table([[""]], colWidths=[fill_w], rowHeights=[6])
        f.setStyle(TableStyle([
            ("BACKGROUND",    (0,0),(-1,-1), color),
            ("TOPPADDING",    (0,0),(-1,-1), 0),
            ("BOTTOMPADDING", (0,0),(-1,-1), 0),
            ("LEFTPADDING",   (0,0),(-1,-1), 0),
            ("RIGHTPADDING",  (0,0),(-1,-1), 0),
        ]))
        e = Table([[""]], colWidths=[empty_w], rowHeights=[6])
        e.setStyle(TableStyle([
            ("BACKGROUND",    (0,0),(-1,-1), C_BORDER),
            ("TOPPADDING",    (0,0),(-1,-1), 0),
            ("BOTTOMPADDING", (0,0),(-1,-1), 0),
            ("LEFTPADDING",   (0,0),(-1,-1), 0),
            ("RIGHTPADDING",  (0,0),(-1,-1), 0),
        ]))
        bar = Table([[f, e]], colWidths=[fill_w, empty_w])
        bar.setStyle(TableStyle([
            ("TOPPADDING",    (0,0),(-1,-1), 0),
            ("BOTTOMPADDING", (0,0),(-1,-1), 0),
            ("LEFTPADDING",   (0,0),(-1,-1), 0),
            ("RIGHTPADDING",  (0,0),(-1,-1), 0),
        ]))
        return bar
    except:
        return Spacer(1, 6)


def _breakdown_row(label, score, max_val, col_w):
    try:
        pct   = int((score / max(max_val, 1)) * 100)
        color = _score_color(pct)
        lw, vw = 75, 38
        bw = col_w - lw - vw - 6

        row = Table([[
            Paragraph(label.capitalize(),
                      _st(f"rl_{label}", fontSize=7.5, textColor=C_BODY)),
            _solid_bar(score, max_val, bw, color),
            Paragraph(
                f"<b>{score}</b><font size=6 color='#999'> /{max_val}</font>",
                _st(f"rv_{label}", fontSize=7.5,
                    textColor=color, alignment=TA_RIGHT)),
        ]], colWidths=[lw, bw, vw])
        row.setStyle(TableStyle([
            ("VALIGN",       (0,0),(-1,-1), "MIDDLE"),
            ("LEFTPADDING",  (0,0),(-1,-1), 0),
            ("RIGHTPADDING", (0,0),(-1,-1), 0),
            ("TOPPADDING",   (0,0),(-1,-1), 1),
            ("BOTTOMPADDING",(0,0),(-1,-1), 6),
        ]))
        return row
    except:
        return Spacer(1, 4)


def _score_card(label, value, sublabel, cw, top_color, val_color):
    """Fixed height score card — all 4 cards same size."""
    disp = str(value)
    fs   = 20 if len(disp) <= 4 else 14 if len(disp) <= 7 else 10

    return Table([
        [Paragraph(label, _st(f"scl_{label}",
                   fontName="Helvetica-Bold", fontSize=5.5,
                   textColor=C_MUTED, alignment=TA_CENTER))],
        [Paragraph(disp, _st(f"scv_{label}",
                   fontName="Helvetica-Bold", fontSize=fs,
                   textColor=val_color, alignment=TA_CENTER,
                   leading=fs + 2))],
        [Paragraph(sublabel, _st(f"scs_{label}",
                   fontSize=6, textColor=val_color,
                   alignment=TA_CENTER))],
    ],
    colWidths=[cw],
    rowHeights=[14, 30, 12],
    style=TableStyle([
        ("BACKGROUND",    (0,0),(-1,-1), C_WHITE),
        ("BOX",           (0,0),(-1,-1), 0.4, C_BORDER),
        ("LINEABOVE",     (0,0),(-1,0),  2.5, top_color),
        ("LEFTPADDING",   (0,0),(-1,-1), 4),
        ("RIGHTPADDING",  (0,0),(-1,-1), 4),
        ("TOPPADDING",    (0,0),(-1,-1), 4),
        ("BOTTOMPADDING", (0,0),(-1,-1), 4),
        ("ALIGN",         (0,0),(-1,-1), "CENTER"),
        ("VALIGN",        (0,0),(-1,-1), "MIDDLE"),
    ]))


def _skills_table(items, text_color, bg_color, col_w, cols=4):
    if not items:
        return Paragraph("None.", _st("none", fontSize=7.5, textColor=C_MUTED))
    try:
        padded = list(items) + [""] * ((cols - len(items) % cols) % cols)
        rows   = [padded[i:i+cols] for i in range(0, len(padded), cols)]
        cw     = col_w / cols

        cell_data = [[
            Paragraph(str(s) if s else "",
                      _st(f"sk_{i}_{j}",
                          fontSize=7.5,
                          textColor=text_color if s else C_MUTED,
                          alignment=TA_CENTER,
                          fontName="Helvetica-Bold" if s else "Helvetica"))
            for j, s in enumerate(row)
        ] for i, row in enumerate(rows)]

        t = Table(cell_data, colWidths=[cw] * cols)
        t.setStyle(TableStyle([
            ("BACKGROUND",    (0,0),(-1,-1), bg_color),
            ("GRID",          (0,0),(-1,-1), 0.3, C_BORDER),
            ("ALIGN",         (0,0),(-1,-1), "CENTER"),
            ("TOPPADDING",    (0,0),(-1,-1), 5),
            ("BOTTOMPADDING", (0,0),(-1,-1), 5),
            ("LEFTPADDING",   (0,0),(-1,-1), 3),
            ("RIGHTPADDING",  (0,0),(-1,-1), 3),
        ]))
        return t
    except:
        return Spacer(1, 4)


def _suggestion_row(i, tip, color, col_w):
    try:
        row = Table([[
            Paragraph(str(i), _st(f"tn{i}",
                      fontName="Helvetica-Bold", fontSize=8,
                      textColor=C_WHITE, alignment=TA_CENTER)),
            Paragraph(str(tip), _st(f"tb{i}",
                      fontSize=7.5, textColor=C_BODY, leading=11)),
        ]], colWidths=[18, col_w - 18])
        row.setStyle(TableStyle([
            ("BACKGROUND",    (0,0),(0,-1), color),
            ("BACKGROUND",    (1,0),(1,-1), C_WHITE),
            ("VALIGN",        (0,0),(-1,-1), "TOP"),
            ("TOPPADDING",    (0,0),(-1,-1), 6),
            ("BOTTOMPADDING", (0,0),(-1,-1), 6),
            ("LEFTPADDING",   (0,0),(-1,-1), 6),
            ("RIGHTPADDING",  (0,0),(-1,-1), 6),
            ("BOX",           (0,0),(-1,-1), 0.3, C_BORDER),
        ]))
        return row
    except:
        return Spacer(1, 4)


def generate_pdf_report(data: dict) -> bytes:
    buffer = io.BytesIO()
    W, H   = A4
    LM = RM = 14 * mm
    col_w  = W - LM - RM

    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        leftMargin=LM, rightMargin=RM,
        topMargin=10 * mm, bottomMargin=10 * mm,
    )

    story        = []
    generated_at = datetime.now().strftime("%B %d, %Y")

    name    = str(data.get("candidate_name",   "Candidate"))
    role    = str(data.get("job_title",        "General Role"))
    ats     = int(data.get("ats_score",        0))
    match   = int(data.get("job_match",        0))
    exp     = int(data.get("experience_years", 0))
    edu     = str(data.get("education",        "Not specified"))
    skills  = list(data.get("skills_found",    []))
    missing = list(data.get("missing_skills",  []))
    tips    = list(data.get("suggestions",     []))[:5]
    bdown   = dict(data.get("ats_breakdown",   {}))
    wts     = dict(data.get("ats_weights",     {}))

    ac = _score_color(ats)
    mc = _score_color(match)

    display_name = name if len(name) <= 30 else name[:28] + "..."
    display_role = role if len(role) <= 38 else role[:36] + "..."

    # ── HEADER ────────────────────────────────────────────
    header = Table([[
        Paragraph("ResumeAI", _st("logo",
                  fontName="Helvetica-Bold",
                  fontSize=14, textColor=C_WHITE)),
        Paragraph(
            f"<b>{display_name}</b><br/>"
            f"<font size=7 color='#C4B5FD'>"
            f"Target: {display_role}  ·  {generated_at}</font>",
            _st("hr", fontSize=9, textColor=C_WHITE,
                alignment=TA_RIGHT, leading=14)),
    ]], colWidths=[col_w * 0.35, col_w * 0.65])
    header.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(-1,-1), C_VIOLET),
        ("LEFTPADDING",   (0,0),(-1,-1), 12),
        ("RIGHTPADDING",  (0,0),(-1,-1), 12),
        ("TOPPADDING",    (0,0),(-1,-1), 10),
        ("BOTTOMPADDING", (0,0),(-1,-1), 10),
        ("VALIGN",        (0,0),(-1,-1), "MIDDLE"),
    ]))
    story += [header, Spacer(1, 10)]

    # ── SCORE CARDS ───────────────────────────────────────
    cw4 = (col_w - 9) / 4
    sc  = Table([[
        _score_card("ATS SCORE",  str(ats),     _score_label(ats),   cw4, ac,       ac),
        Spacer(3,1),
        _score_card("JOB MATCH",  f"{match}%",  _score_label(match), cw4, mc,       mc),
        Spacer(3,1),
        _score_card("EXPERIENCE", f"{exp} yrs", "detected",          cw4, C_VIOLET, C_VIOLET),
        Spacer(3,1),
        _score_card("EDUCATION",  edu,          "degree",            cw4, C_TEAL,   C_TEAL),
    ]], colWidths=[cw4,3,cw4,3,cw4,3,cw4])
    sc.setStyle(TableStyle([
        ("VALIGN",      (0,0),(-1,-1), "TOP"),
        ("LEFTPADDING", (0,0),(-1,-1), 0),
        ("RIGHTPADDING",(0,0),(-1,-1), 0),
    ]))
    story += [sc, Spacer(1, 12)]

    # ── SCORE BREAKDOWN (2 columns) ───────────────────────
    if bdown:
        story += [
            _section_heading("Score Breakdown", C_VIOLET),
            _hr(color=C_VIOLET, thickness=0.8, before=1, after=6),
        ]
        cats    = list(bdown.items())
        half    = (len(cats) + 1) // 2
        left_c  = cats[:half]
        right_c = cats[half:]
        bcw     = (col_w - 10) / 2

        left_rows  = [[_breakdown_row(k, v, wts.get(k,20), bcw)] for k,v in left_c]
        right_rows = [[_breakdown_row(k, v, wts.get(k,20), bcw)] for k,v in right_c]
        if not left_rows:  left_rows  = [[Spacer(1,4)]]
        if not right_rows: right_rows = [[Spacer(1,4)]]

        lt = Table(left_rows,  colWidths=[bcw])
        rt = Table(right_rows, colWidths=[bcw])
        for t in [lt, rt]:
            t.setStyle(TableStyle([
                ("LEFTPADDING",  (0,0),(-1,-1), 0),
                ("RIGHTPADDING", (0,0),(-1,-1), 0),
                ("TOPPADDING",   (0,0),(-1,-1), 0),
                ("BOTTOMPADDING",(0,0),(-1,-1), 0),
            ]))

        bd = Table([[lt, Spacer(10,1), rt]], colWidths=[bcw, 10, bcw])
        bd.setStyle(TableStyle([
            ("VALIGN",      (0,0),(-1,-1), "TOP"),
            ("LEFTPADDING", (0,0),(-1,-1), 0),
            ("RIGHTPADDING",(0,0),(-1,-1), 0),
            ("TOPPADDING",  (0,0),(-1,-1), 0),
            ("BOTTOMPADDING",(0,0),(-1,-1), 0),
        ]))
        story += [bd, Spacer(1, 12)]

    # ── SKILLS + MISSING SIDE BY SIDE ─────────────────────
    half_w = (col_w - 10) / 2

    sk_block = [
        _section_heading(f"Skills Detected ({len(skills)})", C_TEAL),
        _hr(color=C_TEAL, thickness=0.8, before=1, after=5),
        _skills_table(skills, C_TEAL,
                      colors.HexColor("#ECFEFF"), half_w, cols=4),
    ]
    ms_block = [
        _section_heading(f"Missing Skills ({len(missing)})", C_RED),
        _hr(color=C_RED, thickness=0.8, before=1, after=5),
        _skills_table(missing, C_RED,
                      colors.HexColor("#FFF1F2"), half_w, cols=4),
    ]

    def _mini_col(items, w):
        t = Table([[item] for item in items], colWidths=[w])
        t.setStyle(TableStyle([
            ("LEFTPADDING",  (0,0),(-1,-1), 0),
            ("RIGHTPADDING", (0,0),(-1,-1), 0),
            ("TOPPADDING",   (0,0),(-1,-1), 0),
            ("BOTTOMPADDING",(0,0),(-1,-1), 0),
        ]))
        return t

    skills_row = Table([[
        _mini_col(sk_block, half_w),
        Spacer(10, 1),
        _mini_col(ms_block, half_w),
    ]], colWidths=[half_w, 10, half_w])
    skills_row.setStyle(TableStyle([
        ("VALIGN",       (0,0),(-1,-1), "TOP"),
        ("LEFTPADDING",  (0,0),(-1,-1), 0),
        ("RIGHTPADDING", (0,0),(-1,-1), 0),
        ("TOPPADDING",   (0,0),(-1,-1), 0),
        ("BOTTOMPADDING",(0,0),(-1,-1), 0),
    ]))
    story += [skills_row, Spacer(1, 12)]

    # ── AI SUGGESTIONS (2 columns) ────────────────────────
    story += [
        _section_heading("AI-Powered Improvement Suggestions", C_PINK),
        _hr(color=C_PINK, thickness=0.8, before=1, after=6),
    ]

    tip_colors = [C_VIOLET, C_PINK, C_TEAL, C_GREEN, C_AMBER]
    tip_col_w  = (col_w - 8) / 2
    left_tips  = tips[::2]
    right_tips = tips[1::2]

    def _tip_col(tip_list, start_i, w):
        rows = []
        for i, tip in enumerate(tip_list):
            color = tip_colors[(start_i + i * 2 - 1) % len(tip_colors)]
            rows.append([_suggestion_row(start_i + i * 2, tip, color, w)])
            rows.append([Spacer(1, 4)])
        if not rows:
            rows = [[Spacer(1, 4)]]
        t = Table(rows, colWidths=[w])
        t.setStyle(TableStyle([
            ("LEFTPADDING",  (0,0),(-1,-1), 0),
            ("RIGHTPADDING", (0,0),(-1,-1), 0),
            ("TOPPADDING",   (0,0),(-1,-1), 0),
            ("BOTTOMPADDING",(0,0),(-1,-1), 0),
        ]))
        return t

    tips_table = Table([[
        _tip_col(left_tips,  1, tip_col_w),
        Spacer(8, 1),
        _tip_col(right_tips, 2, tip_col_w),
    ]], colWidths=[tip_col_w, 8, tip_col_w])
    tips_table.setStyle(TableStyle([
        ("VALIGN",       (0,0),(-1,-1), "TOP"),
        ("LEFTPADDING",  (0,0),(-1,-1), 0),
        ("RIGHTPADDING", (0,0),(-1,-1), 0),
        ("TOPPADDING",   (0,0),(-1,-1), 0),
        ("BOTTOMPADDING",(0,0),(-1,-1), 0),
    ]))
    story += [tips_table, Spacer(1, 12)]

    # ── FOOTER ────────────────────────────────────────────
    footer = Table([[
        Paragraph("ResumeAI — Built by Syed Fasihuddin",
                  _st("fl", fontSize=7, textColor=C_WHITE)),
        Paragraph(f"Generated on {generated_at}",
                  _st("fr", fontSize=7,
                      textColor=colors.HexColor("#C4B5FD"),
                      alignment=TA_RIGHT)),
    ]], colWidths=[col_w * 0.6, col_w * 0.4])
    footer.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(-1,-1), C_VIOLET),
        ("LEFTPADDING",   (0,0),(-1,-1), 12),
        ("RIGHTPADDING",  (0,0),(-1,-1), 12),
        ("TOPPADDING",    (0,0),(-1,-1), 7),
        ("BOTTOMPADDING", (0,0),(-1,-1), 7),
        ("VALIGN",        (0,0),(-1,-1), "MIDDLE"),
    ]))
    story.append(footer)

    def draw_bg(canvas, doc):
        canvas.saveState()
        canvas.setFillColor(C_PAGE)
        canvas.rect(0, 0, W, H, fill=True, stroke=False)
        canvas.restoreState()

    doc.build(story, onFirstPage=draw_bg, onLaterPages=draw_bg)
    return buffer.getvalue()