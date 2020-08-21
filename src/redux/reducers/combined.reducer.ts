import { combineReducers } from 'redux';
import toast from 'redux/reducers/toast.reducer';
import auth from 'redux/reducers/auth.reducer';
import general from 'redux/reducers/general.reducer';
import addShooter from 'redux/reducers/add-shooter.reducer';
import { connectRouter } from 'connected-react-router';
import AppState from 'redux/states/app.state.type';
import { Reducer } from 'react';
import { Actions } from '../../store';

const createRootReducer = (history: any): Reducer<AppState | undefined, Actions> =>
  combineReducers({
    router: connectRouter(history),
    toast,
    auth,
    general,
    addShooter,
  });

export default createRootReducer;
