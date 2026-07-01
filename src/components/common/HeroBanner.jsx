import React from "react";

/**
 * HeroBanner — purple gradient hero card matching the dashboard reference images.
 *
 * Props:
 *   title    {string}   — bold headline
 *   subtitle {string}   — secondary text below title
 *   pills    {Array}    — [{ icon: "🔴", label: "Live Data" }, ...]
 *   icon     {string}   — large decorative emoji shown on the right
 *   gradient {string}   — optional CSS gradient override
 */
const HeroBanner = ({
  title,
  subtitle,
  pills = [],
  icon = "🛡️",
  gradient = "linear-gradient(135deg, #7C3AED 0%, #6D28D9 40%, #4F46E5 100%)",
}) => (
  <div
    style={{
      background: gradient,
      borderRadius: "20px",
      padding: "28px 32px",
      marginBottom: "28px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "20px",
      overflow: "hidden",
      position: "relative",
      boxShadow: "0 8px 32px rgba(124,58,237,0.35)",
      animation: "heroBannerIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
    }}
  >
    {/* Decorative blobs */}
    <div style={{ position: "absolute", top: "-30px", right: "120px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
    <div style={{ position: "absolute", bottom: "-40px", right: "20px", width: "140px", height: "140px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

    {/* Left: text + pills */}
    <div style={{ flex: 1, zIndex: 1 }}>
      <h2 style={{ margin: "0 0 6px", fontSize: "clamp(20px, 3.5vw, 28px)", fontWeight: 900, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.3px" }}>
        {title}
      </h2>
      <p style={{ margin: "0 0 18px", fontSize: "14px", color: "rgba(255,255,255,0.82)", lineHeight: 1.5 }}>
        {subtitle}
      </p>

      {/* Pills row */}
      {pills.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {pills.map((pill) => (
            <div
              key={pill.label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "30px",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "default",
                transition: "background 0.2s",
                userSelect: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.22)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
            >
              <span>{pill.icon}</span> {pill.label}
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Right: decorative large icon */}
    <div
      style={{
        fontSize: "72px",
        opacity: 0.18,
        flexShrink: 0,
        lineHeight: 1,
        userSelect: "none",
        zIndex: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "heroIconFloat 3s ease-in-out infinite",
      }}
      aria-hidden
    >
      {icon}
    </div>

    <style>{`
      @keyframes heroBannerIn {
        from { opacity: 0; transform: translateY(-12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes heroIconFloat {
        0%, 100% { transform: translateY(0px);  }
        50%       { transform: translateY(-8px); }
      }
    `}</style>
  </div>
);

export default HeroBanner;
