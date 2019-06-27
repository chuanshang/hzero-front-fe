/**
 * 资产报废单处理界面行明细-滑窗(抽屉)
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {string} anchor - 抽屉滑动位置
 * @reactProps {string} title - 抽屉标题
 * @reactProps {boolean} visible - 抽屉是否可见
 * @reactProps {Function} onOk - 抽屉确定操作
 * @return React.element
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, DatePicker, Button, InputNumber, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import { getDateFormat, getDateTimeFormat } from 'utils/utils';
import intl from 'utils/intl';

@Form.create({ fieldNameProp: null })
class TransactionDrawer extends PureComponent {
  @Bind()
  conformLineBtn(lineData) {
    const { onConformLine } = this.props;
    // const { targetLocation, processStatusMeaning } = this.state;
    if (onConformLine) {
      // 校验通过，进行报废操作
      onConformLine({
        ...lineData,
      });
    }
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
   * render
   * @returns React.element
   */
  render() {
    const commonPromptCode = 'aatn.assetScrap.model.assetScrap';
    const {
      anchor,
      drawerVisible,
      title,
      form,
      loading,
      onCancel,
      lineData = [], // 所有的行记录信息
      scrapTypeMap = [],
      disposeTypeLovMap = [],
    } = this.props;
    const { getFieldDecorator } = form;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal
        maskClosable
        destroyOnClose
        title={title}
        width={450}
        wrapClassName={`ant-modal-sidebar-${anchor}`}
        transitionName={`move-${anchor}`}
        visible={drawerVisible}
        confirmLoading={loading}
        onCancel={onCancel}
        footer={[
          <Button type="primary" onClick={() => this.conformLineBtn(lineData)}>
            {intl.get('hzero.common.button.scrapConfirm').d('报废确认')}
          </Button>,
        ]}
      >
        <Form>
          <Form.Item
            label={intl.get(`${commonPromptCode}.assetName`).d('设备/资产')}
            {...formLayout}
          >
            {getFieldDecorator('assetName', {
              initialValue: lineData.assetName,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.assetDesc`).d('资产名称')}
            {...formLayout}
          >
            {getFieldDecorator('assetDesc', {
              initialValue: lineData.assetDesc,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.processStatusMeaning`).d('处理状态')}
            {...formLayout}
          >
            {getFieldDecorator('processStatusMeaning', {
              initialValue: lineData.processStatusMeaning,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.currentAssetStatus`).d('当前资产状态')}
            {...formLayout}
          >
            {getFieldDecorator('currentAssetStatus', {
              initialValue: lineData.currentAssetStatus,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.targetAssetStatus`).d('目标资产状态')}
            {...formLayout}
          >
            {getFieldDecorator('targetAssetStatus', {
              initialValue: lineData.targetAssetStatus,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.currentLocationName`).d('当前位置')}
            {...formLayout}
          >
            {getFieldDecorator('currentLocationName', {
              initialValue: lineData.currentLocationName,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.targetLocationName`).d('目标位置')}
            {...formLayout}
          >
            {getFieldDecorator('targetLocationName', {
              initialValue: lineData.targetLocationName,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.originalCost`).d('资产原值')}
            {...formLayout}
          >
            {getFieldDecorator('originalCost', {
              initialValue: lineData.originalCost,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.remainCost`).d('剩余价值')}
            {...formLayout}
          >
            {getFieldDecorator('remainCost', {
              initialValue: lineData.remainCost,
            })(<InputNumber disabled />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.capitalizationDate`).d('资本化日期')}
            {...formLayout}
          >
            {getFieldDecorator('capitalizationDate', {
              initialValue: lineData.capitalizationDate
                ? moment(lineData.capitalizationDate, getDateTimeFormat())
                : null,
            })(<DatePicker disabled placeholder="" format={getDateFormat()} />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.remainDepreciationMouth`).d('剩余折旧日期')}
            {...formLayout}
          >
            {getFieldDecorator('remainDepreciationMouth', {
              initialValue: lineData.remainDepreciationMouth,
            })(<InputNumber disabled />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.scrapTypeCode`).d('资产报废类型')}
            {...formLayout}
          >
            {getFieldDecorator('scrapTypeCode', {
              initialValue: lineData.scrapTypeCode,
            })(
              <Select disabled>
                {scrapTypeMap.map(i => (
                  <Select.Option key={i.value}>{i.meaning}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.disposeTypeCode`).d('资产处置类型')}
            {...formLayout}
          >
            {getFieldDecorator('disposeTypeCode', {
              initialValue: lineData.disposeTypeCode,
            })(
              <Select disabled>
                {disposeTypeLovMap.map(i => (
                  <Select.Option key={i.value}>{i.meaning}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label={intl.get(`${commonPromptCode}.remark`).d('备注')} {...formLayout}>
            {getFieldDecorator('remark', {
              initialValue: lineData.remark,
            })(<Input disabled />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default TransactionDrawer;
