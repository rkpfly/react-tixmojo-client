# TixMojo Application Changes

## Summary of Changes

This document outlines the changes made to the TixMojo application during our session.

## Latest Updates: Modularizing Event Details Page

The EventDetails page has been completely refactored into a modular component structure for better maintainability and organization:

- Created a dedicated `src/Components/EventDetails/` directory to house all related components
- Split the monolithic EventDetails.jsx into multiple smaller, focused components:
  - `EventDetailsHeader.jsx`: Event title and tags section
  - `EventMainInfo.jsx`: Event image, date, venue, and pricing
  - `EventTabs.jsx`: Tab navigation container with active tab indicator
  - `TabDetails.jsx`: Event description and summary
  - `TabVenue.jsx`: Venue information and map display
  - `TabHighlights.jsx`: Event highlights extraction
  - `TabMoreInfo.jsx`: Additional event information tabs
  - `OrganizerInfo.jsx`: Organizer profile and related events
  - `NewOrganizerInfo.jsx`: Modern design for organizer information section
  - `EventFAQSection.jsx`: Frequently asked questions
  - `EventSponsors.jsx`: Event sponsors display
  - `ContactPopup.jsx`: Organizer contact popup modal
  - `OrgContactPopup.jsx`: Enhanced modern contact popup with improved UI
  - `TicketSelection.jsx`: Interactive ticket selection and purchase system
  - `TicketTable.jsx`: Left-side table displaying available ticket types
  - `TicketType.jsx`: Individual ticket type row with add/remove controls
  - `TicketCart.jsx`: Right-side cart summary with ticket details
  - `CartItem.jsx`: Individual cart item component
  - `PromoCode.jsx`: Promo code application component
  - `CountdownTimer.jsx`: Session timeout countdown timer
  - `LoadingIndicator.jsx`: Loading state component
  - `EventContainer.jsx`: Main page container wrapper
  - `EventSEOWrapper.jsx`: SEO metadata component

Benefits of this refactoring:
- Improved code organization with clear component responsibilities
- Enhanced maintainability - each component is smaller and more focused
- Better separation of concerns between data and presentation
- Components can be more easily reused in other parts of the application
- Simplified parent component with cleaner render method

## 1. Color Theme Updates

Changed the color theme from green to shades of purple:

- Created a comprehensive color system with:
  - Primary purple palette (`--purple-50` through `--purple-900`)
  - Neutral color palette (`--neutral-50` through `--neutral-900`)
  - Accent colors (pink, teal, indigo)
  - Semantic colors (success, warning, error, info)

- Updated in `src/Style/imports.css`:
```css
:root {
  /* Primary Purple Color Palette */
  --purple-50: #F8F5FF;
  --purple-100: #EEE6FF;
  --purple-200: #D9C6FF;
  --purple-300: #C4A7FF;
  --purple-400: #A988FF;
  --purple-500: #8A66FF;
  --purple-600: #6F44FF;
  --purple-700: #5C31E6;
  --purple-800: #4A21CC;
  --purple-900: #3817A3;
  
  /* Neutral Color Palette */
  --neutral-50: #FFFFFF;
  --neutral-100: #F5F5FA;
  /* ... and more */
}
```

## 2. Logo Removal

- Removed the Logo component from the Navbar and Footer
- Replaced with simple text "TIXMOJO" in the navbar
- Simplified the footer's branding section

## 3. Navbar Updates

### 3.1 Height Increase
- Increased navbar height from 70px to 90px
- Added more horizontal padding (from 24px to 32px)
- Made the TIXMOJO title larger and bolder
- Updated the Sidebar top position to align with the taller navbar
- Added a top margin to the FlyerCarousel to prevent content overlap

### 3.2 Removed "Create Event" Button
- Removed the "Create Event" button from the navbar
- Removed the MdLocalActivity import that was only used for this button

### 3.3 User Account Popup Sidebar
- Modified the account icon in the navbar to toggle the sidebar
- Added visual feedback when the account icon is active (color change and shadow)
- Redesigned the sidebar to be an account-focused menu with:
  - User profile section at the top
  - Account actions (Sign In, Dashboard, My Tickets)
  - Help & Support links
- Added animation and hover effects for menu items
- Improved styling with:
  - Subtle transitions
  - Interactive hover states that shift items slightly
  - Clear visual sections with dividers

## 4. Card Design Updates

### 4.1 Event Card Simplification
- Removed the "featured" tag from cards
- Removed the "time" display from the top of cards
- Removed the "attending" and "rating" sections

### 4.2 Ranking Indicator
- Added a circular ranking indicator (1, 2, 3) to the top left of cards
- Designed with:
  - Circular white background
  - Less bold, slightly larger font (36px size, 500 weight)
  - Clean, minimal design for better visibility

### 4.3 Card Layout Updates
- Updated the event title to uppercase with better spacing
- Improved the date and location sections with better typography
- Styled the price badge to match the new design
- Updated card borders and shadows
- Removed the word "From" from the bottom left of the price section for a cleaner look

## 5. Dropdown Improvements

### 5.1 Location Dropdown Redesign
- Enhanced the "Sydney" dropdown with:
  - Opaque white background instead of transparent
  - Underlined the location name
  - Reduced the gap between "Events in" and "Sydney"
  - Increased z-index to 1000 to ensure visibility
  
### 5.2 Dropdown Menu Styling
- Added dividers between menu items
- Used solid color backgrounds instead of semi-transparent ones
- Increased padding for better usability
- Enhanced box shadow for a more premium feel
- Improved hover and selected states

## 6. New Recommendation Section

- Created a new recommendation section that doesn't display ranking numbers
- Added features:
  - Implemented as `NewRecommendSection.jsx` component
  - Horizontal scrollable card carousel with navigation buttons
  - Enhanced accessibility with keyboard navigation
  - Smooth scrolling animation
  - Modified the Cards component to support hiding ranking indicators
  - Added to the Home page above the Popular Events section

### 6.1 Enhanced Recommendation Section Design
- Redesigned to be more eye-catching while maintaining minimalism:
  - Added subtle gradient background with light purple to white fade
  - Created highlighted title with semi-transparent purple underline
  - Improved title presentation with centered design and increased font size
  - Enhanced hover effects on cards with smooth vertical float animation
  - Upgraded navigation buttons with larger size and interactive hover effects
  - Added subtle shadows and better spacing throughout the section
  - Changed title to "Spotlight Events" for better marketing presence

## 7. Link Redirects to 404 Page

- Modified all clickable links to redirect to the 404 page for better user experience:
  - Updated the Navbar navigation links to use React Router's Link component 
  - Redirected the "My Tickets" button to the 404 page
  - Modified all sidebar links to point to the 404 page
  - Updated Cards component to navigate to 404 page on click
  - Redirected card booking buttons to the 404 page
  - Modified carousel flyer images to navigate to 404 page when clicked
  - Ensured all links maintain their styling and hover effects

## 8. Scroll Animations

Added scroll-triggered animations throughout the application for a more dynamic user experience:
  - Created a ScrollAnimation utility (src/utils/ScrollAnimation.jsx) with:
    - Custom hooks for detecting element visibility
    - Component for wrapping content with animations
    - Support for different animation directions and delays
  - Added scroll-triggered entrance animations to:
    - Main page sections (Hero, Events, Recommendations)
    - Section titles and content
    - Cards with staggered reveal effects (each card animates with a slight delay)
  - Enhanced CSS with new animation classes for:
    - Fade-in effects
    - Slide animations from different directions
    - Zoom effects
    - Rotation animations
  - Improved perceived performance with sequential loading animations
  - Ensured smooth transitions and timing for a polished experience

## Component Files Modified

1. `src/Style/imports.css` - Color system and global styles, animation classes
2. `src/Components/Navbar.jsx` - Navbar height and styling, link redirects
3. `src/Components/Footer.jsx` - Logo removal
4. `src/Components/Cards.jsx` - Card redesign and ranking indicator, added hideRanking prop, link redirects
5. `src/Components/Sidebar.jsx` - Position adjustment, link redirects
6. `src/Components/FlyerCarousel.jsx` - Margin and color updates, link redirects
7. `src/Components/EventsSection.jsx` - Dropdown redesign
8. `src/Components/NewRecommendSection.jsx` - New component for recommendations without rankings, added scroll animations
9. `src/pages/Home.jsx` - Added new recommendation section, implemented scroll animations
10. `src/utils/ScrollAnimation.jsx` - New utility for scroll-based animations (using .jsx extension for JSX syntax)

## 9. SEO Optimizations

Added comprehensive SEO features to improve search engine visibility and social sharing:

- Integrated react-helmet-async for managing document head tags
- Created reusable SEO components:
  - DefaultSEO: Global site metadata and social tags
  - PageSEO: Page-specific metadata with customization options 
  - EventSEO: Event-specific metadata with structured data markup

- Implemented key SEO elements:
  - Title and meta description for all pages
  - Open Graph (Facebook) and Twitter Card metadata
  - JSON-LD structured data for events
  - Canonical URLs
  - Mobile and iOS meta tags
  - Language attributes
  - Robots meta directives

- Added SEO infrastructure:
  - sitemap.xml file with core site URLs
  - robots.txt file with crawler directives
  - Basic structured data implementation

## Component Files Added/Modified for SEO

1. `src/utils/SEO.jsx` - New reusable SEO components
2. `src/main.jsx` - Added HelmetProvider
3. `src/App.jsx` - Added DefaultSEO component  
4. `src/pages/Home.jsx` - Added page-specific SEO
5. `src/pages/PageNotFound.jsx` - Added noindex SEO for 404 page
6. `index.html` - Updated with basic SEO and preconnect tags
7. `public/sitemap.xml` - Added new sitemap file
8. `public/robots.txt` - Added new robots file

## Component Files Added/Modified for Event Details Page

1. `src/pages/EventDetails.jsx` - New Event Details page component
2. `src/App.jsx` - Added route for Event Details page
3. `src/Components/Cards.jsx` - Updated navigation to Event Details page
4. `src/Components/FlyerCarousel.jsx` - Updated carousel items to link to Event Details

## 13. Backend Server Implementation

Created a Node.js Express server to handle all data and API requirements:

- Server Architecture:
  - Created a complete RESTful API structure
  - Implemented data models with centralized event data
  - Added controllers for handling different endpoints
  - Set up proper routing with Express Router
  - Implemented middleware for security and logging

- API Features:
  - Events endpoint with location filtering
  - Spotlight events endpoint for featured events
  - Carousel flyers endpoint
  - Event details endpoint with ID-based lookup
  - Locations endpoint for available event locations

- Security and Performance:
  - Added Helmet for secure HTTP headers
  - Implemented CORS for cross-origin requests
  - Added Morgan and custom logger for request logging
  - Added error handling middleware
  - Health check endpoint for monitoring

- Client Integration:
  - Created API services layer in the React app
  - Updated components to fetch data from API
  - Added loading states for better UX
  - Implemented error handling for API failures
  - Environment variables for API configuration

## Files Added/Modified for Server Implementation

### Server Files:
1. `server/server.js` - Main server entry point
2. `server/package.json` - Server dependencies
3. `server/data/events.js` - Centralized event data
4. `server/controllers/eventController.js` - API endpoint handlers
5. `server/routes/eventRoutes.js` - API routes
6. `server/middleware/logger.js` - Custom logging middleware
7. `server/utils/responseUtils.js` - Response formatting utilities
8. `server/.env` - Server environment configuration
9. `server/README.md` - Server documentation

### Client Files:
1. `src/services/api.js` - API service layer for the frontend
2. `src/pages/Home.jsx` - Updated to fetch data from API
3. `src/pages/EventDetails.jsx` - Updated to fetch event details
4. `src/Components/FlyerCarousel.jsx` - Updated to fetch carousel data
5. `.env` - Added API URL configuration

## 10. Sidebar Font Update

Updated the font in both sidebar components for a more modern, clean look:

- Added the Inter font to the project imports
- Changed the font family in the Sidebar and UserSidebar components from "Poppins" to "Inter"
- Adjusted typography for better readability:
  - Reduced font sizes slightly (16px to 15px for Sidebar, 15px to 14px for UserSidebar)
  - Added negative letter spacing (-0.01em) for a more contemporary look
  - Enhanced font weight consistency across both sidebar components
  - Updated heading and section title styles to match the Inter font's characteristics
  - Refined user profile text styling for better visual hierarchy

## 11. Expanding Search Bar

Implemented an expanding search bar that increases in width when clicked:

- Added a smooth expansion animation for the search bar:
  - Desktop: Expands from 240px to 320px when focused
  - Mobile: Expands from icon-only (40px) to 180px with input field when focused
  
- Enhanced search bar interaction:
  - Added focus state with improved visual feedback
  - Slightly darker background color when focused
  - Added subtle box shadow and border when expanded
  - Included a close button to easily exit search mode
  - Made search icon slightly larger during focus state
  
- Improved responsive behavior:
  - On mobile, temporarily hides user icon and hamburger menu when search is focused
  - Reduces spacing between elements when search bar expands
  - Automatically collapses when clicking outside the search area
  
- Added smooth transitions:
  - Used cubic-bezier timing function for natural motion
  - Applied subtle opacity changes to surrounding elements
  - Ensured smooth animation on both expand and collapse

## 12. Event Details Page

Created a new Event Details page that follows the existing design system:

- Built a complete event page based on the provided design reference
- Layout features:
  - Large hero section with event title and tag
  - Event image with responsive sizing
  - Detailed event information panel with:
    - Date and time with icon
    - Venue details with location icon and external link
    - Price section with currency symbol
    - Prominent "Get Tickets" button with hover effects
  - Event description section with rich HTML content support
  - Organizer section with avatar and details

- Navigation integration:
  - Added route `/events/:eventId` in the router
  - Modified Cards component to link to the event details page
  - Updated FlyerCarousel to link carousel items to event details
  - Used React Router for seamless navigation between pages

- Technical features:
  - Dynamic URL parameter handling with useParams
  - Simulated API data loading with loading state
  - Responsive layout for mobile and desktop devices
  - SEO optimization with proper metadata using PageSEO component
  - Smooth scroll animations using ScrollAnimation components

## 14. Enhanced Event Details Page

Improved the event details page with more prominent and visually appealing information sections:

- Time and Date Display:
  - Added card-style container with soft purple background
  - Increased text size for better readability (16px → 18px)
  - Added circular icon container for the calendar icon
  - Enhanced borders and shadow for better visual hierarchy
  - Added subtle box shadow for depth

- Location Information:
  - Added matching card-style container 
  - Increased font sizes for better visibility
  - Made venue name more prominent
  - Enhanced location address legibility with increased font size
  - Added circular background for location icon

- Pricing Section:
  - Styled with consistent card design
  - Enhanced "Tickets Starting from" label
  - Improved spacing and padding

All sections now have a consistent design with:
  - Matching background colors
  - Unified border treatment
  - Consistent spacing and padding
  - Better visual hierarchy with larger text
  - Enhanced information architecture

## 15. Interactive Google Maps Integration

Added Google Maps location functionality to enhance venue information:

- Data Structure Enhancements:
  - Added 'locationMap' field in the backend data model
  - Configured Google Maps URLs for all event locations
  - Implemented fallback URL generation when location isn't provided
  
- User Interface Improvements:
  - Made venue addresses clickable with Google Maps links
  - Added external link icon for better UX
  - Applied subtle styling to indicate clickability (dashed underline)
  - Implemented hover effects to enhance interactivity
  - Created smooth transitions for visual feedback
  
- Technical Implementation:
  - URLs open in new tab for better user experience
  - Properly encoded addresses for map queries
  - Added proper security attributes to external links
  - Ensured consistent styling with the design system

## 17. Scroll-to-Top Behavior

Implemented automatic scroll-to-top functionality across the application:

- User Experience Improvements:
  - Pages automatically scroll to top on refresh
  - Navigation between routes resets scroll position
  - Browser back/forward buttons trigger scroll reset
  - Greatly improves usability when moving between pages
  
- Technical Implementation:
  - Created a reusable ScrollToTop utility component
  - Used React Router's useLocation hook to detect route changes
  - Added event listeners for browser navigation events
  - Applied sessionStorage to track page refresh state
  - Overrode default browser scrollRestoration behavior
  
- Integration Points:
  - Added component to BrowserRouter in App.jsx
  - Enhanced main.jsx with global scroll reset
  - Applied history.scrollRestoration = 'manual' for complete control
  - Created clean abstraction that works across the entire app

## 16. Enhanced Ticket Pricing Display

Redesigned the ticket pricing section to match the provided design:

- Visual Improvements:
  - Created a more prominent horizontal layout for better visibility
  - Increased font size of "Tickets Starting from" text (16px → 22px)
  - Dramatically increased the price amount size (30px → 50px)
  - Changed from purple to bold black text for the price
  - Styled the ticket icon with a rotated purple outline

- Button Enhancements:
  - Increased size of the "Get Tickets" button
  - Enlarged button text (16px → 24px)
  - Added more padding for better touch target size
  - Improved visual impact with larger border radius
  - Used Raleway font for consistent typography
  - Added letter spacing for better readability
  
- Layout Changes:
  - Removed the card-style container for a cleaner look
  - Implemented a space-between layout for better alignment
  - Maintained proper spacing between elements
  - Enhanced overall prominence of the pricing section

## 18. Enhanced Backend with Additional Events

Added more events to the backend and improved the event listing functionality:

- Event Data Enhancements:
  - Added 7 new event entries across 3 organizers
  - Created a diverse range of event types (festivals, concerts, family events)
  - Added detailed descriptions and metadata for each event
  - Ensured each organizer has multiple events for proper relation display

- Organizer-Specific Events:
  - Implemented new backend controller to filter events by organizer ID
  - Added dedicated `/events/organizer/:organizerId` API endpoint
  - Created `getEventsByOrganizer` function in the API service
  - Modified EventDetails page to display only events from the same organizer
  - Enhanced "Other Events" section on the EventDetails page

- UI Improvements:
  - "View All Events" button now only appears when there are additional events
  - Added proper navigation between related events
  - Improved formatting of event listings
  - Added fallback UI for organizers without additional events

## 19. Contact Organizer Popup

Implemented a contact information popup for event organizers:

- Feature Enhancements:
  - Created a modal popup triggered by the "Contact Organizer" button
  - Displayed organizer contact details in a structured, easy-to-read format
  - Added direct links for website, email, and phone
  - Implemented smooth animation effects

- UI Elements:
  - Designed a modern popup with organizer branding
  - Used organizer's initial letter as an avatar
  - Added visual icons for different contact methods
  - Implemented interactive hover effects
  - Made contact methods directly actionable (clickable)

- Technical Implementation:
  - Used React state for modal visibility control
  - Added event handlers for opening/closing the popup
  - Implemented click-outside detection to dismiss the popup
  - Enhanced with CSS animations for entrance and exit effects

## 20. SEO and Direct URL Access Optimization

Improved site discoverability and direct URL access capabilities:

- SEO Infrastructure:
  - Created comprehensive sitemap.xml with all event pages
  - Enhanced robots.txt with proper crawling directives
  - Added proper XML schema and metadata to sitemap
  - Implemented priority hierarchy for different page types
  - Added timestamp to sitemap for tracking updates

- Server Configuration:
  - Added .htaccess file for Apache servers
  - Created web.config file for IIS servers
  - Configured proper MIME types and caching headers
  - Set up URL rewriting for client-side routing

- Application Configuration:
  - Added homepage field to package.json
  - Enhanced Vite configuration for proper base URL handling
  - Optimized build settings for better performance
  - Ensured proper scroll behavior with URL navigation

## 21. Netlify Deployment Configuration

Fixed direct URL access issues for Netlify deployment:

- Netlify Configuration:
  - Created netlify.toml configuration file with proper redirect rules
  - Added public/_redirects file as fallback
  - Configured cache headers for static assets
  - Added security headers for enhanced protection
  - Set up build settings and environment variables

- Redirect Rules:
  - Implemented 200 redirects for all routes to index.html
  - Ensured client-side routing works with direct URL access
  - Fixed "Page Not Found" errors when directly accessing URLs
  - Optimized for single-page application (SPA) architecture

- Performance Optimization:
  - Set up aggressive caching for static assets
  - Configured immutable cache for images
  - Optimized build process for Netlify
  - Specified Node version for consistent builds

## 22. Domain URL Correction

Updated all references to use the correct Netlify domain:

- URL Standardization:
  - Changed all URLs from tixmojo.com to tixmojo.netlify.app
  - Updated sitemap.xml with correct domain references
  - Updated robots.txt with correct sitemap URL
  - Fixed homepage reference in package.json

- SEO Impact:
  - Ensured search engines index the correct URLs
  - Eliminated confusion for web crawlers
  - Standardized URLs across all project files
  - Improved discoverability of the deployed site

- User Access Improvements:
  - Direct links now properly point to the deployed Netlify site
  - Social media sharing uses correct domain
  - Bookmark functionality improved with actual URLs
  - Search engine results will show the proper domain

## 23. Enhanced Interactive Event Details Section

Completely redesigned the Event Details page with a rich, data-driven tabbed interface:

- Tabbed Navigation System:
  - Implemented a four-tab interface (Details, Venue, Highlights, More Info)
  - Added animated tab indicator that slides between active tabs
  - Designed dynamic tab switching with smooth transitions
  - Incorporated icon-based navigation for visual clarity
  - Created responsive tab layouts for mobile and desktop

- Details Tab Enhancements:
  - Added comprehensive event summary card with tags and key details
  - Created collapsible/expandable description section with "Read More" functionality
  - Added gradient fade effect for truncated content
  - Displayed organizer name with proper attribution
  - Extracted and displayed all relevant event information

- Venue Tab Improvements:
  - Created detailed venue information card with address and facilities
  - Added interactive map preview with pulsing location indicator
  - Implemented Google Maps integration with proper linking
  - Added venue details with icon indicators for better readability
  - Included additional information about nearby amenities and transportation

- Highlights Tab Features:
  - Created dynamic event highlights from description content
  - Added featured event banner with background image
  - Dynamically extracted bullet points from event descriptions
  - Built interactive highlight cards with hover effects
  - Added prominent call-to-action for ticket purchases

- More Info Tab Enhancements:
  - Designed comprehensive organizer information section
  - Added related events by the same organizer
  - Improved interactive FAQ section with expandable answers
  - Created enhanced sponsors section with interactive cards
  - Included contact organizer functionality

- Visual Improvements:
  - Applied consistent styling across all tabs
  - Added hover effects and transitions for interactive elements
  - Implemented subtle animations for tab switching and map location
  - Created visual hierarchy with color and typography
  - Added decorative elements for visual interest

- Technical Implementation:
  - Integrated with server data model for dynamic content generation
  - Implemented dynamic content extraction from HTML descriptions
  - Added state management for active tab tracking
  - Created expand/collapse states for content sections
  - Added additional CSS animations like pulsing map marker
  - Ensured responsive design for all screen sizes
  - Maintained accessibility with proper focus states

## Future Enhancement Ideas

- Consider adding animation to the ranking numbers
- Explore options for card hover effects
- Review mobile responsiveness for all changes
- Consider a dark mode theme option using the existing color variables
- Add dynamic event page SEO with structured data
- Implement breadcrumb navigation with structured data
- Create a dedicated organizer profile page
- Add user authentication and ticket purchasing flow
- Implement event search functionality
- Add event filtering by categories, dates, and price ranges
- Create a reviews and ratings section for events
- Add social sharing functionality for events
- Implement an event calendar view option

## 18. Interactive Ticket Selection System

Added a comprehensive ticket selection and purchase system to the Event Details page:

- **System Components**:
  - Ticket selection table with multiple ticket types and quantities
  - Interactive shopping cart with real-time total calculation
  - Enhanced session countdown timer with visual progress indicator
  - Promo code functionality with validation and discount application
  - Responsive design for all device sizes

- **Key Features**:
  - Real-time cart updates when adding or modifying ticket quantities
  - Support for different ticket types with varying prices
  - Dynamic ticket availability tracking
  - Promo code validation with percentage-based discounts
  - Session expiration with automatic page refresh
  - Clear visual feedback for all user actions
  - Fully modular component structure for maintainability
  - Conditional display triggered by "Get Tickets" button
  - Automatic smooth scrolling to ticket selection when button clicked
  - Close button to hide ticket selection section

- **Context-Adaptive Premium Countdown Timer with Session Management**:
  - Position-switching timer with distinct designs based on user's viewing context
  - Full-featured floating timer in top-right corner when browsing other sections
  - Premium banner-style timer positioned above the cart when viewing tickets
  - Perfect alignment with the cart component for visual harmony
  - Gradient background and ticket-themed icon for visual appeal
  - Larger, more readable time digits with premium styling
  - Animation effects that intensify when time is running low
  - Smart position tracking using Intersection Observer technology
  - Carefully selected color scheme that matches the application theme
  - Custom session expiry modal with elegant animation effects
  - Clear user guidance when session times out
  - One-click return to event details after expiry
  - Enhanced visual hierarchy in both display contexts

- **User Experience**:
  - Intuitive ticket selection with +/- controls
  - Seamless addition and removal of items from cart
  - Real-time price calculations with discount application
  - Visual urgency indicators and progress tracking
  - Mobile-friendly responsive design
  - Full keyboard accessibility
  - Clean, uncluttered interface until user explicitly chooses to buy tickets
  - Ability to close ticket selection and return to event details
  - Optimized location immediately after event details for better user flow
  - Precise scrolling to the ticket selection when activated
  - Visual separator to maintain clear content hierarchy