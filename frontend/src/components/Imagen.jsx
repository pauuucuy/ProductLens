import { useRef, useState, useEffect } from "react"

// Componente de carga de imágenes
// Soporta drag & drop y selección por botón
function ImageUploader({ onUpload }) {
  const [preview, setPreview] = useState(null)   // URL de previsualización de la imagen
  const [dragging, setDragging] = useState(false) // Estado visual del drag & drop
  const inputRef = useRef(null)                   // Referencia al input de archivo oculto

  // Procesa el archivo seleccionado y genera la previsualización
  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return
    setPreview(URL.createObjectURL(file)) // Crea URL temporal para mostrar la imagen
    onUpload(file)                         // Envía el archivo al componente padre
  }

  // Maneja la selección desde el input de archivo
  const handleChange = (e) => handleFile(e.target.files[0])

  // Maneja cuando el usuario suelta la imagen en la zona de drop
  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current.click()} // Abre el selector de archivos al hacer clic
      style={{
        border: dragging ? "2px solid #1D9E75" : "2px dashed #ccc",
        borderRadius: "12px",
        padding: "2rem",
        textAlign: "center",
        cursor: "pointer",
        background: dragging ? "#f0fdf8" : "#fafafa",
        transition: "all 0.2s ease",
      }}
    >
      {/* Input oculto que maneja la selección real del archivo */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: "none" }}
      />

      {/* Muestra preview si hay imagen, o instrucciones si no */}
      {preview ? (
        <img
          src={preview}
          alt="preview"
          style={{ maxWidth: "100%", maxHeight: "250px", borderRadius: "8px" }}
        />
      ) : (
        <>
          <p style={{ fontSize: "2rem", margin: "0" }}>📷</p>
          <p style={{ color: "#666", marginTop: "0.5rem" }}>
            Arrastra una imagen aquí o haz clic para seleccionar
          </p>
        </>
      )}
    </div>
  )
}

export default ImageUploader
