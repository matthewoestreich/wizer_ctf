import crypto from "crypto";

const key = crypto.createHash("md5").update("svc-telemetry").digest("hex").slice(0, 12);

function xorDecode(encodedBase64, key) {
  const buf = Buffer.from(encodedBase64, "base64");
  const decoded = [...buf].map((byte, i) => 
    String.fromCharCode(byte ^ key.charCodeAt(i % key.length))
  );
  return decoded.join("");
}

const encoded0 = "F0RWCQYHVwEEBglfXAo=";
const encoded1 = "F0RWCQYHVwEEBglfXAo=";
const decoded = xorDecode(encoded1, key);
const dateTimeStr = Number(decoded.split(":")[1]) * 1000;
const decodedBase64 = Buffer.from(decoded).toString("base64");

console.log({decoded,decodedBase64, dateTimeStr,date:new Date(dateTimeStr)});