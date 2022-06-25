import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};

initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth();
const colRef = collection(db, "books");
// getDocs(colRef)
//   .then((snapshot) => {
//     let books = [];
//     snapshot.docs.forEach((doc) => {
//       books.push({ ...doc.data(), id: doc.id });
//     });
//     console.log(books);
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });
//where("author", "==", "patrick"),
const q = query(
  colRef,

  orderBy("createdAt")
);

const unsubCol = onSnapshot(q, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log(books);
});

const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addBookForm.reset();
  });
});

const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", deleteBookForm.id.value);
  deleteDoc(docRef).then(() => {
    deleteBookForm.reset();
  });
});

// get a single doc

const docRef = doc(db, "books", "FXxg7Tq7HCb9q7gouoxk");

getDoc(docRef).then((doc) => {
  console.log(doc.data(), doc.id);
});

const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data());
});

// sign up
const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signupForm.email.value;
  const password = signupForm.password.value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("user created", cred.user);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// logging in & out

const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", () => {
  signOut(auth).then(() => {
    console.log("the user signed out");
  });
});

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  signInWithEmailAndPassword(auth, email, password).then((cred) =>
    console.log("user logged in: ", cred.user)
  );
});

// subscribe to AUTH change.
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log("User Status:", user);
});

// Unsubscribe
const unsubButton = document.querySelector(".unsub");
console.log(unsubButton);
unsubButton.addEventListener("click", () => {
  console.log("unsubscribed subscriptions:");
  unsubAuth();
  unsubCol();
  unsubDoc();
});
