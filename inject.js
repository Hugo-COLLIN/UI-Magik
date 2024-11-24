//css-selector-generator.js
// !function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.CssSelectorGenerator=e():t.CssSelectorGenerator=e()}(self,(()=>(()=>{"use strict";var t={d:(e,n)=>{for(var r in n)t.o(n,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:n[r]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={};function n(t){return"object"==typeof t&&null!==t&&t.nodeType===Node.ELEMENT_NODE}t.r(e),t.d(e,{default:()=>Q,getCssSelector:()=>K});const r={NONE:"",DESCENDANT:" ",CHILD:" > "},o={id:"id",class:"class",tag:"tag",attribute:"attribute",nthchild:"nthchild",nthoftype:"nthoftype"},i="CssSelectorGenerator";function c(t="unknown problem",...e){console.warn(`${i}: ${t}`,...e)}const u={selectors:[o.id,o.class,o.tag,o.attribute],includeTag:!1,whitelist:[],blacklist:[],combineWithinSelector:!0,combineBetweenSelectors:!0,root:null,maxCombinations:Number.POSITIVE_INFINITY,maxCandidates:Number.POSITIVE_INFINITY};function s(t){return t instanceof RegExp}function a(t){return["string","function"].includes(typeof t)||s(t)}function l(t){return Array.isArray(t)?t.filter(a):[]}function f(t){const e=[Node.DOCUMENT_NODE,Node.DOCUMENT_FRAGMENT_NODE,Node.ELEMENT_NODE];return function(t){return t instanceof Node}(t)&&e.includes(t.nodeType)}function d(t,e){if(f(t))return t.contains(e)||c("element root mismatch","Provided root does not contain the element. This will most likely result in producing a fallback selector using element's real root node. If you plan to use the selector using provided root (e.g. `root.querySelector`), it will not work as intended."),t;const n=e.getRootNode({composed:!1});return f(n)?(n!==document&&c("shadow root inferred","You did not provide a root and the element is a child of Shadow DOM. This will produce a selector using ShadowRoot as a root. If you plan to use the selector using document as a root (e.g. `document.querySelector`), it will not work as intended."),n):S(e)}function m(t){return"number"==typeof t?t:Number.POSITIVE_INFINITY}function p(t=[]){const[e=[],...n]=t;return 0===n.length?e:n.reduce(((t,e)=>t.filter((t=>e.includes(t)))),e)}function g(t){return[].concat(...t)}function h(t){const e=t.map((t=>{if(s(t))return e=>t.test(e);if("function"==typeof t)return e=>{const n=t(e);return"boolean"!=typeof n?(c("pattern matcher function invalid","Provided pattern matching function does not return boolean. It's result will be ignored.",t),!1):n};if("string"==typeof t){const e=new RegExp("^"+t.replace(/[|\\{}()[\]^$+?.]/g,"\\$&").replace(/\*/g,".+")+"$");return t=>e.test(t)}return c("pattern matcher invalid","Pattern matching only accepts strings, regular expressions and/or functions. This item is invalid and will be ignored.",t),()=>!1}));return t=>e.some((e=>e(t)))}function b(t,e,n){const r=Array.from(d(n,t[0]).querySelectorAll(e));return r.length===t.length&&t.every((t=>r.includes(t)))}function y(t,e){e=null!=e?e:S(t);const r=[];let o=t;for(;n(o)&&o!==e;)r.push(o),o=o.parentElement;return r}function N(t,e){return p(t.map((t=>y(t,e))))}function S(t){return t.ownerDocument.querySelector(":root")}const E=", ",v=new RegExp(["^$","\\s"].join("|")),w=new RegExp(["^$"].join("|")),I=[o.nthoftype,o.tag,o.id,o.class,o.attribute,o.nthchild],T=h(["class","id","ng-*"]);function O({name:t}){return`[${t}]`}function C({name:t,value:e}){return`[${t}='${e}']`}function x({nodeName:t,nodeValue:e}){return{name:Y(t),value:Y(null!=e?e:void 0)}}function j(t){const e=Array.from(t.attributes).filter((e=>function({nodeName:t,nodeValue:e},n){const r=n.tagName.toLowerCase();return!(["input","option"].includes(r)&&"value"===t||"src"===t&&(null==e?void 0:e.startsWith("data:"))||T(t))}(e,t))).map(x);return[...e.map(O),...e.map(C)]}function A(t){var e;return(null!==(e=t.getAttribute("class"))&&void 0!==e?e:"").trim().split(/\s+/).filter((t=>!w.test(t))).map((t=>`.${Y(t)}`))}function $(t){var e;const n=null!==(e=t.getAttribute("id"))&&void 0!==e?e:"",r=`#${Y(n)}`,o=t.getRootNode({composed:!1});return!v.test(n)&&b([t],r,o)?[r]:[]}function D(t){const e=t.parentNode;if(e){const r=Array.from(e.childNodes).filter(n).indexOf(t);if(r>-1)return[`:nth-child(${String(r+1)})`]}return[]}function R(t){return[Y(t.tagName.toLowerCase())]}function P(t){const e=[...new Set(g(t.map(R)))];return 0===e.length||e.length>1?[]:[e[0]]}function _(t){const e=P([t])[0],n=t.parentElement;if(n){const r=Array.from(n.children).filter((t=>t.tagName.toLowerCase()===e)),o=r.indexOf(t);if(o>-1)return[`${e}:nth-of-type(${String(o+1)})`]}return[]}function k(t=[],{maxResults:e=Number.POSITIVE_INFINITY}={}){return Array.from(function*(t=[],{maxResults:e=Number.POSITIVE_INFINITY}={}){let n=0,r=M(1);for(;r.length<=t.length&&n<e;){n+=1;const e=r.map((e=>t[e]));yield e,r=L(r,t.length-1)}}(t,{maxResults:e}))}function L(t=[],e=0){const n=t.length;if(0===n)return[];const r=[...t];r[n-1]+=1;for(let t=n-1;t>=0;t--)if(r[t]>e){if(0===t)return M(n+1);r[t-1]++,r[t]=r[t-1]+1}return r[n-1]>e?M(n+1):r}function M(t=1){return Array.from(Array(t).keys())}const V=":".charCodeAt(0).toString(16).toUpperCase(),F=/[ !"#$%&'()\[\]{|}<>*+,./;=?@^`~\\]/;function Y(t=""){return CSS?CSS.escape(t):function(t=""){return t.split("").map((t=>":"===t?`\\${V} `:F.test(t)?`\\${t}`:escape(t).replace(/%/g,"\\"))).join("")}(t)}const W={tag:P,id:function(t){return 0===t.length||t.length>1?[]:$(t[0])},class:function(t){return p(t.map(A))},attribute:function(t){return p(t.map(j))},nthchild:function(t){return p(t.map(D))},nthoftype:function(t){return p(t.map(_))}},q={tag:R,id:$,class:A,attribute:j,nthchild:D,nthoftype:_};function B(t){return t.includes(o.tag)||t.includes(o.nthoftype)?[...t]:[...t,o.tag]}function G(t={}){const e=[...I];return t[o.tag]&&t[o.nthoftype]&&e.splice(e.indexOf(o.tag),1),e.map((e=>{return(r=t)[n=e]?r[n].join(""):"";var n,r})).join("")}function H(t,e,n="",o){const i=function(t,e){return""===e?t:function(t,e){return[...t.map((t=>e+r.DESCENDANT+t)),...t.map((t=>e+r.CHILD+t))]}(t,e)}(function(t,e,n){const r=function(t,e){const{blacklist:n,whitelist:r,combineWithinSelector:o,maxCombinations:i}=e,c=h(n),u=h(r);return function(t){const{selectors:e,includeTag:n}=t,r=[...e];return n&&!r.includes("tag")&&r.push("tag"),r}(e).reduce(((e,n)=>{const r=function(t,e){return(0,W[e])(t)}(t,n),s=function(t=[],e,n){return t.filter((t=>n(t)||!e(t)))}(r,c,u),a=function(t=[],e){return t.sort(((t,n)=>{const r=e(t),o=e(n);return r&&!o?-1:!r&&o?1:0}))}(s,u);return e[n]=o?k(a,{maxResults:i}):a.map((t=>[t])),e}),{})}(t,n),o=function(t,e){return function(t){const{selectors:e,combineBetweenSelectors:n,includeTag:r,maxCandidates:o}=t,i=n?k(e,{maxResults:o}):e.map((t=>[t]));return r?i.map(B):i}(e).map((e=>function(t,e){const n={};return t.forEach((t=>{const r=e[t];r&&r.length>0&&(n[t]=r)})),function(t={}){let e=[];return Object.entries(t).forEach((([t,n])=>{e=n.flatMap((n=>0===e.length?[{[t]:n}]:e.map((e=>Object.assign(Object.assign({},e),{[t]:n})))))})),e}(n).map(G)}(e,t))).filter((t=>t.length>0))}(r,n),i=g(o);return[...new Set(i)]}(t,0,o),n);for(const n of i)if(b(t,n,e))return n;return null}function U(t){return{value:t,include:!1}}function z({selectors:t,operator:e}){let n=[...I];t[o.tag]&&t[o.nthoftype]&&(n=n.filter((t=>t!==o.tag)));let r="";return n.forEach((e=>{var n;(null!==(n=t[e])&&void 0!==n?n:[]).forEach((({value:t,include:e})=>{e&&(r+=t)}))})),e+r}function J(t){return[":root",...y(t).reverse().map((t=>{const e=function(t,e,n=r.NONE){const o={};return e.forEach((e=>{Reflect.set(o,e,function(t,e){return q[e](t)}(t,e).map(U))})),{element:t,operator:n,selectors:o}}(t,[o.nthchild],r.CHILD);return e.selectors.nthchild.forEach((t=>{t.include=!0})),e})).map(z)].join("")}function K(t,e={}){var r;const i=function(t){(t instanceof NodeList||t instanceof HTMLCollection)&&(t=Array.from(t));const e=(Array.isArray(t)?t:[t]).filter(n);return[...new Set(e)]}(t),c=function(t,e={}){const n=Object.assign(Object.assign({},u),e);return{selectors:(r=n.selectors,Array.isArray(r)?r.filter((t=>{return e=o,n=t,Object.values(e).includes(n);var e,n})):[]),whitelist:l(n.whitelist),blacklist:l(n.blacklist),root:d(n.root,t),combineWithinSelector:!!n.combineWithinSelector,combineBetweenSelectors:!!n.combineBetweenSelectors,includeTag:!!n.includeTag,maxCombinations:m(n.maxCombinations),maxCandidates:m(n.maxCandidates)};var r}(i[0],e),s=null!==(r=c.root)&&void 0!==r?r:S(i[0]);let a="",f=s;function p(){return function(t,e,n="",r){if(0===t.length)return null;const o=[t.length>1?t:[],...N(t,e).map((t=>[t]))];for(const t of o){const o=H(t,e,n,r);if(o)return{foundElements:t,selector:o}}return null}(i,f,a,c)}let g=p();for(;g;){const{foundElements:t,selector:e}=g;if(b(i,e,s))return e;f=t[0],a=e,g=p()}return i.length>1?i.map((t=>K(t,c))).join(E):function(t){return t.map(J).join(E)}(i)}const Q=K;return e})()));


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
  // selectors[`step${currentStep}`] = window.getComputedStyle(event.target).cssText;
  // selectors[`step${currentStep}`] = CssSelectorGenerator.getCssSelector(event.target);
  // selectors[`step${currentStep}`] = getCssSelector(event.target)
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
