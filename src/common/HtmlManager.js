const HTML_COLLECTION = "html";

export class HtmlManager {
  #db;

  constructor(db) {
    this.#db = db;
  }

  create = async (htmlMap) => {
    const batch = this.#db.batch();

    Object.entries(htmlMap).forEach((entry) => {
      const [key, value] = entry;

      const ref = this.#db.collection(HTML_COLLECTION).doc();
      batch.set(ref, {
        key,
        value,
      });
    });

    await batch.commit();
  };

  delete = async () => {
    const query = this.#db.collection(HTML_COLLECTION);
    const quests = await query.get();

    const batch = this.#db.batch();

    quests.docs.forEach((doc) => batch.delete(doc.ref));

    await batch.commit();
  };
}
