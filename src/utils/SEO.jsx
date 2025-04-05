import { Helmet } from 'react-helmet-async';

/**
 * Default SEO component for base site metadata
 */
export const DefaultSEO = () => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>TixMojo - Find and Book the Best Events</title>
      <meta name="title" content="TixMojo - Find and Book the Best Events" />
      <meta name="description" content="Discover and book tickets for the best concerts, festivals, shows, and events near you. TixMojo helps you find amazing experiences." />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://tixmojo.com/" />
      <meta property="og:title" content="TixMojo - Find and Book the Best Events" />
      <meta property="og:description" content="Discover and book tickets for the best concerts, festivals, shows, and events near you. TixMojo helps you find amazing experiences." />
      <meta property="og:image" content="/og-image.jpg" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://tixmojo.com/" />
      <meta property="twitter:title" content="TixMojo - Find and Book the Best Events" />
      <meta property="twitter:description" content="Discover and book tickets for the best concerts, festivals, shows, and events near you. TixMojo helps you find amazing experiences." />
      <meta property="twitter:image" content="/og-image.jpg" />
      
      {/* Canonical URL */}
      <link rel="canonical" href="https://tixmojo.com/" />
      
      {/* Additional meta tags */}
      <meta name="keywords" content="tickets, events, concerts, festivals, shows, entertainment, booking" />
      <meta name="author" content="TixMojo" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      
      {/* iOS meta tags */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="apple-mobile-web-app-title" content="TixMojo" />
      
      {/* Android meta tags */}
      <meta name="theme-color" content="#6F44FF" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Favicons */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    </Helmet>
  );
};

/**
 * SEO component for specific pages with page-specific metadata
 */
export const PageSEO = ({ 
  title, 
  description, 
  path = '',
  image = '/og-image.jpg',
  article = false,
  publishedTime = '',
  modifiedTime = '',
  keywords = '',
  noindex = false
}) => {
  const fullTitle = title ? `${title} | TixMojo` : 'TixMojo - Find and Book the Best Events';
  const pageUrl = `https://tixmojo.com${path}`;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={pageUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />
      
      {/* Article specific meta (if article is true) */}
      {article && publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {article && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      
      {/* No index directive if specified */}
      {noindex && <meta name="robots" content="noindex" />}
    </Helmet>
  );
};

/**
 * Event SEO component for event detail pages with structured data
 */
export const EventSEO = ({ 
  event = {
    title: '',
    description: '',
    date: '',
    endDate: '',
    location: { name: '', address: '' },
    image: '',
    price: { currency: 'USD', value: '', minValue: '', maxValue: '' },
    performer: { name: '', type: 'PerformingGroup' },
    offers: []
  },
  path = ''
}) => {
  const fullTitle = `${event.title} | TixMojo`;
  const pageUrl = `https://tixmojo.com${path}`;
  
  // Generate JSON-LD schema for the event
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description,
    "image": event.image,
    "startDate": event.date,
    "endDate": event.endDate || event.date,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": event.location.name,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": event.location.address
      }
    },
    "performer": {
      "@type": event.performer.type,
      "name": event.performer.name
    },
    "offers": {
      "@type": "Offer",
      "url": pageUrl,
      "price": event.price.value || event.price.minValue,
      "priceCurrency": event.price.currency,
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString()
    },
    "organizer": {
      "@type": "Organization",
      "name": "TixMojo",
      "url": "https://tixmojo.com"
    }
  };
  
  // If we have min and max prices, use AggregateOffer instead of Offer
  if (event.price.minValue && event.price.maxValue) {
    eventSchema.offers = {
      "@type": "AggregateOffer",
      "url": pageUrl,
      "lowPrice": event.price.minValue,
      "highPrice": event.price.maxValue,
      "priceCurrency": event.price.currency,
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString()
    };
  }
  
  // If we have multiple specific offers
  if (event.offers && event.offers.length > 0) {
    eventSchema.offers = event.offers.map(offer => ({
      "@type": "Offer",
      "name": offer.name,
      "price": offer.price,
      "priceCurrency": event.price.currency,
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString()
    }));
  }
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={event.description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={event.description} />
      <meta property="og:image" content={event.image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={pageUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={event.description} />
      <meta property="twitter:image" content={event.image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />
      
      {/* Event Schema */}
      <script type="application/ld+json">
        {JSON.stringify(eventSchema)}
      </script>
    </Helmet>
  );
};