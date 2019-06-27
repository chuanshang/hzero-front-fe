import React, { PureComponent } from 'react';
import { Modal, Table, Button } from 'hzero-ui';
import intl from 'utils/intl';
import { dateRender } from 'utils/renderer';

class ScheduleModal extends PureComponent {
  render() {
    const prefix = 'appm.wbsPlanMaintain.model.wbsPlanMaintain';
    const { dataSource, onCancel, modalVisible } = this.props;
    const columns = [
      {
        title: intl.get(`${prefix}.scheduleRate`).d('进度新增'),
        dataIndex: 'scheduleRate',
        width: 120,
        render: val => `${val}%`,
      },
      {
        title: intl.get(`${prefix}.workListProgress`).d('工作清单完成'),
        dataIndex: 'workListProgress',
        width: 120,
      },
      {
        title: intl.get(`${prefix}.enterPerson`).d('填报人'),
        dataIndex: 'enterPersonName',
        width: 120,
      },
      {
        title: intl.get(`${prefix}.enterDate`).d('填报时间'),
        dataIndex: 'enterDate',
        width: 100,
        render: dateRender,
      },
      {
        title: intl.get(`${prefix}.approvedStatus`).d('审批状态'),
        dataIndex: 'approvedStatusMeaning',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 150,
      },
    ];
    return (
      <Modal
        visible={modalVisible}
        onCancel={onCancel}
        width={690}
        title={intl.get(`${prefix}.schedule`).d('进度')}
        footer={
          <Button type="primary" onClick={onCancel}>
            {intl.get('hzero.common.button.close').d('关闭')}
          </Button>
        }
      >
        <Table
          bordered
          rowKey="scheduleId"
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </Modal>
    );
  }
}
export default ScheduleModal;
