/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions";
import { onCall } from "firebase-functions/v2/https";
// import {onDocumentDeleted} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";

initializeApp();
// const db = getFirestore();
// const auth = getAuth();

setGlobalOptions({
  maxInstances: 10,
  region: "asia-south1"
});

/*
// Cascading delete: When a user is deleted from Firestore, delete their Auth account and Books
export const onUserDeleted = onDocumentDeleted("users/{userId}", async (event) => {
  const userId = event.params.userId;
  logger.info(`Starting cleanup for deleted user: ${userId}`);

  try {
    // 1. Delete associated books
    const booksRef = db.collection("books");
    const query = booksRef.where("authorId", "==", userId);
    const snapshot = await query.get();
    
    if (snapshot.size > 0) {
      const batch = db.batch();
      snapshot.forEach((doc: any) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      logger.info(`Deleted ${snapshot.size} books for user: ${userId}`);
    }

    // 2. Delete Firebase Auth user
    try {
      await auth.deleteUser(userId);
      logger.info(`Successfully deleted Auth user: ${userId}`);
    } catch (authError: any) {
      // If user doesn't exist in Auth, just log it (might have been deleted already)
      if (authError.code === 'auth/user-not-found') {
        logger.info(`Auth user ${userId} already deleted or not found.`);
      } else {
        throw authError;
      }
    }
    
  } catch (error) {
    logger.error(`Error during cleanup for user ${userId}:`, error);
  }
});
*/



export const helloWorld = onCall({ cors: true }, (request) => {
  logger.info("Hello logs!", { structuredData: true });
  return "Hello from Firebase!";
});
