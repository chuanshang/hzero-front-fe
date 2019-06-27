import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Select, Row, Col, Button } from 'hzero-ui';
import Lov from 'components/Lov';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { getDateFormat } from 'utils/utils';
import { isUndefined, isEmpty } from 'lodash';
import { dateRender, yesOrNoRender } from 'utils/renderer';
import moment from 'moment';
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
      targetOwningPersonName: '',
      targetUsingPersonName: '',
      targetLocationName: '',
      dynamicList: [], // 需保存的动态字段
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
    const { form, onOk, dataSource } = this.props;
    if (onOk) {
      form.validateFields((err, values) => {
        if (!err) {
          const { targetOwningPersonName, targetUsingPersonName, targetLocationName } = this.state;
          // 校验通过，进行保存操作
          onOk({
            ...dataSource,
            ...values,
            targetOwningPersonName,
            targetUsingPersonName,
            targetLocationName,
          });
        }
      });
    }
  }

  /**
   * 确定操作
   */
  @Bind()
  executeChange() {
    const { form, onExecute, dataSource } = this.props;
    if (onExecute) {
      form.validateFields((err, values) => {
        if (!err) {
          // 校验通过，进行保存操作
          onExecute({
            ...dataSource,
            ...values,
          });
        }
      });
    }
  }

  /**
   * 设置名称
   */
  @Bind()
  handleSetName(_, record, flag) {
    switch (flag) {
      case 'targetUsingPerson':
        this.setState({ targetUsingPersonName: record.name });
        break;
      case 'targetOwningPerson':
        this.setState({ targetOwningPersonName: record.name });
        break;
      case 'targetLocation':
        this.setState({ targetLocationName: record.locationName });
        break;
      default:
    }
  }

  /**
   * 根据属性行内容动态渲染属性折叠部分表单内容
   * @param {Array} [attributeInfo=[]]
   */
  @Bind()
  getAttributeInfo(attributeInfo = [], dataSource = {}) {
    const {
      isNew,
      editControl,
      tenantId,
      dynamicFieldsData,
      valuesList,
      form: { getFieldDecorator, registerField, setFieldsValue },
    } = this.props;
    const dynamicFieldsValue = dataSource.orderDynamicColumnList || dynamicFieldsData;
    const renderTemplates = [];
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    attributeInfo.forEach(item => {
      // 获取组件类型，若存在Lov则获取其Code
      const field = {
        lovCode: item.lovName,
        componentType: item.lovType === 'BOOLEAN' ? 'Switch' : item.lovType,
        fieldCode: 'fieldColumn',
      };
      const componentType = getComponentType(field);
      const componentProps = getComponentProps({ field, componentType: field.componentType });
      const currentProps = {
        disabled: true,
      };
      const targetProps = {
        disabled:
          dataSource.processStatus !== 'NEW' ||
          item.fieldType === 'READ_ONLY' ||
          item.fieldType === 'CLEAN',
      };
      const datePickerProps =
        item.lovType === 'DatePicker'
          ? {
              format: getDateFormat(),
            }
          : {};
      let selectList = [];
      valuesList.forEach(i => {
        if (i.tag === item.fieldColumn) {
          selectList = i.lovList;
        }
      });
      // 动态字段赋值
      let initValueCurrent = '';
      let currentLovDisplay = '';
      let initValueTarget = '';
      let targetLovDisplay = '';
      // 获取已经保存的动态字段值
      dynamicFieldsValue.forEach(i => {
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
      // 如果没有已经保存的值，则赋初始值
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
      // 绘制动态字段
      let template = '';
      if (!isNew || editControl) {
        template =
          item.fieldType === 'READ_ONLY' ? (
            <Form.Item label={`${item.fieldColumnMeaning}`} {...formLayout}>
              {getFieldDecorator(`current#${item.fieldId}`, {
                initialValue: initValueCurrent,
              })(
                item.lovType === 'Lov' ? (
                  <Lov disabled textValue={currentLovDisplay} />
                ) : (
                  React.createElement(
                    componentType,
                    Object.assign({}, { ...componentProps, ...currentProps, ...datePickerProps })
                  )
                )
              )}
              {item.lovType === 'Lov'
                ? getFieldDecorator(`currentName#${item.fieldId}`, {
                    initialValue: currentLovDisplay,
                  })
                : null}
            </Form.Item>
          ) : (
            <React.Fragment>
              <Form.Item label={`当前${item.fieldColumnMeaning}`} {...formLayout}>
                {getFieldDecorator(`current#${item.fieldId}`, {
                  initialValue: initValueCurrent,
                })(
                  item.lovType === 'ValueList' ? (
                    <Select disabled>
                      {selectList.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  ) : item.lovType === 'Lov' ? (
                    <Lov disabled textValue={currentLovDisplay} />
                  ) : (
                    React.createElement(
                      componentType,
                      Object.assign({}, { ...componentProps, ...currentProps, ...datePickerProps })
                    )
                  )
                )}
                {item.lovType === 'Lov'
                  ? getFieldDecorator(`currentName#${item.fieldId}`, {
                      initialValue: currentLovDisplay,
                    })
                  : null}
              </Form.Item>
              <Form.Item label={`目标${item.fieldColumnMeaning}`} {...formLayout}>
                {getFieldDecorator(`target#${item.fieldId}`, {
                  initialValue: initValueTarget,
                  rules:
                    item.fieldType === 'MUST_MODIFY'
                      ? [
                          {
                            required: true,
                            message: intl.get('hzero.common.validation.notNull', {
                              name: intl
                                .get(
                                  `aatn.assetStatusChange.model.assetStatusChange.target#${
                                    item.fieldId
                                  }`
                                )
                                .d(`目标${item.fieldColumnMeaning}`),
                            }),
                          },
                        ]
                      : [],
                })(
                  item.lovType === 'ValueList' ? (
                    <Select {...targetProps}>
                      {selectList.map(i => (
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
                          [`targetName#${item.fieldId}`]: record[item.displayField],
                        });
                      }}
                      textValue={targetLovDisplay}
                      queryParams={{ tenantId }}
                    />
                  ) : (
                    React.createElement(
                      componentType,
                      Object.assign(
                        {},
                        {
                          ...componentProps,
                          ...targetProps,
                          ...datePickerProps,
                        }
                      )
                    )
                  )
                )}
                {item.lovType === 'Lov'
                  ? getFieldDecorator(`targetName#${item.fieldId}`, {
                      initialValue: targetLovDisplay,
                    })
                  : null}
              </Form.Item>
            </React.Fragment>
          );
      } else {
        template =
          item.fieldType === 'READ_ONLY' ? (
            <React.Fragment>
              <Form.Item label={item.fieldColumnMeaning} {...formLayout}>
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
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Form.Item label={`当前${item.fieldColumnMeaning}`} {...formLayout}>
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
            </React.Fragment>
          );
      }

      renderTemplates.push(template);
    });
    return renderTemplates;
  }
  /**
   * 下划线转驼峰
   */
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
    const commonPromptCode = 'aatn.assetStatusChange.model.assetStatusChange';
    const {
      isNew,
      anchor,
      editControl,
      drawerVisible,
      title,
      form,
      loading,
      dataSource,
      tenantId,
      statusScope,
      dynamicFields,
      processStatusLineMap,
      onCancel,
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
        footer={
          <div>
            {dataSource.processStatus === 'NEW' ? ( // 新建状态
              <Button type="primary" onClick={this.saveBtn}>
                {intl.get('hzero.common.button.sure').d('确认')}
              </Button>
            ) : dataSource.processStatus === 'UNPROCESSED' ? ( // 未处理状态
              <Button loading={loading} type="primary" onClick={this.executeChange}>
                {intl.get('aatn.assetStatusChange.button.handover').d('执行处理')}
              </Button>
            ) : (
              <Button type="primary" onClick={onCancel}>
                {intl.get('hzero.common.button.close').d('关闭')}
              </Button>
            )}
            <Button onClick={onCancel}>{intl.get('hzero.common.button.cancel').d('取消')}</Button>
          </div>
        }
      >
        <Form>
          <div className="drawer-row">
            <Row>
              <Col>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.name`).d('设备/资产')}
                  {...formLayout}
                >
                  {!isNew || editControl ? (
                    getFieldDecorator('name', {
                      initialValue: dataSource.name,
                    })(<Input disabled />)
                  ) : (
                    <span>{dataSource.name}</span>
                  )}
                </Form.Item>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.assetDesc`).d('资产名称')}
                  {...formLayout}
                >
                  {!isNew || editControl ? (
                    getFieldDecorator('assetDesc', {
                      initialValue: dataSource.assetDesc,
                    })(<Input disabled />)
                  ) : (
                    <span>{dataSource.assetDesc}</span>
                  )}
                </Form.Item>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.processStatus`).d('处理状态')}
                  {...formLayout}
                >
                  {!isNew || editControl ? (
                    getFieldDecorator('processStatus', {
                      initialValue: dataSource.processStatus,
                    })(
                      <Select disabled>
                        {processStatusLineMap.map(i => (
                          <Select.Option key={i.value}>{i.meaning}</Select.Option>
                        ))}
                      </Select>
                    )
                  ) : (
                    <span>{dataSource.processStatusMeaning}</span>
                  )}
                </Form.Item>
                {this.getAttributeInfo(dynamicFields, dataSource)}
                <Form.Item
                  label={intl.get(`${commonPromptCode}.currentAssetStatusId`).d('当前资产状态')}
                  {...formLayout}
                >
                  {!isNew || editControl ? (
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
                <Form.Item
                  label={intl.get(`${commonPromptCode}.targetAssetStatus`).d('目标资产状态')}
                  {...formLayout}
                >
                  {!isNew || editControl ? (
                    getFieldDecorator('targetAssetStatusId', {
                      initialValue: dataSource.targetAssetStatusId,
                    })(
                      <Lov
                        disabled
                        code="AAFM.ASSET_STATUS"
                        queryParams={{ tenantId, statusScope: JSON.stringify(statusScope) }}
                        textValue={dataSource.targetAssetStatusName}
                      />
                    )
                  ) : (
                    <span>{dataSource.targetAssetStatusName}</span>
                  )}
                </Form.Item>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.currentLocation`).d('当前位置')}
                  {...formLayout}
                >
                  {!isNew || editControl ? (
                    getFieldDecorator('currentLocationId', {
                      initialValue: dataSource.currentLocationId,
                    })(
                      <Lov
                        disabled
                        code="AMDM.LOCATIONS"
                        queryParams={{ tenantId }}
                        textValue={dataSource.currentLocationName}
                      />
                    )
                  ) : (
                    <span>{dataSource.currentLocationName}</span>
                  )}
                </Form.Item>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.targetLocation`).d('目标位置')}
                  {...formLayout}
                >
                  {!isNew || editControl ? (
                    getFieldDecorator('targetLocationId', {
                      initialValue: dataSource.targetLocationId || dataSource.currentLocationId,
                    })(
                      <Lov
                        code="AMDM.LOCATIONS"
                        queryParams={{ tenantId }}
                        disabled={dataSource.processStatus !== 'NEW'}
                        onChange={(_, record) => this.handleSetName(_, record, 'targetLocation')}
                        textValue={dataSource.targetLocationName || dataSource.currentLocationName}
                      />
                    )
                  ) : (
                    <span>{dataSource.targetLocationName || dataSource.currentLocationName}</span>
                  )}
                </Form.Item>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.currentOwningPerson`).d('当前所属人')}
                  {...formLayout}
                >
                  {!isNew || editControl ? (
                    getFieldDecorator('currentOwningPersonId', {
                      initialValue: dataSource.currentOwningPersonId,
                    })(
                      <Lov
                        disabled
                        code="HALM.EMPLOYEE"
                        queryParams={{ tenantId }}
                        textValue={dataSource.currentOwningPersonName}
                      />
                    )
                  ) : (
                    <span>{dataSource.currentOwningPersonName}</span>
                  )}
                </Form.Item>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.targetOwningPerson`).d('目标所属人')}
                  {...formLayout}
                >
                  {!isNew || editControl ? (
                    getFieldDecorator('targetOwningPersonId', {
                      initialValue:
                        dataSource.targetOwningPersonId || dataSource.currentOwningPersonId,
                    })(
                      <Lov
                        code="HALM.EMPLOYEE"
                        queryParams={{ tenantId }}
                        disabled={dataSource.processStatus !== 'NEW'}
                        onChange={(_, record) =>
                          this.handleSetName(_, record, 'targetOwningPerson')
                        }
                        textValue={
                          dataSource.targetOwningPersonName || dataSource.currentOwningPersonName
                        }
                      />
                    )
                  ) : (
                    <span>
                      {dataSource.targetOwningPersonName || dataSource.currentOwningPersonName}
                    </span>
                  )}
                </Form.Item>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.currentUsingPerson`).d('当前使用人')}
                  {...formLayout}
                >
                  {!isNew || editControl ? (
                    getFieldDecorator('currentUsingPersonId', {
                      initialValue: dataSource.currentUsingPersonId,
                    })(
                      <Lov
                        disabled
                        code="HALM.EMPLOYEE"
                        queryParams={{ tenantId }}
                        textValue={dataSource.currentUsingPersonName}
                      />
                    )
                  ) : (
                    <span>{dataSource.currentUsingPersonName}</span>
                  )}
                </Form.Item>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.targetUsingPerson`).d('目标使用人')}
                  {...formLayout}
                >
                  {!isNew || editControl ? (
                    getFieldDecorator('targetUsingPersonId', {
                      initialValue:
                        dataSource.targetUsingPersonId || dataSource.currentUsingPersonId,
                    })(
                      <Lov
                        code="HALM.EMPLOYEE"
                        queryParams={{ tenantId }}
                        disabled={dataSource.processStatus !== 'NEW'}
                        onChange={(_, record) => this.handleSetName(_, record, 'targetUsingPerson')}
                        textValue={
                          dataSource.targetUsingPersonName || dataSource.currentUsingPersonName
                        }
                      />
                    )
                  ) : (
                    <span>
                      {dataSource.targetUsingPersonName || dataSource.currentUsingPersonName}
                    </span>
                  )}
                </Form.Item>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.description`).d('备注')}
                  {...formLayout}
                >
                  {!isNew || editControl ? (
                    getFieldDecorator('description', {
                      initialValue: dataSource.description,
                    })(<Input.TextArea rows={3} disabled={dataSource.processStatus !== 'NEW'} />)
                  ) : (
                    <span>{dataSource.description}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal>
    );
  }
}
export default TransactionDrawer;
