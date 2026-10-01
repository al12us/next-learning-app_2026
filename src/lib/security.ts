export function htmlEscape(input: string): string {
  if (!input) return "";
  
  const escapeMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  };

  return String(input).replace(/[&<>"']/g, (c: string) => escapeMap[c]);
}
