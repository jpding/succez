<#--
手抄仪表月度数据导入的主页面
@depends sz.commons.html.simplehtml,sz.commons.form, sz.commons.form.field, sz.commons.form.file
@depends sz.commons.button,sz.commons.yearmonthcombobox,sz.commons.yearcombobox,sz.commons.simplelist
-->
<@simplehtml>
	<@sz.commons.dialog.info title="能耗量基准值导入"/>
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
				<td>生效日期</td>
				<td>
					<@sz.commons.yearmonthcombobox id="bbq_m" name="bbq_m"/>
				</td>
			</tr>
			<tr>
				<td>选择文件</td>
				<td><@sz.commons.form.file id="excelfile" name="excelfile" multiple=false showlink=true hideprocess=false filesize="10485760"/></td>
			</tr>
			<tr>
				<td>
				</td>
                <td><@sz.commons.button id="btnStart" click="window.startImport()" icon="sz-app-icon-submit" caption="保存"/></td>
			</tr>
			<tr>
				<td colspan="2">
					<#if msg??><div id="msgSpan">${msg}</div></#if>
					<#if bbqq??><div style="display:none" id="export_version">${bbqq}</div></#if>
				</td>
			</tr>
		</table>
	</form>

	<@script>
		var result = $("#export_version");
        if(result.length > 0 && result.text() != ""){
	        $rpt().drill({
			    $sys_drillto:"CBNY:/analyses/能耗评价/能耗评价/弹出表/zq_NHLJZZ",
			    $sys_needFilter:false,
			    $sys_passparameters:false,
			    $sys_customparameters:"$bbqq=" + result.text(),
			    $sys_target:"dialog",
                            dialogWidth:730,              //对话框的宽度
                            dialogHeight:450,    
			    modal:true,
			    resizable:true	
	        });
        }
        
		window.startImport = function(){
			sz.utils.showWaiting($('#uploadForm'));
			sz.commons.Button.build("#btnStart").setDisable(true);
			sz.commons.Button.build("#btnConfirm").setDisable(true);
			$("#uploadForm").attr("action", encodeURI("${url('/meta/CBNY/analyses/能耗评价/web/baseDataImport.action?method=startNHLJZZImport')}"));
			$("#uploadForm").submit();
		}
	</@script>
	<@sz.commons.dialog.button id="ok"/>
</@simplehtml>