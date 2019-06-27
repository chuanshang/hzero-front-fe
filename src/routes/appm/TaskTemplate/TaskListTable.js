import React, { PureComponent } from 'react';
import { Form, Select, Input, Popconfirm } from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import EditTable from 'components/EditTable';

/**
 * 关系数据列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} onEdit - 编辑行
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @return React.element
 */
class TaskListTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expandedRowKeys: [],
    };
  }
  /**
   * 点击展开图标，展开行
   *  @param {Boolean} isExpand 展开标记
   *  @param {Object} record 组织行信息
   */
  @Bind()
  handleExpandSubLine(isExpand, record) {
    const { expandedRowKeys = [] } = this.state;
    const rowKeys = isExpand
      ? [...expandedRowKeys, record.taskListId]
      : expandedRowKeys.filter(item => item !== record.taskListId);
    this.setState({ expandedRowKeys: [...rowKeys] });
  }

  /**
   * 新增工作清单
   */
  @Bind()
  handleAddFile(record) {
    const { onAddFile } = this.props;
    const { expandedRowKeys } = this.state;
    this.setState({ expandedRowKeys: [...expandedRowKeys, record.taskListId] });
    onAddFile(record);
  }
  /**
   * 根据状态proTemplateStatus移除部分列
   */
  handleRemove(columns) {
    const { proTemplateStatus } = this.props;
    if (proTemplateStatus !== 'PRESET') {
      columns.splice(columns.findIndex(item => item.dataIndex === 'operate'), 1);
    }
    return columns;
  }
  render() {
    const prefix = 'appm.taskTemplate.model.taskTemplate';
    const {
      workListLoading,
      dataSource,
      projectRole,
      roles,
      fileMap,
      onEditWorkList,
      onCancelWorkList,
      onDeleteWorkList,
      onCancelFile,
      onEditFile,
      onDeleteFile,
    } = this.props;
    const { expandedRowKeys } = this.state;
    const expandedRowRender = workListRecord => {
      const columns = [
        {
          title: intl.get(`${prefix}.fileName`).d('文件名称'),
          dataIndex: 'fileName',
          width: 120,
          render: (value, record) =>
            ['create', 'update'].includes(record._status) ? (
              <Form.Item>
                {record.$form.getFieldDecorator('fileName', {
                  initialValue: record.fileName,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${prefix}.fileName`).d('文件名称'),
                      }),
                    },
                    {
                      max: 240,
                      message: intl.get('hzero.common.validation.max', {
                        max: 240,
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
          title: intl.get(`${prefix}.fileDirectory`).d('文件目录'),
          dataIndex: 'fileDirectory',
          width: 120,
        },
        {
          title: intl.get(`${prefix}.description`).d('说明'),
          dataIndex: 'description',
          width: 120,
          render: (value, record) =>
            ['create', 'update'].includes(record._status) ? (
              <Form.Item>
                {record.$form.getFieldDecorator('description', {
                  initialValue: value,
                  rules: [
                    {
                      max: 240,
                      message: intl.get('hzero.common.validation.max', {
                        max: 240,
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
          title: intl.get('hzero.common.button.action').d('操作'),
          width: 100,
          dataIndex: 'operate',
          render: (val, record) =>
            record._status === 'create' ? (
              <a onClick={() => onCancelFile(workListRecord, record)}>
                {intl.get('hzero.common.button.clean').d('清除')}
              </a>
            ) : record._status === 'update' ? (
              <a onClick={() => onEditFile(workListRecord, record, false)}>
                {intl.get('hzero.common.button.cancel').d('取消')}
              </a>
            ) : (
              <span className="action-link">
                <a onClick={() => onEditFile(workListRecord, record, true)}>
                  {intl.get('hzero.common.button.edit').d('编辑')}
                </a>
                <Popconfirm
                  title={intl.get(`${prefix}.deleteData`).d('是否删除数据')}
                  onConfirm={() => onDeleteFile(record)}
                  okText={intl.get('hzero.common.button.sure').d('确认')}
                  cancelText={intl.get('hzero.common.button.cancel').d('取消')}
                >
                  <a>{intl.get('hzero.common.button.delete').d('删除')}</a>
                </Popconfirm>
              </span>
            ),
        },
      ];
      const newColumns = this.handleRemove(columns);
      return (
        <EditTable
          rowKey="taskListItemId"
          columns={newColumns}
          dataSource={fileMap[workListRecord.taskListId]}
          pagination={false}
        />
      );
    };
    const columns = [
      {
        title: intl.get(`${prefix}.taskListName`).d('名称'),
        dataIndex: 'taskListName',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('taskListName', {
                initialValue: record.taskListName,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.taskListName`).d('名称'),
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
        title: intl.get(`${prefix}.principalRole`).d('负责角色'),
        dataIndex: 'principalRoleId',
        width: 120,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('principalRoleId', {
                initialValue: record._status === 'create' ? '' : String(value),
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.principalRole`).d('负责角色'),
                    }),
                  },
                ],
              })(
                <Select allowClear style={{ width: '100%' }}>
                  {projectRole
                    .filter(i => roles.indexOf(i.value) !== -1)
                    .map(i => (
                      <Select.Option key={i.value}>{i.meaning}</Select.Option>
                    ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            record.roleName
          ),
      },
      {
        title: intl.get(`${prefix}.totalQuantity`).d('交付物'),
        dataIndex: 'totalQuantity',
        width: 100,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 200,
        dataIndex: 'operate',
        render: (val, record) =>
          record._status === 'create' ? (
            <span className="action-link">
              <a onClick={() => onCancelWorkList(record)}>
                {intl.get('hzero.common.button.clean').d('清除')}
              </a>
              <a onClick={() => this.handleAddFile(record)}>
                {intl.get(`${prefix}.new`).d('新增交付物')}
              </a>
            </span>
          ) : record._status === 'update' ? (
            <span className="action-link">
              <a onClick={() => onEditWorkList(record, false)}>
                {intl.get('hzero.common.button.cancel').d('取消')}
              </a>
              <a onClick={() => this.handleAddFile(record)}>
                {intl.get(`${prefix}.new`).d('新增交付物')}
              </a>
            </span>
          ) : (
            <span className="action-link">
              <a onClick={() => onEditWorkList(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
              <a onClick={() => this.handleAddFile(record)}>
                {intl.get(`${prefix}.new`).d('新增交付物')}
              </a>
              <Popconfirm
                title={intl.get(`${prefix}.deleteData`).d('是否删除数据')}
                onConfirm={() => onDeleteWorkList(record)}
                okText={intl.get('hzero.common.button.sure').d('确认')}
                cancelText={intl.get('hzero.common.button.cancel').d('取消')}
              >
                <a>{intl.get('hzero.common.button.delete').d('删除')}</a>
              </Popconfirm>
            </span>
          ),
      },
    ];
    const newColumns = this.handleRemove(columns);
    return (
      <EditTable
        bordered
        rowKey="taskListId"
        loading={workListLoading}
        columns={newColumns}
        dataSource={dataSource}
        pagination={false}
        onExpand={this.handleExpandSubLine}
        expandedRowKeys={expandedRowKeys}
        expandedRowRender={record => expandedRowRender(record)}
      />
    );
  }
}
export default TaskListTable;
