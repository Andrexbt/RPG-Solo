from pathlib import Path
from pypdf import PdfReader

path = Path(r"C:\Users\Lenovo\Desktop\RPG Solo\RPG Solo - Fontes do Projeto\Dungeon Master's Guide (2024).pdf")
reader = PdfReader(str(path))
for page_number in (52, 53, 118, 119, 120, 122):
    print(f"\n--- DMG PDFPAGE {page_number} FULL ---")
    print(reader.pages[page_number - 1].extract_text() or "")
