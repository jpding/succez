<#--
width="500" height="350"
@depends sz.commons.dialog,sz.commons.yearmonthcombobox,sz.commons.labelwrapper,sz.metadata.dialogformpanel
-->
<@dialog title="清空表数据" width=400 height=300 modal="true">
	<style type="text/css">
		.sz-metadata-dialogformpanel {
			.sz-commons-form-table{
				margin-top:30px;
			}
		}
	</style>

	<@sz.metadata.dialogformpanel>
		<@sz.commons.form>
			<@sz.commons.labelwrapper caption="统计期" captionPos="left">
				<@sz.commons.yearmonthcombobox value="201212" format="yyyyMM" name="deleteyearmonth"/>
			</@sz.commons.labelwrapper>
		</@sz.commons.form>	
	</@sz.metadata.dialogformpanel>
	<@sz.commons.dialog.button id="ok"/>  
	<@sz.commons.dialog.button id="cancel"/>
</@dialog>



if (!window.deletefromDialog) {
	var dlgargs = {
				"onok": function(event){
				    var mm = $$("#deleteyearmonth").val();
				    $rpt.rpc({
				    	func        : "clearFactTable",
				    	args        : {
					       BBQ :  mm
					    },
					    success : function(feedback){
					    	$rpt.recalc();
					    }
				    });
					return true;
				}
			};
	window.deletefromDialog= sz.commons.Dialog.create(dlgargs);
}

window.deletefromDialog.showHtml({
	url : sz.sys.ctx(encodeURI("/meta/ZCSWSJ/analyses/web/deletefrom.ftl"))
	
});

function clearFactTable(args){
	var params = args.args;
	var ds = sz.db.getDataSource('ZCSWSJ');
	
	ds.update("insert into BAK_FACT_WGXMQKTJB select * from FACT_WGXMQKTJB  t where t.BBQ=?",[params.BBQ])	
	ds.update("delete from FACT_WGXMQKTJB where BBQ=?", [params.BBQ]);
}