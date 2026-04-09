/**
 * ============================================================================
 * GOOGLE ANALYTICS 4 - IP FILTERING CONFIGURATION
 * ============================================================================
 * 
 * HOW TO CONFIGURE:
 * 
 * 1. MEASUREMENT ID:
 *    Replace the placeholder below with your real GA4 Measurement ID.
 *    Find it in: GA4 Admin → Data Streams → Your Web Stream → Measurement ID
 * 
 * 2. EXCLUDED IPS:
 *    Add your IP addresses to the EXCLUDED_IPS array below.
 *    
 *    IMPORTANT: Devices on the same Wi-Fi network share the SAME public IP.
 *    You only need ONE entry per network, not per device.
 *    
 *    To find your current IP, visit: https://api.ipify.org
 *    
 * ============================================================================
 */

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  CONFIGURATION SECTION - EDIT HERE                                        ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

/**
 * Your GA4 Measurement ID
 * Format: G-XXXXXXXXXX
 */
export const GA_MEASUREMENT_ID = 'G-0NRHXS8Y5S'; // ← Replace with your real ID

/**
 * IP addresses to exclude from tracking.
 * 
 * Each entry has:
 * - label: A friendly name to identify the network (shown in console when blocked)
 * - ip: The public IP address of that network
 * 
 * Remember: All devices on the same Wi-Fi share one public IP.
 * You only need one entry per network location.
 */
export const EXCLUDED_IPS: { label: string; ip: string }[] = [
  { label: "Home (laptops + phone on Wi-Fi)", ip: "37.19.221.229" },
  { label: "Office", ip: "YOUR_OFFICE_IP" },           // ← Replace with your office IP
  { label: "Phone (mobile data)", ip: "YOUR_MOBILE_DATA_IP" }, // ← Replace with your mobile carrier IP
  // Add more entries as needed:
  // { label: "Coffee Shop", ip: "xxx.xxx.xxx.xxx" },
];

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  IMPLEMENTATION - DO NOT EDIT BELOW UNLESS YOU KNOW WHAT YOU'RE DOING     ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Fetches the visitor's public IP address using a free API.
 * Returns null if the fetch fails (we'll allow tracking on failure).
 */
async function fetchVisitorIP(): Promise<string | null> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) return null;
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn('[Analytics] Could not fetch IP, defaulting to allow tracking:', error);
    return null;
  }
}

/**
 * Checks if the given IP is in the exclusion list.
 * Returns the matched entry if found, null otherwise.
 */
function findExcludedIP(ip: string): { label: string; ip: string } | null {
  return EXCLUDED_IPS.find(entry => entry.ip === ip) || null;
}

/**
 * Loads the GA4 gtag.js script into the document head.
 * Does NOT auto-fire a pageview - that's handled separately after IP check.
 */
function loadGtagScript(): void {
  // Prevent duplicate script injection
  if (document.querySelector(`script[src*="googletagmanager.com/gtag"]`)) {
    return;
  }

  // Create and append the gtag.js script (async, non-blocking)
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  // Initialize gtag with timestamp, but DO NOT send pageview yet
  // We configure 'send_page_view': false to prevent automatic pageview
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // We'll manually trigger pageview after IP check
  });
}

/**
 * Sends a pageview event to GA4.
 * Call this after confirming the visitor should be tracked.
 */
export function sendPageview(): void {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
  }
}

/**
 * Tracks a custom event in GA4.
 * Use this for form submissions, button clicks, etc.
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

// Track whether analytics has been initialized
let analyticsInitialized = false;
let shouldTrack = true; // Default to tracking (fail-safe)

/**
 * Initializes Google Analytics 4 with IP filtering.
 * 
 * This function:
 * 1. Loads the gtag.js script (non-blocking)
 * 2. Fetches the visitor's IP asynchronously
 * 3. Checks if the IP is in the exclusion list
 * 4. Only sends the initial pageview if NOT excluded
 * 
 * If the IP fetch fails, tracking is ALLOWED to avoid losing real visitor data.
 */
export async function initializeAnalytics(): Promise<void> {
  // Prevent double initialization
  if (analyticsInitialized) return;
  analyticsInitialized = true;

  // Load the GA4 script first (non-blocking)
  loadGtagScript();

  // Fetch visitor IP and check against exclusion list
  const visitorIP = await fetchVisitorIP();

  if (visitorIP) {
    const excludedEntry = findExcludedIP(visitorIP);

    if (excludedEntry) {
      // IP is in exclusion list - suppress tracking
      shouldTrack = false;
      console.log(
        `%c[Analytics] Suppressed — self-traffic detected (${excludedEntry.label})`,
        'color: #f59e0b; font-weight: bold;'
      );
      console.log(`[Analytics] Matched IP: ${visitorIP}`);
      return; // Don't send pageview
    }
  }

  // IP not excluded (or fetch failed) - proceed with tracking
  shouldTrack = true;
  sendPageview();
  console.log('[Analytics] Tracking enabled for this session');
}

/**
 * Returns whether analytics tracking is currently enabled.
 * Use this before sending custom events to respect IP filtering.
 */
export function isTrackingEnabled(): boolean {
  return shouldTrack;
}

/**
 * Conditionally tracks an event only if tracking is enabled.
 * Use this for form submissions, clicks, etc.
 */
export function safeTrackEvent(eventName: string, params?: Record<string, unknown>): void {
  if (shouldTrack) {
    trackEvent(eventName, params);
  }
}
