import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, addDoc, query, orderBy, enableNetwork } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { ItineraryItem } from './types';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7tH-b_AVzEcxlhoKU7yG1lf3nsVk76o4",
  authDomain: "petangel-test.firebaseapp.com",
  projectId: "petangel-test",
  storageBucket: "petangel-test.appspot.com",
  messagingSenderId: "692900035940",
  appId: "1:692900035940:web:1004d7fb58814cd401ce71"
};

let db: any = null;
let isConfigured = false;
let auth: any = null;

try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  console.log("🔥 [Firebase Init] Project ID:", app.options.projectId);
  
  db = getFirestore(app);
  auth = getAuth(app);
  
  // Try to sign in anonymously, but don't block DB usage if it fails
  // (The DB might be in Public/Test mode which doesn't require auth)
  signInAnonymously(auth)
    .then((userCredential) => {
        console.log("✅ [Auth] Anonymous login success. UID:", userCredential.user.uid);
    })
    .catch((error) => {
        console.warn("⚠️ [Auth] Anonymous login failed:", error.message);
        console.warn("⚠️ Will attempt to access Firestore anyway (expecting Test Mode rules).");
    });

  isConfigured = true;
} catch (error) {
  console.error("❌ [Firebase Init] Error:", error);
}

export const subscribeToItinerary = (callback: (items: ItineraryItem[]) => void) => {
  if (!isConfigured || !db) return () => {};

  console.log("📡 [Firestore] Subscribing to updates...");

  const q = query(collection(db, "itinerary"), orderBy("time"));
  
  const unsubscribe = onSnapshot(q, (querySnapshot: any) => {
    const items: ItineraryItem[] = [];
    querySnapshot.forEach((doc: any) => {
      items.push({ id: doc.id, ...doc.data() } as ItineraryItem);
    });
    // console.log("📥 [Firestore] Received updates:", items.length, "items");
    callback(items);
  }, (error: any) => {
    console.error("❌ [Firestore] Subscription Error:", error.message);
    if (error.code === 'permission-denied') {
        console.error("🚨 權限不足！請檢查 Firebase Console > Firestore Database > Rules");
        console.error("🚨 請暫時設為: allow read, write: if true;");
    }
  });

  return unsubscribe;
};

export const addItemToFirebase = async (item: ItineraryItem) => {
  if (!isConfigured || !db) {
    console.error("❌ [Firestore] DB not initialized, cannot write.");
    return;
  }

  // Remove id from payload as Firestore generates it
  const { id, ...data } = item;
  
  console.log("🔥 [Firestore] Attempting to write:", data.title);

  try {
    const docRef = await addDoc(collection(db, "itinerary"), data);
    console.log("✅ [Firestore] Write Success! Document ID:", docRef.id);
  } catch (e: any) {
    console.error("❌ [Firestore] Write Failed:", e.message);
    if (e.code === 'permission-denied') {
        alert("寫入失敗：權限不足。\n請到 Firebase Console 開啟 'Test Mode' 或修改 Rules。");
    }
  }
};

export { isConfigured };