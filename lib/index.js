let cluster = require("cluster");
let cpus = require("os").cpus().length;
let domain = require("domain");
module.exports = {
	startServer:function(fun){
		if(cluster.isMaster){
			for(let i = 0;i<cpus;i++){
				cluster.fork();
			}
		}else if(cluster.isWorker){
			fun(cluster);
		};
		cluster.on("fork",(worker)=>{
			console.info('%s %s',new Date(),`worker${worker.process.pid}进程启动成功`)
		});
		cluster.on("exit",(worker,code,signal)=>{
			console.info('%s %s',new Date(),`worker${worker.process.pid}进程退出`);
			for(let id in cluster.workers){
				console.info('%s %s',new Date(),`目前还有worker${worker.process.pid}在工作`);
			}
			if(worker.isDead){
				console.info('%s %s',new Date(),"新进程将在1s后启动");
				setTimeout(()=>{
					cluster.fork();
				},1000)
			}
		})
	},
	clusterDomain:function(options){
		if(!options.killTimeout){
			options.killTimeout = 0;
		};
		if(!options.error){
			options.error = function(res){
				res.send("error request!")
			}
		}
		return function(req,res,next){
			let d = domain.create();
			d.add(req);
			d.add(res);
			d.on("error",(err)=>{
				d._throwErrorCount = (d._throwErrorCount || 0)+1;
				if(d._throwErrorCount>1){
					console.error('[express-cluster-domain] %s %s throw error %d times',req.method,req.url,d._throwErrorCount);
					console.log(err);
					return;
				}
				next(err);
				let killtimer = setTimeout(()=>{
					console.info('%s [worker:%s] will be killed',new Date(),process.pid);
					process.exit(1);
				},options.killTimeout);
				if(cluster.worker){
				   try{
				   	 console.error('%s [worker:%s] will  disconnect',new Date(),process.pid);
				   	  cluster.worker.disconnect();
				   }catch(e){
				   	//TODO handle the exception
				   	  console.error('%s [worker:%s] throw Error\n%s',new Date(),process.pid,e.stack);
				   }
				};
				if(options.error){
					console.log("-------------------------")
					options.error(res)
				}
			});
			d.run(next);
		}
	}
}
