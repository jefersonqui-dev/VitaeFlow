import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeState, Theme, LayoutId } from '../../types/theme';

// Tema por defecto (Professional Blue)
const defaultTheme: Theme = {
  id: 'default',
  name: 'Professional Blue',
  colors: {
    primary: '#2563EB', // blue-600
    secondary: '#64748B', // slate-500
    text: '#0F172A', // slate-900
    background: '#FFFFFF',
    accent: '#E0F2FE', // sky-100
    backgroundImage: '', // Default no image
  },
  typography: {
    fontFamily: 'CustomFont, sans-serif',
    fontSize: {
      base: '14px',
      h1: '24px',
      h2: '18px',
      small: '12px',
    },
    lineHeight: '1.5',
  },
  spacing: {
    margin: '16px',
    padding: '16px',
    gap: '8px',
  },
  headerConfig: {
    showTitle: true,
    showPhone: true,
    showEmail: true,
    showLocation: true,
    showLink: true,
    showAdditionalLink: true,
    showPhoto: true,
    uppercaseName: true,
    showDob: false,
    showNationality: false,
    photoStyle: 'circle',
  },
  columnConfig: {
    leftColumnWidth: 60,
    rightColumnWidth: 40,
  }
};

const initialState: ThemeState = {
  activeThemeId: 'default',
  activeLayoutId: 'classic',
  customization: defaultTheme,
  availableThemes: [defaultTheme],
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<string>) => {
      const theme = state.availableThemes.find(t => t.id === action.payload);
      if (theme) {
        state.activeThemeId = action.payload;
        state.customization = { ...theme };
      }
    },
    setLayout: (state, action: PayloadAction<LayoutId>) => {
      state.activeLayoutId = action.payload;
    },
    updateThemeColors: (state, action: PayloadAction<Partial<Theme['colors']>>) => {
      state.customization.colors = { ...state.customization.colors, ...action.payload };
    },
    updateTypography: (state, action: PayloadAction<Partial<Theme['typography']>>) => {
      state.customization.typography = { ...state.customization.typography, ...action.payload };
    },
    // Background layer support
    setBackgroundImage: (state, action: PayloadAction<string | undefined>) => {
      state.customization.backgroundImage = action.payload;
    },
    updateHeaderConfig: (state, action: PayloadAction<Partial<Theme['headerConfig']>>) => {
      const currentConfig = state.customization.headerConfig || {
        showTitle: true,
        showPhone: true,
        showEmail: true,
        showLocation: true,
        showLink: true,
        showAdditionalLink: true,
        showPhoto: true,
        uppercaseName: true,
        showDob: false,
        showNationality: false,
        photoStyle: 'circle'
      };
      
      state.customization.headerConfig = { 
        ...currentConfig, 
        ...action.payload 
      };
    },
    updateColumnConfig: (state, action: PayloadAction<{ left: number; right: number }>) => {
      state.customization.columnConfig = {
        leftColumnWidth: action.payload.left,
        rightColumnWidth: action.payload.right
      };
    }
  },
});

export const {
  setTheme,
  setLayout,
  updateThemeColors,
  updateTypography,
  setBackgroundImage,
  updateHeaderConfig,
  updateColumnConfig
} = themeSlice.actions;

export default themeSlice.reducer;
