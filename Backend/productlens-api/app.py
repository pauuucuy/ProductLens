"""
ProductLens API - Backend Flask
Modelo: MobileNetV2 (Transfer Learning)
Tarea: Clasificación binaria de imágenes de productos
"""

import os
import io
import base64
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import tensorflow as tf

app = Flask(__name__)
CORS(app, origins=["https://productlensml.netlify.app", "http://localhost:5173"])

CLASS_NAMES = ["cuidado_personal", "hogar_cocina"]
IMG_SIZE = (224, 224)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "productlens_model.keras")

print("Cargando modelo...")
model = tf.keras.models.load_model(MODEL_PATH)
print("Modelo cargado correctamente.")


def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE)
    arr = np.array(img, dtype=np.float32) / 255.0
    arr = np.expand_dims(arr, axis=0)
    return arr


def build_response(predictions):
    probs = predictions[0].tolist()
    predicted_index = int(np.argmax(probs))
    return {
        "clase_predicha": CLASS_NAMES[predicted_index],
        "confianza": round(probs[predicted_index] * 100, 2),
        "probabilidades": {
            CLASS_NAMES[i]: round(p * 100, 2)
            for i, p in enumerate(probs)
        }
    }


@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "status": "ok",
        "mensaje": "ProductLens API funcionando",
        "endpoints": {
            "GET  /": "Health check",
            "POST /predict": "Clasificar imagen de producto",
            "GET  /info": "Informacion del modelo"
        }
    })


@app.route("/info", methods=["GET"])
def info():
    return jsonify({
        "modelo": "MobileNetV2 (Transfer Learning)",
        "input": "Imagen 224x224 RGB",
        "clases": CLASS_NAMES,
        "num_clases": len(CLASS_NAMES)
    })


@app.route("/predict", methods=["POST"])
def predict():
    image_bytes = None

    if "imagen" in request.files:
        file = request.files["imagen"]
        if file.filename == "":
            return jsonify({"error": "El campo imagen esta vacio"}), 400
        image_bytes = file.read()

    elif request.is_json:
        data = request.get_json()
        if "imagen" not in data:
            return jsonify({"error": "Falta el campo imagen en el JSON"}), 400
        try:
            image_bytes = base64.b64decode(data["imagen"])
        except Exception:
            return jsonify({"error": "La imagen en base64 no es valida"}), 400

    else:
        return jsonify({"error": "Envia la imagen como multipart con campo imagen"}), 400

    try:
        arr = preprocess_image(image_bytes)
    except Exception as e:
        return jsonify({"error": f"No se pudo leer la imagen: {str(e)}"}), 422

    try:
        predictions = model.predict(arr, verbose=0)
    except Exception as e:
        return jsonify({"error": f"Error en la prediccion: {str(e)}"}), 500

    resultado = build_response(predictions)
    return jsonify(resultado), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
