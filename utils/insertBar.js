import { filterList } from "./filterList.js";

export function insertSearchBar(listSelector, textSelector, placementSelector) {
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search...";

  const placementElement = document.querySelector(placementSelector);
  placementElement.appendChild(searchInput);

  searchInput.addEventListener("input", () => {
    filterList(searchInput, listSelector, textSelector);
  });
}
