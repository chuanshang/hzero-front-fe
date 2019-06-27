import React, { PureComponent } from 'react';
import { Form, Select, Input, Popconfirm } from 'hzero-ui';
import intl from 'utils/intl';
import { isNull } from 'lodash';
import { Bind } from 'lodash-decorators';
import EditTable from 'components/EditTable';
import Upload from 'components/Upload';

/**
 * 工作清单列表
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
      ? [...expandedRowKeys, record.workListId]
      : expandedRowKeys.filter(item => item !== record.workListId);
    this.setState({ expandedRowKeys: [...rowKeys] });
  }

  /**
   * 新增工作清单
   */
  @Bind()
  handleAddFile(record) {
    const { onAddFile } = this.props;
    const { expandedRowKeys } = this.state;
    this.setState({ expandedRowKeys: [...expandedRowKeys, record.workListId] });
    onAddFile(record);
  }

  /**
   * 负责人、负责角色变化时
   */
  @Bind()
  handleSelectChange(val, record, flag) {
    const { otherRoles, otherUsers } = this.props;
    let list = [];
    switch (flag) {
      case 'principalRole':
        {
          list = otherRoles.filter(item => item.value === Number(val));
          const principalPersonId = list[0].staffId;
          record.$form.setFieldsValue({ principalPersonId: String(principalPersonId) });
        }
        break;
      case 'principalPerson':
        {
          list = otherUsers.filter(item => item.value === Number(val));
          const principalRoleId = list[0].proRoleId;
          record.$form.setFieldsValue({ principalRoleId: String(principalRoleId) });
        }
        break;
      default:
    }
  }
  /**
   * 根据状态wbsStatus移除部分列
   */
  handleRemove(columns) {
    const { wbsStatus } = this.props;
    if (wbsStatus !== 'PRESET') {
      columns.splice(columns.findIndex(item => item.dataIndex === 'operate'), 1);
    }
    return columns;
  }
  render() {
    const prefix = 'appm.taskTemplate.model.taskTemplate';
    const {
      tenantId,
      wbsStatus,
      workListLoading,
      dataSource,
      otherUsers,
      otherRoles,
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
                  initialValue: record.description,
                })(<Input />)}
              </Form.Item>
            ) : (
              value
            ),
        },
        {
          title: intl.get('hzero.common.button.action').d('操作'),
          width: 150,
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
                {!isNull(record.attachmentUrl) ? (
                  <Upload
                    viewOnly
                    tenantId={tenantId}
                    multiple={false}
                    btnText={intl.get('hzero.common.button.view').d('查看')}
                    attachmentUUID={record.attachmentUrl}
                  />
                ) : (
                  ''
                )}
                <a
                  style={{ display: wbsStatus === 'PRESET' ? 'inline' : 'none' }}
                  onClick={() => onEditFile(workListRecord, record, true)}
                >
                  {intl.get('hzero.common.button.edit').d('编辑')}
                </a>
                <Popconfirm
                  title={intl.get(`${prefix}.deleteData`).d('是否删除数据')}
                  onConfirm={() => onDeleteFile(record)}
                  okText={intl.get('hzero.common.button.sure').d('确认')}
                  cancelText={intl.get('hzero.common.button.cancel').d('取消')}
                >
                  <a style={{ display: wbsStatus === 'PRESET' ? 'inline' : 'none' }}>
                    {intl.get('hzero.common.button.delete').d('删除')}
                  </a>
                </Popconfirm>
              </span>
            ),
        },
      ];
      return (
        <EditTable
          rowKey="workListItemId"
          columns={columns}
          dataSource={fileMap[workListRecord.workListId]}
          pagination={false}
        />
      );
    };
    const columns = [
      {
        title: intl.get(`${prefix}.workListName`).d('名称'),
        dataIndex: 'workListName',
        width: 120,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('workListName', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.workListName`).d('名称'),
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
                <Select
                  allowClear
                  style={{ width: '100%' }}
                  onChange={val => this.handleSelectChange(val, record, 'principalRole')}
                >
                  {otherRoles.map(i => (
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
        title: intl.get(`${prefix}.principalPerson`).d('负责人'),
        dataIndex: 'principalPersonId',
        width: 100,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('principalPersonId', {
                initialValue: record._status === 'create' ? '' : String(value),
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.principalPerson`).d('负责人'),
                    }),
                  },
                ],
              })(
                <Select
                  allowClear
                  style={{ width: '100%' }}
                  onChange={val => this.handleSelectChange(val, record, 'principalPerson')}
                >
                  {otherUsers.map(i => (
                    <Select.Option key={i.value}>{i.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            record.principalPersonName
          ),
      },
      {
        title: intl.get(`${prefix}.totalQuantity`).d('交付物完成'),
        dataIndex: 'totalQuantity',
        width: 100,
        render: (value, record) =>
          record._status === 'create' ? '' : `${value}/${record.deliveryQuantity}`,
      },
      {
        title: intl.get(`${prefix}.status`).d('状态'),
        dataIndex: 'workListStatusMeaning',
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
        rowKey="workListId"
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
