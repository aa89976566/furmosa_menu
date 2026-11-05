/**
 * Abstract earth-pigment field. Flat mineral colours and a paper grain —
 * no photographic stock, no colour gradient.
 */
export function PigmentField() {
  return (
    <svg
      className="pigment-field"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden="true"
    >
      <defs>
        <filter id="pigment-edge" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.018"
            numOctaves="3"
            seed="4"
            result="warp"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="warp"
            scale="32"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter id="paper-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            seed="11"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0.42
                    0 0 0 0 0.3
                    0 0 0 0 0.16
                    0 0 0 0.16 0"
          />
        </filter>
      </defs>

      <rect width="1440" height="900" fill="#f3eee6" />

      <g filter="url(#pigment-edge)">
        <path
          fill="#e4d8c4"
          d="M820 90C1040 20 1380 80 1420 300C1460 530 1280 780 1080 820C860 870 680 720 700 470C720 250 620 150 820 90Z"
        />
        <path
          fill="#c4893a"
          d="M900 150C1080 90 1300 150 1340 320C1380 500 1260 660 1100 710C940 760 820 640 830 470C840 310 740 210 900 150Z"
        />
        <path
          fill="#a56b2d"
          d="M1040 250C1140 210 1240 270 1220 360C1200 450 1080 470 1020 400C960 330 960 280 1040 250Z"
        />
        <path
          fill="#8a4e34"
          d="M930 470C1060 420 1180 510 1140 650C1100 790 940 800 870 670C810 550 820 510 930 470Z"
        />
        <path
          fill="#6e3b28"
          d="M990 540C1060 510 1120 560 1100 630C1080 700 990 710 950 650C910 590 930 560 990 540Z"
        />
        <path
          fill="#2c2824"
          opacity="0.78"
          d="M1185 230C1265 190 1345 250 1315 335C1285 420 1170 400 1148 320C1130 265 1135 250 1185 230Z"
        />
      </g>

      <g fill="#6e3b28">
        <rect x="1260" y="180" width="7" height="5" opacity="0.55" />
        <rect x="1310" y="430" width="5" height="4" opacity="0.4" />
        <rect x="980" y="760" width="6" height="4" opacity="0.45" />
        <rect x="1400" y="560" width="8" height="5" opacity="0.35" />
        <rect x="860" y="300" width="4" height="3" opacity="0.35" />
        <rect x="150" y="640" width="5" height="3" opacity="0.28" />
        <rect x="240" y="210" width="4" height="3" opacity="0.22" />
      </g>

      <path
        d="M520 690C700 650 880 730 1080 680"
        fill="none"
        stroke="#8a4e34"
        strokeWidth="7"
        strokeLinecap="square"
        opacity="0.35"
      />

      <rect width="1440" height="900" filter="url(#paper-grain)" />
    </svg>
  );
}
