import React, { PureComponent } from 'react';
import { Form, Input, Popconfirm } from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { isNull } from 'lodash';
import Upload from 'components/Upload';
import EditTable from 'components/EditTable';

/**
 * 工作清单列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} onEdit - 编辑行
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @return React.element
 */
class TaskListTable extends PureComponent {
  uploadButton;
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

  @Bind()
  afterOpenUploadModal(attachmentUUID) {
    this.setState({
      attachmentUUID,
    });
  }

  @Bind()
  onUploadSuccess(file, record, workListRecord) {
    const { onUpload } = this.props;
    const { attachmentUUID } = this.state;
    if (file) {
      onUpload({ ...record, attachmentUrl: attachmentUUID }, workListRecord);
    }
  }

  render() {
    const prefix = 'appm.projectSchedule.model.projectSchedule';
    const { tenantId, workListLoading, dataSource, fileMap, onOperateWorkList } = this.props;
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
          render: (val, record) => {
            const { attachmentUrl } = record;
            const fileList = [];
            if (attachmentUrl && this.uploadButton) {
              fileList.push({
                uid: attachmentUrl,
                name: attachmentUrl,
                thumbUrl: attachmentUrl,
                url: attachmentUrl,
              });
            }
            return (
              <span className="action-link">
                <Upload
                  tenantId={tenantId}
                  multiple={false}
                  style={{
                    display: workListRecord.workListStatus === 'PROCESSING' ? 'inline' : 'none',
                  }}
                  btnText={intl.get('hzero.common.button.upload').d('上传')}
                  afterOpenUploadModal={this.afterOpenUploadModal}
                  onUploadSuccess={file => this.onUploadSuccess(file, record, workListRecord)}
                />
                {!isNull(attachmentUrl) ? (
                  <Upload
                    viewOnly
                    tenantId={tenantId}
                    multiple={false}
                    btnText={intl.get('hzero.common.button.view').d('查看')}
                    attachmentUUID={attachmentUrl}
                  />
                ) : (
                  ''
                )}
              </span>
            );
          },
        },
      ];

      return (
        <React.Fragment>
          <EditTable
            rowKey="workListItemId"
            columns={columns}
            dataSource={fileMap[workListRecord.workListId]}
            pagination={false}
          />
        </React.Fragment>
      );
    };
    const columns = [
      {
        title: intl.get(`${prefix}.workListName`).d('名称'),
        dataIndex: 'workListName',
        width: 120,
      },
      {
        title: intl.get(`${prefix}.principalPerson`).d('负责人'),
        dataIndex: 'principalPersonName',
        width: 100,
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
        width: 100,
        dataIndex: 'operate',
        render: (val, record) =>
          record.workListStatus === 'PROCESSING' ? (
            <Popconfirm
              title={intl.get(`${prefix}.completeTitle`).d('是否完成工作项')}
              onConfirm={() => onOperateWorkList(record, 1)}
              okText={intl.get('hzero.common.button.sure').d('确认')}
              cancelText={intl.get('hzero.common.button.cancel').d('取消')}
            >
              <a style={{ display: record.totalQuantity === 0 ? 'block' : 'none' }}>
                {intl.get(`${prefix}.complete`).d('完成')}
              </a>
            </Popconfirm>
          ) : (
            <Popconfirm
              title={intl.get(`${prefix}.cancelCompleteTitle`).d('是否取消完成工作项')}
              onConfirm={() => onOperateWorkList(record, 0)}
              okText={intl.get('hzero.common.button.sure').d('确认')}
              cancelText={intl.get('hzero.common.button.cancel').d('取消')}
            >
              <a style={{ display: record.totalQuantity === 0 ? 'block' : 'none' }}>
                {intl.get(`${prefix}.cancelComplete`).d('取消完成')}
              </a>
            </Popconfirm>
          ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="workListId"
        loading={workListLoading}
        columns={columns}
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
