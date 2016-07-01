var crypto = require("crypto");
var signKey = "kk";

function sign(map) {
	var index = 0;
	var array = new Array();
	for(var key in map) {
		array[index++] = key;
	}
	array.sort();
	var signStr = "";
	for (var i = 0; i < array.length; i++) {
		signStr += "&" + array[i] + "=" + map[array[i]] ;
	}
	signStr = signStr.substring(1) + signKey;
	var md5 = crypto.createHash("md5").update(signStr).digest('hex');
	map["sign"] = md5;
	return map;
}
module.exports.sign = sign;
