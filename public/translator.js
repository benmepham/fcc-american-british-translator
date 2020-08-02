import { americanOnly } from "./american-only.js";
import { britishOnly } from "./british-only.js";
import { americanToBritishSpelling } from "./american-to-british-spelling.js";
import { americanToBritishTitles } from "./american-to-british-titles.js";

const translateBtn = document.getElementById("translate-btn"),
  clearBtn = document.getElementById("clear-btn"),
  translationLanguage = document.getElementById("locale-select"),
  textArea = document.getElementById("text-input"),
  translationDiv = document.getElementById("translated-sentence"),
  errorDiv = document.getElementById("error-msg");

const britishToAmericanSpelling = reverseDict(americanToBritishSpelling),
  britishToAmericanTitles = reverseDict(americanToBritishTitles);

function reverseDict(obj) {
  const objReturn = {};
  Object.keys(obj).forEach(key => {
    objReturn[obj[key]] = key;
  });
  return objReturn;
}

function clearAll() {
  return (
    (textArea.value = ""),
    (translationDiv.textContent = ""),
    (errorDiv.textContent = "")
  );
}

function displayTranslation(input, language) {
  if (input == "") return (errorDiv.innerText = "Error: No text to translate", translationDiv.innerText = "");
  const output = translate(input, language);
  if (input == output[0])
    return (translationDiv.innerText = "Everything looks good to me!");
  translationDiv.innerHTML = output[1];
  errorDiv.textContent = "";
}

function translate(input, language) {
  function time(word, changePos, i) {
    if (!word.includes(timeChar)) return word;
    const word_arr = word.split("");
    const index = word.indexOf(timeChar);
    if (parseInt(word_arr[index - 1]) && parseInt(word_arr[index + 1])) {
      changePos.push(i);
      return (
        word.substring(0, index) + targetTimeChar + word.substring(index + 1)
      );
    }
    return word;
  }

  const timeChar = language === "american-to-british" ? ":" : ".",
    targetTimeChar = language === "american-to-british" ? "." : ":",
    titles =
      language === "american-to-british"
        ? { ...americanToBritishTitles }
        : { ...britishToAmericanTitles },
    dict =
      language === "american-to-british"
        ? { ...americanToBritishSpelling, ...americanOnly }
        : { ...britishToAmericanSpelling, ...britishOnly },
    changePos = [],
    changeCase = [],
    arr = input.split(" ");

  for (let i = 0; i < arr.length; i++) {
    let word;

    // Make a note of uppercase characters and replace them with the lowercase
    const firstChar = arr[i].charAt(0);
    if (firstChar == firstChar.toUpperCase()) {
      word = arr[i].toLowerCase();
      changeCase.push(i);
    } else word = arr[i];

    // Replace time characters
    arr[i] = time(word, changePos, i);

    // Replace words
    if (dict.hasOwnProperty(word)) {
      arr[i] = dict[word];
      changePos.push(i);
    }

    // Replace titles
    if (titles.hasOwnProperty(word)) {
      arr[i] = titles[word];
      changePos.push(i);
    }
  }

  // Re-add uppercase characters
  for (let k = 0; k < changeCase.length; k++) {
    const word = arr[changeCase[k]];
    arr[changeCase[k]] = word.charAt(0).toUpperCase() + word.substring(1);
  }

  const raw = arr.join(" ");

  // Add highlighting
  for (let j = 0; j < changePos.length; j++) {
    arr[changePos[j]] =
      '<span class="highlight">' + arr[changePos[j]] + "</span>";
  }

  const formatted = arr.join(" ");
  return [raw, formatted];
}

translateBtn.addEventListener("click", () => {
  displayTranslation(textArea.value, translationLanguage.value);
});

clearBtn.addEventListener("click", () => {
  clearAll();
});

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    translate,
    displayTranslation,
    clearAll
  };
} catch (e) {}
