//picker.js
let currentStep = 1;
let selectors = {};

function createOverlay() {
  const overlay = document.createElement("div");
  overlay.id = "css-picker-overlay";
  overlay.style.cssText = `
    position: absolute;
    z-index: 9999;
    pointer-events: none;
    border: 2px solid red;
  `;
  document.body.appendChild(overlay);
  return overlay;
}

function removeOverlay() {
  const overlay = document.getElementById("css-picker-overlay");
  if (overlay) overlay.remove();
}

function highlightElement(event) {
  const overlay = document.getElementById("css-picker-overlay");
  const rect = event.target.getBoundingClientRect();
  overlay.style.top = `${rect.top + window.scrollY}px`;
  overlay.style.left = `${rect.left + window.scrollX}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
}

function pickElement(event) {
  event.preventDefault();
  const selector = window.getComputedStyle(event.target).cssText;
  selectors[`step${currentStep}`] = selector;
  removeOverlay();

  if (currentStep < 3) {
    currentStep++;
    startPicker();
  } else {
    finalize();
  }
}

function startPicker() {
  const overlay = createOverlay();
  document.addEventListener("mousemove", highlightElement);
  document.addEventListener("click", pickElement, { once: true });
}

function finalize() {
  console.log("Selected selectors:", selectors);
  document.removeEventListener("mousemove", highlightElement);
  insertSearchBar(selectors.step1, selectors.step2, selectors.step3);
}

startPicker();

// ---------------------
//insertBar.js
function insertSearchBar(listSelector, textSelector, placementSelector) {
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search...";

  const placementElement = document.querySelector(placementSelector);
  placementElement.appendChild(searchInput);

  searchInput.addEventListener("input", () => {
    filterList(searchInput, listSelector, textSelector);
  });
}

//filterList.js
function filterList(input, rowsSelector, textSelector) {
  const filterText = input.value.toLowerCase();
  const rows = document.querySelectorAll(rowsSelector);

  rows.forEach(row => {
    const text = row.querySelector(textSelector)?.textContent.toLowerCase();
    row.style.display = text?.includes(filterText) ? "" : "none";
  });
}
