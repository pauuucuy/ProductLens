function ConfidenceBar({ confidence }) {
  const porcentaje = Math.round(confidence * 100)

  const getColor = () => {
    if (porcentaje >= 80) return "#22C55E"
    if (porcentaje >= 50) return "#F59E0B"
    return "#EF4444"
  }

  return (
    <div style={{ margin: "1rem 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontSize: "13px", color: "#64748B", fontWeight: "500" }}>Confianza</span>
        <span style={{ fontSize: "13px", fontWeight: "700", color: getColor() }}>{porcentaje}%</span>
      </div>
      <div style={{ background: "#F1F5F9", borderRadius: "20px", height: "10px" }}>
        <div style={{
          width: `${porcentaje}%`,
          background: getColor(),
          height: "10px",
          borderRadius: "20px",
          transition: "width 0.5s ease",
        }} />
      </div>
    </div>
  )
}

export default ConfidenceBar