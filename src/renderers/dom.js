/* @flow */

import type { NodeChildrenType, NodePropsType, NodeRendererFactory, NodeRenderer } from '../node';

const ELEMENT_TAG = {
    HTML:    'html',
    IFRAME:  'iframe',
    SCRIPT:  'script',
    DEFAULT: 'default'
};

const ELEMENT_PROP = {
    INNER_HTML: 'innerHTML'
};

const DOM_EVENT = {
    onBlur:               'blur',
    onCancel:             'cancel',
    onClick:              'click',
    onClose:              'close',
    onContextMenu:        'contextMenu',
    onCopy:               'copy',
    onCut:                'cut',
    onAuxClick:           'auxClick',
    onDoubleClick:        'doubleClick',
    onDragEnd:            'dragEnd',
    onDragStart:          'dragStart',
    onDrop:               'drop',
    onFocus:              'focus',
    onInput:              'input',
    onInvalid:            'invalid',
    onKeyDown:            'keyDown',
    onKeyPress:           'keyPress',
    onKeyUp:              'keyUp',
    onMouseDown:          'mouseDown',
    onMouseUp:            'mouseUp',
    onPaste:              'paste',
    onPause:              'pause',
    onPlay:               'play',
    onPointerCancel:      'pointerCancel',
    onPointerDown:        'pointerDown',
    onPointerUp:          'pointerUp',
    onRateChange:         'rateChange',
    onReset:              'reset',
    onSeeked:             'seeked',
    onSubmit:             'submit',
    onTouchCancel:        'touchCancel',
    onTouchEnd:           'touchEnd',
    onTouchStart:         'touchStart',
    onVolumeChange:       'volumeChange',
    onAbort:              'abort',
    onAnimationEnd:       'animationEnd',
    onAnimationIteration: 'animationIteration',
    onAnimationStart:     'animationStart',
    onCanPlay:            'canPlay',
    onCanPlayThrough:     'canPlayThrough',
    onDrag:               'drag',
    onDragEnter:          'dragEnter',
    onDragExit:           'dragExit',
    onDragLeave:          'dragLeave',
    onDragOver:           'dragOver',
    onDurationChange:     'durationChange',
    onEmptied:            'emptied',
    onEncrypted:          'encrypted',
    onEnded:              'ended',
    onError:              'error',
    onGotPointerCapture:  'gotPointerCapture',
    onLoad:               'load',
    onLoadedData:         'loadedData',
    onLoadedMetadata:     'loadedMetadata',
    onLoadStart:          'loadStart',
    onLostPointerCapture: 'lostPointerCapture',
    onMouseMove:          'mouseMove',
    onMouseOut:           'mouseOut',
    onMouseOver:          'mouseOver',
    onPlaying:            'playing',
    onPointerMove:        'pointerMove',
    onPointerOut:         'pointerOut',
    onPointerOver:        'pointerOver',
    onProgress:           'progress',
    onScroll:             'scroll',
    onSeeking:            'seeking',
    onStalled:            'stalled',
    onSuspend:            'suspend',
    onTimeUpdate:         'timeUpdate',
    onToggle:             'toggle',
    onTouchMove:          'touchMove',
    onTransitionEnd:      'transitionEnd',
    onWaiting:            'waiting',
    onWheel:              'wheel'
};

function fixScripts(el : HTMLElement, doc : Document = window.document) {
    for (const script of el.querySelectorAll('script')) {
        const parentNode = script.parentNode;

        if (!parentNode) {
            continue;
        }

        const newScript = doc.createElement('script');
        // $FlowFixMe
        newScript.text = script.textContent;
        parentNode.replaceChild(newScript, script);
    }
}

type AddPropsOptions = {|
    el : HTMLElement,
    props : NodePropsType,
    doc : Document
|};

function addProps({ el, props, doc } : AddPropsOptions) {
    for (const prop of Object.keys(props)) {
        const val = props[prop];

        if (val === null || typeof val === 'undefined') {
            continue;
        }

        if (DOM_EVENT.hasOwnProperty(prop)) {
            if (typeof val !== 'function') {
                throw new TypeError(`Prop ${ prop } must be function`);
            }

            el.addEventListener(DOM_EVENT[prop], val);

        } else if (typeof val === 'string' || typeof val === 'number') {
            if (prop === ELEMENT_PROP.INNER_HTML) {
                el.innerHTML = val.toString();
                fixScripts(el, doc);
            } else {
                el.setAttribute(prop, val.toString());
            }

        } else if (typeof val === 'boolean') {
            if (val === true) {
                el.setAttribute(prop, '');
            }

        } else {
            throw new TypeError(`Can not render prop ${ prop } of type ${ typeof val }`);
        }
    }
}

type AddChildrenOptions = {|
    el : HTMLElement,
    children : NodeChildrenType,
    doc : Document,
    domRenderer : NodeRenderer<HTMLElement>
|};

const ADD_CHILDREN : { [string] : (AddChildrenOptions) => void }  = {

    [ ELEMENT_TAG.IFRAME ]: ({ el, children } : AddChildrenOptions) => {
        const firstChild = children[0];

        if (children.length > 1 || !firstChild.isElementNode()) {
            throw new Error(`Expected only single element node as child of ${ ELEMENT_TAG.IFRAME } element`);
        }

        if (!firstChild.isTag(ELEMENT_TAG.HTML)) {
            throw new Error(`Expected element to be inserted into frame to be html, got ${ firstChild.getTag() }`);
        }
    
        el.addEventListener('load', () => {

            // $FlowFixMe
            const win = el.contentWindow;
    
            if (!win) {
                throw new Error(`Expected frame to have contentWindow`);
            }

            const doc = win.document;
            const docElement = doc.documentElement;

            while (docElement.children && docElement.children.length) {
                docElement.removeChild(docElement.children[0]);
            }

            // eslint-disable-next-line no-use-before-define
            const child = firstChild.render(dom({ doc }));
        
            while (child.children.length) {
                docElement.appendChild(child.children[0]);
            }
        });
    },

    [ ELEMENT_TAG.SCRIPT ]: ({ el, children } : AddChildrenOptions) => {
        const firstChild = children[0];

        if (children.length !== 1 || !firstChild.isTextNode()) {
            throw new Error(`Expected only single text node as child of ${ ELEMENT_TAG.SCRIPT } element`);
        }
        
        // $FlowFixMe
        el.text = firstChild.getText();
    },

    [ ELEMENT_TAG.DEFAULT ]: ({ el, children, doc, domRenderer } : AddChildrenOptions) => {
        for (const child of children) {
            if (child.isTextNode()) {
                el.appendChild(doc.createTextNode(child.getText()));
            } else {
                el.appendChild(child.render(domRenderer));
            }
        }
    }
};


export const dom : NodeRendererFactory<HTMLElement> = ({ doc = document } : { doc? : Document } = {}) => {
    const domRenderer = (name, props, children) => {
        const el = doc.createElement(name);
        const addChildren = ADD_CHILDREN[name] || ADD_CHILDREN[ELEMENT_TAG.DEFAULT];

        addProps({ el, props, doc });
        addChildren({ el, children, doc, domRenderer });

        return el;
    };

    return domRenderer;
};
