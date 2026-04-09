"use client";

import { useEffect } from 'react';
import { initializeAnalytics } from '@/utils/analytics';

/**
 * Google Analytics 4 Component with IP Filtering
 * 
 * This component initializes GA4 tracking with self-traffic filtering.
 * 
 * Configuration is done in: src/utils/analytics.ts
 * - Set your GA4 Measurement ID
 * - Add IPs to exclude (your home, office, mobile data networks)
 * 
 * The IP check runs asynchronously and doesn't block page rendering.
 * If the IP fetch fails, tracking is allowed (fail-safe for real visitors).
 */
const GoogleAnalytics = () => {
  useEffect(() => {
    // Initialize analytics with IP filtering
    // This is async but we don't await - it runs in the background
    initializeAnalytics();
  }, []);

  return null;
};

export default GoogleAnalytics;


