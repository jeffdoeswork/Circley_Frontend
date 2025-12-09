// src/Circles.jsx

import React, { useState } from "react";
import "./Home.css";

/**
 * Circles page
 *
 * - Shows a list of example Circles (for now, local-only)
 * - Lets the user create a new Circle with:
 *    - name (required)
 *    - short description
 *    - visibility (Public / Private)
 *
 * TODO: Wire this up to your real backend:
 *   - Replace the local state with a GET / POST to your API
 *   - Show server-side validation errors, etc.
 */
export default function Circles() {
  const [circles, setCircles] = useState([
    {
      id: 1,
      name: "New Parents in NJ",
      description: "Share tips, vent, and support each other through toddler chaos.",
      visibility: "public",
      members: 42,
    },
    {
      id: 2,
      name: "Anxiety + CBT Tools",
      description: "Practice CBT skills together with weekly check-ins and prompts.",
      visibility: "private",
      members: 18,
    },
  ]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreateCircle = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please give your Circle a name.");
      return;
    }

    const newCircle = {
      id: Date.now(),
      name: name.trim(),
      description: description.trim(),
      visibility,
      members: 1, // creator counts as first member (for now, just a mock)
    };

    setCircles((prev) => [newCircle, ...prev]);
    setName("");
    setDescription("");
    setVisibility("public");
    setSuccess("Your Circle was created (locally). Hook this up to your backend to save it.");
  };

  return (
    <div className="page-shell">
      <header className="page-header">
        <h1 className="page-title">Circles</h1>
        <p className="page-subtitle">
          Join existing Circles or start your own safe space for support.
        </p>
      </header>

      <main className="page-content">
        {/* Create Circle card */}
        <section className="card card-emphasis">
          <h2 className="section-title">Create a Circle</h2>
          <p className="section-description">
            Circles are small, focused groups for ongoing support. You can invite others later.
          </p>

          <form className="form" onSubmit={handleCreateCircle}>
            <div className="form-field">
              <label className="form-label" htmlFor="circle-name">
                Circle name<span className="form-label-required">*</span>
              </label>
              <input
                id="circle-name"
                type="text"
                className="form-input"
                placeholder="e.g. Young Parents in Recovery"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="circle-description">
                Short description
              </label>
              <textarea
                id="circle-description"
                className="form-textarea"
                placeholder="What is this Circle about? Who is it for?"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-field">
              <span className="form-label">Visibility</span>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="circle-visibility"
                    value="public"
                    checked={visibility === "public"}
                    onChange={(e) => setVisibility(e.target.value)}
                  />
                  <span className="radio-label">
                    Public
                    <span className="radio-label-sub">
                      Discoverable in search. Anyone can request to join.
                    </span>
                  </span>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="circle-visibility"
                    value="private"
                    checked={visibility === "private"}
                    onChange={(e) => setVisibility(e.target.value)}
                  />
                  <span className="radio-label">
                    Private
                    <span className="radio-label-sub">
                      Only people with an invite link can find and join.
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {error && <p className="form-message form-message-error">{error}</p>}
            {success && <p className="form-message form-message-success">{success}</p>}

            <div className="form-actions">
              <button type="submit" className="primary-button">
                Create Circle
              </button>
            </div>
          </form>
        </section>

        {/* Existing Circles list */}
        <section className="card">
          <h2 className="section-title">Explore Circles</h2>
          <p className="section-description">
            These are sample Circles stored locally. Later, this should come from your API.
          </p>

          {circles.length === 0 ? (
            <p className="empty-state-text">
              No Circles yet. Be the first to create one!
            </p>
          ) : (
            <ul className="list list-circles">
              {circles.map((circle) => (
                <li key={circle.id} className="list-item circle-item">
                  <div className="circle-item-main">
                    <h3 className="circle-name">{circle.name}</h3>
                    {circle.description && (
                      <p className="circle-description">{circle.description}</p>
                    )}
                  </div>
                  <div className="circle-meta">
                    <span className="badge badge-pill">
                      {circle.visibility === "public" ? "Public" : "Private"}
                    </span>
                    <span className="circle-members">
                      {circle.members} member{circle.members === 1 ? "" : "s"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Coming soon / help text */}
        <section className="card card-subtle">
          <h2 className="section-title">What happens next?</h2>
          <p className="section-description">
            In the full app, creating a Circle would:
          </p>
          <ul className="bullet-list">
            <li>Save your Circle to the backend via an API call.</li>
            <li>Generate a shareable invite link.</li>
            <li>Let you set simple rules and add moderators.</li>
          </ul>
          <p className="section-description">
            For now, this screen is a working prototype so you can play with the flow and layout.
          </p>
        </section>
      </main>
    </div>
  );
}
