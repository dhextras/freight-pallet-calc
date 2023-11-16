import { getById } from "./domHelper";
import { globalVarsAccessor } from "../main";
import { sortProductData } from "./productHandler";
import { allocateProducts } from "./calculationLogic.js";
import {
  generateWeightAndProducts,
  generatePalletsDisplay,
} from "./dataHandler";
import {
  updateListItemNumbers,
  updateMinPalletMaxWeight,
  updateListItemDisplay,
} from "./uiHandler";

const productInputs = document.querySelectorAll(".input-container input");
const [widthInput, depthInput, heightInput, weightInput, quantityInput] =
  productInputs;

function addProduct() {
  const width = widthInput.value;
  const depth = depthInput.value;
  const height = heightInput.value;
  const weight = weightInput.value;
  const quantity = quantityInput.value;

  if (width >= 1 && depth >= 1 && height >= 1 && weight >= 1 && quantity >= 1) {
    getById("productInputError").classList.add("hidden");
    const product = `W: ${width}cm, D: ${depth}cm, H: ${height}cm, M: ${weight}kg`;

    for (let i = 0; i < quantity; i++) {
      const listItem = document.createElement("li");
      listItem.innerHTML = `<button class="remove-btn">-</button><p>${product}</p>`;
      productList.appendChild(listItem);
    }

    updateListItemNumbers();
    updateListItemDisplay();
    updateMinPalletMaxWeight();

    widthInput.value = "";
    depthInput.value = "";
    heightInput.value = "";
    weightInput.value = "";
    quantityInput.value = "";
    widthInput.focus();
  } else {
    getById("productInputError").classList.remove("hidden");
  }
}

function importProducts() {
  // this has to be updated if the client asked so just for the template so that we doesnt needed to implemnt this again later on.
  alert(
    "Importing from Excel - added just as a template so that it can be added later if needed or be removed."
  );
}

function calculatePalletSize() {
  let isValidWeight = true;

  if (getById("togglePalletMaxWeight").checked) {
    let tempWeight = parseFloat(palletMaxWeight.value);

    isValidWeight =
      tempWeight !== NaN
        ? tempWeight >=
          globalVarsAccessor("getGlobalVars")["minPalletMaxWeightLimit"]
        : false;
  }

  if (isValidWeight) {
    getById("loading").classList.remove("hidden");
    getById("palletData").classList.remove("hidden");

    const { weightLimit, products } = generateWeightAndProducts();
    const sortedProduct = sortProductData(products);

    globalVarsAccessor("sortedByWidth", sortedProduct.sortedByWidth);
    globalVarsAccessor("groupedByHeight", sortedProduct.groupedByHeight);

    const palletsData = allocateProducts(weightLimit);
    const palletsDisplay = generatePalletsDisplay(palletsData);

    palletSize.innerHTML = "";
    while (palletsDisplay.firstChild) {
      palletSize.appendChild(palletsDisplay.firstChild);
    }

    getById("loading").classList.add("hidden");
    palletSize.classList.remove("hidden");
  } else {
    getById("palletData").classList.add("hidden");
    getById("palletSizeError").classList.remove("hidden");
  }
}

export { addProduct, importProducts, calculatePalletSize };
