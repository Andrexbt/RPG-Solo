from pathlib import Path
from pypdf import PdfReader

path = Path(r"C:\Users\Lenovo\Desktop\RPG Solo\RPG Solo - Fontes do Projeto\D&D Basic Rules (2024).pdf.pdf")
reader = PdfReader(str(path))
for index, page in enumerate(reader.pages):
    text = page.extract_text() or ""
    for heading in ("A Short Rest is", "A Long Rest is"):
        if heading.lower() in text.lower():
            print(f"\n--- PDFPAGE {index + 1} {heading} ---")
            at = text.lower().find(heading.lower())
            print(text[at:at + 2600])

for page_number in range(299, 311):
    text = reader.pages[page_number - 1].extract_text() or ""
    if "Short Rest" in text or "Long Rest" in text:
        print(f"\n--- FULL PDFPAGE {page_number} ---\n{text}")
