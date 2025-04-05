import { BiUser, BiCog, BiWallet, BiHelpCircle, BiLogOut } from "react-icons/bi";
import { HiChartPie } from "react-icons/hi";
import { PiListHeartBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import "../Style/sidebarAnimation.css";
import { useEffect } from "react";

const styles = {
  sidebar: {
    width: "250px",
    height: "auto",
    maxHeight: "90vh",
    backgroundColor: "var(--purple-50)",
    padding: "1.2rem",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    right: "0",
    top: "calc(70px - 5px)",
    zIndex: "999",
    fontFamily: "'Inter', sans-serif",
    borderRadius: "13px",
    border: "1px solid var(--purple-100)",
    boxShadow: "0px 4px 12px 0px rgba(111, 68, 255, 0.15)",
    background: "var(--light)",
    overflow: "auto",
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
    fontSize: "14px",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    margin: "4px 0",
    fontWeight: "500",
    letterSpacing: "-0.01em",
  },
  icon: {
    marginRight: "12px",
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
    margin: "8px 0",
  },
  overlay: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(22, 22, 43, 0.5)",
    zIndex: "998",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0.5rem 0.5rem 1rem 0.5rem",
    borderBottom: "1px solid var(--purple-100)",
    marginBottom: "1rem",
  },
  profileAvatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "var(--purple-300)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "15px",
  },
  profileName: {
    fontWeight: "700",
    fontSize: "15px",
    color: "var(--dark)",
    marginBottom: "4px",
    letterSpacing: "-0.01em",
  },
  profileEmail: {
    fontSize: "13px",
    color: "var(--gray-light)",
    letterSpacing: "-0.01em",
  },
  editProfile: {
    fontSize: "13px",
    color: "var(--primary)",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    marginTop: "4px",
  },
  sectionTitle: {
    fontSize: "12px",
    color: "var(--gray-medium)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
    padding: "0 15px",
    marginTop: "15px",
    marginBottom: "8px",
  }
};

export function UserSidebar({ toggleUserSidebar, isUserSidebarOpen }) {
  const handleClick = () => {
    toggleUserSidebar();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        toggleUserSidebar();
      }
    };

    if (isUserSidebarOpen) {
      const sidebar = document.getElementById("userSidebar");
      sidebar.classList.add("slide-in");
      sidebar.classList.remove("slide-out");
      document.addEventListener("keydown", handleKeyDown);
    } else {
      const sidebar = document.getElementById("userSidebar");
      if (sidebar) {
        sidebar.classList.remove("slide-in");
        sidebar.classList.add("slide-out");
      }
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isUserSidebarOpen, toggleUserSidebar]);

  return (
    <>
      <div style={styles.overlay} onClick={handleClick}></div>
      <div style={styles.sidebar} id="userSidebar">
        {/* User profile section */}
        <div style={styles.profileHeader}>
          <div style={styles.profileAvatar}>
            <BiUser style={{ color: "white", fontSize: "26px" }} />
          </div>
          <div>
            <div style={styles.profileName}>Guest User</div>
            <div style={styles.profileEmail}>guest@example.com</div>
            <Link 
              to="/page-not-found"
              style={styles.editProfile}
            >
              Edit Profile
            </Link>
          </div>
        </div>
        
        {/* Main sections */}
        <div style={styles.sectionTitle}>Account</div>
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
            <HiChartPie style={styles.icon} /> Dashboard
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
            <BiWallet style={styles.icon} /> Payments
          </Link>
        </div>
        
        <div style={styles.sectionTitle}>Settings</div>
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
            <BiCog style={styles.icon} /> Account Settings
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
            <BiHelpCircle style={styles.icon} /> Help Center
          </Link>
        </div>
        
        <div style={styles.divider}></div>
        
        <div style={styles.itemGroup}>
          <Link 
            to="/page-not-found" 
            style={{...styles.item, textDecoration: "none", color: "#e53935"}}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(229, 57, 53, 0.1)";
              e.currentTarget.style.transform = "translateX(5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "";
              e.currentTarget.style.transform = "";
            }}
          >
            <BiLogOut style={{...styles.icon, color: "#e53935"}} /> Sign Out
          </Link>
        </div>
      </div>
    </>
  );
}