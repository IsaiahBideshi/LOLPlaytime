import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBAzy8xTtYJUjO4rwX-WqStHbs8oPBz9JA",
    authDomain: "lolplaytime-907d3.firebaseapp.com",
    projectId: "lolplaytime-907d3",
    storageBucket: "lolplaytime-907d3.firebasestorage.app",
    messagingSenderId: "282587656858",
    appId: "1:282587656858:web:383d220dae37201bbce523",
    measurementId: "G-RCYZPS1DWJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const apiKey = "myapikey"; // Replace with your actual API key
let username = "";
let region = "";
let tag = "";
let name = "";
let puuid = "";

const options = {
    method: "GET",
    headers: {
        "X-Riot-Token": apiKey,
    },
};

console.log("Your API Key:", apiKey);

//get data from form1
const searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(searchForm);
    username = formData.get("username");
    region = formData.get("region").toLowerCase();

    if (username.length > 0){
        const usernameParts = username.split("#");
        if (usernameParts.length === 2) {
            name = usernameParts[0];
            tag = usernameParts[1];
        } else {
            console.log("Name not found");
            return;
        }
    }

    console.log("Username:", username);
    console.log("Region:", region);
    console.log("Tag:", tag);
    console.log("Name:", name);

    let response = await fetch(
        `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}`, options);
    let data = await response.json();
    console.log(data);
    puuid = data.puuid;
    console.log("puuid: ", puuid);

    // Check if the user already exists in Firestore
    let userRef = doc(db, "Users", puuid);
    let userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
        console.log("User already exists in Firestore");
        // You can update the user data here if needed
    } else {
        console.log("User does not exist in Firestore, creating new user");
        // Create a new user document in Firestore
        await setDoc(userRef, {
            name: name,
            username: username,
            region: region,
            tag: tag,
            puuid: puuid,
        });
    }

    let matches = ['filler data', 'filler data'];
    let matchCount = 0;
    console.log(matches);

    while (matches.length > 0 ){
        matches = [];
        response = await fetch(`https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${matchCount}&count=100`, options);
        data = await response.json();

        console.log(data);
        matches = data;
        matchCount += matches.length;
    }
    console.log(matchCount);
});