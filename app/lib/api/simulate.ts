/**
 * Simulates a network request. Swap the body for a real `fetch`/RPC call
 * when wiring APIs — the rest of the app consumes the same shape.
 */
export async function simulateFetch<T>(data: T, delayMs = 0): Promise<T> {
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return data;
}
