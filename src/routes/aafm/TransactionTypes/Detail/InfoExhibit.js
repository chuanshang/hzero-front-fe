import React, { Component, Fragment } from 'react';
import { Form, Row, Col, Input, Select, Collapse, Icon, Button, InputNumber } from 'hzero-ui';
import intl from 'utils/intl';
import { EDIT_FORM_ROW_LAYOUT } from 'utils/constants';
import Switch from 'components/Switch';
import Lov from 'components/Lov';
import TypeFieldList from './TypeField';

@Form.create({ fieldNameProp: null })
class InfoExhibit extends Component {
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

  render() {
    const commonPromptCode = 'aafm.transactionTypes.model.transactionTypes';
    const {
      detailInfo,
      tenantId,
      statusUpdateFlag,
      basicColumnFlag,
      trackingFlag,
      form: { getFieldDecorator },
      transactionTypesOrg,
      assetStatus,
      assetSpecialty,
      specialAssetMap,
      basicTypeMap,
      needTwiceConfirmMap,
      fieldTypeMap,
      onChangeStatusUpdateFlag,
      onChangeBasicColumnFlag,
      onChangetrackingFlag,
      onDeleteBasicColumnLine,
      onAddBasicColumnLine,
      onDeleteTrackingManagementColumnLine,
      onAddTrackingManagementColumnLine,
    } = this.props;
    const { collapseKeys = [] } = this.state;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const longFormLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const { basicAssetColumnList = [], trackingManagementColumnList } = this.props;
    const basicColumnListProps = {
      fieldTypeMap,
      dataSource: basicAssetColumnList,
      tenantId,
      onDeleteColumnLine: onDeleteBasicColumnLine,
      columnClass: 'BASIC',
    };
    const trackingManagementColumnListProps = {
      fieldTypeMap,
      dataSource: trackingManagementColumnList,
      tenantId,
      onDeleteColumnLine: onDeleteTrackingManagementColumnLine,
      columnClass: 'TRACK',
    };
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
              <h3>{intl.get('hzero.common.view.baseInfo').d('基本信息')}</h3>
              <a>
                {collapseKeys.includes('A')
                  ? intl.get(`hzero.common.button.up`).d('收起')
                  : intl.get(`hzero.common.button.expand`).d('展开')}
              </a>
              <Icon type={collapseKeys.includes('A') ? 'up' : 'down'} />
            </Fragment>
          }
        >
          <Form>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={10}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.basicTypeCode`).d('基础类型')}
                  {...formLayout}
                >
                  {getFieldDecorator('basicTypeCode', {
                    initialValue: detailInfo.basicTypeCode,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonPromptCode}.basicTypeCode`).d('基础类型'),
                        }),
                      },
                    ],
                  })(
                    <Select>
                      {basicTypeMap.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.transactionTypeCode`).d('代码')}
                  {...formLayout}
                >
                  {getFieldDecorator('transactionTypeCode', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonPromptCode}.transactionTypeCode`).d('代码'),
                        }),
                      },
                      {
                        max: 240,
                        message: intl.get('hzero.common.validation.max', {
                          max: 240,
                        }),
                      },
                    ],
                    initialValue: detailInfo.transactionTypeCode,
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={10}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.needTwiceConfirm`).d('是否需要2步确认')}
                  {...formLayout}
                >
                  {getFieldDecorator('needTwiceConfirm', {
                    initialValue: detailInfo.needTwiceConfirm,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl
                            .get(`${commonPromptCode}.needTwiceConfirm`)
                            .d('是否需要2步确认'),
                        }),
                      },
                    ],
                  })(
                    <Select>
                      {needTwiceConfirmMap.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label={intl.get('hzero.common.status.enabledFlag').d('启用')}
                  {...formLayout}
                >
                  {getFieldDecorator('enabledFlag', {
                    initialValue: detailInfo.enabledFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={10}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.shortName`).d('事件短名称')}
                  {...formLayout}
                >
                  {getFieldDecorator('shortName', {
                    initialValue: detailInfo.shortName,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonPromptCode}.shortName`).d('事件短名称'),
                        }),
                      },
                      {
                        max: 150,
                        message: intl.get('hzero.common.validation.max', {
                          max: 150,
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.longName`).d('事件完整名称')}
                  {...formLayout}
                >
                  {getFieldDecorator('longName', {
                    initialValue: detailInfo.longName,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonPromptCode}.longName`).d('事件完整名称'),
                        }),
                      },
                      {
                        max: 150,
                        message: intl.get('hzero.common.validation.max', {
                          max: 150,
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={10}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.parentTypeName`).d('父事件类型')}
                  {...formLayout}
                >
                  {getFieldDecorator('parentTypeId', {
                    initialValue: detailInfo.parentTypeId,
                  })(
                    <Lov
                      disabled
                      code="AMDM.ORGANIZATION"
                      queryParams={{ organizationId: tenantId }}
                      textValue={detailInfo.parentTypeName}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.codeRuleName`).d('编号规则')}
                  {...formLayout}
                >
                  {getFieldDecorator('codeRule', {
                    initialValue: detailInfo.codeRule,
                  })(
                    <Lov
                      code="HALM.CODE_RULE"
                      queryParams={{ tenantId }}
                      textValue={detailInfo.codeRuleName}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={20}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.description`).d('描述')}
                  {...longFormLayout}
                >
                  {getFieldDecorator('description', {
                    initialValue: detailInfo.description,
                    rules: [
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
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={10}>
                <Form.Item label={intl.get(`${commonPromptCode}.icon`).d('图标')} {...formLayout}>
                  {getFieldDecorator('icon', {
                    initialValue: detailInfo.icon,
                    rules: [
                      {
                        max: 150,
                        message: intl.get('hzero.common.validation.max', {
                          max: 150,
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label={intl.get(`${commonPromptCode}.tag`).d('tag')} {...formLayout}>
                  {getFieldDecorator('tag', {
                    initialValue: detailInfo.tag,
                    rules: [],
                  })(<InputNumber precision={2} />)}
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
              <h3>{intl.get(`${commonPromptCode}.scopeOfApplication`).d('适用范围')}</h3>
              <a>
                {collapseKeys.includes('B')
                  ? intl.get(`hzero.common.button.up`).d('收起')
                  : intl.get(`hzero.common.button.expand`).d('展开')}
              </a>
              <Icon type={collapseKeys.includes('B') ? 'up' : 'down'} />
            </Fragment>
          }
        >
          <Form>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={20}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.organizationScope`).d('组织范围')}
                  {...longFormLayout}
                >
                  {getFieldDecorator('organizationScope', {
                    initialValue: detailInfo.organizationScope,
                    rules: [],
                  })(
                    <Select mode="multiple" placeholder="" style={{ width: '100%' }}>
                      {transactionTypesOrg.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={20}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.statusScope`).d('状态范围')}
                  {...longFormLayout}
                >
                  {getFieldDecorator('statusScope', {
                    initialValue: detailInfo.statusScope,
                    rules: [],
                  })(
                    <Select mode="multiple" placeholder="" style={{ width: '100%' }}>
                      {assetStatus.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={20}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.specialtyScope`).d('专业范围')}
                  {...longFormLayout}
                >
                  {getFieldDecorator('specialtyScope', {
                    initialValue: detailInfo.specialtyScope,
                    rules: [],
                  })(
                    <Select mode="multiple" placeholder="" style={{ width: '100%' }}>
                      {assetSpecialty.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={10}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.specialAssetFlag`).d('仅针对特殊资产')}
                  {...formLayout}
                >
                  {getFieldDecorator('specialAssetFlag', {
                    initialValue: detailInfo.specialAssetFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.specialAsset`).d('特殊资产')}
                  {...formLayout}
                >
                  {getFieldDecorator('specialAsset', {
                    initialValue: detailInfo.specialAsset,
                  })(
                    <Select>
                      {specialAssetMap.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Collapse.Panel>
        <Collapse.Panel
          showArrow={false}
          key="C"
          header={
            <Fragment>
              <h3>{intl.get(`${commonPromptCode}.checkEffective`).d('有效性检查')}</h3>
              <a>
                {collapseKeys.includes('C')
                  ? intl.get(`hzero.common.button.up`).d('收起')
                  : intl.get(`hzero.common.button.expand`).d('展开')}
              </a>
              <Icon type={collapseKeys.includes('C') ? 'up' : 'down'} />
            </Fragment>
          }
        >
          <Form>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={16}>
                <Form.Item
                  label={intl
                    .get(`${commonPromptCode}.checkTargetOrgFlag`)
                    .d('检查目标使用组织暂挂状态')}
                  {...formLayout}
                >
                  {getFieldDecorator('checkTargetOrgFlag', {
                    initialValue: detailInfo.checkTargetOrgFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={16}>
                <Form.Item
                  label={intl
                    .get(`${commonPromptCode}.checkCurrentOrgFlag`)
                    .d('检查当前所属组织暂挂状态')}
                  {...formLayout}
                >
                  {getFieldDecorator('checkCurrentOrgFlag', {
                    initialValue: detailInfo.checkCurrentOrgFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={16}>
                <Form.Item
                  label={intl
                    .get(`${commonPromptCode}.crossLegalFlag`)
                    .d('更改所属组织时，跨法人单位')}
                  {...formLayout}
                >
                  {getFieldDecorator('crossLegalFlag', {
                    initialValue: detailInfo.crossLegalFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Collapse.Panel>
        <Collapse.Panel
          showArrow={false}
          key="D"
          header={
            <Fragment>
              <h3>{intl.get(`${commonPromptCode}.controlRule`).d('控制规则')}</h3>
              <a>
                {collapseKeys.includes('D')
                  ? intl.get(`hzero.common.button.up`).d('收起')
                  : intl.get(`hzero.common.button.expand`).d('展开')}
              </a>
              <Icon type={collapseKeys.includes('D') ? 'up' : 'down'} />
            </Fragment>
          }
        >
          <Form>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={10}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.statusUpdateFlag`).d('需要修改资产状态')}
                  {...formLayout}
                >
                  {getFieldDecorator('statusUpdateFlag', {
                    initialValue: detailInfo.statusUpdateFlag,
                  })(<Switch onChange={onChangeStatusUpdateFlag} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={10}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.targetAssetStatus`).d('目标资产状态')}
                  {...formLayout}
                >
                  {getFieldDecorator('targetAssetStatusId', {
                    initialValue: detailInfo.targetAssetStatusId,
                  })(
                    <Lov
                      disabled={!statusUpdateFlag}
                      code="AAFM.ASSET_STATUS"
                      queryParams={{ organizationId: tenantId }}
                      textValue={detailInfo.targetAssetStatusName}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.inprocessAssetStatus`).d('过程中的资产状态')}
                  {...formLayout}
                >
                  {getFieldDecorator('inprocessAssetStatusId', {
                    initialValue: detailInfo.inprocessAssetStatusId,
                  })(
                    <Lov
                      disabled={!statusUpdateFlag}
                      code="AAFM.ASSET_STATUS"
                      queryParams={{ organizationId: tenantId }}
                      textValue={detailInfo.inprocessAssetStatusName}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={20}>
                <Form.Item
                  label={intl
                    .get(`${commonPromptCode}.targetAssetStatusScope`)
                    .d('目标资产状态范围')}
                  {...longFormLayout}
                >
                  {getFieldDecorator('targetAssetStatusScope', {
                    initialValue: detailInfo.targetAssetStatusScope,
                    rules: [],
                  })(
                    <Select
                      mode="multiple"
                      placeholder=""
                      style={{ width: '100%' }}
                      disabled={!statusUpdateFlag}
                    >
                      {assetStatus.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={10}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.basicColumnFlag`).d('涉及基本信息变更')}
                  {...formLayout}
                >
                  {getFieldDecorator('basicColumnFlag', {
                    initialValue: detailInfo.basicColumnFlag,
                  })(<Switch onChange={onChangeBasicColumnFlag} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={basicColumnFlag ? 20 : 0}>
                <TypeFieldList {...basicColumnListProps} />
                <Button
                  style={{ margin: '2px 2px 2px 10px' }}
                  icon="plus"
                  type="Normal"
                  onClick={() => onAddBasicColumnLine()}
                >
                  {intl.get(`${commonPromptCode}.button.addLine`).d('新增')}
                </Button>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={10}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.attributeColumnFlag`).d('涉及属性描述变更')}
                  {...formLayout}
                >
                  {getFieldDecorator('attributeColumnFlag', {
                    initialValue: detailInfo.attributeColumnFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={10}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.trackingFlag`).d('涉及跟踪与管理变更')}
                  {...formLayout}
                >
                  {getFieldDecorator('trackingFlag', {
                    initialValue: detailInfo.trackingFlag,
                  })(<Switch onChange={onChangetrackingFlag} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={trackingFlag ? 20 : 0}>
                <TypeFieldList {...trackingManagementColumnListProps} />
                <Button
                  style={{ margin: '2px 2px 2px 10px' }}
                  icon="plus"
                  type="Normal"
                  onClick={() => onAddTrackingManagementColumnLine()}
                >
                  {intl.get(`${commonPromptCode}.button.addLine`).d('新增')}
                </Button>
              </Col>
            </Row>
          </Form>
        </Collapse.Panel>
      </Collapse>
    );
  }
}
export default InfoExhibit;
