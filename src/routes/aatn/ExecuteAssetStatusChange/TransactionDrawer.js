import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Spin, Row, Col, Button } from 'hzero-ui';
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
      targetOwningPersonName: '',
      targetUsingPersonName: '',
      targetLocationName: '',
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
   * 执行处理操作
   */
  @Bind()
  executeChange() {
    const { onExecute, dataSource } = this.props;
    if (onExecute) {
      onExecute(dataSource);
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
    const commonPromptCode = 'aatn.executeAssetStatusChange.model.executeAssetStatusChange';
    const {
      anchor,
      drawerVisible,
      title,
      loading,
      detailLoading,
      dataSource,
      dynamicFields,
      onCancel,
    } = this.props;
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
            <Button loading={loading} type="primary" onClick={this.executeChange}>
              {intl.get('aatn.assetStatusChange.button.handover').d('执行处理')}
            </Button>
            <Button onClick={onCancel}>{intl.get('hzero.common.button.cancel').d('取消')}</Button>
          </div>
        }
      >
        <Spin spinning={detailLoading}>
          <Form>
            <div className="drawer-row">
              <Row>
                <Col>
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
                    label={intl.get(`${commonPromptCode}.currentAssetStatusId`).d('当前资产状态')}
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
                    label={intl.get(`${commonPromptCode}.currentLocation`).d('当前位置')}
                    {...formLayout}
                  >
                    <span>{dataSource.currentLocationName}</span>
                  </Form.Item>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.targetLocation`).d('目标位置')}
                    {...formLayout}
                  >
                    <span>{dataSource.targetLocationName || dataSource.currentLocationName}</span>
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
                    <span>
                      {dataSource.targetOwningPersonName || dataSource.currentOwningPersonName}
                    </span>
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
                    <span>
                      {dataSource.targetUsingPersonName || dataSource.currentUsingPersonName}
                    </span>
                  </Form.Item>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.description`).d('备注')}
                    {...formLayout}
                  >
                    <span>{dataSource.description}</span>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
export default TransactionDrawer;
