import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, InputNumber, Row, Button } from 'hzero-ui';
import Lov from 'components/Lov';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';

/**
 * 资产处置单 入口&&处理 - 查看行滑窗(抽屉)
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
   * render
   * @returns React.element
   */
  render() {
    const commonPromptCode = 'aatn.disposeOrder.model.disposeOrder';
    const {
      form,
      title,
      anchor,
      lineDetail,
      tenantId,
      drawerVisible,
      confirmLoading,
      defaultTargetAssetStatus,
      onCancel,
      onChangeLineStatus,
    } = this.props;
    const { getFieldDecorator } = form;
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
        confirmLoading={confirmLoading}
        visible={drawerVisible}
        onCancel={onCancel}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
        footer={
          <div>
            {lineDetail.clickFlag === 'view' ? (
              <Button type="primary" onClick={onCancel}>
                {intl.get('hzero.common.button.close').d('关闭')}
              </Button>
            ) : lineDetail.clickFlag === 'disposition' ? (
              <Button type="primary" onClick={() => onChangeLineStatus(lineDetail)}>
                {intl.get('aatn.disposeOrder.button.dispositionSure').d('处置确认')}
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
          <Row>
            <Form.Item
              label={intl.get(`${commonPromptCode}.currentAssetStatus`).d('当前资产状态')}
              {...formLayout}
            >
              {getFieldDecorator('currentAssetStatusId', {
                initialValue: lineDetail.currentAssetStatusId,
              })(
                <Lov
                  disabled
                  code="AAFM.ASSET_STATUS"
                  queryParams={{ tenantId }}
                  textValue={lineDetail.currentAssetStatusName}
                />
              )}
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              label={intl.get(`${commonPromptCode}.targetAssetStatus`).d('目标资产状态')}
              {...formLayout}
            >
              {getFieldDecorator('targetAssetStatusId', {
                initialValue: defaultTargetAssetStatus.assetStatusId,
              })(
                <Lov
                  disabled
                  code="AAFM.ASSET_STATUS"
                  queryParams={{ tenantId }}
                  textValue={defaultTargetAssetStatus.sysStatusName}
                />
              )}
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              label={intl.get(`${commonPromptCode}.disposeTypeCode`).d('资产处置类型')}
              {...formLayout}
            >
              {getFieldDecorator('disposeTypeCode', {
                initialValue: lineDetail.disposeTypeCode,
              })(
                <Lov
                  disabled
                  code=""
                  queryParams={{ tenantId }}
                  textValue={lineDetail.disposeTypeCode}
                />
              )}
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              label={intl.get(`${commonPromptCode}.disposePerson`).d('处置人员')}
              {...formLayout}
            >
              {getFieldDecorator('disposePersonId', {
                initialValue: lineDetail.disposePersonId,
              })(<Lov disabled code="HALM.EMPLOYEE" textValue={lineDetail.disposePersonName} />)}
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              label={intl.get(`${commonPromptCode}.disposePrice`).d('处置价格')}
              {...formLayout}
            >
              {getFieldDecorator('disposePrice', {
                initialValue: lineDetail.disposePrice,
              })(<InputNumber disabled precision={2} />)}
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              label={intl.get(`${commonPromptCode}.disposeCost`).d('处置成本')}
              {...formLayout}
            >
              {getFieldDecorator('disposeCost', {
                initialValue: lineDetail.disposeCost,
              })(<InputNumber disabled precision={2} />)}
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              label={intl.get(`${commonPromptCode}.disposeRate`).d('税率')}
              {...formLayout}
            >
              {getFieldDecorator('disposeRate', {
                initialValue: lineDetail.disposeRate,
              })(
                <InputNumber
                  disabled
                  formatter={value => `${value}%`}
                  parser={value => value.replace('%', '')}
                />
              )}
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              label={intl.get(`${commonPromptCode}.disposeIncome`).d('处置收益')}
              {...formLayout}
            >
              {getFieldDecorator('disposeIncome', {
                initialValue: lineDetail.disposeIncome,
              })(<Input disabled />)}
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              label={intl.get(`${commonPromptCode}.description`).d('备注')}
              {...formLayout}
            >
              {getFieldDecorator('description', {
                initialValue: lineDetail.description,
              })(<Input.TextArea disabled rows={3} />)}
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    );
  }
}
export default Drawer;
