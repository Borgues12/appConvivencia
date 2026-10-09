// features/sesiones/domain/generate-pin.ts
export function generatePin(): string {
  const pin = Math.floor(Math.random() * 9000) + 1000; // 4 dígitos
  return pin.toString().padStart(4, '0'); // 4 dígitos
}