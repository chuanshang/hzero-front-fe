import React, { Component, Fragment } from 'react';
import { Form, Row, Col, Input, Collapse, Icon, Select, Upload, Button } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import Switch from 'components/Switch';
import { isUndefined, isEmpty } from 'lodash';

const { TextArea } = Input;

@Form.create({ fieldNameProp: null })
class MaterialTsTypeDetail extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      collapseKeys: ['A', 'B'],
    };
  }

  componentDidMount() {
    // this.props.onRefresh();
  }

  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }

  render() {
    const {
      form: { getFieldDecorator },
      defaultDetailItem,
      detailId,
    } = this.props;
    const productTypeMap = [];
    const uomConversionMap = [];
    const trackingUsedMap = [];
    const pricingUsedMap = [];
    const auxiliaryqtymethodMap = [];
    const { collapseKeys = [] } = this.state;
    const formLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const longFormLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    const props2 = {
      action: '//jsonplaceholder.typicode.com/posts/',
      onChange({ file, fileList }) {
        if (file.status !== 'uploading') {
          console.log(file, fileList);
        }
      },
    };
    return (
      <Collapse
        bordered={false}
        defaultActiveKey={['A', 'B']}
        className="associated-collapse"
        onChange={this.handleChangeKey.bind(this)}
      >
        <Collapse.Panel
          showArrow={false}
          key="A"
          header={
            <Fragment>
              <Icon type={collapseKeys.includes('A') ? 'minus' : 'plus'} />
              <h3>基础信息</h3>
            </Fragment>
          }
        >
          <Form>
            <Row>
              <Col span={8}>
                <Form.Item label="物料编号" {...formLayout}>
                  {getFieldDecorator('productNum', {
                    initialValue: isUndefined(detailId) ? '' : defaultDetailItem.productNum,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '物料编号',
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="名称" {...formLayout}>
                  {getFieldDecorator('productName', {
                    initialValue: isUndefined(detailId) ? '' : defaultDetailItem.productName,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '名称',
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="产品类别：" {...formLayout}>
                  {getFieldDecorator('productCategoryId', {
                    initialValue: isUndefined(detailId) ? '' : defaultDetailItem.productCategoryId,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '产品类别',
                        }),
                      },
                    ],
                  })(
                    <Lov
                      code="AAFM.ASSET_CLASS"
                      textValue={isUndefined(detailId) ? '' : defaultDetailItem.productCategoryName}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="产品类型" {...formLayout}>
                  {getFieldDecorator('productTypeCode', {
                    initialValue: 'Good',
                    rules: [],
                  })(
                    <Select>
                      {productTypeMap.map(i => (
                        <Select.Option key={i.value} value={i.value}>
                          {i.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="品牌/厂商" {...formLayout}>
                  {getFieldDecorator('productsCstm.productBrand', {
                    initialValue: '',
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="规格型号" {...formLayout}>
                  {getFieldDecorator('productsCstm.productModel', {
                    initialValue: '',
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="URL" {...formLayout}>
                  {getFieldDecorator('productsCstm.url', {
                    initialValue: '',
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="可在合同中交易？" {...formLayout}>
                  {getFieldDecorator('contractFlag', {
                    initialValue: 1,
                  })(<Switch />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="限用于分配的服务区域" {...formLayout}>
                  {getFieldDecorator('maintSitesFlag', {
                    initialValue: 1,
                  })(<Switch />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="产品图片" {...formLayout}>
                  {getFieldDecorator('productsCstm.productUrl', {
                    initialValue: '',
                  })(
                    <Upload {...props2}>
                      <Button>
                        <Icon type="upload" /> Upload
                      </Button>
                    </Upload>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="说明" {...longFormLayout}>
                  {getFieldDecorator('description', {
                    initialValue: '',
                  })(<TextArea rows={3} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Collapse.Panel>
        <Collapse.Panel
          showArrow={false}
          key="B"
          header={
            <Fragment>
              <Icon type={collapseKeys.includes('B') ? 'minus' : 'plus'} />
              <h3>计量单位</h3>
            </Fragment>
          }
        >
          <Form>
            <Row>
              <Col span={8}>
                <Form.Item label="主计量单位" {...formLayout}>
                  {getFieldDecorator('productsCstm.uomCode', {
                    initialValue: isEmpty(defaultDetailItem)
                      ? ''
                      : defaultDetailItem.productsCstm.uomCode,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '主计量单位',
                        }),
                      },
                    ],
                  })(<Lov code="HPFM.UOM" />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="单位换算" {...formLayout}>
                  {getFieldDecorator('productsCstm.uomConversionsCode', {
                    initialValue: 'USE_MATERIAL_CONVERSION',
                  })(
                    <Select>
                      {uomConversionMap.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="跟踪时使用" {...formLayout}>
                  {getFieldDecorator('productsCstm.trackingUomCode', {
                    initialValue: 'USE_MAIN_UNIT',
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '跟踪时使用',
                        }),
                      },
                    ],
                  })(
                    <Select>
                      {trackingUsedMap.map(i => (
                        <Select.Option key={i.value} value={i.value}>
                          {i.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="计价时使用" {...formLayout}>
                  {getFieldDecorator('productsCstm.pricingUomCode', {
                    initialValue: 'USE_MAIN_UNIT',
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '计价时使用',
                        }),
                      },
                    ],
                  })(
                    <Select>
                      {pricingUsedMap.map(i => (
                        <Select.Option key={i.value} value={i.value}>
                          {i.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="辅助计量单位" {...formLayout}>
                  {getFieldDecorator('productsCstm.aidUomCode', {})(<Lov code="HPFM.UOM" />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="辅助数量填写方式" {...formLayout}>
                  {getFieldDecorator('productsCstm.aidTypeCode', {
                    initialValue: 'DEFAULT_BE_MODIFIED',
                  })(
                    <Select>
                      {auxiliaryqtymethodMap.map(i => (
                        <Select.Option key={i.value} value={i.value}>
                          {i.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Collapse.Panel>
      </Collapse>
    );
  }
}
export default MaterialTsTypeDetail;
