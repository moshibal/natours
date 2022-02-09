import helmet from 'helmet';
//Add the following
// Further HELMET configuration for Security Policy (CSP)
const scriptSrcUrls = [
  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
];
const styleSrcUrls = [
  'https://api.mapbox.com/',
  'https://api.tiles.mapbox.com/',
  'https://fonts.googleapis.com/',
];
const connectSrcUrls = [
  'https://api.mapbox.com/',
  'https://a.tiles.mapbox.com/',
  'https://b.tiles.mapbox.com/',
  'https://events.mapbox.com/',
];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];
const helmetCongig = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: [],
    connectSrc: ["'self'", ...connectSrcUrls],
    scriptSrc: ["'self'", ...scriptSrcUrls],
    styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
    workerSrc: ["'self'", 'blob:'],
    objectSrc: [],
    imgSrc: ["'self'", 'blob:', 'data:'],
    fontSrc: ["'self'", ...fontSrcUrls],
  },
});
export default helmetCongig;
// I've added  googleapis  for the fonts we use.

// If one day you use a CDN for bootstrap, or font-awesome, you can add the base URLs in the corresponding properties.

// Also, if you use Unspalsh as images source, to avoid any CSP error, you can add this to imgSrc:

// imgSrc: [
//     "'self'",
//     "blob:",
//     "data:",
//     "https://images.unsplash.com/"
// ],
