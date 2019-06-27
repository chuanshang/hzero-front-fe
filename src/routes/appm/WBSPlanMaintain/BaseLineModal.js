import React, { PureComponent } from 'react';
import { Modal, Form, Input } from 'hzero-ui';
import Checkbox from 'components/Checkbox';
import EditTable from 'components/EditTable';
import intl from 'utils/intl';
import { yesOrNoRender } from 'utils/renderer';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import { isEmpty, isUndefined } from 'lodash';

class BaseLineModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tempDataSource: [],
    };
  }
  /**
   * 主要关系只能有一个
   */
  @Bind()
  checkPrimaryFlagUnique(rule, value, callback, record) {
    const { tempDataSource } = this.state;
    const { dataSource } = this.props;
    const newList = [...dataSource, ...tempDataSource].filter(
      item => item.proBaseWbsId !== record.proBaseWbsId
    );
    if (!isEmpty(newList)) {
      newList.forEach(element => {
        if (element.primaryFlag === 1 && value === 1) {
          callback(intl.get('appm.common.view.validation.primaryFlag.unique').d('主要关系已存在'));
        }
      });
      callback();
    } else {
      callback();
    }
  }
  @Bind()
  handleRelationChange(e, record) {
    const { dataSource } = this.props;
    const temp = dataSource.map(item =>
      item.proBaseWbsId === record.proBaseWbsId ? { ...item, primaryFlag: e.target.checked } : item
    );
    this.setState({ tempDataSource: temp });
  }

  /**
   * 版本概述Lov存的是wbsHeaderId，
   * 改变时，还需要额外注册remark字段和wbsVersion字段
   */
  handleRemarkChange(_, lovRecord, record) {
    record.$form.registerField('remark');
    record.$form.setFieldsValue({ remark: record.remark });
    record.$form.registerField('wbsVersion');
    record.$form.setFieldsValue({ wbsVersion: record.wbsVersion });
  }
  render() {
    const prefix = 'appm.wbsPlanMaintain.model.wbsPlanMaintain';
    const {
      tenantId,
      projectId,
      dataSource,
      modalVisible,
      searchBaseLine,
      saveBaseLine,
      onCancel,
      onSave,
      onEdit,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${prefix}.baseWbsName`).d('基线编号'),
        dataIndex: 'baseWbsName',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.description`).d('说明'),
        dataIndex: 'description',
        width: 120,
        render: (value, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('description', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.description`).d('说明'),
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
        title: intl.get(`${prefix}.remark`).d('版本概述'),
        dataIndex: 'remark',
        width: 120,
        render: (val, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('wbsHeaderId', {
                initialValue: record.wbsHeaderId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.remark`).d('版本概述'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="APPM.BASE_WBS"
                  textValue={record.remark}
                  onChange={(_, lovRecord) => this.handleRemarkChange(_, lovRecord, record)}
                  queryParams={{ projectId, organizationId: tenantId }}
                />
              )}
            </Form.Item>
          ) : !isUndefined(record.remark) ? (
            `${record.remark} (${record.wbsVersion}.0)`
          ) : (
            ''
          ),
      },
      {
        title: intl.get(`${prefix}.primaryFlag`).d('主要'),
        dataIndex: 'primaryFlag',
        width: 60,
        render: (val, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('primaryFlag', {
                initialValue: val,
                // rules: [
                //   {
                //     validator: (rule, value, callback) =>
                //       this.checkPrimaryFlagUnique(rule, value, callback, record),
                //   },
                // ],
              })(<Checkbox onChange={e => this.handleRelationChange(e, record)} />)}
            </Form.Item>
          ) : (
            yesOrNoRender(val)
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 60,
        dataIndex: 'operate',
        render: (val, record) =>
          typeof record.proBaseWbsId === 'number' && record._status !== 'update' ? (
            <a onClick={() => onEdit(record, true)}>{intl.get(`${prefix}.replace`).d('替换')}</a>
          ) : record._status === 'update' ? (
            <a onClick={() => onEdit(record, false)}>
              {intl.get('hzero.common.button.cancel').d('取消')}
            </a>
          ) : (
            <a onClick={() => onEdit(record, true)}>
              {intl.get('hzero.common.button.edit').d('编辑')}
            </a>
          ),
      },
    ];
    return (
      <Modal
        visible={modalVisible}
        onCancel={onCancel}
        width={600}
        title={intl.get(`${prefix}.baseLine`).d('设定基线')}
        confirmLoading={saveBaseLine}
        onOk={onSave}
        okText={intl.get('hzero.common.button.save').d('保存')}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
      >
        <EditTable
          bordered
          width={500}
          rowKey="proBaseWbsId"
          loading={searchBaseLine}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </Modal>
    );
  }
}
export default BaseLineModal;
