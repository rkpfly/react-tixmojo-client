import { BiUser, BiCog, BiWallet, BiHelpCircle, BiLogOut } from "react-icons/bi";
import { HiChartPie } from "react-icons/hi";
import { PiListHeartBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import "../Style/sidebarAnimation.css";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const styles = {
  sidebar: {
    width: "280px", // Increased width for phone number display
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
    overflow: "hidden", // For image containment
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
  const { currentUser, isAuthenticated, logout } = useAuth();
  
  const handleClick = () => {
    toggleUserSidebar();
  };
  
  const handleLogout = () => {
    logout();
    toggleUserSidebar();
  };

  // Debug auth state whenever sidebar opens
  useEffect(() => {
    if (isUserSidebarOpen) {
      console.log("UserSidebar auth state:", { 
        isAuthenticated: isAuthenticated(),
        currentUser
      });
    }
  }, [isUserSidebarOpen, isAuthenticated, currentUser]);

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
  
  // User sidebar component

  return (
    <>
      <div style={styles.overlay} onClick={(e) => {
        e.preventDefault();
        handleClick();
      }}></div>
      <div style={styles.sidebar} id="userSidebar">
        {/* User profile section */}
        <div style={styles.profileHeader}>
          <div style={styles.profileAvatar}>
            {isAuthenticated() && (currentUser?.profilePicture || currentUser?.picture) ? (
              <img 
                src={currentUser.profilePicture || currentUser.picture} 
                alt={`${currentUser.firstName || 'User'}'s profile`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                onError={(e) => {
                  console.error("Failed to load sidebar profile image:", e);
                  e.target.onerror = null; 
                  e.target.style.display = "none";
                  e.target.parentNode.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                }}
              />
            ) : (
              <BiUser style={{ color: "white", fontSize: "26px" }} />
            )}
          </div>
          <div>
            <div style={styles.profileName}>
              {isAuthenticated() 
                ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`
                : 'Guest User'
              }
            </div>
            <div style={styles.profileEmail}>
              {isAuthenticated() ? currentUser.email : 'guest@example.com'}
            </div>
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
          {isAuthenticated() ? (
            <div 
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              style={{...styles.item, textDecoration: "none", color: "#e53935", cursor: "pointer"}}
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
            </div>
          ) : (
            <Link 
              to="/login" 
              style={{...styles.item, textDecoration: "none", color: "var(--primary)"}}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(111, 68, 255, 0.1)";
                e.currentTarget.style.transform = "translateX(5px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "";
                e.currentTarget.style.transform = "";
              }}
            >
              <BiUser style={{...styles.icon, color: "var(--primary)"}} /> Sign In
            </Link>
          )}
        </div>
      </div>
    </>
  );
}