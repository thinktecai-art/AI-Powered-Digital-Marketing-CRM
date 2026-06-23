import { initializeApp } from 'firebase/app';
import { 
  initializeFirestore, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  deleteDoc,
  getDocs,
  writeBatch,
  query,
  where
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

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Sync Contacts with Firestore in real-time.
 * If Firestore is empty for the user, we seed it with the provided initial contacts.
 */
export function syncContacts(
  uid: string,
  onUpdate: (contacts: Contact[]) => void,
  initialContacts: Contact[]
) {
  const contactsCol = collection(db, 'contacts');
  const q = query(contactsCol, where('userId', '==', uid));

  // Real-time listener
  return onSnapshot(q, async (snapshot) => {
    if (snapshot.empty) {
      console.log("Firestore contacts collection is empty for user. Seeding INITIAL_CONTACTS...");
      try {
        const batch = writeBatch(db);
        for (const contact of initialContacts) {
          const namespacedId = `${contact.id}-${uid}`;
          const contactRef = doc(db, 'contacts', namespacedId);
          batch.set(contactRef, { ...contact, id: namespacedId, userId: uid });
        }
        await batch.commit();
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'contacts');
      }
    } else {
      const contactsList: Contact[] = [];
      snapshot.forEach((docSnap) => {
        contactsList.push(docSnap.data() as Contact);
      });
      console.log(`Synced ${contactsList.length} contacts from Firestore for user ${uid}.`);
      onUpdate(contactsList);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'contacts');
  });
}

/**
 * Add or update a Contact in Firestore
 */
export async function saveContactToFirestore(contact: Contact) {
  try {
    const contactRef = doc(db, 'contacts', contact.id);
    const uid = auth.currentUser?.uid || 'anonymous';
    await setDoc(contactRef, { ...contact, userId: uid });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `contacts/${contact.id}`);
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
    handleFirestoreError(error, OperationType.DELETE, `contacts/${contactId}`);
  }
}

/**
 * Sync Funnels with Firestore in real-time.
 */
export function syncFunnels(
  uid: string,
  onUpdate: (funnels: Funnel[]) => void,
  initialFunnels: Funnel[]
) {
  const funnelsCol = collection(db, 'funnels');
  const q = query(funnelsCol, where('userId', '==', uid));

  return onSnapshot(q, async (snapshot) => {
    if (snapshot.empty) {
      console.log("Firestore funnels collection is empty for user. Seeding SEED_FUNNEL...");
      try {
        const batch = writeBatch(db);
        for (const funnel of initialFunnels) {
          const namespacedId = `${funnel.id}-${uid}`;
          const funnelRef = doc(db, 'funnels', namespacedId);
          batch.set(funnelRef, { ...funnel, id: namespacedId, userId: uid });
        }
        await batch.commit();
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'funnels');
      }
    } else {
      const funnelsList: Funnel[] = [];
      snapshot.forEach((docSnap) => {
        funnelsList.push(docSnap.data() as Funnel);
      });
      onUpdate(funnelsList);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'funnels');
  });
}

/**
 * Add or update a Funnel in Firestore
 */
export async function saveFunnelToFirestore(funnel: Funnel) {
  try {
    const funnelRef = doc(db, 'funnels', funnel.id);
    const uid = auth.currentUser?.uid || 'anonymous';
    await setDoc(funnelRef, { ...funnel, userId: uid });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `funnels/${funnel.id}`);
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
    handleFirestoreError(error, OperationType.GET, `subscriptions/${userId}`);
  });
}

