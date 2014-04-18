$rpt.ondisplay = function($rpt){ 
    //初始化可选中行的表格控件
    var $nygk_ynbm = $rpt.getCurrentBodyDom().find("#table1");
	if(sz.commons.SelectableTable){
	   window.nygk_ynbm = sz.commons.SelectableTable.build($nygk_ynbm);
	}
}

$rpt.ondisplayParamPanel = function(){
	window._doCopyDQ = function(){
		_doCopy(true);
	}
	
 	window._doCopyBM = function(){
		_doCopy(false);	
	}
	
	function _doCopy(isDQ){  
		$rpt.rpc({
		    func        : "doCopyLastMonthDatas",
		    args        : {
		       isAnalyse :  true,
		       isDQ : isDQ
		    },
		    success : function(feedback) {
		        if (feedback.type === "success"){
		        	alert("下发成功");
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
							       isAnalyse :  false,
							       isDQ : isDQ
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
	
	window._doDelete = function(bbq,lsh){
		$rpt.rpc({
		    func        : "doDelete",
		    args        : {
		       type :  lsh ? "one" : "all",
		       val  : lsh ? lsh : bbq
		    },
		    success : function(feedback) {
		    	alert("操作成功");
		    }
		})
		return;
	}
}