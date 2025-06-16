import admin from "firebase-admin";

const serviceAccount = require("../../../../serviceAccount");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: "https://kursach-d9304-default-rtdb.firebaseio.com",
});

export const auth = admin.auth();
export const fireStore = admin.firestore();
