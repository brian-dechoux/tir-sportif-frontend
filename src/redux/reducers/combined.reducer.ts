import { combineReducers } from 'redux';
import toast from 'redux/reducers/toast.reducer';
import auth from 'redux/reducers/auth.reducer';
import { connectRouter } from 'connected-react-router';

const createRootReducer = (history: any) =>
  combineReducers({
    router: connectRouter(history),
    toast,
    auth,
  });

export default createRootReducer;
