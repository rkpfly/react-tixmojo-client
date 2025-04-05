import React from "react";
import { useTranslation } from "react-i18next";
import { MdLocalActivity } from "react-icons/md";
import "../i18n";

function Logo({ isMobile }) {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "36px",
          height: "36px",
          backgroundColor: "var(--primary)",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(107, 56, 251, 0.2)",
        }}
      >
        <MdLocalActivity
          style={{
            fontSize: "22px",
            color: "white",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          lineHeight: 1,
        }}
      >
        <span
          style={{
            fontSize: isMobile ? "18px" : "22px",
            fontWeight: "800",
            fontFamily: "var(--font-primary)",
            color: "var(--primary)",
            letterSpacing: "-0.5px",
          }}
        >
          TIX
          <span
            style={{
              color: "var(--dark)",
            }}
          >
            MOJO
          </span>
        </span>
        <span
          style={{
            fontSize: "10px",
            fontWeight: "500",
            color: "var(--gray-light)",
            letterSpacing: "1px",
            marginTop: "2px",
            display: isMobile ? "none" : "block",
          }}
        >
          EVENT TICKETS
        </span>
      </div>
    </div>
  );
}

export default Logo;
