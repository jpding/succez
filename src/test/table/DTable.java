package test.table;

import java.awt.Point;
import java.awt.Rectangle;
import java.util.List;

import javax.swing.JTable;
import javax.swing.table.JTableHeader;
import javax.swing.table.TableColumnModel;
import javax.swing.table.TableModel;

public class DTable extends JTable {
	private GridSplit gridSplit;
	public static DTable create(TableContent tableContent,Object[]columnHeaders,List<GroupHeader> goupColumnHeaderList){
		DTable table=tableContent.createTable(columnHeaders);		
		
		table.addGroupColumnHeaderList(goupColumnHeaderList);
		return table;
	}
	public DTable(TableModel tableModel){
		super(tableModel);
	}
	public DTable(GridSplit gridSplit, TableModel tbl) {
		super(tbl);		
		this.gridSplit = gridSplit;		
		setUI(new DTableUI());// ����Jtable����ȾUI	
	}
	protected JTableHeader createDefaultTableHeader() {
		return new GroupableTableHeader(columnModel);
	}
	public void addGroupColumnHeaderList(List<GroupHeader> goupColumnHeaderList){
		GroupableTableHeader header = (GroupableTableHeader)getTableHeader();
		TableColumnModel tableColumnModel = getColumnModel();
		for(GroupHeader groupHeader:goupColumnHeaderList){
			header.addColumnGroup(groupHeader.createColumnGroup(tableColumnModel));
		}		
		for (int i = 0; i < tableColumnModel.getColumnCount(); i++) {
			tableColumnModel.getColumn(i).setHeaderRenderer(new GroupRenderer());
		}
		getTableHeader().setUI(new GroupableTableHeaderUI(getTableHeader()));
	}
	public Rectangle getCellRect(int row, int column, boolean includeSpacing) {
		if (gridSplit == null) {
			return super.getCellRect(row, column, includeSpacing);			
		}
		
		int colCell = gridSplit.visibleColCell(row, column);// ָ����Ԫ��Ŀ��ӵ�Ԫ����ֵ
		int rowCell = gridSplit.visibleRowCell(row, column);// ָ����Ԫ��Ŀ��ӵ�Ԫ����ֵ

		Rectangle rec = super.getCellRect(rowCell, colCell, includeSpacing);
		
		// ���ָ����Ԫ���п?Ϊ1���ۼƳ����е�Ԫ��Ŀ��		
		for (int i = 1; i < gridSplit.spanCol(rowCell, colCell); i++) {
			rec.width += getColumnModel().getColumn(colCell + i).getWidth();
		}
		// ���ָ����Ԫ���п?Ϊ1���ۼƳ����е�Ԫ��Ŀ��
		for (int i = 1; i < gridSplit.spanRow(rowCell, colCell); i++) {
			rec.height += getRowHeight(rowCell + i);
		}
		return rec;
	}

	public int columnAtPoint(Point p) {
		int y = super.columnAtPoint(p);
		if(gridSplit==null){
			return y;
		}
		// ��ָ��λ�ò���Table��ʱ�����أ�1
		if (y < 0)
			return y;
		int x = super.rowAtPoint(p);
		// ��ȡָ��λ�ÿ��ӵ�Ԫ�����ֵ		
		return gridSplit.visibleColCell(x, y);
		
	}
	public int rowAtPoint(Point p) {
		int x = super.rowAtPoint(p);
		if (gridSplit == null) {
			return x;
		}
		if (x < 0)
			return x;
		int y = super.columnAtPoint(p);
		return gridSplit.visibleRowCell(x, y);
	}

//	public boolean isCellEditable(int row, int col) {
//		return false;
//	}

	public boolean isCellSelected(int row, int col) {
		return getSelectedColumn()==col&&getSelectedRow()==row;		
	}
//	public boolean isRowSelected(int row){
//		this.getSelectedColumn()
//		return false;
//	}
	public GridSplit getGridSplit() {
		return gridSplit;
	}
}

//@SuppressWarnings("unchecked")
//public Class getColumnClass(int i){
////	Class clazz=clazzMap.get(i);
////	if(clazz!=null){
////		return clazz;
////	}else if(i==0&&Const.TABLE_SELECT.equals(getColumnName(0))){
////		return Boolean.class;
////	}else{
////		return String.class;
////	}		
//	//this.isCellEditable(arg0, arg1)
//	return String.class;
//}
//public boolean isCellEditable(int row,int col){
//	return true;
//}
//public boolean isCellSelected(int row,int col){
//	return false;
//}
//public Object getValueAt(int row,int column){
//	int colCell = gridSplit.visibleColCell(row, column);// ָ����Ԫ��Ŀ��ӵ�Ԫ����ֵ
//	int rowCell = gridSplit.visibleRowCell(row, column);// ָ����Ԫ��Ŀ��ӵ�Ԫ����ֵ
//	
//	return super.getValueAt(rowCell,colCell);
//}
//public TableCellEditor getCellEditor(int row,int column){
//	int rowCell = gridSplit.visibleRowCell(row, column);// ָ����Ԫ��Ŀ��ӵ�Ԫ����ֵ
//	int colCell = gridSplit.visibleColCell(row, column);// ָ����Ԫ��Ŀ��ӵ�Ԫ����ֵ
//	//this.getCellRenderer(row, column)
//	return super.getCellEditor(rowCell, colCell);
//	
//}
//public TableCellRenderer getCellRenderer(int row,int column){
//	int rowCell = gridSplit.visibleRowCell(row, column);// ָ����Ԫ��Ŀ��ӵ�Ԫ����ֵ
//	int colCell = gridSplit.visibleColCell(row, column);// ָ����Ԫ��Ŀ��ӵ�Ԫ����ֵ
//	
//	return super.getCellRenderer(rowCell, colCell);
//}
//this.setDefaultRenderer(String.class, new TableCellRenderer() {
//	public Component getTableCellRendererComponent(JTable table,
//			Object value, boolean isSelected, boolean hasFocus,
//			int row, int column) {
//		String text = (value == null) ? "" : value.toString();
//		JLabel cell = new JLabel(text);
//		cell.setOpaque(true);
//		if (row == 0) {
//			// cell.setForeground(headerForeground);
//			// cell.setBackground(headerBackground);
//		} else {
//			if (isSelected) {
//				// cell.setForeground(selectedForeground);
//				// cell.setBackground(selectedBackground);
//			} else {
//				// cell.setForeground(foreground);
//				// cell.setBackground(background);
//			}
//		}
//		return cell;
//	}
//});	