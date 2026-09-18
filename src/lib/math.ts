export const clamp = (v: number, min: number, max: number) => (v < min ? min : v > max ? max : v)

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Map v from [inMin, inMax] onto [outMin, outMax], clamped. */
export const mapRange = (v: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
  if (inMax === inMin) return outMin
  return clamp(outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin), Math.min(outMin, outMax), Math.max(outMin, outMax))
}

/**
 * Deterministic PRNG. Visuals must render identically on every load — a field
 * that reshuffles on refresh reads as noise rather than as a designed object.
 */
export const seeded = (seed: number) => {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}
