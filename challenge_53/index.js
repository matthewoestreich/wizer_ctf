function isMaliciousInput(input) {
	console.log("Checking input for WAF:", input);
	// prettier-ignore
	const wafRegex = new RegExp(
    [
      '(\\b(SELECT|UNION|INSERT|DELETE|UPDATE|DROP|SCRIPT|ALERT|ONERROR|ONLOAD)\\b',
      '|["();<>\\s]',
      '|--',
      '|\\b(AND|OR)\b(?!/\\*\\*\\/))'
    ].join(''),
    'i'
  );
	return wafRegex.test(input);
}

const input = "admin'/**/OR/**/'1'='1";

const result = isMaliciousInput(input);

console.log({ result });