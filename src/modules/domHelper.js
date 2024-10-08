import { toJpeg } from "html-to-image";
import { globalVarsAccessor } from "../main";
import {
  updateListItemNumbers,
  handleInputErrors,
  updateMinPalletMaxWeight,
  updateListItemDisplay,
} from "./uiHandler";

const palletSize = getById("palletSize");
const productList = getById("productList");
const palletMaxWeight = getById("palletMaxWeight");
const productsLengthDiv = getById("productsLengthDiv");
const productInputs = document.querySelectorAll(
  ".product-form .input-container input",
);

function getById(id) {
  const element = document.getElementById(id);

  if (!element) {
    console.log(`Couldnt find any element with ${id}`);
    return;
  }
  return element;
}

function attachEventListeners() {
  productInputs.forEach(function (input) {
    input.addEventListener("click", function () {
      this.select();
    });

    input.addEventListener("input", function (e) {
      handleInputErrors("productInputError", 1, input);
    });
  });

  palletMaxWeight.addEventListener("input", function (e) {
    handleInputErrors(
      "palletSizeError",
      globalVarsAccessor("getGlobalVars")["minPalletMaxWeightLimit"],
      palletMaxWeight,
    );
  });

  productList.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-btn")) {
      e.target.parentNode.remove();

      updateListItemNumbers();
      updateListItemDisplay();
      updateMinPalletMaxWeight();
    }
  });

  palletSize.addEventListener("click", function (e) {
    if (e.target.classList.contains("expand-btn")) {
      const productIdListElement =
        e.target.nextElementSibling.nextElementSibling;
      if (
        productIdListElement &&
        productIdListElement.classList.contains("product-id-list")
      ) {
        productIdListElement.classList.toggle("hidden");
        e.target.textContent = e.target.textContent === "►" ? "▼" : "►";
      }
    }
  });

  productsLengthDiv.addEventListener("click", function (e) {
    if (e.target.classList.contains("expand-btn")) {
      productList.classList.toggle("hidden");
      e.target.textContent = e.target.textContent === "►" ? "▼" : "►";
    }
  });
}

async function capturePalletData() {
  const node = document.getElementById("palletData");
  if (!node) {
    alert("Couldn't fine the Capture element");
  }

  try {
    const blobUrl = await toJpeg(node, { pixelRatio: 5 });
    const downloadLink = document.createElement("a");

    downloadLink.href = blobUrl;
    downloadLink.download = "Pallet Data.jpeg";
    downloadLink.click();
  } catch (error) {
    alert("Error capturing element, Contact Dev with the console log");
    console.log(`Error: Capturing element\n${error}`);
  }
}

export { getById, attachEventListeners, capturePalletData };
