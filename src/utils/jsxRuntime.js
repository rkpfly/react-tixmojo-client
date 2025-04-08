/**
 * This utility file provides explicit import for JSX runtime
 * to avoid "Failed to resolve module specifier" errors.
 * 
 * This is especially important when using Vite with SSR.
 */

// Explicitly re-export jsx runtime to make it available
export * from 'react/jsx-runtime';

// Also re-export core React functionality that might be needed
export {
  useState,
  useEffect,
  useRef,
  useContext,
  createContext,
  useMemo,
  useCallback,
  useReducer,
  Fragment,
  StrictMode,
  Suspense,
  lazy,
  forwardRef,
  memo,
  createRef
} from 'react';

export {
  createRoot,
  hydrateRoot
} from 'react-dom/client';