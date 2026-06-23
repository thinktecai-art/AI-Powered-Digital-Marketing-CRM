import { initializeApp } from 'firebase/app';
import { 
  initializeFirestore, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  deleteDoc,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithPopup, 
  signOut, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { Contact, Funnel } from './types';

const firebaseConfig = {
  apiKey: "AIzaSyCK1toGkS-6A7WBU7Y4PjJDyFVv76ldZDA",
  authDomain: "ai-studio-applet-webapp-a6050.firebaseapp.com",
  projectId: "ai-studio-applet-webapp-a6050",
  storageBucket: "ai-studio-applet-webapp-a6050.firebasestorage.app",
  messagingSenderId: "1059380352470",
  appId: "1:1059380352470:web:1f21706a8376a373c20077"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId
export const db = initializeFirestore(app, {}, "ai-studio-b1d51413-2ece-41be-8f7c-562881668305");

// Initialize Firebase Auth
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

export { onAuthStateChanged };
export type { User };

/**
 * Sync Contacts with Firestore in real-time.
 * If Firestore is empty, we seed it with the provided initial contacts.
 */
export function syncContacts(
  onUpdate: (contacts: Contact[]) => void,
  initialContacts: Contact[]
) {
  const contactsCol = collection(db, 'contacts');

  // Real-time listener
  return onSnapshot(contactsCol, async (snapshot) => {
    if (snapshot.empty) {
      console.log("Firestore contacts collection is empty. Seeding INITIAL_CONTACTS...");
      try {
        const batch = writeBatch(db);
        for (const contact of initialContacts) {
          const contactRef = doc(db, 'contacts', contact.id);
          batch.set(contactRef, contact);
        }
        await batch.commit();
      } catch (err) {
        console.error("Error seeding initial contacts to Firestore:", err);
      }
    } else {
      const contactsList: Contact[] = [];
      snapshot.forEach((docSnap) => {
        contactsList.push(docSnap.data() as Contact);
      });
      console.log(`Synced ${contactsList.length} contacts from Firestore.`);
      onUpdate(contactsList);
    }
  }, (error) => {
    console.error("Error in onSnapshot contacts listener:", error);
  });
}

/**
 * Add or update a Contact in Firestore
 */
export async function saveContactToFirestore(contact: Contact) {
  try {
    const contactRef = doc(db, 'contacts', contact.id);
    await setDoc(contactRef, contact);
  } catch (error) {
    console.error("Error saving contact to Firestore:", error);
  }
}

/**
 * Delete a Contact from Firestore
 */
export async function deleteContactFromFirestore(contactId: string) {
  try {
    const contactRef = doc(db, 'contacts', contactId);
    await deleteDoc(contactRef);
  } catch (error) {
    console.error("Error deleting contact from Firestore:", error);
  }
}

/**
 * Sync Funnels with Firestore in real-time.
 */
export function syncFunnels(
  onUpdate: (funnels: Funnel[]) => void,
  initialFunnels: Funnel[]
) {
  const funnelsCol = collection(db, 'funnels');

  return onSnapshot(funnelsCol, async (snapshot) => {
    if (snapshot.empty) {
      console.log("Firestore funnels collection is empty. Seeding SEED_FUNNEL...");
      try {
        const batch = writeBatch(db);
        for (const funnel of initialFunnels) {
          const funnelRef = doc(db, 'funnels', funnel.id);
          batch.set(funnelRef, funnel);
        }
        await batch.commit();
      } catch (err) {
        console.error("Error seeding initial funnels to Firestore:", err);
      }
    } else {
      const funnelsList: Funnel[] = [];
      snapshot.forEach((docSnap) => {
        funnelsList.push(docSnap.data() as Funnel);
      });
      onUpdate(funnelsList);
    }
  }, (error) => {
    console.error("Error in onSnapshot funnels listener:", error);
  });
}

/**
 * Add or update a Funnel in Firestore
 */
export async function saveFunnelToFirestore(funnel: Funnel) {
  try {
    const funnelRef = doc(db, 'funnels', funnel.id);
    await setDoc(funnelRef, funnel);
  } catch (error) {
    console.error("Error saving funnel to Firestore:", error);
  }
}

/**
 * Sync dynamic subscription status with Firestore in real-time.
 */
export function syncSubscription(
  userId: string,
  onUpdate: (subscription: any) => void
) {
  const subDoc = doc(db, 'subscriptions', userId);
  return onSnapshot(subDoc, (docSnap) => {
    if (docSnap.exists()) {
      onUpdate(docSnap.data());
    } else {
      onUpdate(null);
    }
  }, (error) => {
    console.error("Error syncing user subscription from Firestore:", error);
  });
}

