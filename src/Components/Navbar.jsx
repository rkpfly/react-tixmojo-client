import React, { useRef, useState, useEffect } from "react";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import { BiUser } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import "../i18n";
import Hamburger from "./Hamburger";

function Navbar({
  toggleScrollPage,
  isSidebarOpen,
  toggleUserSidebar,
  isUserSidebarOpen,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

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

  const handleUserClick = () => {
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

        {/* User icon - hide on mobile when search is focused */}
        {!(isMobile && searchFocused) && (
          <div
            onClick={handleUserClick}
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
              opacity: searchFocused && !isMobile ? "0.7" : "1",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--purple-200)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--purple-100)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <BiUser style={{ color: "var(--primary)", fontSize: "22px" }} />
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
