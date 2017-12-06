//根据职位名称 ，获取工作类型 ，JAVA，.NET,PHP,NODEJS,UI,C/C++
function getKeywords(jobName,jobDesc){
	var regName = jobName.match(/[a-zA-Z0-9]+/ig);
	var regDesc = jobDesc.match(/[a-zA-Z0-9]+/ig);
	var returnArrange= [];
	if(regName != null){
		for(var i = 0;i < regName.length;i++){
			if(returnArrange.indexOf(regName[i].toLocaleLowerCase()) == -1){
				returnArrange.push(regName[i].toLocaleLowerCase())
			}
		}	
	}
	if(regDesc != null){
		for(var i = 0;i < regDesc.length;i++){
			if(returnArrange.indexOf(regDesc[i].toLocaleLowerCase()) == -1){
				returnArrange.push(regDesc[i].toLocaleLowerCase())
			}
		}	
	}
	
	return returnArrange;
}

function getJobType(jobName,jobDesc){
	var regName = jobName.match(/[a-zA-Z0-9]+/ig);
	if(!regName || regName.length == 0){

	}else{
		for(var i = 0;i < regName.length;i++){
			if(regName[i].toLocaleLowerCase() == "java"){
				return "JAVA";
			}
			if(regName[i].toLocaleLowerCase() == "php"){
				return "PHP";
			}
			if(regName[i].toLocaleLowerCase() == "ui"){
				return "UI";
			}
			if(regName[i].toLocaleLowerCase() == "net"){
				return "NET";
			}
			if(regName[i].toLocaleLowerCase() == "nodejs"){
				return "nodejs";
			}
			if(regName[i].toLocaleLowerCase() == "c++"){
				return "c++";
			}
		}
	}
	
	return "OTHER";
}

exports.getJobType = getJobType;
exports.getKeywords = getKeywords;