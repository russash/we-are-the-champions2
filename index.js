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
    clearInputFieldEl();
  }
});

onValue(endorsementListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());
    console.log(itemsArray);

    clearEndorsementListEl();

    for (let i = 0; i < itemsArray.length; i++) {
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

  newEl.innerHTML = `<div class="bold">To ${toValue}</div><p>${inputValue}</p><div class="bold">From ${fromValue}</div>`;

  newEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `endorsementList/${inputID}`);
    remove(exactLocationOfItemInDB);
  });

  endorsementListEl.append(newEl);
}

function clearInputFieldEl() {
  InputFieldEl.value = "";
}

function clearEndorsementListEl() {
  endorsementListEl.textContent = "";
}
