# 📝 OCR Annotator

A full-stack application for verifying OCR outputs from word images.  
Built with **React (frontend)**, **Flask + EasyOCR (backend)**, and **Firebase (storage & authentication)**.

---

## 🚀 Features
- Upload and process word images using EasyOCR.
- Display OCR predictions alongside images for verification.
- Annotators choose: ✅ Correct | ❌ Wrong | ➖ Skip.
- Keyboard shortcuts: **1** = Correct, **2** = Wrong, **3** = Skip.
- Progress bar with task completion tracking.
- Annotations saved per user in Firebase Firestore.
- Supports multiple users simultaneously.
- Future-ready for millions of images with batched tasks.

---

## ⚙️ Setup Instructions

### 1. Clone Repository and Run the app
```bash
1. Clone repo
git clone https://github.com/yourusername/ocr-annotator.git

2. Run frontend
cd ocr-annotator/ocr-annotator
npm install
npm run dev
Runs at localhost http://127.0.0.1:5173/

3. Run the backend
cd ocr-annotator/ocr-annotator/backend
pip install flask flask-cors easyocr torch
python ocr_server.py
Runs at localhost http://127.0.0.1:5000 

## Data Format
[
  { "id": 1, "image": "/images/word1.png" },
  { "id": 2, "image": "/images/word2.png" }
]

## Usage

1. Open the frontend in your browser.
2. Each task shows an image + OCR extracted text.
3. Choose:

✅ Correct
❌ Wrong
➖ Skip

Keyboard Shortcuts:

1 → Correct
2 → Wrong
3 → Skip

## Example Workflow

1. Start backend → python ocr_server.py
2. Start frontend → npm run dev
3. Open the app and begin annotation.