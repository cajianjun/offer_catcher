//huzhou rencia wang
//http://www.hzhr.com/Web/data/web.aspx?method=GetRecruitList&x=0.5514678034878977&key=&jobtype1=19&jobtype2=&area=&updatetime=&trade=01&pay=&kind=&target=&pageSize=10&pageIndex=0
//&sortOrder=re_modifytime+desc
var server = require("../../curl");
var config = require("../../config");
var querystring=require('querystring'); 
var fs = require('fs');
//common
var OFFER_LIST_FILE_NAME;

var path_offerList;
var trade ;
var jobtype1;
var jiange_time;



function execute(){
	//init config
	path_offerList = config.RCW.offerlist_file_save_path;
	trade = config.RCW.trade;
	jobtype1 = config.RCW.jobtype1;
	OFFER_LIST_FILE_NAME = config.RCW.offer_list_file_name;
	jiange_time = config.RCW.catch_list_time;
	
	// collectCommpanys();
	 getOfferList();
}
//save companys 2 db
function collectCommpanys(){
	// "re_cuno": 149974,
	var companysIdArr = [];
	var companysNameArr = [];
	var files = fs.readdirSync(path_offerList);
	for(var i = 0; i < files.length;i++){
		if(files[i].indexOf(OFFER_LIST_FILE_NAME) > -1){
			console.log("saveing " + files[i]);
			var fileData = fs.readFileSync(path_offerList + "/"+ files[i],"utf8");
			var pageObj = JSON.parse(fileData);
			var offerList = pageObj.data;
			for(var ii = 0;ii < offerList.length;ii++){
				if(companysIdArr.indexOf(offerList[ii].re_cuno) == -1){
					companysIdArr.push(offerList[ii].re_cuno);
					companysNameArr.push(offerList[ii].cu_name);
					console.log("add a new company,name" + offerList[ii].cu_name + ",id=" + offerList[ii].re_cuno);	
				}
			}
		}
	}
	for(var i=0;i< companysIdArr.length;i++){
		console.log("show ........name" + companysNameArr[i] + ",id=" + companysIdArr[i]);	
	}

}

//get offerlist 2 files
var totalPages = 1000;
var curPage = 0;
var postData={  
	    method:'GetRecruitList',
	    x:"",
	    key:"",
	    jobtype1:"19",
	    jobtype2:"",
	    area:"",
	    updatetime:"",
	    trade:"01",
	    pay:"",
	    kind:"",
	    target:"",
	    pageSize:10,
	    pageIndex:0

	};  



function getOfferList(){
	var getTotalPage = function(firstPageData){
		totalPages = firstPageData.pcount;
		//每间隔5秒钟获取List信息
		var taskList;
		var task = function(){
			if(curPage >= totalPages){
				clearInterval(taskList);
				return ;
			}
			var f = function(data,page){
				wirteCompany2File(path_offerList + "/" +OFFER_LIST_FILE_NAME + page + ".txt",JSON.stringify(data),false);
			}
			getOfferListByPage(curPage,f);
			curPage ++;
		} 
		taskList = setInterval(task,jiange_time);
	}
	getOfferListByPage(curPage,getTotalPage);
}
function wirteCompany2File(filepath,content,append){
	if(append){
		fs.appendFileSync(filepath,content + "\r\n","utf8");
	}else{
		fs.writeFileSync(filepath,content,"utf8");
	}
}
function getOfferListByPage(page,cb){
	postData.x = Math.random();

	//jobtype1,trade工种筛选条件
	postData.jobtype1 = jobtype1;
	postData.trade = trade;

	postData.pageSize = 10;
	postData.pageIndex = page;
	var postDataStr=querystring.stringify(postData);  
	var path = '/Web/data/web.aspx?' + postDataStr + "&sortOrder=re_modifytime+desc";
	console.log(path);
	var options={  
	   hostname:'www.hzhr.com',  
	   port:80,  
	   path:path,  
	   method:'POST',
	   requestData: postDataStr,
	   headers:{  
	    'Connection': 'keep-alive', 
	    'Content-Length':0,  
	    'Accept': '*/*',
	    'Origin':'http://www.hzhr.com',
	    'X-Requested-With':'XMLHttpRequest',
	    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
	    'Referer':'http://www.hzhr.com/Web/Company/List.html',
	    // 'Accept-Encoding':'gzip, deflate',
	    'Accept-Language':'zh-CN,zh;q=0.9',
	    'Cookie':'ASP.NET_SessionId=1hvpbk45ulasc455rvmyglrm'
	   }  
	}  
	server.httpreq(options,function(data){
		console.log("get offer list,at page=" + curPage);
		try{
			var dataObj = JSON.parse(data);
			cb(dataObj,page);	
		}catch(e){
			console.log("parse err" + data);
		}
	});
}

exports.execute = execute;