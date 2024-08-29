export const TABLES = [
  {
    path: "../../../README.md",
    salary: true,
    interval: "hr",
    query: {
      job_type: "intern",
      is_usa: true,
    },
  },
  {
    path: "../../../NEW_GRAD_USA.md",
    salary: true,
    interval: "yr",
    query: {
      job_type: "new_grad",
      is_usa: true,
    },
  },
  {
    path: "../../../INTERN_INTL.md",
    salary: false,
    interval: undefined,
    query: {
      job_type: "intern",
      is_usa: false,
    },
  },
  {
    path: "../../../NEW_GRAD_INTL.md",
    salary: false,
    interval: undefined,
    query: {
      job_type: "new_grad",
      is_usa: false,
    },
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
