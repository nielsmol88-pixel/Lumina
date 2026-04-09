import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { formatDistanceToNow } from "@/lib/dateUtils";

/**
 * Property tests for date utility functions.
 *
 * Property 15: formatDistanceToNow output format
 * Property 24: Date formatting uses Spanish locale
 *
 * Validates: Requirements 9.2, 14.6
 */

// Valid output patterns for formatDistanceToNow
const VALID_PATTERNS = [
  /^Ahora mismo$/,
  /^Hace \d+ min$/,
  /^Hace \d+h$/,
  /^Ayer$/,
  /^Hace \d+ días$/,
];

function matchesOnePattern(output: string): boolean {
  return VALID_PATTERNS.some((pattern) => pattern.test(output));
}

// Generate ISO date strings at specific offsets from "now"
function dateAtOffset(ms: number): string {
  return new Date(Date.now() - ms).toISOString();
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

describe("Property 15: formatDistanceToNow output format", () => {
  it("always returns a string matching one of the valid Spanish patterns", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 90 * DAY }),
        (offsetMs) => {
          const result = formatDistanceToNow(dateAtOffset(offsetMs));
          expect(matchesOnePattern(result)).toBe(true);
        }
      )
    );
  });

  it("returns 'Ahora mismo' for dates less than 1 minute ago", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: MINUTE - 1 }),
        (offsetMs) => {
          expect(formatDistanceToNow(dateAtOffset(offsetMs))).toBe("Ahora mismo");
        }
      )
    );
  });

  it("returns 'Hace N min' for dates between 1 and 59 minutes ago", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: MINUTE, max: HOUR - 1 }),
        (offsetMs) => {
          expect(formatDistanceToNow(dateAtOffset(offsetMs))).toMatch(/^Hace \d+ min$/);
        }
      )
    );
  });

  it("returns 'Hace Nh' for dates between 1 and 23 hours ago", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: HOUR, max: DAY - 1 }),
        (offsetMs) => {
          expect(formatDistanceToNow(dateAtOffset(offsetMs))).toMatch(/^Hace \d+h$/);
        }
      )
    );
  });

  it("returns 'Ayer' for dates between 24 and 47 hours ago", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: DAY, max: 2 * DAY - 1 }),
        (offsetMs) => {
          expect(formatDistanceToNow(dateAtOffset(offsetMs))).toBe("Ayer");
        }
      )
    );
  });

  it("returns 'Hace N días' for dates 2+ days ago", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2 * DAY, max: 90 * DAY }),
        (offsetMs) => {
          expect(formatDistanceToNow(dateAtOffset(offsetMs))).toMatch(/^Hace \d+ días$/);
        }
      )
    );
  });
});