/**
 * All available actions for state management.
 */
export enum ActionTypes {

    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    LOGIN_FAILED = 'LOGIN_FAILED',
    EXPIRE_TOKEN = 'EXPIRE_TOKEN',

    GOT_CHALLENGES = 'GOT_CHALLENGES',

    TOAST_CLOSED = 'TOAST_CLOSED',
    ERROR_OCCURED = 'ERROR_OCCURED',
    MENU_OPENED = 'MENU_OPENED',
    MENU_CLOSE = 'MENU_CLOSED'
}
