# react-confirm

Create confirmation dialogs as simple as `window.confirm()`, but with full customization and Promise-based API.

[![npm version](https://badge.fury.io/js/react-confirm.svg)](https://badge.fury.io/js/react-confirm)

## What you can do

**🎯 Simple confirmation dialogs**
```typescript
const result = await confirm({ message: 'Delete this item?' });
if (result) {
  // User confirmed
}
```

**🎨 Fully customizable UI** - No built-in styling. Use your own components, UI libraries, or design system.

**⚡ Promise-based API** - Works seamlessly with async/await, no complex state management needed.

**🔄 React Context support** - Access your app's context, themes, and providers from within dialogs.

**📦 Lightweight** - No dependencies, small bundle size.

## Demo
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/haradakunihiko/react-confirm-sample/tree/main/1_typescript)

## Quick Start

### 1. Install
```bash
npm install react-confirm
```

### 2. Create your dialog and confirmation function
```typescript
import React from 'react';
import { confirmable, createConfirmation, type ConfirmDialogProps } from 'react-confirm';

const MyDialog = ({ show, proceed, message }: ConfirmDialogProps<{ message: string }, boolean>) => (
  <div className={`dialog-overlay ${show ? 'show' : 'hide'}`}>
    <div className="dialog">
      <p>{message}</p>
      <button onClick={() => proceed(true)}>Yes</button>
      <button onClick={() => proceed(false)}>No</button>
    </div>
  </div>
);

export const confirm = createConfirmation(confirmable(MyDialog));
```

### 3. Use it!
```typescript
import { confirm } from './confirm';

const handleDelete = async (): Promise<void> => {
  // Fully type-safe: message is required, result is boolean
  const result = await confirm({ 
    message: 'Are you sure you want to delete this item?' 
  });
  
  if (result) {
    // User confirmed - proceed with deletion
    deleteItem();
  }
};

// In your component
<button onClick={handleDelete}>Delete Item</button>
```

## Using with React Context

If your dialog needs to access React Context (themes, authentication, etc.), use the context-aware approach:

### Simple Context Usage

```typescript
import React, { useContext } from 'react';
import { confirmable, ContextAwareConfirmation, type ConfirmDialogProps } from 'react-confirm';

interface Props {
  message: string;
}

// 1. Add ConfirmationRoot to your app
function App(): JSX.Element {
  return (
    <ThemeProvider>
      <div>
        <ContextAwareConfirmation.ConfirmationRoot />
        <YourAppContent />
      </div>
    </ThemeProvider>
  );
}

// 2. Create your dialog (can use useContext, useTheme, etc.)
const ThemedDialog = ({ show, proceed, message }: ConfirmDialogProps<Props, boolean>) => {
  const theme = useContext(ThemeContext); // ✅ Context works!
  
  return (
    <div className={`dialog-overlay ${show ? 'show' : 'hide'}`} style={{ backgroundColor: theme.background }}>
      <p>{message}</p>
      <button onClick={() => proceed(true)}>Yes</button>
      <button onClick={() => proceed(false)}>No</button>
    </div>
  );
};

// 3. Create confirmation function
const confirm = ContextAwareConfirmation.createConfirmation(confirmable(ThemedDialog));

// 4. Use anywhere in your app
const handleAction = async (): Promise<void> => {
  if (await confirm({ message: 'Continue?' })) {
    // Confirmed!
  }
};
```

### Custom Context Setup

For more control, create your own context:

```typescript
import { createConfirmationContext } from 'react-confirm';

// Create custom context (optional: specify mount node)
const CustomContextAwareConfirmation = createConfirmationContext();

// Use like the simple approach
const confirm = CustomContextAwareConfirmation.createConfirmation(confirmable(MyDialog));

function App(): JSX.Element {
  return (
    <div>
      <CustomContextAwareConfirmation.ConfirmationRoot />
      <YourApp />
    </div>
  );
}
```


## TypeScript Support

TypeScript automatically infers types from your dialog's Props definition, making the confirmation function fully type-safe.

```typescript
// Option 1: Using React.FC with ConfirmDialogProps
const Confirmation1: React.FC<ConfirmDialogProps<Props, Response>> = (props) => (<Dialog />);

// Option 2: Using ConfirmDialog type
const Confirmation2: ConfirmDialog<Props, Response> = (props) => (<Dialog />);
```


## React Version Compatibility

- **React 18+**: Use `react-confirm` version 0.2.x or 0.3.x
- **React ≤17**: Use `react-confirm` version 0.1.x


## More Examples

- [TypeScript Example](https://stackblitz.com/fork/github/haradakunihiko/react-confirm-sample/tree/main/1_typescript)
- [Context Example](https://stackblitz.com/fork/github/haradakunihiko/react-confirm-sample/tree/main/2_typescript_using_context)
- [Bootstrap Example](https://codesandbox.io/s/react-confirm-with-react-bootstrap-kjju1)
- [Chakra UI Example](https://codesandbox.io/s/react-confirm-with-chakra-ui-oidpf1)

For additional reference examples, you can also check the [react-confirm-sample](https://github.com/haradakunihiko/react-confirm-sample/) repository, which contains archived historical examples and some alternative implementations. **Check the examples above first for the latest patterns.**