import React from "react";
import { Link } from "react-router-dom";
import {
  IoLogoFacebook,
  IoLogoTwitter,
  IoLogoInstagram,
} from "react-icons/io5";
import { FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { useTranslation } from "react-i18next";

// Map of icon names to actual icon components
const iconMap = {
  IoLogoFacebook: <IoLogoFacebook />,
  IoLogoTwitter: <IoLogoTwitter />,
  IoLogoInstagram: <IoLogoInstagram />,
  FaLinkedinIn: <FaLinkedinIn />,
  FaYoutube: <FaYoutube />,
  FiMail: <FiMail />,
  FiPhone: <FiPhone />,
  FiMapPin: <FiMapPin />,
};

function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  // Get footer data from translation
  const socialNetworks = t("footer.social.networks", { returnObjects: true });
  const categories = t("footer.categories.list", { returnObjects: true });

  // Contact information
  const contactInfo = [
    {
      icon: "FiMapPin",
      text: t("footer.contact.address"),
    },
    {
      icon: "FiPhone",
      text: t("footer.contact.redirects.one"),
    },
    {
      icon: "FiMail",
      text: t("footer.contact.redirects.two"),
    },
  ];

  // Quick links
  const quickLinks = [
    "footer.information.redirects.one",
    "footer.information.redirects.two",
    "footer.information.redirects.three",
    "footer.links.redirects.one",
    "footer.links.redirects.two",
    "footer.links.redirects.three",
    "footer.otherLinks.contactUs",
  ];

  return (
    <footer
      style={{
        backgroundColor: "var(--dark)",
        color: "var(--light)",
        padding: "60px 0 30px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "40px",
            marginBottom: "50px",
          }}
        >
          {/* Company Name and About Us */}
          <div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "800",
                fontFamily: "var(--font-primary)",
                color: "white",
                marginBottom: "20px",
              }}
            >
              TIXMOJO
            </h2>

            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "var(--gray-light)",
                marginBottom: "20px",
              }}
            >
              {t("footer.about")}
            </p>

            <div
              style={{
                display: "flex",
                gap: "15px",
              }}
            >
              {socialNetworks.map((social, index) => (
                <Link
                  key={index}
                  to="/page-not-found"
                  aria-label={social.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "var(--gray-dark)",
                    color: "var(--gray-light)",
                    fontSize: "18px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--primary)";
                    e.currentTarget.style.color = "var(--light)";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--gray-dark)";
                    e.currentTarget.style.color = "var(--gray-light)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {iconMap[social.icon]}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                marginBottom: "20px",
                color: "white",
              }}
            >
              {t("footer.otherLinks.title")}
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {quickLinks.map((link, index) => (
                <li key={index} style={{ marginBottom: "12px" }}>
                  <Link
                    to="/page-not-found"
                    style={{
                      color: "var(--gray-light)",
                      textDecoration: "none",
                      fontSize: "14px",
                      display: "inline-block",
                      position: "relative",
                      paddingLeft: "15px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--primary-light)";
                      e.currentTarget.style.paddingLeft = "20px";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--gray-light)";
                      e.currentTarget.style.paddingLeft = "15px";
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: "0",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "var(--primary)",
                      }}
                    ></span>
                    {t(link)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Event Categories */}
          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                marginBottom: "20px",
                color: "white",
              }}
            >
              {t("footer.categories.title")}
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              {categories.map((category, index) => (
                <li key={index}>
                  <Link
                    to="/page-not-found"
                    style={{
                      color: "var(--gray-light)",
                      textDecoration: "none",
                      fontSize: "14px",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--primary-light)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--gray-light)";
                    }}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                marginBottom: "20px",
                color: "white",
              }}
            >
              {t("footer.contact.title")}
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {contactInfo.map((contact, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: "15px",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      color: "var(--primary)",
                      fontSize: "18px",
                      marginTop: "2px",
                    }}
                  >
                    {iconMap[contact.icon]}
                  </span>
                  <Link
                    to="/page-not-found"
                    style={{
                      color: "var(--gray-light)",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--primary-light)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--gray-light)";
                    }}
                  >
                    {contact.text}
                  </Link>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: "20px" }}>
              <h4
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  marginBottom: "15px",
                  color: "white",
                }}
              >
                {t("footer.newsletter.title")}
              </h4>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <input
                  type="email"
                  placeholder={t("footer.newsletter.placeholder")}
                  style={{
                    flex: 1,
                    padding: "10px 15px",
                    borderRadius: "50px",
                    border: "1px solid var(--gray-dark)",
                    backgroundColor: "var(--gray-dark)",
                    color: "white",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
                <button
                  className="btn btn-primary"
                  style={{
                    margin: 0,
                    height: "40px",
                    padding: "0 20px",
                  }}
                >
                  {t("footer.newsletter.button")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div
          style={{
            borderTop: "1px solid var(--gray-dark)",
            paddingTop: "20px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              color: "var(--gray-light)",
              fontSize: "14px",
            }}
          >
            {t("footer.copyright")}
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
            }}
          >
            {[
              "footer.tnc.privacy",
              "footer.tnc.refund",
              "footer.tnc.terms",
            ].map((item, index) => (
              <Link
                key={index}
                to="/page-not-found"
                style={{
                  color: "var(--gray-light)",
                  textDecoration: "none",
                  fontSize: "14px",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--primary-light)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--gray-light)";
                }}
              >
                {t(item)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
