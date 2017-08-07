let express = require("express");
let app = express();
let ecd = require("../index");
app.use(ecd.clusterDomain({
	killTimeout:1000,
	error:function(res){
		res.send("sorry!!")
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
