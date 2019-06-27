import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Row, Button } from 'hzero-ui';
import moment from 'moment';
import { dateRender, yesOrNoRender } from 'utils/renderer';
import { getDateFormat } from 'utils/utils';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { isUndefined } from 'util';
import { isEmpty } from 'rxjs/operators';

/**
 * 调拨单 入口&&处理 - 查看行滑窗(抽屉)
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {string} anchor - 抽屉滑动位置
 * @reactProps {string} title - 抽屉标题
 * @reactProps {boolean} visible - 抽屉是否可见
 * @reactProps {Function} onOk - 抽屉确定操作
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
class Drawer extends PureComponent {
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
    const { form, onOk, targetItem } = this.props;
    if (onOk) {
      form.validateFields((err, values) => {
        if (!err) {
          // 校验通过，进行保存操作
          onOk({ ...targetItem, ...values });
        }
      });
    }
  }
  /**
   * 根据属性行内容动态渲染属性折叠部分表单内容
   * @param {Array} [attributeInfo=[]]
   */
  @Bind()
  getAttributeInfo(attributeInfo = [], dataSource) {
    const { dynamicColumn = [] } = this.props;
    const renderTemplates = [];
    attributeInfo.forEach(item => {
      let initValueCurrent = '';
      let initValueTarget = '';
      const { currentColumnDesc, currentColumnValue, targetColumnValue, targetColumnDesc } =
        dynamicColumn.filter(element => element.currentColumnName === item.fieldColumn)[0] || {};
      if (item.fieldType === 'READ_ONLY') {
        // 从资产中取出对应值赋给initValueCurrent
        if (item.lovType === 'Lov' || item.lovType === 'ValueList') {
          initValueCurrent = dataSource[this.toCamelCaseVar(item.descCode)];
        } else if (item.lovType === 'DatePicker') {
          initValueCurrent =
            dateRender(
              moment(dataSource[this.toCamelCaseVar(item.fieldColumn)], getDateFormat())
            ) || '';
        } else if (item.lovType === 'BOOLEAN') {
          initValueCurrent = yesOrNoRender(this.toCamelCaseVar(item.fieldColumn));
        } else {
          initValueCurrent = this.toCamelCaseVar(item.fieldColumn);
        }
      } else {
        // 从动态字段表中取出对应值赋给initValueCurrent和initValueTarget
        if (item.lovType === 'Lov' || item.lovType === 'ValueList') {
          initValueCurrent = currentColumnDesc;
        } else if (item.lovType === 'DatePicker') {
          initValueCurrent =
            isUndefined(currentColumnValue) || isEmpty(currentColumnValue)
              ? ''
              : dateRender(moment(currentColumnValue, getDateFormat()));
        } else if (item.lovType === 'BOOLEAN') {
          initValueCurrent = yesOrNoRender(currentColumnValue);
        } else {
          initValueCurrent = currentColumnValue;
        }

        if (item.lovType === 'Lov' || item.lovType === 'ValueList') {
          initValueTarget = targetColumnDesc;
        } else if (item.lovType === 'DatePicker') {
          initValueTarget =
            isUndefined(targetColumnValue) || isEmpty(targetColumnValue)
              ? ''
              : dateRender(moment(targetColumnValue, getDateFormat()));
        } else if (item.lovType === 'BOOLEAN') {
          initValueTarget = yesOrNoRender(targetColumnValue);
        } else {
          initValueTarget = targetColumnValue;
        }
      }
      const formLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 },
      };
      const readOnlyTemplate =
        item.fieldType === 'READ_ONLY' ? (
          <Form.Item label={item.fieldColumnMeaning} {...formLayout}>
            <span>{initValueCurrent || ''}</span>
          </Form.Item>
        ) : (
          ''
        );
      const currentTemplate =
        item.fieldType === 'READ_ONLY' ? (
          ''
        ) : (
          <Form.Item label={`当前${item.fieldColumnMeaning}`} {...formLayout}>
            <span>{initValueCurrent || ''}</span>
          </Form.Item>
        );
      const targetTemplate =
        item.fieldType === 'READ_ONLY' ? (
          ''
        ) : (
          <Form.Item label={`目标${item.fieldColumnMeaning}`} {...formLayout}>
            <span>{initValueTarget || ''}</span>
          </Form.Item>
        );
      renderTemplates.push(readOnlyTemplate);
      renderTemplates.push(currentTemplate);
      renderTemplates.push(targetTemplate);
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
    const commonPromptCode = 'aatn.transferOrder.model.transferOrder';
    const {
      anchor,
      lineDetail,
      drawerVisible,
      title,
      transferTypeList,
      onCancel,
      onChangeLineStatus,
    } = this.props;
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
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
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
        footer={
          <div>
            {lineDetail.clickFlag === 'view' ? (
              <Button type="primary" onClick={onCancel}>
                {intl.get('hzero.common.button.close').d('关闭')}
              </Button>
            ) : lineDetail.clickFlag === 'callOut' ? (
              <Button type="primary" onClick={() => onChangeLineStatus(lineDetail)}>
                {intl.get('aatn.transferOrder.button.callOutSure').d('调出确认')}
              </Button>
            ) : lineDetail.clickFlag === 'callIn' ? (
              <Button type="primary" onClick={() => onChangeLineStatus(lineDetail)}>
                {intl.get('aatn.transferOrder.button.callInSure').d('调入确认')}
              </Button>
            ) : (
              <Button type="primary" onClick={this.saveBtn}>
                {intl.get('hzero.common.button.sure').d('确认')}
              </Button>
            )}
            <Button onClick={onCancel}>{intl.get('hzero.common.button.cancel').d('取消')}</Button>
          </div>
        }
      >
        <Form>
          <Row>
            <Form.Item label={intl.get(`${commonPromptCode}.name`).d('设备/资产')} {...formLayout}>
              <span>{lineDetail.name}</span>
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              label={intl.get(`${commonPromptCode}.assetDesc`).d('资产名称')}
              {...formLayout}
            >
              <span>{lineDetail.assetDesc}</span>
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              label={intl.get(`${commonPromptCode}.processStatus`).d('处理状态')}
              {...formLayout}
            >
              <span>{lineDetail.processStatusMeaning}</span>
            </Form.Item>
          </Row>
          <Row>{this.getAttributeInfo(transferTypeList, lineDetail)}</Row>
          <Row>
            <Form.Item
              label={intl.get(`${commonPromptCode}.currentAssetStatus`).d('当前资产状态')}
              {...formLayout}
            >
              <span>{lineDetail.sysStatusName}</span>
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              label={intl.get(`${commonPromptCode}.targetAssetStatus`).d('目标资产状态')}
              {...formLayout}
            >
              <span>{lineDetail.targetAssetStatusName}</span>
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              label={intl.get(`${commonPromptCode}.currentOwningOrg`).d('当前所属组织')}
              {...formLayout}
            >
              <span>{lineDetail.owningOrgName}</span>
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              label={intl.get(`${commonPromptCode}.targetOwningOrg`).d('目标所属组织')}
              {...formLayout}
            >
              <span>{lineDetail.targetOwningOrgName}</span>
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              label={intl.get(`${commonPromptCode}.currentCostCenter`).d('当前成本中心')}
              {...formLayout}
            >
              <span>{lineDetail.currentCostCenter}</span>
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              label={intl.get(`${commonPromptCode}.targetCostCenter`).d('目标成本中心')}
              {...formLayout}
            >
              <span>{lineDetail.targetCostCenter}</span>
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              label={intl.get(`${commonPromptCode}.description`).d('备注')}
              {...formLayout}
            >
              <span>{lineDetail.description}</span>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    );
  }
}
export default Drawer;
