const QUESTS_COLLECTION = "quests";

export class QuestsManager {
  #db;

  constructor(db) {
    this.#db = db;
  }

  create = async (quests) => {
    const batch = this.#db.batch();

    quests.forEach((quest) => {
      const { id, region } = quest;
      const docId = `${region}-${id}`;

      const ref = this.#db.collection(QUESTS_COLLECTION).doc(docId);
      batch.set(ref, quest);
    });

    await batch.commit();
  };

  get = async () => {
    const questsRef = this.#db.collection(QUESTS_COLLECTION);

    const snapshot = await questsRef.get();

    return snapshot.docs.map((doc) => doc.data());
  };

  delete = async () => {
    const query = this.#db.collection(QUESTS_COLLECTION);
    const quests = await query.get();

    const batch = this.#db.batch();

    quests.docs.forEach(({ doc }) => batch.delete(doc));

    await batch.commit();
  };
}
