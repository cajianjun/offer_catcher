var http=require('http');  
var https=require('https');  
var querystring=require('querystring'); 
function test(){
	//发送 http Post 请求  
	var postData=querystring.stringify({  
	    msg:'中文内容'  
	});  
	var options={  
	   hostname:'www.hzhr.com',  
	   port:80,  
	   path:'/Web/data/web.aspx?method=GetRecruitList&x=0.9409280869142345&key=&jobtype1=19&jobtype2=&area=&updatetime=&trade=01&pay=&kind=&target=&pageSize=10&pageIndex=1&sortOrder=re_modifytime+desc',  
	   method:'POST',
	   headers:{  
	    'Content-Type':'application/x-www-form-urlencoded',  
	    'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',  
	    'Content-Length':0
	   }  
	}  
	var req=http.request(options, function(res) {  
	    console.log('Status:',res.statusCode);  
	    console.log('headers:',JSON.stringify(res.headers));  
	    res.setEncoding('utf-8');  
	    res.on('data',function(chun){  
	        console.log('body分隔线---------------------------------\r\n');  
	        console.info(chun);  
	    });  
	    res.on('end',function(){  
	        console.log('No more data in response.********');  
	    });  
	});  
	req.on('error',function(err){  
	    console.error(err);  
	});  

	req.write(postData);  
	req.end();
} 

function httpreq(options,cb){
	var requestData = options.requestData;
	var req=http.request(options, function(res) {  
	    res.setEncoding('utf-8');  
	    var data = "";
	    res.on('data',function(chun){  
	    	data += chun;
	        // console.log('body分隔线---------------------------------\r\n');  
	        // console.info(chun);  
	    });  
	    res.on('end',function(){  
	    	cb(data);
	        // console.log('No more data in response.********');  
	    });  
	});  
	req.on('error',function(err){  
	    console.error(err);  
	});  
	if(requestData){
		req.write(requestData);  
	}else{
		req.write("");  
	}
	
	req.end();
}
function httpsreq(options,cb){
	var requestData = options.requestData;
	var req=https.request(options, function(res) {  
	    res.setEncoding('utf-8');  
	    var data = "";
	    res.on('data',function(chun){  
	    	data += chun;
	        // console.log('body分隔线---------------------------------\r\n');  
	        // console.info(chun);  
	    });  
	    res.on('end',function(){  
	    	cb(data);
	        // console.log('No more data in response.********');  
	    });  
	});  
	req.on('error',function(err){  
	    console.error(err);  
	});  
	if(requestData){
		req.write(requestData);  
	}else{
		req.write("");  
	}
	req.end();
}

exports.httpreq = httpreq;
exports.httpsreq = httpsreq;
exports.test = test;