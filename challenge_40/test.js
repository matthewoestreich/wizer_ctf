function parse(api) {
  let apiName = api.indexOf(".") >= 0 ? api.substring(0, api.lastIndexOf(".")) : api;
	apiName = apiName.replaceAll("/", "").replaceAll("#", "").replaceAll("?", "");
	
  let verb = api.substring(api.lastIndexOf(".") + 1);
	if (verb === apiName) {
		verb = "POST";
	}

  const requireAuthentication = ["getuser", "getcompany"];
  if (requireAuthentication.includes(apiName.toLowerCase())) {
    console.log({step: 1, status: "FAIL", apiName, verb});
  } else {
    console.log({step:1, status: "PASS", apiName, verb})
  }

  apiName = api.replaceAll(".POST", "").replaceAll(".GET", "");
  console.log({step: 2, apiName})
}

let apiStr = ".POSTgetuser/crmentites.POST";
parse(apiStr)