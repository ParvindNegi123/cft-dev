import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { createLogger } from 'redux-logger';
import { persistStore } from "redux-persist";

const logger = createLogger();

const middlewares = [thunk, logger];

const store = createStore(
    rootReducer,
    applyMiddleware(...middlewares)
);

const persistor = persistStore(store);

export { store, persistor };
