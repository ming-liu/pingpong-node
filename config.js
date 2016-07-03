var fs = require("fs")
var configs = init();

function init() {
	var loadConfig = {};
	var properties = fs.readFileSync("pingpong.properties").toString().split(require('os').EOL);
	for (var i = 0; i < properties.length; i++) {
		var pair = properties[i].split(":");
		loadConfig[pair[0]] = pair[1];
	}
	return loadConfig;
}

function get(key) {
	return configs[key];
}

module.exports.get = get;
