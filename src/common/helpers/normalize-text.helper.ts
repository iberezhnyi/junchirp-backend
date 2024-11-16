export const normalizeText = (input: string): string => {
  const unwantedApostrophes = /[‘’`´‛ʹʼʽ]/g
  const unwantedDashes = /[‐‑‒–—―−]/g

  const normalized = input.replace(unwantedApostrophes, "'")

  return normalized.replace(unwantedDashes, '-')
}
