import React, { useRef, useState, useEffect } from "react";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import { BiUser } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import "../i18n";
import Hamburger from "./Hamburger";
import LoginButton from "./Auth/LoginButton";
import { useAuth } from "../context/AuthContext";

function Navbar({
  toggleScrollPage,
  isSidebarOpen,
  toggleUserSidebar,
  isUserSidebarOpen,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const inputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  // Debug user profile data
  useEffect(() => {
    if (isAuthenticated() && currentUser) {
      console.log("Navbar user profile data:", {
        hasProfilePicture: Boolean(currentUser.profilePicture),
        hasPicture: Boolean(currentUser.picture),
        profilePictureUrl: currentUser.profilePicture || currentUser.picture || 'None',
        name: `${currentUser.firstName || ''} ${currentUser.lastName || ''}`
      });
    }
  }, [currentUser, isAuthenticated]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Add click outside listener to collapse search bar when clicking elsewhere
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchClick = () => {
    setSearchFocused(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleUserClick = (e) => {
    if (e) e.preventDefault();
    
    if (toggleUserSidebar) {
      toggleUserSidebar();
    } else {
      navigate("/page-not-found");
    }
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100vw",
        height: "60px",
        left: "0",
        top: "0",
        background: scrolled ? "rgba(255, 255, 255, 0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        boxShadow: "0 4px 20px rgba(111, 68, 255, 0.1)",
        transition: "all 0.3s ease",
        position: "fixed",
        zIndex: 100,
        padding: "0 32px",
      }}
    >
      {/* Logo on the left */}
      <div
        className="nav-left"
        style={{ display: "flex", alignItems: "center" }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <h2
            style={{
              fontWeight: "800",
              color: "var(--primary)",
              fontSize: isMobile ? "20px" : "26px",
              fontFamily: "var(--font-primary)",
              letterSpacing: "-0.5px",
              userSelect: "none",
              cursor: "pointer",
            }}
          >
            TIXMOJO
          </h2>
        </Link>
      </div>

      {/* Right section with search, user icon, and hamburger */}
      <div
        className="nav-right"
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? (searchFocused ? "8px" : "12px") : "20px",
          transition: "all 0.3s ease",
        }}
      >
        {/* Search bar */}
        <div
          className="search-bar"
          onClick={handleSearchClick}
          ref={inputRef}
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: searchFocused
              ? "rgba(111, 68, 255, 0.12)"
              : "rgba(111, 68, 255, 0.08)",
            borderRadius: "50px",
            padding: isMobile ? "8px 12px" : "10px 16px",
            width: isMobile
              ? searchFocused
                ? "180px"
                : "40px"
              : searchFocused
                ? "320px"
                : "240px",
            transition: "all 0.3s cubic-bezier(0.19, 1, 0.22, 1)",
            cursor: "pointer",
            boxShadow: searchFocused
              ? "0 4px 12px rgba(111, 68, 255, 0.15)"
              : "none",
            border: searchFocused
              ? "1px solid rgba(111, 68, 255, 0.3)"
              : "1px solid transparent",
          }}
        >
          <IoIosSearch
            style={{
              color: "var(--primary)",
              fontSize: searchFocused ? "22px" : "20px",
              marginRight: isMobile && !searchFocused ? "0" : "8px",
              transition: "all 0.3s ease",
            }}
          />

          {(!isMobile || searchFocused) && (
            <input
              type="text"
              placeholder={t("navbar.search")}
              onFocus={() => setSearchFocused(true)}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: "14px",
                width: "100%",
                color: "var(--dark)",
                transition: "all 0.3s ease",
              }}
            />
          )}

          {/* Close button when search is focused */}
          {searchFocused && (
            <IoMdClose
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the search bar click
                setSearchFocused(false);
              }}
              style={{
                color: "var(--neutral-600)",
                fontSize: "18px",
                cursor: "pointer",
                marginLeft: "8px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--primary)";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--neutral-600)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          )}
        </div>

        {/* Login button or user profile */}
        {!(isMobile && searchFocused) && (
          <div style={{
            display: "flex",
            alignItems: "center",
            opacity: searchFocused && !isMobile ? "0.7" : "1",
            transition: "opacity 0.3s ease",
          }}>
            {isAuthenticated() ? (
              <div
                onClick={(e) => handleUserClick(e)}
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  backgroundColor: "var(--purple-100)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 2px 6px rgba(111, 68, 255, 0.15)",
                  border: currentUser?.profilePicture ? "2px solid var(--purple-200)" : "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 3px 8px rgba(111, 68, 255, 0.3)";
                  // Log auth status on hover for debugging
                  console.log("Auth Status (Navbar):", {
                    isAuthenticated: isAuthenticated(),
                    currentUser
                  });
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 2px 6px rgba(111, 68, 255, 0.15)";
                }}
              >
                {/* Active indicator dot */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    right: "2px",
                    width: "10px",
                    height: "10px",
                    backgroundColor: "#44cc77",
                    borderRadius: "50%",
                    border: "2px solid white",
                    zIndex: 2,
                  }}
                />
                {currentUser?.profilePicture || currentUser?.picture ? (
                  <img
                    src={currentUser.profilePicture || currentUser.picture}
                    alt={`${currentUser.firstName || 'User'}'s profile`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%", /* Ensure image is round */
                    }}
                    onError={(e) => {
                      console.error("Failed to load profile image:", e);
                      e.target.onerror = null; 
                      e.target.style.display = "none";
                      e.target.parentNode.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary);"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                    }}
                  />
                ) : (
                  <BiUser style={{ color: "var(--primary)", fontSize: "22px" }} />
                )}
              </div>
            ) : (
              <LoginButton />
            )}
          </div>
        )}

        {/* Hamburger menu - hide on mobile when search is focused */}
        {!(isMobile && searchFocused) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: searchFocused && !isMobile ? "0.7" : "1",
              transition: "opacity 0.3s ease",
            }}
          >
            <Hamburger
              onToggle={toggleScrollPage}
              isSidebarOpen={isSidebarOpen}
            />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
