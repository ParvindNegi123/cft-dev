import ActionTypes from "./authActionTypes";

export const setLoginLoading = (state = { login: false }, action) => {
    switch (action.type) {
        case ActionTypes.LOGIN_LOADING:
            return { loading: true };
        default:
            return state;
    }
}