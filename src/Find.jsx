// src/Find.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useSosToggle } from "./navigation";
import BottomNav, { SOSOverlay } from "./BottomNav";

// Shared demo locations
const demoLocations = [
  {
    id: 1,
    name: "Hope Center",
    city: "San Francisco",
    status: "Open",
    distance: "2.3 mi",
    lat: 37.7749,
    lng: -122.4194,
  },
  {
    id: 2,
    name: "Recovery House",
    city: "Los Angeles",
    status: "Open",
    distance: "5.1 mi",
    lat: 34.0522,
    lng: -118.2437,
  },
  {
    id: 3,
    name: "Serenity Place",
    city: "San Diego",
    status: "Closed",
    distance: "8.7 mi",
    lat: 32.7157,
    lng: -117.1611,
  },
  {
    id: 4,
    name: "New Beginnings",
    city: "Oakland",
    status: "Open",
    distance: "3.2 mi",
    lat: 37.8044,
    lng: -122.2712,
  },
  {
    id: 5,
    name: "Safe Harbor",
    city: "Sacramento",
    status: "Open",
    distance: "12.4 mi",
    lat: 38.5816,
    lng: -121.4944,
  },
];

function Locations({
  isAuthenticated,
  viewMode = "map",
  focusedLocation,
  onRequestFocusLocation,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Expecting Leaflet global L (or import L from "leaflet")
    if (!mapInstanceRef.current && typeof L !== "undefined") {
      const map = L.map(mapRef.current, {
        center: [37.0902, -95.7129],
        zoom: 4,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      mapInstanceRef.current = map;

      demoLocations.forEach((loc) => {
        const icon = L.divIcon({
          html: '<div class="location-marker">★</div>',
          className: "",
          iconSize: [30, 30],
        });

        const marker = L.marker([loc.lat, loc.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<strong>${loc.name}</strong><br>${loc.city}<br>${loc.status}`
          );

        markersRef.current.push({ id: loc.id, marker });
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 100);
    }
  }, [viewMode]);

  useEffect(() => {
    if (focusedLocation && mapInstanceRef.current) {
      mapInstanceRef.current.setView(
        [focusedLocation.lat, focusedLocation.lng],
        12
      );

      const marker = markersRef.current.find(
        (m) => m.id === focusedLocation.id
      );
      if (marker) {
        marker.marker.openPopup();
      }
    }
  }, [focusedLocation]);

  const panelClass =
    viewMode === "list"
      ? "locations__panel locations__panel--card"
      : "locations__panel locations__panel--ghost";

  return (
    <div className="locations">
      <div ref={mapRef} className="locations__map" />

      <div className="locations__content">
        <div className={panelClass}>
          <h2>{viewMode === "list" ? "Nearby Resources" : "Explore the Map"}</h2>
          <p>
            {viewMode === "list"
              ? "Browse all locations below"
              : "Use the map to explore locations near you"}
          </p>

          {viewMode === "list" && (
            <>
              <ul className="locations__list">
                {demoLocations.map((loc) => (
                  <li key={loc.id} className="locations__list-item">
                    <div>
                      <p className="locations__list-name">{loc.name}</p>
                      <p className="locations__list-meta">
                        {loc.city} • {loc.status}
                      </p>
                    </div>
                    <div className="locations__list-actions">
                      <span className="locations__list-distance">
                        {loc.distance}
                      </span>
                      <button
                        className="locations__map-button"
                        onClick={() =>
                          onRequestFocusLocation && onRequestFocusLocation(loc)
                        }
                      >
                        Map
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {!isAuthenticated && (
                <p className="locations__cta">
                  Sign in to save your favorite locations and get personalized
                  recommendations.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Find({ isAuthenticated, username }) {
  const [viewMode, setViewMode] = useState("map");
  const [focusedLocation, setFocusedLocation] = useState(null);
  const [sosOpen, setSosOpen] = useSosToggle();

  const handleFocusLocation = (location) => {
    setViewMode("map");
    setFocusedLocation(location);
  };

  return (
    <>
      <nav className="app-nav app-nav--fixed">
        <div className="app-nav__brand">
          <h1 className="app-nav__logo">Circley</h1>
          <div className="app-nav__tagline-row">
            <p className="app-nav__tagline">Find Resources</p>
            {isAuthenticated && username && (
              <p className="app-nav__welcome">Welcome, {username}</p>
            )}
          </div>
        </div>

        <div className="app-nav__menu">
          <div className="app-nav__view-toggle">
            <button
              className={`app-nav__view-button ${
                viewMode === "map" ? "is-active" : ""
              }`}
              onClick={() => setViewMode("map")}
            >
              Map
            </button>
            <button
              className={`app-nav__view-button ${
                viewMode === "list" ? "is-active" : ""
              }`}
              onClick={() => setViewMode("list")}
            >
              List
            </button>
          </div>

          <div className="app-nav__auth">
            {isAuthenticated ? (
              <>
                <span className="app-nav__user">{username}</span>
                <Link
                  href="/logout/"
                  style={{
                    padding: "0.4rem 0.9rem",
                    background: "#ef4444",
                    color: "#ffffff",
                    borderRadius: "999px",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login/"
                  style={{
                    padding: "0.4rem 0.9rem",
                    background: "transparent",
                    color: "#1e40af",
                    borderRadius: "999px",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    border: "1px solid #1e40af",
                  }}
                >
                  Login
                </Link>
                <Link
                  href="/signup/"
                  style={{
                    padding: "0.4rem 0.9rem",
                    background: "#1e40af",
                    color: "#ffffff",
                    borderRadius: "999px",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  Join
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <Locations
        isAuthenticated={isAuthenticated}
        viewMode={viewMode}
        focusedLocation={focusedLocation}
        onRequestFocusLocation={handleFocusLocation}
      />

      <BottomNav active="/find/" />
      <SOSOverlay isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </>
  );
}

export default Find;
export { Find };
