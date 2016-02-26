# react-confirm
Small library which makes your Dialog component callable.

This library does not provide any view component. Just add a functionality to be callable like `window.confirm`.

In the example, react-bootstrap and material-ui are used with.

## Useage
1. create your dialog component.
2. use `confirmable` to make your component  (optional)
3. create function by passing your confirmable component to `createConfirmation`
4. call it!

### create confirmable component

```js
import { confirmable } from 'react-confirm';
import Dialog from 'something';

const YourDialog = ({show, proceed, dismiss, cancel, confirmation}) => {
  <Dialog onHide={dismiss} show={show}>
    {confirmation}
    <button onClick={cancel}>CANCEL</button>
    <button onClick={proceed}>OK</button>
  </Dialog>
}

// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component.
export default confirmable(YourDialog);
```

### create confirm function
```js
import { createConfirmation } from 'react-confirm';
import YourDialog from './YourDialog';

export default function(confirmation, options = {}) {
  return confirm({ confirmation, ...options });
}

```

### call it!
```js
import confirm from './confirm'
confirm('Are you sure').then(
  () => {
    // This will be called when `proceed` is called.
    console.log('proceed called');
  },
  () => {
    // This will be called when `cancel` is called.
    console.log('cancel called');
  }
)
```
