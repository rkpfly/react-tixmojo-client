import { BiBuoy, BiUser } from "react-icons/bi";
import { HiArrowSmRight, HiChartPie } from "react-icons/hi";
import { PiListHeartBold } from "react-icons/pi";
import { HiOutlineInformationCircle, HiOutlinePhone } from "react-icons/hi";
import { Link } from "react-router-dom";
import "../Style/sidebarAnimation.css";
import { useEffect } from "react";

const styles = {
  sidebar: {
    width: "250px",
    height: "70vh",
    backgroundColor: "var(--purple-50)",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    right: "0",
    top: "calc(90px - 10px)",
    zIndex: "1000",
    fontFamily: "'Inter', sans-serif",
    borderRadius: "13px",
    border: "1px solid var(--purple-100)",
    boxShadow: "0px 4px 4px 0px rgba(111, 68, 255, 0.1)",
    background: "var(--light)",
  },
  itemGroup: {
    marginBottom: "20px",
  },
  item: {
    display: "flex",
    alignItems: "center",
    padding: "12px 15px",
    textDecoration: "none",
    color: "var(--neutral-800)",
    fontSize: "15px",
    fontWeight: "500",
    letterSpacing: "-0.01em",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    margin: "4px 0",
  },
  icon: {
    marginRight: "10px",
    fontSize: "20px",
  },
  itemHover: {
    background: "var(--purple-100)",
    color: "var(--primary)",
    transform: "translateX(5px)",
  },
  divider: {
    width: "100%",
    height: "1px",
    backgroundColor: "var(--purple-100)",
  },
  overlay: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(22, 22, 43, 0.5)",
    zIndex: "999",
  },
};

export function SidebarScroll({ toggleScrollPage, isSidebarOpen }) {
  const handleClick = () => {
    toggleScrollPage();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        toggleScrollPage();
      }
    };

    if (isSidebarOpen) {
      const sidebar = document.getElementById("sidebar");
      sidebar.classList.add("slide-in");
      sidebar.classList.remove("slide-out");
      document.addEventListener("keydown", handleKeyDown);
    } else {
      const sidebar = document.getElementById("sidebar");
      sidebar.classList.remove("slide-in");
      sidebar.classList.add("slide-out");
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSidebarOpen, toggleScrollPage]);

  return (
    <>
      <div style={styles.overlay} onClick={handleClick}></div>
      <div style={styles.sidebar} id="sidebar">
        {/* User profile section */}
        <div style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          padding: "10px",
        }}>
          <div style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            backgroundColor: "var(--purple-300)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "15px",
          }}>
            <BiUser style={{ color: "white", fontSize: "26px" }} />
          </div>
          <div>
            <div style={{
              fontWeight: "700",
              fontSize: "15px",
              color: "var(--dark)",
              letterSpacing: "-0.01em",
            }}>Guest User</div>
            <div style={{
              fontSize: "13px",
              color: "var(--gray-light)",
              letterSpacing: "-0.01em",
            }}>Not signed in</div>
          </div>
        </div>
        <span style={styles.divider}></span>
        
        {/* Account actions */}
        <div style={styles.itemGroup}>
          <Link 
            to="/page-not-found" 
            style={{...styles.item, textDecoration: "none"}}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.itemHover);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "";
              e.currentTarget.style.color = "var(--neutral-800)";
              e.currentTarget.style.transform = "";
            }}
          >
            <HiArrowSmRight style={styles.icon} /> Sign In
          </Link>
          <Link 
            to="/page-not-found" 
            style={{...styles.item, textDecoration: "none"}}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.itemHover);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "";
              e.currentTarget.style.color = "var(--neutral-800)";
              e.currentTarget.style.transform = "";
            }}
          >
            <HiChartPie style={styles.icon} /> My Dashboard
          </Link>
          <Link 
            to="/page-not-found" 
            style={{...styles.item, textDecoration: "none"}}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.itemHover);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "";
              e.currentTarget.style.color = "var(--neutral-800)";
              e.currentTarget.style.transform = "";
            }}
          >
            <PiListHeartBold style={styles.icon} /> My Tickets
          </Link>
        </div>
        <span style={styles.divider}></span>
        
        {/* Help & Support */}
        <div style={styles.itemGroup}>
          <Link 
            to="/page-not-found" 
            style={{...styles.item, textDecoration: "none"}}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.itemHover);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "";
              e.currentTarget.style.color = "var(--neutral-800)";
              e.currentTarget.style.transform = "";
            }}
          >
            <HiOutlineInformationCircle style={styles.icon} /> About Us
          </Link>
          <Link 
            to="/page-not-found" 
            style={{...styles.item, textDecoration: "none"}}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.itemHover);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "";
              e.currentTarget.style.color = "var(--neutral-800)";
              e.currentTarget.style.transform = "";
            }}
          >
            <HiOutlinePhone style={styles.icon} /> Contact Support
          </Link>
          <Link 
            to="/page-not-found" 
            style={{...styles.item, textDecoration: "none"}}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.itemHover);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "";
              e.currentTarget.style.color = "var(--neutral-800)";
              e.currentTarget.style.transform = "";
            }}
          >
            <BiBuoy style={styles.icon} /> Help Center
          </Link>
        </div>
      </div>
    </>
  );
}