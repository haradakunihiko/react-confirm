# react-confirm
Small library which makes your Dialog component callable.

This library does not provide any view component. Just add a functionality to be callable like `window.confirm`.

In the example, react-bootstrap and material-ui are used with.

## Useage
1. create your dialog component.
2. use `confirmable` to pass props that manage your dialog (optional)
3. create function by passing your confirmable component to `createConfirmation`
4. call it!

### create confirmable component

```js
import { confirmable } from 'react-confirm';
import Dialog from 'something';

const YourDialog = ({show, proceed, dismiss, cancel, confirmation, options}) => {
  <Dialog onHide={dismiss} show={show}>
    {confirmation}
    <button onClick={() => cancel('arguments will be passed to the callback')}>CANCEL</button>
    <button onClick={() => proceed('same as cancel')}>OK</button>
  </Dialog>
}

// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component.
export default confirmable(YourDialog);
```

### create confirm function
```js
import { createConfirmation } from 'react-confirm';
import YourDialog from './YourDialog';

// create confirm function
const confirm = createConfirmation(Confirmation);

// This is optional. But I recommend to define your confirm function easy to call.
export default function(confirmation, options = {}) {
  // You can pass whatever you want to the component. It will be just passed to your Component's props
  return confirm({ confirmation, options });
}

```

### call it!
```js
import confirm from './confirm'
confirm('Are you sure').then(
  (result) => {
    // This will be called when `proceed` is triggered.
    console.log('proceed called');
    console.log(result);
  },
  (result) => {
    // This will be called when `cancel` is triggered.
    console.log('cancel called');
    console.log(result)
  }
)
// nothing will be called when `dismiss` is triggered.
```
