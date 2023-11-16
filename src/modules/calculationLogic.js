import { globalVarsAccessor } from "../main";
import { initializePallet, removeProductsByIds } from "./palletHandler";

function allocateProducts(weightLimit) {
  let pallets = [initializePallet(weightLimit)];
  const globalVars = globalVarsAccessor("getGlobalVars");

  while (globalVars["sortedByWidth"].length !== 0) {
    let productAllocated = false;
    const product = globalVars["sortedByWidth"][0];

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
  let {
    pid,
    weight: productWeight,
    depth: productDepth,
    width: productWidth,
    height: productHeight,
  } = product;

  let {
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

  let productAdded, modifiedPallet;

  const globalVars = globalVarsAccessor("getGlobalVars");

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
        const productsInHeightGroup =
          globalVars["groupedByHeight"][productHeight];
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
            palletScalable = false;
          }
        } else {
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

      let isLayerFilled = false;
      let currentLayerDepth = productDepth;

      while (!isLayerFilled) {
        const productsInHeightGroup =
          globalVars["groupedByHeight"][productHeight];

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

export { allocateProducts };
