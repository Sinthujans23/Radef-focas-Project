const PALETTE = [
  "bg-saffron-600",
  "bg-maroon-700",
  "bg-gold-600",
  "bg-maroon-600",
  "bg-saffron-700",
];

export function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function initialsForName(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((word) => /[A-Za-z0-9]/.test(word));
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
