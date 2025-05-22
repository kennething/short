export type LinkData = {
  /** Long link */
  long: string;
  /** Shortened link code */
  short: string;
  /** Date created as a unix timestamp */
  createdAt: number;
  /** Date expires as a unix timestamp */
  expiresAt: number | null;
};
