import { useState } from "react"
import ImageUploader from "./components/Imagen"
import ResultCard from "./components/ResultCard"
import { mockResult } from "./mockData"

function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [demoMode, setDemoMode] = useState(true)
  const [uploadKey, setUploadKey] = useState(0)

  const handleReset = () => {
    setResult(null)
    setUploadKey(k => k + 1)
  }

  const handleUpload = async (file) => {
    setLoading(true)
    setResult(null)

    if (demoMode) {
      setTimeout(() => {
        setResult(mockResult)
        setLoading(false)
      }, 1000)
      return
    }

    try {
      const formData = new FormData()
      formData.append("imagen", file)
      const res = await fetch("https://productlens-plog.onrender.com/predict", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      setResult(data)
    } catch (error) {
      alert("Error conectando con el backend")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F4F6F9", padding: "6rem 1rem 2rem" }}>

      <nav style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        background: "#0F172A",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <span style={{
          fontSize: "24px",
          fontWeight: "700",
          color: "#fff",
          letterSpacing: "-0.5px"
        }}>
          PRODUCTLENS
        </span>
      </nav>

      <div style={{
        maxWidth: "620px",
        margin: "0 auto 2rem",
        background: "#fff",
        borderRadius: "16px",
        padding: "1.5rem 2rem",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0F172A", letterSpacing: "-0.5px" }}>
            🔍 ProductLens
          </h1>
          <p style={{ fontSize: "13px", color: "#94A3B8", marginTop: "2px" }}>
            Clasificador de imágenes de productos
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: "#94A3B8" }}>Demo</span>
          <div
            onClick={() => { setDemoMode(!demoMode); handleReset() }}
            style={{
              width: "44px", height: "24px", borderRadius: "20px",
              background: demoMode ? "#6366F1" : "#CBD5E1",
              cursor: "pointer", position: "relative", transition: "background 0.2s ease",
            }}
          >
            <div style={{
              width: "18px", height: "18px", borderRadius: "50%",
              background: "#fff", position: "absolute", top: "3px",
              left: demoMode ? "23px" : "3px", transition: "left 0.2s ease",
            }} />
          </div>
          <span style={{ fontSize: "12px", fontWeight: "500", color: demoMode ? "#6366F1" : "#94A3B8" }}>
            {demoMode ? "ON" : "OFF"}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: "620px", margin: "0 auto" }}>
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          marginBottom: "1.5rem"
        }}>
          <p style={{ fontSize: "13px", fontWeight: "600", color: "#64748B", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Subir imagen
          </p>
          <ImageUploader key={uploadKey} onUpload={handleUpload} />
        </div>

        {loading && (
          <div style={{
            background: "#fff", borderRadius: "16px", padding: "2rem",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            textAlign: "center", color: "#6366F1", fontSize: "15px"
          }}>
            Analizando imagen...
          </div>
        )}

        {result && <ResultCard result={result} setResult={handleReset} />}
      </div>
    </div>
  )
}

export default App
