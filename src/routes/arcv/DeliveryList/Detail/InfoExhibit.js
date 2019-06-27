import React, { Component, Fragment } from 'react';
import { Collapse, Form, Input, Row, Col, Icon, DatePicker, InputNumber, Switch } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import { getDateFormat } from 'utils/utils';

@Form.create({ fieldNameProp: null })
class InfoExhibit extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      collapseKeys: ['A', 'B'],
      assetClassId: '',
      assetClassMeaning: '',
    };
  }
  componentDidMount() {
    this.props.onRefresh();
  }
  @Bind()
  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }
  render() {
    const { tenantId, form, detailDataSource, getWbsHeader, currentWbsHeaderId } = this.props;
    const { getFieldDecorator } = form;
    const { collapseKeys = [], assetClassId, assetClassMeaning } = this.state;
    const formLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const longFormLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    const modelPrompt = 'arcv.delivery.model.delivery';
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
              <h3>{intl.get(`${modelPrompt}.panel.a`).d('基本信息')}</h3>
            </Fragment>
          }
        >
          <Form>
            <Row>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.deliveryListName`).d('名称')}
                  {...formLayout}
                >
                  {getFieldDecorator('deliveryListName', {
                    initialValue: detailDataSource.deliveryListName,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.deliveryListName`).d('名称'),
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label={intl.get(`${modelPrompt}.contract`).d('合同')} {...formLayout}>
                  {getFieldDecorator('contractId', {
                    initialValue: detailDataSource.contractId,
                    // 暂时设为非必输
                    // rules: [
                    //   {
                    //     required: true,
                    //     message: intl.get('hzero.common.validation.notNull', {
                    //       name: intl.get(`${modelPrompt}.contract`).d('合同'),
                    //     }),
                    //   },
                    // ],
                  })(
                    <Lov
                      code=""
                      queryParams={{ organization: tenantId }}
                      textValue={detailDataSource.contractMeaning}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.contractLine`).d('合同行')}
                  {...formLayout}
                >
                  {getFieldDecorator('contractLineId', {
                    initialValue: detailDataSource.contractLineId,
                  })(
                    <Lov
                      code=""
                      queryParams={{ organization: tenantId }}
                      textValue={detailDataSource.contractLineMeaning}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Form.Item label={intl.get(`${modelPrompt}.project`).d('项目')} {...formLayout}>
                  {getFieldDecorator('projectId', {
                    initialValue: detailDataSource.projectId,
                  })(
                    <Lov
                      code="APPM.PROJECT"
                      queryParams={{ organization: tenantId }}
                      textValue={detailDataSource.projectMeaning}
                      onChange={val => {
                        getWbsHeader(val);
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label={intl.get(`${modelPrompt}.wbsLine`).d('WBS任务')} {...formLayout}>
                  {getFieldDecorator('wbsLineId', {
                    initialValue: detailDataSource.wbsLineId,
                  })(
                    <Lov
                      code="APPM.PRO_WBS"
                      queryParams={{ organization: tenantId, wbsHeaderId: currentWbsHeaderId }}
                      textValue={detailDataSource.wbsLineMeaning}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.budgetHeader`).d('项目预算')}
                  {...formLayout}
                >
                  {getFieldDecorator('budgetHeaderId', {
                    initialValue: detailDataSource.budgetHeaderId,
                  })(
                    <Lov
                      code=""
                      queryParams={{ organization: tenantId }}
                      textValue={detailDataSource.budgetHeaderMeaning}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.budgetLine`).d('项目预算行')}
                  {...formLayout}
                >
                  {getFieldDecorator('budgetLineId', {
                    initialValue: detailDataSource.budgetLineId,
                  })(
                    <Lov
                      code=""
                      queryParams={{ organization: tenantId }}
                      textValue={detailDataSource.budgetLineMeaning}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.productCategory`).d('产品类别')}
                  {...formLayout}
                >
                  {getFieldDecorator('productCategoryId', {
                    initialValue: detailDataSource.productCategoryId,
                  })(
                    <Lov
                      code="AAFM.ASSET_CLASS"
                      queryParams={{ organization: tenantId }}
                      textValue={assetClassMeaning || detailDataSource.productCategoryMeaning}
                      onChange={val => {
                        this.setState({
                          assetClassId: val,
                        });
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label={intl.get(`${modelPrompt}.assetsSet`).d('资产组')} {...formLayout}>
                  {getFieldDecorator('assetsSetId', {
                    initialValue: detailDataSource.assetsSetId,
                  })(
                    <Lov
                      code="AAFM.ASSET_SET"
                      queryParams={{ organization: tenantId, assetClassId }}
                      textValue={detailDataSource.assetsSetMeaning}
                      onChange={(_, record) => {
                        this.props.form.setFieldsValue({ productCategoryId: record.assetClassId });
                        this.setState({ assetClassMeaning: record.assetClassMeaning });
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.specifications`).d('规格/型号')}
                  {...formLayout}
                >
                  {getFieldDecorator('specifications', {
                    initialValue: detailDataSource.specifications,
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label={intl.get(`${modelPrompt}.unitPrice`).d('单价')} {...formLayout}>
                  {getFieldDecorator('unitPrice', {
                    initialValue: detailDataSource.unitPrice,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.unitPrice`).d('单价'),
                        }),
                      },
                    ],
                  })(<InputNumber step={0.01} />)}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label={intl.get(`${modelPrompt}.uom`).d('单位')} {...formLayout}>
                  {getFieldDecorator('uomId', {
                    initialValue: detailDataSource.uomId,
                  })(
                    <Lov
                      code="AMDM.UOM"
                      queryParams={{ organization: tenantId }}
                      textValue={detailDataSource.uomMeaning}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.needDeliveryQuantity`).d('应交付数量')}
                  {...formLayout}
                >
                  {getFieldDecorator('needDeliveryQuantity', {
                    initialValue: detailDataSource.needDeliveryQuantity,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.needDeliveryQuantity`).d('应交付数量'),
                        }),
                      },
                    ],
                  })(<InputNumber />)}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.deliveredQuantity`).d('已交付数量')}
                  {...formLayout}
                >
                  {getFieldDecorator('deliveredQuantity', {
                    initialValue: detailDataSource.deliveredQuantity,
                  })(<InputNumber disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.deliveryCompleteDate`).d('交付完成日期')}
                  {...formLayout}
                >
                  {getFieldDecorator('deliveryCompleteDate', {
                    initialValue: detailDataSource.deliveryCompleteDate
                      ? moment(detailDataSource.deliveryCompleteDate, getDateFormat())
                      : null,
                  })(
                    <DatePicker
                      disabled
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateFormat()}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.deliveryCompleteFlag`).d('交付完成')}
                  {...formLayout}
                >
                  {getFieldDecorator('deliveryCompleteFlag', {
                    initialValue: detailDataSource.deliveryCompleteFlag,
                  })(<Switch disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={21}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.description`).d('描述')}
                  {...longFormLayout}
                >
                  {getFieldDecorator('description', {
                    initialValue: detailDataSource.description,
                    rules: [
                      {
                        max: 240,
                        message: intl.get('hzero.common.validation.max', {
                          max: 240,
                        }),
                      },
                    ],
                  })(<Input.TextArea rows={3} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Collapse.Panel>
      </Collapse>
    );
  }
}
export default InfoExhibit;
