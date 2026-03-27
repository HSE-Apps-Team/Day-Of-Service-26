
// --- Base Colors for Consistency ---
const BaseColors = {
  primaryGreen: '#388E3C', // Trust, Health, Clarity
  darkSecondaryGreen: '#6ccb6f', // Darker shade for accents
  secondaryGreen: '#c4ffc6ff', // Supporting actions
  primaryYellow: '#f5a623ff', // Energy, Attention
  successGreen: '#0e7518ff', // Task completion, positive feedback
  adminGreen: '#235b26ff', // Admin indication
  errorRed: '#D32F2F', // Standard error/alert
  surfaceWhite: '#FFFFFF', // Clean background for cards/paper
  backgroundLight: '#fff0d8', // Very light, slightly textured background
  textDark: '#2D3436', // High-contrast text
  textLight: '#FFFFFF', // For dark backgrounds
  priorityRed: '#D32F2F', // High urgency items
  priorityYellow: '#FBC02D', // Medium urgency items
  priorityGreen: '#388E3C', // Low urgency items
  defaultGray: '#818181ff', // Secondary text and icons color
  disabledGray: '#BDBDBD', // Disabled elements
  dividerGray: '#E0E0E0', // Dividers and borders
  taskSurface: '#F5F5F5', // Task card background
  cardSurface: '#25232a',
  lightPaperGray: '#f5f5f5', // General paper/card background
  darkPaperGray: '#2c2c2eff', // Dark mode paper/card background
  cardSurfaceLight: '#c1c1c1ff', // Light mode card surface


  
};

// --- Light Theme Definition (MD3) ---
const LightTheme = {
  
  roundness: 6, // Slightly rounded corners for a friendlier feel
  colors: {

    // Core Colors
    primary: BaseColors.primaryGreen,
    secondary: BaseColors.defaultGray,
    onPrimary: BaseColors.surfaceWhite, // Text on primary background
    onSecondary: BaseColors.defaultGray,

    // Backgrounds and Surfaces
    background: '#FFF8ED', // Light, clean background
    surface: BaseColors.surfaceWhite, // Cards, Modals, Paper
    onSurface: BaseColors.textDark, // Text on cards/surfaces
    surfaceVariant: '#EAEAEA', // Subtle separation lines
    taskSurface: BaseColors.taskSurface, // Task card background

    // Utility Colors
    priorityHigh: BaseColors.priorityRed,
    priorityMedium: BaseColors.priorityYellow,
    priorityLow: BaseColors.priorityGreen,
    error: BaseColors.errorRed,
    success: BaseColors.successGreen,
    onBackground: BaseColors.textDark,
    placeholder: '#757575',
    disabled: '#BDBDBD',
    cardSurface: BaseColors.surfaceWhite,
    borderColor: BaseColors.primaryGreen,
    admin: BaseColors.adminGreen,
    paperGray: BaseColors.lightPaperGray,
    secondaryGray: BaseColors.darkPaperGray,
    calendarGray: '#f0e9dfff',
    calendarHeader: BaseColors.surfaceWhite,
    primaryContainer: '#d1f7d0ff',
    onPrimaryContainer: BaseColors.primaryGreen,
    secondaryContainer: '#f0f0f0ff',
    disabledGray: BaseColors.disabledGray,
  },
};

// --- Dark Theme Definition (MD3) ---
const DarkTheme = { // RENAMED TO PaperDarkTheme for clarity
  roundness: 6,
  colors: {

    // Core Colors (Lighter versions for contrast on dark background)
    primary: BaseColors.secondaryGreen, // Keep primary consistent but maybe slightly brighter
    secondary: BaseColors.darkSecondaryGreen,
    onPrimary: BaseColors.textDark,
    onSecondary: BaseColors.defaultGray,

    // Backgrounds and Surfaces
    background: '#343434ff', // Dark gray background
    surface: '#818181ff', // Lighter gray for cards, Modals, Paper
    onSurface: BaseColors.textLight, // Light text on surfaces
    surfaceVariant: '#333333',
    taskSurface: '#3a3a3a', // Darker surface for task cards

    // Utility Colors

    priorityHigh: BaseColors.priorityRed,
    priorityMedium: BaseColors.priorityYellow,
    priorityLow: BaseColors.priorityGreen,
    error: BaseColors.errorRed, // Lighter red for visibility
    success: BaseColors.successGreen, // Lighter green
    onBackground: BaseColors.textLight,  
    placeholder: '#9E9E9E',
    disabled: BaseColors.disabledGray,
    cardSurface: BaseColors.cardSurface,
    admin: BaseColors.primaryGreen,
    borderColor: BaseColors.secondaryGreen,
    paperGray: BaseColors.darkPaperGray,
    secondaryGray: BaseColors.lightPaperGray,
    calendarGray: '#292929ff',
    calendarHeader: '#3a3a3a',
    primaryContainer: '#364439ff',
    onPrimaryContainer: BaseColors.secondaryGreen,
    secondaryContainer: '#fefffeff',
    disabledGray: BaseColors.disabledGray,
  },
};

// --- Integration with React Navigation ---
// FIX: Assign the result to a variable first to help TypeScript infer the type.



// Exporting all theme components
export {
    BaseColors,
    LightTheme,
    DarkTheme, // Exporting the custom Paper theme as DarkTheme
};