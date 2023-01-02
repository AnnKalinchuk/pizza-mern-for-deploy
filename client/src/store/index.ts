import {  combineReducers, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { 
        persistStore, 
        persistReducer, 
        FLUSH,
        REHYDRATE,
        PAUSE,
        PERSIST,
        PURGE,
        REGISTER, 
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { productsApi } from "../services/ProductsService"
import modalReducer, {openModal, closeModal} from '../store/slices/modalSlice';
import cartReducer from '../store/slices/cartSlice';
import authReducer from '../store/slices/authSlice';
import authStatusReducer from '../store/slices/authStatusSlice';
import orderReducer from '../store/slices/orderSlice';
import { authApi } from "../services/AuthService";

const rootReducer = combineReducers({
        [productsApi.reducerPath]: productsApi.reducer,
        modal: modalReducer,
        authStatus: authStatusReducer,
        cart: cartReducer,
        order: orderReducer,
        [authApi.reducerPath]: authApi.reducer,
        auth: authReducer,
});

const persistConfig = {
        key: 'root',
        storage,
       /*  varsion: 1, */
        blacklist: [
                'modal', 
                productsApi.reducerPath,
                authApi.reducerPath
        ]
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
        reducer: persistedReducer,
        middleware: getDefaultMiddleware => 
                getDefaultMiddleware({
                        serializableCheck: {
                                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                        },
                }).concat(productsApi.middleware,authApi.middleware),  
})

export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

setupListeners(store.dispatch);