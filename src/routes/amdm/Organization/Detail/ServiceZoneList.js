import React, { Component } from 'react';
import { Form } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { yesOrNoRender, enableRender } from 'utils/renderer';
import intl from 'utils/intl';
import Checkbox from 'components/Checkbox';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';

/**
 * 关联服务区域展示列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} onCleanLine - 清除行
 * @reactProps {Function} onEditLine - 编辑行
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @return React.element
 */
class ServiceZoneList extends Component {
  /**
   * 表单改变时执行
   */
  @Bind()
  handleUpdateState(record, lovList) {
    const { $form: form } = record;
    // eslint-disable-next-line
    record.isEdit = true;
    if (lovList) {
      const setFormData = {
        lovFlag: lovList.lovFlag,
        componentType: lovList.componentType,
        dataType: lovList.dataType,
      };
      form.setFieldsValue(setFormData);
      if (lovList.lovFlag === 0) {
        form.setFieldsValue({ lovCode: '' });
      }
    }
  }

  render() {
    const { loading, dataSource, onCleanLine, onEditLine, tenantId } = this.props;
    const modelPrompt = `amdm.organization.model.organization`;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.maintSitesName`).d('服务区域'),
        dataIndex: 'maintSitesName',
        width: 100,
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('maintSitesId', {
                initialValue: record.maintSitesId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.maintSitesName`).d('服务区域'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="AMDM.ASSET_MAINT_SITE"
                  queryParams={{ organizationId: tenantId }}
                  textValue={val}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.maintenanceServiceFlag`).d('维修维护业务'),
        dataIndex: 'maintenanceServiceFlag',
        width: 150,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('maintenanceServiceFlag', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.maintenanceServiceFlag`).d('维修维护业务'),
                    }),
                  },
                ],
              })(<Checkbox />)}
            </Form.Item>
          ) : (
            <span>{yesOrNoRender(val)}</span>
          ),
      },
      {
        title: intl.get(`${modelPrompt}.otherServiceFlag`).d('其他业务'),
        dataIndex: 'otherServiceFlag',
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('otherServiceFlag', {
                initialValue: val,
              })(<Checkbox />)}
            </Form.Item>
          ) : (
            <span>{yesOrNoRender(val)}</span>
          ),
      },
      {
        title: intl.get(`${modelPrompt}.enabledFlag`).d('状态'),
        dataIndex: 'enabledFlag',
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('enabledFlag', {
                initialValue: val,
              })(<Checkbox />)}
            </Form.Item>
          ) : (
            <span>{enableRender(val)}</span>
          ),
      },
      {
        title: intl.get('hzero.common.operator').d('操作'),
        width: 100,
        align: 'center',
        render: (val, record) =>
          record._status === 'create' ? (
            <a onClick={() => onCleanLine(record)}>
              {intl.get('hzero.common.button.clean').d('清除')}
            </a>
          ) : record._status === 'update' ? (
            <a onClick={() => onEditLine(record, false)}>
              {intl.get('hzero.common.status.cancel').d('取消')}
            </a>
          ) : (
            <a onClick={() => onEditLine(record, true)}>
              {intl.get('hzero.common.status.edit').d('编辑')}
            </a>
          ),
      },
    ];

    return (
      <EditTable
        bordered
        rowKey="orgToSitesId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    );
  }
}
export default ServiceZoneList;
