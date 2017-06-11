/**
 * Created by Admin on 2017/6/10.
 */

module.exports=[{
    route:"/api",
    handle:function(req,res,next,url){
        var Mock=require("mockjs");
        var data=Mock.mock({
            "list|1-8":[{
                "id|+1":1
            }]
        });
        res.writeHead(200,{
            "Content-type":"application/json;charset=utf-8",
            "Access-Control-Allow-Origin":"*"
        });
        res.write(JSON.stringify(data));
        res.end()
    }
}];