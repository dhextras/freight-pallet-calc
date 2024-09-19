import { globalVarsAccessor } from "../main";

function initializePallet(weightLimit) {
  return {
    layerData: [],
    productIds: [],
    palletWidth: 0,
    palletDepth: 0,
    totalWeight: 0,
    totalHeight: 0,
    heightLimit: 1100,
    weightLimit,
    minDepth: 1100,
    palletScalable: true,
    layerId: 0,
  };
}

function removeProductsByIds(pidsToRemove) {
  const globalVars = globalVarsAccessor("getGlobalVars");

  let tempSortedByWidth = globalVars["sortedByWidth"];
  let tempGroupedByHeight = globalVars["groupedByHeight"];

  tempSortedByWidth = globalVars["sortedByWidth"].filter(
    (product) => !pidsToRemove.includes(product.pid),
  );

  for (const height in globalVars["groupedByHeight"]) {
    tempGroupedByHeight[height] = globalVars["groupedByHeight"][height].filter(
      (product) => !pidsToRemove.includes(product.pid),
    );
  }

  globalVarsAccessor("sortedByWidth", tempSortedByWidth);
  globalVarsAccessor("groupedByHeight", tempGroupedByHeight);
}

export { initializePallet, removeProductsByIds };
