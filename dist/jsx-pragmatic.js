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
            return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
            module.l = !0, module.exports;
        }
        return __webpack_require__.m = modules, __webpack_require__.c = installedModules, 
        __webpack_require__.d = function(exports, name, getter) {
            __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
                enumerable: !0,
                get: getter
            });
        }, __webpack_require__.r = function(exports) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
                value: "Module"
            }), Object.defineProperty(exports, "__esModule", {
                value: !0
            });
        }, __webpack_require__.t = function(value, mode) {
            if (1 & mode && (value = __webpack_require__(value)), 8 & mode) return value;
            if (4 & mode && "object" == typeof value && value && value.__esModule) return value;
            var ns = Object.create(null);
            if (__webpack_require__.r(ns), Object.defineProperty(ns, "default", {
                enumerable: !0,
                value: value
            }), 2 & mode && "string" != typeof value) for (var key in value) __webpack_require__.d(ns, key, function(key) {
                return value[key];
            }.bind(null, key));
            return ns;
        }, __webpack_require__.n = function(module) {
            var getter = module && module.__esModule ? function() {
                return module.default;
            } : function() {
                return module;
            };
            return __webpack_require__.d(getter, "a", getter), getter;
        }, __webpack_require__.o = function(object, property) {
            return {}.hasOwnProperty.call(object, property);
        }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 0);
    }([ function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        var NODE_TYPE = {
            ELEMENT: "element",
            TEXT: "text",
            COMPONENT: "component",
            FRAGMENT: "fragment"
        };
        function _renderChildren(children, renderer) {
            for (var result = [], _i2 = 0; _i2 < children.length; _i2++) {
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
                this.type = NODE_TYPE.ELEMENT, this.name = void 0, this.props = void 0, this.children = void 0, 
                this.onRender = void 0, this.name = name, this.props = props, this.children = children;
                var onRender = props.onRender;
                "function" == typeof onRender && (this.onRender = onRender, delete props.onRender);
            }
            var _proto = ElementNode.prototype;
            return _proto.render = function(renderer) {
                var el = renderer(this);
                return this.onRender && this.onRender(el), el;
            }, _proto.renderChildren = function(renderer) {
                return _renderChildren(this.children, renderer);
            }, ElementNode;
        }(), node_FragmentNode = function() {
            function FragmentNode(children) {
                this.type = NODE_TYPE.FRAGMENT, this.children = void 0, this.children = children;
            }
            return FragmentNode.prototype.render = function(renderer) {
                return this.children.map(renderer);
            }, FragmentNode;
        }(), node_TextNode = function() {
            function TextNode(text) {
                this.type = NODE_TYPE.TEXT, this.text = void 0, this.text = text;
            }
            return TextNode.prototype.render = function(renderer) {
                return renderer(this);
            }, TextNode;
        }(), node_ComponentNode = function() {
            function ComponentNode(component, props, children) {
                this.type = NODE_TYPE.COMPONENT, this.component = void 0, this.props = void 0, this.children = void 0, 
                this.component = component, this.props = props, this.children = children;
            }
            var _proto4 = ComponentNode.prototype;
            return _proto4.renderComponent = function(renderer) {
                var child = function(child) {
                    var children = normalizeChildren(Array.isArray(child) ? child : [ child ]);
                    return 1 === children.length ? children[0] : children.length > 1 ? new node_FragmentNode(children) : void 0;
                }(this.component(this.props, this.children));
                if (child) return child.render(renderer);
            }, _proto4.render = function(renderer) {
                return renderer(this);
            }, _proto4.renderChildren = function(renderer) {
                return _renderChildren(this.children, renderer);
            }, ComponentNode;
        }();
        function normalizeChildren(children) {
            for (var result = [], _i6 = 0; _i6 < children.length; _i6++) {
                var child = children[_i6];
                if (child) if ("string" == typeof child) result.push(new node_TextNode(child)); else if (Array.isArray(child)) for (var _i8 = 0, _normalizeChildren2 = normalizeChildren(child); _i8 < _normalizeChildren2.length; _i8++) result.push(_normalizeChildren2[_i8]); else {
                    if (!(child instanceof node_ElementNode || child instanceof node_TextNode || child instanceof node_ComponentNode)) throw new TypeError("Unrecognized node type: " + typeof child);
                    result.push(child);
                }
            }
            return result;
        }
        var _ADD_CHILDREN, node_node = function(element, props) {
            for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) children[_key - 2] = arguments[_key];
            if (props = props || {}, children = normalizeChildren(children), "string" == typeof element) return new node_ElementNode(element, props, children);
            if ("function" == typeof element) return new node_ComponentNode(element, props, children);
            throw new TypeError("Expected jsx element to be a string or a function");
        }, Fragment = function(props, children) {
            if (props && Object.keys(props).length) throw new Error("Do not pass props to Fragment");
            return children;
        }, ALPHA_CHARS = "0123456789abcdef", ELEMENT_TAG = {
            HTML: "html",
            IFRAME: "iframe",
            SCRIPT: "script",
            NODE: "node",
            DEFAULT: "default"
        }, ELEMENT_PROP = {
            ID: "id",
            INNER_HTML: "innerHTML",
            EL: "el"
        }, ADD_CHILDREN = ((_ADD_CHILDREN = {})[ELEMENT_TAG.IFRAME] = function(el, node) {
            var firstChild = node.children[0];
            if (1 !== node.children.length || !(firstChild instanceof node_ElementNode) || firstChild.name !== ELEMENT_TAG.HTML) throw new Error("Expected only single html element node as child of " + ELEMENT_TAG.IFRAME + " element");
            el.addEventListener("load", function() {
                var win = el.contentWindow;
                if (!win) throw new Error("Expected frame to have contentWindow");
                for (var doc = win.document, docElement = doc.documentElement; docElement.children && docElement.children.length; ) docElement.removeChild(docElement.children[0]);
                for (var child = firstChild.render(dom({
                    doc: doc
                })); child.children.length; ) docElement.appendChild(child.children[0]);
            });
        }, _ADD_CHILDREN[ELEMENT_TAG.SCRIPT] = function(el, node) {
            var firstChild = node.children[0];
            if (1 !== node.children.length || !(firstChild instanceof node_TextNode)) throw new Error("Expected only single text node as child of " + ELEMENT_TAG.SCRIPT + " element");
            el.text = firstChild.text;
        }, _ADD_CHILDREN[ELEMENT_TAG.DEFAULT] = function(el, node, renderer) {
            for (var _i6 = 0, _node$renderChildren2 = node.renderChildren(renderer); _i6 < _node$renderChildren2.length; _i6++) el.appendChild(_node$renderChildren2[_i6]);
        }, _ADD_CHILDREN);
        function dom(opts) {
            void 0 === opts && (opts = {});
            var _opts$doc = opts.doc, doc = void 0 === _opts$doc ? document : _opts$doc;
            return function domRenderer(node) {
                if (node.type === NODE_TYPE.COMPONENT) return node.renderComponent(domRenderer);
                if (node.type === NODE_TYPE.TEXT) return function(doc, node) {
                    return doc.createTextNode(node.text);
                }(doc, node);
                if (node.type === NODE_TYPE.ELEMENT) {
                    var el = function(doc, node) {
                        return node.props[ELEMENT_PROP.EL] ? node.props[ELEMENT_PROP.EL] : doc.createElement(node.name);
                    }(doc, node);
                    return function(el, node) {
                        for (var props = node.props, _i4 = 0, _Object$keys2 = Object.keys(props); _i4 < _Object$keys2.length; _i4++) {
                            var prop = _Object$keys2[_i4], val = props[prop];
                            if (null != val && prop !== ELEMENT_PROP.EL && prop !== ELEMENT_PROP.INNER_HTML) if (prop.match(/^on[A-Z][a-z]/) && "function" == typeof val) el.addEventListener(prop.slice(2).toLowerCase(), val); else if ("string" == typeof val || "number" == typeof val) el.setAttribute(prop, val.toString()); else {
                                if ("boolean" != typeof val) throw new TypeError("Can not render prop " + prop + " of type " + typeof val);
                                !0 === val && el.setAttribute(prop, "");
                            }
                        }
                        el.tagName.toLowerCase() !== ELEMENT_TAG.IFRAME || props.id || el.setAttribute(ELEMENT_PROP.ID, "jsx-iframe-" + "xxxxxxxxxx".replace(/./g, function() {
                            return ALPHA_CHARS.charAt(Math.floor(Math.random() * ALPHA_CHARS.length));
                        }));
                    }(el, node), function(el, node, doc, renderer) {
                        if (node.props.hasOwnProperty(ELEMENT_PROP.INNER_HTML)) {
                            if (node.children.length) throw new Error("Expected no children to be passed when " + ELEMENT_PROP.INNER_HTML + " prop is set");
                            var html = node.props[ELEMENT_PROP.INNER_HTML];
                            if ("string" != typeof html) throw new TypeError(ELEMENT_PROP.INNER_HTML + " prop must be string");
                            node.name === ELEMENT_TAG.SCRIPT ? el.text = html : (el.innerHTML = html, function(el, doc) {
                                void 0 === doc && (doc = window.document);
                                for (var _i2 = 0, _el$querySelectorAll2 = el.querySelectorAll("script"); _i2 < _el$querySelectorAll2.length; _i2++) {
                                    var script = _el$querySelectorAll2[_i2], parentNode = script.parentNode;
                                    if (parentNode) {
                                        var newScript = doc.createElement("script");
                                        newScript.text = script.textContent, parentNode.replaceChild(newScript, script);
                                    }
                                }
                            }(el, doc));
                        } else (ADD_CHILDREN[node.name] || ADD_CHILDREN[ELEMENT_TAG.DEFAULT])(el, node, renderer);
                    }(el, node, doc, domRenderer), el;
                }
                throw new TypeError("Unhandleable node");
            };
        }
        function react(_temp) {
            var React = (void 0 === _temp ? {} : _temp).React;
            if (!React) throw new Error("Must pass React library to react renderer");
            return function reactRenderer(node) {
                if (node.type === NODE_TYPE.COMPONENT) return React.createElement.apply(React, [ function() {
                    return node.renderComponent(reactRenderer) || null;
                }, node.props ].concat(node.renderChildren(reactRenderer)));
                if (node.type === NODE_TYPE.ELEMENT) return React.createElement.apply(React, [ node.name, node.props ].concat(node.renderChildren(reactRenderer)));
                if (node.type === NODE_TYPE.TEXT) return node.text;
                throw new TypeError("Unhandleable node");
            };
        }
        var html_ELEMENT_PROP = {
            INNER_HTML: "innerHTML"
        };
        function htmlEncode(text) {
            return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/\//g, "&#x2F;");
        }
        function html() {
            return function htmlRenderer(node) {
                if (node.type === NODE_TYPE.COMPONENT) return [].concat(node.renderComponent(htmlRenderer)).join("");
                if (node.type === NODE_TYPE.ELEMENT) {
                    var renderedProps = (props = node.props, (keys = Object.keys(props).filter(function(key) {
                        var val = props[key];
                        return key !== html_ELEMENT_PROP.INNER_HTML && !!val && ("string" == typeof val || "number" == typeof val || !0 === val);
                    })).length ? " " + keys.map(function(key) {
                        var val = props[key];
                        if (!0 === val) return "" + htmlEncode(key);
                        if ("string" != typeof val && "number" != typeof val) throw new TypeError("Unexpected prop type: " + typeof val);
                        return htmlEncode(key) + '="' + htmlEncode(val.toString()) + '"';
                    }).join(" ") : ""), renderedChildren = "string" == typeof node.props[html_ELEMENT_PROP.INNER_HTML] ? node.props[html_ELEMENT_PROP.INNER_HTML] : node.renderChildren(htmlRenderer).join("");
                    return "<" + node.name + renderedProps + ">" + renderedChildren + "</" + node.name + ">";
                }
                var props, keys;
                if (node.type === NODE_TYPE.TEXT) return htmlEncode(node.text);
                throw new TypeError("Unhandleable node: " + node.type);
            };
        }
        __webpack_require__.d(__webpack_exports__, "ElementNode", function() {
            return node_ElementNode;
        }), __webpack_require__.d(__webpack_exports__, "FragmentNode", function() {
            return node_FragmentNode;
        }), __webpack_require__.d(__webpack_exports__, "TextNode", function() {
            return node_TextNode;
        }), __webpack_require__.d(__webpack_exports__, "ComponentNode", function() {
            return node_ComponentNode;
        }), __webpack_require__.d(__webpack_exports__, "node", function() {
            return node_node;
        }), __webpack_require__.d(__webpack_exports__, "Fragment", function() {
            return Fragment;
        }), __webpack_require__.d(__webpack_exports__, "dom", function() {
            return dom;
        }), __webpack_require__.d(__webpack_exports__, "react", function() {
            return react;
        }), __webpack_require__.d(__webpack_exports__, "html", function() {
            return html;
        }), __webpack_require__.d(__webpack_exports__, "NODE_TYPE", function() {
            return NODE_TYPE;
        });
    } ]);
});
//# sourceMappingURL=jsx-pragmatic.js.map