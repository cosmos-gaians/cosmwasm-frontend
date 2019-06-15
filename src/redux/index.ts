import { combineReducers, createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import dashboard from "./_dashboard";
import notification from "./_notification";
import modal from "./_modal";

export const reducers = combineReducers({
  dashboard,
  notification,
  modal
});

export const store = createStore(reducers, applyMiddleware(ReduxThunk));
