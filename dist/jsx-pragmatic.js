!function(root, factory) {
    "object" == typeof exports && "object" == typeof module ? module.exports = factory() : "function" == typeof define && define.amd ? define("pragmatic", [], factory) : "object" == typeof exports ? exports.pragmatic = factory() : root.pragmatic = factory();
}("undefined" != typeof self ? self : this, function() {
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
            return Object.prototype.hasOwnProperty.call(object, property);
        };
        __webpack_require__.p = "";
        return __webpack_require__(__webpack_require__.s = 0);
    }([ function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        function _inheritsLoose(subClass, superClass) {
            subClass.prototype = Object.create(superClass.prototype);
            subClass.prototype.constructor = subClass;
            subClass.__proto__ = superClass;
        }
        var Node = function() {
            function Node() {}
            var _proto = Node.prototype;
            _proto.isElementNode = function() {
                return !1;
            };
            _proto.isTextNode = function() {
                return !1;
            };
            _proto.isFragmentNode = function() {
                return !1;
            };
            return Node;
        }(), node_ElementNode = function(_Node) {
            _inheritsLoose(ElementNode, _Node);
            function ElementNode(name, props, children) {
                var _this;
                (_this = _Node.call(this) || this).name = void 0;
                _this.props = void 0;
                _this.children = void 0;
                _this.onRender = void 0;
                _this.name = name;
                _this.props = props;
                _this.children = children;
                if ("function" == typeof props.onRender) {
                    _this.onRender = props.onRender;
                    delete props.onRender;
                }
                return _this;
            }
            var _proto2 = ElementNode.prototype;
            _proto2.getTag = function() {
                return this.name;
            };
            _proto2.isTag = function(name) {
                return name === this.name;
            };
            _proto2.isElementNode = function() {
                return !0;
            };
            _proto2.render = function(renderer) {
                var element = renderer(this.name, this.props, this.children);
                this.onRender && this.onRender(element);
                return element;
            };
            _proto2.getText = function() {
                throw new Error("Can not get text of an element node");
            };
            return ElementNode;
        }(Node), node_TextNode = function(_Node2) {
            _inheritsLoose(TextNode, _Node2);
            function TextNode(text) {
                var _this2;
                (_this2 = _Node2.call(this) || this).text = void 0;
                _this2.text = text;
                return _this2;
            }
            var _proto3 = TextNode.prototype;
            _proto3.getTag = function() {
                throw new Error("Can not get tag of text node");
            };
            _proto3.isTag = function(name) {
                throw new Error("Can not check tag of text node");
            };
            _proto3.isTextNode = function() {
                return !0;
            };
            _proto3.render = function(renderer) {
                throw new Error("Can not render a text node");
            };
            _proto3.getText = function() {
                return this.text;
            };
            return TextNode;
        }(Node), node_FragmentNode = function(_Node3) {
            _inheritsLoose(FragmentNode, _Node3);
            function FragmentNode(children) {
                var _this3;
                (_this3 = _Node3.call(this) || this).children = void 0;
                _this3.children = children;
                return _this3;
            }
            var _proto4 = FragmentNode.prototype;
            _proto4.getTag = function() {
                throw new Error("Can not get tag of fragment node");
            };
            _proto4.isTag = function(name) {
                throw new Error("Can not check tag of fragment node");
            };
            _proto4.isFragmentNode = function() {
                return !0;
            };
            _proto4.render = function(renderer) {
                throw new Error("Can not render a fragment node");
            };
            _proto4.getText = function() {
                throw new Error("Can not get text of a fragment node");
            };
            return FragmentNode;
        }(Node);
        function normalizeChild(child) {
            if ("string" == typeof child) return new node_TextNode(child);
            if (child instanceof node_ElementNode || child instanceof node_TextNode || child instanceof node_FragmentNode) return child;
            if (Array.isArray(child)) return new node_FragmentNode(normalizeChildren(child));
            if (null != child) throw new Error("Child node must be string or instance of jsx-pragmatic node; got " + typeof child);
        }
        function normalizeChildren(children) {
            for (var result = [], _i2 = 0; _i2 < children.length; _i2++) {
                var normalizedChild = normalizeChild(children[_i2]);
                if (normalizedChild) if (normalizedChild instanceof node_FragmentNode) for (var _i4 = 0, _normalizedChild$chil2 = normalizedChild.children; _i4 < _normalizedChild$chil2.length; _i4++) {
                    var subchild = _normalizedChild$chil2[_i4];
                    result.push(subchild);
                } else result.push(normalizedChild);
            }
            return result;
        }
        var _CREATE_ELEMENT, _ADD_CHILDREN, node = function(element, props) {
            for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) children[_key - 2] = arguments[_key];
            if ("string" == typeof element) return new node_ElementNode(element, props || {}, normalizeChildren(children));
            if ("function" == typeof element) return normalizeChild(element(props || {}, normalizeChildren(children)));
            throw new TypeError("Expected jsx Element to be a string or a function");
        };
        function Fragment(props) {
            if (props && Object.keys(props).length) throw new Error("Do not pass props to Fragment");
            for (var _len2 = arguments.length, children = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) children[_key2 - 1] = arguments[_key2];
            return new node_FragmentNode(normalizeChildren(children));
        }
        var ELEMENT_TAG_HTML = "html", ELEMENT_TAG_IFRAME = "iframe", ELEMENT_TAG_SCRIPT = "script", ELEMENT_TAG_NODE = "node", ELEMENT_TAG_DEFAULT = "default", ELEMENT_PROP_INNER_HTML = "innerHTML", ELEMENT_PROP_EL = "el", CREATE_ELEMENT = ((_CREATE_ELEMENT = {})[ELEMENT_TAG_NODE] = function(_ref) {
            var props = _ref.props;
            if (!props[ELEMENT_PROP_EL]) throw new Error("Must pass " + ELEMENT_PROP_EL + " prop to " + ELEMENT_TAG_NODE + " element");
            if (Object.keys(props).length > 1) throw new Error("Must not pass any prop other than " + ELEMENT_PROP_EL + " to " + ELEMENT_TAG_NODE + " element");
            return props[ELEMENT_PROP_EL];
        }, _CREATE_ELEMENT[ELEMENT_TAG_DEFAULT] = function(_ref2) {
            var name = _ref2.name;
            return _ref2.doc.createElement(name);
        }, _CREATE_ELEMENT), ADD_CHILDREN = ((_ADD_CHILDREN = {})[ELEMENT_TAG_IFRAME] = function(_ref5) {
            var el = _ref5.el, children = _ref5.children, firstChild = children[0];
            if (children.length > 1 || !firstChild.isElementNode()) throw new Error("Expected only single element node as child of " + ELEMENT_TAG_IFRAME + " element");
            if (!firstChild.isTag(ELEMENT_TAG_HTML)) throw new Error("Expected element to be inserted into frame to be html, got " + firstChild.getTag());
            el.addEventListener("load", function() {
                var win = el.contentWindow;
                if (!win) throw new Error("Expected frame to have contentWindow");
                for (var doc = win.document, docElement = doc.documentElement; docElement.children && docElement.children.length; ) docElement.removeChild(docElement.children[0]);
                for (var child = firstChild.render(dom({
                    doc: doc
                })); child.children.length; ) docElement.appendChild(child.children[0]);
            });
        }, _ADD_CHILDREN[ELEMENT_TAG_SCRIPT] = function(_ref6) {
            var el = _ref6.el, children = _ref6.children, firstChild = children[0];
            if (1 !== children.length || !firstChild.isTextNode()) throw new Error("Expected only single text node as child of " + ELEMENT_TAG_SCRIPT + " element");
            el.text = firstChild.getText();
        }, _ADD_CHILDREN[ELEMENT_TAG_DEFAULT] = function(_ref7) {
            for (var el = _ref7.el, children = _ref7.children, doc = _ref7.doc, domRenderer = _ref7.domRenderer, _i6 = 0; _i6 < children.length; _i6++) {
                var child = children[_i6];
                child.isTextNode() ? el.appendChild(doc.createTextNode(child.getText())) : el.appendChild(child.render(domRenderer));
            }
        }, _ADD_CHILDREN), dom = function(_temp) {
            var _ref9$doc = (void 0 === _temp ? {} : _temp).doc, doc = void 0 === _ref9$doc ? document : _ref9$doc;
            return function domRenderer(name, props, children) {
                var el = function(_ref3) {
                    var doc = _ref3.doc, name = _ref3.name, props = _ref3.props;
                    return (CREATE_ELEMENT[name] || CREATE_ELEMENT[ELEMENT_TAG_DEFAULT])({
                        name: name,
                        props: props,
                        doc: doc
                    });
                }({
                    name: name,
                    props: props,
                    doc: doc
                });
                !function(_ref4) {
                    for (var el = _ref4.el, props = _ref4.props, _i4 = 0, _Object$keys2 = Object.keys(props); _i4 < _Object$keys2.length; _i4++) {
                        var prop = _Object$keys2[_i4], val = props[prop];
                        if (null != val && prop !== ELEMENT_PROP_EL && prop !== ELEMENT_PROP_INNER_HTML) if (prop.match(/^on[A-Z][a-z]/) && "function" == typeof val) el.addEventListener(prop.slice(2).toLowerCase(), val); else if ("string" == typeof val || "number" == typeof val) el.setAttribute(prop, val.toString()); else {
                            if ("boolean" != typeof val) throw new TypeError("Can not render prop " + prop + " of type " + typeof val);
                            !0 === val && el.setAttribute(prop, "");
                        }
                    }
                }({
                    el: el,
                    props: props
                });
                !function(_ref8) {
                    var el = _ref8.el, name = _ref8.name, props = _ref8.props, children = _ref8.children, doc = _ref8.doc, domRenderer = _ref8.domRenderer;
                    if (props.hasOwnProperty(ELEMENT_PROP_INNER_HTML)) {
                        if (children.length >= 1) throw new Error("Expected no children to be passed when " + ELEMENT_PROP_INNER_HTML + " prop is set");
                        var html = props[ELEMENT_PROP_INNER_HTML];
                        if ("string" != typeof html) throw new TypeError(ELEMENT_PROP_INNER_HTML + " prop must be string");
                        if (name === ELEMENT_TAG_SCRIPT) el.text = html; else {
                            el.innerHTML = html;
                            !function(el, doc) {
                                void 0 === doc && (doc = window.document);
                                for (var _i2 = 0, _el$querySelectorAll2 = el.querySelectorAll("script"); _i2 < _el$querySelectorAll2.length; _i2++) {
                                    var script = _el$querySelectorAll2[_i2], parentNode = script.parentNode;
                                    if (parentNode) {
                                        var newScript = doc.createElement("script");
                                        newScript.text = script.textContent;
                                        parentNode.replaceChild(newScript, script);
                                    }
                                }
                            }(el, doc);
                        }
                    } else (ADD_CHILDREN[name] || ADD_CHILDREN[ELEMENT_TAG_DEFAULT])({
                        el: el,
                        name: name,
                        props: props,
                        children: children,
                        doc: doc,
                        domRenderer: domRenderer
                    });
                }({
                    el: el,
                    name: name,
                    props: props,
                    children: children,
                    doc: doc,
                    domRenderer: domRenderer
                });
                return el;
            };
        }, react = function(_temp) {
            var React = (void 0 === _temp ? {} : _temp).React;
            if (!React) throw new Error("Must pass React library to react renderer");
            return function reactRenderer(name, props, children) {
                var renderedChildren = children.map(function(child) {
                    return child.isTextNode() ? child.getText() : child.render(reactRenderer);
                });
                return React.createElement.apply(React, [ name, props ].concat(renderedChildren));
            };
        };
        function htmlEncode(html) {
            return html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/\//g, "&#x2F;");
        }
        var html = function() {
            return function htmlRenderer(name, props, children) {
                var renderedChildren = "string" == typeof props.innerHTML ? props.innerHTML : children.map(function(child) {
                    return child.isTextNode() ? htmlEncode(child.getText()) : child.render(htmlRenderer);
                }).join("");
                return "<" + name + function(props) {
                    var keys = Object.keys(props).filter(function(key) {
                        var val = props[key];
                        return "innerHTML" !== key && !!val && ("string" == typeof val || "number" == typeof val || !0 === val);
                    });
                    return keys.length ? " " + keys.map(function(key) {
                        var val = props[key];
                        if (!0 === val) return "" + htmlEncode(key);
                        if ("string" != typeof val && "number" != typeof val) throw new TypeError("Unexpected prop type: " + typeof val);
                        return htmlEncode(key) + '="' + htmlEncode(val.toString()) + '"';
                    }).join(" ") : "";
                }(props) + ">" + renderedChildren + "</" + name + ">";
            };
        };
        __webpack_require__.d(__webpack_exports__, "ElementNode", function() {
            return node_ElementNode;
        });
        __webpack_require__.d(__webpack_exports__, "TextNode", function() {
            return node_TextNode;
        });
        __webpack_require__.d(__webpack_exports__, "FragmentNode", function() {
            return node_FragmentNode;
        });
        __webpack_require__.d(__webpack_exports__, "node", function() {
            return node;
        });
        __webpack_require__.d(__webpack_exports__, "Fragment", function() {
            return Fragment;
        });
        __webpack_require__.d(__webpack_exports__, "dom", function() {
            return dom;
        });
        __webpack_require__.d(__webpack_exports__, "react", function() {
            return react;
        });
        __webpack_require__.d(__webpack_exports__, "html", function() {
            return html;
        });
    } ]);
});
//# sourceMappingURL=jsx-pragmatic.js.map