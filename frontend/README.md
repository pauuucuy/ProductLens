# ProductLens - Frontend

## Descripción
ProductLens es una aplicación web que permite clasificar imágenes de productos en dos categorías:
- Artículos para el hogar y la cocina
- Cuidado personal y belleza

La interfaz permite subir una imagen (drag & drop o botón), y muestra la categoría predicha, el nivel de confianza y las probabilidades de cada categoría.

Cuenta con un **modo demo** que permite probar la interfaz sin necesidad del backend, usando datos simulados.

---

## Requisitos
- Node.js v18 o superior
- npm

---

## Instalación y ejecución

1. Clona el repositorio:
```bash
git clone https://github.com/pauuucuy/ProductLens.git
cd ProductLens/frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre el navegador en:
http://localhost:5173

---

## Modo demo vs Modo real

| | Modo demo | Modo real |
|---|---|---|
| Requiere backend | No | Sí |
| Resultados | Simulados | Del modelo real |
| Activación | Toggle ON | Toggle OFF |

---

## Conexión con el backend

La app detecta automáticamente el entorno y usa la URL correcta:
- **Local:** `http://localhost:5000/predict`
- **Producción:** `https://productlens-plog.onrender.com/predict`

El backend recibe la imagen como `multipart/form-data` con el campo `imagen` y devuelve:

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

## Estructura del proyecto
frontend/
src/
components/
Imagen.jsx           # Zona de carga de imágenes (drag & drop + botón)
ResultCard.jsx       # Tarjeta principal de resultados
Barra.jsx            # Barra de confianza con color dinámico
TopPredictions.jsx   # Lista de predicciones con barras
App.jsx                # Componente principal y lógica de fetch
mockData.js            # Datos simulados para el modo demo
index.html
package.json

---

## Tecnologías usadas
- React 19
- Vite
- Google Fonts (Poppins)
- CSS en línea (sin librerías externas)