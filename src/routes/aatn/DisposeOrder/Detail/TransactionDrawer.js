import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Row, Spin, Button, Select, InputNumber } from 'hzero-ui';
import Switch from 'components/Switch';
import moment from 'moment';
import Lov from 'components/Lov';
import { getDateFormat } from 'utils/utils';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty } from 'lodash';
import { dateRender, yesOrNoRender } from 'utils/renderer';
import intl from 'utils/intl';
import { getComponentType, getComponentProps } from './util';

/**
 * 事务处理行明细-滑窗(抽屉)
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {string} anchor - 抽屉滑动位置
 * @reactProps {string} title - 抽屉标题
 * @reactProps {boolean} visible - 抽屉是否可见
 * @reactProps {Function} onOk - 抽屉确定操作
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
class TransactionDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dateFormat: getDateFormat(),
      disposePersonName: '',
    };
  }
  /**
   * 组件属性定义
   */
  static propTypes = {
    anchor: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
    title: PropTypes.string,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };
  /**
   * 组件属性默认值设置
   */
  static defaultProps = {
    anchor: 'right',
    title: '',
    visible: false,
    onOk: e => e,
    onCancel: e => e,
  };
  /**
   * 确定操作
   */
  @Bind()
  saveBtn() {
    const { form, onOk } = this.props;
    const { ...extField } = this.state;

    if (onOk) {
      form.validateFields((err, values) => {
        if (!err) {
          // 校验通过，进行保存操作
          onOk({ ...values, ...extField });
        }
      });
    }
  }
  @Bind()
  disposePriceChange(value) {
    const {
      form: { setFieldsValue, getFieldsValue },
    } = this.props;
    const { disposeCost } = getFieldsValue();
    const disposeIncome = value - disposeCost;
    setFieldsValue({
      disposeIncome,
    });
  }
  @Bind()
  disposeCostChange(value) {
    const {
      form: { setFieldsValue, getFieldsValue },
    } = this.props;
    const { disposePrice } = getFieldsValue();
    const disposeIncome = disposePrice - value;
    setFieldsValue({
      disposeIncome,
    });
  }
  @Bind()
  disposePersonChange(value, record) {
    this.setState({ disposePersonName: record.name });
  }

  /**
   * 根据属性行内容动态渲染属性折叠部分表单内容
   * @param {Array} [attributeInfo=[]]
   */
  @Bind()
  getAttributeInfo(attributeInfo = [], dataSource) {
    const {
      isNew,
      editControl,
      tenantId,
      dynamicLovDisplayFieldList = [],
      dynamicSelectLovList = [],
      form: { getFieldDecorator, registerField, setFieldsValue },
    } = this.props;
    const renderTemplates = [];
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    attributeInfo.forEach(item => {
      // 获取组件类型，若存在Lov则获取其Code
      let lovAttribute = [];
      let selectAttribute = [];
      let lovType = '';
      dynamicLovDisplayFieldList.forEach(i => {
        if (i.lovCode === item.lovName) {
          lovAttribute = i;
        }
      });
      dynamicSelectLovList.forEach(i => {
        if (i.lovCode === item.lovName) {
          selectAttribute = i.lovList;
        }
      });
      lovType = item.lovType === 'BOOLEAN' ? 'Switch' : item.lovType;
      const field = {
        fieldId: `current#${item.fieldId}`,
        lovCode: item.lovName,
        componentType: lovType,
        fieldCode: 'fieldColumn',
      };
      const componentType = getComponentType(field);
      const componentProps = getComponentProps({ field, componentType: field.componentType });
      const dynamicColumn = dataSource.orderDynamicColumnList
        ? dataSource.orderDynamicColumnList
        : [];
      let initValueCurrent = '';
      let currentLovDisplay = '';
      let initValueTarget = '';
      let targetLovDisplay = '';
      // 获取已经保存的动态字段值
      dynamicColumn.forEach(i => {
        if (i.currentColumnName === item.fieldColumn) {
          if (item.lovType === 'DatePicker') {
            initValueCurrent =
              isUndefined(i.currentColumnValue) || isEmpty(i.currentColumnValue)
                ? ''
                : moment(i.currentColumnValue, getDateFormat());
            initValueTarget =
              isUndefined(i.targetColumnValue) || isEmpty(i.targetColumnValue)
                ? ''
                : moment(i.targetColumnValue, getDateFormat());
          } else {
            initValueCurrent = i.currentColumnValue;
            initValueTarget = i.targetColumnValue;
          }
          if (item.lovType === 'Lov') {
            currentLovDisplay = i.currentColumnDesc;
            targetLovDisplay = i.targetColumnDesc;
          }
        }
      });
      // 当前初始值
      initValueCurrent =
        initValueCurrent ||
        (item.lovType === 'DatePicker'
          ? isUndefined(dataSource[this.toCamelCaseVar(item.fieldColumn)]) ||
            isEmpty(dataSource[this.toCamelCaseVar(item.fieldColumn)])
            ? ''
            : moment(dataSource[this.toCamelCaseVar(item.fieldColumn)], getDateFormat())
          : dataSource[this.toCamelCaseVar(item.fieldColumn)]) ||
        '';
      // 当前lov显示值
      currentLovDisplay = currentLovDisplay || dataSource[this.toCamelCaseVar(item.descCode)];
      // 目标初始值
      initValueTarget = initValueTarget || (item.fieldType === 'CLEAN' ? '' : initValueCurrent);
      // 目标 lov 显示值
      targetLovDisplay = targetLovDisplay || (item.fieldType === 'CLEAN' ? '' : currentLovDisplay);

      // 当前默认属性
      const propsCurrent = {
        disabled: true,
      };
      const propsTarget = {
        disabled: dataSource.processStatus !== 'NEW' || item.fieldType === 'READ_ONLY',
      };
      const datePickerProps =
        item.lovType === 'DatePicker'
          ? {
              format: getDateFormat(),
            }
          : {};
      let templateCurrent = '';
      let templateTarget = '';
      if (isNew || editControl) {
        templateCurrent = (
          <Form.Item
            label={`${item.fieldType === 'READ_ONLY' ? '' : '当前'}${item.fieldColumnMeaning}`}
            {...formLayout}
          >
            {getFieldDecorator(`current#${item.fieldId}`, {
              initialValue: initValueCurrent,
            })(
              item.lovType === 'BOOLEAN' ? (
                <Switch disabled />
              ) : item.lovType === 'ValueList' ? (
                <Select disabled>
                  {selectAttribute.map(i => (
                    <Select.Option key={i.value}>{i.meaning}</Select.Option>
                  ))}
                </Select>
              ) : item.lovType === 'Lov' ? (
                <Lov disabled textValue={currentLovDisplay} />
              ) : (
                React.createElement(
                  componentType,
                  Object.assign({}, { ...componentProps, ...propsCurrent, ...datePickerProps })
                )
              )
            )}
            {item.lovType === 'Lov'
              ? getFieldDecorator(`currentName#${item.fieldId}`, {
                  initialValue: currentLovDisplay,
                })
              : null}
          </Form.Item>
        );
        templateTarget =
          item.fieldType === 'READ_ONLY' ? (
            ''
          ) : (
            <Form.Item label={`目标${item.fieldColumnMeaning}`} {...formLayout}>
              {getFieldDecorator(`target#${item.fieldId}`, {
                initialValue: initValueTarget,
                rules: !propsTarget.disabled
                  ? [
                      {
                        required: item.fieldType === 'MUST_MODIFY',
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl
                            .get(
                              `aatn.assetStatusChange.model.assetStatusChange.target#${
                                item.fieldId
                              }`
                            )
                            .d(`target${item.fieldColumnMeaning}`),
                        }),
                      },
                    ]
                  : [],
              })(
                item.lovType === 'BOOLEAN' ? (
                  <Switch />
                ) : item.lovType === 'ValueList' ? (
                  <Select>
                    {selectAttribute.map(i => (
                      <Select.Option key={i.value}>{i.meaning}</Select.Option>
                    ))}
                  </Select>
                ) : item.lovType === 'Lov' ? (
                  <Lov
                    disabled={item.fieldType === `CLEAN`}
                    code={item.lovName}
                    onChange={(_, record) => {
                      registerField(`targetName#${item.fieldId}`);
                      setFieldsValue({
                        [`targetName#${item.fieldId}`]: record[lovAttribute.displayField],
                      });
                    }}
                    queryParams={{ tenantId }}
                    textValue={targetLovDisplay}
                  />
                ) : (
                  React.createElement(
                    componentType,
                    Object.assign({}, { ...componentProps, ...propsTarget, ...datePickerProps })
                  )
                )
              )}
              {item.lovType === 'Lov'
                ? getFieldDecorator(`targetName#${item.fieldId}`, {
                    initialValue: targetLovDisplay,
                  })
                : null}
            </Form.Item>
          );
      } else {
        templateCurrent = (
          <Form.Item
            label={`${item.fieldType === 'READ_ONLY' ? '' : '当前'}${item.fieldColumnMeaning}`}
            {...formLayout}
          >
            <span>
              {item.lovType === 'Lov'
                ? currentLovDisplay
                : item.lovType === 'BOOLEAN'
                ? yesOrNoRender(initValueCurrent)
                : item.lovType === 'DatePicker'
                ? dateRender(initValueCurrent)
                : initValueCurrent || ''}
            </span>
          </Form.Item>
        );
        templateTarget =
          item.fieldType === 'READ_ONLY' ? (
            ''
          ) : (
            <Form.Item label={`目标${item.fieldColumnMeaning}`} {...formLayout}>
              <span>
                {item.lovType === 'Lov'
                  ? targetLovDisplay
                  : item.lovType === 'BOOLEAN'
                  ? yesOrNoRender(initValueTarget)
                  : item.lovType === 'DatePicker'
                  ? dateRender(initValueTarget)
                  : initValueTarget || ''}
              </span>
            </Form.Item>
          );
      }
      renderTemplates.push(templateCurrent);
      renderTemplates.push(templateTarget);
    });
    return renderTemplates;
  }

  toCamelCaseVar(variable) {
    return variable.replace(/_+[a-zA-Z]/g, (str, index) =>
      index ? str.substr(-1).toUpperCase() : str
    );
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const commonPromptCode = 'aatn.disposeOrder.model.disposeOrder';
    const {
      isNew,
      form,
      title,
      loading,
      anchor,
      editControl,
      assetStatus,
      drawerVisible,
      disposeLineStatus,
      disposeType,
      transferTypeList,
      tenantId,
      dataSource,
      onCancel,
      onChangeLineStatus,
      disposeOrderConfirmLoading,
    } = this.props;
    const { getFieldDecorator } = form;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal
        destroyOnClose
        title={title}
        width={450}
        wrapClassName={`ant-modal-sidebar-${anchor}`}
        transitionName={`move-${anchor}`}
        visible={drawerVisible}
        onCancel={onCancel}
        confirmLoading={disposeOrderConfirmLoading}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
        footer={
          <div>
            {dataSource.clickFlag === 'view' ? (
              <Button type="primary" onClick={onCancel}>
                {intl.get('hzero.common.button.close').d('关闭')}
              </Button>
            ) : dataSource.clickFlag === 'disposition' ? (
              <Button type="primary" onClick={() => onChangeLineStatus(dataSource)}>
                {intl.get('aatn.transferOrder.button.dispositionSure').d('处置确认')}
              </Button>
            ) : isNew || editControl ? (
              <Button type="primary" onClick={this.saveBtn}>
                {intl.get('hzero.common.button.sure').d('确认')}
              </Button>
            ) : (
              ''
            )}
            <Button onClick={onCancel}>{intl.get('hzero.common.button.cancel').d('取消')}</Button>
          </div>
        }
      >
        <Spin spinning={loading}>
          <Form>
            <Row>
              <Form.Item
                label={intl.get(`${commonPromptCode}.assetName`).d('设备/资产')}
                {...formLayout}
              >
                {isNew || editControl ? (
                  getFieldDecorator('assetName', {
                    initialValue: dataSource.assetName,
                  })(<Input disabled />)
                ) : (
                  <span>{dataSource.assetName}</span>
                )}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item
                label={intl.get(`${commonPromptCode}.assetDesc`).d('资产名称')}
                {...formLayout}
              >
                {isNew || editControl ? (
                  getFieldDecorator('assetDesc', {
                    initialValue: dataSource.assetDesc,
                  })(<Input disabled />)
                ) : (
                  <span>{dataSource.assetDesc}</span>
                )}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item
                label={intl.get(`${commonPromptCode}.processStatus`).d('处理状态')}
                {...formLayout}
              >
                {isNew || editControl ? (
                  getFieldDecorator('processStatus', {
                    initialValue: dataSource.processStatus,
                  })(
                    <Select style={{ width: 150 }} disabled allowClear>
                      {disposeLineStatus.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  )
                ) : (
                  <span>{dataSource.processStatusMeaning}</span>
                )}
              </Form.Item>
            </Row>
            <Row>{this.getAttributeInfo(transferTypeList, dataSource)}</Row>
            <Row>
              <Form.Item
                label={intl.get(`${commonPromptCode}.currentAssetStatus`).d('当前资产状态')}
                {...formLayout}
              >
                {isNew || editControl ? (
                  getFieldDecorator('currentAssetStatusId', {
                    initialValue: dataSource.currentAssetStatusId,
                  })(
                    <Lov
                      disabled
                      code="AAFM.ASSET_STATUS"
                      queryParams={{ tenantId }}
                      textValue={dataSource.currentAssetStatusName}
                    />
                  )
                ) : (
                  <span>{dataSource.currentAssetStatusName}</span>
                )}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item
                label={intl.get(`${commonPromptCode}.targetAssetStatus`).d('目标资产状态')}
                {...formLayout}
              >
                {isNew || editControl ? (
                  getFieldDecorator('targetAssetStatusId', {
                    initialValue: assetStatus.assetStatusId,
                  })(
                    <Lov
                      disabled
                      code="AAFM.ASSET_STATUS"
                      queryParams={{ tenantId }}
                      textValue={assetStatus.sysStatusName}
                    />
                  )
                ) : (
                  <span>{assetStatus.sysStatusName}</span>
                )}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item
                label={intl.get(`${commonPromptCode}.disposeTypeCode`).d('资产处置类型')}
                {...formLayout}
              >
                {isNew || editControl ? (
                  getFieldDecorator('disposeTypeCode', {
                    initialValue: dataSource.disposeTypeCode,
                  })(
                    <Select style={{ width: 150 }}>
                      {disposeType.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  )
                ) : (
                  <span>{dataSource.disposeTypeCodeMeaning}</span>
                )}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item
                label={intl.get(`${commonPromptCode}.disposePerson`).d('处置人员')}
                {...formLayout}
              >
                {isNew || editControl ? (
                  getFieldDecorator('disposePersonId', {
                    initialValue: dataSource.disposePersonId,
                  })(
                    <Lov
                      code="HALM.EMPLOYEE"
                      onChange={this.disposePersonChange}
                      queryParams={{ tenantId }}
                      textValue={dataSource.disposePersonName}
                    />
                  )
                ) : (
                  <span>{dataSource.disposePersonName}</span>
                )}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item
                label={intl.get(`${commonPromptCode}.disposePrice`).d('处置价格')}
                {...formLayout}
              >
                {isNew || editControl ? (
                  getFieldDecorator('disposePrice', {
                    initialValue: dataSource.disposePrice,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonPromptCode}.disposePrice`).d('处置价格'),
                        }),
                      },
                    ],
                  })(<InputNumber precision={2} onChange={_ => this.disposePriceChange(_)} />)
                ) : (
                  <span>{dataSource.disposePrice}</span>
                )}
              </Form.Item>
            </Row>
            {/* <Row>
              <Form.Item
                label={intl.get(`${commonPromptCode}.disposeCost`).d('处置成本')}
                {...formLayout}
              >
                {isNew || editControl ? (
                  getFieldDecorator('disposeCost', {
                    initialValue: dataSource.disposeCost,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonPromptCode}.disposeCost`).d('处置成本'),
                        }),
                      },
                    ],
                  })(<InputNumber precision={2} onChange={_ => this.disposeCostChange(_)} />)
                ) : (
                  <span>{dataSource.disposeCost}</span>
                )}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item
                label={intl.get(`${commonPromptCode}.disposeRate`).d('税率')}
                {...formLayout}
              >
                {isNew || editControl ? (
                  getFieldDecorator('disposeRate', {
                    initialValue: dataSource.disposeRate,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonPromptCode}.disposeRate`).d('税率'),
                        }),
                      },
                    ],
                  })(
                    <InputNumber
                      min={0}
                      max={100}
                      formatter={value => `${value}%`}
                      parser={value => value.replace('%', '')}
                    />
                  )
                ) : (
                  <span>{dataSource.disposeRate}</span>
                )}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item
                label={intl.get(`${commonPromptCode}.disposeIncome`).d('处置收益')}
                {...formLayout}
              >
                {isNew || editControl ? (
                  getFieldDecorator('disposeIncome', {
                    initialValue: dataSource.disposeIncome,
                  })(<Input disabled />)
                ) : (
                  <span>{dataSource.disposeIncome}</span>
                )}
              </Form.Item>
            </Row> */}
            <Row>
              <Form.Item
                label={intl.get(`${commonPromptCode}.description`).d('备注')}
                {...formLayout}
              >
                {isNew || editControl ? (
                  getFieldDecorator('description', {
                    initialValue: dataSource.description,
                  })(<Input.TextArea disabled rows={3} />)
                ) : (
                  <span>{dataSource.description}</span>
                )}
              </Form.Item>
            </Row>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
export default TransactionDrawer;
