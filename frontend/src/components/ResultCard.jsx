import ConfidenceBar from "./Barra"
import TopPredictions from "./TopPredictions"

// Componente principal de resultados
// Muestra la categoría predicha, la barra de confianza y el top de predicciones
function ResultCard({ result }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: "16px",
      padding: "2rem",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    }}>

      {/* Etiqueta de sección */}
      <p style={{ fontSize: "13px", fontWeight: "600", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.5rem" }}>
        Resultado
      </p>

      {/* Caja con la categoría predicha */}
      <div style={{
        background: "#EEF2FF", borderRadius: "12px",
        padding: "1rem 1.25rem", marginBottom: "1.25rem"
      }}>
        <p style={{ fontSize: "12px", color: "#818CF8", marginBottom: "4px" }}>Categoría predicha</p>
        <p style={{ fontSize: "18px", fontWeight: "700", color: "#4F46E5" }}>
          {result.predicted_class}
        </p>
      </div>

      {/* Barra de confianza */}
      <ConfidenceBar confidence={result.confidence} />

      {/* Lista de predicciones */}
      <TopPredictions top3={result.top3} />
      
      <button onClick={() => { setResult(null) }}>
        Clasificar otra imagen
      </button>
    </div>
  )
}

export default ResultCard
