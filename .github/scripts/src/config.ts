export const TABLES = [
  {
    path: "../../../README.md",
    query: "get_swe_intern_usa",
    salary: true,
    interval: "hr",
  },
  {
    path: "../../../NEW_GRAD_USA.md",
    query: "get_swe_new_grad_usa",
    salary: true,
    interval: "yr",
  },
  {
    path: "../../../INTERN_INTL.md",
    query: "get_swe_intern_intl",
    salary: false,
    interval: undefined,
  },
  {
    path: "../../../NEW_GRAD_INTL.md",
    query: "get_swe_new_grad_intl",
    salary: false,
    interval: undefined,
  },
] as const;

export const HEADERS = ["Company", "Position", "Location", "Posting", "Age"];

export const MARKERS = {
  faang: {
    start: "<!-- TABLE_FAANG_START -->",
    end: "<!-- TABLE_FAANG_END -->",
  },
  quant: {
    start: "<!-- TABLE_QUANT_START -->",
    end: "<!-- TABLE_QUANT_END -->",
  },
  other: { start: "<!-- TABLE_START -->", end: "<!-- TABLE_END -->" },
} as const;
