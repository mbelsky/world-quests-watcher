export function makeActiveQuestsMessage(quests) {
  if (quests.length === 0) {
    return undefined;
  }

  const strList = quests.map((quest) => {
    const { href, name } = quest;
    return `— "${name}" https://www.wowhead.com${href}\n`;
  });

  return `
Today active quests:

${strList.join("")}
`.trim();
}
