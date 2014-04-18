package test;

public class TestGetColName {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		for (int i = 1; i <= 1000; i++) {
			System.out.println(i+"\t"+getColName(i));
		}
		//System.out.println(getColName(26));
	}
	
	public static String getColName(int col){
		StringBuffer buf = new StringBuffer();
		int div, mod;
		div = col/26;
		mod = col%26;
		do{
			char ch;
			if(mod == 0){
				ch = 'Z';
			}else{
				ch = (char)('A'+(mod-1));
			}
			
			buf.append(ch);
			
			mod =div%26;
			div = div / 26 ;
		}while(div != 0);
		
		if(mod > 0){
			if((col % 26 ==0)){
				mod -= 1;
				char ch = (char)('A'+((mod-1)<0?0:(mod-1)));
				buf.append(ch);
			}else{
				char ch = (char)('A'+(mod-1));
				buf.append(ch);
			}
		}
		
		return buf.reverse().toString();
	}
}
