// eslint-disable-line import/no-unresolved
export var react = function react(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      React = _ref.React;

  if (!React) {
    throw new Error("Must pass React library to react renderer");
  }

  var reactRenderer = function reactRenderer(name, props, children) {
    var renderedChildren = children.map(function (child) {
      return child.isTextNode() ? child.getText() : child.render(reactRenderer);
    });
    return React.createElement.apply(React, [name, props].concat(renderedChildren));
  };

  return reactRenderer;
};