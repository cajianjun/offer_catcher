// var path_offerList;
// var path_splitor;
// if(process.platform.indexOf("win") >= 0){
// 	path_splitor = "\\";
// 	path_offerList = "src\\websites\\人才网\\all";

// }else{
// 	path_offerList = "src/websites/人才网/all";
// 	path_splitor = "/";
// }


var COMMON = {

}
//jobtype1=19,trade=01,IT 
//jobtype1=,trade=,ALL
var RCW = {
	catch_list_time:10000,
	offerlist_file_save_path:"src/websites/人才网/all",
	jobtype1:"19",
	trade:"01",
	offer_list_file_name:"offerList_p"
}

exports.COMMON = COMMON;
exports.RCW = RCW;