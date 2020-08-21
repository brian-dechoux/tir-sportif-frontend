import { ActionTypes } from './action.enum';
import { BaseAction } from './base.action';

export interface AddShooterAction extends BaseAction {
  type: ActionTypes.ADD_SHOOTER;
  callback: () => Promise<number>;
  firstname: string;
  lastname: string;
}

export interface ResetShooterAction extends BaseAction {
  type: ActionTypes.RESET_SHOOTER;
}

export type AddShooterActions = AddShooterAction | ResetShooterAction;

export function addShooter(callback: () => Promise<number>, firstname: string, lastname: string): AddShooterAction {
  return {
    type: ActionTypes.ADD_SHOOTER,
    callback: callback,
    firstname: firstname,
    lastname: lastname
  };
}

export function resetShooter(): ResetShooterAction {
  return {
    type: ActionTypes.RESET_SHOOTER
  };
}
