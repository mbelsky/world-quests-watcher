export function getHandler(text, map) {
  if (!text.startsWith("!")) {
    return undefined;
  }

  const [command] = text.substring(1).split(" ");

  return map[command];
}
