import React from "react";
import Link from "next/link";
import NetworkLogo from "./NetworkLogo";
import {
  Menu,
  Moon,
  Sun,
  BarChart2,
  Map,
  Activity,
} from "lucide-react";

const Navbar: React.FC = () => {
  const [themeMode, setThemeMode] = React.useState<
    "auto" | "warmgoblin" | "dark"
  >("auto");
  const [isProvinceMenuOpen, setIsProvinceMenuOpen] = React.useState(false);
  const provinceMenuRef = React.useRef<HTMLDetailsElement>(null);

  const provinces = ["bari", "bat", "brindisi", "foggia", "lecce", "taranto"];

  const closeDrawer = () => {
    const checkbox = document.getElementById(
      "mobile-drawer"
    ) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false;
    }
  };

  const applyTheme = React.useCallback(
    (mode: "auto" | "warmgoblin" | "dark") => {
      let isDark: boolean;

      if (mode === "auto") {
        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      } else {
        isDark = mode === "dark";
      }

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
    <>
      {/* Navbar fissa */}
      <div className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300">
        <div className="navbar container mx-auto px-4 h-16">
          <div className="navbar-start">
            <label
              htmlFor="mobile-drawer"
              className="btn btn-ghost btn-circle lg:hidden"
            >
              <Menu size={24} />
            </label>
            <Link
              href="/"
              className="btn btn-ghost text-xl font-bold gap-2 hover:bg-transparent p-6 "
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
                  <span className="badge badge-xs badge-primary indicator-item text-primary-content!">
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

      {/* Mobile Drawer - Solo per mobile */}
      <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side z-40 lg:hidden">
        <label
          htmlFor="mobile-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 pt-20 w-80 min-h-full bg-base-100 text-base-content">
          {/* Sidebar content */}
          <li className="menu-title">
            <span>Menu</span>
          </li>
          <li>
            <Link href="/risultati" className="flex items-center gap-2" onClick={closeDrawer}>
              <BarChart2 size={18} /> Risultati
            </Link>
          </li>
          <li>
            <Link href="/affluenze" className="flex items-center gap-2" onClick={closeDrawer}>
              <Activity size={18} /> Affluenze
            </Link>
          </li>
          <li>
            <Link href="/province" className="flex items-center gap-2" onClick={closeDrawer}>
              <Map size={18} /> Province
            </Link>
          </li>
          
          <li className="menu-title mt-4">
            <span>Province</span>
          </li>
          {provinces.map((province) => (
            <li key={province}>
              <Link href={`/provincia/${province}`} className="pl-8" onClick={closeDrawer}>
                {province.charAt(0).toUpperCase() + province.slice(1)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
