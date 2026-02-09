export type ColorScheme = {
  primary: string;
  secondary: string;
  text: string;
  background: string;
  accent: string;
  backgroundImage?: string;
};

export type Typography = {
  fontFamily: string;
  fontSize: {
    base: string;
    h1: string;
    h2: string;
    small: string;
  };
  lineHeight: string;
};

export type Spacing = {
  margin: string;
  padding: string;
  gap: string;
};

export interface HeaderConfig {
  showTitle: boolean;
  showPhone: boolean;
  showEmail: boolean;
  showLocation: boolean;
  showLink: boolean;
  showAdditionalLink: boolean;
  showPhoto: boolean;
  uppercaseName: boolean;
  showDob: boolean;
  showNationality: boolean;
  photoStyle: 'circle' | 'square';
}

export interface Theme {
  id: string;
  name: string;
  colors: ColorScheme;
  typography: Typography;
  spacing: Spacing;
  backgroundImage?: string; // Para el efecto membrete/capas
  headerConfig?: HeaderConfig;
  columnConfig?: {
    leftColumnWidth: number; // Percentage or ratio value (e.g. 60)
    rightColumnWidth: number; // (e.g. 40)
  };
}

export type LayoutId = 'classic' | 'modern' | 'minimal' | 'creative';

export interface ThemeState {
  activeThemeId: string;
  activeLayoutId: LayoutId;
  customization: Theme; // Permite override de la configuración base
  availableThemes: Theme[]; // Lista de temas precargados
}
