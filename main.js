console.log('hello pingpong-node');

var http = require("http");
var url = require("url");
var fs = require("fs")
var query = require("querystring"); //解析POST请求
var random = require('./random');

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
	var result = "<div><table><tr><th>编号</th><th>规则(正则表达式)</th><th>返回结果</th><th>操作</th></tr>";
	var index = 0;
	for(var each in configs) {
		result += '<tr><td>' + index + "</td><td>";
		result += each;
		result += '</td><td>';
		result += configs[each];
		result += '</td><td><input type="button" value="删除" onclick="window.location=\'delete?id=';
		result += index++ + '\'" /></td></tr>';
	}
	result += '</table></div>';
	result += html;
	return result;
}

function save(request,response) {
	var postdata = "";
	request.on('data', function(data) { postdata += data; });
	//POST结束输出结果
    request.addListener("end",function(){
	    var params = query.parse(postdata);
	    configs[params["r"]] = params["resp"];


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
		if (path.match(each)) {
			responseBody = random.replace(configs[each]);
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
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		var index = line.indexOf(":");
		map[line.substring(0,index)] = line.substring(index+1);
	}
	return map;
}

function initPort() {
	return fs.readFileSync("pingpong.properties").toString().split(require('os').EOL)[0].split(":")[1];
}

