var _CREATE_ELEMENT, _ADD_CHILDREN;

import { uniqueID } from '../util';
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

var CREATE_ELEMENT = (_CREATE_ELEMENT = {}, _CREATE_ELEMENT[ELEMENT_TAG.NODE] = function (_ref) {
  var props = _ref.props;

  if (!props[ELEMENT_PROP.EL]) {
    throw new Error("Must pass " + ELEMENT_PROP.EL + " prop to " + ELEMENT_TAG.NODE + " element");
  }

  if (Object.keys(props).length > 1) {
    throw new Error("Must not pass any prop other than " + ELEMENT_PROP.EL + " to " + ELEMENT_TAG.NODE + " element");
  } // $FlowFixMe


  return props[ELEMENT_PROP.EL];
}, _CREATE_ELEMENT[ELEMENT_TAG.DEFAULT] = function (_ref2) {
  var name = _ref2.name,
      doc = _ref2.doc;
  return doc.createElement(name);
}, _CREATE_ELEMENT);

function createElement(_ref3) {
  var doc = _ref3.doc,
      name = _ref3.name,
      props = _ref3.props;
  var elementCreator = CREATE_ELEMENT[name] || CREATE_ELEMENT[ELEMENT_TAG.DEFAULT];
  return elementCreator({
    name: name,
    props: props,
    doc: doc
  });
}

function addProps(_ref4) {
  var el = _ref4.el,
      props = _ref4.props;

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
    } else {
      throw new TypeError("Can not render prop " + prop + " of type " + typeof val);
    }
  }

  if (el.tagName.toLowerCase() === ELEMENT_TAG.IFRAME && !props.id) {
    el.setAttribute(ELEMENT_PROP.ID, "jsx-iframe-" + uniqueID());
  }
}

var ADD_CHILDREN = (_ADD_CHILDREN = {}, _ADD_CHILDREN[ELEMENT_TAG.IFRAME] = function (_ref5) {
  var el = _ref5.el,
      children = _ref5.children;
  var firstChild = children[0];

  if (children.length > 1 || !firstChild.isElementNode()) {
    throw new Error("Expected only single element node as child of " + ELEMENT_TAG.IFRAME + " element");
  }

  if (!firstChild.isTag(ELEMENT_TAG.HTML)) {
    throw new Error("Expected element to be inserted into frame to be html, got " + firstChild.getTag());
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
}, _ADD_CHILDREN[ELEMENT_TAG.SCRIPT] = function (_ref6) {
  var el = _ref6.el,
      children = _ref6.children;
  var firstChild = children[0];

  if (children.length !== 1 || !firstChild.isTextNode()) {
    throw new Error("Expected only single text node as child of " + ELEMENT_TAG.SCRIPT + " element");
  } // $FlowFixMe


  el.text = firstChild.getText();
}, _ADD_CHILDREN[ELEMENT_TAG.DEFAULT] = function (_ref7) {
  var el = _ref7.el,
      children = _ref7.children,
      doc = _ref7.doc,
      domRenderer = _ref7.domRenderer;

  for (var _i6 = 0; _i6 < children.length; _i6++) {
    var child = children[_i6];

    if (child.isTextNode()) {
      el.appendChild(doc.createTextNode(child.getText()));
    } else {
      el.appendChild(child.render(domRenderer));
    }
  }
}, _ADD_CHILDREN);

function addChildren(_ref8) {
  var el = _ref8.el,
      name = _ref8.name,
      props = _ref8.props,
      children = _ref8.children,
      doc = _ref8.doc,
      domRenderer = _ref8.domRenderer;

  if (props.hasOwnProperty(ELEMENT_PROP.INNER_HTML)) {
    if (children.length >= 1) {
      throw new Error("Expected no children to be passed when " + ELEMENT_PROP.INNER_HTML + " prop is set");
    }

    var html = props[ELEMENT_PROP.INNER_HTML];

    if (typeof html !== 'string') {
      throw new TypeError(ELEMENT_PROP.INNER_HTML + " prop must be string");
    }

    if (name === ELEMENT_TAG.SCRIPT) {
      // $FlowFixMe
      el.text = html;
    } else {
      el.innerHTML = html;
      fixScripts(el, doc);
    }
  } else {
    var addChildrenToElement = ADD_CHILDREN[name] || ADD_CHILDREN[ELEMENT_TAG.DEFAULT];
    addChildrenToElement({
      el: el,
      name: name,
      props: props,
      children: children,
      doc: doc,
      domRenderer: domRenderer
    });
  }
}

export var dom = function dom(_temp) {
  var _ref9 = _temp === void 0 ? {} : _temp,
      _ref9$doc = _ref9.doc,
      doc = _ref9$doc === void 0 ? document : _ref9$doc;

  var domRenderer = function domRenderer(name, props, children) {
    var el = createElement({
      name: name,
      props: props,
      doc: doc
    });
    addProps({
      el: el,
      props: props
    });
    addChildren({
      el: el,
      name: name,
      props: props,
      children: children,
      doc: doc,
      domRenderer: domRenderer
    });
    return el;
  };

  return domRenderer;
};