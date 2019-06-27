import React, { PureComponent } from 'react';
import { Spin, Row, Col, Form, InputNumber, Input, Select } from 'hzero-ui';
import EditTable from 'components/EditTable';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { Bind } from 'lodash-decorators';

/**
 * WBS结构模板列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @return React.element
 */
class ListTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      deleteFlag: false, // 删除标记
    };
  }
  @Bind()
  handleDelete(record) {
    this.setState({ deleteFlag: true, proTaskId: record.proTaskId });
    this.props.onRemove(record);
  }
  /**
   * 处理关系
   */
  handleRelation(record) {
    const { levelMap } = this.props;
    const { taskTemplateRelsList = [] } = record;
    let key = {};
    if (!isEmpty(taskTemplateRelsList)) {
      // 排序，主要关系移到第一位
      for (let i = 0; i < taskTemplateRelsList.length; i++) {
        if (taskTemplateRelsList[i].primaryFlag === 1) {
          key = taskTemplateRelsList[i];
          taskTemplateRelsList.splice(i, 1);
          taskTemplateRelsList.unshift(key);
        }
      }
      const relation = [];
      taskTemplateRelsList.forEach(item => {
        const list = levelMap[item.beforeTaskId];
        let levelNumber = '';
        if (!isEmpty(list)) {
          levelNumber = list.toString().replace(/,/g, '.');
        }
        relation.push(`${levelNumber}${item.relationTypeCode}`);
      });
      return relation.toString();
    }
  }
  render() {
    const { deleteFlag, proTaskId } = this.state;
    const {
      priority,
      taskType,
      levelMap,
      loading,
      dataSource,
      expandedRowKeys,
      projectTemplate,
      projectRole,
      roles,
      proTemplateStatus,
      onEdit,
      onAddTask,
      onExpand,
      onShowRelationModal,
      onCancel,
      onAddTopTask,
      onEditTopTask,
    } = this.props;
    const prefix = 'appm.taskTemplate.model.taskTemplate';
    const columns = [
      {
        title: intl.get(`${prefix}`).d('层级编号'),
        dataIndex: 'levelPath',
        render: (_, record) => {
          const list = levelMap[record.proTaskId];
          let levelNumber = '';
          if (!isEmpty(list)) {
            levelNumber = list.toString().replace(/,/g, '.');
          }
          return <span>{levelNumber}</span>;
        },
      },
      {
        title: intl.get(`${prefix}.taskName`).d('任务名称'),
        dataIndex: 'taskName',
        width: 200,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && record.proTaskId !== 0 ? (
            <Form.Item>
              {record.$form.getFieldDecorator('taskName', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.taskName`).d('任务名称'),
                    }),
                  },
                  {
                    max: 60,
                    message: intl.get('hzero.common.validation.max', {
                      max: 60,
                    }),
                  },
                ],
              })(<Input />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefix}.taskType`).d('任务类型'),
        dataIndex: 'taskTypeMeaning',
        width: 120,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && record.proTaskId !== 0 ? (
            <Form.Item>
              {record.$form.getFieldDecorator('taskTypeCode', {
                initialValue: record.taskTypeCode,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.taskType`).d('任务类型'),
                    }),
                  },
                ],
              })(
                <Select allowClear style={{ width: 100 }}>
                  {taskType.map(i => (
                    <Select.Option key={i.value}>{i.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefix}.principalRole`).d('负责角色'),
        dataIndex: 'principalRoleId',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && record.proTaskId !== 0 ? (
            <Form.Item>
              {record.$form.getFieldDecorator('principalRoleId', {
                initialValue: record._status === 'create' ? '' : String(record.principalRoleId),
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.principalRole`).d('负责角色'),
                    }),
                  },
                ],
              })(
                <Select allowClear style={{ width: 120 }}>
                  {projectRole
                    .filter(i => roles.indexOf(i.value) !== -1)
                    .map(i => (
                      <Select.Option key={i.value}>{i.meaning}</Select.Option>
                    ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            record.principalRoleName
          ),
      },
      {
        title: intl.get(`${prefix}.limitTime`).d(`工期 (${projectTemplate.limitTimeUomMeaning})`),
        dataIndex: 'limitTime',
        width: 120,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('limitTime', {
                initialValue: value,
                rules: [
                  {
                    required:
                      record.$form.getFieldValue('taskTypeCode') === 'PROJECT_MISSION' ||
                      record.proTaskId === 0,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.limitTime`).d('工期'),
                    }),
                  },
                ],
              })(
                <InputNumber
                  min={0}
                  style={{ width: 100 }}
                  disabled={
                    record.$form.getFieldValue('taskTypeCode') !== 'PROJECT_MISSION' &&
                    record.proTaskId !== 0
                  }
                />
              )}
            </Form.Item>
          ) : record.taskTypeCode !== 'MILESTONE' ? (
            value
          ) : (
            ''
          ),
      },
      {
        title: intl.get(`${prefix}.priorityCode`).d('优先级'),
        dataIndex: 'priorityMeaning',
        width: 100,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && record.proTaskId !== 0 ? (
            <Form.Item>
              {record.$form.getFieldDecorator('priorityCode', {
                initialValue: record.priorityCode,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.priority`).d('优先级'),
                    }),
                  },
                ],
              })(
                <Select allowClear style={{ width: 80 }}>
                  {priority.map(i => (
                    <Select.Option key={i.value}>{i.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefix}.relation`).d('任务关系'),
        dataIndex: 'relation',
        render: (_, record) => (
          <a onClick={() => onShowRelationModal(record)}>{this.handleRelation(record)}</a>
        ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: proTemplateStatus === 'PRESET' ? 200 : 80,
        dataIndex: 'operate',
        fixed: 'right',
        render: (val, record) =>
          record._status === 'create' ? (
            <a onClick={() => onCancel(record)}>
              {intl.get('hzero.common.button.clean').d('清除')}
            </a>
          ) : record._status === 'update' && record.proTaskId === 0 ? (
            <a onClick={() => onEditTopTask(record, false)}>
              {intl.get('hzero.common.button.cancel').d('取消')}
            </a>
          ) : record.proTaskId === 0 ? (
            <span className="action-link">
              <a
                onClick={() => onEditTopTask(record, true)}
                style={{ display: proTemplateStatus === 'PRESET' ? 'inline' : 'none' }}
              >
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
              <a
                onClick={() => onAddTopTask()}
                style={{ display: proTemplateStatus === 'PRESET' ? 'inline' : 'none' }}
              >
                {intl.get('appm.common.button.addTop').d('新增顶层')}
              </a>
            </span>
          ) : (
            <Row>
              <Col span={7}>
                <a onClick={() => onEdit(record)}>
                  {proTemplateStatus === 'PRESET'
                    ? intl.get('hzero.common.button.edit').d('编辑')
                    : intl.get('hzero.common.button.view').d('查看')}
                </a>
              </Col>
              <Col span={10}>
                <a
                  onClick={() => onAddTask(record)}
                  style={{ display: proTemplateStatus === 'PRESET' ? 'block' : 'none' }}
                >
                  {intl.get('appm.common.button.addNext').d('新增下级')}
                </a>
              </Col>
              <Col span={7}>
                <a
                  onClick={() => this.handleDelete(record)}
                  style={{ display: proTemplateStatus === 'PRESET' ? 'block' : 'none' }}
                >
                  <Spin
                    size="small"
                    spinning={deleteFlag && proTaskId === val ? loading.deleteList : false}
                  >
                    {intl.get('hzero.common.status.delete').d('删除')}
                  </Spin>
                </a>
              </Col>
            </Row>
          ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="proTaskId"
        expandedRowKeys={expandedRowKeys}
        onExpand={onExpand}
        loading={loading.search}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    );
  }
}

export default ListTable;
