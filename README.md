# Freight Pallet Calculator

> **A pallet sizing calculator with optimization algorithms for efficient freight packing.**

## Demo

> **You can try out the live demo here: [Freight Pallet Calculator](https://dhextras.github.io/freight-pallet-calc)**

 ![demo_page_1](https://github.com/dhextras/freight-pallet-calc/assets/104954857/ed76ce54-e1c7-41c4-a30d-b9b821a94049)![demo_page_2](https://github.com/dhextras/freight-pallet-calc/assets/104954857/809093f2-875e-410f-9863-0cf330fc50a5)

---

## Getting Started

These instructions will help you set up and run the project on your local machine.

### Prerequisites

To run this project locally, you will need a web browser. No additional software is required.

### Installation

1. Clone the repository to your local machine:

   ```shell
   git clone https://github.com/dhextras/freight-pallet-calc.git
   ```

2. Run the dev server

   - For dev server
   ```shell
   npm run dev
   ```

   - To build for prod
   ```shell
   npm run build
   ```

   - For preview
   ```shell
   npm run preview
   ```

   > you can access the app at `http://localhost:5173/freight-pallet-calc/`

## How It Works

This tool efficiently calculates the optimal size for freight pallets. It allows you to enter product dimensions and weights, and then it distributes these products across pallets, ensuring that weight and height constraints are met. The tool uses intelligent algorithms to optimize the arrangement of products to minimize wasted space on pallets.

> For a detailed explanation of how the calculator works and how the code achieves this, please refer to the `allocateProducts` & `addProductToPallet` Functions in the [calculationLogic.js](src/modules/calculationLogic.js) file. You will find explanations and references to specific parts of the code, making it easier to understand the logic.

### File Structure:

![structure_image](https://github.com/dhextras/freight-pallet-calc/assets/104954857/78ca3b08-f635-479b-9e96-47c457fa1767)

> **Link to the Visualizer used above if you're intrested: [File-Viz](https://file-viz.glitch.me/)**
---
#### `buttonHandler.js`
   - **Manages button functionalities:**
     >- `addProduct()`: Adds products to the list
     >- `importProducts()`: Imports data from Excel(as a placeholder)
     >- `calculatePalletSize()`: Calculates pallet size based on Product data

#### `calculationLogic.js`
   - **Contains pallet calculation logic:**
     >- `allocateProducts()`: Loop through Products & Pallets to Allocate Product 
     >- `addProductToPallet()`: Add products to Pallet with minimizing waste space

#### `productHandler.js`
   - **Sort Product Data:**
     >- `sortProductData()`: Sorts product data to be used in the calculation

#### `palletHandler.js`
   - **Manages pallet operations:**
     >- `initializePallet()`: Initializes pallet structure
     >- `removeProductsByIds()`: Removes products by IDs in the sortedProducts while calculation

#### `dataHandler.js`
   - **Deals with data generation and transformation:**
     >- `generateWeightAndProducts()`: Generates weight and product data from the list
     >- `generatePalletsDisplay()`: Creates nice looking display for pallets

#### `uiHandler.js`
   - **Manages UI-related updates:**
     >- `updateListItemNumbers()`: Updates item numbers in the list
     >- `updateMinPalletMaxWeight()`: Updates minimum pallet weight limit
     >- `updateListItemDisplay()`: Updates list item display to make sure theres atleast one product
     >- `togglePalletMaxWeight()`: Toggles pallet maximum weight display
     >- `handleInputErrors()`: Handles input validation errors

#### `domhandler.js`
   - **Manages DOM interactions:**
     >- `getById()`: Retrieves an element by its ID
     >- `attachEventListeners()`: Attaches event listeners to various elements


## Contributing

If you'd like to contribute to this project, please follow these steps:

### Bug Fixes or New Features

1. **Open an Issue**: If you've identified a bug or have a feature request, please open an issue first. Clearly describe the bug or the new feature you'd like to see. Use the provided templates for issues.

2. **Create a New Branch**: If you're addressing an issue, create a new branch named after the issue number: `git checkout -b issue-123`.

3. **Make Your Changes**: Implement your bug fix or add the new feature.

4. **Commit Your Changes**: After making your changes, commit them with a clear and concise message: `git commit -m 'Fix issue-123'`.

5. **Push to the Branch**: Push your changes to the branch you created: `git push origin issue-123`.

6. **Create a Pull Request**: After pushing changes, create a pull request against the `main` branch. Reference the issue in your pull request description.

#### Branch Naming

> When working on an issue, use the issue number as the branch name. For example, if working on issue 123, the branch should be named `issue-123`.

#### Pull Request

> Make sure to fill out the provided template when creating a pull request. It helps reviewers understand the changes and ensures that essential information is provided.

Thank you for contributing!

## Acknowledgments

Thanks for using Freight Pallet Calculator!
- Moderator
    - [Dhextras](github.com/dhextras)
- Contributors
    - [Jason Boyett](https://github.com/JasonBoyett)

Feel free to contact us if you have any questions or feedback.
