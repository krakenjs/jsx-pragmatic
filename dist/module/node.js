import _inheritsLoose from "@babel/runtime/helpers/esm/inheritsLoose";

// eslint-disable-next-line no-use-before-define
// eslint-disable-next-line no-use-before-define
var Node =
/*#__PURE__*/
function () {
  function Node() {}

  var _proto = Node.prototype;

  _proto.isElementNode = function isElementNode() {
    return false;
  };

  _proto.isTextNode = function isTextNode() {
    return false;
  };

  _proto.isFragmentNode = function isFragmentNode() {
    return false;
  };

  return Node;
}();

export var ElementNode =
/*#__PURE__*/
function (_Node) {
  _inheritsLoose(ElementNode, _Node);

  // eslint-disable-line no-undef
  function ElementNode(name, props, children) {
    var _this;

    _this = _Node.call(this) || this;
    _this.name = void 0;
    _this.props = void 0;
    _this.children = void 0;
    _this.onRender = void 0;
    _this.name = name;
    _this.props = props;
    _this.children = children;

    if (typeof props.onRender === 'function') {
      _this.onRender = props.onRender;
      delete props.onRender;
    }

    return _this;
  }

  var _proto2 = ElementNode.prototype;

  _proto2.getTag = function getTag() {
    return this.name;
  };

  _proto2.isTag = function isTag(name) {
    return name === this.name;
  };

  _proto2.isElementNode = function isElementNode() {
    return true;
  };

  _proto2.render = function render(renderer) {
    var element = renderer(this.name, this.props, this.children);

    if (this.onRender) {
      this.onRender(element);
    }

    return element;
  };

  _proto2.getText = function getText() {
    throw new Error("Can not get text of an element node");
  };

  return ElementNode;
}(Node);
export var TextNode =
/*#__PURE__*/
function (_Node2) {
  _inheritsLoose(TextNode, _Node2);

  function TextNode(text) {
    var _this2;

    _this2 = _Node2.call(this) || this;
    _this2.text = void 0;
    _this2.text = text;
    return _this2;
  }

  var _proto3 = TextNode.prototype;

  _proto3.getTag = function getTag() {
    throw new Error("Can not get tag of text node");
  };

  _proto3.isTag = function isTag(name) {
    // eslint-disable-line no-unused-vars
    throw new Error("Can not check tag of text node");
  };

  _proto3.isTextNode = function isTextNode() {
    return true;
  };

  _proto3.render = function render(renderer) {
    // eslint-disable-line no-unused-vars
    throw new Error("Can not render a text node");
  };

  _proto3.getText = function getText() {
    return this.text;
  };

  return TextNode;
}(Node);
export var FragmentNode =
/*#__PURE__*/
function (_Node3) {
  _inheritsLoose(FragmentNode, _Node3);

  function FragmentNode(children) {
    var _this3;

    _this3 = _Node3.call(this) || this;
    _this3.children = void 0;
    _this3.children = children;
    return _this3;
  }

  var _proto4 = FragmentNode.prototype;

  _proto4.getTag = function getTag() {
    throw new Error("Can not get tag of fragment node");
  };

  _proto4.isTag = function isTag(name) {
    // eslint-disable-line no-unused-vars
    throw new Error("Can not check tag of fragment node");
  };

  _proto4.isFragmentNode = function isFragmentNode() {
    return true;
  };

  _proto4.render = function render(renderer) {
    // eslint-disable-line no-unused-vars
    throw new Error("Can not render a fragment node");
  };

  _proto4.getText = function getText() {
    throw new Error("Can not get text of a fragment node");
  };

  return FragmentNode;
}(Node);

function normalizeChild(child) {
  if (typeof child === 'string') {
    return new TextNode(child);
  } else if (child instanceof ElementNode || child instanceof TextNode || child instanceof FragmentNode) {
    return child;
  } else if (Array.isArray(child)) {
    return new FragmentNode(normalizeChildren(child)); // eslint-disable-line no-use-before-define
  } else if (child === null || typeof child === 'undefined') {
    return; // eslint-disable-line no-useless-return
  } else {
    throw new Error("Child node must be string or instance of jsx-pragmatic node; got " + typeof child);
  }
}

function normalizeChildren(children) {
  var result = [];

  for (var _i2 = 0; _i2 < children.length; _i2++) {
    var child = children[_i2];
    var normalizedChild = normalizeChild(child);

    if (!normalizedChild) {
      continue;
    }

    if (normalizedChild instanceof FragmentNode) {
      for (var _i4 = 0, _normalizedChild$chil2 = normalizedChild.children; _i4 < _normalizedChild$chil2.length; _i4++) {
        var subchild = _normalizedChild$chil2[_i4];
        result.push(subchild);
      }
    } else {
      result.push(normalizedChild);
    }
  }

  return result;
}

export var node = function node(element, props) {
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  if (typeof element === 'string') {
    return new ElementNode(element, props || {}, normalizeChildren(children));
  }

  if (typeof element === 'function') {
    // $FlowFixMe
    return normalizeChild(element(props || {}, normalizeChildren(children)));
  }

  throw new TypeError("Expected jsx Element to be a string or a function");
};
export function Fragment(props) {
  if (props && Object.keys(props).length) {
    throw new Error("Do not pass props to Fragment");
  }

  for (var _len2 = arguments.length, children = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    children[_key2 - 1] = arguments[_key2];
  }

  return new FragmentNode(normalizeChildren(children));
}