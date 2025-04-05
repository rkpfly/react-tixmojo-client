import React from "react";
import PropTypes from "prop-types";

/**
 * SVG shape for the flyer with cutout design
 * This component creates a ticket-like shape with circular cutouts on the sides
 */
const FlyerShape = ({ className, uniqueId = "flyer", width, height }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 945 295.583"
    className={className}
    style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <clipPath id={`${uniqueId}ClipPath`}>
        {/* Ticket shape with cutouts on the sides */}
        <path d="M934.531 0L10.469 0C4.68713 0 0 4.68713 0 10.4691L0 108.168C20.6857 109.59 37.0238 126.786 37.0238 147.792C37.0238 168.797 20.6857 185.993 0 187.416L0 285.114C0 290.896 4.68713 295.583 10.469 295.583L934.531 295.583C940.313 295.583 945 290.896 945 285.114L945 187.511C923.021 187.509 905.203 169.727 905.203 147.792C905.203 125.856 923.021 108.074 945 108.073L945 10.4691C945 4.68713 940.313 0 934.531 0Z" />
      </clipPath>
    </defs>
  </svg>
);

FlyerShape.propTypes = {
  className: PropTypes.string,
  uniqueId: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Allow dynamic width
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Allow dynamic height
};

FlyerShape.defaultProps = {
  className: "",
  uniqueId: "flyer",
  width: "945", // Default width
  height: "295.583", // Default height
};

export default FlyerShape;
