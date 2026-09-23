/**
 * Simulates network latency with random jitter between minMs and maxMs.
 * Allows the mobile app to display loading indicators/skeletons
 * and demonstrate realistic asynchronous behavior.
 */
export async function simulateNetworkDelay(minMs: number = 400, maxMs: number = 900): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, delay));
}
