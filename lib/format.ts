export function formatPrice(price: number): string {
  return `CLP ${price.toLocaleString("es-CL")}`
}
