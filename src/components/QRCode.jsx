// Lightweight decorative QR code — deterministic pattern from a seed string.
// Looks like a real QR (finder corners + data modules); for demo display only.
function hashStr(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
function makeRng(seed) {
  let s = seed || 1
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }
}

export default function QRCode({ value = 'fridgely', size = 188, modules = 25 }) {
  const rng = makeRng(hashStr(value))
  const n = modules
  const grid = Array.from({ length: n }, () => Array(n).fill(false))

  // finder pattern (7x7) at a corner
  const finder = (ox, oy) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const ring = x === 0 || x === 6 || y === 0 || y === 6
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4
        grid[oy + y][ox + x] = ring || core
      }
    }
  }
  const inFinder = (x, y) =>
    (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8)

  finder(0, 0)
  finder(n - 7, 0)
  finder(0, n - 7)

  // data modules
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (inFinder(x, y)) continue
      grid[y][x] = rng() < 0.47
    }
  }

  const q = 2 // quiet zone
  const vb = n + q * 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${vb} ${vb}`} shapeRendering="crispEdges" aria-label="Payment QR code">
      <rect width={vb} height={vb} fill="#fff" rx="1" />
      {grid.map((row, y) =>
        row.map((on, x) =>
          on ? <rect key={`${x}-${y}`} x={x + q} y={y + q} width="1" height="1" fill="#1f2937" /> : null
        )
      )}
    </svg>
  )
}
