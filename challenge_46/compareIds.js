import fs from "node:fs";

const firstIds = JSON.parse(fs.readFileSync("./ids.json"));
const secondIds = JSON.parse(fs.readFileSync("./ids-2.json"));

for (let i = 0; i < firstIds.length; i++) {
  const f = firstIds[i];
  const s = secondIds[i];
  if (f.email !== s.email) {
    console.log(`emails don't match ${f.email} | ${s.email}`);
    break;
  }
  if (f.id === s.id) {
    console.log(`found matching ids!!!`, f, s);
  }
}