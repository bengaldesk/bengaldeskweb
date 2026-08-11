// The Bengal Desk — Brand Constants

export const SITE_NAME = 'The Bengal Desk'
export const SITE_URL = 'https://bengaldesk.com'
export const SITE_EMAIL = 'info@bengaldesk.com'
export const SITE_PRIVACY_EMAIL = 'privacy@bengaldesk.com'

// Cloudinary base for logo & icon assets
const CLOUDINARY_BASE = 'https://res.cloudinary.com/r51xywlg/image/upload'
const LOGO_VERSION = 'v1786488737'

// Logo — used in header, footer, error pages
export const LOGO_URL = `${CLOUDINARY_BASE}/f_auto,q_auto:good,fl_progressive/${LOGO_VERSION}/logo.png`

// Icons — for favicons, PWA, apple-touch
export const ICON_FAVICON = `${CLOUDINARY_BASE}/w_32,h_32,c_pad,f_auto,q_auto/${LOGO_VERSION}/icon.png`
export const ICON_APPLE = `${CLOUDINARY_BASE}/w_180,h_180,c_pad,f_auto,q_auto/${LOGO_VERSION}/icon.png`
export const ICON_PWA_192 = `${CLOUDINARY_BASE}/w_192,h_192,c_pad,f_auto,q_auto/${LOGO_VERSION}/icon.png`
export const ICON_PWA_512 = `${CLOUDINARY_BASE}/w_512,h_512,c_pad,f_auto,q_auto/${LOGO_VERSION}/icon.png`

// OG / Social sharing image
export const OG_IMAGE = `${CLOUDINARY_BASE}/w_1200,h_630,c_pad,f_auto,q_auto:good,fl_progressive/${LOGO_VERSION}/logo.png`
