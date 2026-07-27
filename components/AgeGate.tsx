"use client";

export function AgeGate() {
  function enterSite() {
    try {
      sessionStorage.setItem("hle_age_verified", "true");
    } catch {
      // sessionStorage unavailable — fall back to in-memory class toggle only
    }
    document.body.classList.add("age-verified");
  }

  return (
    <div id="age-gate">
      <div className="age-card">
        <div className="age-logo" style={{ textAlign: "center" }}>
          <img
            src="/assets/logo.png"
            alt="High Life Express"
            style={{ height: 160, width: "auto", display: "block", margin: "0 auto 1.5rem" }}
          />
        </div>
        <div className="age-warn-badge">
          <span>Warning!</span>
        </div>
        <h2>Adults Only (19+)</h2>
        <p>
          This website is strictly intended for individuals who are 19 years of age or older and
          physically located in Ontario, Canada. By proceeding further, you certify that you meet
          the minimum age requirement and acknowledge that the content and products offered on
          this site are exclusively for adult consumption.
        </p>
        <div className="age-btns">
          <button className="btn-yes" onClick={enterSite}>
            YES, I&apos;M 19+
          </button>
          <button className="btn-no" onClick={() => (window.location.href = "https://google.com")}>
            I AM UNDER 19
          </button>
        </div>
      </div>
    </div>
  );
}
