from flask import Flask, request, jsonify
from flask_cors import CORS
import easyocr
import cv2
import os


app = Flask(__name__)
CORS(app)

reader = easyocr.Reader(["en"], gpu=False)



@app.route("/", methods=["GET"])
def home():
    return "✅ OCR server is running. Use POST /ocr"

@app.route("/ocr", methods=["POST"])
def run_ocr():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    img_path = "temp.png"
    file.save(img_path)

    # Double-check that OpenCV can read the saved file
    img = cv2.imread(img_path)
    if img is None:
        return jsonify({"error": "Failed to read uploaded image"}), 400

    try:
        results = reader.readtext(img)
        extracted_text = " ".join([res[1] for res in results])

        clean_results = []
        for bbox, text, conf in results:
            clean_bbox = [list(map(float, point)) for point in bbox]
            clean_results.append({"bbox": clean_bbox, "text": text, "conf": float(conf)})

        return jsonify({"ocr_text": extracted_text, "results": clean_results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
