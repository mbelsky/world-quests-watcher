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
}
