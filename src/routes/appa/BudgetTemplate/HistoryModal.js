import React, { PureComponent } from 'react';
import { Modal, Table, Button } from 'hzero-ui';
import intl from 'utils/intl';
import { dateRender } from 'utils/renderer';

class HistoryModal extends PureComponent {
  render() {
    const prefix = 'appa.budgetTemplate.model.budgetTemplate';
    const { loading, dataSource, onCancel, modalVisible, onGotoHistory } = this.props;
    const columns = [
      {
        title: intl.get(`${prefix}.templateVersion`).d('版本号'),
        dataIndex: 'templateVersion',
        align: 'center',
        width: 80,
        render: (val, record) => (
          <a
            onClick={() =>
              onGotoHistory(record.templateCode, record.templateVersion, record.templateStatus)
            }
          >
            {`V${val}`}
          </a>
        ),
      },
      {
        title: intl.get(`${prefix}.templateStatus`).d('模板状态'),
        dataIndex: 'templateStatusMeaning',
        width: 120,
      },
      {
        title: intl.get(`${prefix}.description`).d('版本概述'),
        dataIndex: 'description',
        width: 120,
      },
      {
        title: intl.get(`${prefix}.createdByName`).d('创建人'),
        dataIndex: 'createdByName',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.effectiveDate`).d('版本生效时间'),
        dataIndex: 'effectiveDate',
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
          loading={loading}
          rowKey="templateId"
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </Modal>
    );
  }
}
export default HistoryModal;
