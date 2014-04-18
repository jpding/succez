/**
 * 下发数据
 */
function doCopyLastMonthDatas(args){
	var params = args.args;
	var isAnalyse = params.isAnalyse;
	var isDQ = params.isDQ;
	var thisMonth = tostr(today(),'yyyymm');
	println("thisMonth:"+thisMonth);
	var lastMonth =tostr(od(today(),'m-1'),'yyyymm');
	println("lastMonth:"+lastMonth);
	
	var ds = sz.db.getDataSource('default');	
	var hasCopied = "";
	var noCopied = "";
	if (isAnalyse){
		var dataSource = "FACT_XMYXQD";
		/**
		 * FACT_XMYXQD    项目预算清单表
		 * FACT_DQWGDPD   大区完工度评定
		 * FACT_WGXMQKTJB 完工项目情况统计表 
		 */
		//看下大区中是否已经有上个月的值，如果有那么不需要初始化，如果没有，需要从项目预算清单中初始化
		var f = isDQ ? "FACT_DQWGDPD" : "FACT_WGXMQKTJB";
		var result = ds.select("select count(1) from "+f+" where bbq = ?" , lastMonth);
		print("count--------"+result[0][0]);
		if(result != null && result.length != 0 && result[0] != null && result[0].length != 0 && result[0][0] != null && result[0][0]!=0) {
			dataSource = f;
		}else{
			//看预算清单中有没有值
			var result = ds.select("select count(1) from FACT_XMYXQD where bbq = ?" , lastMonth);
			if(result != null && result.length != 0 && result[0] != null && result[0].length != 0 && result[0][0] != null  && result[0][0]==0) {
				return {
					type : "message",
					msg : "没有在预算清单中找到上月的值，无法据此完成下发，请确认！"
				}
			}
		}
		
		//查询是否在当前的表中已经下发过了数据
		var sql = "select t0.XMMC,t0.XMBH,t0.SCQY,t0.XMZCDBM from "+ f +" t0 where " +
				"exists(select 1 from " + dataSource + " where  XMMC=t0.XMMC and " +
				"XMBH=t0.XMBH and SCQY=t0.SCQY and XMZCDBM=t0.XMZCDBM and BBQ=?) and  t0.BBQ=?"
		print("copyedSql--------" + sql);		
		var result = ds.select(sql,[lastMonth,thisMonth]);
	
		if(result != null && result.length != 0 && result[0] != null && result[0].length != 0 && result[0][0] != null) {
			for (var i=0; i<result.length; i++){
				var row = result[i];
				if (row==null) continue;
				var data = [];
				for (var j=0;j<row.length;j++){
					data.push(row[j]);
				}
				hasCopied = hasCopied + data.join(";") + "<br>";
			}
		}
		
		var sql = "select t0.* from " + f +" t0 where " +
				"not exists(select 1 from "+ dataSource +" where  XMMC=t0.XMMC and XMBH=t0.XMBH " +
				"and SCQY=t0.SCQY and XMZCDBM=t0.XMZCDBM and BBQ=?) and  BBQ=?"
		print("noCopyedSql--------" + sql);			
		var result = ds.select(sql,[lastMonth,thisMonth]);
		
		if(result != null && result.length != 0 && result[0] != null && result[0].length != 0 && result[0][0] != null) {
			for (var i=0; i<result.length; i++){
				var row = result[i];
				if (row==null) continue;
				var data = [];
				for (var j=0;j<row.length;j++){
					data.push(row[j]);
				}
				noCopied = noCopied + data.join(";") + "<br>";
			}
		}
	}
	
	if (hasCopied != ""){
		return {
			type : "message",
			hasCopied : hasCopied,
			noCopied : noCopied
		}
	}else{
		var sql = "insert into "+ f +"(" +
					   "XMMC,XMBH,SCQY,XMZCDBM,XMJZZT,ZCDFZR,XMZYS_YSRWE,XMZYS_YSCGWXCB,XMZYS_ZMSR,QNDYJSWGE,QNDYJSMSR," +
				"BNRWMSRZB_SCRWE,BNRWMSRZB_SCMSR,BNRWMSRZB_SJFPMSR,HTZXQK_YQCGHTE,HTZXQK_YQXSHTE,BBQ) " +
				"select XMMC,XMBH,SCQY,XMZCDBM,XMJZZT,ZCDFZR,XMZYS_YSRWE,XMZYS_YSCGWXCB,XMZYS_ZMSR,QNDYJSWGE,QNDYJSMSR," +
				"BNRWMSRZB_SCRWE,BNRWMSRZB_SCMSR,BNRWMSRZB_SJFPMSR,HTZXQK_YQCGHTE,HTZXQK_YQXSHTE,? as BBQ from "+ dataSource +" t0 where " +
				"not exists(select 1 from "+ dataSource +" where XMMC=t0.XMMC and XMBH=t0.XMBH and SCQY=t0.SCQY and" +
				" XMZCDBM=t0.XMZCDBM and BBQ=?) and  BBQ=?" 
		
		print(sql);
		ds.update(sql,[thisMonth,thisMonth,lastMonth]);
		
		/**
		 * 拷贝部门上月评定数据
		 */
		var updateBMLastMonthData = "UPDATE tc SET tc.XMFZR = tl.XMFZR,tc.QNBMCDRWE = tl.QNBMCDRWE	,tc.QNBMCDMSR = tl.QNBMCDMSR	,tc.QNBMXMLJWGL = tl.QNBMXMLJWGL	,tc.QNBMLJWGRWE = tl.QNBMLJWGRWE,tc.QNBMLJWGMSR = tl.QNBMLJWGMSR,tc.QNBMWGKFPMSR = tl.QNBMWGKFPMSR,tc.QNYXXMMSR = tl.QNYXXMMSR,tc.XMBXMLJWGL = tl.XMBXMLJWGL,tc.XMBPDLY = tl.XMBPDLY,tc.DQXMLJWGL = tl.DQXMLJWGL,tc.DQPDLY = tl.DQPDLY FROM FACT_WGXMQKTJB tc,FACT_WGXMQKTJB tl WHERE tc.bbq = '"+thisMonth+"' AND tl.bbq = '"+lastMonth+"' AND tc.xmbh = tl.xmbh AND tc.cdbm = tc.cdbm"
		if(!isDQ){
			println(updateBMLastMonthData);
			ds.update(updateBMLastMonthData);
		}
		
		return {
			type : "success",
			msg : "成功"
		}
	}
}

function doDelete(args){
	var params = args.args;
	var type = params.type;
	var value = params.val;
	var ds = sz.db.getDataSource('default');	
	if (type == "one"){
		ds.update("delete from FACT_XMYXQD where lsh=?",value);		
	        print("lsh----------"+value);
        }
	
	if (type == "all"){
		ds.update("delete from FACT_XMYXQD where bbq=?",value);
	        print("bbq----------"+value);
        }
}