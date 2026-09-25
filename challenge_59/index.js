function isMaliciousInput(input) {
	console.log("Checking input for WAF:", input);
	const normalized = input.toLowerCase();

	const wafRegex = new RegExp(
		[
			"(<script)", // block script tags
			"(onerror)", // block image/svg errors
			"(onload)", // block onload
			"(onbegin)", // block SVG animations
			"(svg)", // block svg entirely
			"(animate)", // block animate/set
			"(javascript:)", // block js: URIs
			"(audio)", // block audio autoplay
			"(iframe)", // block iframe/srcdoc
			"(oncanplay)", // block media events
			"(onloadeddata)", // block media load events
		].join("|")
	);

	return wafRegex.test(normalized);
}

const saving = "%3E%3Cdiv/junk=a%3E%3C%%3C%3E00scrip%t%3Ealert(1)";


const input = `oncanplaythrough`;
const result = isMaliciousInput(input);
console.log(result);