/**
 * Animated hero illustration for rooted.BD
 * All motion is CSS-driven (see styles/hero.css), so no client hooks needed.
 */

import "@/styles/hero.css";

export default function HeroScene() {
  return (
    <svg
      className="hero-scene"
      viewBox="0 60 1000 340"
      role="img"
      aria-label="Three volunteers planting and watering saplings in the sunshine"
    >
      <defs>
        <radialGradient id="rbSun">
          <stop offset="0" stopColor="#ffe08a" stopOpacity=".9" />
          <stop offset="1" stopColor="#ffe08a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rbH1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfe6c8" />
          <stop offset="1" stopColor="#e6f2e1" />
        </linearGradient>
        <linearGradient id="rbH2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b5d6ad" />
          <stop offset="1" stopColor="#dcecd5" />
        </linearGradient>
        <linearGradient id="rbSoil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a45a34" />
          <stop offset="1" stopColor="#6a3520" />
        </linearGradient>
        <linearGradient id="rbLeaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8fdc98" />
          <stop offset="1" stopColor="#2f9558" />
        </linearGradient>
        <linearGradient id="rbCan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7ab6dc" />
          <stop offset="1" stopColor="#3f86b3" />
        </linearGradient>
      </defs>

      {/* sun (moved down 25 + smaller glow so nothing is clipped) */}
      <g transform="translate(0 25)">
        <g className="sun-glow">
          <circle cx="860" cy="150" r="68" fill="url(#rbSun)" />
        </g>
        <g
          className="sun-rays"
          stroke="#ffd166"
          strokeWidth="4"
          strokeLinecap="round"
          opacity=".7"
        >
          <line x1="860" y1="90" x2="860" y2="104" />
          <line x1="860" y1="196" x2="860" y2="210" />
          <line x1="800" y1="150" x2="814" y2="150" />
          <line x1="906" y1="150" x2="920" y2="150" />
          <line x1="818" y1="108" x2="828" y2="118" />
          <line x1="892" y1="182" x2="902" y2="192" />
          <line x1="902" y1="108" x2="892" y2="118" />
          <line x1="828" y1="182" x2="818" y2="192" />
        </g>
        <circle cx="860" cy="150" r="30" fill="#ffd166" />
      </g>

      {/* clouds */}
      <g className="cloud" fill="#fff" opacity=".9">
        <ellipse cx="170" cy="130" rx="60" ry="14" />
        <ellipse cx="200" cy="120" rx="34" ry="14" />
      </g>
      <g className="cloud c2" fill="#fff" opacity=".8">
        <ellipse cx="560" cy="118" rx="50" ry="11" />
        <ellipse cx="585" cy="110" rx="26" ry="11" />
      </g>

      {/* birds */}
      <g transform="translate(0 150)">
        <g className="bird">
          <g
            className="wing"
            fill="none"
            stroke="#1b4332"
            strokeWidth="2"
            strokeLinecap="round"
            opacity=".55"
          >
            <path d="M0 0q7-8 14 0q7-8 14 0" />
          </g>
        </g>
      </g>
      <g transform="translate(0 185)">
        <g className="bird b2">
          <g
            className="wing"
            fill="none"
            stroke="#1b4332"
            strokeWidth="2"
            strokeLinecap="round"
            opacity=".4"
          >
            <path d="M0 0q5-6 10 0q5-6 10 0" />
          </g>
        </g>
      </g>

      {/* hills */}
      <path d="M0 330Q120 215 300 290Q380 322 440 330V400H0Z" fill="url(#rbH1)" />
      <path d="M1000 320Q880 215 700 285Q620 318 560 330V400H1000Z" fill="url(#rbH2)" />

      {/* background trees */}
      <g className="sway">
        <rect x="118" y="200" width="11" height="100" rx="5" fill="#6b4a36" />
        <circle cx="123" cy="178" r="40" fill="#4f9660" />
        <circle cx="98" cy="200" r="26" fill="#5fa36b" />
        <circle cx="150" cy="198" r="28" fill="#6fae78" />
      </g>
      <g className="sway b">
        <rect x="888" y="215" width="10" height="85" rx="5" fill="#6b4a36" />
        <circle cx="893" cy="195" r="36" fill="#4a8f5b" />
        <circle cx="870" cy="214" r="22" fill="#5fa36b" />
        <circle cx="916" cy="212" r="24" fill="#6fae78" />
      </g>
      <g className="sway c">
        <rect x="248" y="228" width="7" height="68" rx="3" fill="#6b4a36" />
        <circle cx="251" cy="212" r="26" fill="#7dbb85" />
        <circle cx="236" cy="226" r="16" fill="#8cc794" />
      </g>
      <g className="sway">
        <rect x="772" y="232" width="7" height="66" rx="3" fill="#6b4a36" />
        <circle cx="775" cy="216" r="24" fill="#6fae78" />
        <circle cx="790" cy="230" r="15" fill="#86c28d" />
      </g>

      {/* ground */}
      <path
        d="M0 400V335Q0 305 90 297Q500 238 910 297Q1000 305 1000 335V400Z"
        fill="url(#rbSoil)"
      />
      <path
        d="M0 400V368Q300 346 500 362T1000 362V400Z"
        fill="#5c2d1a"
        opacity=".55"
      />
      <g fill="#3f9b55">
        <g className="grass">
          <path d="M60 300q-4-16 2-26q4 14 6 26z" />
          <path d="M70 300q2-14 10-20q-2 12-4 20z" />
        </g>
        <g className="grass" style={{ animationDelay: "-1.4s" }}>
          <path d="M290 289q-4-14 2-22q4 12 6 22z" />
          <path d="M300 289q2-12 9-17q-2 10-3 17z" />
        </g>
        <g className="grass" style={{ animationDelay: "-2.2s" }}>
          <path d="M610 280q-4-14 2-22q4 12 6 22z" />
          <path d="M620 280q2-12 9-17q-2 10-3 17z" />
        </g>
        <g className="grass" style={{ animationDelay: "-.8s" }}>
          <path d="M930 300q-4-16 2-26q4 14 6 26z" />
          <path d="M940 300q2-14 10-20q-2 12-4 20z" />
        </g>
      </g>

      {/* shadows */}
      <g fill="#3a1a0c" opacity=".35">
        <ellipse cx="505" cy="388" rx="52" ry="7" />
        <ellipse cx="730" cy="388" rx="54" ry="7" />
        <ellipse cx="260" cy="392" rx="64" ry="7" />
      </g>

      {/* left kneeling person */}
      <g className="breathe">
        <path d="M190 392Q205 335 250 330L300 345L290 392Z" fill="#2f3a4a" />
        <path d="M205 318Q215 285 255 288L290 330L245 345Z" fill="#d1553f" />
        <g className="dig">
          <path d="M270 318L335 335L330 350L262 340Z" fill="#e9a77a" />
          <path d="M330 336l16 4l-4 12l-16-4z" fill="#c9ced6" />
        </g>
        <circle cx="238" cy="282" r="25" fill="#e9a77a" />
        <path d="M210 276Q238 248 268 272L300 276L300 284L212 284Z" fill="#f2b52a" />
        <circle cx="250" cy="284" r="2" fill="#2b2410" />
        <circle cx="256" cy="292" r="4" fill="#f4a08a" opacity=".6" />
        {/* smile */}
        <path
          d="M250 297q6 4 12-2"
          stroke="#8a3a2a"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* growing sapling */}
      <g className="grow">
        <rect x="368" y="300" width="5" height="52" rx="2" fill="#3f8a50" />
        <ellipse cx="354" cy="312" rx="18" ry="8" fill="url(#rbLeaf)" transform="rotate(-30 354 312)" />
        <ellipse cx="388" cy="296" rx="18" ry="8" fill="url(#rbLeaf)" transform="rotate(30 388 296)" />
        <ellipse cx="358" cy="284" rx="16" ry="7" fill="url(#rbLeaf)" transform="rotate(-35 358 284)" />
        <ellipse cx="383" cy="270" rx="14" ry="7" fill="url(#rbLeaf)" transform="rotate(35 383 270)" />
        <ellipse cx="371" cy="256" rx="9" ry="14" fill="url(#rbLeaf)" />
      </g>
      <ellipse className="ripple" cx="371" cy="354" rx="14" ry="4" />
      <ellipse className="ripple r2" cx="371" cy="354" rx="14" ry="4" />
      <g className="spark" fill="#f2b52a">
        <path d="M308 352l4-10 4 10 10 4-10 4-4 10-4-10-10-4z" />
      </g>

      {/* center person with watering can */}
      <g className="breathe">
        <path d="M468 392L474 300H532L538 392Z" fill="#3d6c99" />
        <rect x="466" y="372" width="30" height="14" rx="4" fill="#f2b52a" />
        <rect x="512" y="372" width="30" height="14" rx="4" fill="#f2b52a" />
        <path d="M468 296Q470 236 505 234Q542 236 540 296Z" fill="#d1553f" />
        <path
          d="M465 190Q470 150 505 148Q542 152 542 195L548 250Q520 238 505 238Q480 238 470 262Z"
          fill="#2d2a36"
        />
        <circle cx="508" cy="200" r="25" fill="#e9a77a" />
        <circle cx="498" cy="200" r="2" fill="#2b2410" />
        <circle cx="494" cy="210" r="4" fill="#f4a08a" opacity=".6" />
        {/* smile */}
        <path
          d="M490 215q6 5 12 0"
          stroke="#8a3a2a"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <g className="can">
          <path d="M410 262h42v32H416z" fill="url(#rbCan)" />
          <path d="M410 266L386 252L382 258L410 280" fill="#4f95bf" />
          <path d="M452 270q22 0 22 22" stroke="#4f95bf" strokeWidth="5" fill="none" />
          <path className="stream" d="M384 258Q372 272 371 296" />
        </g>
        <path d="M474 262L452 280L460 290L486 276Z" fill="#e9a77a" />
      </g>

      {/* sign */}
      <g>
        <rect x="590" y="300" width="5" height="62" fill="#c9b79c" />
        <rect x="560" y="268" width="66" height="46" rx="6" fill="#fff" stroke="#c9b79c" />
        <circle cx="593" cy="289" r="12" fill="#2f8f55" />
        <rect x="591" y="297" width="4" height="10" fill="#6b4a36" />
      </g>

      {/* right person with pot */}
      <g className="breathe">
        <path d="M700 392L706 310H752L758 392Z" fill="#3d6c99" />
        <rect x="698" y="374" width="30" height="14" rx="4" fill="#f2b52a" />
        <rect x="738" y="374" width="30" height="14" rx="4" fill="#f2b52a" />
        <path d="M696 312Q696 252 728 250Q764 252 764 312Z" fill="#fff" />
        <circle cx="730" cy="222" r="25" fill="#8a5a3f" />
        {/* eye + smile */}
        <circle cx="720" cy="221" r="2" fill="#2b1a10" />
        <path
          d="M712 231q6 5 12 0"
          stroke="#2b1a10"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="730" cy="204" rx="38" ry="6" fill="#c98c4e" />
        <path d="M706 204Q710 168 760 172Q750 190 752 204Z" fill="#d79a58" />
        <g className="pot">
          <path d="M640 286h54l-6 42h-42z" fill="#b97a45" />
          <rect x="636" y="280" width="62" height="9" rx="3" fill="#a46834" />
          <path d="M667 280Q650 250 640 246Q648 270 667 280Z" fill="url(#rbLeaf)" />
          <path d="M667 280Q690 248 702 246Q690 272 667 280Z" fill="url(#rbLeaf)" />
          <path d="M667 280Q664 250 667 236Q672 258 667 280Z" fill="#6bc97c" />
        </g>
        <path d="M700 292L688 312L680 304L694 282Z" fill="#fff" />
      </g>
      <g className="sway b">
        <path d="M800 352h36l-4 30h-28z" fill="#b97a45" />
        <path
          d="M818 352Q805 330 800 326Q806 346 818 352ZM818 352Q834 332 840 328Q832 346 818 352Z"
          fill="url(#rbLeaf)"
        />
      </g>

      {/* butterfly */}
      <g className="bfly">
        <g transform="translate(560 230)">
          <ellipse className="bw" cx="-5" cy="0" rx="6" ry="4" fill="#f2b52a" />
          <ellipse className="bw r" cx="5" cy="0" rx="6" ry="4" fill="#f08a4b" />
        </g>
      </g>

      {/* pollen */}
      <circle className="dust" cx="420" cy="330" r="2.5" />
      <circle className="dust d2" cx="600" cy="250" r="2" />
      <circle className="dust d3" cx="820" cy="300" r="3" />
      <circle className="dust d4" cx="180" cy="280" r="2.5" />
    </svg>
  );
}