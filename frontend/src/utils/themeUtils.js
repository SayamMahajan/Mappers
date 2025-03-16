/**
 * Initialize the theme based on user preference or system setting
 */
export const initializeTheme = () => {
  // Check if theme is saved in localStorage
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme) {
    // Apply the saved theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    return;
  }
  
  // If no saved theme, check for system preference
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = prefersDarkMode ? 'dark' : 'light';
  
  // Set the initial theme
  document.documentElement.setAttribute('data-theme', initialTheme);
  localStorage.setItem('theme', initialTheme);
};

/**
 * Watch for system theme changes
 */
export const watchSystemThemeChanges = () => {
  // Only do this if the user hasn't explicitly set a preference
  if (!localStorage.getItem('theme')) {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', event => {
        const newTheme = event.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
      });
  }
};
