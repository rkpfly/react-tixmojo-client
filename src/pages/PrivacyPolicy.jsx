import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollAnimation } from '../utils/ScrollAnimation.jsx';
import { FiChevronRight } from 'react-icons/fi';

const PrivacyPolicy = () => {
  // Get current year for dates
  const currentYear = new Date().getFullYear();
  
  return (
    <div style={{
      padding: '40px 20px 80px',
      maxWidth: '1000px',
      margin: '40px auto',
    }}>
      {/* Breadcrumb */}
      <ScrollAnimation direction="down" delay={0.1}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          marginBottom: '40px',
          color: 'var(--neutral-600)',
          fontSize: '14px',
        }}>
          <Link to="/" style={{ color: 'var(--purple-600)', textDecoration: 'none' }}>Home</Link>
          <FiChevronRight size={14} />
          <span>Privacy Policy</span>
        </div>
      </ScrollAnimation>

      <ScrollAnimation direction="up" delay={0.2}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          marginBottom: '30px',
          color: 'var(--neutral-900)',
          textAlign: 'center',
        }}>
          Privacy Policy
        </h1>
      
        <div style={{
          backgroundColor: 'var(--neutral-50)',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '40px',
          border: '1px solid var(--neutral-200)',
        }}>
          <p style={{ 
            marginBottom: '10px',
            color: 'var(--neutral-700)',
            lineHeight: '1.7',
          }}>
            <strong>Last Updated:</strong> November 28, {currentYear}
          </p>
          <p style={{ 
            color: 'var(--neutral-700)',
            lineHeight: '1.7',
          }}>
            Our portal is committed to protecting your privacy that gives you the most powerful and safe online experience. This Statement of Privacy applies to our Portal Web site and governs data collection and usage. By using our portal website, you consent to the data practices described in this statement.
          </p>
        </div>
      </ScrollAnimation>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
      }}>
        <ScrollAnimation direction="up" delay={0.3}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '15px',
              color: 'var(--purple-800)',
            }}>1. Collection of Your Personal Information</h2>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
              marginBottom: '15px',
            }}>
              TixMojo collects personally identifiable information, such as your:
            </p>
            <ul style={{
              listStyle: 'disc',
              paddingLeft: '25px',
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
              marginBottom: '15px',
            }}>
              <li>Email address</li>
              <li>Name</li>
              <li>Home or work address</li>
              <li>Telephone number</li>
              <li>When using Google login, your Google profile information</li>
            </ul>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
              marginBottom: '15px',
            }}>
              TixMojo also collects anonymous demographic information, which is not unique to you, such as your:
            </p>
            <ul style={{
              listStyle: 'disc',
              paddingLeft: '25px',
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
              marginBottom: '15px',
            }}>
              <li>ZIP code</li>
              <li>Age</li>
              <li>Gender</li>
              <li>Preferences</li>
              <li>Interests</li>
              <li>Favorites</li>
            </ul>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
            }}>
              There is also information about your computer hardware and software that is automatically collected by TixMojo. This information can include: your IP address, browser type, domain names, access times and referring Web site addresses. This information is used by TixMojo for the operation of the service, to maintain quality of the service, and to provide general statistics regarding use of the TixMojo website.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.4}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '15px',
              color: 'var(--purple-800)',
            }}>2. Google Authentication and People API</h2>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
              marginBottom: '15px',
            }}>
              TixMojo offers the option to log in using your Google account for a more convenient user experience. When you choose to sign in with Google:
            </p>
            <ul style={{
              listStyle: 'disc',
              paddingLeft: '25px',
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
              marginBottom: '15px',
            }}>
              <li>We request access to your basic profile information (name, email, profile picture) to create and manage your TixMojo account.</li>
              <li>With your permission, we may access your phone number through Google People API to streamline the ticket purchase process by pre-filling your contact information.</li>
              <li>Your Google account information is handled according to both our Privacy Policy and Google's Privacy Policy.</li>
              <li>We only request the minimum necessary permissions required to provide our services.</li>
              <li>You can revoke TixMojo's access to your Google account at any time through your Google Account settings.</li>
              <li>We never share your Google account information with third parties without your explicit consent, except as required by law.</li>
            </ul>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
            }}>
              For more information about how Google handles your data, please review <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--purple-600)', textDecoration: 'none' }}>Google's Privacy Policy</a>.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.5}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '15px',
              color: 'var(--purple-800)',
            }}>3. Use of Your Personal Information</h2>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
              marginBottom: '15px',
            }}>
              TixMojo collects and uses your personal information to:
            </p>
            <ul style={{
              listStyle: 'disc',
              paddingLeft: '25px',
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
            }}>
              <li>Operate the TixMojo website and deliver the services you have requested</li>
              <li>Streamline the ticket purchasing process by pre-filling your contact information</li>
              <li>Process payments and send transaction confirmations</li>
              <li>Send important notifications about your purchases and upcoming events</li>
              <li>Inform you of other products or services available from TixMojo and its affiliates</li>
              <li>Contact you via surveys to conduct research about your opinion of current services or potential new services</li>
            </ul>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.6}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '15px',
              color: 'var(--purple-800)',
            }}>4. Use of Cookies</h2>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
              marginBottom: '15px',
            }}>
              The TixMojo website uses "cookies" to help you personalize your online experience. A cookie is a text file that is placed on your hard disk by a Web page server. Cookies cannot be used to run programs or deliver viruses to your computer. Cookies are uniquely assigned to you, and can only be read by a web server in the domain that issued the cookie to you.
            </p>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
              marginBottom: '15px',
            }}>
              One of the primary purposes of cookies is to provide a convenience feature to save you time. The purpose of a cookie is to tell the Web server that you have returned to a specific page. For example, if you personalize TixMojo pages, or register with the TixMojo site or services, a cookie helps TixMojo to recall your specific information on subsequent visits.
            </p>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
            }}>
              You have the ability to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. If you choose to decline cookies, you may not be able to fully experience the interactive features of TixMojo services or websites you visit.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.7}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '15px',
              color: 'var(--purple-800)',
            }}>5. Security of Your Personal Information</h2>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
              marginBottom: '15px',
            }}>
              TixMojo secures your personal information from unauthorized access, use or disclosure. TixMojo secures the personally identifiable information you provide on computer servers in a controlled, secure environment, protected from unauthorized access, use or disclosure.
            </p>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
            }}>
              When personal information (such as a credit card number) is transmitted to other websites, it is protected through the use of encryption, such as the Secure Socket Layer (SSL) protocol.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.8}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '15px',
              color: 'var(--purple-800)',
            }}>6. Data Retention</h2>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
            }}>
              We retain your personal information for as long as necessary to provide you with our services and as needed to comply with our legal obligations. If you wish to request that we delete your personal data, please contact us at info@tixmojo.com.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.9}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '15px',
              color: 'var(--purple-800)',
            }}>7. Your Rights</h2>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
              marginBottom: '15px',
            }}>
              Depending on your location, you may have the following rights regarding your personal data:
            </p>
            <ul style={{
              listStyle: 'disc',
              paddingLeft: '25px',
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
            }}>
              <li>The right to access your personal data</li>
              <li>The right to rectify inaccurate personal data</li>
              <li>The right to request deletion of your personal data</li>
              <li>The right to restrict processing of your personal data</li>
              <li>The right to data portability</li>
              <li>The right to object to processing of your personal data</li>
              <li>The right to withdraw consent</li>
            </ul>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={1.0}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '15px',
              color: 'var(--purple-800)',
            }}>8. Changes to This Statement</h2>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
            }}>
              TixMojo will occasionally update this Privacy Policy to reflect company and customer feedback. TixMojo encourages you to periodically review this Policy to be informed of how we are protecting your information.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={1.1}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '15px',
              color: 'var(--purple-800)',
            }}>9. Contact Information</h2>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
              marginBottom: '15px',
            }}>
              TixMojo welcomes your comments regarding this Privacy Policy. If you believe that TixMojo has not adhered to this Policy, please contact us at:
            </p>
            <div style={{
              padding: '20px',
              backgroundColor: 'var(--purple-50)',
              borderRadius: '8px',
              border: '1px solid var(--purple-100)',
            }}>
              <p style={{ margin: '5px 0' }}><strong>Email:</strong> privacy@tixmojo.com</p>
              <p style={{ margin: '5px 0' }}><strong>Phone:</strong> +61 483952024</p>
              <p style={{ margin: '5px 0' }}><strong>Address:</strong> 123 Event Street, Sydney, NSW 2000, Australia</p>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
};

export default PrivacyPolicy;