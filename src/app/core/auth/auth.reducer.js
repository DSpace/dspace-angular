// import actions
import { AuthActionTypes } from './auth.actions';
/**
 * The initial state.
 */
var initialState = {
    authenticated: false,
    loaded: false,
    loading: false,
};
/**
 * The reducer function.
 * @function reducer
 * @param {State} state Current state
 * @param {AuthActions} action Incoming action
 */
export function authReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case AuthActionTypes.AUTHENTICATE:
            return Object.assign({}, state, {
                error: undefined,
                loading: true,
                info: undefined
            });
        case AuthActionTypes.AUTHENTICATED:
            return Object.assign({}, state, {
                loading: true
            });
        case AuthActionTypes.AUTHENTICATED_ERROR:
            return Object.assign({}, state, {
                authenticated: false,
                authToken: undefined,
                error: action.payload.message,
                loaded: true,
                loading: false
            });
        case AuthActionTypes.AUTHENTICATED_SUCCESS:
            return Object.assign({}, state, {
                authenticated: true,
                authToken: action.payload.authToken,
                loaded: true,
                error: undefined,
                loading: false,
                info: undefined,
                user: action.payload.user
            });
        case AuthActionTypes.AUTHENTICATE_ERROR:
        case AuthActionTypes.REGISTRATION_ERROR:
            return Object.assign({}, state, {
                authenticated: false,
                authToken: undefined,
                error: action.payload.message,
                loading: false
            });
        case AuthActionTypes.AUTHENTICATED:
        case AuthActionTypes.AUTHENTICATE_SUCCESS:
        case AuthActionTypes.LOG_OUT:
            return state;
        case AuthActionTypes.CHECK_AUTHENTICATION_TOKEN:
            return Object.assign({}, state, {
                loading: true
            });
        case AuthActionTypes.CHECK_AUTHENTICATION_TOKEN_ERROR:
            return Object.assign({}, state, {
                loading: false
            });
        case AuthActionTypes.LOG_OUT_ERROR:
            return Object.assign({}, state, {
                authenticated: true,
                error: action.payload.message
            });
        case AuthActionTypes.LOG_OUT_SUCCESS:
        case AuthActionTypes.REFRESH_TOKEN_ERROR:
            return Object.assign({}, state, {
                authenticated: false,
                authToken: undefined,
                error: undefined,
                loaded: false,
                loading: false,
                info: undefined,
                refreshing: false,
                user: undefined
            });
        case AuthActionTypes.REDIRECT_AUTHENTICATION_REQUIRED:
        case AuthActionTypes.REDIRECT_TOKEN_EXPIRED:
            return Object.assign({}, state, {
                authenticated: false,
                authToken: undefined,
                loaded: false,
                loading: false,
                info: action.payload,
                user: undefined
            });
        case AuthActionTypes.REGISTRATION:
            return Object.assign({}, state, {
                authenticated: false,
                authToken: undefined,
                error: undefined,
                loading: true,
                info: undefined
            });
        case AuthActionTypes.REGISTRATION_SUCCESS:
            return state;
        case AuthActionTypes.REFRESH_TOKEN:
            return Object.assign({}, state, {
                refreshing: true,
            });
        case AuthActionTypes.REFRESH_TOKEN_SUCCESS:
            return Object.assign({}, state, {
                authToken: action.payload,
                refreshing: false,
            });
        case AuthActionTypes.ADD_MESSAGE:
            return Object.assign({}, state, {
                info: action.payload,
            });
        case AuthActionTypes.RESET_MESSAGES:
            return Object.assign({}, state, {
                error: undefined,
                info: undefined,
            });
        case AuthActionTypes.SET_REDIRECT_URL:
            return Object.assign({}, state, {
                redirectUrl: action.payload,
            });
        default:
            return state;
    }
}
//# sourceMappingURL=auth.reducer.js.map