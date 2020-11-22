export function parseQuestId(text = "") {
  const quests = text.match(/\d{2,}/g) ?? [];

  return [...new Set(quests)];
}
