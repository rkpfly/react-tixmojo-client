/**
 * Fallback data for when API fails to load
 * This ensures the app continues to work even when the API is unreachable
 */

export const fallbackEvents = [
  {
    id: "event-1",
    eventName: "SUMMER MUSIC FESTIVAL",
    eventPoster: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2940&auto=format&fit=crop",
    eventAddress: "Sydney Opera House, Sydney",
    eventDate: "3 Apr",
    eventPrice: 299,
    eventRanking: "1",
    rankScore: 95,
    eventLocation: "Sydney",
    date: "2025-04-03",
    time: "19:00",
    currency: "AUD",
    tags: ["Festival", "Music"],
    description: "<p>Experience an unforgettable night of live music featuring top artists from around the world. This summer's biggest festival includes performances across multiple stages, food vendors, and more.</p>",
    venueName: "Sydney Opera House",
    venueAddress: "Bennelong Point, Sydney NSW 2000",
    locationMap: "https://maps.google.com/?q=Sydney+Opera+House",
    organizerId: "org1"
  },
  {
    id: "event-2",
    eventName: "TECH CONFERENCE 2025",
    eventPoster: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2940&auto=format&fit=crop",
    eventAddress: "International Convention Centre, Sydney",
    eventDate: "15 May",
    eventPrice: 499,
    eventRanking: "2",
    rankScore: 90,
    eventLocation: "Sydney",
    date: "2025-05-15",
    time: "09:00",
    currency: "AUD",
    tags: ["Technology", "Conference"],
    description: "<p>Join industry leaders and innovators for three days of inspiring talks, workshops, and networking opportunities at the premier tech event of the year.</p>",
    venueName: "International Convention Centre",
    venueAddress: "14 Darling Dr, Sydney NSW 2000",
    locationMap: "https://maps.google.com/?q=ICC+Sydney",
    organizerId: "org2"
  },
  {
    id: "event-3",
    eventName: "FOOD & WINE SHOWCASE",
    eventPoster: "https://images.unsplash.com/photo-1568644396922-5d85bd114c20?q=80&w=2940&auto=format&fit=crop",
    eventAddress: "The Grounds, Sydney",
    eventDate: "22 Jun",
    eventPrice: 150,
    eventRanking: "3",
    rankScore: 85,
    eventLocation: "Sydney",
    date: "2025-06-22",
    time: "12:00",
    currency: "AUD",
    tags: ["Food", "Wine"],
    description: "<p>Indulge in a culinary journey featuring the finest local and international cuisines, paired with exceptional wines from renowned vineyards.</p>",
    venueName: "The Grounds of Alexandria",
    venueAddress: "7A/2 Huntley St, Alexandria NSW 2015",
    locationMap: "https://maps.google.com/?q=The+Grounds+of+Alexandria",
    organizerId: "org1"
  }
];

export const fallbackFlyerData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2940&auto=format&fit=crop",
    title: "TECH CONFERENCE 2025",
    description: "Join industry leaders and innovators for three days of inspiring talks, workshops, and networking opportunities.",
    link: "/events/event-2",
    date: "May 15-17, 2025"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2940&auto=format&fit=crop",
    title: "SUMMER MUSIC FESTIVAL",
    description: "Experience an unforgettable night of live music featuring top artists from around the world.",
    link: "/events/event-1",
    date: "April 3, 2025"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1568644396922-5d85bd114c20?q=80&w=2940&auto=format&fit=crop",
    title: "FOOD & WINE SHOWCASE",
    description: "Indulge in a culinary journey featuring the finest local and international cuisines.",
    link: "/events/event-3",
    date: "June 22, 2025"
  }
];

export const fallbackOrganizers = {
  "org1": {
    id: "org1",
    name: "EventMasters Sydney",
    description: "Premier event management company specializing in music festivals and food events",
    location: "Sydney, Australia",
    contactEmail: "info@eventmasters.com",
    phone: "+61 2 8765 4321",
    website: "https://eventmasters.example.com"
  },
  "org2": {
    id: "org2",
    name: "TechEvents Global",
    description: "Organizing cutting-edge technology conferences and workshops worldwide",
    location: "Sydney, Australia",
    contactEmail: "contact@techevents.global",
    phone: "+61 2 9876 5432",
    website: "https://techevents.global"
  }
};

// Complete fallback app data that matches the API response structure
export const fallbackAppData = {
  locationEvents: {
    "Sydney": fallbackEvents,
    "Melbourne": [],
    "Brisbane": [],
    "Singapore": []
  },
  spotlightEvents: fallbackEvents,
  flyerData: fallbackFlyerData,
  locations: ["Sydney", "Melbourne", "Brisbane", "Singapore"]
};