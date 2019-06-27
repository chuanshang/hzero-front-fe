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
      targetOwningPersonName: '', // 目标所属人
      targetUsingPersonName: '', // 目标使用人
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
    const { form, onOk, lineDetail } = this.props;
    if (onOk) {
      form.validateFields((err, values) => {
        if (!err) {
          const { targetOwningPersonName, targetUsingPersonName } = this.state;
          // 校验通过，进行保存操作
          onOk({
            ...lineDetail[0],
            ...values,
            targetOwningPersonName: targetOwningPersonName || lineDetail[0].targetOwningPersonName,
            targetUsingPersonName: targetUsingPersonName || lineDetail[0].targetUsingPersonName,
            description: this.handleMakeDescription(),
          });
        }
      });
    }
  }

  /**
   * 拼接描述字段
   */
  @Bind()
  handleMakeDescription() {
    const {
      lineDetail,
      form: { getFieldsValue },
    } = this.props;
    const { targetOwningPersonName, targetUsingPersonName } = this.state;
    const {
      currentAssetStatusName = '',
      currentOwningPersonName = '',
      currentUsingPersonName = '',
      targetAssetStatusName = '',
    } = lineDetail[0];
    const { lineDescription = '' } = getFieldsValue();
    const message = intl.get('aatn.assetHandover.view.message')
      .d(`资产状态由${currentAssetStatusName}变为${targetAssetStatusName},所属人由
        ${currentOwningPersonName}变为${targetOwningPersonName},使用人由
        ${currentUsingPersonName}变为${targetUsingPersonName},${lineDescription}`);
    return message;
  }

  /**
   * 判断detailList行明细列表是否为两条数据
   * @param {object} list- 数据源
   */
  @Bind()
  isDouble(list = []) {
    if (list.length === 2) {
      return true;
    }
    return false;
  }

  /**
   * 设置名称
   */
  @Bind()
  handleSetName(val, record, flag) {
    if (val) {
      switch (flag) {
        case 'targetUsingPerson':
          this.setState({ targetUsingPersonName: record.name });
          break;
        case 'targetOwningPerson':
          this.setState({ targetOwningPersonName: record.name });
          break;
        default:
      }
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
    const dynamicFieldsValue = dataSource.dynamicColumnList || dynamicFieldsData;
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
                                  `aatn.assetHandover.model.assetHandover.target#${item.fieldId}`
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
    const commonPromptCode = 'aatn.assetHandover.model.assetHandover';
    const {
      isNew,
      editControl,
      anchor,
      drawerVisible,
      title,
      form,
      dynamicFields,
      loading,
      lineDetail,
      tenantId,
      processStatusLineMap,
      returnFlag,
      onExecute,
      onHandoverReturn,
      onCancel,
    } = this.props;
    const { getFieldDecorator } = form;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    let dataSource = {};
    let tempDataSource = {};
    if (this.isDouble(lineDetail)) {
      tempDataSource = { ...lineDetail[1] };
      dataSource = { ...lineDetail[0] };
    } else {
      dataSource = { ...lineDetail[0] };
    }
    return (
      <Modal
        destroyOnClose
        title={title}
        width={this.isDouble(lineDetail) ? 900 : 450}
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
            ) : dataSource.processStatus === 'NO_HANDED_OVER' ? ( // 未提交状态
              <Button loading={loading} type="primary" onClick={() => onExecute(dataSource)}>
                {intl.get('aatn.assetHandover.button.handover').d('移交确认')}
              </Button>
            ) : dataSource.processStatus === 'HANDED_NO_RETURN' ? ( // 移交未归还状态
              returnFlag ? (
                <Button loading={loading} type="primary" onClick={() => onExecute(dataSource)}>
                  {intl.get('aatn.assetHandover.button.sureReturn').d('确认归还')}
                </Button>
              ) : (
                <Button type="primary" onClick={() => onHandoverReturn()}>
                  {intl.get('aatn.assetHandover.button.return').d('移交归还')}
                </Button>
              )
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
              <Col span={this.isDouble(lineDetail) ? 11 : 24}>
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
                  label={intl.get(`${commonPromptCode}.currentAssetStatus`).d('当前资产状态')}
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
                        code="AAFM.ASSET_STATUS"
                        queryParams={{ tenantId }}
                        textValue={dataSource.targetAssetStatusName}
                      />
                    )
                  ) : (
                    <span>{dataSource.targetAssetStatusName}</span>
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
                      initialValue: dataSource.targetOwningPersonId,
                      rules: [
                        {
                          required: false,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: intl
                              .get(`${commonPromptCode}.targetOwningPerson`)
                              .d('目标所属人'),
                          }),
                        },
                      ],
                    })(
                      <Lov
                        code="HALM.EMPLOYEE"
                        queryParams={{ tenantId }}
                        onChange={(val, record) =>
                          this.handleSetName(val, record, 'targetOwningPerson')
                        }
                        textValue={dataSource.targetOwningPersonName}
                      />
                    )
                  ) : (
                    <span>{dataSource.targetOwningPersonName}</span>
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
                      initialValue: dataSource.targetUsingPersonId,
                      rules: [
                        {
                          required: false,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: intl.get(`${commonPromptCode}.targetUsingPerson`).d('目标使用人'),
                          }),
                        },
                      ],
                    })(
                      <Lov
                        code="HALM.EMPLOYEE"
                        queryParams={{ tenantId }}
                        onChange={(val, record) =>
                          this.handleSetName(val, record, 'targetUsingPerson')
                        }
                        textValue={dataSource.targetUsingPersonName}
                      />
                    )
                  ) : (
                    <span>{dataSource.targetUsingPersonName}</span>
                  )}
                </Form.Item>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.description`).d('备注')}
                  {...formLayout}
                >
                  {!isNew || editControl ? (
                    getFieldDecorator('lineDescription', {
                      initialValue: dataSource.description,
                    })(<Input.TextArea rows={3} />)
                  ) : (
                    <span>{dataSource.description}</span>
                  )}
                </Form.Item>
              </Col>
              {this.isDouble(lineDetail) ? (
                <Col span={11} offset={1}>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.name`).d('设备/资产')}
                    {...formLayout}
                  >
                    {!isNew || editControl ? (
                      getFieldDecorator('name', {
                        initialValue: tempDataSource.name,
                      })(<Input disabled />)
                    ) : (
                      <span>{tempDataSource.name}</span>
                    )}
                  </Form.Item>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.assetDesc`).d('资产名称')}
                    {...formLayout}
                  >
                    {!isNew || editControl ? (
                      getFieldDecorator('assetDesc', {
                        initialValue: tempDataSource.assetDesc,
                      })(<Input disabled />)
                    ) : (
                      <span>{tempDataSource.assetDesc}</span>
                    )}
                  </Form.Item>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.processStatus`).d('处理状态')}
                    {...formLayout}
                  >
                    {!isNew || editControl ? (
                      getFieldDecorator('processStatus', {
                        initialValue: tempDataSource.processStatus,
                      })(
                        <Select disabled>
                          {processStatusLineMap.map(i => (
                            <Select.Option key={i.value}>{i.meaning}</Select.Option>
                          ))}
                        </Select>
                      )
                    ) : (
                      <span>{tempDataSource.processStatusMeaning}</span>
                    )}
                  </Form.Item>
                  {this.getAttributeInfo(dynamicFields, tempDataSource)}
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.currentAssetStatus`).d('当前资产状态')}
                    {...formLayout}
                  >
                    {!isNew || editControl ? (
                      getFieldDecorator('currentAssetStatus', {
                        initialValue: tempDataSource.currentAssetStatusId,
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
                        initialValue: tempDataSource.targetAssetStatusId,
                      })(
                        <Lov
                          code="AAFM.ASSET_STATUS"
                          queryParams={{ tenantId }}
                          textValue={dataSource.targetAssetStatusName}
                        />
                      )
                    ) : (
                      <span>{dataSource.targetAssetStatusName}</span>
                    )}
                  </Form.Item>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.currentOwningPerson`).d('当前所属人')}
                    {...formLayout}
                  >
                    {!isNew || editControl ? (
                      getFieldDecorator('currentOwningPersonId', {
                        initialValue: tempDataSource.currentOwningPersonId,
                      })(
                        <Lov
                          disabled
                          code="HALM.EMPLOYEE"
                          queryParams={{ tenantId }}
                          textValue={tempDataSource.currentOwningPersonName}
                        />
                      )
                    ) : (
                      <span>{tempDataSource.currentOwningPersonName}</span>
                    )}
                  </Form.Item>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.targetOwningPerson`).d('目标所属人')}
                    {...formLayout}
                  >
                    {!isNew || editControl ? (
                      getFieldDecorator('targetOwningPersonId', {
                        initialValue: tempDataSource.targetOwningPersonId,
                      })(
                        <Lov
                          code="HALM.EMPLOYEE"
                          queryParams={{ tenantId }}
                          textValue={tempDataSource.targetOwningPersonName}
                        />
                      )
                    ) : (
                      <span>{tempDataSource.targetOwningPersonName}</span>
                    )}
                  </Form.Item>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.currentUsingPerson`).d('当前使用人')}
                    {...formLayout}
                  >
                    {!isNew || editControl ? (
                      getFieldDecorator('currentUsingPersonId', {
                        initialValue: tempDataSource.currentUsingPersonId,
                      })(
                        <Lov
                          disabled
                          code="HALM.EMPLOYEE"
                          queryParams={{ tenantId }}
                          textValue={tempDataSource.currentUsingPersonName}
                        />
                      )
                    ) : (
                      <span>{tempDataSource.currentUsingPersonName}</span>
                    )}
                  </Form.Item>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.targetUsingPerson`).d('目标使用人')}
                    {...formLayout}
                  >
                    {!isNew || editControl ? (
                      getFieldDecorator('targetUsingPersonId', {
                        initialValue: tempDataSource.targetUsingPersonId,
                      })(
                        <Lov
                          code="HALM.EMPLOYEE"
                          queryParams={{ tenantId }}
                          textValue={tempDataSource.targetUsingPersonName}
                        />
                      )
                    ) : (
                      <span>{tempDataSource.targetUsingPersonName}</span>
                    )}
                  </Form.Item>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.description`).d('备注')}
                    {...formLayout}
                  >
                    {!isNew || editControl ? (
                      getFieldDecorator('lineDescription', {
                        initialValue: tempDataSource.description,
                      })(<Input.TextArea rows={3} />)
                    ) : (
                      <span>{tempDataSource.description}</span>
                    )}
                  </Form.Item>
                </Col>
              ) : (
                ''
              )}
            </Row>
          </div>
        </Form>
      </Modal>
    );
  }
}
export default TransactionDrawer;
