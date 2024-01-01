import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import dotenv from "dotenv";
import { fetchJobs } from "./queries";
import { Job } from "./types/job.schema";
import { Table } from "./types/table";

dotenv.config();
const APPLY_IMG_URL = process.env.APPLY_IMG_URL;

const HEADERS = ["Company", "Position", "Location", "Posting", "Age"];
const TABLES: Table[] = [
  {
    path: "../../../README.md",
    query: "get_intern_usa",
  },
  {
    path: "../../../INTERN_INTL.md",
    query: "get_intern_intl",
  },
  {
    path: "../../../NEW_GRAD_USA.md",
    query: "get_new_grad_usa",
  },
  {
    path: "../../../NEW_GRAD_INTL.md",
    query: "get_new_grad_intl",
  },
];

function generateMarkdownTable(jobs: Job[]) {
  let table = `| ${HEADERS.join(" | ")} |\n`;

  table += `|${HEADERS.map(() => "---").join("|")}|\n`;

  jobs.forEach((job) => {
    const applyLink =
      job.job_url && job.status === "active"
        ? `<a href="${job.job_url}" target="_blank" rel="noopener noreferrer"><img src="${APPLY_IMG_URL}" alt="Apply" width="80"/></a>`
        : "Closed";

    const row = [
      job.company_url
        ? `<a href="${
            job.company_url
          }" target="_blank" rel="noopener noreferrer"><strong>${
            job.company_name || ""
          }</strong></a>`
        : `<strong>${job.company_name || ""}</strong>`,
      job.job_title || "",
      job.job_locations || "",
      applyLink,
      `${job.age}d`,
    ];
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

async function main() {
  try {
    for (const table of TABLES) {
      const jobs = await fetchJobs(table.query);
      const faangJobs = await fetchJobs(`${table.query}_faang`);

      jobs.sort((a, b) => a.age - b.age);
      faangJobs.sort((a, b) => a.age - b.age);

      const markdownTable = generateMarkdownTable(jobs);
      const faangMarkdownTable = generateMarkdownTable(faangJobs);

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
