import { getById } from "./domHelper";
import { globalVarsAccessor } from "../main";

const listItems = productList.getElementsByTagName("li");

function updateListItemNumbers() {
  for (let i = 0; i < listItems.length; i++) {
    const listItem = listItems[i];
    const paragraph = listItem.querySelector("p");

    const textSplit = paragraph.innerText.split(/P_ID: \d+,/);
    const productText =
      textSplit.length > 1 ? textSplit[1] : paragraph.innerText;

    paragraph.innerText = `P_ID: ${i + 1}, ${productText}`;
  }
}

function togglePalletMaxWeight(element) {
  if (element.checked) {
    getById("palletMaxWeightDiv").classList.remove("hidden");
    getById("palletMaxWeight").focus();
    getById("palletMaxWeight").select();
  } else {
    getById("palletMaxWeightDiv").classList.add("hidden");
    getById("palletSizeError").classList.add("hidden");
  }
}

function handleInputErrors(errorDivId, minInputValue, watchElement) {
  const errorDiv = getById(errorDivId);

  if (parseFloat(watchElement.value) < minInputValue) {
    if (minInputValue === 1) {
      watchElement.select();
    }
    errorDiv.classList.remove("hidden");
  } else {
    errorDiv.classList.add("hidden");
  }
}

function updateMinPalletMaxWeight() {
  globalVarsAccessor("minPalletMaxWeightLimit", 0);

  for (let i = 0; i < listItems.length; i++) {
    const products = listItems[i].innerText.split(", ");
    const weightInKg = parseFloat(products[4].split(" ")[1]);

    if (
      globalVarsAccessor("getGlobalVars")["minPalletMaxWeightLimit"] <
      weightInKg
    ) {
      getById("palletMaxWeight").value = weightInKg;
      globalVarsAccessor("minPalletMaxWeightLimit", weightInKg);

      getById(
        "palletSizeError"
      ).innerHTML = `* Value must be Greater than ${weightInKg}kg.`;
    }
  }
}

function updateListItemDisplay() {
  getById("productsLength").innerHTML = `Total Products: ${listItems.length} `;

  if (listItems.length > 0) {
    getById("productData").classList.remove("hidden");
  } else {
    getById("palletData").classList.add("hidden");
    getById("productList").classList.add("hidden");
    getById("productData").classList.add("hidden");
    getById("productsLengthDiv").children[0].textContent = "►";
  }
}

export {
  updateListItemNumbers,
  togglePalletMaxWeight,
  handleInputErrors,
  updateMinPalletMaxWeight,
  updateListItemDisplay,
};
