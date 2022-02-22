JSX Pragmatic
-------------

[![build status][build-badge]][build]
[![code coverage][coverage-badge]][coverage]
[![npm version][version-badge]][package]

[build-badge]: https://img.shields.io/github/workflow/status/krakenjs/jsx-pragmatic/build?logo=github&style=flat-square
[build]: https://github.com/krakenjs/jsx-pragmatic/actions?query=workflow:build
[coverage-badge]: https://img.shields.io/codecov/c/github/krakenjs/jsx-pragmatic.svg?style=flat-square
[coverage]: https://codecov.io/github/krakenjs/jsx-pragmatic/
[version-badge]: https://img.shields.io/npm/v/jsx-pragmatic.svg?style=flat-square
[package]: https://www.npmjs.com/package/jsx-pragmatic

- Build JSX templates
- Decide at runtime how you want to render them
- Easily build custom renderers - render to HTML, DOM, or anything else!

Because JSX is pretty useful, even without React!

#### Build an abstract jsx component

First we'll build a small component. We're not tying ourselves to any particular framework yet, or any render target.

```javascript
/* @jsx node */

import { node } from 'jsx-pragmatic';

function Login({ prefilledEmail }) {
  return (
    <section>
      <input type="text" placeholder="email" value={prefilledEmail} />
      <input type="password" placeholder="password" />
      <button>Log In</button>
    </section>
  );
}
```

#### Render on the server

Let's say we're on the server-side, and we want to render the jsx to html to serve to a client. Just pass `html()` to the renderer:

```javascript
/* @jsx node */

import { node, html } from 'jsx-pragmatic';
import { Login } from './components'

function render() {
  return (
    <Login prefilledEmail='foo@bar.com' />
  ).render(html());
}
```

#### Render on the client

Now let's render the same jsx template on the client-side, directly to a DOM element:

```javascript
/* @jsx node */

import { node, dom } from 'jsx-pragmatic';
import { Login } from './components'

function render() {
  return (
    <Login prefilledEmail='foo@bar.com' />
  ).render(dom());
}
```

#### Render in a React app

Or if we're using the same component in React, we can render it as a React component:

```javascript
/* @jsx node */

import { node, react } from 'jsx-pragmatic';
import { Login } from './components'

function render() {
  return (
    <Login prefilledEmail='foo@bar.com' />
  ).render(react({ React }));
}
```

#### Render in a Preact app

Or if we're using the same component in Preact, we can render it as a Preact component:

```javascript
/* @jsx node */

import { node, preact } from 'jsx-pragmatic';
import { Login } from './components'

function render() {
  return (
    <Login prefilledEmail='foo@bar.com' />
  ).render(preact({ Preact }));
}
```

### Write your own renderer

Renderers are just functions!

- Write a factory like `customDom`. This will take some options and return our renderer.
- Return a renderer which takes `name`, `props` and `children` and renders them in whatever way you want!

This example renders the jsx directly to DOM elements:

```javascript
/* @jsx node */

import { node, NODE_TYPE } from 'jsx-pragmatic';
import { Login } from './components'

function customDom({ removeScriptTags } = { removeScriptTags: false }) {

  let domRenderer = (node) => {
    if (node.type === NODE_TYPE.COMPONENT) {
      return node.renderComponent(domRenderer);
    }

    if (node.type === NODE_TYPE.TEXT) {
      return document.createTextNode(node.text);
    }

    if (node.type === NODE_TYPE.ELEMENT) {
      if (removeScriptTags && node.name === 'script') {
        return;
      }

      let el = document.createElement(node.name);

      for (let [ key, val ] of Object.entries(node.props)) {
        el.setAttribute(key, val);
      }

      for (let child of node.children) {
        el.appendChild(child.render(domRenderer));
      }

      return el;
    }
  }

  return domRenderer;
}
```

Then when you're ready to use your renderer, just pass it into `.render()` and pass any options you want to use to configure the renderer.

```javascript
function render() {
  return (
    <Login prefilledEmail='foo@bar.com' />
  ).render(customDom({ removeScriptTags: true }));
}
```

### Use Fragments

You can either import `Fragment` from `jsx-pragmatic`:

```javascript
/* @jsx node */

import { node, Fragment } from 'jsx-pragmatic';

function Login({ prefilledEmail }) {
  return (
    <Fragment>
      <input type="text" placeholder="email" value={prefilledEmail} />
      <input type="password" placeholder="password" />
      <button>Log In</button>
    </Fragment>
  );
}
```

Or use the `@jsxFrag` comment, and the new `<>` `</>` syntax for Fragments, providing you're using Babel 7:

```javascript
/* @jsx node */
/* @jsxFrag Fragment */

import { node, Fragment } from 'jsx-pragmatic';

function Login({ prefilledEmail }) {
  return (
    <>
      <input type="text" placeholder="email" value={prefilledEmail} />
      <input type="password" placeholder="password" />
      <button>Log In</button>
    </>
  );
}
```

### Why?

[JSX](https://reactjs.org/docs/introducing-jsx.html) is a neat way of parsing and compiling templates to vanilla javascript. Right now most people use JSX with [React](https://reactjs.org/). But in reality, the technology is decoupled enough from React that it can be used to render anything:

- HTML
- XML
- DOM Nodes

This library helps you do that.

### Can't you do that with Babel?

Yep, Babel provides a neat `pragma` [option](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx#pragma) which lets you choose what your jsx is compiled to; if you don't want to use `React.createElement`, you can write your own pragma to convert the jsx to anything else.

The only problem with that is, the decision of which pragma to use is made entirely at build-time. Let's say you have a template which needs to be:

- Rendered as an html string on the server side.
- Rendered directly as a DOM element in some client environments.
- Rendered as a React component in other client environments.

`jsx-pragmatic` helps you achieve that by allowing you decide when you render what your jsx should be transformed into.

It also abstracts away some of the stuff in jsx that's a little tricky to deal with; like nested children arrays, dealing with basic element vs function components, and fragments -- leaving you to focus on the renderer logic.

Quick Start
-----------

#### Install

```bash
npm install --save jsx-pragmatic
```

#### Getting Started

- Fork the module
- Run setup: `npm run setup`
- Start editing code in `./src` and writing tests in `./tests`
- `npm run build`

#### Building

```bash
npm run build
```

#### Tests

- Edit tests in `./test/tests`
- Run the tests:

  ```bash
  npm run test
  ```

#### Testing with different/multiple browsers

```bash
npm run karma -- --browser=PhantomJS
npm run karma -- --browser=Chrome
npm run karma -- --browser=Safari
npm run karma -- --browser=Firefox
npm run karma -- --browser=PhantomJS,Chrome,Safari,Firefox
```

#### Keeping the browser open after tests

```bash
npm run karma -- --browser=Chrome --keep-open
```

#### Publishing

##### Before you publish for the first time:

- Delete the example code in `./src`, `./test/tests` and `./demo`
- Edit the module name in `package.json`
- Edit `README.md` and `CONTRIBUTING.md`

##### Then:

- Publish your code: `npm run release` to add a patch
  - Or `npm run release:path`, `npm run release:minor`, `npm run release:major`
