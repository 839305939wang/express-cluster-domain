#express-cluster-domain</br>
##这个模块是解决express中异常处理,下面是example中test的启动步骤</br>
 npm install</br>
 cd example</br>
 node test.js</br>
##使用方法:</br>
let express = require("express");</br>
let app = express();</br>
let ecd = require("express-cluster-domain");</br>
app.use(ecd.clusterDomain({</br>
	killTimeout:1000,</br>
  error:function(err){</br>
     console.log("sorry!request bad!");</br>
  }</br>
}));</br>
app.get("/",(req,res)=>{</br>
	 setTimeout(function(){</br>
	 	if(Math.random()>0.5){</br>
	 		throw new Error("Error from timeout");</br>
	 	}else{</br>
	 		console.log("訪問正常");</br>
	 		res.send("request success!")</br>
	 	}</br>
	 },2000)</br>
});</br>
ecd.startServer(function(){</br>
	app.listen(8080);</br>
})</br>

