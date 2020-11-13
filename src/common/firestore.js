import admin from "firebase-admin";

const credential = admin.credential.cert(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential,
});

export const db = admin.firestore();
