import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA--y48rZEOG9jc50icr7pLgQgxeNYQry4",
  authDomain: "sharebots-c6cf2.firebaseapp.com",
  projectId: "sharebots-c6cf2",
  storageBucket: "sharebots-c6cf2.firebasestorage.app",
  messagingSenderId: "94137535888",
  appId: "1:94137535888:web:9c1ada079cc5afc369f715",
  measurementId: "G-3RFWNDRYPM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Bot ekleme fonksiyonu
async function addBot(url, ownerId) {
  try {
    const docRef = await addDoc(collection(db, "bots"), {
      url: url,
      owner: ownerId,
      createdAt: new Date()
    });
    console.log("Bot eklendi, ID:", docRef.id);
  } catch (e) {
    console.error("Bot eklenirken hata:", e);
  }
}

// Botları listeleme fonksiyonu
async function getBotsByOwner(ownerId) {
  const botsRef = collection(db, "bots");
  const q = query(botsRef, where("owner", "==", ownerId));
  const querySnapshot = await getDocs(q);
  const bots = [];
  querySnapshot.forEach((doc) => {
    bots.push({ id: doc.id, ...doc.data() });
  });
  return bots;
}

// UI elementlerini yakala
const urlInput = document.getElementById("botUrl");
const ownerInput = document.getElementById("ownerId");
const addBtn = document.getElementById("addBotBtn");
const botsList = document.getElementById("botsList");

// Buton event handler
addBtn.addEventListener("click", async () => {
  const url = urlInput.value.trim();
  const owner = ownerInput.value.trim();
  if (!url || !owner) {
    alert("Lütfen bot URL'si ve sahip ID girin.");
    return;
  }

  await addBot(url, owner);

  // Listeyi güncelle
  const bots = await getBotsByOwner(owner);
  botsList.innerHTML = "";
  bots.forEach(bot => {
    const li = document.createElement("li");
    li.textContent = `${bot.url} (Sahip: ${bot.owner})`;
    botsList.appendChild(li);
  });

  // Inputları temizle
  urlInput.value = "";
  ownerInput.value = "";
});
