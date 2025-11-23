export const ShamanConfig = {
  phase: 1, // Fase dell'elezione (0 12:00, 1 19:00, 2 23:00, 3 definitivo)
  fetchDataURL: process.env.NEXT_PUBLIC_DATA_URL || "",
  scrutini: false,
};
