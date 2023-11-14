export function addProduct() {
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

export function importProducts() {
  // this has to be updated if the client asked so just for the template so that we doesnt needed to implemnt this again later on.
  alert(
    "Importing from Excel - added just as a template so that it can be added later if needed or be removed."
  );
}

export function calculatePalletSize() {
  let isValidWeight = true;

  if (toggleMaxWeight.checked) {
    let tempWeight = parseFloat(palletMaxWeight.value);
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
