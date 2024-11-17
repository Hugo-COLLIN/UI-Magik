export function filterList(input, rowsSelector, textSelector) {
  const filterText = input.value.toLowerCase();
  const rows = document.querySelectorAll(rowsSelector);

  rows.forEach(row => {
    const text = row.querySelector(textSelector)?.textContent.toLowerCase();
    row.style.display = text?.includes(filterText) ? "" : "none";
  });
}
