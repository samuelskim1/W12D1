import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import teaReducer from './teaReducer';
import transactionReducer from './transactionReducer';

const rootReducer = combineReducers({
  teas: teaReducer,
  transactions: transactionReducer
});

//combineReducers is not necessary (it hides a lto of logic for us)
//separate reducer that doesn't use combineReducers
//Whenever root reducer finishes it's job, the final return value is the global state
//what happens is that rootReducer normally assigns slice of state to each key
//combineReducer makes it so that we dont have to do that

// const rootReducer = (state = {}, action) => {
//   return (
//     teas: teaReducer(state.teas, action),
//     transactions: transactionReducer(state.transactions, action)
//   )
// }


//preloadedState might be some information that deals with UI
//ex: if we wanted to have a modal when we render our UI, preloadedState becomes useful

//if we mix the order of the thunk and logger, the logger will display the thunk functions and give us output that we dont really want to see
const configureStore = (preloadedState = {}) => (
  createStore(rootReducer, preloadedState, applyMiddleware(thunk, logger))
);

const thunkMW = (store) => (next) => (action) => {
  //next represents the nextMiddleware
  //if there is no more middleWare, then next becomes your rootreducer
  if (typeof action === "function") {
    return action(store.dispatch, store.getstate);
    //this is where our thunk action creators are getting dispatch from
  }

  return next(action);
}


const loggerMW = (store) => (next) => (action) => {
  //previous state
  console.log(store.getState());
  console.log(action);
  next(action);
  // next state
  return console.log(store.getState());
}


export default configureStore;