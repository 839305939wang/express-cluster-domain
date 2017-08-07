# express-cluster-domain
#这个模块是解决express中异常处理,下面是example中test的启动步骤
 npm install
 cd example
 node test.js
#使用方法:
let express = require("express");
let app = express();
let ecd = require("express-cluster-domain");
app.use(ecd.clusterDomain({
	killTimeout:1000,
  error:function(err){
     console.log("sorry!request bad!");
  }
}));
app.get("/",(req,res)=>{
	 setTimeout(function(){
	 	if(Math.random()>0.5){
	 		throw new Error("Error from timeout");
	 	}else{
	 		console.log("訪問正常");
	 		res.send("request success!")
	 	}
	 },2000)
});
ecd.startServer(function(){
	app.listen(8080);
})

