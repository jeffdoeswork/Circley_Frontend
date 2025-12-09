// src/Verify.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigation, useSosToggle } from "./navigation";
import BottomNav, { SOSOverlay } from "./BottomNav";

const STEPS_CONFIG = [
  { key: "account" },                           // 1: Account info
  { key: "journey" },                           // 2: Where are you right now?
  { key: "support" },                           // 3: Support types
  { key: "clinical" },                          // 4: Recovery profile
  { key: "treatment", conditional: "treatment" }, // 5: Treatment preferences (conditional)
  { key: "meetings", conditional: "meetings" },   // 6: Meetings & peer support (conditional)
  { key: "life" },                              // 7: Life resources
];

function Verify() {
  const { navigate } = useNavigation();
  const [sosOpen, setSosOpen] = useSosToggle();

  // Support type selections drive which steps appear
  const [supportSelections, setSupportSelections] = useState(["treatment"]);
  const wantsTreatment = supportSelections.includes("treatment");
  const wantsMeetings =
    supportSelections.includes("meetings") || supportSelections.includes("peer");

  const visibleSteps = useMemo(() => {
    return STEPS_CONFIG.filter((step) => {
      if (!step.conditional) return true;
      if (step.conditional === "treatment") return wantsTreatment;
      if (step.conditional === "meetings") return wantsMeetings;
      return true;
    });
  }, [wantsTreatment, wantsMeetings]);

  const [currentStepKey, setCurrentStepKey] = useState(
    visibleSteps[0]?.key || "account"
  );

  // Ensure current step is always valid when visibleSteps change
  useEffect(() => {
    if (!visibleSteps.length) return;
    const exists = visibleSteps.some((s) => s.key === currentStepKey);
    if (!exists) {
      setCurrentStepKey(visibleSteps[0].key);
    }
  }, [visibleSteps, currentStepKey]);

  const currentIndex = useMemo(() => {
    return visibleSteps.findIndex((s) => s.key === currentStepKey);
  }, [visibleSteps, currentStepKey]);

  const totalSteps = visibleSteps.length || 1;
  const progressPercent =
    totalSteps > 0 && currentIndex >= 0
      ? ((currentIndex + 1) / totalSteps) * 100
      : 0;

  const handleFinish = () => {
    // You can later wire this into real backend verification
    alert("Signup complete! Your account is now verified and full access is unlocked.");
    navigate("/account/");
  };

  const goNext = () => {
    if (currentIndex === -1) return;
    if (currentIndex === totalSteps - 1) {
      handleFinish();
    } else {
      setCurrentStepKey(visibleSteps[currentIndex + 1].key);
    }
  };

  const goBack = () => {
    if (currentIndex <= 0) return;
    setCurrentStepKey(visibleSteps[currentIndex - 1].key);
  };

  // Shared pill toggle row for visual multi-select
  const PillToggleRow = ({ options, values, onToggle }) => {
    return (
      <div className="pill-toggle-row">
        {options.map((opt) => {
          const active = values.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              className={
                "pill-toggle" + (active ? " pill-toggle--active" : "")
              }
              onClick={() => onToggle(opt.value)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  };

  const toggleSupportSelection = (value) => {
    setSupportSelections((prev) => {
      const exists = prev.includes(value);
      if (exists) {
        return prev.filter((v) => v !== value);
      }
      return [...prev, value];
    });
  };

  // Local UI-only pill toggle states for other steps
  const [journeyValues, setJourneyValues] = useState([]);
  const [programStyleValues, setProgramStyleValues] = useState([]);
  const [insuranceValues, setInsuranceValues] = useState([]);
  const [travelValues, setTravelValues] = useState([]);
  const [meetingPrefValues, setMeetingPrefValues] = useState([]);
  const [meetingFormatValues, setMeetingFormatValues] = useState([]);

  const toggleGeneric = (setFn) => (value) => {
    setFn((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const renderStepContent = () => {
    switch (currentStepKey) {
      // STEP 1: Account information
      case "account":
        return (
          <div className="signup-step card">
            <h3 style={{ fontSize: "0.95rem", margin: "0 0 0.4rem" }}>
              Account information
            </h3>
            <div className="form-field">
              <label className="form-label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Password</label>
              <input
                className="input"
                type="password"
                placeholder="Create a password"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Location</label>
              <input
                className="input"
                type="text"
                placeholder="City, state or ZIP"
              />
            </div>
            <div className="signup-actions">
              <span />
              <button className="btn-primary" type="button" onClick={goNext}>
                Continue
              </button>
            </div>
          </div>
        );

      // STEP 2: Recovery journey
      case "journey":
        return (
          <div className="signup-step card">
            <h3 style={{ fontSize: "0.95rem", margin: "0 0 0.4rem" }}>
              Where are you right now?
            </h3>
            <p className="section-subtitle" style={{ marginTop: 0 }}>
              This helps us understand how to support you best.
            </p>
            <PillToggleRow
              options={[
                { value: "using", label: "Actively using" },
                { value: "trying", label: "Trying to stop" },
                { value: "early", label: "Early recovery (0–90 days)" },
                { value: "sustained", label: "Sustained recovery" },
                { value: "supporter", label: "Supporter / family member" },
                { value: "exploring", label: "Just exploring resources" },
              ]}
              values={journeyValues}
              onToggle={toggleGeneric(setJourneyValues)}
            />
            <div className="signup-actions">
              <button
                className="btn-secondary"
                type="button"
                onClick={goBack}
              >
                Back
              </button>
              <button
                className="btn-primary"
                type="button"
                onClick={goNext}
              >
                Continue
              </button>
            </div>
          </div>
        );

      // STEP 3: Support types (controls which steps show)
      case "support":
        return (
          <div className="signup-step card">
            <h3 style={{ fontSize: "0.95rem", margin: "0 0 0.4rem" }}>
              What support are you looking for?
            </h3>
            <p className="section-subtitle" style={{ marginTop: 0 }}>
              Choose all that may be helpful. We’ll use this to customize your
              experience.
            </p>
            <div className="checkbox-list">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={supportSelections.includes("treatment")}
                  onChange={() => toggleSupportSelection("treatment")}
                />
                <span>Treatment options (detox, inpatient, outpatient)</span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={supportSelections.includes("meetings")}
                  onChange={() => toggleSupportSelection("meetings")}
                />
                <span>Meetings (AA, NA, SMART, etc.)</span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={supportSelections.includes("therapist")}
                  onChange={() => toggleSupportSelection("therapist")}
                />
                <span>Therapists / counselors</span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={supportSelections.includes("sober-living")}
                  onChange={() => toggleSupportSelection("sober-living")}
                />
                <span>Sober living</span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={supportSelections.includes("peer")}
                  onChange={() => toggleSupportSelection("peer")}
                />
                <span>Peer circles &amp; groups</span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={supportSelections.includes("mat")}
                  onChange={() => toggleSupportSelection("mat")}
                />
                <span>Medication-assisted treatment (MAT)</span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={supportSelections.includes("resources")}
                  onChange={() => toggleSupportSelection("resources")}
                />
                <span>Life resources (housing, food, employment, etc.)</span>
              </label>
            </div>
            <div className="signup-actions">
              <button
                className="btn-secondary"
                type="button"
                onClick={goBack}
              >
                Back
              </button>
              <button
                className="btn-primary"
                type="button"
                onClick={goNext}
              >
                Continue
              </button>
            </div>
          </div>
        );

      // STEP 4: Clinical / recovery profile
      case "clinical":
        return (
          <div className="signup-step card">
            <h3 style={{ fontSize: "0.95rem", margin: "0 0 0.4rem" }}>
              Your recovery profile
            </h3>
            <p className="section-subtitle" style={{ marginTop: 0 }}>
              This helps match you with the right kind of care and support.
            </p>
            <div className="form-field">
              <label className="form-label">Primary substance(s)</label>
              <input
                className="input"
                type="text"
                placeholder="Alcohol, opioids, meth, cocaine, etc."
              />
            </div>
            <div className="form-field">
              <label className="form-label">
                Mental health concerns (optional)
              </label>
              <input
                className="input"
                type="text"
                placeholder="Depression, anxiety, PTSD, unsure, etc."
              />
            </div>
            <div className="form-field">
              <label className="form-label">Program style preference</label>
              <PillToggleRow
                options={[
                  { value: "faith", label: "Faith-based" },
                  { value: "non-faith", label: "Non-faith-based" },
                  { value: "12step", label: "12-step" },
                  { value: "non-12step", label: "Non–12-step" },
                  { value: "no-pref", label: "No preference" },
                ]}
                values={programStyleValues}
                onToggle={toggleGeneric(setProgramStyleValues)}
              />
            </div>
            <div className="signup-actions">
              <button
                className="btn-secondary"
                type="button"
                onClick={goBack}
              >
                Back
              </button>
              <button
                className="btn-primary"
                type="button"
                onClick={goNext}
              >
                Continue
              </button>
            </div>
          </div>
        );

      // STEP 5: Treatment preferences (conditional)
      case "treatment":
        return (
          <div className="signup-step card">
            <h3 style={{ fontSize: "0.95rem", margin: "0 0 0.4rem" }}>
              Treatment preferences
            </h3>
            <p className="section-subtitle" style={{ marginTop: 0 }}>
              We’ll use this to suggest programs that fit your life and
              resources.
            </p>
            <div className="form-field">
              <label className="form-label">
                What type of treatment are you open to?
              </label>
              <div className="checkbox-list">
                <label className="checkbox-item">
                  <input type="checkbox" /> <span>Detox</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" />{" "}
                  <span>Inpatient / residential</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" />{" "}
                  <span>Outpatient (PHP/IOP/OP)</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" /> <span>Therapy only</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" /> <span>Not sure yet</span>
                </label>
              </div>
            </div>
            <div className="form-field">
              <label className="form-label">Insurance / payment</label>
              <PillToggleRow
                options={[
                  { value: "medicaid", label: "Medicaid" },
                  { value: "medicare", label: "Medicare" },
                  { value: "private", label: "Private insurance" },
                  { value: "selfpay", label: "Self-pay" },
                  { value: "unsure", label: "Unsure" },
                ]}
                values={insuranceValues}
                onToggle={toggleGeneric(setInsuranceValues)}
              />
            </div>
            <div className="form-field">
              <label className="form-label">How far can you travel?</label>
              <PillToggleRow
                options={[
                  { value: "local", label: "Local only" },
                  { value: "one-hour", label: "Within 1 hour" },
                  { value: "state", label: "Anywhere in my state" },
                  { value: "nopref", label: "No preference" },
                ]}
                values={travelValues}
                onToggle={toggleGeneric(setTravelValues)}
              />
            </div>
            <div className="signup-actions">
              <button
                className="btn-secondary"
                type="button"
                onClick={goBack}
              >
                Back
              </button>
              <button
                className="btn-primary"
                type="button"
                onClick={goNext}
              >
                Continue
              </button>
            </div>
          </div>
        );

      // STEP 6: Meetings & peer support (conditional)
      case "meetings":
        return (
          <div className="signup-step card">
            <h3 style={{ fontSize: "0.95rem", margin: "0 0 0.4rem" }}>
              Meetings & peer support
            </h3>
            <p className="section-subtitle" style={{ marginTop: 0 }}>
              We’ll prioritize meetings and circles that feel like a good fit.
            </p>
            <div className="form-field">
              <label className="form-label">Preferred meetings</label>
              <div className="checkbox-list">
                <label className="checkbox-item">
                  <input type="checkbox" /> <span>AA</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" /> <span>NA</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" /> <span>SMART Recovery</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" />{" "}
                  <span>Refuge / Dharma Recovery</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" />{" "}
                  <span>Secular or non-religious</span>
                </label>
              </div>
            </div>
            <div className="form-field">
              <label className="form-label">Format & timing</label>
              <PillToggleRow
                options={[
                  { value: "in-person", label: "In-person" },
                  { value: "online", label: "Online" },
                  { value: "morning", label: "Morning" },
                  { value: "evening", label: "Evening" },
                ]}
                values={meetingFormatValues}
                onToggle={toggleGeneric(setMeetingFormatValues)}
              />
            </div>
            <div className="signup-actions">
              <button
                className="btn-secondary"
                type="button"
                onClick={goBack}
              >
                Back
              </button>
              <button
                className="btn-primary"
                type="button"
                onClick={goNext}
              >
                Continue
              </button>
            </div>
          </div>
        );

      // STEP 7: Life resources
      case "life":
      default:
        return (
          <div className="signup-step card">
            <h3 style={{ fontSize: "0.95rem", margin: "0 0 0.4rem" }}>
              Life resources
            </h3>
            <p className="section-subtitle" style={{ marginTop: 0 }}>
              If you’d like, we can also surface practical supports around you.
            </p>
            <div className="checkbox-list">
              <label className="checkbox-item">
                <input type="checkbox" /> <span>Housing or shelter</span>
              </label>
              <label className="checkbox-item">
                <input type="checkbox" />{" "}
                <span>Employment or job support</span>
              </label>
              <label className="checkbox-item">
                <input type="checkbox" /> <span>Food or basic needs</span>
              </label>
              <label className="checkbox-item">
                <input type="checkbox" /> <span>Transportation</span>
              </label>
              <label className="checkbox-item">
                <input type="checkbox" /> <span>Legal support</span>
              </label>
              <label className="checkbox-item">
                <input type="checkbox" />{" "}
                <span>Childcare or family support</span>
              </label>
            </div>
            <div className="signup-actions">
              <button
                className="btn-secondary"
                type="button"
                onClick={goBack}
              >
                Back
              </button>
              <button
                className="btn-primary"
                type="button"
                onClick={goNext}
              >
                Finish signup
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div className="home-page">
        <div className="home-phone">
          {/* Header (same branding as other screens) */}
          <header className="home-phone__header">
            <div className="home-phone__brand">
              <p className="home-phone__eyebrow">NextCircle.org</p>
              <h1 className="home-phone__title">Circely</h1>
            </div>
          </header>

          <main style={{ paddingTop: "0.5rem" }}>
            {/* Progress bar and labels */}
            <div className="signup-progress">
              <span>
                Step{" "}
                <span id="signup-step-current">
                  {currentIndex >= 0 ? currentIndex + 1 : 1}
                </span>{" "}
                of{" "}
                <span id="signup-step-total">
                  {totalSteps}
                </span>
              </span>
              <div className="signup-progress-bar">
                <div
                  className="signup-progress-bar__inner"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <h2 className="section-title">
              Complete signup
              <span className="section-title__pill">Unlock full access</span>
            </h2>
            <p className="section-subtitle">
              Tell us a bit more so we can match you with the right treatment,
              meetings, therapists, and resources.
            </p>

            {renderStepContent()}
          </main>
        </div>
      </div>

      <BottomNav active="/verify/" />
      <SOSOverlay isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </>
  );
}

export default Verify;
export { Verify };
