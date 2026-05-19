"""
ProductLens API - Backend Flask
Modelo: MobileNetV2 (Transfer Learning)
Tarea: Clasificacion binaria de imagenes de productos

Categorias:
  - cuidado_personal: cosmeticos, cremas, shampoo, perfumes
  - hogar_cocina: utensilios, electrodomesticos, vajilla
"""

import os
import io
import base64
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import tensorflow as tf

# Inicializacion de la aplicacion Flask
app = Flask(__name__)

# Se habilita CORS para permitir peticiones desde el frontend en Netlify y desde localhost en desarrollo
CORS(app, origins=["https://productlensml.netlify.app", "http://localhost:5173"])

# Nombres de las clases en orden alfabetico, igual al orden que usa Keras con flow_from_directory
# indice 0 -> cuidado_personal | indice 1 -> hogar_cocina
CLASS_NAMES = ["cuidado_personal", "hogar_cocina"]

# Tamano de entrada que espera MobileNetV2
IMG_SIZE = (224, 224)

# Ruta al archivo del modelo guardado
MODEL_PATH = os.path.join(os.path.dirname(__file__), "productlens_model.keras")

# Se carga el modelo una sola vez al iniciar el servidor para evitar cargarlo en cada peticion
print("Cargando modelo...")
model = tf.keras.models.load_model(MODEL_PATH)
print("Modelo cargado correctamente.")


def preprocess_image(image_bytes):
    """
    Preprocesa los bytes de una imagen para que sea compatible con MobileNetV2.

    Pasos:
      1. Decodifica los bytes a imagen PIL
      2. Convierte a RGB para eliminar canal alpha si existe
      3. Redimensiona a 224x224 pixeles
      4. Normaliza los valores de pixeles al rango [0, 1]
      5. Agrega dimension de batch resultando en shape (1, 224, 224, 3)

    Args:
        image_bytes (bytes): Imagen en formato bytes (JPEG, PNG, etc.)

    Returns:
        np.ndarray: Array listo para pasar al modelo
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE)
    arr = np.array(img, dtype=np.float32) / 255.0   # normalizar pixeles al rango [0, 1]
    arr = np.expand_dims(arr, axis=0)                # anadir dimension de batch
    return arr


def build_response(predictions):
    """
    Convierte el vector de probabilidades del modelo en un diccionario legible.

    Identifica la clase con mayor probabilidad y construye la respuesta
    con la clase predicha, el porcentaje de confianza y las probabilidades
    de todas las clases.

    Args:
        predictions (np.ndarray): Salida del modelo con shape (1, num_clases)

    Returns:
        dict: Clase predicha, confianza en porcentaje y probabilidades por clase
    """
    probs = predictions[0].tolist()
    predicted_index = int(np.argmax(probs))   # indice de la clase con mayor probabilidad

    return {
        "clase_predicha": CLASS_NAMES[predicted_index],
        "confianza": round(probs[predicted_index] * 100, 2),
        "probabilidades": {
            CLASS_NAMES[i]: round(p * 100, 2)
            for i, p in enumerate(probs)
        }
    }


# Health check: confirma que la API esta activa
# Util para verificar el estado del servicio en Render
@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "status": "ok",
        "mensaje": "ProductLens API funcionando",
        "endpoints": {
            "GET  /":        "Health check",
            "POST /predict": "Clasificar imagen de producto",
            "GET  /info":    "Informacion del modelo"
        }
    })


# Devuelve informacion del modelo: arquitectura, input esperado y clases disponibles
@app.route("/info", methods=["GET"])
def info():
    return jsonify({
        "modelo":     "MobileNetV2 (Transfer Learning)",
        "input":      "Imagen 224x224 RGB",
        "clases":     CLASS_NAMES,
        "num_clases": len(CLASS_NAMES)
    })


# Endpoint principal: recibe una imagen y devuelve la clasificacion del modelo
# Acepta dos formatos:
#   A) multipart/form-data con campo 'imagen' (archivo de imagen)
#   B) application/json con campo 'imagen' en base64
@app.route("/predict", methods=["POST"])
def predict():
    image_bytes = None

    # Opcion A: imagen enviada como archivo multipart/form-data
    if "imagen" in request.files:
        file = request.files["imagen"]

        # Verifica que el archivo no este vacio
        if file.filename == "":
            return jsonify({"error": "El campo imagen esta vacio"}), 400

        image_bytes = file.read()

    # Opcion B: imagen enviada como cadena base64 dentro de un JSON
    elif request.is_json:
        data = request.get_json()

        if "imagen" not in data:
            return jsonify({"error": "Falta el campo imagen en el JSON"}), 400

        try:
            # Decodifica la cadena base64 a bytes
            image_bytes = base64.b64decode(data["imagen"])
        except Exception:
            return jsonify({"error": "La imagen en base64 no es valida"}), 400

    else:
        return jsonify({"error": "Envia la imagen como multipart con campo imagen"}), 400

    # Preprocesa la imagen al formato que espera el modelo
    try:
        arr = preprocess_image(image_bytes)
    except Exception as e:
        return jsonify({"error": f"No se pudo leer la imagen: {str(e)}"}), 422

    # Realiza la prediccion con el modelo cargado
    try:
        predictions = model.predict(arr, verbose=0)
    except Exception as e:
        return jsonify({"error": f"Error en la prediccion: {str(e)}"}), 500

    # Construye y devuelve la respuesta con la clase predicha y la confianza
    resultado = build_response(predictions)
    return jsonify(resultado), 200


# Punto de entrada: Render asigna el puerto mediante la variable de entorno PORT
# En ejecucion local se usa el puerto 5000 por defecto
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
