type WordmarkProps = {
  className?: string;
};

/**
 * FURMOSA 字標：以真實文字排字，只把 O 換成挖空爪印的圓盤，
 * 這樣字距與字重仍由字體負責，縮放到任何尺寸都不會失真。
 */
export default function Wordmark({ className }: WordmarkProps) {
  return (
    <span
      className={className ? `rf-wordmark ${className}` : "rf-wordmark"}
      role="img"
      aria-label="FURMOSA"
    >
      <span aria-hidden="true">FURM</span>
      <svg
        className="rf-wordmark__o"
        viewBox="0 0 100 100"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="50" cy="50" r="50" fill="currentColor" />
        <g fill="var(--rf-wordmark-knockout, #f4f1ea)">
          <ellipse cx="50" cy="63" rx="21" ry="17" />
          <ellipse cx="26" cy="43" rx="8.4" ry="11.4" transform="rotate(-20 26 43)" />
          <ellipse cx="42" cy="30" rx="8.4" ry="12" />
          <ellipse cx="58" cy="30" rx="8.4" ry="12" />
          <ellipse cx="74" cy="43" rx="8.4" ry="11.4" transform="rotate(20 74 43)" />
        </g>
      </svg>
      <span aria-hidden="true">SA</span>
    </span>
  );
}
