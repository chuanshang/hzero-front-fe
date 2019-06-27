import React, { Component, Fragment } from 'react';
import { Collapse, Form, Input, Select, Row, Col, Icon, Tag } from 'hzero-ui';
import Lov from 'components/Lov';
import Switch from 'components/Switch';
import intl from 'utils/intl';

@Form.create({ fieldNameProp: null })
class InfoExhibit extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      collapseKeys: ['A', 'B'],
    };
  }
  componentDidMount() {
    this.props.onRefresh();
  }
  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }
  render() {
    const {
      isNew,
      dataSource,
      tenantId,
      projectRole,
      limitTimeUom,
      pmoRole,
      proManageRole,
      form: { getFieldDecorator },
    } = this.props;
    const { collapseKeys = [] } = this.state;
    const formLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const longLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 19 },
    };
    const prefix = `appm.projectTemplate.model.projectTemplate`;
    return (
      <React.Fragment>
        {!isNew ? (
          <Row style={{ marginBottom: 10 }}>
            <Col>
              <Row>
                <span style={{ marginRight: 10, fontSize: 18, fontWeight: 'bold' }}>
                  {dataSource.proTemplateName}.{dataSource.proTemplateCode}
                </span>
                <Tag color="#2db7f5">{dataSource.proTemplateStatusMeaning}</Tag>
                <Tag color="#2db7f5">{`V${dataSource.versionNumber}`}</Tag>
              </Row>
            </Col>
          </Row>
        ) : (
          ''
        )}
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
                <h3>{intl.get(`appm.projectTemplate.view.message.panel.A`).d('基础信息')}</h3>
              </Fragment>
            }
          >
            <Form>
              <Row>
                <Col span={7}>
                  <Form.Item
                    label={intl.get(`${prefix}.templateCode`).d('模板编码')}
                    {...formLayout}
                  >
                    {getFieldDecorator('proTemplateCode', {
                      initialValue: dataSource.proTemplateCode,
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: intl.get(`${prefix}.templateCode`).d('模板编码'),
                          }),
                        },
                      ],
                    })(<Input trim disabled={!isNew} inputChinese={false} />)}
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    label={intl.get(`${prefix}.templateName`).d('模板名称')}
                    {...formLayout}
                  >
                    {getFieldDecorator('proTemplateName', {
                      initialValue: dataSource.proTemplateName,
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: intl.get(`${prefix}.templateName`).d('模板名称'),
                          }),
                        },
                      ],
                    })(<Input disabled={dataSource.proTemplateStatus !== 'PRESET'} />)}
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item label={intl.get(`${prefix}.proType`).d('项目类型')} {...formLayout}>
                    {getFieldDecorator('proTypeId', {
                      initialValue: dataSource.proTypeId,
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: intl.get(`${prefix}.proType`).d('项目类型'),
                          }),
                        },
                      ],
                    })(
                      <Lov
                        disabled={dataSource.proTemplateStatus !== 'PRESET'}
                        code="APPM.PROJECT_TYPE"
                        textValue={dataSource.proTypeName}
                        queryParams={{ organizationId: tenantId }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={7}>
                  <Form.Item label={intl.get(`${prefix}.uom`).d('工期单位')} {...formLayout}>
                    {getFieldDecorator('limitTimeUom', {
                      initialValue: dataSource.limitTimeUom,
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: intl.get(`${prefix}.uom`).d('工期单位'),
                          }),
                        },
                      ],
                    })(
                      <Select disabled={dataSource.proTemplateStatus !== 'PRESET'}>
                        {limitTimeUom.map(i => (
                          <Select.Option key={i.value}>{i.meaning}</Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item label={intl.get(`${prefix}`).d('是否考虑工作日')} {...formLayout}>
                    {getFieldDecorator('workdayFlag', {
                      initialValue: dataSource.workdayFlag,
                    })(<Switch disabled={dataSource.proTemplateStatus !== 'PRESET'} />)}
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item label={intl.get(`${prefix}`).d('是否启用')} {...formLayout}>
                    {getFieldDecorator('enabledFlag', {
                      initialValue: dataSource.enabledFlag,
                      rules: [],
                    })(
                      <Switch
                        disabled={
                          dataSource.proTemplateStatus === 'HISTORY' ||
                          dataSource.approveStatus === 'APPROVING'
                        }
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={7}>
                  <Form.Item
                    label={intl.get(`${prefix}.attributeSet`).d('项目属性组')}
                    {...formLayout}
                  >
                    {getFieldDecorator('attributeSetId', {
                      initialValue: dataSource.attributeSetId,
                    })(
                      <Lov
                        disabled={dataSource.proTemplateStatus !== 'PRESET'}
                        code="APPM.ATTRIBUTE_SET"
                        textValue={dataSource.attributeSetName}
                        queryParams={{ organizationId: tenantId }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    label={intl.get(`${prefix}.approveStatus`).d('审核状态')}
                    {...formLayout}
                  >
                    {getFieldDecorator('approveStatusMeaning', {
                      initialValue: dataSource.approveStatusMeaning,
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={14}>
                  <Form.Item label={intl.get(`${prefix}.versionDes`).d('版本概述')} {...longLayout}>
                    {getFieldDecorator('versionDes', {
                      initialValue: dataSource.versionDes,
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: intl.get(`${prefix}.versionDes`).d('版本概述'),
                          }),
                        },
                      ],
                    })(<Input disabled={dataSource.proTemplateStatus !== 'PRESET'} />)}
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
                <h3>{intl.get(`appm.projectTemplate.view.message.panel.B`).d('项目组织')}</h3>
              </Fragment>
            }
          >
            <Form>
              <Row>
                <Col span={7}>
                  <Form.Item label={intl.get(`${prefix}.pmoRoleId`).d('项目PMO')} {...formLayout}>
                    {getFieldDecorator('pmoRoleId', {
                      initialValue: isNew ? '' : String(dataSource.pmoRoleId),
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: intl.get(`${prefix}.pmoRoleId`).d('项目PMO'),
                          }),
                        },
                      ],
                    })(
                      <Select
                        disabled={dataSource.proTemplateStatus !== 'PRESET'}
                        placeholder=""
                        style={{ width: '100%' }}
                      >
                        {pmoRole.map(i => (
                          <Select.Option key={i.value}>{i.meaning}</Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    label={intl.get(`${prefix}.picRoleId`).d('项目负责人')}
                    {...formLayout}
                  >
                    {getFieldDecorator('picRoleId', {
                      initialValue: isNew ? '' : String(dataSource.picRoleId),
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: intl.get(`${prefix}.picRoleId`).d('项目负责人'),
                          }),
                        },
                      ],
                    })(
                      <Select
                        disabled={dataSource.proTemplateStatus !== 'PRESET'}
                        placeholder=""
                        style={{ width: '100%' }}
                      >
                        {proManageRole.map(i => (
                          <Select.Option key={i.value}>{i.meaning}</Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={14}>
                  <Form.Item
                    label={intl.get(`${prefix}.otherRoles`).d('项目参与人')}
                    {...longLayout}
                  >
                    {getFieldDecorator('otherRoles', {
                      initialValue: dataSource.otherRoles,
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: intl.get(`${prefix}.otherRoles`).d('项目参与人'),
                          }),
                        },
                      ],
                    })(
                      <Select
                        disabled={dataSource.proTemplateStatus !== 'PRESET'}
                        mode="multiple"
                        placeholder=""
                        style={{ width: '100%' }}
                      >
                        {projectRole.map(i => (
                          <Select.Option key={i.value}>{i.meaning}</Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={14}>
                  <Form.Item label={intl.get(`${prefix}.description`).d('备注')} {...longLayout}>
                    {getFieldDecorator('description', {
                      initialValue: dataSource.description,
                    })(
                      <Input.TextArea
                        rows={3}
                        disabled={dataSource.proTemplateStatus !== 'PRESET'}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Collapse.Panel>
        </Collapse>
      </React.Fragment>
    );
  }
}
export default InfoExhibit;
