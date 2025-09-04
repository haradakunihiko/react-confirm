// React 18: Enable concurrent act() environment for createRoot-based tests
// See https://react.dev/reference/react/StrictMode#testing-with-act
// and testing-library guidance for React 18
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

