import React, { useState, useEffect, useCallback, useContext, createContext } from "react";

export function normalizePath(path = "/") {
  const safePath = path || "/";
  let next = safePath.replace(/^#/, "");
  if (!next.startsWith("/")) {
    next = `/${next}`;
  }
  if (next.length > 1 && !next.endsWith("/")) {
    next = `${next}/`;
  }
  return next;
}

function useHashNavigation() {
  const getPath = () => {
    const hash = window.location.hash || "#/";
    const rawPath = hash.replace(/^#/, "");
    return normalizePath(rawPath || "/");
  };

  const [path, setPath] = useState(getPath);

  useEffect(() => {
    const handleHashChange = () => setPath(getPath());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = path;
    }
  }, [path]);

  const navigate = useCallback((nextPath) => {
    const normalized = normalizePath(nextPath);
    if (window.location.hash !== `#${normalized}`) {
      window.location.hash = normalized;
    } else {
      setPath(normalized);
    }
  }, []);

  return { path, navigate };
}

const NavigationContext = createContext(null);

export function NavigationProvider({ children }) {
  const navigation = useHashNavigation();
  return (
    <NavigationContext.Provider value={navigation}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigation must be used inside NavigationProvider");
  return ctx;
}

export function Link({ href = "/", onClick, children, ...rest }) {
  const { navigate } = useNavigation();

  const handleClick = (event) => {
    event.preventDefault();
    if (onClick) onClick(event);
    navigate(href);
  };

  return (
    <a
      href={`#${normalizePath(href)}`}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
}

export function usePage() {
  const { path } = useNavigation();
  return { url: path };
}

export function useSosToggle() {
  const [sosOpen, setSosOpen] = useState(false);

  useEffect(() => {
    const handleSOSOpen = () => setSosOpen(true);
    window.addEventListener("sos-open", handleSOSOpen);
    return () => window.removeEventListener("sos-open", handleSOSOpen);
  }, []);

  return [sosOpen, setSosOpen];
}
