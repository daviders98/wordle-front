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
    `git log --reverse --pretty=format:'{"message":"%s","author":"%an","date":"%cI"},'`,
  )
    .toString()
    .trim();

  if (!gitLog) {
    console.log("⚠️ No commits found.");
    return;
  }

  const jsonString = `[${gitLog.slice(0, -1)}]`;
  const commits = JSON.parse(jsonString);

  let version = "v0.0.0";
  const changelog = [];
  let currentVersionCommits = [];

  for (const commit of commits) {
    const isChore = commit.message.startsWith("chore:");

    currentVersionCommits.push(commit);

    if (!isChore) {
      changelog.push({
        version,
        commits: currentVersionCommits,
      });

      version = bumpVersion(version);
      currentVersionCommits = [];
    }
  }

  if (currentVersionCommits.length > 0) {
    changelog.push({
      version,
      commits: currentVersionCommits,
    });
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(changelog, null, 2));

  console.log(`✅ ${commits.length} commits exported to ${OUTPUT}`);
}

generateChangelog();
