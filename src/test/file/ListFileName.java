package test.file;

import java.io.File;

public class ListFileName {
	public static void main(String [] args){
		String fn = "E:/项目文档/中行IMA系统升级/svn/IMA/02.工程文档/01.需求文档/H汇总需求访谈报表/金融市场总部-风控模块-自营监控-交易业务市场风险监控";
		File ff = new File(fn);
		File[] fs = ff.listFiles();
		for (int i = 0; i < fs.length; i++) {
			File f = fs[i];
			System.out.println(f.getName());
		}
	}
}
