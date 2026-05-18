# ProductLens API 🔍

Backend Flask que expone el modelo de clasificación de imágenes **ProductLens** como una API REST. Desplegado en [Render.com](https://render.com).

---

## Descripción

ProductLens clasifica imágenes de productos de consumo en dos categorías usando **MobileNetV2** con Transfer Learning. Las etiquetas fueron asignadas automáticamente con el modelo CLIP de OpenAI sobre un dataset de ~398.000 imágenes, seleccionando 7.400 imágenes balanceadas para el entrenamiento.

**Categorías:**
| Índice | Clase | Descripción |
|--------|-------|-------------|
| 0 | `cuidado_personal` | Cosméticos, cremas, shampoo, maquillaje, higiene personal |
| 1 | `hogar_cocina` | Utensilios de cocina, electrodomésticos, vajilla, almohadas |

**Arquitectura del modelo:**
- Base: MobileNetV2 (preentrenado en ImageNet, fine-tuning últimas 30 capas)
- Entrada: imagen RGB 224×224
- Salida: 2 clases con probabilidades Softmax

---

## Estructura del proyecto

```
productlens-api/
├── app.py                    # API Flask principal
├── productlens_model.keras   # Modelo entrenado
├── requirements.txt          # Dependencias Python
├── render.yaml               # Configuración de despliegue en Render
└── README.md
```

---

## Endpoints

| Método | Ruta       | Descripción                        |
|--------|------------|------------------------------------|
| GET    | `/`        | Health check — API activa          |
| GET    | `/info`    | Información del modelo             |
| POST   | `/predict` | Clasificar una imagen de producto  |

---

## Uso del endpoint `/predict`

### Opción A — Enviar imagen como archivo (recomendado)

```bash
curl -X POST https://TU-API.onrender.com/predict \
     -F "imagen=@foto_producto.jpg"
```

### Opción B — Enviar imagen en base64 (JSON)

```bash
# Convertir imagen a base64 primero
BASE64=$(base64 -w 0 foto_producto.jpg)

curl -X POST https://TU-API.onrender.com/predict \
     -H "Content-Type: application/json" \
     -d "{\"imagen\": \"$BASE64\"}"
```

### Respuesta de ejemplo

```json
{
  "clase_predicha": "Autentico",
  "confianza": 94.32,
  "probabilidades": {
    "Autentico": 94.32,
    "Falso": 5.68
  }
}
```

---

## Cómo ejecutar localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/productlens-api.git
cd productlens-api
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. Colocar el modelo

Asegúrate de que `productlens_model.keras` esté en la raíz del proyecto.

### 4. Ejecutar

```bash
python app.py
```

La API queda disponible en `http://localhost:5000`.

---

## Despliegue en Render

1. Sube el proyecto a un repositorio de GitHub (incluyendo el archivo `.keras`).
2. Ve a [render.com](https://render.com) → **New Web Service**.
3. Conecta el repositorio.
4. Render detecta `render.yaml` automáticamente y configura el servicio.
5. Haz clic en **Deploy** y espera ~5 minutos.
6. Tu API queda disponible en `https://productlens-api.onrender.com`.

---

## Dependencias

| Librería         | Versión  | Uso                              |
|------------------|----------|----------------------------------|
| Flask            | 3.1.0    | Framework web / API REST         |
| Flask-CORS       | 5.0.0    | Permitir peticiones cross-origin |
| TensorFlow CPU   | 2.18.0   | Cargar y correr el modelo        |
| Pillow           | 11.1.0   | Procesar imágenes                |
| NumPy            | 1.26.4   | Operaciones numéricas            |
| Gunicorn         | 23.0.0   | Servidor WSGI para producción    |
