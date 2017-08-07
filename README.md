#express-cluster-domain</br>
##这个模块是解决express中异常处理,下面是example中test的启动步骤</br>
 npm install</br>
 cd example</br>
 node test.js</br>
##使用方法:</br>
<pre><code>
       let express = require("express");
	let app = express();
	let ecd = require("express-cluster-domain");
	app.use(ecd.clusterDomain({
		killTimeout:1000,
	  error:function(err){
	     console.log("sorry!request bad!");
	  }</br>
	}));</br>
	app.get("/",(req,res)=>{
		 setTimeout(function(){
			if(Math.random()>0.5){
				throw new Error("Error from timeout");
			}else{
				console.log("訪問正常");
				res.send("request success!")
			}</br>
		 },2000)</br>
	});</br>
	ecd.startServer(function(){</br>
		app.listen(8080);</br>
	})</br>
</code></pre>


