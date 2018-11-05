var _ADD_CHILDREN;

var ELEMENT_TAG = {
  HTML: 'html',
  IFRAME: 'iframe',
  SCRIPT: 'script',
  DEFAULT: 'default'
};
var ELEMENT_PROP = {
  INNER_HTML: 'innerHTML'
};
var DOM_EVENT = {
  onBlur: 'blur',
  onCancel: 'cancel',
  onClick: 'click',
  onClose: 'close',
  onContextMenu: 'contextMenu',
  onCopy: 'copy',
  onCut: 'cut',
  onAuxClick: 'auxClick',
  onDoubleClick: 'doubleClick',
  onDragEnd: 'dragEnd',
  onDragStart: 'dragStart',
  onDrop: 'drop',
  onFocus: 'focus',
  onInput: 'input',
  onInvalid: 'invalid',
  onKeyDown: 'keyDown',
  onKeyPress: 'keyPress',
  onKeyUp: 'keyUp',
  onMouseDown: 'mouseDown',
  onMouseUp: 'mouseUp',
  onPaste: 'paste',
  onPause: 'pause',
  onPlay: 'play',
  onPointerCancel: 'pointerCancel',
  onPointerDown: 'pointerDown',
  onPointerUp: 'pointerUp',
  onRateChange: 'rateChange',
  onReset: 'reset',
  onSeeked: 'seeked',
  onSubmit: 'submit',
  onTouchCancel: 'touchCancel',
  onTouchEnd: 'touchEnd',
  onTouchStart: 'touchStart',
  onVolumeChange: 'volumeChange',
  onAbort: 'abort',
  onAnimationEnd: 'animationEnd',
  onAnimationIteration: 'animationIteration',
  onAnimationStart: 'animationStart',
  onCanPlay: 'canPlay',
  onCanPlayThrough: 'canPlayThrough',
  onDrag: 'drag',
  onDragEnter: 'dragEnter',
  onDragExit: 'dragExit',
  onDragLeave: 'dragLeave',
  onDragOver: 'dragOver',
  onDurationChange: 'durationChange',
  onEmptied: 'emptied',
  onEncrypted: 'encrypted',
  onEnded: 'ended',
  onError: 'error',
  onGotPointerCapture: 'gotPointerCapture',
  onLoad: 'load',
  onLoadedData: 'loadedData',
  onLoadedMetadata: 'loadedMetadata',
  onLoadStart: 'loadStart',
  onLostPointerCapture: 'lostPointerCapture',
  onMouseMove: 'mouseMove',
  onMouseOut: 'mouseOut',
  onMouseOver: 'mouseOver',
  onPlaying: 'playing',
  onPointerMove: 'pointerMove',
  onPointerOut: 'pointerOut',
  onPointerOver: 'pointerOver',
  onProgress: 'progress',
  onScroll: 'scroll',
  onSeeking: 'seeking',
  onStalled: 'stalled',
  onSuspend: 'suspend',
  onTimeUpdate: 'timeUpdate',
  onToggle: 'toggle',
  onTouchMove: 'touchMove',
  onTransitionEnd: 'transitionEnd',
  onWaiting: 'waiting',
  onWheel: 'wheel'
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

function addProps(_ref) {
  var el = _ref.el,
      props = _ref.props,
      doc = _ref.doc;

  for (var prop in props) {
    if (!props.hasOwnProperty(prop)) {
      continue;
    }

    var val = props[prop];

    if (val === null || typeof val === 'undefined') {
      continue;
    }

    if (DOM_EVENT.hasOwnProperty(prop)) {
      if (typeof val !== 'function') {
        throw new TypeError("Prop " + prop + " must be function");
      }

      el.addEventListener(DOM_EVENT[prop], val);
    } else if (typeof val === 'string' || typeof val === 'number') {
      if (prop === ELEMENT_PROP.INNER_HTML) {
        el.innerHTML = val.toString();
        fixScripts(el, doc);
      } else {
        el.setAttribute(prop, val.toString());
      }
    } else {
      throw new TypeError("Can not render prop " + prop + " of type " + typeof val);
    }
  }
}

var ADD_CHILDREN = (_ADD_CHILDREN = {}, _ADD_CHILDREN[ELEMENT_TAG.IFRAME] = function (_ref2) {
  var el = _ref2.el,
      children = _ref2.children,
      domRenderer = _ref2.domRenderer;
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

    var documentElement = win.document.documentElement;

    while (documentElement.children && documentElement.children.length) {
      documentElement.removeChild(documentElement.children[0]);
    }

    var child = firstChild.render(domRenderer);

    while (child.children.length) {
      documentElement.appendChild(child.children[0]);
    }
  });
}, _ADD_CHILDREN[ELEMENT_TAG.SCRIPT] = function (_ref3) {
  var el = _ref3.el,
      children = _ref3.children;
  var firstChild = children[0];

  if (children.length !== 1 || !firstChild.isTextNode()) {
    throw new Error("Expected only single text node as child of " + ELEMENT_TAG.SCRIPT + " element");
  } // $FlowFixMe


  el.text = firstChild.getText();
}, _ADD_CHILDREN[ELEMENT_TAG.DEFAULT] = function (_ref4) {
  var el = _ref4.el,
      children = _ref4.children,
      doc = _ref4.doc,
      domRenderer = _ref4.domRenderer;

  for (var _i4 = 0; _i4 < children.length; _i4++) {
    var child = children[_i4];

    if (child.isTextNode()) {
      el.appendChild(doc.createTextNode(child.getText()));
    } else {
      el.appendChild(child.render(domRenderer));
    }
  }
}, _ADD_CHILDREN);
export var dom = function dom(_temp) {
  var _ref5 = _temp === void 0 ? {} : _temp,
      _ref5$doc = _ref5.doc,
      doc = _ref5$doc === void 0 ? document : _ref5$doc;

  var domRenderer = function domRenderer(name, props, children) {
    var el = doc.createElement(name);
    var addChildren = ADD_CHILDREN[name] || ADD_CHILDREN[ELEMENT_TAG.DEFAULT];
    addProps({
      el: el,
      props: props,
      doc: doc
    });
    addChildren({
      el: el,
      children: children,
      doc: doc,
      domRenderer: domRenderer
    });
    return el;
  };

  return domRenderer;
};