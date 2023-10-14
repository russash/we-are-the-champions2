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
const publishButtonEl = document.getElementById("publish-button");
const endorsementListEl = document.getElementById("endorsement-list");

publishButtonEl.addEventListener("click", function () {
  let inputValue = InputFieldEl.value;

  push(endorsementListInDB, inputValue);

  clearInputFieldEl();
});

onValue(endorsementListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearEndorsementListEl();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      // let currentItemID = currentItem[0];
      // let currentItemValue = currentItem[1];

      // appendItemToEndorsementList(itemsArray[i]);
      appendItemToEndorsementList(currentItem);
    }
  } else {
    endorsementListEl.innerHTML = "No endorsements written yet...";
  }
});

function appendItemToEndorsementList(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");

  newEl.textContent = itemValue;

  newEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `endorsementList/${itemID}`);
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
