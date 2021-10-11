import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
var _excluded = ["innerHTML"];
import { ComponentNode, TextNode, ElementNode } from '../node';
import { NODE_TYPE } from '../constants';

function mapPreactProps(props) {
  var innerHTML = props.innerHTML,
      remainingProps = _objectWithoutPropertiesLoose(props, _excluded);

  var dangerouslySetInnerHTML = innerHTML ? {
    __html: innerHTML
  } : null; // $FlowFixMe

  return _extends({
    dangerouslySetInnerHTML: dangerouslySetInnerHTML
  }, remainingProps);
}

export function preact(_temp) {
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