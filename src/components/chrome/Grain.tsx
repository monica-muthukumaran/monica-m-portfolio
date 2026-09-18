import './grain.css'

/**
 * One fixed noise plane for the whole document.
 *
 * Flat fills at this scale look printed with grain and look like a template
 * without it. The texture is an inline SVG turbulence — no network request, no
 * image decode, one composited layer that never repaints.
 */
export function Grain() {
  return <div className="grain" aria-hidden="true" />
}
