import React, { Component, Fragment } from 'react';
import { Collapse, Form, Input, Row, Col, Icon, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import Switch from 'components/Switch';
import Lov from 'components/Lov';
import intl from 'utils/intl';

@Form.create({ fieldNameProp: null })
class InfoEdit extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      collapseKeys: ['A'],
    };
  }
  componentDidMount() {
    this.props.onRefresh();
  }
  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }

  @Bind()
  onRemoveSuccess() {
    const { form } = this.props;
    form.setFieldsValue({
      productUrl: null,
    });
  }
  render() {
    const {
      // isNew,
      tenantId,
      dataSource,
      transferFixed,
      acceptanceType,
      form: { getFieldDecorator },
    } = this.props;
    const { collapseKeys = [] } = this.state;
    const formLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const prefix = `arcv.acceptanceType.view.message`;
    const modelPrompt = 'arcv.acceptanceType.model.acceptanceType';
    return (
      <Collapse
        bordered={false}
        defaultActiveKey={['A']}
        className="associated-collapse"
        onChange={this.handleChangeKey.bind(this)}
      >
        <Collapse.Panel
          showArrow={false}
          key="A"
          header={
            <Fragment>
              <Icon type={collapseKeys.includes('A') ? 'minus' : 'plus'} />
              <h3>{intl.get(`${prefix}.basicInfo`).d('基础信息')}</h3>
            </Fragment>
          }
        >
          <Form>
            <Row>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.codeRule`).d('编号规则')}
                  {...formLayout}
                >
                  {getFieldDecorator('codeRule', {
                    initialValue: dataSource.codeRule,
                  })(
                    <Lov
                      code="HALM.CODE_RULE"
                      queryParams={{ tenantId }}
                      textValue={dataSource.codeRuleMeaning}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.acceptanceTypeCode`).d('验收基础类型')}
                  {...formLayout}
                >
                  {getFieldDecorator('acceptanceTypeCode', {
                    initialValue: dataSource.acceptanceTypeCode,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.acceptanceTypeCode`).d('验收基础类型'),
                        }),
                      },
                    ],
                  })(
                    <Select style={{ width: 150 }} allowClear>
                      {acceptanceType.map(item => (
                        <Select.Option key={item.value}>{item.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.enabledFlag`).d('是否启用')}
                  {...formLayout}
                >
                  {getFieldDecorator('enabledFlag', {
                    initialValue: dataSource.enabledFlag,
                  })(<Switch disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.inContractFlag`).d('是否合同内收货')}
                  {...formLayout}
                >
                  {getFieldDecorator('inContractFlag', {
                    initialValue: dataSource.inContractFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.projectFlag`).d('是否来源于项目')}
                  {...formLayout}
                >
                  {getFieldDecorator('projectFlag', {
                    initialValue: dataSource.projectFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.budgetFlag`).d('是否有对应预算')}
                  {...formLayout}
                >
                  {getFieldDecorator('budgetFlag', {
                    initialValue: dataSource.budgetFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Form.Item label={intl.get(`${modelPrompt}.code`).d('代码')} {...formLayout}>
                  {getFieldDecorator('code', {
                    initialValue: dataSource.code,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.code`).d('代码'),
                        }),
                      },
                      {
                        max: 30,
                        message: intl.get('hzero.common.validation.max', {
                          max: 30,
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.shortName`).d('事件短名称')}
                  {...formLayout}
                >
                  {getFieldDecorator('shortName', {
                    initialValue: dataSource.shortName,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.shortName`).d('事件短名称'),
                        }),
                      },
                      {
                        max: 60,
                        message: intl.get('hzero.common.validation.max', {
                          max: 60,
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.fullName`).d('事件完整名称')}
                  {...formLayout}
                >
                  {getFieldDecorator('fullName', {
                    initialValue: dataSource.fullName,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.fullName`).d('事件完整名称'),
                        }),
                      },
                      {
                        max: 240,
                        message: intl.get('hzero.common.validation.max', {
                          max: 240,
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.transferFixedCode`).d('是否转固')}
                  {...formLayout}
                >
                  {getFieldDecorator('transferFixedCode', {
                    initialValue: dataSource.transferFixedCode,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.transferFixedCode`).d('是否转固'),
                        }),
                      },
                    ],
                  })(
                    <Select style={{ width: 150 }} allowClear>
                      {transferFixed.map(item => (
                        <Select.Option key={item.value}>{item.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label={intl.get(`${modelPrompt}.tag`).d('标记')} {...formLayout}>
                  {getFieldDecorator('tag', {
                    initialValue: dataSource.tag,
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.completeAssetStatusId`).d('验收完成默认资产状态')}
                  {...formLayout}
                >
                  {getFieldDecorator('completeAssetStatusId', {
                    initialValue: dataSource.completeAssetStatusId,
                  })(
                    <Lov
                      code="AAFM.ASSET_STATUS"
                      queryParams={{ tenantId }}
                      textValue={dataSource.assetStatusMeaning}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Form.Item
                  label={intl
                    .get(`${modelPrompt}.transferInterfaceFlag`)
                    .d('是否触发外部备品备件传输接口程序')}
                  {...formLayout}
                >
                  {getFieldDecorator('transferInterfaceFlag', {
                    initialValue: dataSource.transferInterfaceFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label={intl
                    .get(`${modelPrompt}.transferInterfaceFlag`)
                    .d('是否直接完成物料事务处理')}
                  {...formLayout}
                >
                  {getFieldDecorator('directlyCompleteFlag', {
                    initialValue: dataSource.directlyCompleteFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.approveFlowFlag`).d('是否需要审批流')}
                  {...formLayout}
                >
                  {getFieldDecorator('approveFlowFlag', {
                    initialValue: dataSource.approveFlowFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.createFaFlag`).d('是否始终生成无价值的FA卡片')}
                  {...formLayout}
                >
                  {getFieldDecorator('createFaFlag', {
                    initialValue: dataSource.createFaFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label={intl.get(`${modelPrompt}.description`).d('描述')} {...formLayout}>
                  {getFieldDecorator('description', {
                    initialValue: dataSource.description,
                  })(<Input.TextArea row={2} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Collapse.Panel>
      </Collapse>
    );
  }
}
export default InfoEdit;
