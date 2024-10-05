import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyA08KvmhAE-EFwA1B7sRfoaxELYEkVxS0c",
  authDomain: "swift-chat-8b6c3.firebaseapp.com",
  projectId: "swift-chat-8b6c3",
  storageBucket: "swift-chat-8b6c3.appspot.com",
  messagingSenderId: "965818689602",
  appId: "1:965818689602:web:f0f3912a7da78a27ad25db"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signUp = async (username, email, password)=>{
  try {
    const res = await createUserWithEmailAndPassword(auth,email, password);
    const user = res.user;

    await setDoc(doc(db,"users",user.uid), {
      id : user.uid,
      username : username.toLowerCase(),
      email : email,
      name: "",
      avatar: "",
      bio: "Hey there! Let's chat",
      lastSeen: Date.now()
    })

    await setDoc(doc(db,"chats",user.uid), {
      chatData: []
    })

    
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split('-').join(" "));
  }
}

const signIn =  async (email, password) =>{
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split('-').join(" "));
  }
}

const logout = async ()=>{
  try {
    await signOut(auth);    
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split('-').join(" "));
  }
}

export {signUp, signIn, logout, auth, db}