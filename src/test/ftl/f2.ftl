<#--
手抄仪表月度数据导入的主页面
@depends sz.commons.html.simplehtml,sz.commons.form, sz.commons.form.field, sz.commons.form.file
@depends sz.commons.button,sz.commons.yearmonthcombobox,sz.commons.yearcombobox,sz.commons.simplelist
-->
<@simplehtml>
	<@sz.commons.dialog.info title="船厂基础数据导入"/>
	<style type="text/css">
		#uploadForm {
			width:500px;
			margin:20px;
			padding-left:50px;
			text-align:left;
		}
		#msgSpan {
			padding-left:20px;
			text-align:left;
			font-size:10pt;
			color:red;
		}
		#listDiv {
			margin:20px 20px 20px 40px;
		}
		#ltable1 {
			border-collapse: collapse;
                        width : 500px;
		}
		
		#ltable1 th, td {
			padding: 15px;
		} 
	</style>

	<form id="uploadForm" action="" method="post">
		<table id="ltable1">
			<tr>
				<td>数据类型</td>
				<td>
					<input type=radio name="datatype" value="month" onclick="toggleDatePicker('month')" checked>按月导入
					<input type=radio name="datatype" value="year" onclick="toggleDatePicker('year')" >按年导入
				</td>
			</tr>
			<tr>
				<td>数据日期</td>
				<td>
					<@sz.commons.yearmonthcombobox id="bbq_m" name="bbq_m"/>
					<div id="yearSelect" style="display:none">
						<@sz.commons.yearcombobox id="bbq_y" name="bbq_y"/>
					</div>
				</td>
			</tr>
			<tr>
				<td>选择文件</td>
				<td><@sz.commons.form.file id="excelfile" name="excelfile" multiple=false showlink=true hideprocess=false filesize="10485760"/></td>
			</tr>
			<tr>
				<td>
					<input type="hidden" name="_bbq" value="${bbq!''}">
					<input type="hidden" name="ybzs" value="${ybzs!''}">
					<input type="hidden" name="_datatype" value="${datatype!''}">
				</td>
                                <td><@sz.commons.button id="btnStart" click="window.startImport()" icon="sz-app-icon-submit" caption="保存"/></td>
			</tr>
			<tr>
				<td colspan="2">
					<#if msg??><div id="msgSpan">${msg}</div></#if>
					<#if showResult??><div style="display:none" id="showExportResult">${showResult}</div></#if>
					<#if bbq??><div style="display:none" id="lastExportBbq">${bbq}</div></#if>
				</td>
			</tr>                    
		</table>
	</form>

	<@script>
        var result = $("#showExportResult");
        if(result.length > 0 && result.text() == "true"){
        	var bbq = $("#lastExportBbq").text();
        	var catg = bbq.length == 6 ? "10" : "20";
	        $rpt().drill({
			    $sys_drillto:"CBNY:/analyses/能耗评价/能耗评价/弹出表/zq_NHJCSJ",
			    $sys_needFilter:false,
			    $sys_passparameters:false,
			    $sys_customparameters:"$bbq=" + bbq +"&$catg=" + catg,
			    $sys_target:"dialog",
                            dialogWidth:720,              //对话框的宽度
                            dialogHeight:500,    
			    modal:true,
			    resizable:true	
	        });
        }
        
		window.startImport = function(){
			sz.utils.showWaiting($('#uploadForm'));
			sz.commons.Button.build("#btnStart").setDisable(true);
			sz.commons.Button.build("#btnConfirm").setDisable(true);
			$("#uploadForm").attr("action", encodeURI("${url('/meta/CBNY/analyses/能耗评价/web/baseDataImport.action?method=startJCSJImport')}"));
			$("#uploadForm").submit();
		}
		
		
		window.toggleDatePicker = function(picker){
			$('#bbq_m').toggle(null,null,picker == 'month');
			$('#yearSelect').toggle(null,null,picker == 'year');
		}
	</@script>
	<@sz.commons.dialog.button id="ok"/>
</@simplehtml>