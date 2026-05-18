import { useRef, useState, useEffect } from "react"

function ImageUploader({ onUpload }) {
  const [preview, setPreview] = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  // Cada vez que el componente se remonta (nueva key desde App.jsx), limpia el preview
  useEffect(() => {
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ""
  }, [])

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return
    setPreview(URL.createObjectURL(file))
    onUpload(file)
  }

  const handleChange = (e) => handleFile(e.target.files[0])

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
      onClick={() => inputRef.current.click()}
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
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: "none" }}
      />
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
