import React, { PureComponent } from 'react';
import { Modal, Table, Button } from 'hzero-ui';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';

class RelationModal extends PureComponent {
  render() {
    const prefix = 'appm.wbsPlanMaintain.model.wbsPlanMaintain';
    const { dataSource, loading, levelMap, modalVisible, onCancel, onEdit } = this.props;
    const columns = [
      {
        title: intl.get(`${prefix}`).d('层级编号'),
        dataIndex: 'levelPath',
        width: 120,
        render: (_, record) => {
          const list = levelMap[record.beforeTaskId];
          let levelNumber = '';
          if (!isEmpty(list)) {
            levelNumber = list.toString().replace(/,/g, '.');
          }
          return (
            <span style={{ fontWeight: record.primaryFlag === 1 ? 'bold' : 'normal' }}>
              {levelNumber}
            </span>
          );
        },
      },
      {
        title: intl.get(`${prefix}.beforeTaskName`).d('前置任务'),
        dataIndex: 'beforeTaskName',
        width: 150,
        render: (val, record) => (
          <a
            style={{ fontWeight: record.primaryFlag === 1 ? 'bold' : 'normal' }}
            onClick={() => onEdit(record.beforeTaskId)}
          >
            {val}
          </a>
        ),
      },
      {
        title: intl.get(`${prefix}.relationType`).d('关系类型'),
        dataIndex: 'relationTypeMeaning',
        width: 100,
        render: (val, record) => (
          <span style={{ fontWeight: record.primaryFlag === 1 ? 'bold' : 'normal' }}>{val}</span>
        ),
      },
      {
        title: intl.get(`${prefix}.delayTime`).d('延迟时间'),
        dataIndex: 'delayTime',
        width: 100,
        render: (val, record) => (
          <span style={{ fontWeight: record.primaryFlag === 1 ? 'bold' : 'normal' }}>{val}</span>
        ),
      },
      {
        title: intl.get(`${prefix}.advanceTime`).d('提前时间'),
        dataIndex: 'advanceTime',
        width: 100,
        render: (val, record) => (
          <span style={{ fontWeight: record.primaryFlag === 1 ? 'bold' : 'normal' }}>{val}</span>
        ),
      },
    ];
    return (
      <Modal
        visible={modalVisible}
        onCancel={onCancel}
        width={650}
        title={intl.get(`${prefix}.taskRelation`).d('任务关系')}
        footer={
          <Button type="primary" onClick={onCancel}>
            {intl.get('hzero.common.button.close').d('关闭')}
          </Button>
        }
      >
        <Table
          bordered
          width={570}
          loading={loading}
          rowKey="taskRelationId"
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </Modal>
    );
  }
}
export default RelationModal;
