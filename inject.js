//@medv/finder
// License: MIT
// Author: Anton Medvedev <anton@medv.io>
// Source: https://github.com/antonmedv/finder
let config;
let rootDocument;
let start;
function finder(input, options) {
  start = new Date();
  if (input.nodeType !== Node.ELEMENT_NODE) {
    throw new Error(`Can't generate CSS selector for non-element node type.`);
  }
  if ('html' === input.tagName.toLowerCase()) {
    return 'html';
  }
  const defaults = {
    root: document.body,
    idName: (name) => true,
    className: (name) => true,
    tagName: (name) => true,
    attr: (name, value) => false,
    seedMinLength: 1,
    optimizedMinLength: 2,
    threshold: 1000,
    maxNumberOfTries: 10000,
    timeoutMs: undefined,
  };
  config = { ...defaults, ...options };
  rootDocument = findRootDocument(config.root, defaults);
  let path = bottomUpSearch(input, 'all', () => bottomUpSearch(input, 'two', () => bottomUpSearch(input, 'one', () => bottomUpSearch(input, 'none'))));
  if (path) {
    const optimized = sort(optimize(path, input));
    if (optimized.length > 0) {
      path = optimized[0];
    }
    return selector(path);
  }
  else {
    throw new Error(`Selector was not found.`);
  }
}
function findRootDocument(rootNode, defaults) {
  if (rootNode.nodeType === Node.DOCUMENT_NODE) {
    return rootNode;
  }
  if (rootNode === defaults.root) {
    return rootNode.ownerDocument;
  }
  return rootNode;
}
function bottomUpSearch(input, limit, fallback) {
  let path = null;
  let stack = [];
  let current = input;
  let i = 0;
  while (current) {
    const elapsedTime = new Date().getTime() - start.getTime();
    if (config.timeoutMs !== undefined && elapsedTime > config.timeoutMs) {
      throw new Error(`Timeout: Can't find a unique selector after ${elapsedTime}ms`);
    }
    let level = maybe(id(current)) ||
      maybe(...attr(current)) ||
      maybe(...classNames(current)) ||
      maybe(tagName(current)) || [any()];
    const nth = index(current);
    if (limit == 'all') {
      if (nth) {
        level = level.concat(level.filter(dispensableNth).map((node) => nthChild(node, nth)));
      }
    }
    else if (limit == 'two') {
      level = level.slice(0, 1);
      if (nth) {
        level = level.concat(level.filter(dispensableNth).map((node) => nthChild(node, nth)));
      }
    }
    else if (limit == 'one') {
      const [node] = (level = level.slice(0, 1));
      if (nth && dispensableNth(node)) {
        level = [nthChild(node, nth)];
      }
    }
    else if (limit == 'none') {
      level = [any()];
      if (nth) {
        level = [nthChild(level[0], nth)];
      }
    }
    for (let node of level) {
      node.level = i;
    }
    stack.push(level);
    if (stack.length >= config.seedMinLength) {
      path = findUniquePath(stack, fallback);
      if (path) {
        break;
      }
    }
    current = current.parentElement;
    i++;
  }
  if (!path) {
    path = findUniquePath(stack, fallback);
  }
  if (!path && fallback) {
    return fallback();
  }
  return path;
}
function findUniquePath(stack, fallback) {
  const paths = sort(combinations(stack));
  if (paths.length > config.threshold) {
    return fallback ? fallback() : null;
  }
  for (let candidate of paths) {
    if (unique(candidate)) {
      return candidate;
    }
  }
  return null;
}
function selector(path) {
  let node = path[0];
  let query = node.name;
  for (let i = 1; i < path.length; i++) {
    const level = path[i].level || 0;
    if (node.level === level - 1) {
      query = `${path[i].name} > ${query}`;
    }
    else {
      query = `${path[i].name} ${query}`;
    }
    node = path[i];
  }
  return query;
}
function penalty(path) {
  return path.map((node) => node.penalty).reduce((acc, i) => acc + i, 0);
}
function unique(path) {
  const css = selector(path);
  switch (rootDocument.querySelectorAll(css).length) {
    case 0:
      throw new Error(`Can't select any node with this selector: ${css}`);
    case 1:
      return true;
    default:
      return false;
  }
}
function id(input) {
  const elementId = input.getAttribute('id');
  if (elementId && config.idName(elementId)) {
    return {
      name: '#' + CSS.escape(elementId),
      penalty: 0,
    };
  }
  return null;
}
function attr(input) {
  const attrs = Array.from(input.attributes).filter((attr) => config.attr(attr.name, attr.value));
  return attrs.map((attr) => ({
    name: `[${CSS.escape(attr.name)}="${CSS.escape(attr.value)}"]`,
    penalty: 0.5,
  }));
}
function classNames(input) {
  const names = Array.from(input.classList).filter(config.className);
  return names.map((name) => ({
    name: '.' + CSS.escape(name),
    penalty: 1,
  }));
}
function tagName(input) {
  const name = input.tagName.toLowerCase();
  if (config.tagName(name)) {
    return {
      name,
      penalty: 2,
    };
  }
  return null;
}
function any() {
  return {
    name: '*',
    penalty: 3,
  };
}
function index(input) {
  const parent = input.parentNode;
  if (!parent) {
    return null;
  }
  let child = parent.firstChild;
  if (!child) {
    return null;
  }
  let i = 0;
  while (child) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      i++;
    }
    if (child === input) {
      break;
    }
    child = child.nextSibling;
  }
  return i;
}
function nthChild(node, i) {
  return {
    name: node.name + `:nth-child(${i})`,
    penalty: node.penalty + 1,
  };
}
function dispensableNth(node) {
  return node.name !== 'html' && !node.name.startsWith('#');
}
function maybe(...level) {
  const list = level.filter(notEmpty);
  if (list.length > 0) {
    return list;
  }
  return null;
}
function notEmpty(value) {
  return value !== null && value !== undefined;
}
function* combinations(stack, path = []) {
  if (stack.length > 0) {
    for (let node of stack[0]) {
      yield* combinations(stack.slice(1, stack.length), path.concat(node));
    }
  }
  else {
    yield path;
  }
}
function sort(paths) {
  return [...paths].sort((a, b) => penalty(a) - penalty(b));
}
function* optimize(path, input, scope = {
  counter: 0,
  visited: new Map(),
}) {
  if (path.length > 2 && path.length > config.optimizedMinLength) {
    for (let i = 1; i < path.length - 1; i++) {
      if (scope.counter > config.maxNumberOfTries) {
        return; // Okay At least I tried!
      }
      scope.counter += 1;
      const newPath = [...path];
      newPath.splice(i, 1);
      const newPathKey = selector(newPath);
      if (scope.visited.has(newPathKey)) {
        return;
      }
      if (unique(newPath) && same(newPath, input)) {
        yield newPath;
        scope.visited.set(newPathKey, true);
        yield* optimize(newPath, input, scope);
      }
    }
  }
}
function same(path, input) {
  return rootDocument.querySelector(selector(path)) === input;
}

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
  console.log(event.target)
  console.log(window.getComputedStyle(event.target))
  selectors[`step${currentStep}`] = finder(event.target)
  console.log(`Step ${currentStep}:`, selectors[`step${currentStep}`])
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

// getCssSelector.js
function getCssSelector(element) {
  if (!(element instanceof Element)) return null;

  const parts = [];
  while (element) {
    let selector = element.nodeName.toLowerCase();

    // Add ID if available and unique
    if (element.id) {
      selector += `#${element.id}`;
      parts.unshift(selector);
      break;
    }

    // Add meaningful class names
    if (element.className) {
      const classes = element.className
        .split(/\s+/)
        .filter(name => !name.match(/^bg-|^z-|^\d/)); // Avoid dynamic or layout-specific classes
      if (classes.length > 0) {
        selector += `.${classes.join('.')}`;
      }
    }

    // Add nth-child only if necessary
    if (element.parentNode) {
      const siblings = Array.from(element.parentNode.children).filter(
        sibling => sibling.nodeName === element.nodeName
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(element) + 1;
        selector += `:nth-child(${index})`;
      }
    }

    parts.unshift(selector);
    element = element.parentElement;
  }

  return parts.join(' > ');
}

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
