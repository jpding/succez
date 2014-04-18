function updateZbs(path, params) {
	var ds = sz.db.getDataSource("nhpj");
	var objs = {};
	objs['DW'] = params['dw'];
	objs['BBQ'] = params['bbq'];
	var upd = ds.createTableUpdater("FACT_ZBS", "");

	var level = getMaxLevel();
	
	var result = sz.metadata.get(path).getObject().calc(params,'admin', null);
	var table = result.getComponent("rpt1");
	for (var i = 1, len = table.getRowCount(); i < len; i++) {
		var zb = table.getCell(i, 0).value;
		
		if(zb==null || zb=="")
		  continue;
		
		var score = table.getCell(i, 1).value;
		var newObj = {};
		for (var key in objs) {
			newObj[key] = objs[key];
		}
		newObj['ZB'] = zb;
		upd.set('SCORE', score, newObj);
		upd.set('ZBVAL', table.getCell(i, 2).value, newObj);
		upd.set('JZZ', table.getCell(i, 3).value, newObj);
		upd.set('ZBLVL', level+'', newObj);

	}
	upd.commit();

}

function getMaxLevel(){
	return sz.db.getDataSource("nhpj").select1("select max(INDICATOR_GRADE) from dbo.etl_zb_weight_scd where startdate <=? and enddate>?", '${$BBQ}','${$BBQ}');
}

function main(args) {
	updateZbs('NHPJ:/analyses/ETL/zbs', {
				"dw" : "大连船舶",
				"bbq" : "${$BBQ}"
			});
}



//=======================================================
function updateParentZbs(path, params, lvl) {
	var ds = sz.db.getDataSource("nhpj");
	var objs = {};
	objs['DW'] = params['dw'];
	objs['BBQ'] = params['bbq'];
	
	var upd = ds.createTableUpdater("FACT_ZBS", "");
	
	params["lvl"] = java.lang.String.valueOf(lvl);

	var result = sz.metadata.get(path).getObject().calc(params,"admin", null);
	var table = result.getComponent("rpt1");
	for (var i = 1, len = table.getRowCount(); i < len; i++) {
		var zb = table.getCell(i, 0).value;
		
		if(zb==null || zb=="")
		  continue;
		
		var score = table.getCell(i, 1).value;
		var newObj = {};
		for (var key in objs) {
			newObj[key] = objs[key];
		}
		newObj['ZB'] = zb;
		upd.set('SCORE', score, newObj);
		upd.set('ZBLVL', (lvl-1), newObj);
	}
	upd.commit();
}

function getMaxLevel(){
	return sz.db.getDataSource("nhpj").select1("select max(INDICATOR_GRADE) from dbo.etl_zb_weight_scd where startdate <=? and enddate>?", '${$BBQ}','${$BBQ}');
}

function main(args) {
	var cnt = getMaxLevel();
	println("===========================================");
	println(cnt);
	println("===========================================");
	
	for(var i=cnt; i>1 ; i--){
		updateParentZbs('NHPJ:/analyses/ETL/pzbscore', {
				"dw" : "大连船舶",
				"bbq" : "${$BBQ}"
			}, i);
	}
}


function score1(v){
	if(v<=-0.05){
		return 5;
	}else if(v>-0.05 && v<=0){
		return 4;
	}else if(v>0 && v<=0.05){
		return 3;
	}else if(v>0.05 && v<=0.1){
		return 2;
	}else if(v>0.1 && v<=0.15){
		return 1
	}else{
		return 0;
	}
}

function score2(v){
	if(v>0.4){
		return 5;
	}else if(v>0.3 && v<=0.4){
		return 4;
	}else if(v>0.2 && v<=0.3){
		return 3;
	}else if(v>0.1 && v<=0.2){
		return 2;
	}else if(v>0 && v<=0.1){
		return 1
	}else{
		return 0;
	}
}