// Componente que muestra las top predicciones del modelo
// Cada una con su etiqueta, porcentaje y barra de progreso
function TopPredictions({ top3 }) {
  return (
    <div style={{ marginTop: "1.25rem" }}>
      <p style={{ fontSize: "13px", fontWeight: "600", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "1rem" }}>
        Top 3 predicciones
      </p>
      {/* Recorre cada predicción y la renderiza */}
      {top3.map((item, index) => (
        <div key={index} style={{
          background: index === 0 ? "#F8FAFF" : "#FAFAFA",
          // La primera predicción tiene borde morado, las demás cyan
          border: index === 0 ? "1px solid #C7D2FE" : "1px solid #06B6D4",
          borderRadius: "10px", padding: "0.75rem 1rem", marginBottom: "0.6rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            {/* Trofeo solo para la predicción principal */}
            <span style={{ fontSize: "13px", color: index === 0 ? "#4F46E5" : "#06B6D4", fontWeight: index === 0 ? "600" : "400" }}>
              {index === 0 ? "🏆 " : ""}{item.label}
            </span>
            <span style={{ fontSize: "13px", fontWeight: "600", color: index === 0 ? "#4F46E5" : "#06B6D4" }}>
              {Math.round(item.probability * 100)}%
            </span>
          </div>
          {/* Barra de progreso: morada para la principal, cyan para las demás */}
          <div style={{ background: "#E2E8F0", borderRadius: "20px", height: "5px" }}>
            <div style={{
              width: `${Math.round(item.probability * 100)}%`,
              background: index === 0 ? "#6366F1" : "#06B6D4",
              height: "5px", borderRadius: "20px",
              transition: "width 0.5s ease",
            }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default TopPredictions