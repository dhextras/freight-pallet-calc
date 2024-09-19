import { getById } from "./domHelper";

function generateWeightAndProducts() {
  let totalWeight = 0;
  const products = [];
  const listItems = getById("productList").getElementsByTagName("li");

  for (let i = 0; i < listItems.length; i++) {
    const productData = listItems[i].innerText.split(", ");

    const pid = parseInt(productData[0].split(": ")[1]);
    const width = parseFloat(productData[1].split(": ")[1].split("mm")[0]);
    const depth = parseFloat(productData[2].split(": ")[1].split("mm")[0]);
    const height = parseFloat(productData[3].split(": ")[1].split("mm")[0]);
    const weight = parseFloat(productData[4].split(": ")[1].split("kg")[0]);

    totalWeight += weight;
    products.push({ pid, width, height, depth, weight });
  }
  const weightLimit = getById("togglePalletMaxWeight").checked
    ? parseFloat(getById("palletMaxWeight").value)
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

    const palletWidth = Math.ceil(pallet.palletWidth);
    const palletDepth = Math.ceil(pallet.palletDepth);
    const totalHeight = Math.ceil(pallet.totalHeight);

    const layerLength = pallet.productIds.length;
    const ratioText = `Pallet Ratio (W x D x H): ${palletWidth} X ${palletDepth} X ${totalHeight} mm`;

    for (let j = 0; j < layerLength; j++) {
      const layerItem = document.createElement("li");
      const layer = pallet.productIds[layerLength - j - 1];

      const currentLayerData = pallet.layerData[layerLength - j - 1];
      const layerWidth = currentLayerData[0];
      const layerDepth = currentLayerData[1];
      const layerHeight = currentLayerData[2];
      const layerWeight = currentLayerData[3];

      layerItem.textContent = `Layer ${layerLength - j}: (${layer.join(", ")}) ==> ${[layerWidth, layerDepth, layerHeight].join(" x ")} mm - ${layerWeight}kg`;
      productIdList.appendChild(layerItem);
    }

    expandButton.textContent = "►";
    const totalWeight =
      Math.round((10 + parseFloat(pallet.totalWeight)) * 100) / 100;
    const weight = `Total Weight: ${totalWeight}kg`;

    layers.appendChild(expandButton);
    layers.innerHTML += `<p>Total Layer: ${layerLength}</p>`;
    layers.appendChild(productIdList);

    palletInfo.innerHTML = `<h3>Pallet ${i + 1}:</h3>`;
    palletInfo.innerHTML += `<p>${ratioText}</p>`;
    palletInfo.innerHTML += `<p>Pallet Weight: 10kg</p>`;
    palletInfo.innerHTML += `<p>${weight}</p>`;
    palletInfo.appendChild(layers);

    palletDiv.appendChild(palletInfo);
    palletsDisplay.appendChild(palletDiv);
  }
  return palletsDisplay;
}

export { generateWeightAndProducts, generatePalletsDisplay };
