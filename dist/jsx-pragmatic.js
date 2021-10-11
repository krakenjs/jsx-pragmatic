!function(root, factory) {
    "object" == typeof exports && "object" == typeof module ? module.exports = factory() : "function" == typeof define && define.amd ? define("pragmatic", [], factory) : "object" == typeof exports ? exports.pragmatic = factory() : root.pragmatic = factory();
}("undefined" != typeof self ? self : this, (function() {
    return function(modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) return installedModules[moduleId].exports;
            var module = installedModules[moduleId] = {
                i: moduleId,
                l: !1,
                exports: {}
            };
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            module.l = !0;
            return module.exports;
        }
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.d = function(exports, name, getter) {
            __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
                enumerable: !0,
                get: getter
            });
        };
        __webpack_require__.r = function(exports) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
                value: "Module"
            });
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
        };
        __webpack_require__.t = function(value, mode) {
            1 & mode && (value = __webpack_require__(value));
            if (8 & mode) return value;
            if (4 & mode && "object" == typeof value && value && value.__esModule) return value;
            var ns = Object.create(null);
            __webpack_require__.r(ns);
            Object.defineProperty(ns, "default", {
                enumerable: !0,
                value: value
            });
            if (2 & mode && "string" != typeof value) for (var key in value) __webpack_require__.d(ns, key, function(key) {
                return value[key];
            }.bind(null, key));
            return ns;
        };
        __webpack_require__.n = function(module) {
            var getter = module && module.__esModule ? function() {
                return module.default;
            } : function() {
                return module;
            };
            __webpack_require__.d(getter, "a", getter);
            return getter;
        };
        __webpack_require__.o = function(object, property) {
            return {}.hasOwnProperty.call(object, property);
        };
        __webpack_require__.p = "";
        return __webpack_require__(__webpack_require__.s = 0);
    }([ function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(__webpack_exports__, "ElementNode", (function() {
            return node_ElementNode;
        }));
        __webpack_require__.d(__webpack_exports__, "FragmentNode", (function() {
            return node_FragmentNode;
        }));
        __webpack_require__.d(__webpack_exports__, "TextNode", (function() {
            return node_TextNode;
        }));
        __webpack_require__.d(__webpack_exports__, "ComponentNode", (function() {
            return node_ComponentNode;
        }));
        __webpack_require__.d(__webpack_exports__, "node", (function() {
            return node_node;
        }));
        __webpack_require__.d(__webpack_exports__, "Fragment", (function() {
            return Fragment;
        }));
        __webpack_require__.d(__webpack_exports__, "text", (function() {
            return text_text;
        }));
        __webpack_require__.d(__webpack_exports__, "dom", (function() {
            return dom;
        }));
        __webpack_require__.d(__webpack_exports__, "react", (function() {
            return react;
        }));
        __webpack_require__.d(__webpack_exports__, "html", (function() {
            return html;
        }));
        __webpack_require__.d(__webpack_exports__, "preact", (function() {
            return preact;
        }));
        __webpack_require__.d(__webpack_exports__, "regex", (function() {
            return regex;
        }));
        __webpack_require__.d(__webpack_exports__, "NODE_TYPE", (function() {
            return NODE_TYPE;
        }));
        __webpack_require__.d(__webpack_exports__, "Style", (function() {
            return Style;
        }));
        __webpack_require__.d(__webpack_exports__, "Regex", (function() {
            return Regex;
        }));
        __webpack_require__.d(__webpack_exports__, "RegexText", (function() {
            return RegexText;
        }));
        __webpack_require__.d(__webpack_exports__, "RegexWord", (function() {
            return RegexWord;
        }));
        __webpack_require__.d(__webpack_exports__, "RegexCharacters", (function() {
            return RegexCharacters;
        }));
        __webpack_require__.d(__webpack_exports__, "RegexGroup", (function() {
            return RegexGroup;
        }));
        __webpack_require__.d(__webpack_exports__, "RegexUnion", (function() {
            return RegexUnion;
        }));
        var NODE_TYPE = {
            ELEMENT: "element",
            TEXT: "text",
            COMPONENT: "component",
            FRAGMENT: "fragment"
        };
        function _renderChildren(children, renderer) {
            var result = [];
            for (var _i2 = 0; _i2 < children.length; _i2++) {
                var renderedChild = children[_i2].render(renderer);
                if (renderedChild) if (Array.isArray(renderedChild)) for (var _i4 = 0; _i4 < renderedChild.length; _i4++) {
                    var subchild = renderedChild[_i4];
                    subchild && result.push(subchild);
                } else result.push(renderedChild);
            }
            return result;
        }
        var node_ElementNode = function() {
            function ElementNode(name, props, children) {
                this.type = NODE_TYPE.ELEMENT;
                this.name = void 0;
                this.props = void 0;
                this.children = void 0;
                this.onRender = void 0;
                this.name = name;
                this.props = props || {};
                this.children = children;
                var onRender = this.props.onRender;
                if ("function" == typeof onRender) {
                    this.onRender = onRender;
                    delete props.onRender;
                }
            }
            var _proto = ElementNode.prototype;
            _proto.render = function(renderer) {
                var el = renderer(this);
                this.onRender && this.onRender(el);
                return el;
            };
            _proto.renderChildren = function(renderer) {
                return _renderChildren(this.children, renderer);
            };
            return ElementNode;
        }();
        var node_FragmentNode = function() {
            function FragmentNode(children) {
                this.type = NODE_TYPE.FRAGMENT;
                this.children = void 0;
                this.children = children;
            }
            FragmentNode.prototype.render = function(renderer) {
                return _renderChildren(this.children, renderer);
            };
            return FragmentNode;
        }();
        var node_TextNode = function() {
            function TextNode(text) {
                this.type = NODE_TYPE.TEXT;
                this.text = void 0;
                this.text = text;
            }
            TextNode.prototype.render = function(renderer) {
                return renderer(this);
            };
            return TextNode;
        }();
        var node_ComponentNode = function() {
            function ComponentNode(component, props, children) {
                this.type = NODE_TYPE.COMPONENT;
                this.component = void 0;
                this.props = void 0;
                this.children = void 0;
                this.component = component;
                this.props = props || {};
                this.children = children;
                this.props.children = children;
            }
            var _proto4 = ComponentNode.prototype;
            _proto4.renderComponent = function(renderer) {
                var child = function(child) {
                    var children = normalizeChildren(Array.isArray(child) ? child : [ child ]);
                    return 1 === children.length ? children[0] : children.length > 1 ? new node_FragmentNode(children) : void 0;
                }(this.component(this.props, this.children));
                if (child) return child.render(renderer);
            };
            _proto4.render = function(renderer) {
                return renderer(this);
            };
            _proto4.renderChildren = function(renderer) {
                return _renderChildren(this.children, renderer);
            };
            return ComponentNode;
        }();
        function normalizeChildren(children) {
            var result = [];
            for (var _i6 = 0; _i6 < children.length; _i6++) {
                var child = children[_i6];
                if (child) if ("string" == typeof child || "number" == typeof child) result.push(new node_TextNode(child.toString())); else {
                    if ("boolean" == typeof child) continue;
                    if (Array.isArray(child)) for (var _i8 = 0, _normalizeChildren2 = normalizeChildren(child); _i8 < _normalizeChildren2.length; _i8++) result.push(_normalizeChildren2[_i8]); else {
                        if (!child || child.type !== NODE_TYPE.ELEMENT && child.type !== NODE_TYPE.TEXT && child.type !== NODE_TYPE.COMPONENT) throw new TypeError("Unrecognized node type: " + typeof child);
                        result.push(child);
                    }
                }
            }
            return result;
        }
        var node_node = function(element, props) {
            for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) children[_key - 2] = arguments[_key];
            children = normalizeChildren(children);
            if ("string" == typeof element) return new node_ElementNode(element, props, children);
            if ("function" == typeof element) return new node_ComponentNode(element, props, children);
            throw new TypeError("Expected jsx element to be a string or a function");
        };
        var Fragment = function(props, children) {
            return children;
        };
        function text_text() {
            return function textRenderer(node) {
                if (node.type === NODE_TYPE.COMPONENT) return [].concat(node.renderComponent(textRenderer)).join("");
                if (node.type === NODE_TYPE.ELEMENT) throw new Error("Text renderer does not support basic elements");
                if (node.type === NODE_TYPE.TEXT) return node.text;
                throw new TypeError("Unhandleable node: " + node.type);
            };
        }
        function isDefined(val) {
            return null != val;
        }
        var _ELEMENT_DEFAULT_XML_, _ATTRIBUTE_DEFAULT_XM, _ADD_CHILDREN;
        var ELEMENT_DEFAULT_XML_NAMESPACE = ((_ELEMENT_DEFAULT_XML_ = {}).svg = "http://www.w3.org/2000/svg", 
        _ELEMENT_DEFAULT_XML_);
        var ATTRIBUTE_DEFAULT_XML_NAMESPACE = ((_ATTRIBUTE_DEFAULT_XM = {})["xlink:href"] = "http://www.w3.org/1999/xlink", 
        _ATTRIBUTE_DEFAULT_XM);
        function createTextElement(doc, node) {
            return doc.createTextNode(node.text);
        }
        function addProps(el, node) {
            var props = node.props;
            for (var _i4 = 0, _Object$keys2 = Object.keys(props); _i4 < _Object$keys2.length; _i4++) {
                var prop = _Object$keys2[_i4];
                var val = props[prop];
                if (null != val && "el" !== prop && "innerHTML" !== prop) if (prop.match(/^on[A-Z][a-z]/) && "function" == typeof val) el.addEventListener(prop.slice(2).toLowerCase(), val); else if ("string" == typeof val || "number" == typeof val) {
                    var xmlNamespace = ATTRIBUTE_DEFAULT_XML_NAMESPACE[prop];
                    xmlNamespace ? el.setAttributeNS(xmlNamespace, prop, val.toString()) : el.setAttribute(prop, val.toString());
                } else "boolean" == typeof val && !0 === val && el.setAttribute(prop, "");
            }
            "iframe" !== el.tagName.toLowerCase() || props.id || el.setAttribute("id", "jsx-iframe-" + "xxxxxxxxxx".replace(/./g, (function() {
                return "0123456789abcdef".charAt(Math.floor(Math.random() * "0123456789abcdef".length));
            })));
        }
        var ADD_CHILDREN = ((_ADD_CHILDREN = {}).iframe = function(el, node) {
            var firstChild = node.children[0];
            if (1 !== node.children.length || !firstChild || firstChild.type !== NODE_TYPE.ELEMENT || "html" !== firstChild.name) throw new Error("Expected only single html element node as child of iframe element");
            el.addEventListener("load", (function() {
                var win = el.contentWindow;
                if (!win) throw new Error("Expected frame to have contentWindow");
                var doc = win.document;
                var docElement = doc.documentElement;
                for (;docElement.children && docElement.children.length; ) docElement.removeChild(docElement.children[0]);
                var child = firstChild.render(dom({
                    doc: doc
                }));
                for (;child.children.length; ) docElement.appendChild(child.children[0]);
            }));
        }, _ADD_CHILDREN.script = function(el, node) {
            var firstChild = node.children[0];
            if (1 !== node.children.length || !firstChild || firstChild.type !== NODE_TYPE.TEXT) throw new Error("Expected only single text node as child of script element");
            el.text = firstChild.text;
        }, _ADD_CHILDREN.default = function(el, node, renderer) {
            for (var _i6 = 0, _node$renderChildren2 = node.renderChildren(renderer); _i6 < _node$renderChildren2.length; _i6++) el.appendChild(_node$renderChildren2[_i6]);
        }, _ADD_CHILDREN);
        function addChildren(el, node, doc, renderer) {
            if (node.props.hasOwnProperty("innerHTML")) {
                if (node.children.length) throw new Error("Expected no children to be passed when innerHTML prop is set");
                var html = node.props.innerHTML;
                if ("string" != typeof html) throw new TypeError("innerHTML prop must be string");
                if ("script" === node.name) el.text = html; else {
                    el.innerHTML = html;
                    !function(el, doc) {
                        void 0 === doc && (doc = window.document);
                        for (var _i2 = 0, _el$querySelectorAll2 = el.querySelectorAll("script"); _i2 < _el$querySelectorAll2.length; _i2++) {
                            var script = _el$querySelectorAll2[_i2];
                            var parentNode = script.parentNode;
                            if (parentNode) {
                                var newScript = doc.createElement("script");
                                newScript.text = script.textContent;
                                parentNode.replaceChild(newScript, script);
                            }
                        }
                    }(el, doc);
                }
            } else (ADD_CHILDREN[node.name] || ADD_CHILDREN.default)(el, node, renderer);
        }
        function dom(opts) {
            void 0 === opts && (opts = {});
            var _opts$doc = opts.doc, doc = void 0 === _opts$doc ? document : _opts$doc;
            return function domRenderer(node) {
                if (node.type === NODE_TYPE.COMPONENT) return node.renderComponent(domRenderer);
                if (node.type === NODE_TYPE.TEXT) return createTextElement(doc, node);
                if (node.type === NODE_TYPE.ELEMENT) {
                    var xmlNamespace = ELEMENT_DEFAULT_XML_NAMESPACE[node.name.toLowerCase()];
                    if (xmlNamespace) return function xmlNamespaceDomRenderer(node, xmlNamespace) {
                        if (node.type === NODE_TYPE.COMPONENT) return node.renderComponent((function(childNode) {
                            return xmlNamespaceDomRenderer(childNode, xmlNamespace);
                        }));
                        if (node.type === NODE_TYPE.TEXT) return createTextElement(doc, node);
                        if (node.type === NODE_TYPE.ELEMENT) {
                            var el = function(doc, node, xmlNamespace) {
                                return doc.createElementNS(xmlNamespace, node.name);
                            }(doc, node, xmlNamespace);
                            addProps(el, node);
                            addChildren(el, node, doc, (function(childNode) {
                                return xmlNamespaceDomRenderer(childNode, xmlNamespace);
                            }));
                            return el;
                        }
                        throw new TypeError("Unhandleable node");
                    }(node, xmlNamespace);
                    var el = function(doc, node) {
                        return node.props.el ? node.props.el : doc.createElement(node.name);
                    }(doc, node);
                    addProps(el, node);
                    addChildren(el, node, doc, domRenderer);
                    return el;
                }
                throw new TypeError("Unhandleable node");
            };
        }
        function _extends() {
            return (_extends = Object.assign || function(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i];
                    for (var key in source) ({}).hasOwnProperty.call(source, key) && (target[key] = source[key]);
                }
                return target;
            }).apply(this, arguments);
        }
        function _objectWithoutPropertiesLoose(source, excluded) {
            if (null == source) return {};
            var target = {};
            var sourceKeys = Object.keys(source);
            var key, i;
            for (i = 0; i < sourceKeys.length; i++) excluded.indexOf(key = sourceKeys[i]) >= 0 || (target[key] = source[key]);
            return target;
        }
        var _excluded = [ "innerHTML", "class" ];
        function react(_temp) {
            var React = (void 0 === _temp ? {} : _temp).React;
            if (!React) throw new Error("Must pass React library to react renderer");
            return function reactRenderer(node) {
                if (node.type === NODE_TYPE.COMPONENT) return React.createElement.apply(React, [ function() {
                    return node.renderComponent(reactRenderer) || null;
                }, node.props ].concat(node.renderChildren(reactRenderer)));
                if (node.type === NODE_TYPE.ELEMENT) return React.createElement.apply(React, [ node.name, (props = node.props, 
                innerHTML = props.innerHTML, _extends({
                    dangerouslySetInnerHTML: innerHTML ? {
                        __html: innerHTML
                    } : null,
                    className: props.class
                }, _objectWithoutPropertiesLoose(props, _excluded))) ].concat(node.renderChildren(reactRenderer)));
                var props, innerHTML;
                if (node.type === NODE_TYPE.TEXT) return node.text;
                throw new TypeError("Unhandleable node");
            };
        }
        var SELF_CLOSING_TAGS = {
            br: !0
        };
        function htmlEncode(text) {
            return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/\//g, "&#x2F;");
        }
        function html() {
            return function htmlRenderer(node) {
                if (node.type === NODE_TYPE.COMPONENT) return [].concat(node.renderComponent(htmlRenderer)).join("");
                if (node.type === NODE_TYPE.ELEMENT) {
                    var renderedProps = (props = node.props, (keys = Object.keys(props).filter((function(key) {
                        var val = props[key];
                        return "innerHTML" !== key && ("string" == typeof val || "number" == typeof val || !0 === val);
                    }))).length ? " " + keys.map((function(key) {
                        var val = props[key];
                        if (!0 === val) return "" + htmlEncode(key);
                        if ("string" != typeof val && "number" != typeof val) throw new TypeError("Unexpected prop type: " + typeof val);
                        return "" === val ? htmlEncode(key) : htmlEncode(key) + '="' + htmlEncode(val.toString()) + '"';
                    })).join(" ") : "");
                    if (SELF_CLOSING_TAGS[node.name]) return "<" + node.name + renderedProps + " />";
                    var renderedChildren = "string" == typeof node.props.innerHTML ? node.props.innerHTML : node.renderChildren(htmlRenderer).join("");
                    return "<" + node.name + renderedProps + ">" + renderedChildren + "</" + node.name + ">";
                }
                var props, keys;
                if (node.type === NODE_TYPE.TEXT) return htmlEncode(node.text);
                throw new TypeError("Unhandleable node: " + node.type);
            };
        }
        var preact_excluded = [ "innerHTML" ];
        function preact(_temp) {
            var Preact = (void 0 === _temp ? {} : _temp).Preact;
            if (!Preact) throw new Error("Must pass Preact library to react renderer");
            return function reactRenderer(node) {
                if (node.type === NODE_TYPE.COMPONENT) return Preact.h.apply(Preact, [ function() {
                    return node.renderComponent(reactRenderer) || null;
                }, node.props ].concat(node.renderChildren(reactRenderer)));
                if (node.type === NODE_TYPE.ELEMENT) return Preact.h.apply(Preact, [ node.name, (props = node.props, 
                innerHTML = props.innerHTML, _extends({
                    dangerouslySetInnerHTML: innerHTML ? {
                        __html: innerHTML
                    } : null
                }, _objectWithoutPropertiesLoose(props, preact_excluded))) ].concat(node.renderChildren(reactRenderer)));
                var props, innerHTML;
                if (node.type === NODE_TYPE.TEXT) return node.text;
                throw new TypeError("Unhandleable node");
            };
        }
        function regex() {
            var regexRenderer = text_text();
            return function(nodeInstance) {
                return new RegExp(regexRenderer(nodeInstance));
            };
        }
        regex.node = function(el, props) {
            for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) children[_key - 2] = arguments[_key];
            var nodeInstance = node_node.apply(void 0, [ el, props ].concat(children));
            return el.renderer ? nodeInstance.render(el.renderer()) : nodeInstance;
        };
        function Style(_ref) {
            var css = _ref.css, nonce = _ref.nonce, children = _ref.children;
            return node_node(Fragment, null, node_node("style", {
                innerHTML: "string" == typeof css ? css : css._getCss(),
                nonce: nonce
            }), children);
        }
        var escapeRegex = function(text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&");
        };
        var regex_validateAndEscapeChildren = function(name, children) {
            return (children = function(name, children) {
                if (!children) throw new Error("Must pass children to " + name);
                return children;
            }(name, children)).map((function(child) {
                return child.type === NODE_TYPE.TEXT ? new node_TextNode(escapeRegex(child.text)) : child;
            }));
        };
        function Regex(_ref, children) {
            var _ref$exact = _ref.exact, exact = void 0 === _ref$exact || _ref$exact;
            children = regex_validateAndEscapeChildren("RegexGroup", children);
            return exact ? [ "^" ].concat(children, [ "$" ]) : children;
        }
        Regex.renderer = regex;
        function RegexText(props, children) {
            return regex_validateAndEscapeChildren("RegexText", children);
        }
        function RegexWord(props, children) {
            !function(name, children) {
                if (children && children.length) throw new Error("Must not pass children to RegexWord");
            }(0, children);
            return "\\w+";
        }
        function RegexCharacters(props, children) {
            return [ "[" ].concat(regex_validateAndEscapeChildren("RegexText", children), [ "]" ]);
        }
        function RegexGroup(_ref2, children) {
            var repeat = _ref2.repeat, repeatMin = _ref2.repeatMin, repeatMax = _ref2.repeatMax, name = _ref2.name, _ref2$optional = _ref2.optional, optional = void 0 !== _ref2$optional && _ref2$optional, _ref2$capture = _ref2.capture, capture = void 0 === _ref2$capture || _ref2$capture, _ref2$union = _ref2.union, union = void 0 !== _ref2$union && _ref2$union;
            children = regex_validateAndEscapeChildren("RegexGroup", children);
            if (isDefined(repeat) && (isDefined(repeatMin) || isDefined(repeatMax))) throw new Error("repeat can not be used with repeatMin or repeatMax");
            if (name && !capture) throw new Error("Named groups must be captured");
            if (union) {
                var _result = [];
                for (var _i2 = 0, _children2 = children; _i2 < _children2.length; _i2++) {
                    _result.push(_children2[_i2]);
                    _result.push(new node_TextNode("|"));
                }
                _result.pop();
                children = _result;
            }
            var result = [];
            result.push(capture ? "(" : "(?:");
            name && result.push("?<" + escapeRegex(name) + ">");
            result.push.apply(result, children);
            result.push(")");
            isDefined(repeat) && ("number" == typeof repeat ? result.push("{" + repeat + "}") : !0 === repeat && result.push("+"));
            (isDefined(repeatMin) || isDefined(repeatMax)) && result.push("{" + (repeatMin || "") + "," + (repeatMax || "") + "}");
            optional && result.push("?");
            return result;
        }
        function RegexUnion(props, children) {
            var result = [];
            for (var _i4 = 0, _children4 = children = regex_validateAndEscapeChildren("RegexGroup", children); _i4 < _children4.length; _i4++) {
                result.push(_children4[_i4]);
                result.push("|");
            }
            result.pop();
            return result;
        }
    } ]);
}));