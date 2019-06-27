import React, { Component } from 'react';
import { Form, Input, Select, InputNumber } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
// import { sum, isNumber } from 'lodash';
import { yesOrNoRender, enableRender } from 'utils/renderer';
import intl from 'utils/intl';
import Checkbox from 'components/Checkbox';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
/**
 * 属性行展示列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} onCleanLine - 清除行
 * @reactProps {Function} onEditLine - 编辑行
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @return React.element
 */
class DetailList extends Component {
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

  /**
   * 变更单元格样式
   * @param {number} length - 单元格长度
   */
  handleCell(length) {
    return {
      style: {
        overflow: 'hidden',
        maxWidth: length,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      onClick: e => {
        const { target } = e;
        if (target.style.whiteSpace === 'normal') {
          target.style.whiteSpace = 'nowrap';
        } else {
          target.style.whiteSpace = 'normal';
        }
      },
    };
  }

  render() {
    const {
      loading,
      dataSource,
      onCleanLine,
      onEditLine,
      fieldTypes = [],
      tenantId,
      editControl,
    } = this.props;
    const modelPrompt = `appm.proAttributeSet.model.proAttributeSet`;
    const columns = [
      {
        title: intl.get(`appm.common.model.num`).d('编号'),
        dataIndex: 'lineNum',
        width: 80,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('lineNum', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`appm.common.model.num`).d('编号'),
                    }),
                  },
                ],
                initialValue: val,
              })(<InputNumber disabled precision={0} min={0} style={{ width: '100%' }} />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.attributeName`).d('属性名'),
        dataIndex: 'attributeName',
        width: 120,
        onCell: () => this.handleCell(150),
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('attributeName', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.attributeName`).d('属性名'),
                    }),
                  },
                ],
              })(<Input disabled={record._status !== 'create'} />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.requiredFlag`).d('是否必须'),
        dataIndex: 'requiredFlag',
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('requiredFlag', {
                initialValue: record.requiredFlag,
              })(<Checkbox />)}
            </Form.Item>
          ) : (
            <span>{yesOrNoRender(val)}</span>
          ),
      },
      {
        title: intl.get(`${modelPrompt}.attributeType`).d('字段类型'),
        dataIndex: 'attributeType',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('attributeType', {
                initialValue: record.attributeTypeMeaning,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.attributeType`).d('字段类型'),
                    }),
                  },
                ],
              })(
                <Select style={{ width: '100%' }}>
                  {fieldTypes.map(n => (
                    <Select.Option key={n.value}>{n.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            record.attributeTypeMeaning
          ),
      },
      {
        title: intl.get(`${modelPrompt}.lovValue`).d('值集编码'),
        dataIndex: 'lovValue',
        width: 150,
        onCell: () => this.handleCell(180),
        render: (val, record) => {
          if (['update', 'create'].includes(record._status)) {
            const { getFieldDecorator, getFieldValue } = record.$form;
            const editFlag = ['ValueList', 'Lov'].includes(getFieldValue('attributeType'));
            return (
              <Form.Item>
                {getFieldDecorator('lovValue', {
                  initialValue: val,
                })(
                  <Lov
                    disabled={!editFlag}
                    code="HPFM.LOV.LOV_DETAIL_CODE.ORG"
                    queryParams={{ organizationId: tenantId }}
                  />
                )}
              </Form.Item>
            );
          } else {
            return val;
          }
        },
      },
      {
        title: intl.get(`${modelPrompt}.uom`).d('单位'),
        dataIndex: 'uomId',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('uomId', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.uom`).d('单位'),
                    }),
                  },
                ],
              })(<Lov code="AMDM.UOM" queryParams={{ tenantId }} textValue={record.uomName} />)}
            </Form.Item>
          ) : (
            record.uomName
          ),
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('描述'),
        dataIndex: 'description',
        width: 200,
        onCell: () => this.handleCell(250),
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('description', {
                initialValue: record.description,
              })(<Input />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.enable`).d('是否启用'),
        dataIndex: 'enabledFlag',
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('enabledFlag', {
                initialValue: record.enabledFlag,
                valuePropName: 'checked',
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
            <a disabled={!editControl} onClick={() => onEditLine(record, true)}>
              {intl.get('hzero.common.status.edit').d('编辑')}
            </a>
          ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="lineId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    );
  }
}
export default DetailList;
