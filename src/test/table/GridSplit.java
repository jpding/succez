package test.table;

interface GridSplit {
	/** 
	 * @����row��ָ����Ԫ�����ڵ��߼��� 
	 * @����column��ָ����Ԫ�����ڵ��߼��� 
	 * @����ָ����Ԫ�����Խ������ 
	 */
	int spanCol(int row, int column);

	/** 
	 * @����row��ָ����Ԫ�����ڵ��߼��� 
	 * @����column��ָ����Ԫ�����ڵ��߼��� 
	 * @���ظ���ָ����Ԫ��Ŀ��ӵ�Ԫ�����ֵ�����Ԫ�������ǿ��ӵĻ��������������ֵ 
	 */
	int visibleColCell(int row, int column);
	
	/** 
	 * @����row��ָ����Ԫ�����ڵ��߼��� 
	 * @����column��ָ����Ԫ�����ڵ��߼��� 
	 * @����ָ����Ԫ�����Խ������ 
	 */
	int spanRow(int row, int column);

	/** 
	 * @����row��ָ����Ԫ�����ڵ��߼��� 
	 * @����column��ָ����Ԫ�����ڵ��߼��� 
	 * @���ظ���ָ����Ԫ��Ŀ��ӵ�Ԫ�����ֵ�����Ԫ�������ǿ��ӵĻ��������������ֵ 
	 */
	int visibleRowCell(int row, int column);
	
	boolean isVisible(int row, int column);
}
