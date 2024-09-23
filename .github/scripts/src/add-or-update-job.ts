import * as core from "@actions/core";
import * as github from "@actions/github";
import dotenv from "dotenv";
import { addNewJob, updateJob } from "./mutations";

dotenv.config();
const GIT_USER_NAME = process.env.GIT_USER_NAME;
const GIT_USER_EMAIL = process.env.GIT_USER_EMAIL;

function parseIssueBody(issueBody: string) {
  const extractData = (regex: RegExp, text: string) => {
    const match = text.match(regex);
    const data = match ? match[1].trim() : null;
    return data === "_No response_" || data === "None" ? null : data;
  };

  const jobTitleRegex = /### Position Title\r?\n\r?\n(.+?)\r?\n\r?\n###/s;
  const jobUrlRegex =
    /### Position Application Link\r?\n\r?\n(.+?)\r?\n\r?\n###/s;
  const companyNameRegex = /### Company Name\r?\n\r?\n(.+?)\r?\n\r?\n###/s;
  const companyUrlRegex = /### Company Link\r?\n\r?\n(.+?)\r?\n\r?\n###/s;
  const locationRegex = /### Location\r?\n\r?\n(.+?)\r?\n\r?\n###/s;
  const typeRegex =
    /### Is this a new grad position or an internship\?\r?\n\r?\n(.+?)\r?\n\r?\n###/s;
  const usaRegex =
    /### Is this position based in the USA\?\r?\n\r?\n(.+?)\r?\n\r?\n###/s;
  const statusRegex =
    /### Is this position accepting applications\?\r?\n\r?\n(.+?)\r?\n\r?\n###/s;
  const githubEmailRegex =
    /### Your GitHub Email\r?\n\r?\n(.+?)(\r?\n\r?\n###|$)/s;

  const jobTitle = extractData(jobTitleRegex, issueBody);
  const jobUrl = extractData(jobUrlRegex, issueBody);
  const companyName = extractData(companyNameRegex, issueBody);
  const companyUrl = extractData(companyUrlRegex, issueBody);
  const location = extractData(locationRegex, issueBody);
  const type = extractData(typeRegex, issueBody);
  const usa = extractData(usaRegex, issueBody);
  const status = extractData(statusRegex, issueBody);
  const githubEmail = extractData(githubEmailRegex, issueBody);

  return {
    jobTitle,
    jobUrl,
    companyName,
    companyUrl,
    location,
    type,
    usa,
    status,
    githubEmail,
  };
}

async function main() {
  try {
    const context = github.context;

    if (context.payload.issue) {
      const issue = context.payload.issue;
      const username = issue.user.login;
      const labelNames = issue.labels.map(
        (label: { name: string }) => label.name
      );
      const formInputs = parseIssueBody(issue.body || "");

      if (
        labelNames.includes("new") &&
        formInputs.jobTitle &&
        formInputs.jobUrl &&
        formInputs.companyName &&
        formInputs.companyUrl &&
        formInputs.location &&
        formInputs.type &&
        formInputs.usa
      ) {
        await addNewJob(
          formInputs.jobUrl,
          formInputs.jobTitle,
          formInputs.companyName,
          formInputs.companyUrl,
          formInputs.location,
          formInputs.type === "New Grad" ? "new_grad" : "intern",
          formInputs.usa === "Yes, it's based in the USA."
        );
        core.setOutput("commit_message", "chore: add new position");
      } else if (labelNames.includes("update") && formInputs.jobUrl) {
        await updateJob(
          formInputs.jobUrl,
          formInputs.jobTitle,
          formInputs.companyName,
          formInputs.companyUrl,
          formInputs.location,
          formInputs.type
            ? formInputs.type === "New Grad"
              ? "new_grad"
              : "intern"
            : null,
          formInputs.usa
            ? formInputs.usa === "Yes, it's based in the USA."
            : null,
          formInputs.status
            ? formInputs.status === "Yes, it's available."
              ? "active"
              : "inactive"
            : null
        );
        core.setOutput("commit_message", "chore: update position");
      }

      if (formInputs.githubEmail) {
        core.setOutput("git_user_email", formInputs.githubEmail);
        core.setOutput("git_user_name", username);
      } else {
        core.setOutput("git_user_name", GIT_USER_NAME);
        core.setOutput("git_user_email", GIT_USER_EMAIL);
      }
    }
  } catch (error) {
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    core.setFailed(errorMessage);
    core.setOutput("error", errorMessage);
  }
}

main();
