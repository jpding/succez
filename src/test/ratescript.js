function main(args){
  var result = getRates();
  for(var i=0; i<result.length; i++){
  	var obj = result[i];
  	println(obj);
  }
}

function importDataByDay(){
	
}

function getRates(){
	var result = [];
	var tempCOL = [];
	var parser = new org.htmlparser.Parser("http://www.safe.gov.cn/AppStructured/view/project!RMBQuery.action");
	var tableNodes = parser.extractAllNodesThatMatch( new org.htmlparser.filters.HasAttributeFilter("id", "InfoTable"));
	if(tableNodes != null){
		var nodes = tableNodes.extractAllNodesThatMatch(new org.htmlparser.filters.TagNameFilter("th"), true);
		for (var i = 0; nodes != null && i < nodes.size(); i++) {
			var temp = nodes.elementAt(i);
			tempCOL[i] = org.apache.commons.lang.StringUtils.remove(org.apache.commons.lang.StringUtils.trim(temp.getFirstChild().getText()), "&nbsp;");
		}
		
		nodes = tableNodes.extractAllNodesThatMatch(new org.htmlparser.filters.TagNameFilter("tr"), true);
		for (var i = 0; i < nodes.size(); i++) {
			var elem = nodes.elementAt(i);
			var children = elem.getChildren();
			var tdNodes = children.extractAllNodesThatMatch(new org.htmlparser.filters.TagNameFilter("td"));
			if(tdNodes == null || tdNodes.size() == 0)
				continue;
			var map = new Object();
			for (var j = 0; tdNodes != null && j < tdNodes.size(); j++) {
				var temp = tdNodes.elementAt(j);
				var vv = org.apache.commons.lang.StringUtils.remove(org.apache.commons.lang.StringUtils.trim(temp.getFirstChild().getText()), "&nbsp;");
				if(j == 0){
					//vv = org.apache.commons.lang.StringUtils.replaceChars(vv, "-","");
					vv = tostr(vv,'yyyymmdd');
				}
				map[tempCOL[j]]=vv;
			}
			result.push(map);
		}
	}
	
	return result;
}