export const colors = {
  primary: "#228B22", // Eco Green
  secondary: "#00BFFF", // Aqua Blue
  accent: "#FFD700", // Gold for badges/achievements
  background: "#F8F9FA",
  card: "#FFFFFF",
  text: "#333333",
  textLight: "#666666",
  textDark: "#111111",
  success: "#4CAF50",
  error: "#F44336",
  warning: "#FFC107",
  info: "#2196F3",
  border: "#E0E0E0",
  shadow: "rgba(0, 0, 0, 0.1)",
  overlay: "rgba(0, 0, 0, 0.5)",
  transparent: "transparent",
};

export const theme = {
  light: {
    text: colors.text,
    background: colors.background,
    card: colors.card,
    tint: colors.primary,
    tabIconDefault: "#ccc",
    tabIconSelected: colors.primary,
  },
  dark: {
    text: "#FFFFFF",
    background: "#121212",
    card: "#1E1E1E",
    tint: colors.primary,
    tabIconDefault: "#666",
    tabIconSelected: colors.primary,
  },
};

export default theme;