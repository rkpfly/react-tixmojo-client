import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollAnimation } from '../utils/ScrollAnimation.jsx';
import { FiChevronRight } from 'react-icons/fi';

const TermsConditions = () => {
  // Get current year for the effective date
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
          <span>Terms & Conditions</span>
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
          Terms and Conditions
        </h1>
      
        <div style={{
          backgroundColor: 'var(--neutral-50)',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '40px',
          border: '1px solid var(--neutral-200)',
        }}>
          <p style={{ fontWeight: '500' }}>
            <strong>Effective Date:</strong> November 28, {currentYear}
          </p>
          <p>
            Welcome to TixMojo (Louder World Pty. Ltd). By accessing or using our website and purchasing tickets through our platform, you agree to comply with and be bound by the following terms and conditions. Please read them carefully before proceeding. If you do not agree with any part of these terms, please do not use our services.
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
            }}>1. Definitions</h2>
            <ul style={{
              listStyle: 'disc',
              paddingLeft: '25px',
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
            }}>
              <li>"TixMojo," "we," "us," and "our" refer to TixMojo, the ticketing platform.</li>
              <li>"User," "you," and "your" refer to any individual or entity accessing or using our services.</li>
              <li>"Event Organizer" refers to the individual or entity responsible for organizing the event for which tickets are sold.</li>
              <li>"Venue" refers to the location where the event is held.</li>
            </ul>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.4}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '15px',
              color: 'var(--purple-800)',
            }}>2. Scope of Service</h2>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
              marginBottom: '15px',
            }}>
              TixMojo acts as an intermediary between Event Organizers and Users, facilitating the sale and purchase of event tickets. We are not responsible for the actual event, including its quality, scheduling, or any changes made by the Event Organizer.
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
            }}>3. Ticket Purchases</h2>
            <ul style={{
              listStyle: 'disc',
              paddingLeft: '25px',
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
            }}>
              <li><strong>Pricing:</strong> Ticket prices are set by the Event Organizer and may include additional fees such as booking or service charges. All prices are displayed in the respective currency and include applicable taxes unless stated otherwise.</li>
              <li><strong>Payment:</strong> Full payment is required at the time of purchase. We accept various payment methods as indicated on our website.</li>
              <li><strong>Confirmation:</strong> Upon successful payment, you will receive a confirmation email with your e-ticket. Please ensure the email address provided during purchase is accurate.</li>
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
            }}>4. Delivery of Tickets</h2>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
              marginBottom: '15px',
            }}>
              All tickets are delivered electronically via the email address provided during purchase. It is your responsibility to provide a valid and accessible email address. If you do not receive your ticket, please contact our support team promptly.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.6}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '15px',
              color: 'var(--purple-800)',
            }}>5. Refunds and Exchanges</h2>
            <ul style={{
              listStyle: 'disc',
              paddingLeft: '25px',
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
            }}>
              <li><strong>General Policy:</strong> All ticket sales are final. Refunds or exchanges are not permitted unless required by law or authorized by the Event Organizer.</li>
              <li><strong>Event Changes:</strong> The Event Organizer reserves the right to modify event details, including date, time, venue, and lineup. In such cases, refunds are at the discretion of the Event Organizer.</li>
              <li><strong>Cancellations:</strong> If an event is canceled, TixMojo will facilitate refunds as directed by the Event Organizer, typically excluding booking fees.</li>
            </ul>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.7}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '15px',
              color: 'var(--purple-800)',
            }}>6. Google Services and Data</h2>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
              marginBottom: '15px',
            }}>
              TixMojo integrates with Google services to enhance your user experience. By using our platform with Google login:
            </p>
            <ul style={{
              listStyle: 'disc',
              paddingLeft: '25px',
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
            }}>
              <li>You authorize TixMojo to access your Google profile information, including but not limited to your name, email address, profile picture, and phone number through the Google People API.</li>
              <li>This information is used solely to streamline your ticket purchasing process by pre-filling registration forms.</li>
              <li>Your Google account information is handled in accordance with both our Privacy Policy and Google's Privacy Policy.</li>
              <li>You can revoke TixMojo's access to your Google account information at any time through your Google Account settings.</li>
              <li>We request only the minimum necessary permissions required to provide our services.</li>
            </ul>
          </div>
        </ScrollAnimation>
        
        <ScrollAnimation direction="up" delay={0.8}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '15px',
              color: 'var(--purple-800)',
            }}>7. User Conduct</h2>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
              marginBottom: '15px',
            }}>
              By attending the event, you consent to:
            </p>
            <ul style={{
              listStyle: 'disc',
              paddingLeft: '25px',
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
            }}>
              <li><strong>Searches:</strong> Security personnel may conduct searches of your person and belongings. Refusal may result in denied entry without refund.</li>
              <li><strong>Recording and Photography:</strong> The Event Organizer may record the event, and your likeness may appear in such recordings. By attending, you grant permission for your image to be used for promotional purposes without compensation.</li>
            </ul>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.9}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '15px',
              color: 'var(--purple-800)',
            }}>8. Limitation of Liability</h2>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
              marginBottom: '15px',
            }}>
              TixMojo is not liable for:
            </p>
            <ul style={{
              listStyle: 'disc',
              paddingLeft: '25px',
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
            }}>
              <li><strong>Event Quality:</strong> Any dissatisfaction with the event's content or execution.</li>
              <li><strong>Personal Injury or Loss:</strong> Any injuries, damages, thefts, or losses occurring at the event or Venue.</li>
              <li><strong>Third-Party Actions:</strong> Actions of the Event Organizer, Venue, or other attendees.</li>
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
            }}>9. Privacy</h2>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
              marginBottom: '15px',
            }}>
              Your personal information is collected and used in accordance with our <Link to="/privacy-policy" style={{ color: 'var(--purple-600)', textDecoration: 'none' }}>Privacy Policy</Link>. By using our services, you consent to such processing and warrant that all data provided by you is accurate.
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
            }}>10. Intellectual Property</h2>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
              marginBottom: '15px',
            }}>
              All content on the TixMojo website, including text, graphics, logos, and software, is the property of TixMojo or its licensors and is protected by intellectual property laws. Unauthorized use is prohibited.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={1.2}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '15px',
              color: 'var(--purple-800)',
            }}>11. Amendments</h2>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
              marginBottom: '15px',
            }}>
              TixMojo reserves the right to amend these terms and conditions at any time. Changes will be effective upon posting on our website. Continued use of our services constitutes acceptance of the revised terms.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={1.3}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '15px',
              color: 'var(--purple-800)',
            }}>12. Governing Law</h2>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
              marginBottom: '15px',
            }}>
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which TixMojo operates, without regard to its conflict of law principles.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={1.4}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '15px',
              color: 'var(--purple-800)',
            }}>13. Contact Information</h2>
            <p style={{
              color: 'var(--neutral-700)',
              lineHeight: '1.7',
              marginBottom: '15px',
            }}>
              For any questions or concerns regarding these terms, please contact us at:
            </p>
            <div style={{
              padding: '20px',
              backgroundColor: 'var(--purple-50)',
              borderRadius: '8px',
              border: '1px solid var(--purple-100)',
            }}>
              <p style={{ margin: '5px 0' }}><strong>Email:</strong> info@tixmojo.com</p>
              <p style={{ margin: '5px 0' }}><strong>Phone:</strong> +61 483952024</p>
            </div>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={1.5}>
          <div style={{
            marginTop: '20px',
            backgroundColor: 'var(--neutral-50)',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid var(--neutral-200)',
          }}>
            <p style={{
              fontStyle: 'italic',
              color: 'var(--neutral-700)',
            }}>
              By proceeding with your ticket purchase, you acknowledge that you have read, understood, and agree to abide by these terms and conditions.
            </p>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
};

export default TermsConditions;