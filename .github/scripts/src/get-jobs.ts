import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import dotenv from "dotenv";
import { fetchJobs } from "./queries";
import { JobInfo } from "./types/job.schema";
import { Table } from "./types/table";

dotenv.config();
const APPLY_IMG_URL = process.env.APPLY_IMG_URL;

const HEADERS = ["Company", "Position", "Location", "Posting", "Age"];
const TABLES: Table[] = [
  {
    path: "../../../README.md",
    query: "get_intern_usa",
    faangSalary: true,
    interval: "hr",
  },
  {
    path: "../../../NEW_GRAD_USA.md",
    query: "get_new_grad_usa",
    faangSalary: true,
    interval: "yr",
  },
  {
    path: "../../../INTERN_INTL.md",
    query: "get_intern_intl",
    faangSalary: false,
  },
  {
    path: "../../../NEW_GRAD_INTL.md",
    query: "get_new_grad_intl",
    faangSalary: false,
  },
];

function generateMarkdownTable(
  jobs: JobInfo[],
  faangSalary?: boolean,
  interval: string = "yr"
) {
  const headers = faangSalary
    ? [...HEADERS.slice(0, 3), "Salary", ...HEADERS.slice(3)]
    : HEADERS;

  let table = `| ${headers.join(" | ")} |\n`;
  table += `|${headers.map(() => "---").join("|")}|\n`;

  jobs.forEach((job) => {
    const applyCell =
      job.job_url && job.status === "active"
        ? `<a href="${job.job_url}" target="_blank" rel="noopener noreferrer"><img src="${APPLY_IMG_URL}" alt="Apply" width="70"/></a>`
        : "Closed";

    const companyCell = job.company_url
      ? `<a href="${
          job.company_url
        }" target="_blank" rel="noopener noreferrer"><strong>${
          job.company_name || ""
        }</strong></a>`
      : `<strong>${job.company_name || ""}</strong>`;

    const row = [
      companyCell,
      job.job_title || "",
      job.job_locations || "",
      applyCell,
      `${job.age}d`,
    ];

    if (faangSalary && "salary" in job) {
      const salary =
        job.salary >= 1000
          ? `${(job.salary / 1000).toFixed(0)}k`
          : job.salary.toString();

      const salaryCell = `$${salary}/${interval}`;
      row.splice(3, 0, salaryCell);
    }

    table += `| ${row.join(" | ")} |\n`;
  });

  return table;
}

function updateReadme(table: string, faangTable: string, filePath: string) {
  const readmePath = path.join(__dirname, filePath);
  let readmeContent = fs.readFileSync(readmePath, "utf8");

  const startMarker = "<!-- TABLE_START -->";
  const endMarker = "<!-- TABLE_END -->";
  const faangStartMarker = "<!-- TABLE_FAANG_START -->";
  const faangEndMarker = "<!-- TABLE_FAANG_END -->";

  const beforeFaang = readmeContent.split(faangStartMarker)[0];
  const afterFaang = readmeContent.split(faangEndMarker)[1];

  readmeContent = `${beforeFaang}${faangStartMarker}\n${faangTable}\n${faangEndMarker}${afterFaang}`;

  const beforeOther = readmeContent.split(startMarker)[0];
  const afterOther = readmeContent.split(endMarker)[1];

  readmeContent = `${beforeOther}${startMarker}\n${table}\n${endMarker}${afterOther}`;

  fs.writeFileSync(readmePath, readmeContent);
}

function sortJobs(a: JobInfo, b: JobInfo) {
  if (a.status === "active" && b.status !== "active") {
    return -1;
  }
  if (a.status !== "active" && b.status === "active") {
    return 1;
  }
  return a.age - b.age;
}

async function main() {
  try {
    for (const table of TABLES) {
      const jobs = await fetchJobs(table.query);
      const faangJobs = await fetchJobs(
        `${table.query}_faang`,
        table.faangSalary
      );

      jobs.sort(sortJobs);
      faangJobs.sort(sortJobs);

      const markdownTable = generateMarkdownTable(jobs);
      const faangMarkdownTable = generateMarkdownTable(
        faangJobs,
        table.faangSalary,
        table.interval
      );

      updateReadme(markdownTable, faangMarkdownTable, table.path);
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed("An unknown error occurred");
    }
  }
}

main();
