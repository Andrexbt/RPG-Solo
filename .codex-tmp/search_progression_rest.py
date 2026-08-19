from pathlib import Path
from pypdf import PdfReader

base = Path(r"C:\Users\Lenovo\Desktop\RPG Solo\RPG Solo - Fontes do Projeto")
files = ["D&D Basic Rules (2024).pdf.pdf", "Player's Handbook (2024).pdf"]
patterns = [
    "Character Advancement",
    "Experience Points",
    "Short Rest",
    "Long Rest",
    "Finishing a Long Rest",
    "Experience Points Needed",
    "Level 2",
]

for filename in files:
    reader = PdfReader(str(base / filename))
    print(f"\nFILE {filename} PAGES {len(reader.pages)}")
    for index, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        compact = " ".join(text.split())
        hits = [pattern for pattern in patterns if pattern.lower() in compact.lower()]
        if hits:
            print(f"PDFPAGE {index + 1}: {hits}")
            for pattern in hits:
                at = compact.lower().find(pattern.lower())
                print(compact[max(0, at - 120):at + 650])
