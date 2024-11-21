// store/csvSlice.ts

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CsvFileState {
    fileName: string;
    uplodedPath: string;
    isCsvMerged: boolean;
    isMergedpath: string;
}

const initialState: CsvFileState = {
    fileName: "",
    uplodedPath:'',
    isCsvMerged: false,
    isMergedpath: "",
};

export const csvSlice = createSlice({
    name: "csv",
    initialState,
    reducers: {
        setCsvFileName: (state, action: PayloadAction<string>) => {
            state.fileName = action.payload;
        },
        setUplodedPath: (state, action: PayloadAction<string>) => {
            state.uplodedPath = action.payload;
        },
        setIsCsvMerged: (state, action: PayloadAction<boolean>) => {
            state.isCsvMerged = action.payload;
        },
        setIsMergedPath: (state, action: PayloadAction<string>) => {
            state.isMergedpath = action.payload;
        },
    },
});

export const { setCsvFileName,setUplodedPath, setIsCsvMerged, setIsMergedPath } = csvSlice.actions;

export default csvSlice.reducer;
