import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reduxLogger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import combinedReducer from 'redux/reducers/combined.reducer';

const middleware = [reduxLogger, thunk];
const store = createStore(combinedReducer, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
