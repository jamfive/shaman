import React from "react";
import Link from "next/link";
import NetworkLogo from "./NetworkLogo";
import {
  Menu,
  X,
  Moon,
  Sun,
  BarChart2,
  Users,
  Map,
  Activity,
} from "lucide-react";

const Navbar: React.FC = () => {
  const [darkMode, setDarkModeLocal] = React.useState(false);
  const [themeMode, setThemeMode] = React.useState<
    "auto" | "warmgoblin" | "dark"
  >("auto");
  const [isProvinceMenuOpen, setIsProvinceMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
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
    const savedMode =
      (localStorage.getItem("themeMode") as "auto" | "warmgoblin" | "dark") ||
      "auto";
    setThemeMode(savedMode);
    applyTheme(savedMode);

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
    <div className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300">
      <div className="navbar container mx-auto px-4 h-16">
        <div className="navbar-start">
          <div className="dropdown lg:hidden">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </div>
            {isMobileMenuOpen && (
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 border border-base-content/10"
              >
                <li>
                  <Link
                    href="/candidati"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Users size={16} /> Candidati
                  </Link>
                </li>
                <li>
                  <Link
                    href="/risultati"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BarChart2 size={16} /> Risultati
                  </Link>
                </li>
                <li>
                  <Link
                    href="/affluenze"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Activity size={16} /> Affluenze
                  </Link>
                </li>
                <li>
                  <Link
                    href="/province"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Map size={16} /> Province
                  </Link>
                </li>
              </ul>
            )}
          </div>
          <Link
            href="/"
            className="btn btn-ghost text-xl font-bold gap-2 hover:bg-transparent"
          >
            <NetworkLogo />
            <div className="flex flex-col items-start leading-none">
              <span className="text-lg font-bold tracking-tight">Puglia</span>
              <span className="text-xs font-sans font-light uppercase tracking-widest opacity-70">
                Regionali 2025
              </span>
            </div>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-1">
            <li>
              <Link
                href="/candidati"
                className="font-medium hover:text-primary focus:text-primary gap-2"
              >
                <Users size={18} />
                Candidati
              </Link>
            </li>
            <li>
              <Link
                href="/risultati"
                className="font-medium hover:text-primary focus:text-primary gap-2"
              >
                <BarChart2 size={18} />
                Risultati
              </Link>
            </li>
            <li>
              <Link
                href="/affluenze"
                className="font-medium hover:text-primary focus:text-primary gap-2"
              >
                <Activity size={18} />
                Affluenze
              </Link>
            </li>
            <li>
              <details
                ref={provinceMenuRef}
                open={isProvinceMenuOpen}
                onToggle={(e) =>
                  setIsProvinceMenuOpen((e.target as HTMLDetailsElement).open)
                }
              >
                <summary className="font-medium hover:text-primary focus:text-primary gap-2">
                  <Map size={18} />
                  Province
                </summary>
                <ul className="p-2 bg-base-100/95 backdrop-blur-md rounded-box border border-base-content/10 shadow-xl w-48">
                  {provinces.map((province) => (
                    <li key={province}>
                      <Link
                        href={`/provincia/${province}`}
                        onClick={() => setIsProvinceMenuOpen(false)}
                        className="hover:bg-primary/10 hover:text-primary"
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
            className="btn btn-ghost btn-circle hover:bg-base-content/10 transition-colors"
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
              <div className="indicator">
                <Sun size={20} className="hidden dark:block" />
                <Moon size={20} className="block dark:hidden" />
                <span className="badge badge-xs badge-primary indicator-item">
                  A
                </span>
              </div>
            ) : themeMode === "warmgoblin" ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
