// Helper function to format dates (used for generating dynamic dates)
const formatDate = (date) => {
  const day = date.getDate();
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const month = monthNames[date.getMonth()];
  return `${day} ${month}`;
};

// Generate dates for event flyers
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const todayFormatted = formatDate(today);
const tomorrowFormatted = formatDate(tomorrow);

// One week from now
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
const nextWeekFormatted = formatDate(nextWeek);

// Flyer carousel data with event details
export const flyerData = [
  {
    image: "https://images.unsplash.com/photo-1556035511-3168381ea4d4?q=80&w=3087&auto=format&fit=crop",
    title: "Bollywood Sydney",
    location: "Mirror Bar, The Rocks",
    date: "15 MAR",
    ticketLink: "https://tixmojo.com",
    ticketSite: "TIXMOJO.COM"
  },
  {
    image: "https://images.unsplash.com/photo-1628359355624-855775b5c9c4?q=80&w=3000&auto=format&fit=crop",
    title: "St. Patrick's Day",
    location: "Jameson Connects, Gurugram",
    date: "17 MAR",
    ticketLink: "https://tixmojo.com",
    ticketSite: "TIXMOJO.COM"
  },
  {
    image: "https://images.unsplash.com/photo-1642756938530-396347b66091?q=80&w=3024&auto=format&fit=crop",
    title: "Bollywood Club Brown",
    location: "Crown, Melbourne",
    date: "28 FEB",
    ticketLink: "https://tixmojo.com",
    ticketSite: "TIXMOJO.COM"
  },
  {
    image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?q=80&w=2830&auto=format&fit=crop",
    title: "Maaholi",
    location: "Indoor Holi Party",
    date: "22 MAR",
    ticketLink: "https://tixmojo.com",
    ticketSite: "TIXMOJO.COM"
  },
  {
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=2835&auto=format&fit=crop",
    title: "Friday Night Live",
    location: "Opera House, Sydney",
    date: `${nextWeekFormatted}`,
    ticketLink: "https://tixmojo.com",
    ticketSite: "TIXMOJO.COM"
  },
  {
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2940&auto=format&fit=crop",
    title: "EDM Festival",
    location: "Harbour Bridge, Sydney",
    date: `${todayFormatted}`,
    ticketLink: "https://tixmojo.com",
    ticketSite: "TIXMOJO.COM"
  },
  {
    image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2850&auto=format&fit=crop",
    title: "Comedy Night Special",
    location: "Town Hall, Melbourne",
    date: `${tomorrowFormatted}`,
    ticketLink: "https://tixmojo.com",
    ticketSite: "TIXMOJO.COM"
  }
];