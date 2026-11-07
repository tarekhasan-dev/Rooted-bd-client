
/**
 * Fixed, full-screen layer: leaves and wind streaks blow from the
 * right side of the screen to the left, across the whole page.
 * Pointer events are disabled, so it never blocks clicks.
 */
const LEAF = "M0 0C6-8 18-8 26 0C18 8 6 8 0 0ZM2 0H24";

const leaves = [
  { y: 110, fill: "#8fc48f", stroke: "#4f9660", scale: 1.6, dur: 14, delay: -2, bob: 5 },
  { y: 190, fill: "#6fae78", stroke: "#3f8a50", scale: 1.3, dur: 17, delay: -9, bob: 6 },
  { y: 270, fill: "#a8cfa6", stroke: "#6fae78", scale: 1.1, dur: 12, delay: -5, bob: 4.2 },
  { y: 350, fill: "#4f9660", stroke: "#2f7a45", scale: 1.8, dur: 19, delay: -13, bob: 5.5 },
  { y: 430, fill: "#86c28d", stroke: "#4f9660", scale: 1.2, dur: 15, delay: -7, bob: 4.6 },
  { y: 150, fill: "#e0b84a", stroke: "#b88a1c", scale: 1.4, dur: 16, delay: -1, bob: 5.2 },
  { y: 310, fill: "#e0b84a", stroke: "#b88a1c", scale: 1.2, dur: 21, delay: -15, bob: 6.2 },
  { y: 480, fill: "#6fae78", stroke: "#3f8a50", scale: 1.5, dur: 13, delay: -10, bob: 4.8 },
  { y: 60, fill: "#a8cfa6", stroke: "#6fae78", scale: 1.2, dur: 18, delay: -4, bob: 5.8 },
];

const gusts = [
  { y: 90, cls: "", dur: 22 },
  { y: 230, cls: "g2", dur: 26 },
  { y: 330, cls: "g3", dur: 20 },
  { y: 400, cls: "g4", dur: 24 },
  { y: 520, cls: "g2", dur: 28 },
  { y: 170, cls: "g3", dur: 30 },
];

export default function PageWind() {
  return (
    <svg className="page-wind" aria-hidden="true">
      <g className="wind">
        {gusts.map((g, i) => (
          <g key={`gust-${i}`} transform={`translate(0 ${g.y})`}>
            <g
              className="wl"
              style={{
                animationDuration: `${g.dur}s`,
                animationDelay: `-${i * 4 + 1}s`,
              }}
            >
              <path className={g.cls} d="M260 0C170-12 80 12 0 0" />
            </g>
          </g>
        ))}
      </g>

      {leaves.map((l, i) => (
        <g key={`leaf-${i}`} transform={`translate(0 ${l.y})`}>
          <g
            className="wl"
            style={{
              animationDuration: `${l.dur}s`,
              animationDelay: `${l.delay}s`,
            }}
          >
            <g className="wb" style={{ animationDuration: `${l.bob}s` }}>
              <path
                d={LEAF}
                fill={l.fill}
                stroke={l.stroke}
                strokeWidth=".8"
                transform={`scale(${l.scale})`}
              />
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
}