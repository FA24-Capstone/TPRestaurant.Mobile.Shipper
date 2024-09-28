import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";

// Import your reducers here

// Combine your reducers
const rootReducer = combineReducers({
  // Add your reducers here
});

// Create the store
// const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

// export default store;
