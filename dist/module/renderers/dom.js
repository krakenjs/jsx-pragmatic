var _ELEMENT_DEFAULT_XML_, _ATTRIBUTE_DEFAULT_XM, _ADD_CHILDREN;

import { ComponentNode, TextNode, ElementNode } from '../node';
import { NODE_TYPE } from '../constants';
import { uniqueID } from '../util';
var ELEMENT_TAG = {
  HTML: 'html',
  IFRAME: 'iframe',
  SCRIPT: 'script',
  SVG: 'svg',
  DEFAULT: 'default'
};
var ELEMENT_PROP = {
  ID: 'id',
  INNER_HTML: 'innerHTML',
  EL: 'el',
  XLINK_HREF: 'xlink:href'
};
var ELEMENT_DEFAULT_XML_NAMESPACE = (_ELEMENT_DEFAULT_XML_ = {}, _ELEMENT_DEFAULT_XML_[ELEMENT_TAG.SVG] = 'http://www.w3.org/2000/svg', _ELEMENT_DEFAULT_XML_);
var ATTRIBUTE_DEFAULT_XML_NAMESPACE = (_ATTRIBUTE_DEFAULT_XM = {}, _ATTRIBUTE_DEFAULT_XM[ELEMENT_PROP.XLINK_HREF] = 'http://www.w3.org/1999/xlink', _ATTRIBUTE_DEFAULT_XM);

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

    var newScript = doc.createElement('script');
    newScript.text = script.textContent;
    parentNode.replaceChild(newScript, script);
  }
}

function createElement(doc, node) {
  if (node.props[ELEMENT_PROP.EL]) {
    return node.props[ELEMENT_PROP.EL];
  } else {
    return doc.createElement(node.name);
  }
}

function createElementWithXMLNamespace(doc, node, xmlNamespace) {
  return doc.createElementNS(xmlNamespace, node.name);
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
      var xmlNamespace = ATTRIBUTE_DEFAULT_XML_NAMESPACE[prop];

      if (xmlNamespace) {
        el.setAttributeNS(xmlNamespace, prop, val.toString());
      } else {
        el.setAttribute(prop, val.toString());
      }
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

var getDefaultDomOptions = function getDefaultDomOptions() {
  // $FlowFixMe
  return {};
};

export function dom(opts) {
  if (opts === void 0) {
    opts = getDefaultDomOptions();
  }

  var _opts = opts,
      _opts$doc = _opts.doc,
      doc = _opts$doc === void 0 ? document : _opts$doc;

  var xmlNamespaceDomRenderer = function xmlNamespaceDomRenderer(node, xmlNamespace) {
    if (node.type === NODE_TYPE.COMPONENT) {
      return node.renderComponent(function (childNode) {
        return xmlNamespaceDomRenderer(childNode, xmlNamespace);
      });
    }

    if (node.type === NODE_TYPE.TEXT) {
      // $FlowFixMe
      return createTextElement(doc, node);
    }

    if (node.type === NODE_TYPE.ELEMENT) {
      var el = createElementWithXMLNamespace(doc, node, xmlNamespace);
      addProps(el, node);
      addChildren(el, node, doc, function (childNode) {
        return xmlNamespaceDomRenderer(childNode, xmlNamespace);
      }); // $FlowFixMe

      return el;
    }

    throw new TypeError("Unhandleable node");
  };

  var domRenderer = function domRenderer(node) {
    if (node.type === NODE_TYPE.COMPONENT) {
      return node.renderComponent(domRenderer);
    }

    if (node.type === NODE_TYPE.TEXT) {
      // $FlowFixMe
      return createTextElement(doc, node);
    }

    if (node.type === NODE_TYPE.ELEMENT) {
      var xmlNamespace = ELEMENT_DEFAULT_XML_NAMESPACE[node.name.toLowerCase()];

      if (xmlNamespace) {
        // $FlowFixMe
        return xmlNamespaceDomRenderer(node, xmlNamespace);
      }

      var el = createElement(doc, node);
      addProps(el, node);
      addChildren(el, node, doc, domRenderer); // $FlowFixMe

      return el;
    }

    throw new TypeError("Unhandleable node");
  };

  return domRenderer;
}