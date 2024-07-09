import { combineReducers } from "redux";
import { setLoginLoading } from './auth/authReducer';

import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Session Storage for current user
const persistConfig = {
    key: "root",
    storage: storage,
    whitelist: ["auth", "config"],
};

const appReducer = combineReducers({
    auth: setLoginLoading,
});

const rootReducer = (state, action) => {
    if (action.type === "USER_LOGOUT") {
        state = undefined;
    }
    return appReducer(state, action);
};

export default persistReducer(persistConfig, rootReducer);

