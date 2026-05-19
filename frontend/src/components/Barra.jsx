// Componente que muestra una barra de progreso con el nivel de confianza
// El color cambia según el porcentaje: verde, naranja o rojo
function ConfidenceBar({ confidence }) {
  // Convierte la confianza de decimal a porcentaje entero
  const porcentaje = Math.round(confidence * 100)

  // Retorna el color según el nivel de confianza
  const getColor = () => {
    if (porcentaje >= 80) return "#22C55E" // Verde: alta confianza
    if (porcentaje >= 50) return "#F59E0B" // Naranja: confianza media
    return "#EF4444"                        // Rojo: baja confianza
  }

  return (
    <div style={{ margin: "1rem 0" }}>
      {/* Encabezado con etiqueta y porcentaje */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontSize: "13px", color: "#64748B", fontWeight: "500" }}>Confianza</span>
        <span style={{ fontSize: "13px", fontWeight: "700", color: getColor() }}>{porcentaje}%</span>
      </div>
      {/* Barra de fondo gris con barra de progreso encima */}
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