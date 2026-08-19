from pathlib import Path
from pypdf import PdfReader

base = Path(r"C:\Users\Lenovo\Desktop\RPG Solo\RPG Solo - Fontes do Projeto")
for filename in ["D&D Basic Rules (2024).pdf.pdf", "Monster Manual (2024).pdf"]:
    reader = PdfReader(str(base / filename))
    print(f"\nFILE {filename}")
    for index, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        compact = " ".join(text.split())
        low = compact.lower()
        if "guard" in low and ("challenge" in low or "cr " in low) and ("spear" in low or "stat block" in low):
            at = low.find("guard")
            print(f"PDFPAGE {index + 1}: {compact[max(0, at - 150):at + 1000]}")
