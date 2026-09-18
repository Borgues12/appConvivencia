// features/sesiones/domain/generate-pin.ts
export function generatePin(): string {
  const pin = Math.floor(Math.random() * 1000); // 0 a 999
  return pin.toString().padStart(3, '0');
}