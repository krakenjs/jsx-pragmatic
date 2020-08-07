/** @jsx node */
import { TextNode } from '../node';
import { isDefined } from '../util';
import { NODE_TYPE } from '../constants';
import { regex } from '../renderers';

var escapeRegex = function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&');
};

var validateChildren = function validateChildren(name, children) {
  if (!children) {
    throw new Error("Must pass children to " + name);
  }

  return children;
};

var validateNoChildren = function validateNoChildren(name, children) {
  if (children && children.length) {
    throw new Error("Must not pass children to " + name);
  }
};

var validateAndEscapeChildren = function validateAndEscapeChildren(name, children) {
  children = validateChildren(name, children);
  return children.map(function (child) {
    if (child.type === NODE_TYPE.TEXT) {
      return new TextNode(escapeRegex(child.text));
    }

    return child;
  });
};

export function Regex(_ref, children) {
  var _ref$exact = _ref.exact,
      exact = _ref$exact === void 0 ? true : _ref$exact;
  children = validateAndEscapeChildren('RegexGroup', children);

  if (!exact) {
    return children;
  }

  return ['^'].concat(children, ['$']);
}
Regex.renderer = regex;
export function RegexText(props, children) {
  return validateAndEscapeChildren('RegexText', children);
}
export function RegexWord(props, children) {
  validateNoChildren('RegexWord', children);
  return '\\w+';
}
export function RegexCharacters(props, children) {
  return ['['].concat(validateAndEscapeChildren('RegexText', children), [']']);
}
export function RegexGroup(_ref2, children) {
  var repeat = _ref2.repeat,
      repeatMin = _ref2.repeatMin,
      repeatMax = _ref2.repeatMax,
      name = _ref2.name,
      _ref2$optional = _ref2.optional,
      optional = _ref2$optional === void 0 ? false : _ref2$optional,
      _ref2$capture = _ref2.capture,
      capture = _ref2$capture === void 0 ? true : _ref2$capture,
      _ref2$union = _ref2.union,
      union = _ref2$union === void 0 ? false : _ref2$union;
  children = validateAndEscapeChildren('RegexGroup', children);

  if (isDefined(repeat) && (isDefined(repeatMin) || isDefined(repeatMax))) {
    throw new Error("repeat can not be used with repeatMin or repeatMax");
  }

  if (name && !capture) {
    throw new Error("Named groups must be captured");
  }

  if (union) {
    var _result = [];

    for (var _i2 = 0, _children2 = children; _i2 < _children2.length; _i2++) {
      var child = _children2[_i2];

      _result.push(child);

      _result.push(new TextNode('|'));
    }

    _result.pop();

    children = _result;
  }

  var result = [];
  result.push(capture ? '(' : '(?:');

  if (name) {
    result.push("?<" + escapeRegex(name) + ">");
  }

  result.push.apply(result, children);
  result.push(')');

  if (isDefined(repeat)) {
    if (typeof repeat === 'number') {
      result.push("{" + repeat + "}");
    } else if (repeat === true) {
      result.push("+");
    }
  }

  if (isDefined(repeatMin) || isDefined(repeatMax)) {
    result.push("{" + (repeatMin || '') + "," + (repeatMax || '') + "}");
  }

  if (optional) {
    result.push('?');
  }

  return result;
}
export function RegexUnion(props, children) {
  children = validateAndEscapeChildren('RegexGroup', children);
  var result = [];

  for (var _i4 = 0, _children4 = children; _i4 < _children4.length; _i4++) {
    var child = _children4[_i4];
    result.push(child);
    result.push('|');
  }

  result.pop();
  return result;
}