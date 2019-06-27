import React, { PureComponent } from 'react';
import { Table, Button, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';

class TransactionList extends PureComponent {
  /**
   * 删除操作
   */
  @Bind()
  deleteBtn(record) {
    const { onDelete, onDeleteFromDB } = this.props;
    if (record._status !== `create`) {
      // 调用接口来删除数据
      onDeleteFromDB(record);
    } else {
      // 进行删除操作
      onDelete(record);
    }
  }

  render() {
    const {
      isNew,
      editFlag,
      loading,
      dataSource,
      lineDeleteButtonStyle,
      onEdit,
      onAddLine,
    } = this.props;
    const { detailLineListLoading } = loading;
    const promptCode = 'amtc.act.model.actList';
    const columns = [
      {
        title: intl.get(`${promptCode}.activityOpNumber`).d('序号'),
        dataIndex: 'activityOpNumber',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.actOpName`).d('标准作业任务名称'),
        dataIndex: 'actOpName',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.activityStatus`).d('状态'),
        dataIndex: 'activityStatusMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.description`).d('任务描述'),
        dataIndex: 'description',
        width: 100,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 100,
        align: 'center',
        render: (val, record) =>
          isNew || editFlag ? (
            <div>
              <a style={{ marginRight: '15px' }} onClick={() => onEdit(record)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
              <a style={lineDeleteButtonStyle} onClick={() => this.deleteBtn(record)}>
                {intl.get('hzero.common.button.delete').d('清除')}
              </a>
            </div>
          ) : (
            <a style={{ marginRight: '15px' }} onClick={() => onEdit(record)}>
              {intl.get('hzero.common.button.detail').d('详细')}
            </a>
          ),
      },
    ];
    return (
      <div>
        {isNew || editFlag ? (
          <Col className="search-btn-more">
            <Button type="primary" onClick={onAddLine}>
              {intl.get('hzero.common.button.add').d('新增')}
            </Button>
          </Col>
        ) : null}
        <Table
          bordered
          rowKey="actOpId"
          loading={detailLineListLoading}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </div>
    );
  }
}
export default TransactionList;
