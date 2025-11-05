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

  const combined = {};

  for (const entry of frontData) {
    const { version, commits } = entry;
    combined[version] = combined[version] || { version, front: [], backend: [] };
    combined[version].front.push(...commits);
  }

  for (const entry of backendData) {
    const { version, commits } = entry;
    combined[version] = combined[version] || { version, front: [], backend: [] };
    combined[version].backend.push(...commits);
  }

  const sortedVersions = Object.values(combined).sort((a, b) => {
    const vA = a.version.replace("v", "").split(".").map(Number);
    const vB = b.version.replace("v", "").split(".").map(Number);
    for (let i = 0; i < 3; i++) {
      if (vA[i] !== vB[i]) return vA[i] - vB[i];
    }
    return 0;
  });

  fs.writeFileSync(OUTPUT, JSON.stringify(sortedVersions, null, 2));
  console.log(`✅ Combined changelog written to ${OUTPUT}`);
}

combineChangelogs();
