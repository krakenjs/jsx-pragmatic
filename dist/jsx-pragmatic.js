(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("pragmatic", [], factory);
	else if(typeof exports === 'object')
		exports["pragmatic"] = factory();
	else
		root["pragmatic"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/constants.js
var NODE_TYPE = {
  ELEMENT: 'element',
  TEXT: 'text',
  COMPONENT: 'component',
  FRAGMENT: 'fragment'
};
// CONCATENATED MODULE: ./src/node.js


function _renderChildren(children, renderer) {
  // eslint-disable-line no-use-before-define
  var result = [];

  for (var _i2 = 0; _i2 < children.length; _i2++) {
    var child = children[_i2];
    var renderedChild = child.render(renderer);

    if (!renderedChild) {
      continue;
    } else if (Array.isArray(renderedChild)) {
      for (var _i4 = 0; _i4 < renderedChild.length; _i4++) {
        var subchild = renderedChild[_i4];

        if (subchild) {
          result.push(subchild);
        }
      }
    } else {
      result.push(renderedChild);
    }
  }

  return result;
}

var node_ElementNode =
/*#__PURE__*/
function () {
  // eslint-disable-line no-use-before-define
  // eslint-disable-line no-undef
  function ElementNode(name, props, children) {
    this.type = NODE_TYPE.ELEMENT;
    this.name = void 0;
    this.props = void 0;
    this.children = void 0;
    this.onRender = void 0;
    // eslint-disable-line no-use-before-define
    this.name = name;
    this.props = props;
    this.children = children;
    var onRender = props.onRender;

    if (typeof onRender === 'function') {
      this.onRender = onRender;
      delete props.onRender;
    }
  }

  var _proto = ElementNode.prototype;

  _proto.render = function render(renderer) {
    var el = renderer(this);

    if (this.onRender) {
      this.onRender(el);
    }

    return el;
  };

  _proto.renderChildren = function renderChildren(renderer) {
    return _renderChildren(this.children, renderer);
  };

  return ElementNode;
}();
var node_FragmentNode =
/*#__PURE__*/
function () {
  // eslint-disable-line no-use-before-define
  function FragmentNode(children) {
    this.type = NODE_TYPE.FRAGMENT;
    this.children = void 0;
    // eslint-disable-line no-use-before-define
    this.children = children;
  }

  var _proto2 = FragmentNode.prototype;

  _proto2.render = function render(renderer) {
    return _renderChildren(this.children, renderer);
  };

  return FragmentNode;
}();
var node_TextNode =
/*#__PURE__*/
function () {
  function TextNode(text) {
    this.type = NODE_TYPE.TEXT;
    this.text = void 0;
    this.text = text;
  }

  var _proto3 = TextNode.prototype;

  _proto3.render = function render(renderer) {
    return renderer(this);
  };

  return TextNode;
}();
var node_ComponentNode =
/*#__PURE__*/
function () {
  function ComponentNode(component, props, children) {
    this.type = NODE_TYPE.COMPONENT;
    this.component = void 0;
    this.props = void 0;
    this.children = void 0;
    this.component = component;
    this.props = props;
    this.children = children;
  }

  var _proto4 = ComponentNode.prototype;

  _proto4.renderComponent = function renderComponent(renderer) {
    // $FlowFixMe
    var props = this.props;
    var child = normalizeChild(this.component(props, this.children)); // eslint-disable-line no-use-before-define

    if (child) {
      return child.render(renderer);
    }
  };

  _proto4.render = function render(renderer) {
    return renderer(this);
  };

  _proto4.renderChildren = function renderChildren(renderer) {
    return _renderChildren(this.children, renderer);
  };

  return ComponentNode;
}();

function normalizeChildren(children) {
  var result = [];

  for (var _i6 = 0; _i6 < children.length; _i6++) {
    var child = children[_i6];

    if (!child) {
      continue;
    } else if (typeof child === 'string') {
      result.push(new node_TextNode(child));
    } else if (Array.isArray(child)) {
      for (var _i8 = 0, _normalizeChildren2 = normalizeChildren(child); _i8 < _normalizeChildren2.length; _i8++) {
        var subchild = _normalizeChildren2[_i8];
        result.push(subchild);
      }
    } else if (child && (child.type === NODE_TYPE.ELEMENT || child.type === NODE_TYPE.TEXT || child.type === NODE_TYPE.COMPONENT)) {
      result.push(child);
    } else {
      throw new TypeError("Unrecognized node type: " + typeof child);
    }
  }

  return result;
}

function normalizeChild(child) {
  var children = normalizeChildren(Array.isArray(child) ? child : [child]);

  if (children.length === 1) {
    return children[0];
  } else if (children.length > 1) {
    return new node_FragmentNode(children);
  }
}

var node_node = function node(element, props) {
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  // $FlowFixMe
  props = props || {};
  children = normalizeChildren(children);

  if (typeof element === 'string') {
    // $FlowFixMe
    return new node_ElementNode(element, props, children);
  }

  if (typeof element === 'function') {
    // $FlowFixMe
    return new node_ComponentNode(element, props, children);
  }

  throw new TypeError("Expected jsx element to be a string or a function");
};
var Fragment = function Fragment(props, children) {
  if (props && Object.keys(props).length) {
    throw new Error("Do not pass props to Fragment");
  }

  return children;
};
// CONCATENATED MODULE: ./src/util.js
var ALPHA_CHARS = '0123456789abcdef';
function uniqueID() {
  return 'xxxxxxxxxx'.replace(/./g, function () {
    return ALPHA_CHARS.charAt(Math.floor(Math.random() * ALPHA_CHARS.length));
  });
}
// CONCATENATED MODULE: ./src/renderers/dom.js
var _ADD_CHILDREN;




var ELEMENT_TAG = {
  HTML: 'html',
  IFRAME: 'iframe',
  SCRIPT: 'script',
  NODE: 'node',
  DEFAULT: 'default'
};
var ELEMENT_PROP = {
  ID: 'id',
  INNER_HTML: 'innerHTML',
  EL: 'el'
};

function fixScripts(el, doc) {
  if (doc === void 0) {
    doc = window.document;
  }

  for (var _i2 = 0, _el$querySelectorAll2 = el.querySelectorAll('script'); _i2 < _el$querySelectorAll2.length; _i2++) {
    var script = _el$querySelectorAll2[_i2];
    var parentNode = script.parentNode;

    if (!parentNode) {
      continue;
    }

    var newScript = doc.createElement('script'); // $FlowFixMe

    newScript.text = script.textContent;
    parentNode.replaceChild(newScript, script);
  }
}

function createElement(doc, node) {
  if (node.props[ELEMENT_PROP.EL]) {
    // $FlowFixMe
    return node.props[ELEMENT_PROP.EL];
  }

  return doc.createElement(node.name);
}

function createTextElement(doc, node) {
  return doc.createTextNode(node.text);
}

function addProps(el, node) {
  var props = node.props;

  for (var _i4 = 0, _Object$keys2 = Object.keys(props); _i4 < _Object$keys2.length; _i4++) {
    var prop = _Object$keys2[_i4];
    var val = props[prop];

    if (val === null || typeof val === 'undefined' || prop === ELEMENT_PROP.EL || prop === ELEMENT_PROP.INNER_HTML) {
      continue;
    }

    if (prop.match(/^on[A-Z][a-z]/) && typeof val === 'function') {
      el.addEventListener(prop.slice(2).toLowerCase(), val);
    } else if (typeof val === 'string' || typeof val === 'number') {
      el.setAttribute(prop, val.toString());
    } else if (typeof val === 'boolean') {
      if (val === true) {
        el.setAttribute(prop, '');
      }
    }
  }

  if (el.tagName.toLowerCase() === ELEMENT_TAG.IFRAME && !props.id) {
    el.setAttribute(ELEMENT_PROP.ID, "jsx-iframe-" + uniqueID());
  }
}

var ADD_CHILDREN = (_ADD_CHILDREN = {}, _ADD_CHILDREN[ELEMENT_TAG.IFRAME] = function (el, node) {
  var firstChild = node.children[0];

  if (node.children.length !== 1 || !(firstChild && firstChild.type === NODE_TYPE.ELEMENT) || firstChild.name !== ELEMENT_TAG.HTML) {
    throw new Error("Expected only single html element node as child of " + ELEMENT_TAG.IFRAME + " element");
  }

  el.addEventListener('load', function () {
    // $FlowFixMe
    var win = el.contentWindow;

    if (!win) {
      throw new Error("Expected frame to have contentWindow");
    }

    var doc = win.document;
    var docElement = doc.documentElement;

    while (docElement.children && docElement.children.length) {
      docElement.removeChild(docElement.children[0]);
    } // eslint-disable-next-line no-use-before-define


    var child = firstChild.render(dom({
      doc: doc
    }));

    while (child.children.length) {
      docElement.appendChild(child.children[0]);
    }
  });
}, _ADD_CHILDREN[ELEMENT_TAG.SCRIPT] = function (el, node) {
  var firstChild = node.children[0];

  if (node.children.length !== 1 || !(firstChild && firstChild.type === NODE_TYPE.TEXT)) {
    throw new Error("Expected only single text node as child of " + ELEMENT_TAG.SCRIPT + " element");
  } // $FlowFixMe


  el.text = firstChild.text;
}, _ADD_CHILDREN[ELEMENT_TAG.DEFAULT] = function (el, node, renderer) {
  for (var _i6 = 0, _node$renderChildren2 = node.renderChildren(renderer); _i6 < _node$renderChildren2.length; _i6++) {
    var child = _node$renderChildren2[_i6];
    el.appendChild(child);
  }
}, _ADD_CHILDREN);

function addChildren(el, node, doc, renderer) {
  if (node.props.hasOwnProperty(ELEMENT_PROP.INNER_HTML)) {
    if (node.children.length) {
      throw new Error("Expected no children to be passed when " + ELEMENT_PROP.INNER_HTML + " prop is set");
    }

    var html = node.props[ELEMENT_PROP.INNER_HTML];

    if (typeof html !== 'string') {
      throw new TypeError(ELEMENT_PROP.INNER_HTML + " prop must be string");
    }

    if (node.name === ELEMENT_TAG.SCRIPT) {
      // $FlowFixMe
      el.text = html;
    } else {
      el.innerHTML = html;
      fixScripts(el, doc);
    }
  } else {
    var addChildrenToElement = ADD_CHILDREN[node.name] || ADD_CHILDREN[ELEMENT_TAG.DEFAULT];
    addChildrenToElement(el, node, renderer);
  }
}

function dom(opts) {
  if (opts === void 0) {
    opts = {};
  }

  var _opts = opts,
      _opts$doc = _opts.doc,
      doc = _opts$doc === void 0 ? document : _opts$doc;

  var domRenderer = function domRenderer(node) {
    if (node.type === NODE_TYPE.COMPONENT) {
      return node.renderComponent(domRenderer);
    }

    if (node.type === NODE_TYPE.TEXT) {
      // $FlowFixMe
      return createTextElement(doc, node);
    }

    if (node.type === NODE_TYPE.ELEMENT) {
      var el = createElement(doc, node);
      addProps(el, node);
      addChildren(el, node, doc, domRenderer); // $FlowFixMe

      return el;
    }

    throw new TypeError("Unhandleable node");
  };

  return domRenderer;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/extends.js
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}
// CONCATENATED MODULE: ./src/renderers/react.js


// eslint-disable-line import/no-unresolved



function mapReactProps(props) {
  var innerHTML = props.innerHTML,
      className = props.class,
      remainingProps = _objectWithoutPropertiesLoose(props, ["innerHTML", "class"]);

  var dangerouslySetInnerHTML = innerHTML ? {
    __html: innerHTML
  } : null;
  return _extends({
    dangerouslySetInnerHTML: dangerouslySetInnerHTML,
    className: className
  }, remainingProps);
}

function react(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      React = _ref.React;

  if (!React) {
    throw new Error("Must pass React library to react renderer");
  }

  var reactRenderer = function reactRenderer(node) {
    if (node.type === NODE_TYPE.COMPONENT) {
      return React.createElement.apply(React, [function () {
        return node.renderComponent(reactRenderer) || null;
      }, node.props].concat(node.renderChildren(reactRenderer)));
    }

    if (node.type === NODE_TYPE.ELEMENT) {
      return React.createElement.apply(React, [node.name, mapReactProps(node.props)].concat(node.renderChildren(reactRenderer)));
    }

    if (node.type === NODE_TYPE.TEXT) {
      return node.text;
    }

    throw new TypeError("Unhandleable node");
  };

  return reactRenderer;
}
// CONCATENATED MODULE: ./src/renderers/html.js


var html_ELEMENT_PROP = {
  INNER_HTML: 'innerHTML'
};
var SELF_CLOSING_TAGS = {
  br: true
};

function htmlEncode(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/\//g, '&#x2F;');
}

function propsToHTML(props) {
  var keys = Object.keys(props).filter(function (key) {
    var val = props[key];

    if (key === html_ELEMENT_PROP.INNER_HTML) {
      return false;
    }

    if (!val) {
      return false;
    }

    if (typeof val === 'string' || typeof val === 'number' || val === true) {
      return true;
    }

    return false;
  });

  if (!keys.length) {
    return '';
  }

  var pairs = keys.map(function (key) {
    var val = props[key];

    if (val === true) {
      return "" + htmlEncode(key);
    }

    if (typeof val !== 'string' && typeof val !== 'number') {
      throw new TypeError("Unexpected prop type: " + typeof val);
    }

    return htmlEncode(key) + "=\"" + htmlEncode(val.toString()) + "\"";
  });
  return " " + pairs.join(' ');
}

function html() {
  var htmlRenderer = function htmlRenderer(node) {
    if (node.type === NODE_TYPE.COMPONENT) {
      return [].concat(node.renderComponent(htmlRenderer)).join('');
    }

    if (node.type === NODE_TYPE.ELEMENT) {
      var renderedProps = propsToHTML(node.props);

      if (SELF_CLOSING_TAGS[node.name]) {
        return "<" + node.name + renderedProps + " />";
      } else {
        var renderedChildren = typeof node.props[html_ELEMENT_PROP.INNER_HTML] === 'string' ? node.props[html_ELEMENT_PROP.INNER_HTML] : node.renderChildren(htmlRenderer).join('');
        return "<" + node.name + renderedProps + ">" + renderedChildren + "</" + node.name + ">";
      }
    }

    if (node.type === NODE_TYPE.TEXT) {
      return htmlEncode(node.text);
    }

    throw new TypeError("Unhandleable node: " + node.type);
  };

  return htmlRenderer;
}
// CONCATENATED MODULE: ./src/renderers/preact.js


// eslint-disable-line import/no-unresolved



function mapPreactProps(props) {
  var innerHTML = props.innerHTML,
      remainingProps = _objectWithoutPropertiesLoose(props, ["innerHTML"]);

  var dangerouslySetInnerHTML = innerHTML ? {
    __html: innerHTML
  } : null;
  return _extends({
    dangerouslySetInnerHTML: dangerouslySetInnerHTML
  }, remainingProps);
}

function preact(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      Preact = _ref.Preact;

  if (!Preact) {
    throw new Error("Must pass Preact library to react renderer");
  }

  var reactRenderer = function reactRenderer(node) {
    if (node.type === NODE_TYPE.COMPONENT) {
      return Preact.h.apply(Preact, [function () {
        return node.renderComponent(reactRenderer) || null;
      }, node.props].concat(node.renderChildren(reactRenderer)));
    }

    if (node.type === NODE_TYPE.ELEMENT) {
      return Preact.h.apply(Preact, [node.name, mapPreactProps(node.props)].concat(node.renderChildren(reactRenderer)));
    }

    if (node.type === NODE_TYPE.TEXT) {
      return node.text;
    }

    throw new TypeError("Unhandleable node");
  };

  return reactRenderer;
}
// CONCATENATED MODULE: ./src/renderers/index.js




// CONCATENATED MODULE: ./src/index.js
/* concated harmony reexport ElementNode */__webpack_require__.d(__webpack_exports__, "ElementNode", function() { return node_ElementNode; });
/* concated harmony reexport FragmentNode */__webpack_require__.d(__webpack_exports__, "FragmentNode", function() { return node_FragmentNode; });
/* concated harmony reexport TextNode */__webpack_require__.d(__webpack_exports__, "TextNode", function() { return node_TextNode; });
/* concated harmony reexport ComponentNode */__webpack_require__.d(__webpack_exports__, "ComponentNode", function() { return node_ComponentNode; });
/* concated harmony reexport node */__webpack_require__.d(__webpack_exports__, "node", function() { return node_node; });
/* concated harmony reexport Fragment */__webpack_require__.d(__webpack_exports__, "Fragment", function() { return Fragment; });
/* concated harmony reexport dom */__webpack_require__.d(__webpack_exports__, "dom", function() { return dom; });
/* concated harmony reexport react */__webpack_require__.d(__webpack_exports__, "react", function() { return react; });
/* concated harmony reexport html */__webpack_require__.d(__webpack_exports__, "html", function() { return html; });
/* concated harmony reexport preact */__webpack_require__.d(__webpack_exports__, "preact", function() { return preact; });
/* concated harmony reexport NODE_TYPE */__webpack_require__.d(__webpack_exports__, "NODE_TYPE", function() { return NODE_TYPE; });




/***/ })
/******/ ]);
});
//# sourceMappingURL=jsx-pragmatic.js.map