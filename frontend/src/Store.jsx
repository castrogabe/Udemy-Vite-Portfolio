// src/Store.jsx
// -------------------------------------------------------------
// This file sets up global state management for the app using
// React Context + useReducer.
// It allows all components to share data like user info or cart items
// without needing to pass props manually through each component.
// -------------------------------------------------------------

import { createContext, useReducer } from 'react';

// -------------------------------------------------------------
// 1️⃣ Create a Context
// -------------------------------------------------------------
// The Store is our global data container. Any component that needs
// access to global state will use useContext(Store).
// -------------------------------------------------------------
export const Store = createContext();

// -------------------------------------------------------------
// 2️⃣ Define the Initial State
// -------------------------------------------------------------
// This is the starting data for our global store.
// Here we check localStorage to persist user login between refreshes.
// -------------------------------------------------------------
const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo')) // Load from localStorage if exists
    : null, // Otherwise default to null
};

// -------------------------------------------------------------
// 3️⃣ Reducer Function
// -------------------------------------------------------------
// The reducer defines how state changes in response to actions.
// Each case returns a *new* state object based on action.type.
// -------------------------------------------------------------
const reducer = (state, action) => {
  switch (action.type) {
    // When user signs in, save user info globally
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };

    // When user signs out, clear user info
    case 'USER_SIGNOUT':
      return { ...state, userInfo: null };

    // Default: no matching action, return existing state
    default:
      return state;
  }
};

// -------------------------------------------------------------
// 4️⃣ StoreProvider Component
// -------------------------------------------------------------
// Wraps the entire app (in main.jsx) and makes state + dispatch
// accessible through React Context to any child component.
// -------------------------------------------------------------
export function StoreProvider(props) {
  // useReducer hook manages state transitions based on reducer and initialState
  const [state, dispatch] = useReducer(reducer, initialState);

  // The value object contains both state and dispatch
  const value = { state, dispatch };

  // Context Provider wraps all app components (props.children)
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
