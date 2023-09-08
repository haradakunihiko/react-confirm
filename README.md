# react-confirm
react-confirm is a lightweight library that simplifies the implementation of confirmation dialogs in React applications by offering a Promise-based API that works seamlessly with async/await syntax, similar to `window.confirm`.

One key feature of react-confirm is that it doesn't provide a specific view or component for the confirmation dialog, allowing you to easily customize the appearance of the dialog to match your application's design.

[![npm version](https://badge.fury.io/js/react-confirm.svg)](https://badge.fury.io/js/react-confirm)

## Examples
- [react-bootstrap demo in codesandbox](https://codesandbox.io/s/react-confirm-with-react-bootstrap-kjju1)
- [chakra-ui(using context) demo in codesandbox](https://codesandbox.io/s/react-confirm-with-chakra-ui-oidpf1)
- [react-bootstrap example](https://github.com/haradakunihiko/react-confirm/tree/master/example/react-bootstrap)
- [material-ui example](https://github.com/haradakunihiko/react-confirm/tree/master/example/material-ui)

## Motivation
React is a powerful library that allows for reactive rendering based on component state. However, managing temporary states like confirmation dialogs can quickly become complex. The question is: is it worth implementing these states within your app? The answer is not always a clear yes.

## What you can do
react-confirm library offers several benefits:

- You can open a dialog component by calling a function without appending it into your React tree. The function returns a promise, allowing you to handle confirmation results with callbacks.
- You can pass arguments to the function and use them inside the dialog component.
- You can retrieve values from the component in the promise.
- The library provides flexibility in designing the dialog. There is no limitation in the type of components you can use, whether it be input forms or multiple buttons. You can even check out the demo site to see examples of how to customize the dialog.

## Demo
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/fork/haradakunihiko/react-confirm-sample/tree/main/1_typescript)

Please note that interactions with the sample dialogs output details to the console. Review the console output while interacting with the dialogs to observe the behavior and outcomes.


## Versions

- React 18+ users should use `react-confirm` version 0.2.x or 0.3.x
- React <=17 users should stick to `react-confirm` version 0.1.x

## Usage
1. Create your dialog component.
2. Apply `confirmable` HOC to your component (Optional. See `confirmable` implementation).
3. Create a function using `createConfirmation` by passing your `confirmable` component.
4. Call it!

### Create your dialog component and Apply `confirmable` HOC to your component.

```js
import React from 'react';
import PropTypes from 'prop-types';
import { confirmable } from 'react-confirm';
import Dialog from 'any-dialog-library'; // your choice.

const YourDialog = ({show, proceed, confirmation, options}) => (
  <Dialog onHide={() => proceed(false)} show={show}>
    {confirmation}
    <button onClick={() => proceed(false)}>CANCEL</button>
    <button onClick={() => proceed(true)}>OK</button>
  </Dialog>
)

YourDialog.propTypes = {
  show: PropTypes.bool,            // from confirmable. indicates if the dialog is shown or not.
  proceed: PropTypes.func,         // from confirmable. call to close the dialog with promise resolved.
  confirmation: PropTypes.string,  // arguments of your confirm function
  options: PropTypes.object        // arguments of your confirm function
}

// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component.
export default confirmable(YourDialog);
```

### Create a function using `createConfirmation`
```js
import { createConfirmation } from 'react-confirm';
import YourDialog from './YourDialog';

// create confirm function
export const confirm = createConfirmation(YourDialog);

// This is optional. But wrapping function makes it easy to use.
export function confirmWrapper(confirmation, options = {}) {
  return confirm({ confirmation, options });
}
```

### Call it!
Now, you can show dialog just like window.confirm with async-await. The most common example is onclick handler for submit buttons.

```js
import { confirmWrapper, confirm } from './confirm'

const handleOnClick = async () => {
  if (await confirm({
    confirmation: 'Are you sure?'
  })) {
    console.log('yes');
  } else {
    console.log('no');
  }
}

const handleOnClick2 = async () => {
  if (await confirmWrapper('Are your sure?')) {
    console.log('yes');
  } else {
    console.log('no');
  }
}

```

You can check more complex example in [codesandbox](https://codesandbox.io/s/react-confirm-with-react-bootstrap-kjju1)

## Using with Context
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/fork/haradakunihiko/react-confirm-sample/tree/main/2_typescript_using_context)

By default, this library renders the confirmation dialog without appending the component to your app's React component tree. While this can be useful, it may cause issues if you need to consume context in your component. To overcome this problem, you can use the `MountPoint` component to include your confirmation dialog within your app's tree, enabling it to access context and other data from the app.

Create your own `createConfirmation` function and `MountPoint` Component using `createConfirmationCreater` and `createReactTreeMounter`.

```js
import { createConfirmationCreater, createReactTreeMounter, createMountPoint } from 'react-confirm';

const mounter = createReactTreeMounter();

export const createConfirmation = createConfirmationCreater(mounter);
export const MountPoint = createMountPoint(mounter);
```

Put `MountPoint` into your React tree.
```js
const YourRootComponent = () => {
  return (
    <YourContext.Provider>
      <MountPoint />
      <YourApp />
    </YourContext.Provider>
  )
}
```

use your `createConfirmation` as usual.
```js
export const confirm = createConfirmation(YourDialog);
```

To render the confirmation dialog within the React component tree but in a different part of the DOM, you can pass a DOM element to the `createReactTreeMounter` function. This will use the `createPortal` method to render the confirmation dialog in the specified DOM element while keeping it within the React component tree.

```js
const mounter = createReactTreeMounter(document.body);
```

### example
Context example with Chakra-ui in [codesandbox](https://codesandbox.io/s/react-confirm-with-chakra-ui-oidpf1)

## typescript usage
Below, we present two possible ways to define a confirmation dialog component using react-confirm. You can choose either based on your preference.

```ts
const Confirmation1: React.FC<ConfirmDialogProps<Props, Response>> = (props) => (<Dialog></Dialog>)
const Confirmation2: ConfirmDialog<Props, Response> = (props) => (<Dialog></Dialog>)
```

Ensure to specify both the dialog component's `Props` and the response value `Response` when using these types. These typings will be especially useful when defining functions to display the dialog.
