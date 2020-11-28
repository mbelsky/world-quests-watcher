const USERS_COLLECTION = "users";

export class UsersManager {
  #db;

  constructor(db) {
    this.#db = db;
  }

  get = async () => {
    const usersRef = this.#db.collection(USERS_COLLECTION);

    const snapshot = await usersRef.get();

    return snapshot.docs.map((doc) => doc.data());
  };

  addQuests = async (user, quests) => {
    const userRef = this.#db.collection(USERS_COLLECTION).doc(user);

    let result;

    await this.#db.runTransaction(async (t) => {
      const doc = await t.get(userRef);

      if (doc.exists) {
        const { subscriptions = [] } = doc.data();
        result = [...new Set([...subscriptions, ...quests])];

        t.update(userRef, { subscriptions: result });
      } else {
        // TODO: doc does not exist
      }
    });

    return result;
  };

  removeAllQuests = async (user) => {
    const userRef = this.#db.collection(USERS_COLLECTION).doc(user);

    await userRef.set({ subscriptions: [] }, { merge: true });
  };

  removeQuests = async (user, quests) => {
    const userRef = this.#db.collection(USERS_COLLECTION).doc(user);

    let result;

    await this.#db.runTransaction(async (t) => {
      const doc = await t.get(userRef);

      if (doc.exists) {
        const questsSet = new Set(quests);
        const { subscriptions = [] } = doc.data();

        result = subscriptions.filter((sub) => {
          return !questsSet.has(sub);
        });

        t.update(userRef, { subscriptions: result });
      } else {
        // TODO: doc does not exist
      }
    });

    return result;
  };

  listQuests = async (user) => {
    const userRef = this.#db.collection(USERS_COLLECTION).doc(user);

    const doc = await userRef.get();

    if (doc.exists) {
      return doc.data().subscriptions ?? [];
    } else {
      return [];
    }
  };

  setRegion = async (user, region) => {
    const userRef = this.#db.collection(USERS_COLLECTION).doc(user);

    await userRef.set({ region }, { merge: true });
  };
}
