import React, { PureComponent } from 'react';
import { Modal, Table, Button } from 'hzero-ui';
import intl from 'utils/intl';
import { dateRender } from 'utils/renderer';

class HistoryModal extends PureComponent {
  render() {
    const prefix = 'appa.budgetTemplate.model.budgetTemplate';
    const { dataSource, loading, onCancel, modalVisible, onGotoHistory } = this.props;
    const columns = [
      {
        title: intl.get(`${prefix}.versionNumber`).d('版本号'),
        dataIndex: 'versionNumber',
        align: 'center',
        width: 80,
        render: (val, record) => <a onClick={() => onGotoHistory(record)}>{`V${val}`}</a>,
      },
      {
        title: intl.get(`${prefix}.templateStatus`).d('模板状态'),
        dataIndex: 'proTemplateStatusMeaning',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.versionDes`).d('版本概述'),
        dataIndex: 'versionDes',
        width: 120,
      },
      {
        title: intl.get(`${prefix}.createdBy`).d('创建人'),
        dataIndex: 'createdByName',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.versionEffect`).d('版本生效时间'),
        dataIndex: 'versionEffect',
        width: 120,
        render: dateRender,
      },
    ];
    return (
      <Modal
        visible={modalVisible}
        onCancel={onCancel}
        width={690}
        title={intl.get(`${prefix}.historyModalName`).d('历史版本')}
        footer={
          <Button type="primary" onClick={onCancel}>
            {intl.get('hzero.common.button.close').d('关闭')}
          </Button>
        }
      >
        <Table
          bordered
          rowKey="templateId"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </Modal>
    );
  }
}
export default HistoryModal;
