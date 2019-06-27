import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Row, Col, Button, Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { getDateFormat } from 'utils/utils';
import { isUndefined, isEmpty } from 'lodash';
import { dateRender, yesOrNoRender } from 'utils/renderer';
import moment from 'moment';

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
            targetOwningPersonName,
            targetUsingPersonName,
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
    const message = intl.get('aatn.executeAssetHandover.view.message')
      .d(`资产状态由${currentAssetStatusName}变为${targetAssetStatusName},所属人由
        ${currentOwningPersonName}变为${targetOwningPersonName},使用人由
        ${currentUsingPersonName}变为${targetUsingPersonName},${lineDescription}`);
    return message;
  }

  /**
   * 判断detailList行明细列表是否为两条数据
   * @param {object} list- 数据源
   */
  @Bind
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
  handleSetName(_, record, flag) {
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

  /**
   * 根据属性行内容动态渲染属性折叠部分表单内容
   * @param {Array} [attributeInfo=[]]
   */
  @Bind()
  getAttributeInfo(attributeInfo = [], dataSource = {}) {
    const dynamicFieldsValue = dataSource.dynamicColumnList || [];
    const renderTemplates = [];
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    attributeInfo.forEach(item => {
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
      const template =
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
    const commonPromptCode = 'aatn.executeAssetHandover.model.executeAssetHandover';
    const {
      anchor,
      drawerVisible,
      title,
      dynamicFields,
      loading,
      lineLoading,
      lineDetail,
      returnFlag,
      onExecute,
      onHandoverReturn,
      onCancel,
    } = this.props;
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
                {intl.get('aatn.executeAssetHandover.button.handover').d('移交确认')}
              </Button>
            ) : dataSource.processStatus === 'HANDED_NO_RETURN' ? ( // 移交未归还状态
              returnFlag ? (
                <Button loading={loading} type="primary" onClick={() => onExecute(dataSource)}>
                  {intl.get('aatn.executeAssetHandover.button.sureReturn').d('确认归还')}
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={() => onHandoverReturn(dataSource.dynamicColumnList)}
                >
                  {intl.get('aatn.executeAssetHandover.button.return').d('移交归还')}
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
        <Spin spinning={lineLoading}>
          <Form>
            <div className="drawer-row">
              <Row>
                <Col span={this.isDouble(lineDetail) ? 11 : 24}>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.name`).d('设备/资产')}
                    {...formLayout}
                  >
                    <span>{dataSource.name}</span>
                  </Form.Item>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.assetDesc`).d('资产名称')}
                    {...formLayout}
                  >
                    <span>{dataSource.assetDesc}</span>
                  </Form.Item>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.processStatus`).d('处理状态')}
                    {...formLayout}
                  >
                    <span>{dataSource.processStatusMeaning}</span>
                  </Form.Item>
                  {this.getAttributeInfo(dynamicFields, dataSource)}
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.currentAssetStatus`).d('当前资产状态')}
                    {...formLayout}
                  >
                    <span>{dataSource.currentAssetStatusName}</span>
                  </Form.Item>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.targetAssetStatus`).d('目标资产状态')}
                    {...formLayout}
                  >
                    <span>{dataSource.targetAssetStatusName}</span>
                  </Form.Item>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.currentOwningPerson`).d('当前所属人')}
                    {...formLayout}
                  >
                    <span>{dataSource.currentOwningPersonName}</span>
                  </Form.Item>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.targetOwningPerson`).d('目标所属人')}
                    {...formLayout}
                  >
                    <span>{dataSource.targetOwningPersonName}</span>
                  </Form.Item>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.currentUsingPerson`).d('当前使用人')}
                    {...formLayout}
                  >
                    <span>{dataSource.currentUsingPersonName}</span>
                  </Form.Item>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.targetUsingPerson`).d('目标使用人')}
                    {...formLayout}
                  >
                    <span>{dataSource.targetUsingPersonName}</span>
                  </Form.Item>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.description`).d('备注')}
                    {...formLayout}
                  >
                    <span>{dataSource.description}</span>
                  </Form.Item>
                </Col>
                {this.isDouble(lineDetail) ? (
                  <Col span={11} offset={1}>
                    <Form.Item
                      label={intl.get(`${commonPromptCode}.name`).d('设备/资产')}
                      {...formLayout}
                    >
                      <span>{tempDataSource.name}</span>
                    </Form.Item>
                    <Form.Item
                      label={intl.get(`${commonPromptCode}.assetDesc`).d('资产名称')}
                      {...formLayout}
                    >
                      <span>{tempDataSource.assetDesc}</span>
                    </Form.Item>
                    <Form.Item
                      label={intl.get(`${commonPromptCode}.processStatus`).d('处理状态')}
                      {...formLayout}
                    >
                      <span>{tempDataSource.processStatusMeaning}</span>
                    </Form.Item>
                    {this.getAttributeInfo(dynamicFields, tempDataSource)}
                    <Form.Item
                      label={intl.get(`${commonPromptCode}.currentAssetStatus`).d('当前资产状态')}
                      {...formLayout}
                    >
                      <span>{dataSource.currentAssetStatusName}</span>
                    </Form.Item>
                    <Form.Item
                      label={intl.get(`${commonPromptCode}.targetAssetStatus`).d('目标资产状态')}
                      {...formLayout}
                    >
                      <span>{dataSource.targetAssetStatusName}</span>
                    </Form.Item>
                    <Form.Item
                      label={intl.get(`${commonPromptCode}.currentOwningPerson`).d('当前所属人')}
                      {...formLayout}
                    >
                      <span>{tempDataSource.currentOwningPersonName}</span>
                    </Form.Item>
                    <Form.Item
                      label={intl.get(`${commonPromptCode}.targetOwningPerson`).d('目标所属人')}
                      {...formLayout}
                    >
                      <span>{tempDataSource.targetOwningPersonName}</span>
                    </Form.Item>
                    <Form.Item
                      label={intl.get(`${commonPromptCode}.currentUsingPerson`).d('当前使用人')}
                      {...formLayout}
                    >
                      <span>{tempDataSource.currentUsingPersonName}</span>
                    </Form.Item>
                    <Form.Item
                      label={intl.get(`${commonPromptCode}.targetUsingPerson`).d('目标使用人')}
                      {...formLayout}
                    >
                      <span>{tempDataSource.targetUsingPersonName}</span>
                    </Form.Item>
                    <Form.Item
                      label={intl.get(`${commonPromptCode}.description`).d('备注')}
                      {...formLayout}
                    >
                      <span>{tempDataSource.description}</span>
                    </Form.Item>
                  </Col>
                ) : (
                  ''
                )}
              </Row>
            </div>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
export default TransactionDrawer;
