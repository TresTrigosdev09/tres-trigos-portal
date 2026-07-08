/**
 * Referencias de Siesa cuyos productos pueden ser tajados.
 * Solo aplica a panes grandes (sourdough, multigranos, brioche molde, etc.).
 * Los croissants, galletas, panes pequeños y productos de pastelería NO van aquí.
 *
 * PENDIENTE DE CONFIRMAR CON COMERCIAL: esta lista es una estimación inicial
 * basada en lo que el área comercial describió como "panes que se puedan tajar".
 * Cuando comercial confirme la lista exacta, se actualizan estas referencias.
 */
export const REFERENCIAS_TAJABLES = new Set([
  "1",    // SOURDOUGH
  "2",    // MULTIGRANOS
  "3",    // AVENA Y ARROZ
  "6",   // EZEQUIEL
  "15",   // CENTENO CON SEMILLAS
  "16",   // PAN NUEZ DE NOGAL Y ARANDANOS
  "175",  // SOURDOUGH COCOA
  "178",  // PAN BRIOCHE YOGUR
  "202",  // CEREALES ANDINOS
  "203", //TRENZADO DE QUESO
  "208", //TRENZADO DE CHOCOLATE
  "209",  // SOURDOUGH CON HARINA INTEGRAL
  "211", //TRENZADO DE GUAYABA Y QUESO
  "226", //PAN DE MIGA
  "303", //TRENZADO DE QUESO Y HIERBAS
  "356", // SOURDOUGH DE CEBOLLA Y AJOS ROSTZADOS
  "567", // SOURDOUGH DE CERVEZA Y DÁTILES
  "819", //PAN DE MIGA 80G
  "1006", //MIGAFOODLOGY 2500
  "1236", //MIGA ALTERNATIVO SANDUCHE ENSABMBLE
  "1299", // SOURDOUGH DE AJO NEGRO Y MIEL
  "1302", //TRENZADO AREQUIPE Y NUECES
  "1376",  // SOURDOUGH DE CHIPOTLE Y PEPPER JACK
]);

/** Devuelve true si un producto puede ser tajado según su referencia de Siesa. */
export function esTajable(referencia) {
  return REFERENCIAS_TAJABLES.has(String(referencia));
}
