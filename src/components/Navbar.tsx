import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
  const [darkMode, setDarkModeLocal] = React.useState(false);
  const [themeMode, setThemeMode] = React.useState<
    "auto" | "warmgoblin" | "dark"
  >("auto");
  const [isProvinceMenuOpen, setIsProvinceMenuOpen] = React.useState(false);
  const provinceMenuRef = React.useRef<HTMLDetailsElement>(null);

  const provinces = ["bari", "bat", "brindisi", "foggia", "lecce", "taranto"];

  const applyTheme = React.useCallback(
    (mode: "auto" | "warmgoblin" | "dark") => {
      let isDark: boolean;

      if (mode === "auto") {
        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      } else {
        isDark = mode === "dark";
      }

      setDarkModeLocal(isDark);
      document.documentElement.setAttribute(
        "data-theme",
        isDark ? "dark" : "warmgoblin"
      );
    },
    []
  );

  React.useEffect(() => {
    // Check saved mode or default to auto
    const savedMode =
      (localStorage.getItem("themeMode") as "auto" | "warmgoblin" | "dark") ||
      "auto";
    setThemeMode(savedMode);
    applyTheme(savedMode);

    // Listen for system theme changes (only matters when mode is 'auto')
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const currentMode =
        (localStorage.getItem("themeMode") as "auto" | "warmgoblin" | "dark") ||
        "auto";
      if (currentMode === "auto") {
        applyTheme("auto");
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    // Handle click outside for province menu
    const handleClickOutside = (event: MouseEvent) => {
      if (
        provinceMenuRef.current &&
        !provinceMenuRef.current.contains(event.target as Node)
      ) {
        setIsProvinceMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [applyTheme]);

  const toggleDarkMode = () => {
    // Cycle through: auto -> warmgoblin -> dark -> auto
    let newMode: "auto" | "warmgoblin" | "dark";

    if (themeMode === "auto") {
      newMode = "warmgoblin";
    } else if (themeMode === "warmgoblin") {
      newMode = "dark";
    } else {
      newMode = "auto";
    }

    setThemeMode(newMode);
    localStorage.setItem("themeMode", newMode);
    applyTheme(newMode);
  };

  return (
    <div className="navbar bg-base-100 shadow-lg z-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href="/candidati">Candidati</Link>
            </li>
            <li>
              <Link href="/risultati">Risultati</Link>
            </li>
            <li>
              <Link href="/affluenze">Affluenze</Link>
            </li>
            <li>
              <Link href="/province">Province</Link>
            </li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl font-bold">
          Puglia Regionali 2025
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/candidati">Candidati</Link>
          </li>
          <li>
            <Link href="/risultati">Risultati</Link>
          </li>
          <li>
            <Link href="/affluenze">Affluenze</Link>
          </li>
          <li>
            <details
              ref={provinceMenuRef}
              open={isProvinceMenuOpen}
              onToggle={(e) =>
                setIsProvinceMenuOpen((e.target as HTMLDetailsElement).open)
              }
            >
              <summary>Province</summary>
              <ul className="p-2 bg-base-100 rounded-box">
                {provinces.map((province) => (
                  <li key={province}>
                    <Link
                      href={`/provincia/${province}`}
                      onClick={() => setIsProvinceMenuOpen(false)}
                    >
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
          title={
            themeMode === "auto"
              ? "Auto (Sistema)"
              : themeMode === "warmgoblin"
              ? "Chiaro"
              : "Scuro"
          }
        >
          {themeMode === "auto" ? (
            <svg
              className="w-5 h-5"
              viewBox="0 0 1024 1024"
              fill="currentColor"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M772.672 575.808V448.192l70.848-70.848a370.688 370.688 0 0 0-56.512-97.664l-96.64 25.92-110.528-63.808-25.92-96.768a374.72 374.72 0 0 0-112.832 0l-25.92 96.768-110.528 63.808-96.64-25.92c-23.68 29.44-42.816 62.4-56.576 97.664l70.848 70.848v127.616l-70.848 70.848c13.76 35.264 32.832 68.16 56.576 97.664l96.64-25.92 110.528 63.808 25.92 96.768a374.72 374.72 0 0 0 112.832 0l25.92-96.768 110.528-63.808 96.64 25.92c23.68-29.44 42.816-62.4 56.512-97.664l-70.848-70.848z m39.744 254.848l-111.232-29.824-55.424 32-29.824 111.36c-37.76 10.24-77.44 15.808-118.4 15.808-41.024 0-80.768-5.504-118.464-15.808l-29.888-111.36-55.424-32-111.168 29.824A447.552 447.552 0 0 1 64 625.472L145.472 544v-64L64 398.528A447.552 447.552 0 0 1 182.592 193.28l111.168 29.824 55.424-32 29.888-111.36A448.512 448.512 0 0 1 497.472 64c41.024 0 80.768 5.504 118.464 15.808l29.824 111.36 55.424 32 111.232-29.824c56.32 55.68 97.92 126.144 118.592 205.184L849.472 480v64l81.536 81.472a447.552 447.552 0 0 1-118.592 205.184zM497.536 627.2a115.2 115.2 0 1 0 0-230.4 115.2 115.2 0 0 0 0 230.4z m0 76.8a192 192 0 1 1 0-384 192 192 0 0 1 0 384z" />
            </svg>
          ) : darkMode ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
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
