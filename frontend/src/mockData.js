// Datos simulados para el modo demo
// Se usan cuando el toggle de demo esta activado (sin necesidad del backend)
export const mockResult = {
  predicted_class: "Artículos para el hogar y la cocina", // Categoría predicha
  confidence: 0.91, // Confianza del modelo (0 a 1)
  top3: [
    { label: "Artículos para el hogar y la cocina", probability: 0.91 },
    { label: "Cuidado personal y belleza", probability: 0.09 },
  ],
}