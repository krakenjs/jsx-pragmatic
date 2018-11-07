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
            (subClass.prototype.constructor = subClass).__proto__ = superClass;
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
            for (var _len = arguments.length, children = new Array(2 < _len ? _len - 2 : 0), _key = 2; _key < _len; _key++) children[_key - 2] = arguments[_key];
            if ("string" == typeof element) return new node_ElementNode(element, props || {}, normalizeChildren(children));
            if ("function" == typeof element) return normalizeChild(element(props || {}, normalizeChildren(children)));
            throw new TypeError("Expected jsx Element to be a string or a function");
        };
        function Fragment(props) {
            if (props && Object.keys(props).length) throw new Error("Do not pass props to Fragment");
            for (var _len2 = arguments.length, children = new Array(1 < _len2 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) children[_key2 - 1] = arguments[_key2];
            return new node_FragmentNode(normalizeChildren(children));
        }
        var DOM_EVENT = {
            onBlur: "blur",
            onCancel: "cancel",
            onClick: "click",
            onClose: "close",
            onContextMenu: "contextMenu",
            onCopy: "copy",
            onCut: "cut",
            onAuxClick: "auxClick",
            onDoubleClick: "doubleClick",
            onDragEnd: "dragEnd",
            onDragStart: "dragStart",
            onDrop: "drop",
            onFocus: "focus",
            onInput: "input",
            onInvalid: "invalid",
            onKeyDown: "keyDown",
            onKeyPress: "keyPress",
            onKeyUp: "keyUp",
            onMouseDown: "mouseDown",
            onMouseUp: "mouseUp",
            onPaste: "paste",
            onPause: "pause",
            onPlay: "play",
            onPointerCancel: "pointerCancel",
            onPointerDown: "pointerDown",
            onPointerUp: "pointerUp",
            onRateChange: "rateChange",
            onReset: "reset",
            onSeeked: "seeked",
            onSubmit: "submit",
            onTouchCancel: "touchCancel",
            onTouchEnd: "touchEnd",
            onTouchStart: "touchStart",
            onVolumeChange: "volumeChange",
            onAbort: "abort",
            onAnimationEnd: "animationEnd",
            onAnimationIteration: "animationIteration",
            onAnimationStart: "animationStart",
            onCanPlay: "canPlay",
            onCanPlayThrough: "canPlayThrough",
            onDrag: "drag",
            onDragEnter: "dragEnter",
            onDragExit: "dragExit",
            onDragLeave: "dragLeave",
            onDragOver: "dragOver",
            onDurationChange: "durationChange",
            onEmptied: "emptied",
            onEncrypted: "encrypted",
            onEnded: "ended",
            onError: "error",
            onGotPointerCapture: "gotPointerCapture",
            onLoad: "load",
            onLoadedData: "loadedData",
            onLoadedMetadata: "loadedMetadata",
            onLoadStart: "loadStart",
            onLostPointerCapture: "lostPointerCapture",
            onMouseMove: "mouseMove",
            onMouseOut: "mouseOut",
            onMouseOver: "mouseOver",
            onPlaying: "playing",
            onPointerMove: "pointerMove",
            onPointerOut: "pointerOut",
            onPointerOver: "pointerOver",
            onProgress: "progress",
            onScroll: "scroll",
            onSeeking: "seeking",
            onStalled: "stalled",
            onSuspend: "suspend",
            onTimeUpdate: "timeUpdate",
            onToggle: "toggle",
            onTouchMove: "touchMove",
            onTransitionEnd: "transitionEnd",
            onWaiting: "waiting",
            onWheel: "wheel"
        };
        function fixScripts(el, doc) {
            void 0 === doc && (doc = window.document);
            for (var _i2 = 0, _el$querySelectorAll2 = el.querySelectorAll("script"); _i2 < _el$querySelectorAll2.length; _i2++) {
                var script = _el$querySelectorAll2[_i2], parentNode = script.parentNode;
                if (parentNode) {
                    var newScript = doc.createElement("script");
                    newScript.text = script.textContent;
                    parentNode.replaceChild(newScript, script);
                }
            }
        }
        var CREATE_ELEMENT = ((_CREATE_ELEMENT = {}).node = function(_ref) {
            var props = _ref.props;
            if (!props.el) throw new Error("Must pass el prop to node element");
            if (1 < Object.keys(props).length) throw new Error("Must not pass any prop other than el to node element");
            return props.el;
        }, _CREATE_ELEMENT.default = function(_ref2) {
            var name = _ref2.name;
            return _ref2.doc.createElement(name);
        }, _CREATE_ELEMENT), ADD_CHILDREN = ((_ADD_CHILDREN = {}).iframe = function(_ref4) {
            var el = _ref4.el, children = _ref4.children, firstChild = children[0];
            if (1 < children.length || !firstChild.isElementNode()) throw new Error("Expected only single element node as child of iframe element");
            if (!firstChild.isTag("html")) throw new Error("Expected element to be inserted into frame to be html, got " + firstChild.getTag());
            el.addEventListener("load", function() {
                var win = el.contentWindow;
                if (!win) throw new Error("Expected frame to have contentWindow");
                for (var doc = win.document, docElement = doc.documentElement; docElement.children && docElement.children.length; ) docElement.removeChild(docElement.children[0]);
                for (var child = firstChild.render(dom({
                    doc: doc
                })); child.children.length; ) docElement.appendChild(child.children[0]);
            });
        }, _ADD_CHILDREN.script = function(_ref5) {
            var el = _ref5.el, children = _ref5.children, firstChild = children[0];
            if (1 !== children.length || !firstChild.isTextNode()) throw new Error("Expected only single text node as child of script element");
            el.text = firstChild.getText();
        }, _ADD_CHILDREN.default = function(_ref6) {
            for (var el = _ref6.el, children = _ref6.children, doc = _ref6.doc, domRenderer = _ref6.domRenderer, _i6 = 0; _i6 < children.length; _i6++) {
                var child = children[_i6];
                child.isTextNode() ? el.appendChild(doc.createTextNode(child.getText())) : el.appendChild(child.render(domRenderer));
            }
        }, _ADD_CHILDREN), dom = function(_temp) {
            var _ref7$doc = (void 0 === _temp ? {} : _temp).doc, doc = void 0 === _ref7$doc ? document : _ref7$doc;
            return function domRenderer(name, props, children) {
                var createElement = CREATE_ELEMENT[name] || CREATE_ELEMENT.default, addChildren = ADD_CHILDREN[name] || ADD_CHILDREN.default, el = createElement({
                    name: name,
                    props: props,
                    doc: doc
                });
                !function(_ref3) {
                    for (var el = _ref3.el, props = _ref3.props, doc = _ref3.doc, _i4 = 0, _Object$keys2 = Object.keys(props); _i4 < _Object$keys2.length; _i4++) {
                        var prop = _Object$keys2[_i4], val = props[prop];
                        if (null != val && "el" !== prop) if (DOM_EVENT.hasOwnProperty(prop)) {
                            if ("function" != typeof val) throw new TypeError("Prop " + prop + " must be function");
                            el.addEventListener(DOM_EVENT[prop], val);
                        } else if ("string" == typeof val || "number" == typeof val) if ("innerHTML" === prop) {
                            el.innerHTML = val.toString();
                            fixScripts(el, doc);
                        } else el.setAttribute(prop, val.toString()); else {
                            if ("boolean" != typeof val) throw new TypeError("Can not render prop " + prop + " of type " + typeof val);
                            !0 === val && el.setAttribute(prop, "");
                        }
                    }
                }({
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
                var renderedChildren = children.map(function(child) {
                    return child.isTextNode() ? htmlEncode(child.getText()) : child.render(htmlRenderer);
                });
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
                }(props) + ">" + renderedChildren.join("") + "</" + name + ">";
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
//# sourceMappingURL=jsx-pragmatic.js.map