import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const [darkMode, setDarkModeLocal] = React.useState(false);
  const [themeMode, setThemeMode] = React.useState<'auto' | 'light' | 'dark'>('auto');

  const provinces = ['bari', 'bat', 'brindisi', 'foggia', 'lecce', 'taranto'];

  const applyTheme = React.useCallback((mode: 'auto' | 'light' | 'dark') => {
    let isDark: boolean;
    
    if (mode === 'auto') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isDark = mode === 'dark';
    }
    
    setDarkModeLocal(isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, []);

  React.useEffect(() => {
    // Check saved mode or default to auto
    const savedMode = (localStorage.getItem('themeMode') as 'auto' | 'light' | 'dark') || 'auto';
    setThemeMode(savedMode);
    applyTheme(savedMode);

    // Listen for system theme changes (only matters when mode is 'auto')
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const currentMode = (localStorage.getItem('themeMode') as 'auto' | 'light' | 'dark') || 'auto';
      if (currentMode === 'auto') {
        applyTheme('auto');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [applyTheme]);

  const toggleDarkMode = () => {
    // Cycle through: auto -> light -> dark -> auto
    let newMode: 'auto' | 'light' | 'dark';
    
    if (themeMode === 'auto') {
      newMode = 'light';
    } else if (themeMode === 'light') {
      newMode = 'dark';
    } else {
      newMode = 'auto';
    }
    
    setThemeMode(newMode);
    localStorage.setItem('themeMode', newMode);
    applyTheme(newMode);
  };

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li><Link href="/candidati">Candidati</Link></li>
            <li><Link href="/risultati">Risultati</Link></li>
            <li><Link href="/affluenze">Affluenze</Link></li>
            <li><Link href="/province">Province</Link></li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl font-bold">
          Puglia Regionali 2025
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link href="/candidati">Candidati</Link></li>
          <li><Link href="/risultati">Risultati</Link></li>
          <li><Link href="/affluenze">Affluenze</Link></li>
          <li>
            <details>
              <summary>Province</summary>
              <ul className="p-2 bg-base-100 rounded-box">
                {provinces.map((province) => (
                  <li key={province}>
                    <Link href={`/provincia/${province}`}>
                      {province.charAt(0).toUpperCase() + province.slice(1)}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <button 
          className="btn btn-ghost btn-circle" 
          onClick={toggleDarkMode}
          title={themeMode === 'auto' ? 'Auto (Sistema)' : themeMode === 'light' ? 'Chiaro' : 'Scuro'}
        >
          {themeMode === 'auto' ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          ) : darkMode ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Navbar;