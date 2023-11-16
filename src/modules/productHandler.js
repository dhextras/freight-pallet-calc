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

export { sortProductData };
