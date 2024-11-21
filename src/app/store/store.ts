// store/store.ts

import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import fileReducer from "./fileSlice";
import csvReducer from "./csvSlice";

// 1. Configure the store with your reducers
export const store = configureStore({
    reducer: {
        file: fileReducer,
        csv: csvReducer,
    },
    // Optional: Add middleware or dev tools settings here
});

// 2. Define RootState type
export type RootState = ReturnType<typeof store.getState>;

// 3. Define AppDispatch type
export type AppDispatch = typeof store.dispatch;

// 4. Create a typed useDispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>();

// 5. Define AppThunk type (if you plan to use thunks)
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
