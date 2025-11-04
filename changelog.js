import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const OUTPUT = path.resolve("./public/changelog.json");

function bumpVersion(version) {
  const [major, minor, patch] = version.replace("v", "").split(".").map(Number);
  let newMajor = major;
  let newMinor = minor;
  let newPatch = patch + 1;

  if (newPatch >= 10) {
    newPatch = 0;
    newMinor += 1;
  }
  if (newMinor >= 10) {
    newMinor = 0;
    newMajor += 1;
  }

  return `v${newMajor}.${newMinor}.${newPatch}`;
}

function generateChangelog() {
  console.log("📦 Generating changelog...");

  const gitLog = execSync(
    `git log --reverse --pretty=format:'{"message":"%s","author":"%an","date":"%cI"},'`
  )
    .toString()
    .trim();

  const jsonString = `[${gitLog.slice(0, -1)}]`;
  const commits = JSON.parse(jsonString);

  let version = "v0.0.0";
  const changelog = [];

  for (const commit of commits) {
    changelog.push({
      version,
      commits: [commit],
    });
    version = bumpVersion(version);
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(changelog, null, 2));
  console.log(`✅ ${commits.length} commits exported to ${OUTPUT}`);
}

generateChangelog();
