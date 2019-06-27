import React, { PureComponent } from 'react';
import { Modal, Table } from 'hzero-ui';
import intl from 'utils/intl';

class HistoryModal extends PureComponent {
  render() {
    const prefix = 'appm.projectBudget.model.projectBudget';
    const {
      dataSource,
      selectedRowKeys,
      modalVisible,
      loading,
      detailLoading,
      onOk,
      onSelectRow,
      onCancel,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${prefix}.versionNumber`).d('版本号'),
        dataIndex: 'versionNumber',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.description`).d('版本概述'),
        dataIndex: 'description',
        width: 150,
      },
    ];
    return (
      <Modal
        visible={modalVisible}
        width={400}
        title={intl.get(`${prefix}.historyVersion`).d('历史版本')}
        confirmLoading={detailLoading}
        onOk={onOk}
        okText={intl.get('hzero.common.button.sure').d('确认')}
        onCancel={onCancel}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
      >
        <Table
          bordered
          width={300}
          rowKey="proBudgetId"
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={false}
          rowSelection={{
            selectedRowKeys,
            type: 'radio',
            onChange: onSelectRow,
          }}
        />
      </Modal>
    );
  }
}
export default HistoryModal;
