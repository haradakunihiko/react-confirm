# react-confirm
Small library which makes your Dialog component callable.

This library does not provide any view component. Just adds a functionality to be callable like `window.confirm`.

In the [example](https://github.com/haradakunihiko/react-confirm/tree/master/example), [react-bootstrap](https://react-bootstrap.github.io/components.html#modals) and [material-ui](http://www.material-ui.com/#/components/dialog) are used with.

[![npm version](https://badge.fury.io/js/react-confirm.svg)](https://badge.fury.io/js/react-confirm)

## Motivation
 React is great. And I respect the concept to render the view reactively only by it's state. However, it easily becomes really complex to manage all states which are only needed just temporarily like confirmation dialog. The question is... Is it worth to manage them inside your app? I guess the answer is not always yes.

## What you can do
 With this library,
 - You can open a dialog component by calling function and it will be rendered outside your application. The function returns promise so that you can define callbacks to handle the confirmation result.
 - You can pass arguments to the function and use them inside the dialog component.
 - You can get values from the component in the promise.
 - There is no limitation in the dialog. You can use input forms, multiple buttons, whatever you want (see demo site).

## Demo
https://codesandbox.io/s/react-confirm-with-react-bootstrap-kjju1

## Usage
1. create your dialog component.
2. apply `confirmable` to your component (optional, but usually recommended).
3. create function with `createConfirmation` by passing your confirmable component.
4. call it!

### create confirmable component

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

// or, use `confirmable` as decorator
@confirmable
class YourDialog extends React.Component {
}


```

### create confirm function
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

### use it!
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

