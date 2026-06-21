export function LineIcon({ type, className = "training-line-icon" }) {
  if (type === "chart") {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 19V9" />
        <path d="M12 19V5" />
        <path d="M19 19v-7" />
        <path d="M4 19h16" />
      </svg>
    );
  }

  if (type === "leaf") {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 15c7.5.8 12.8-3.8 15-10-7.3.4-13.4 3.5-15 10Z" />
        <path d="M4 15c1.9-2.1 4.5-3.7 8-4.8" />
        <path d="M7 19c1.2-2.4 2.8-4.3 5-5.8" />
      </svg>
    );
  }

  if (type === "hand") {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 12V5.5a1.4 1.4 0 0 1 2.8 0V12" />
        <path d="M10.8 12V4.5a1.4 1.4 0 0 1 2.8 0V12" />
        <path d="M13.6 12V6a1.35 1.35 0 0 1 2.7 0v7" />
        <path d="M16.3 13V8.5a1.3 1.3 0 0 1 2.6 0V15c0 3.2-2.6 5.4-5.7 5.4h-1.1c-2.4 0-4.2-1-5.6-3L4.2 14a1.45 1.45 0 0 1 2.3-1.7L8 14" />
      </svg>
    );
  }

  if (type === "heart") {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20S4.8 15.7 4.8 9.6c0-2.3 1.7-4.1 3.9-4.1 1.4 0 2.6.7 3.3 1.8.7-1.1 1.9-1.8 3.3-1.8 2.2 0 3.9 1.8 3.9 4.1C19.2 15.7 12 20 12 20Z" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
