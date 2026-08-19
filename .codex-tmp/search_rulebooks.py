from pathlib import Path
from pypdf import PdfReader

base = Path(r"C:\Users\Lenovo\Desktop\RPG Solo\RPG Solo - Fontes do Projeto")
patterns = [
    "XP Budget",
    "Combat Encounter Difficulty",
    "Experience Points",
    "Challenge Rating",
    "XP Value",
    "Low Difficulty",
    "Moderate Difficulty",
    "High Difficulty",
    "Experience Point",
]

for filename in [
    "Dungeon Master's Guide (2024).pdf",
    "D&D Basic Rules (2024).pdf.pdf",
    "Monster Manual (2024).pdf",
]:
    path = base / filename
    reader = PdfReader(str(path))
    print(f"\nFILE {filename} PAGES {len(reader.pages)}")
    for index, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        hits = [pattern for pattern in patterns if pattern.lower() in text.lower()]
        if hits:
            compact = " ".join(text.replace("\n", " ").split())
            print(f"PDFPAGE {index + 1} HITS {hits}")
            for pattern in hits:
                at = compact.lower().find(pattern.lower())
                print(compact[max(0, at - 180):at + 800])

reader = PdfReader(str(base / "Dungeon Master's Guide (2024).pdf"))
for page_number in (118, 119, 120):
    print(f"\n--- DMG PDFPAGE {page_number} FULL ---")
    print(reader.pages[page_number - 1].extract_text() or "")
