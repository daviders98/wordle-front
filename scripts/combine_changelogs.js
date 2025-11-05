import fs from "fs";
import path from "path";

const FRONT_CHANGELOG = path.resolve("./public/changelog.json");
const BACKEND_CHANGELOG = path.resolve("./public/changelog-backend.json");
const OUTPUT = path.resolve("./public/changelog-combined.json");

function combineChangelogs() {
  console.log("🔗 Combining frontend and backend changelogs...");

  if (!fs.existsSync(FRONT_CHANGELOG) || !fs.existsSync(BACKEND_CHANGELOG)) {
    console.error("❌ One or both changelog files are missing.");
    return;
  }

  const frontData = JSON.parse(fs.readFileSync(FRONT_CHANGELOG, "utf-8"));
  const backendData = JSON.parse(fs.readFileSync(BACKEND_CHANGELOG, "utf-8"));

  const frontCommits = frontData.flatMap(entry =>
    entry.commits.map(commit => ({
      ...commit,
      version: entry.version,
      source: "frontend"
    }))
  );

  const backendCommits = backendData.flatMap(entry =>
    entry.commits.map(commit => ({
      ...commit,
      version: entry.version,
      source: "backend"
    }))
  );

  const allCommits = [...frontCommits, ...backendCommits].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  let version = "v0.0.0";
  const changelog = [];
  let currentCommits = [];

  const bumpVersion = (ver) => {
    const [major, minor, patch] = ver.replace("v", "").split(".").map(Number);
    let [maj, min, pat] = [major, minor, patch + 1];
    if (pat >= 10) { pat = 0; min += 1; }
    if (min >= 10) { min = 0; maj += 1; }
    return `v${maj}.${min}.${pat}`;
  };

  for (const commit of allCommits) {
    const isChore = commit.message.startsWith("chore:");
    currentCommits.push(commit);

    if (!isChore) {
      changelog.push({ version, commits: currentCommits });
      version = bumpVersion(version);
      currentCommits = [];
    }
  }

  if (currentCommits.length > 0) {
    changelog.push({ version, commits: currentCommits });
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(changelog, null, 2));

  console.log(`✅ Combined changelog with ${allCommits.length} commits written to ${OUTPUT}`);
}

combineChangelogs();
