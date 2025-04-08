import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdNavigateBefore } from "react-icons/md"; // Importing the left arrow icon
import { MdNavigateNext } from "react-icons/md"; // Importing the right arrow icon
import { useNavigate } from "react-router-dom";
import { getFlyers } from "../../services/api.js";
import PropTypes from "prop-types";
import Loader from "../Loader.jsx";

// Custom Previous Button
const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: "absolute",
      left: "-22px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "var(--light)",
      border: "none",
      borderRadius: "50%",
      boxShadow: "0 4px 8px rgba(111, 68, 255, 0.15)",
      width: "40px",
      height: "40px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      zIndex: 10, // Ensure it's above the image
    }}
  >
    <MdNavigateBefore style={{ zIndex: 2 }} />
    <span
      style={{
        content: '""',
        position: "absolute",
        width: "44px",
        height: "44px",
        backgroundColor: "var(--purple-200)",
        borderRadius: "50%",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1, // Place it behind the icon
      }}
    />
    <span
      style={{
        content: '""',
        position: "absolute",
        width: "70px",
        height: "70px",
        backgroundColor: "var(--surface)",
        borderRadius: "50%",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 0, // Place it behind the icon
      }}
    />
  </button>
);

// Custom Next Button
const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: "absolute",
      right: "-22px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "var(--surface)",
      border: "none",
      borderRadius: "50%",
      boxShadow: "0 4px 8px rgba(111, 68, 255, 0.15)",
      width: "40px",
      height: "40px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      zIndex: 10, // Ensure it's above the image
    }}
  >
    <MdNavigateNext style={{ zIndex: 2 }} />
    <span
      style={{
        content: '""',
        position: "absolute",
        width: "44px",
        height: "44px",
        backgroundColor: "var(--purple-200)",
        borderRadius: "50%",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1, // Place it behind the icon
      }}
    />
    <span
      style={{
        content: '""',
        position: "absolute",
        width: "70px",
        height: "70px",
        backgroundColor: "var(--surface)",
        borderRadius: "50%",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 0, // Place it behind the icon
      }}
    />
  </button>
);

function FlyerCarousel({ flyers: propFlyers }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [flyers, setFlyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Use provided flyers or fetch them if not provided
  useEffect(() => {
    // If flyers are provided via props, use them directly
    if (propFlyers && propFlyers.length > 0) {
      setFlyers(propFlyers);
      setLoading(false);
      return;
    }
    
    // Otherwise fetch flyers from API (backward compatibility)
    const fetchFlyers = async () => {
      try {
        setLoading(true);
        const data = await getFlyers();
        setFlyers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching flyers:", error);
        setLoading(false);
        // Fallback to default flyers if API fails
        setFlyers([
          {
            id: "love-is-blind",
            image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2940&auto=format&fit=crop",
            title: "Love is Blind",
            eventId: "love-is-blind"
          }
        ]);
      }
    };
    
    fetchFlyers();
  }, []);
  
  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Infinite scrolling
    speed: 500, // Transition speed
    slidesToShow: 1, // Number of slides to show
    slidesToScroll: 1, // Number of slides to scroll
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Autoplay interval
    arrows: false, // Enable custom arrows
    prevArrow: <CustomPrevArrow />, // Custom previous button
    nextArrow: <CustomNextArrow />, // Custom next button
  };

  return (
    <div
      style={{
        width: "100%", // Fit to width
        maxWidth: "1260px", // Increased size while maintaining the aspect ratio
        margin: "0 auto",
        marginTop: "55px", // Add top margin to account for navbar height
        marginBottom: "0px !important", // Add top margin to account for navbar height
        padding: "20px",
      }}
    >
      {loading ? (
        // Loading placeholder with correct dimensions
        <div style={{
          width: "100%",
          height: windowWidth <= 768 ? "200px" : "400px",
          backgroundColor: "var(--neutral-200)",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Loader size={windowWidth <= 768 ? "medium" : "large"} />
        </div>
      ) : (
        <Slider {...settings}>
          {flyers.map((flyer) => (
            <div key={flyer.id}>
              <img
                className="flyerimage"
                onClick={() => navigate(`/events/${flyer.id}`)}
                src={flyer.image}
                alt={flyer.title || `Event ${flyer.id}`}
                style={{
                  width: "100%", // Fit the width of the container
                  height: "auto", // Maintain aspect ratio
                  aspectRatio: windowWidth <= 768 ? "3/2" : "1000 / 400", // Enforce the aspect ratio
                  borderRadius: "10px",
                  transition: "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)", // Add cubic-bezier animation
                  boxShadow: "0 4px 8px rgba(111, 68, 255, 0.15)",
                }}
              />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}

// Define prop types
FlyerCarousel.propTypes = {
  flyers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired, 
      location: PropTypes.string,
      date: PropTypes.string,
      ticketLink: PropTypes.string,
      ticketSite: PropTypes.string
    })
  )
};

// Default props
FlyerCarousel.defaultProps = {
  flyers: [] // Empty array as default
};

export default FlyerCarousel;
