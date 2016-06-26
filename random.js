function get(num) {
	var rad = Math.random() * 10;
	if(rad < 1) {
		rad += 1;
	}
	rad *= Math.pow(10,num - 1);
	rad = Math.floor(rad);
	return rad;
}

function replace(value) {
	var randomIndex = value.indexOf("random(");
	if (randomIndex != -1) {
		var randomEndIndex = value.indexOf(")",randomIndex);
		if(randomEndIndex != -1) {
			var randomStr = get(value.substring(randomIndex + 7,randomEndIndex));
			value = value.substring(0,randomIndex) + randomStr + value.substring(randomEndIndex+1);
			value = replace(value);
		}
	}	
	return value;
}
module.exports.get = get;
module.exports.replace = replace;