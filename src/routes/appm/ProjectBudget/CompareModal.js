import React, { PureComponent } from 'react';
import { Form, Modal, Select } from 'hzero-ui';
import intl from 'utils/intl';
import Switch from 'components/Switch';
import { Bind } from 'lodash-decorators';

@Form.create({ fieldNameProp: null })
class CompareModal extends PureComponent {
  @Bind()
  handleOk() {
    const {
      onOk,
      form: { getFieldsValue },
    } = this.props;
    const fields = getFieldsValue();
    onOk(fields);
  }
  render() {
    const prefix = 'appm.projectBudget.model.projectBudget';
    const {
      loading,
      modalVisible,
      historyList,
      onCancel,
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const formLayout = {
      labelCol: { span: 15 },
      wrapperCol: { span: 9 },
    };
    return (
      <Modal
        visible={modalVisible}
        width={300}
        title={intl.get(`${prefix}.compare`).d('对比信息')}
        confirmLoading={loading}
        onOk={this.handleOk}
        okText={intl.get('hzero.common.button.sure').d('确认')}
        onCancel={onCancel}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
      >
        <Form>
          <Form.Item
            label={intl.get(`${prefix}.standardTemplate`).d('对比标准模板')}
            {...formLayout}
          >
            {getFieldDecorator('standardTemplate', {})(<Switch />)}
          </Form.Item>
          <Form.Item label={intl.get(`${prefix}.preVersion`).d('对比上一版本预算')} {...formLayout}>
            {getFieldDecorator('preVersion', {})(<Switch />)}
          </Form.Item>
          <Form.Item label={intl.get(`${prefix}.otherVersion`).d('对比其他版本')} {...formLayout}>
            {getFieldDecorator('otherVersion', {})(<Switch />)}
          </Form.Item>
          <Form.Item
            style={{
              width: 200,
              display: getFieldValue('otherVersion') === 1 ? 'block' : 'none',
            }}
          >
            {getFieldDecorator('versionNumber', {})(
              <Select allowClear>
                {historyList.map(item => (
                  <Select.Option key={item}>{`V${item}`}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          {/* <Form.Item label={intl.get(`${prefix}.estimate`).d('对比估算')} {...formLayout}>
            {getFieldDecorator('estimate', {})(<Switch />)}
          </Form.Item>
          <Form.Item label={intl.get(`${prefix}.actualValue`).d('对比实际值')} {...formLayout}>
            {getFieldDecorator('actualValue', {})(<Switch />)}
          </Form.Item> */}
        </Form>
      </Modal>
    );
  }
}
export default CompareModal;
