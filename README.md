# pingpong-node

### 此项目一个轻量的挡板系统。或者说是http接口的mock工具。

+ 用途
	+ mock http接口
	
+ 特性
	+ 基于nodejs
	+ 可以配置请求及对应的返回结果。既可以通过配置文件的方式配置，也可以热配置。在服务启动后，通过页面配置。
	+ 配置基于正则表达式。
	+ 配置项的优先级为配置的顺序。
	+ 支持生成随机序列。
	+ 近支持text/plain类型的Content-Type
	
+ 使用说明
	+ 基于nodejs ,首先安装nodejs。
	+ 端口号配置，修改```pingpong.properties``` 。
	+ 启动直接执行 ``` node main ``` 即可
	+ 通过修改rules.config来修改匹配规则及返回结果。规则与结果使用```:```隔开。或者在启动后通过```/config```页面来配置。(例如:http://127.0.0.1:8080/config ) 。页面提供了新增和删除的功能。<b>在页面上的改动，不会记录到配置文件中，重启服务后丢失。</b>。如下图：
		![](https://github.com/ming-liu/pingpong-node/blob/master/config.png)
	+ 配置的格式分为两部分,第一部分在```[]```中,有2个数字，第一个数字标记返回的类型。0为json,1为xml。这里只是返回的类型，在配置时的返回结果字段，请使用json格式配置。第二个数字标识是否需要在返回结果中增加MD5签名。签名方式为：返回结果集按照字典顺序排序后的querystring格式(stock=000001&amount=23&...),在最后填加SignKey,然后进行MD5签名。签名的结果作为值,键为```sign```，填加到结果集中。
	+ 规则基于正则表达式，匹配的优先级即为插入规则的顺序。举例
		+ 买AAPL时返回{status:0},买GOOGL时返回{status:1},卖MSFT时返回{status:2}。
		+ ```.*buy?stock=AAPL.*:{"status": 0}```
		+ ```.*buy?stock=GOOGL.*:{"status": 1}```
		+ ```.*sell?stock=MSFT.*:{"status": 2}```
	
	
