//huzhou rencia wang
//http://www.hzhr.com/Web/data/web.aspx?method=GetRecruitList&x=0.5514678034878977&key=&jobtype1=19&jobtype2=&area=&updatetime=&trade=01&pay=&kind=&target=&pageSize=10&pageIndex=0
//&sortOrder=re_modifytime+desc
const cheerio = require("cheerio");
var server = require("../../curl");
var config = require("../../config");
var querystring=require('querystring'); 
var fs = require('fs');
var common = require("../common");
var dbHelper = require("../db/mysqlHelper")
var async = require('async');
//common
var OFFER_LIST_FILE_NAME;

var path_offerList;
var trade ;
var jobtype1;
var jiange_time;
var platform_id;
var companyIds = [];

function end(){
	console.log("task finish!!!!!!!!!!!!!!");
	dbHelper.DISCONN();
}

function genOptions(path,method){
	var options={  
	   hostname:'www.hzhr.com',  
	   port:80,  
	   path:path,  
	   method:method,
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
	return options;
}

function execute(){
	//init config
	path_offerList = config.RCW.offerlist_file_save_path;
	trade = config.RCW.trade;
	jobtype1 = config.RCW.jobtype1;
	OFFER_LIST_FILE_NAME = config.RCW.offer_list_file_name;
	jiange_time = config.RCW.catch_list_time;
	platform_id = 1;
	// dbHelper.test();
	// var insertSQL = "INSERT INTO company(name,address,contractor,phone,email,website,jsonArr) values(?,?,?,?,?,?,?) ";
	// var insertParam = ["科技公司","湖州","张三","15068747880","1030833228@qq.com","http://baidu.com","{}"];
	// dbHelper.INSERT(insertSQL,insertParam,function(){
	// 	console.log("1111111");
	// 	dbHelper.INSERT(insertSQL,insertParam,function(){
	// 		console.log("2222222");
	// 		dbHelper.DISCONN();
	// 	});
	// });
	

	// var arr = ["A","B","C","D","E","F"];
	// var funcArr = [];
	// var arrLength = arr.length;
	// for(var i = 0;i <arr.length;i++){
	// 	var tmpC = arr[i];
	// 	var func =  function(cbb){
	// 		cbb(null,arr.pop());
	// 	}
	// 	funcArr.push(func);
	// }
	// async.parallel(funcArr,
	// function(err, results){
	// 	console.log(results);
	// });


	companyIds = collectCommpanys();
	if(companyIds.length > 0){
		saveCompany2DB(companyIds.pop());	
	}
	
	 // getOfferList();
}
//save companys 2 db
function collectCommpanys(){
	// "re_cuno": 149974,
	var companysIdArr = [];
	// var companysArr = [];
	var files = fs.readdirSync(path_offerList);
	for(var i = 0; i < files.length;i++){
		if(files[i].indexOf(OFFER_LIST_FILE_NAME) > -1){
			console.log("parsing " + files[i]);
			var fileData = fs.readFileSync(path_offerList + "/"+ files[i],"utf8");
			var pageObj = JSON.parse(fileData);
			var offerList = pageObj.data;
			for(var ii = 0;ii < offerList.length;ii++){
				if(companysIdArr.indexOf(offerList[ii].re_cuno) == -1){
					companysIdArr.push(offerList[ii].re_cuno);
					// companysNameArr.push(offerList[ii].cu_name);
					// console.log("add a new company,name" + offerList[ii].cu_name + ",id=" + offerList[ii].re_cuno);	
				}
			}
		}
	}
	return companysIdArr;
}

function saveCompany2DB(curId){
	var path = "http://www.hzhr.com/Web/Company/" + curId + ".html";
	var options=genOptions(path,"GET");
	server.httpreq(options,function(data){
		console.log("get company info html");
		try{
			// var dataObj = JSON.parse(data);
			parseAndSaveCompanyInfo(data,curId);
		}catch(e){
			console.log("parse err" + e);
		}
	});  
}
function saveJob2DB(jobsArr,companyId,cb){
	var parseJobFunArr = [];
	var jobArrLength = jobsArr.length;
	for(var i =0;i < jobArrLength;i++){
		var tmpFun = function(cbb){
			// ../Job/152028.html
			var tmpurl = jobsArr.pop();
			console.log("parseing job" + tmpurl)
			var tmpPath = tmpurl.substring(3)
			var path = "http://www.hzhr.com/Web/" + tmpPath;
			var options=genOptions(path,"GET");
			server.httpreq(options,function(data){
				console.log("get job info html of " + path);
				try{
					var $ = cheerio.load(data);
					var jobObj = {};
					var jobName = $("#ontent1 tr").eq(2).children().eq(0).text().trim().replace("招聘职位：","");
					var salary = $("#ontent1 tr").eq(3).children().eq(1).text().trim().replace("薪金待遇：","");
					var school = $("#ontent1 tr").eq(5).children().eq(0).text().trim().replace("学历要求：","");
					var jobDesc = $("#ontent1 .com_title").eq(0).next().text().trim();
					var jobType = common.getJobType(jobName,jobDesc);
					var keywords = common.getKeywords(jobName,jobDesc);
					jobObj.job_name = jobName;
					jobObj.job_type = jobType;
					jobObj.keywords = JSON.stringify(keywords);
					jobObj.school = school;

					var salaryArr = salary.split("~");
					if(salaryArr.length == 2){
						jobObj.salary_f = salaryArr[0];
						jobObj.salary_t = salaryArr[1];
					}else{
						jobObj.salary_f = salaryArr[0];
						jobObj.salary_t = salaryArr[0];
					}
					//TODO PARSE job
					cbb(null,jobObj);
				}catch(e){
					console.log("parse job err" + e + ",path=" + path);
				}
			});  
			
		}
		parseJobFunArr.push(tmpFun);
	}
	async.parallel(parseJobFunArr,
	function(err, results){
		console.log("jobArr json=" + JSON.stringify(results))
		var insertSQL  = "INSERT INTO jobs(company_id,job_name,job_type,salary_f,salary_t,keywords,school)" +
		" VALUES(?,?,?,?,?,?,?)";
		var insertFuncArr = [];
		var insertParamArr = [];
		for(var i =0;i < results.length;i++){
			var tmpParams = [companyId,results[i].job_name,results[i].job_type
			,results[i].salary_f,results[i].salary_t,results[i].keywords
			,results[i].school];
			insertParamArr.push(tmpParams);
		}

		for(var i =0;i < results.length;i++){
			var tmpFunc = function(cbb){
				var paramsArr = insertParamArr.pop();
				console.log("params=" + paramsArr);
				dbHelper.INSERT(insertSQL,paramsArr,function(resultId){
			  		//do save jobs
			  		//now let us only save company first
			  		console.log("jobName= " + paramsArr[1] + " saved!");
			  		cbb(null,"ok");
			  	});
			}
			insertFuncArr.push(tmpFunc);
		}

		async.parallel(insertFuncArr,function(err,results){
			console.log("job of this company saved,companyid=" + companyId);
			cb();
		})
	});
}
function parseAndSaveCompanyInfo(data,curId){
	var $ = cheerio.load(data);
	//公司名称
	var companyName = $(".com_h1").text();
	//联系人
	var contractor = $(".company_con li").eq(0).text()
	//联系电话
	var phone = $(".company_con li").eq(1).text()
	//传真
	var fax = $(".company_con li").eq(2).text()
	//联系邮箱
	var email = $(".company_con li").eq(3).text()
	//联系地址
	var address = $(".company_con li").eq(4).text()
	//公司网址
	var website = $(".company_con li").eq(5).text()
	//简介
	var desc = $(".com_title").next().eq(0).text()

	var jobsUrlArr = [];
	for(var i = 0; ;i++){
		var url = $(".com_list a").eq(i).attr("href");
		if(url){
			jobsUrlArr.push(url)
		}else{
			break;
		}
	}

	var  addSql = 'INSERT INTO company(name,address,contractor,phone,email,website,fax,introduce,platform_id,thirdpart_id)'
	+' VALUES(?,?,?,?,?,?,?,?,?,?)';
  	var  addSqlParams = [companyName,
  						 address,
  						 contractor,
  						 phone,
  						 email,
  						 website,
  						 fax,
  						 desc,
  						 platform_id,
  						 curId
  						 ];
  	dbHelper.INSERT(addSql,addSqlParams,function(resultId){
  		//do save jobs
  		//now let us only save company first
  		console.log("companyName=" + companyName + "saved");
		saveJob2DB(jobsUrlArr,resultId,function(){
			if(companyIds.length > 0){
				saveCompany2DB(companyIds.pop());	
			}else{
				end();
			}
		});
  		
  	});
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
	var options=genOptions(path,"POST");
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