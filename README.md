# ProductLens 

Aplicación web de clasificación de imágenes de productos usando Machine Learning. 
Dado una imagen, el modelo predice si el producto pertenece a la categoría 
**Artículos para el hogar y la cocina** o **Cuidado personal y belleza**.

---

## ¿Cómo funciona?

1. El usuario sube una imagen desde la interfaz web
2. El frontend envía la imagen al backend via `POST /predict`
3. El backend procesa la imagen con el modelo MobileNetV2 entrenado
4. El modelo devuelve la categoría predicha y el nivel de confianza
5. El frontend muestra los resultados con barras de confianza y top de predicciones

---

## Estructura del repositorio

ProductLens/
frontend/          # Interfaz web en React + Vite
Backend/productlens-api/ # API REST en Flask con modelo MobileNetV2

---

## Frontend

- **Tecnología:** React 19 + Vite
- **URL local:** `http://localhost:5173`
- **Funcionalidades:**
  - Carga de imágenes por drag & drop o botón
  - Visualización de categoría predicha
  - Barra de confianza con color dinámico (verde/naranja/rojo)
  - Top de predicciones con barras de probabilidad
  - Modo demo (sin necesidad del backend)
  - Detección automática de entorno (local vs producción)

**Para correr el frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## Backend

- **Tecnología:** Python + Flask + TensorFlow
- **Modelo:** MobileNetV2 (Transfer Learning)
- **URL producción:** `https://productlens-plog.onrender.com`
- **Endpoints:**
  - `GET /` — Health check
  - `GET /info` — Información del modelo
  - `POST /predict` — Clasificar imagen de producto

**Para correr el backend localmente:**
```bash
cd Backend/productlens-api
pip install -r requirements.txt
python app.py
```

**Formato de la petición:**
POST /predict
Content-Type: multipart/form-data
Campo: imagen (archivo de imagen)

**Formato de la respuesta:**
```json
{
  "clase_predicha": "hogar_cocina",
  "confianza": 91.5,
  "probabilidades": {
    "cuidado_personal": 8.5,
    "hogar_cocina": 91.5
  }
}
```

---

## Categorías

| Categoría | Descripción |
|---|---|
| `hogar_cocina` | Artículos para el hogar y la cocina |
| `cuidado_personal` | Cuidado personal y belleza |

---

## Requisitos

**Frontend:**
- Node.js v18 o superior
- npm

**Backend:**
- Python 3.11
- Flask, TensorFlow, Pillow, flask-cors

---

## Despliegue

| Servicio | Plataforma | URL |
|---|---|---|
| Backend | Render | https://productlens-plog.onrender.com |
| Frontend | - | http://localhost:5173 |