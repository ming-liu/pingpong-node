console.log('hello pingpong-node');

var FORMAT_JSON = "0";
var FORMAT_XML = "1";
var SIGN = "1";

var http = require("http");
var url = require("url");
var fs = require("fs")
var query = require("querystring"); //解析POST请求
var random = require('./random');
var sign = require('./sign');

var mapIndex = 0;
var config_port = initPort();
var configs = initConfig();
var html = initHtml();

http.createServer(function(request,response) {
	var path = url.parse(request.url).path;
	var responseBody;
	if(path == "/config") {
		response.writeHead(200,{'Content-Type': 'text/html'});
		responseBody = config();
	} else if(path == "/save") {
		save(request,response);
	} else if(path.indexOf("/delete") != -1) {
		del(path.substring(1),response);
	} else if(path.indexOf("css") != -1) {
		responseBody = static(path.substring(1),response);
	} else {
		response.writeHead(200,{'Content-Type': 'text/plain'});	
		responseBody = dispatch(path);
	}
	
	if(responseBody != null) {
		response.end(responseBody);
	}
}).listen(config_port);

console.log('server started at 127.0.0.1:'+ config_port);

/** 
 * 静态服务器
 */
function static(path,response) {
	fs.exists(path,function(exists){
		if(exists) {
			var data = fs.readFileSync(path);
			response.writeHead(200, {'Content-type' : 'text/css'});
 			response.write(data);
 			response.end();			
		}
	});
	return null;
}

/**
 * 配置页面
 */
function config() {
	var result = "<div><table><tr><th>编号</th><th>规则(正则表达式)</th><th>返回格式</th><th>签名</th><th>返回结果</th><th>操作</th></tr>";
	var index = 0;
	for(var each in configs) {
		result += '<tr><td>' + index + "</td><td>";
		result += each.substring(7);
		result += '</td><td>';
		result += returnType(each.substring(4,5));
		result += '</td><td>';
		result += boolStr(each.substring(5,6));
		result += '</td><td>';
		result += configs[each];
		result += '</td><td><input type="button" value="删除" onclick="window.location=\'delete?id=';
		result += index++ + '\'" /></td></tr>';
	}
	result += '</table></div>';
	result += html;
	return result;
}

/**
 * 返回类型
 */
function returnType(type) {
	if (type == 1) {
		return "xml";
	}
	return "json";
}

function boolStr(value) {
	if(value == 1) {
		return "是";
	}
	return "否";
}

function save(request,response) {
	var postdata = "";
	request.on('data', function(data) { postdata += data; });
	//POST结束输出结果
    request.addListener("end",function(){
	    var params = query.parse(postdata);
	    var key = "[" + params["ft"] + params["sn"] + "]" + params["r"];
	    configs[indexStr(mapIndex++) + key] = params["resp"];
	    console.log(configs);
	    response.writeHead(301, {
        	location:"config"
      	});
	    response.end();
    });
}

function del(path,response) {
	var delIndex = path.substring(10);
	var index = 0;
	for(var each in configs) {
		if (index++ == delIndex) {
			delete configs[each];
			break;	
		}
	}
	response.writeHead(301, {location:"config"});
	response.end();
}

function dispatch(path) {
	var responseBody = 'pingpong';

	for(var each in configs) {
		if (path.match(each.substring(7))) {
			var type = each.substring(4,5);
			var signable = each.substring(5,6);
			
			responseBody = random.replace(configs[each]);
			if (SIGN == signable) {
				var returnRule = JSON.parse(responseBody);
				returnRule = sign.sign(returnRule);
				responseBody = JSON.stringify(returnRule);
			}
			if (FORMAT_XML == type) {
				var xmlBuf = "<root>";
				for(var each in returnRule) {
					xmlBuf += "<" + each + ">";
					xmlBuf += returnRule[each];
					xmlBuf += "</" + each + ">";
				}
				xmlBuf += "</root>";
				responseBody = xmlBuf;
				console.log(responseBody);
			}
			break;	
		}
	}
	return responseBody;
}

function initHtml() {
	return fs.readFileSync("op.html").toString();
}

function initConfig() {
	var map = new Object();
	var lines = fs.readFileSync("rules.config").toString().split(require('os').EOL);
	for (mapIndex = 0; mapIndex < lines.length; mapIndex++) {
		var line = lines[mapIndex];
		var index = line.indexOf(":");
		var key = indexStr(mapIndex) + line.substring(0,index);
		map[key] = line.substring(index+1);
		//console.log(JSON.parse(map[key]));
	}
	console.log(map);
	//console.log(map.keys);
	return map;
}

function initPort() {
	return fs.readFileSync("pingpong.properties").toString().split(require('os').EOL)[0].split(":")[1];
}

function indexStr(value) {
	if(value < 10) {
		return "00" + value;
	} else if (value < 100) {
		return "0" + value;
	}
	return value;
}

