const loading = document.getElementById("loading");
const palletData = document.getElementById("palletData");
const palletSize = document.getElementById("palletSize");
const productList = document.getElementById("productList");
const productData = document.getElementById("productData");
const productsLength = document.getElementById("productsLength");
const palletMaxWeight = document.getElementById("palletMaxWeight");
const productsLengthDiv = document.getElementById("productsLengthDiv");
const toggleMaxWeight = document.getElementById("togglePalletMaxWeight");
const palletMaxWeightDiv = document.getElementById("palletMaxWeightDiv");
const productInputs = document.querySelectorAll(".input-container input");

const listItems = productList.getElementsByTagName("li");
let minPalletMaxWeightLimit, sortedByWidth, groupedByHeight;
let [widthInput, depthInput, heightInput, weightInput, quantityInput] =
  productInputs;

// Main functions for adding, importing and running calculation.
function addProduct() {
  const width = widthInput.value;
  const depth = depthInput.value;
  const height = heightInput.value;
  const weight = weightInput.value;
  const quantity = quantityInput.value;
  const productInputError = document.getElementById("productInputError");

  if (width >= 1 && depth >= 1 && height >= 1 && weight >= 1 && quantity >= 1) {
    productInputError.classList.add("hidden");
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
    productInputError.classList.remove("hidden");
  }
}

function importProducts() {
  // this has to be updated if the client asked so just for the template so that we doesnt needed to implemnt this again later on.
  alert(
    "Importing from Excel - added just as an template so that it can be added later if needed or be removed."
  );
}

function calculatePalletSize() {
  var isValidWeight = true;

  if (toggleMaxWeight.checked) {
    var tempWeight = palletMaxWeight.valueAsNumber;
    isValidWeight =
      tempWeight !== NaN ? tempWeight >= minPalletMaxWeightLimit : false;
  }

  if (isValidWeight) {
    loading.classList.remove("hidden");
    palletData.classList.remove("hidden");

    const { weightLimit, products } = generateWeightAndProducts();
    const sortedProduct = sortProductData(products);

    sortedByWidth = sortedProduct.sortedByWidth;
    groupedByHeight = sortedProduct.groupedByHeight;

    const palletsData = allocateProducts(weightLimit);
    const palletsDisplay = generatePalletsDisplay(palletsData);

    palletSize.innerHTML = "";
    while (palletsDisplay.firstChild) { 
      palletSize.appendChild(palletsDisplay.firstChild);
    }

    loading.classList.add("hidden");
    palletSize.classList.remove("hidden");
  } else {
    palletData.classList.add("hidden");
    document.getElementById("palletSizeError").classList.remove("hidden");
  }
}

function allocateProducts(weightLimit) {
  var pallets = [initializePallet(weightLimit)];

  while (sortedByWidth.length !== 0) {
    let productAllocated = false;
    const product = sortedByWidth[0];

    for (let i = 0; i < pallets.length; i++) {
      const pallet = pallets[i];
      const { productAdded, modifiedPallet } = addProductToPallet(
        product,
        pallet
      );

      if (productAdded) {
        productAllocated = true;
        pallets[i] = modifiedPallet;
        break;
      }
    }

    if (!productAllocated) {
      const newPallet = initializePallet(weightLimit);
      const { productAdded, modifiedPallet } = addProductToPallet(
        product,
        newPallet
      );

      if (productAdded) {
        pallets.push(modifiedPallet);
      }
    }
  }
  return pallets;
}

function addProductToPallet(product, pallet) {
  var {
    pid,
    weight: productWeight,
    depth: productDepth,
    width: productWidth,
    height: productHeight,
  } = product;

  var {
    productIds,
    palletWidth,
    palletDepth,
    totalWeight,
    totalHeight,
    weightLimit,
    heightLimit,
    minDepth,
    palletScalable,
    layerId,
  } = pallet;

  var productAdded, modifiedPallet;

  if (palletScalable) {
    if (
      totalWeight + productWeight <= weightLimit &&
      totalHeight + productHeight <= heightLimit
    ) {
      palletWidth += productWidth;
      totalWeight += productWeight;
      totalHeight += productHeight;
      palletDepth += productDepth;

      productIds.push([]);
      productIds[layerId].push(pid);

      removeProductsByIds([pid]);

      if (palletDepth >= minDepth) {
        palletScalable = false;
      }

      while (palletScalable) {
        const productsInHeightGroup = groupedByHeight[productHeight];
        if (productsInHeightGroup.length > 0) {
          const product = productsInHeightGroup[0];
          if (
            totalWeight + product.weight <= weightLimit &&
            totalHeight + product.height <= heightLimit
          ) {
            totalWeight += product.weight;
            palletDepth += product.depth;
            productIds[layerId].push(product.pid);

            removeProductsByIds([product.pid]);

            if (palletDepth >= minDepth) {
              palletScalable = false;
            }
          } else {
            palletDepth = 110;
            palletScalable = false;
          }
        } else {
          palletDepth = 110;
          palletScalable = false;
        }
      }

      layerId += 1;
      productAdded = true;
    } else {
      productAdded = false;
    }
  } else {
    if (
      totalWeight + productWeight <= weightLimit &&
      totalHeight + productHeight <= heightLimit &&
      productDepth <= palletDepth
    ) {
      productIds.push([]);
      productIds[layerId].push(pid);

      totalWeight += productWeight;
      totalHeight += productHeight;

      removeProductsByIds([pid]);

      var isLayerFilled = false;
      var currentLayerDepth = productDepth;

      while (!isLayerFilled) {
        const productsInHeightGroup = groupedByHeight[productHeight];

        if (productsInHeightGroup.length > 0) {
          const product = productsInHeightGroup[0];
          if (
            totalWeight + product.weight <= weightLimit &&
            totalHeight + product.height <= heightLimit &&
            product.depth <= palletDepth
          ) {
            if (currentLayerDepth + product.depth > palletDepth) {
              isLayerFilled = true;
            } else {
              totalWeight += product.weight;
              currentLayerDepth += product.depth;
              productIds[layerId].push(product.pid);

              removeProductsByIds([product.pid]);
            }
          } else {
            isLayerFilled = true;
          }
        } else {
          isLayerFilled = true;
        }
      }
      layerId += 1;
      productAdded = true;
    } else {
      productAdded = false;
    }
  }

  modifiedPallet = {
    productIds,
    palletWidth,
    palletDepth,
    totalWeight,
    totalHeight,
    weightLimit,
    heightLimit,
    minDepth,
    palletScalable,
    layerId,
  };

  return { productAdded, modifiedPallet };
}

// Few event listeners to handle errors and dumb user input :)
productInputs.forEach(function (input) {
  input.addEventListener("click", function () {
    this.select();
  });

  input.addEventListener("input", function () {
    handleInputErrors("productInputError", 1, input);
  });
});

palletMaxWeight.addEventListener("input", function () {
  handleInputErrors(
    "palletSizeError",
    minPalletMaxWeightLimit,
    palletMaxWeight
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
    const productIdListElement = e.target.nextElementSibling.nextElementSibling;
    if (productIdListElement && productIdListElement.classList.contains("product-id-list")) {
      productIdListElement.classList.toggle("hidden");
      e.target.textContent = e.target.textContent === "►"  ? "▼" : "►";
    }
  }
});

productsLengthDiv.addEventListener("click", function (e) {
  if (e.target.classList.contains("expand-btn")) {
    productList.classList.toggle("hidden");
    e.target.textContent = e.target.textContent === "►"  ? "▼" : "►" ;
  }
});

// Few Boilerplate codes to use through out the flow
function updateListItemNumbers() {
  const listItems = productList.getElementsByTagName("li");

  for (let i = 0; i < listItems.length; i++) {
    const listItem = listItems[i];
    const paragraph = listItem.querySelector("p");

    const textSplit = paragraph.innerText.split(/P_ID: \d+,/);
    const productText =
      textSplit.length > 1 ? textSplit[1] : paragraph.innerText;

    paragraph.innerText = `P_ID: ${i + 1}, ${productText}`;
  }
}

function updateMinPalletMaxWeight() {
  minPalletMaxWeightLimit = 0;

  for (let i = 0; i < listItems.length; i++) {
    const products = listItems[i].innerText.split(", ");
    const weightInKg = parseInt(products[4].split(" ")[1]);

    if (minPalletMaxWeightLimit < weightInKg) {
      minPalletMaxWeightLimit = weightInKg;
      palletMaxWeight.value = weightInKg;

      document.getElementById(
        "palletSizeError"
      ).innerHTML = `* Value must be Greater than ${weightInKg}kg.`;
    }
  }
}

function updateListItemDisplay() {
  productsLength.innerHTML = `Total Products: ${listItems.length} `;
  if (listItems.length > 0) {
    productData.classList.remove("hidden");
  } else {
    palletData.classList.add("hidden");
    productList.classList.add("hidden");
    productData.classList.add("hidden");
    productsLengthDiv.children[0].textContent = "►" ;
  }
}

function togglePalletMaxWeight(element) {
  if (element.checked) {
    palletMaxWeightDiv.classList.remove("hidden");
    palletMaxWeight.focus();
    palletMaxWeight.select();
  } else {
    palletMaxWeightDiv.classList.add("hidden");
    document.getElementById("palletSizeError").classList.add("hidden");
  }
}

function handleInputErrors(errorDivId, minInputValue, watchElement) {
  const errorDiv = document.getElementById(errorDivId);

  if (watchElement.valueAsNumber < minInputValue) {
    if (minInputValue === 1) {
      watchElement.select();
    }
    errorDiv.classList.remove("hidden");
  } else {
    errorDiv.classList.add("hidden");
  }
}

function generateWeightAndProducts() {
  let totalWeight = 0;
  const products = [];
  const listItems = productList.getElementsByTagName("li");

  for (let i = 0; i < listItems.length; i++) {
    const productData = listItems[i].innerText.split(", ");

    const pid = parseInt(productData[0].split(": ")[1]);
    const width = parseInt(productData[1].split(": ")[1].split("cm")[0]);
    const depth = parseInt(productData[2].split(": ")[1].split("cm")[0]);
    const height = parseInt(productData[3].split(": ")[1].split("cm")[0]);
    const weight = parseInt(productData[4].split(": ")[1].split("kg")[0]);

    totalWeight += weight;
    products.push({ pid, width, height, depth, weight });
  }
  const weightLimit = toggleMaxWeight.checked
    ? palletMaxWeight.valueAsNumber
    : totalWeight;

  return {
    weightLimit,
    products,
  };
}

function generatePalletsDisplay(palletsData) {
  const palletsDisplay = document.createElement("div");

  for (let i = 0; i < palletsData.length; i++) {
    const pallet = palletsData[i];

    const layers = document.createElement("div");
    const palletDiv = document.createElement("div");
    const palletInfo = document.createElement("div");
    const productIdList = document.createElement("ul");
    const expandButton = document.createElement("button");

    palletDiv.classList.add("pallet");
    palletInfo.classList.add("pallet-info");
    expandButton.classList.add("expand-btn");
    productIdList.classList.add("product-id-list", "hidden");

    const layerLength = pallet.productIds.length;
    const ratioText = `Pallet Ratio (W x D): ${pallet.palletWidth} X ${pallet.palletDepth} cm`;

    for (let j = 0; j < layerLength; j++) {
      const layerItem = document.createElement("li");
      const layer = pallet.productIds[layerLength - j - 1];

      layerItem.textContent = `Layer ${layerLength - j}: (${layer.join(", ")})`;
      productIdList.appendChild(layerItem);
    }

    expandButton.textContent = "►" ;

    const totalWeight = `Total Weight: ${pallet.totalWeight}kg`;
    const totalHeight = `Total Height: ${pallet.totalHeight}cm`;
    
    layers.appendChild(expandButton);
    layers.innerHTML += `<p>Total Layer: ${layerLength}</p>`;
    layers.appendChild(productIdList);

    palletInfo.innerHTML = `<h3>Pallet ${i + 1}:</h3>`;
    palletInfo.innerHTML += `<p>${ratioText}</p>`;
    palletInfo.appendChild(layers);
    palletInfo.innerHTML += `<p>${totalWeight}</p>`;
    palletInfo.innerHTML += `<p>${totalHeight}</p>`;

    palletDiv.appendChild(palletInfo);
    palletsDisplay.appendChild(palletDiv);
  }
  return palletsDisplay;
}

function sortProductData(products) {
  const sortedByWidth = [...products].sort((a, b) => {
    if (a.width === b.width) {
      return b.depth - a.depth;
    }
    return b.width - a.width;
  });

  const groupedByHeight = products.reduce((groups, product) => {
    if (!groups[product.height]) {
      groups[product.height] = [];
    }
    groups[product.height].push(product);
    return groups;
  }, {});

  for (const height in groupedByHeight) {
    groupedByHeight[height].sort((a, b) => a.depth - b.depth);
  }

  return { sortedByWidth, groupedByHeight };
}

function initializePallet(weightLimit) {
  return {
    productIds: [],
    palletWidth: 0,
    palletDepth: 0,
    totalWeight: 0,
    totalHeight: 0,
    heightLimit: 110,
    weightLimit,
    minDepth: 110,
    palletScalable: true,
    layerId: 0,
  };
}

function removeProductsByIds(pidsToRemove) {
  sortedByWidth = sortedByWidth.filter(
    (product) => !pidsToRemove.includes(product.pid)
  );

  for (const height in groupedByHeight) {
    groupedByHeight[height] = groupedByHeight[height].filter(
      (product) => !pidsToRemove.includes(product.pid)
    );
  }
}
