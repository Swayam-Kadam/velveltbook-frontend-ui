/** Service category labels used across home, deals, and service-category pages. */
export const SERVICE_CATEGORY_LABELS = [
  "Barber",
  "Salon",
  "Spa",
  "Massage",
  "Tattoo",
  "Nails",
  "Makeup",
  "More",
] as const;

export const DEAL_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "hair", label: "Hair" },
  { id: "massage", label: "Massage" },
  { id: "facial", label: "Facial" },
  { id: "nails", label: "Nails" },
  { id: "spa", label: "Spa" },
  { id: "barber", label: "Barber" },
  { id: "makeup", label: "Makeup" },
  { id: "more", label: "More" },
] as const;
