import React, { PureComponent } from 'react';
import { Modal, Table } from 'hzero-ui';
import intl from 'utils/intl';

class TemplateModal extends PureComponent {
  render() {
    const prefix = 'appm.projectBudget.model.projectBudget';
    const {
      dataSource,
      selectedRowKeys,
      modalVisible,
      loading,
      copyLoading,
      onOk,
      onSelectRow,
      onCancel,
      onSearch,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${prefix}.templateCode`).d('模板编号'),
        dataIndex: 'templateCode',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.templateName`).d('模板名称'),
        dataIndex: 'templateName',
        width: 150,
      },
    ];
    return (
      <Modal
        visible={modalVisible}
        width={400}
        title={intl.get(`${prefix}.budgetTemplate`).d('预算模板')}
        confirmLoading={copyLoading}
        onOk={onOk}
        okText={intl.get('hzero.common.button.sure').d('确认')}
        onCancel={onCancel}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
      >
        <Table
          bordered
          width={300}
          rowKey="templateId"
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={false}
          rowSelection={{
            selectedRowKeys,
            type: 'radio',
            onChange: onSelectRow,
          }}
          onChange={page => onSearch(page)}
        />
      </Modal>
    );
  }
}
export default TemplateModal;
