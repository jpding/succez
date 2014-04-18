function onBeforeUpdateData(args) {
	var updatefields = args.updatefields;
	var user = sz.security.getCurrentUser();
	var state = "2";
	var isBM = user.isRole('部门');
	var isDQ = user.isRole('大区');
	var isXM = user.isRole('项目');
	if(isDQ){
		state = "3";
	}else if(isXM){
		state = "4";
	}
	
	var fields = updatefields.listFields();
	/**
	 * 删除
	 */
	
	
	
	/**
	 * 在未填报、已填报才需要修改状态，在提交状态下修改是不需要修改状态的
	 */
	var zt = args.result.getParameters().get("zt");
	if(zt=="1" || zt=="2"){
		for(var i=0;i<fields.size(); i++){
			var where = fields.get(i).getWhere();
			println(where);
			updatefields.addField({
	                "where" : {
	                    "LSH" : where.get("LSH")
	                },
	                "table" : "xmlb",
	                "value" : state,
	                "fieldName" : "STATE_"
	            });
		}
	}
	
	/**
	 * 
	 */
    if((isDQ || isXM) && zt==3){
		var fieldName = "";
		if(isDQ){
			fieldName = "DQXG";
		}else if(isXM){
			fieldName = "XMXG";
		}
		
		if(fieldName){
			for(var i=0; i<fields.size(); i++){
				updatefields.addField({
	                "where" : {
	                    "LSH" : fields.get(i).getWhere().get("LSH")
	                },
	                "table" : "xmlb",
	                "value" : "1",
	                "fieldName" : fieldName
	            });	
			}
		}
    }
}