// store/fileSlice.ts

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ZipFileState {
    inZip: boolean;
    fileName: string;
    isStored: boolean;
    storedPath: string;
    isProcessed: boolean;
    processedPath: string;
}

const initialState: ZipFileState = {
    inZip: false,
    fileName: "",
    isStored: false,
    storedPath: "",
    isProcessed: false,
    processedPath: "",
};

export const fileSlice = createSlice({
    name: "file",
    initialState,
    reducers: {
        setInZip: (state, action: PayloadAction<boolean>) => {
            state.inZip = action.payload;
        },
        setFileName: (state, action: PayloadAction<string>) => {
            state.fileName = action.payload;
        },
        setIsStored: (state, action: PayloadAction<boolean>) => {
            state.isStored = action.payload;
        },
        setStoredPath: (state, action: PayloadAction<string>) => {
            state.storedPath = action.payload;
        },
        setIsProcessed: (state, action: PayloadAction<boolean>) => {
            state.isProcessed = action.payload;
        },
        setProcessedPath: (state, action: PayloadAction<string>) => {
            state.processedPath = action.payload;
        },
        resetFileState: (state) => {
            state.inZip = false;
            state.fileName = "";
            state.isStored = false;
            state.storedPath = "";
            state.isProcessed = false;
            state.processedPath = "";
        }
    },
});

export const { setInZip, setFileName, setIsStored, setStoredPath, setIsProcessed,setProcessedPath,resetFileState } = fileSlice.actions;

export default fileSlice.reducer;
