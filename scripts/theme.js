(function () {
  const toggle = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // Load saved preference, or fall back to system preference
  const saved = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = saved || (systemPrefersDark ? 'dark' : 'light');

  if (initialTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  }

  toggle.addEventListener('click', function () {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
})();