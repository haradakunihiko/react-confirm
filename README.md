# react-confirm
Small library which makes your Dialog component callable.

This library does not provide any view component. Just add a functionality to become callable like `window.confirm`.

In the [example](https://github.com/haradakunihiko/react-confirm/tree/master/example), [react-bootstrap](https://react-bootstrap.github.io/components.html#modals) and [material-ui](http://www.material-ui.com/#/components/dialog) are used with.

## Motivation

## Useage
1. create your dialog component.
2. apply `confirmable` to your component (optional).
3. create function with `createConfirmation` by passing your confirmable component.
4. call it!

### create confirmable component

```js
import React from 'react';
import { confirmable } from 'react-confirm';
import Dialog from 'any-dialog-library'; // your chice. 

const YourDialog = ({show, proceed, dismiss, cancel, confirmation, options}) => {
  <Dialog onHide={dismiss} show={show}>
    {confirmation}
    <button onClick={() => cancel('arguments will be passed to the callback')}>CANCEL</button>
    <button onClick={() => proceed('same as cancel')}>OK</button>
  </Dialog>
}

YourDialog.propTypes = {
  show: PropTypes.bool,           // from confirmable 
  proceed: PropTypes.func,        // from confirmable 
  cancel: PropTypes.func,         // from confirmable 
  dismiss: PropTypes.func,        // from confirmable 
  confirmation: PropTypes.string, // arguments of your confirm function
  optios: PropTypes.object        // arguments of your confirm function
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
const confirm = createConfirmation(YourDialog);

// This is optional. But I recommend to define your confirm function easy to call.
export default function(confirmation, options = {}) {
  // You can pass whatever you want to the component. It will be your Component's props
  return confirm({ confirmation, options });
}

```

### call it!
```js
import confirm from './confirm'
confirm('Are you sure').then(
  (result) => {
    // `proceed` callback
    console.log('proceed called');
    console.log(result);
  },
  (result) => {
    // `cancel` callback
    console.log('cancel called');
    console.log(result)
  }
)
// nothing will be called when `dismiss` is triggered.
```

## Try example

```
cd example/react-bootstrap # or cd example/material-ui
npm install
npm run build
npm start
```
