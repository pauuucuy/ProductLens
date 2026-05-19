# ProductLens API

Backend REST desarrollado con Flask que expone el modelo de clasificacion de imagenes ProductLens como una API en la nube. Desplegado en Render.com.

URL en produccion: https://productlens-plog.onrender.com

---

## Descripcion del proyecto

ProductLens clasifica imagenes de productos de consumo en dos categorias usando MobileNetV2 con Transfer Learning. El modelo fue entrenado con aproximadamente 7.400 imagenes balanceadas, etiquetadas automaticamente con CLIP de OpenAI sobre un dataset de mas de 398.000 imagenes de productos.

Categorias disponibles:

| Categoria | Ejemplos |
|---|---|
| cuidado_personal | Cremas, shampoo, perfumes, maquillaje, cosmeticos |
| hogar_cocina | Ollas, utensilios, electrodomesticos, vajilla |

Stack tecnico:
- Backend: Python + Flask
- Modelo: MobileNetV2 (Transfer Learning, fine-tuning ultimas 30 capas)
- Despliegue backend: Render.com
- Frontend: React + Vite desplegado en Netlify

---

## Estructura del proyecto

```
Backend/productlens-api/
|-- app.py                    # API Flask, endpoints y logica de prediccion
|-- productlens_model.keras   # Modelo entrenado (MobileNetV2)
|-- requirements.txt          # Dependencias Python
|-- render.yaml               # Configuracion de despliegue en Render
|-- README.md                 # Este archivo
```

---

## Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | / | Health check, verifica que la API esta activa |
| GET | /info | Informacion del modelo (arquitectura y clases) |
| POST | /predict | Clasificar una imagen de producto |

---

## Uso del endpoint /predict

Enviar imagen como archivo multipart (recomendado):

```bash
curl -X POST https://productlens-plog.onrender.com/predict \
     -F "imagen=@foto_producto.jpg"
```

Respuesta de ejemplo:

```json
{
  "clase_predicha": "cuidado_personal",
  "confianza": 94.32,
  "probabilidades": {
    "cuidado_personal": 94.32,
    "hogar_cocina": 5.68
  }
}
```

---

## Instrucciones para ejecutar localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/pauuucuy/ProductLens.git
cd ProductLens/Backend/productlens-api
```

### 2. Crear entorno virtual

```bash
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Ejecutar el servidor

```bash
python app.py
```

La API queda disponible en http://localhost:5000.

---

## Dependencias

| Libreria | Version | Uso |
|---|---|---|
| Flask | 3.1.0 | Framework web para construir la API REST |
| Flask-CORS | 5.0.0 | Permite peticiones cross-origin desde el frontend |
| TensorFlow CPU | 2.21.0 | Carga y ejecucion del modelo de clasificacion |
| Pillow | 11.1.0 | Lectura y preprocesamiento de imagenes |
| NumPy | 1.26.4 | Operaciones numericas sobre arrays |
| Gunicorn | 23.0.0 | Servidor WSGI para produccion en Render |

---

## Despliegue en Render

1. Subir el proyecto a GitHub incluyendo el archivo productlens_model.keras
2. Ir a render.com y crear un nuevo Web Service
3. Conectar el repositorio de GitHub
4. Configurar los siguientes campos:
   - Root Directory: Backend/productlens-api
   - Language: Python
   - Build Command: pip install -r requirements.txt
   - Start Command: gunicorn app:app --workers 1 --timeout 120
5. Hacer clic en Deploy Web Service

Nota: en el plan gratuito de Render el servicio hiberna tras 15 minutos de inactividad.
La primera peticion puede tardar hasta 30 segundos mientras el servidor se reactiva.
