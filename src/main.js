import { attachEventListeners } from "./modules/domHelper";
import {
  addProduct,
  importProducts,
  calculatePalletSize,
} from "./modules/buttonHandler";
import { togglePalletMaxWeight, handleInputErrors } from "./modules/uiHandler";

let globalVars = {
  minPalletMaxWeightLimit: undefined,
  sortedByWidth: undefined,
  groupedByHeight: undefined,
};

function globalVarsAccessor(variable, value = undefined) {
  if (variable === "getGlobalVars") {
    return globalVars;
  }

  globalVars[variable] = value;
}

attachEventListeners();
window.addProduct = addProduct;
window.importProducts = importProducts;
window.handleInputErrors = handleInputErrors;
window.calculatePalletSize = calculatePalletSize;
window.togglePalletMaxWeight = togglePalletMaxWeight;

export { globalVars, globalVarsAccessor };
