"""
ProductLens API - Backend Flask
Modelo: MobileNetV2 (Transfer Learning)
Tarea: Clasificación binaria de imágenes de productos
"""

import os
import io
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import tensorflow as tf

# ── Configuración ──────────────────────────────────────────────────────────────

app = Flask(__name__)
CORS(app)  # Permite peticiones desde cualquier frontend

# Clases del modelo — Keras las ordena alfabéticamente al leer carpetas con flow_from_directory
# índice 0 → cuidado_personal  |  índice 1 → hogar_cocina
CLASS_NAMES = ["cuidado_personal", "hogar_cocina"]

# Tamaño de imagen que espera MobileNetV2
IMG_SIZE = (224, 224)

# ── Carga del modelo ───────────────────────────────────────────────────────────

MODEL_PATH = os.path.join(os.path.dirname(__file__), "productlens_model.keras")

print("Cargando modelo...")
model = tf.keras.models.load_model(MODEL_PATH)
print("Modelo cargado correctamente.")


# ── Funciones auxiliares ───────────────────────────────────────────────────────

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Recibe los bytes de una imagen, la redimensiona a 224x224
    y la normaliza al rango [0, 1] que espera MobileNetV2.
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE)
    arr = np.array(img, dtype=np.float32) / 255.0   # normalizar [0, 1]
    arr = np.expand_dims(arr, axis=0)                # añadir dimensión batch → (1, 224, 224, 3)
    return arr


def build_response(predictions: np.ndarray) -> dict:
    """
    Convierte el vector de predicciones en un dict con:
    - clase predicha
    - confianza (%)
    - probabilidades por clase
    """
    probs = predictions[0].tolist()          # [prob_clase0, prob_clase1]
    predicted_index = int(np.argmax(probs))

    return {
        "clase_predicha": CLASS_NAMES[predicted_index],
        "confianza": round(probs[predicted_index] * 100, 2),
        "probabilidades": {
            CLASS_NAMES[i]: round(p * 100, 2)
            for i, p in enumerate(probs)
        }
    }


# ── Endpoints ──────────────────────────────────────────────────────────────────

@app.route("/", methods=["GET"])
def index():
    """Health check — confirma que la API está activa."""
    return jsonify({
        "status": "ok",
        "mensaje": "ProductLens API funcionando",
        "endpoints": {
            "GET  /":          "Health check",
            "POST /predict":   "Clasificar imagen de producto",
            "GET  /info":      "Información del modelo"
        }
    })


@app.route("/info", methods=["GET"])
def info():
    """Devuelve metadata del modelo."""
    return jsonify({
        "modelo": "MobileNetV2 (Transfer Learning)",
        "input":  "Imagen 224x224 RGB",
        "clases": CLASS_NAMES,
        "num_clases": len(CLASS_NAMES)
    })


@app.route("/predict", methods=["POST"])
def predict():
    """
    Recibe una imagen y devuelve la clasificación del modelo.

    Acepta:
      - multipart/form-data  con campo 'imagen'
      - application/json     con campo 'imagen' en base64

    Devuelve JSON con clase predicha y confianza.
    """

    # ── Obtener imagen desde la request ────────────────────────────────────────

   image_bytes = None
            
    # Opción A: imagen subida como archivo (multipart)
    if "imagen" in request.files:
        file = request.files["imagen"]
        if file.filename == "":
            return jsonify({"error": "El campo 'imagen' está vacío"}), 400
        image_bytes = file.read()

    # Opción B: imagen en base64 dentro de JSON
    elif request.is_json:
        data = request.get_json()
        if "imagen" not in data:
            return jsonify({"error": "Falta el campo 'imagen' en el JSON"}), 400
        import base64
        try:
            image_bytes = base64.b64decode(data["imagen"])
        except Exception:
            return jsonify({"error": "La imagen en base64 no es válida"}), 400

    else:
        return jsonify({
            "error": "Envía la imagen como archivo multipart/form-data (campo 'imagen') "
                     "o como base64 en JSON"
        }), 400
    # ── Preprocesar y predecir ─────────────────────────────────────────────────

    try:
        arr = preprocess_image(image_bytes)
    except Exception as e:
        return jsonify({"error": f"No se pudo leer la imagen: {str(e)}"}), 422

    try:
        predictions = model.predict(arr, verbose=0)
    except Exception as e:
        return jsonify({"error": f"Error en la predicción: {str(e)}"}), 500

    resultado = build_response(predictions)
    return jsonify(resultado), 200


# ── Entrada ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    # En Render el puerto lo asigna la variable de entorno PORT
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
