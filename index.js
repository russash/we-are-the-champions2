import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://champions-c3872-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementListInDB = ref(database, "endorsementList");

const InputFieldEl = document.getElementById("input-field");
const fromFieldEl = document.getElementById("from-field");
const toFieldEl = document.getElementById("to-field");
const publishButtonEl = document.getElementById("publish-button");
const endorsementListEl = document.getElementById("endorsement-list");
const likeBoxEl = document.getElementById("like-box");

publishButtonEl.addEventListener("click", function () {
  let objectValue = {
    inputValue: InputFieldEl.value,
    fromValue: fromFieldEl.value,
    toValue: toFieldEl.value,
  };
  // let inputValue = InputFieldEl.value;

  // Prevent people publishing empty endorsements
  if (objectValue) {
    push(endorsementListInDB, objectValue);
  }
  clearText();
});

onValue(endorsementListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearEndorsementListEl();

    for (let i = itemsArray.length - 1; i > 0; i--) {
      console.log(itemsArray[i]);
      let currentItem = itemsArray[i];
      appendItemToEndorsementList(currentItem);
    }
  } else {
    endorsementListEl.innerHTML = "No endorsements written yet...";
  }
});

function appendItemToEndorsementList(item) {
  let inputID = item[0];
  let inputValue = item[1].inputValue;
  let fromValue = item[1].fromValue;
  let toValue = item[1].toValue;

  let newEl = document.createElement("li");
  let likeStringTest = document.createElement("div");

  let fromString = `<div class="bold">To ${toValue}</div>`;
  let inputString = `<p>${inputValue}</p>`;
  let ToString = `<div class="bold">From ${fromValue}</div>`;

  // Not sure yet how to addEventListener to this part, plan to use localStorage for likes tracking.
  let likeString = `<div class="like-box">❤ 4</div>`;

  newEl.innerHTML = fromString + inputString + ToString + likeString;

  newEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `endorsementList/${inputID}`);
    remove(exactLocationOfItemInDB);
  });

  endorsementListEl.append(newEl);
}

function clearText() {
  InputFieldEl.value = "";
  fromFieldEl.value = "";
  toFieldEl.value = "";
}

function clearEndorsementListEl() {
  endorsementListEl.textContent = "";
}
