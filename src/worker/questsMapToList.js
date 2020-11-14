export function questsMapToList(map) {
  return Object.values(map).reduce((quests, value) => {
    quests.push(...value);

    return quests;
  }, []);
}
