# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

react-confirm is a lightweight library that simplifies the implementation of confirmation dialogs in React applications by offering a Promise-based API that works seamlessly with async/await syntax, similar to `window.confirm()`. It doesn't provide a specific view or component for the confirmation dialog, allowing users to easily customize the appearance to match their application's design.

## Common Commands

### Building and Development

```bash
# Install dependencies
npm install

# Clean the output directory
npm run clean

# Build the library
npm run build

# Build before publishing
npm run prepublish
```

### Testing

```bash
# Run all tests
npm test

# Run a specific test file
npx jest __tests__/confirmable.test.js

# Run a specific test with pattern matching
npx jest -t "proceed works as expected"
```

## Architecture

The library is structured around these key components:

1. **confirmable** - A higher-order component (HOC) that wraps a dialog component to make it compatible with the confirmation system.

2. **createConfirmation** - A function factory that creates a confirmation function which returns a promise when called.

3. **Mounting Systems**:
   - **domTree** - Mounts the confirmation dialog in a new DOM node outside of your React tree (default)
   - **reactTree** - Mounts the confirmation dialog within your React tree, allowing it to access context

### Component Architecture

The library follows a "caller/callee" pattern:

- **Caller**: The component or function that invokes the confirmation dialog using the function returned by `createConfirmation`.
- **Callee**: The dialog component that renders the actual confirmation UI.

### Key Files

- `src/confirmable.js` - HOC that adds confirmation functionality to a component
- `src/createConfirmation.js` - Creates a function that returns a promise when called
- `src/mounter/domTree.js` - Handles mounting dialogs in the DOM tree
- `src/mounter/reactTree.js` - Handles mounting dialogs in the React tree
- `typescript/index.d.ts` - TypeScript definitions

## TypeScript Support

The library includes TypeScript definitions for proper type checking. When using TypeScript, you can define your dialog component in two ways:

```ts
const Confirmation1: React.FC<ConfirmDialogProps<Props, Response>> = (props) => (<Dialog></Dialog>)
// or
const Confirmation2: ConfirmDialog<Props, Response> = (props) => (<Dialog></Dialog>)
```

## React Version Compatibility

- React 18+ users should use `react-confirm` version 0.2.x or 0.3.x
- React <=17 users should stick to `react-confirm` version 0.1.x