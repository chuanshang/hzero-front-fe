import React, { PureComponent } from 'react';
import { Form, Modal, Row, Col, Spin } from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { isFunction } from 'lodash';
import moment from 'moment';
import { getDateTimeFormat } from 'utils/utils';
import { getComponentType, getComponentProps } from './util';

@Form.create({ fieldNameProp: null })
class AssetModal extends PureComponent {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
  }

  /**
   * 根据属性行内容动态渲染属性表单内容
   * @param {Array} [attributeInfo=[]]
   */
  @Bind()
  getAttributeInfo(attributeInfo = []) {
    const formLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const {
      form: { getFieldDecorator },
      dataSource = {},
    } = this.props;
    const renderTemplates = [];
    attributeInfo.forEach(item => {
      const field = {
        componentType: item.attributeType,
        lovCode: item.lovValue,
        fieldCode: 'attributeName',
      };
      const componentType = getComponentType(field);
      const componentProps = getComponentProps({ field, componentType: field.componentType });
      const template = (
        <Col key={item.lineId} span={11}>
          <Form.Item label={item.attributeName} {...formLayout}>
            {getFieldDecorator(`${item.attributeName}`, {
              initialValue:
                item.attributeType === 'DatePicker'
                  ? dataSource[item.attributeName]
                    ? moment(dataSource[item.attributeName], getDateTimeFormat())
                    : null
                  : dataSource[item.attributeName],
            })(React.createElement(componentType, Object.assign({}, componentProps)))}
          </Form.Item>
        </Col>
      );
      renderTemplates.push(template);
    });
    return renderTemplates;
  }

  render() {
    const prefix = 'appa.budgetTemplate.model.budgetTemplate';
    const { modalVisible, attributeList, loadingFlag, dynamicFields, onCancel, onOk } = this.props;
    return (
      <Modal
        destroyOnClose
        width={600}
        maskClosable={false}
        title={intl.get(`${prefix}.modalName`).d('属性组')}
        visible={modalVisible}
        onOk={onOk}
        okText={intl.get('hzero.common.button.sure').d('确认')}
        onCancel={onCancel}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
      >
        <React.Fragment>
          <Form>
            <Spin spinning={loadingFlag ? dynamicFields : false}>
              <Row>{this.getAttributeInfo(attributeList)}</Row>
            </Spin>
          </Form>
        </React.Fragment>
      </Modal>
    );
  }
}
export default AssetModal;
