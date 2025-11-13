import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RegionaleState {
  selectedProvince: string;
  selectedComune: string;
  viewMode: 'candidati' | 'liste' | 'affluenze';
  darkMode: boolean;
}

const initialState: RegionaleState = {
  selectedProvince: 'puglia',
  selectedComune: '',
  viewMode: 'candidati',
  darkMode: false,
};

const regionaleSlice = createSlice({
  name: 'regionale',
  initialState,
  reducers: {
    setSelectedProvince: (state, action: PayloadAction<string>) => {
      state.selectedProvince = action.payload;
    },
    setSelectedComune: (state, action: PayloadAction<string>) => {
      state.selectedComune = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'candidati' | 'liste' | 'affluenze'>) => {
      state.viewMode = action.payload;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
  },
});

export const { setSelectedProvince, setSelectedComune, setViewMode, setDarkMode } = regionaleSlice.actions;
export default regionaleSlice.reducer;