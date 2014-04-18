function onBeforeUpdateData(args) {
    var updatefields = args.updatefields;
    updatefields.addField({
                "where" : {
                    "LSH" : "${lsh}"
                },
                "table" : "FACT_WGXMQKTJB",
                "value" : "2",
                "fieldName" : "STATE_"
            });
}

function lock_(lsh){
	var ds = sz.db.getDataSource("ZCSWSJ");
	ds.update("update FACT_WGXMQKTJB set LOCK_='1' where LSH="+lsh);
}



${case when $user.isRole('部门') then 
         "xmlb.cdbm='"+$user.org.name +"' and " + case when zt=1 then "(xmlb.state_='1' or xmlb.state_ is null)" when zt=2 then "xmlb.state_!='1'" else "1=1"  end  
       when $user.isRole('大区') then 
         "xmlb.SSSCQY='"+$user.org.name +"' and " + case when zt=1 then "xmlb.state_='2'" when zt=2 then "xmlb.state_>'2'"  else "1=1"  end
       when $user.isRole('项目') then 
          case when zt=1 then "xmlb.state_='3'" when zt=2 then "xmlb.state_>'3'"  else "1=1"  end
       end   
}


$rpt.ondisplay = function($rpt){       
	//初始化可选中行的表格控件
	var $nygk_ynbm = $rpt.getCurrentBodyDom().find("#table1");
	if(sz.commons.SelectableTable){
	    window.nygk_ynbm = sz.commons.SelectableTable.build($nygk_ynbm);
	}
}


$rpt.ondisplayParamPanel = function(){
	window._doCopy = function(){  
		$rpt.rpc({
		    func        : "doCopyLastMonthDatas",
		    args        : {
		       isAnalyse :  true
		    },
		    success : function(feedback) {
		        if (feedback.type === "success"){
		        	alert("保存成功");
		        }else if (feedback.type === "message"){
		        	if (feedback.noCopied == ""){
		        		sz.commons.Alert.show({msg:"经过分析，下列填报任务已经下发过了<br>"+feedback.hasCopied + "<br>，请确认" });
		        		return;
		        	}
		        	
		        	
		        	sz.commons.Confirm.show({
		        		type : sz.commons.Confirm.TYPE.YES_NO_CANCEL,
		        		msg : "经过分析，下列填报任务已经下发过了<br>"+feedback.hasCopied + "<br>还有下列任务没有下发<br>" + feedback.noCopied + "<br>是否继续下发未下发的数据",
		        		onok : function(){
		        			$rpt.rpc({
					           func        : "doCopyLastMonthDatas",
							    args        : {
							       isAnalyse :  false
							    },
				              	success : function(feedback) {
				              		sz.commons.Alert.show({msg:"下发成功" });
				             	}
			        		})
		        		}
		        		
		        	})
		        }
		    }
		});
	}
	
	/**
	 * 锁定
	 */
	window._doLockMonth = function(pkey,type) {
		$rpt.rpc({
		    func: "_doLock",
		    args: {
		      "pkey": pkey,
		      "type": type
		    },
		    success: function(result) {
		      	sz.commons.Alert.show({
					msg:result,
					title:'信息',
					type:sz.commons.Alert.TYPE.INFO
				});
		    }
		})  
	}
}


/**
 * 下发数据
 */
function doCopyLastMonthDatas(args){
	var params = args.args;
	var isAnalyse = params.isAnalyse;
	var thisMonth = tostr(today(),'yyyymm');
	println("thisMonth:"+thisMonth);
	var lastMonth =tostr(od(today(),'m-1'),'yyyymm');
	println("lastMonth:"+lastMonth);
	
	var ds = sz.db.getDataSource('ZCSWSJ');	
	var hasCopied = "";
	var noCopied = "";
	if (isAnalyse){
		var sql = "select XMMC,XMBH,SSSCQY,CDBM from dbo.FACT_WGXMQKTJB t0 where " +
				"exists(select XMMC,XMBH,SSSCQY,CDBM from dbo.FACT_WGXMQKTJB where BBQ=?) and  BBQ=?"
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
		
		var sql = "select t0.* from dbo.FACT_WGXMQKTJB t0 where " +
				"not exists(select * from dbo.FACT_WGXMQKTJB where BBQ=?) and  BBQ=?"
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
		var sql = "insert into FACT_WGXMQKTJB(XMMC,XMBH,SSSCQY,CDBM,XMJD,XMFZR,ZRWE,ZCGWXCB,BMCDRWE,BMCDMSR,BMKFPMSR," +
				"SYPDLJWGL,SYPJLJMSR,BBQ) select XMMC,XMBH,SSSCQY,CDBM,XMJD,XMFZR,ZRWE,ZCGWXCB,BMCDRWE,BMCDMSR,BMKFPMSR," +
				"SYPDLJWGL,SYPJLJMSR,? as BBQ from dbo.FACT_WGXMQKTJB t0 where " +
				"not exists(select * from dbo.FACT_WGXMQKTJB where BBQ=? and LOCK_!='2') and  BBQ=?"
		
		ds.update(sql,[thisMonth,thisMonth,lastMonth]);
		return {
			type : "success",
			msg : "成功"
		}
	}
}


/**
 * 下发数据
 */
function _doLock(args){
	var params = args.args;
	var pkey = params.pkey;
	var type = params.type;
	var ds = sz.db.getDataSource('ZCSWSJ');
	var result = ds.select("select LSH from FACT_WGXMQKTJB where LSH=? and LOCK_>=?",[pkey,type]);
	if (result != null && result[0] != null && result[0][0] != null){
		return "该项目已经被锁定了，不能重复锁定";
	}
	
	ds.update("update FACT_WGXMQKTJB set LOCK_=? where LSH=?",[type,pkey]);
	return "锁定成功";
}


function _isLock(args){
	var ds = sz.db.getDataSource('ZCSWSJ');
	var result = ds.select("select LSH from FACT_WGXMQKTJB where LSH=? and LOCK_>'0' and LOCK_  is not null",[args.lsh]);
	if (result != null && result[0] != null){
		return true;
	}
	
	return false;
}


if(${zt}==1 || (${ (zt==2 && ($user.isRole('大区') || $user.isRole('项目')))?1:0})){
	$rpt.rpc({func        : "_isLock",
		      args:{"lsh":${table1.B4}},
		      success : function(feedback){
		      	debugger;
		      	debugger;
		        if(feedback){
		        	alert("该项目已经锁定，不能被修改!");
		        }else{
		        	$rpt.drill({
	$sys_drillto:"${case when $user.isRole("部门") then 'ZCSWSJ:/analyses/bmpdtcb'
	 when $user.isRole("大区") then 'ZCSWSJ:/analyses/dqpdtcb'
	  when $user.isRole("项目") then 'ZCSWSJ:/analyses/xmbpdtcb' end}",
	    
		$sys_needFilter:false,
		$sys_passparameters:false,
		$sys_target:"dialog",
		$sys_customparameters:"lsh=${table1.B4}",
		dialogWidth:500,
		dialogHeight:350,
		dialogTitle:"评定理由",
		modal:true,
		cancel : function(e){
		},
		ok:function(e){
			var dlg = e.dlg;
			dlg.getReport().submitFill({
				forceUpdateAll:true,
				confirm:false,
				success:function(){
					dlg.close();
					$rpt.recalc();
				}
			});
			return false;
		},
		ondisplay:function(e){
			e.dlg.getButtonById("ok").setCaption("提交");
		}
	});
		        }	
		      } 
		    });
}		    




function _isLock(args){
	var ds = sz.db.getDataSource('ZCSWSJ');
	var result = ds.select("select LSH from FACT_WGXMQKTJB where LSH=? and LOCK_>'0' and LOCK_  is not null",[args.args.lsh]);
	if (result != null && result[0] != null){
		return true;
	}
	
	var user = sz.security.getCurrentUser();
	
	if(user.isRole('部门')){
		var resultDpt = ds.select("select LSH from FACT_WGXMQKTJB where LSH=? and submitState_>='2'",[args.args.lsh]);
		if (resultDpt != null && resultDpt[0] != null){
			return true;
		}
	}
	
	return false;
}


${case when $user.isRole('部门') then          
          "xmlb.cdbm='"+$user.org.name +"' and " + 
            case when zt=1 then 
                 "(xmlb.state_<='1' or xmlb.state_ is null)" 
            when zt=2 then "xmlb.state_>'1' and (xmlb.submitState_ is null or xmlb.submitState_<'2')"
            else "xmlb.state_>'1' and xmlb.submitState_>='2'"  end        
            
       when $user.isRole('大区') then   
               if($user.id = "maspie", "(xmlb.SSSCQY='北京地区' or xmlb.SSSCQY='广州地区')" , "xmlb.SSSCQY='"+$user.org.name+"'")            		
                   +" and " + 
	            case when zt=1 then 
	               "xmlb.state_='2' and xmlb.submitState_='2'" 
	            when zt=2 then "xmlb.state_>'2' and xmlb.submitState_<'3'"  
	            else "xmlb.state_>'2' and xmlb.submitState_>='3'"   end
                 
       when $user.isRole('项目') then          
            case when zt=1 then 
               "xmlb.state_='3' and xmlb.submitState_='3'" 
            when zt=2 then "xmlb.state_>'3' and xmlb.submitState_<'4'"  
            else "xmlb.state_>'3' and xmlb.submitState_>='4'"  end      
 end}

