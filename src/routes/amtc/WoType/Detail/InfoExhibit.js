import React, { Component, Fragment } from 'react';
import { Form, Row, Col, Input, Select, Collapse, Icon, Button, InputNumber } from 'hzero-ui';
import intl from 'utils/intl';
import Switch from 'components/Switch';
import LazyLoadMenuIcon from '@/components/LazyLoadMenuIcon';
import Lov from 'components/Lov';
import { isEmpty } from 'lodash';
import { yesOrNoRender } from 'utils/renderer';
import {
  EDIT_FORM_ITEM_LAYOUT,
  EDIT_FORM_ROW_LAYOUT,
  FORM_COL_3_LAYOUT,
  EDIT_FORM_ITEM_LAYOUT_COL_3,
} from 'utils/constants';

const viewButtonPrompt = 'hiam.menuConfig.view.button';

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
    const { onRefresh } = this.props;
    onRefresh();
  }

  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }

  render() {
    const commonPromptCode = 'amtc.woType.model.woType';
    const {
      isNew,
      editFlag,
      tenantId,
      orderPlanStatusMap,
      orderCompletionRuleMap,
      needToOperatorMap,
      needToCloseMap,
      isNeedMap,
      inputTypeMap,
      verifyEnabledMap,
      mustBeProvidedMap,
      detailInfo,
      form: { getFieldDecorator, getFieldValue = e => e },
      handleOpenIconModal = e => e,
    } = this.props;
    const { collapseKeys = [] } = this.state;
    return (
      <Collapse
        bordered={false}
        defaultActiveKey={['A']}
        className="form-collapse"
        onChange={this.handleChangeKey.bind(this)}
      >
        <Collapse.Panel
          showArrow={false}
          key="A"
          header={
            <Fragment>
              <h3 style={collapseKeys.includes('A') ? {} : { color: 'rgba(0,0,0,.25)' }}>
                {intl.get(`${commonPromptCode}.panel.A`).d('基本信息')}
              </h3>
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
            <Row
              {...EDIT_FORM_ROW_LAYOUT}
              className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
            >
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.longName`).d('事件完整名称')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('longName', {
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: intl.get(`${commonPromptCode}.longName`).d('事件完整名称'),
                          }),
                        },
                        {
                          max: 240,
                          message: intl.get('hzero.common.validation.max', {
                            max: 240,
                          }),
                        },
                      ],
                      initialValue: detailInfo.longName,
                    })(<Input />)
                  ) : (
                    <span>{detailInfo.longName}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.shortName`).d('事件短名称')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('shortName', {
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: intl.get(`${commonPromptCode}.shortName`).d('事件短名称'),
                          }),
                        },
                        {
                          max: 240,
                          message: intl.get('hzero.common.validation.max', {
                            max: 240,
                          }),
                        },
                      ],
                      initialValue: detailInfo.shortName,
                    })(<Input />)
                  ) : (
                    <span>{detailInfo.shortName}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.assetSpecialtyId`).d('资产专业')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('assetSpecialtyId', {
                      initialValue: detailInfo.assetSpecialtyId,
                    })(
                      <Lov
                        code="AAFM.SPECIAL_ASSET_CLASS"
                        queryParams={{ organizationId: tenantId }}
                        textValue={detailInfo.assetSpecialtyName}
                      />
                    )
                  ) : (
                    <span>{detailInfo.assetSpecialtyName}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row
              {...EDIT_FORM_ROW_LAYOUT}
              className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
            >
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.pdfTemplateId`).d('PDF单据模板格式')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('pdfTemplateId', {
                      initialValue: detailInfo.pdfTemplateId,
                    })(
                      <Lov
                        code=""
                        queryParams={{ organizationId: tenantId }}
                        textValue={detailInfo.pdfTemplateName}
                      />
                    )
                  ) : (
                    <span>{detailInfo.pdfTemplateName}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.icon`).d('图标')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('icon', {
                      initialValue: detailInfo.icon || 'setting',
                    })(
                      <Button onClick={handleOpenIconModal}>
                        {isEmpty(getFieldValue('icon')) ? (
                          intl.get(`${viewButtonPrompt}.button.selectIcons`).d('选择图标')
                        ) : (
                          <LazyLoadMenuIcon
                            code={getFieldValue('icon')}
                            placeholder={intl
                              .get(`${viewButtonPrompt}.button.selectIcons`)
                              .d('选择图标')}
                          />
                        )}
                      </Button>
                    )
                  ) : (
                    <LazyLoadMenuIcon
                      code={detailInfo.icon}
                      placeholder={intl.get(`${viewButtonPrompt}.button.selectIcons`).d('选择图标')}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row
              {...EDIT_FORM_ROW_LAYOUT}
              className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
            >
              <Col span={22}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.description`).d('描述')}
                  {...EDIT_FORM_ITEM_LAYOUT_COL_3}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('description', {
                      initialValue: detailInfo.description,
                    })(<Input.TextArea rows={3} />)
                  ) : (
                    <span>{detailInfo.description}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row
              {...EDIT_FORM_ROW_LAYOUT}
              className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
            >
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.woTypeCode`).d('代码')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('woTypeCode', {
                      rules: [],
                      initialValue: detailInfo.woTypeCode,
                    })(<Input />)
                  ) : (
                    <span>{detailInfo.woTypeCode}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.org`).d('限定适用组织')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('orgId', {
                      initialValue: detailInfo.orgId,
                    })(
                      <Lov
                        code="AMDM.ORGANIZATION"
                        queryParams={{ organizationId: tenantId }}
                        textValue={detailInfo.orgName}
                      />
                    )
                  ) : (
                    <span>{detailInfo.orgName}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.tag`).d('标记')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('tag', {
                      rules: [],
                      initialValue: detailInfo.tag,
                    })(<Input />)
                  ) : (
                    <span>{detailInfo.tag}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row
              {...EDIT_FORM_ROW_LAYOUT}
              className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
            >
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.defassetStatus`).d('事件默认更新资产状态')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('defassetStatusId', {
                      initialValue: detailInfo.defassetStatusId,
                    })(
                      <Lov
                        code="AAFM.ASSET_STATUS"
                        queryParams={{ organizationId: tenantId }}
                        textValue={detailInfo.defassetStatusName}
                      />
                    )
                  ) : (
                    <span>{detailInfo.defassetStatusName}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.cmplassetStatus`).d('完成默认更新资产状态')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('cmplassetStatusId', {
                      initialValue: detailInfo.cmplassetStatusId,
                    })(
                      <Lov
                        code="AAFM.ASSET_STATUS"
                        queryParams={{ organizationId: tenantId }}
                        textValue={detailInfo.cmplassetStatusName}
                      />
                    )
                  ) : (
                    <span>{detailInfo.cmplassetStatusName}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl
                    .get(`${commonPromptCode}.avalibleassetStatus`)
                    .d('完成后的资产状态范围')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('avalibleassetStatus', {
                      rules: [],
                      initialValue: detailInfo.avalibleassetStatus,
                    })(<Input />)
                  ) : (
                    <span>{detailInfo.avalibleassetStatus}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row
              {...EDIT_FORM_ROW_LAYOUT}
              className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
            >
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.approvalFlowFlag`).d('需要审批流')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('approvalFlowFlag', {
                      initialValue: detailInfo.approvalFlowFlag,
                    })(<Switch />)
                  ) : (
                    <span>{yesOrNoRender(detailInfo.approvalFlowFlag)}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.checkGroupFlag`).d('可重复添加标准检查组')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('checkGroupFlag', {
                      initialValue: detailInfo.checkGroupFlag,
                    })(<Switch />)
                  ) : (
                    <span>{yesOrNoRender(detailInfo.checkGroupFlag)}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.parentType`).d('父工单类型')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('parentTypeId', {
                      initialValue: detailInfo.parentTypeId,
                    })(
                      <Lov
                        disabled
                        code=""
                        queryParams={{ organizationId: tenantId }}
                        textValue={detailInfo.parentTypeName}
                      />
                    )
                  ) : (
                    <span>{detailInfo.parentTypeName}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row
              {...EDIT_FORM_ROW_LAYOUT}
              className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
            >
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl
                    .get(`${commonPromptCode}.manualcreateEnableFlag`)
                    .d('允许直接手工创建当前类型')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('manualcreateEnableFlag', {
                      initialValue: detailInfo.manualcreateEnableFlag,
                    })(<Switch />)
                  ) : (
                    <span>{yesOrNoRender(detailInfo.manualcreateEnableFlag)}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.enabledFlag`).d('是否启用')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('enabledFlag', {
                      initialValue: detailInfo.enabledFlag,
                    })(<Switch />)
                  ) : (
                    <span>{yesOrNoRender(detailInfo.enabledFlag)}</span>
                  )}
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
              <h3 style={collapseKeys.includes('B') ? {} : { color: 'rgba(0,0,0,.25)' }}>
                {intl.get(`${commonPromptCode}.functionAttribute`).d('功能性属性')}
              </h3>
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
            <Row
              {...EDIT_FORM_ROW_LAYOUT}
              className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
            >
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.failureRequiredFlag`).d('需要故障/缺陷登记')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('failureRequiredFlag', {
                      initialValue: detailInfo.failureRequiredFlag,
                    })(<Switch />)
                  ) : (
                    <span>{yesOrNoRender(detailInfo.failureRequiredFlag)}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.sourceFlag`).d('需要显示工作单的来源/事件')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('sourceFlag', {
                      initialValue: detailInfo.sourceFlag,
                    })(<Switch />)
                  ) : (
                    <span>{yesOrNoRender(detailInfo.sourceFlag)}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.linesFlag`).d('需要显示工作单的工作对象行')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('linesFlag', {
                      initialValue: detailInfo.linesFlag,
                    })(<Switch />)
                  ) : (
                    <span>{yesOrNoRender(detailInfo.linesFlag)}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row
              {...EDIT_FORM_ROW_LAYOUT}
              className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
            >
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.checklistsFlag`).d('需要显示工作单的检查项')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('checklistsFlag', {
                      initialValue: detailInfo.checklistsFlag,
                    })(<Switch />)
                  ) : (
                    <span>{yesOrNoRender(detailInfo.checklistsFlag)}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.outsourceFlag`).d('需要显示工作单的外购')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('outsourceFlag', {
                      initialValue: detailInfo.outsourceFlag,
                    })(<Switch />)
                  ) : (
                    <span>{yesOrNoRender(detailInfo.outsourceFlag)}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.toolsFlag`).d('需要显示工作单的工器具')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('toolsFlag', {
                      initialValue: detailInfo.toolsFlag,
                    })(<Switch />)
                  ) : (
                    <span>{yesOrNoRender(detailInfo.toolsFlag)}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row
              {...EDIT_FORM_ROW_LAYOUT}
              className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
            >
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl
                    .get(`${commonPromptCode}.workcenterPeopleFlag`)
                    .d('需要显示工作单的人员')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('workcenterPeopleFlag', {
                      initialValue: detailInfo.workcenterPeopleFlag,
                    })(<Switch />)
                  ) : (
                    <span>{yesOrNoRender(detailInfo.workcenterPeopleFlag)}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.itemsFlag`).d('需要显示工作单的备件耗材')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('itemsFlag', {
                      initialValue: detailInfo.itemsFlag,
                    })(<Switch />)
                  ) : (
                    <span>{yesOrNoRender(detailInfo.itemsFlag)}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.costFlag`).d('需要显示工作单的成本信息')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('costFlag', {
                      initialValue: detailInfo.costFlag,
                    })(<Switch />)
                  ) : (
                    <span>{yesOrNoRender(detailInfo.costFlag)}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row
              {...EDIT_FORM_ROW_LAYOUT}
              className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
            >
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.repairTypeFlag`).d('需要显示维修类型')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('repairTypeFlag', {
                      initialValue: detailInfo.repairTypeFlag,
                    })(<Switch />)
                  ) : (
                    <span>{yesOrNoRender(detailInfo.repairTypeFlag)}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl
                    .get(`${commonPromptCode}.woopCompletedFlag`)
                    .d('完工前所有工序都需要完工')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('woopCompletedFlag', {
                      initialValue: detailInfo.woopCompletedFlag,
                    })(<Switch />)
                  ) : (
                    <span>{yesOrNoRender(detailInfo.woopCompletedFlag)}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl
                    .get(`${commonPromptCode}.defaultWoopownerFlag`)
                    .d('将工单负责人默认给首个任务')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('defaultWoopownerFlag', {
                      initialValue: detailInfo.defaultWoopownerFlag,
                    })(<Switch />)
                  ) : (
                    <span>{yesOrNoRender(detailInfo.defaultWoopownerFlag)}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row
              {...EDIT_FORM_ROW_LAYOUT}
              className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
            >
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.enableOrgFlag`).d('需要指定需求组织/客户')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('enableOrgFlag', {
                      initialValue: detailInfo.enableOrgFlag,
                    })(<Switch />)
                  ) : (
                    <span>{yesOrNoRender(detailInfo.enableOrgFlag)}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl
                    .get(`${commonPromptCode}.checklistCreatewoFlag`)
                    .d('是否启用检查项创建工作单')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('checklistCreatewoFlag', {
                      initialValue: detailInfo.checklistCreatewoFlag,
                    })(<Switch />)
                  ) : (
                    <span>{yesOrNoRender(detailInfo.checklistCreatewoFlag)}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl
                    .get(`${commonPromptCode}.woopOwnergroupFlag`)
                    .d('自定义工单工序负责人组')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('woopOwnergroupFlag', {
                      initialValue: detailInfo.woopOwnergroupFlag,
                    })(<Switch />)
                  ) : (
                    <span>{yesOrNoRender(detailInfo.woopOwnergroupFlag)}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row
              {...EDIT_FORM_ROW_LAYOUT}
              className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
            >
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl
                    .get(`${commonPromptCode}.srChecklistsFlag`)
                    .d('需要显示服务申请的检查项')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('srChecklistsFlag', {
                      initialValue: detailInfo.srChecklistsFlag,
                    })(<Switch />)
                  ) : (
                    <span>{yesOrNoRender(detailInfo.srChecklistsFlag)}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.defaultAssessFlag`).d('是否启用默认评价')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('defaultAssessFlag', {
                      initialValue: detailInfo.defaultAssessFlag,
                    })(<Switch />)
                  ) : (
                    <span>{yesOrNoRender(detailInfo.defaultAssessFlag)}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.countingFlag`).d('是否启用盘点')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('countingFlag', {
                      initialValue: detailInfo.countingFlag,
                    })(<Switch />)
                  ) : (
                    <span>{yesOrNoRender(detailInfo.countingFlag)}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row
              {...EDIT_FORM_ROW_LAYOUT}
              className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
            >
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.enabledPdfFlag`).d('是否启用PDF模板')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('enabledPdfFlag', {
                      initialValue: detailInfo.enabledPdfFlag,
                    })(<Switch />)
                  ) : (
                    <span>{yesOrNoRender(detailInfo.enabledPdfFlag)}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.defaultAssessTime`).d('默认评价时间(小时)')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('defaultAssessTime', {
                      rules: [],
                      initialValue: detailInfo.defaultAssessTime,
                    })(<InputNumber />)
                  ) : (
                    <span>{detailInfo.defaultAssessTime}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.scheduleRequirmentStatus`).d('计划状态')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('scheduleRequirmentStatus', {
                      initialValue: detailInfo.scheduleRequirmentStatus,
                      rules: [],
                    })(
                      <Select>
                        {orderPlanStatusMap.map(i => (
                          <Select.Option key={i.value}>{i.meaning}</Select.Option>
                        ))}
                      </Select>
                    )
                  ) : (
                    <span>{detailInfo.scheduleRequirmentStatusMeaning}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row
              {...EDIT_FORM_ROW_LAYOUT}
              className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
            >
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.completionRuleCode`).d('工作单完成规则')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('completionRuleCode', {
                      initialValue: detailInfo.completionRuleCode,
                      rules: [],
                    })(
                      <Select>
                        {orderCompletionRuleMap.map(i => (
                          <Select.Option key={i.value}>{i.meaning}</Select.Option>
                        ))}
                      </Select>
                    )
                  ) : (
                    <span>{detailInfo.completionRuleCodeMeaning}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.startedScanCode`).d('开始工作前需扫码')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('startedScanCode', {
                      initialValue: detailInfo.startedScanCode,
                      rules: [],
                    })(
                      <Select>
                        {needToOperatorMap.map(i => (
                          <Select.Option key={i.value}>{i.meaning}</Select.Option>
                        ))}
                      </Select>
                    )
                  ) : (
                    <span>{detailInfo.startedScanCodeMeaning}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl
                    .get(`${commonPromptCode}.startedLocationCode`)
                    .d('开始工作前需人员定位')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('startedLocationCode', {
                      initialValue: detailInfo.startedLocationCode,
                      rules: [],
                    })(
                      <Select>
                        {needToOperatorMap.map(i => (
                          <Select.Option key={i.value}>{i.meaning}</Select.Option>
                        ))}
                      </Select>
                    )
                  ) : (
                    <span>{detailInfo.startedLocationCodeMeaning}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row
              {...EDIT_FORM_ROW_LAYOUT}
              className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
            >
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.startedNfcCode`).d('开始工作前需NFC签到')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('startedNfcCode', {
                      initialValue: detailInfo.startedNfcCode,
                      rules: [],
                    })(
                      <Select>
                        {needToOperatorMap.map(i => (
                          <Select.Option key={i.value}>{i.meaning}</Select.Option>
                        ))}
                      </Select>
                    )
                  ) : (
                    <span>{detailInfo.startedNfcCodeMeaning}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.startedPhotoCode`).d('开始工作前需拍照签到')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('startedPhotoCode', {
                      initialValue: detailInfo.startedPhotoCode,
                      rules: [],
                    })(
                      <Select>
                        {needToOperatorMap.map(i => (
                          <Select.Option key={i.value}>{i.meaning}</Select.Option>
                        ))}
                      </Select>
                    )
                  ) : (
                    <span>{detailInfo.startedPhotoCodeMeaning}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.finishModeCode`).d('事件关闭方式')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('finishModeCode', {
                      initialValue: detailInfo.finishModeCode,
                      rules: [],
                    })(
                      <Select>
                        {needToCloseMap.map(i => (
                          <Select.Option key={i.value}>{i.meaning}</Select.Option>
                        ))}
                      </Select>
                    )
                  ) : (
                    <span>{detailInfo.finishModeCodeMeaning}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row
              {...EDIT_FORM_ROW_LAYOUT}
              className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
            >
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.enableAssessCode`).d('是否启用服务评价')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('enableAssessCode', {
                      initialValue: detailInfo.enableAssessCode,
                      rules: [],
                    })(
                      <Select>
                        {isNeedMap.map(i => (
                          <Select.Option key={i.value}>{i.meaning}</Select.Option>
                        ))}
                      </Select>
                    )
                  ) : (
                    <span>{detailInfo.enableAssessCodeMeaning}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.defaultPriority`).d('计划优先级')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('defaultPriorityId', {
                      initialValue: detailInfo.defaultPriorityId,
                    })(
                      <Lov
                        code=""
                        queryParams={{ organizationId: tenantId }}
                        textValue={detailInfo.defaultPriorityName}
                      />
                    )
                  ) : (
                    <span>{detailInfo.defaultPriorityName}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.failureObject`).d('故障评估项')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('failureObjectId', {
                      initialValue: detailInfo.failureObjectId,
                    })(
                      <Lov
                        code=""
                        queryParams={{ organizationId: tenantId }}
                        textValue={detailInfo.failureObjectName}
                      />
                    )
                  ) : (
                    <span>{detailInfo.failureObjectName}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row
              {...EDIT_FORM_ROW_LAYOUT}
              className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
            >
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.checkAssetCode`).d('现场核实资产信息')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('checkAssetCode', {
                      initialValue: detailInfo.checkAssetCode,
                      rules: [],
                    })(
                      <Select>
                        {verifyEnabledMap.map(i => (
                          <Select.Option key={i.value}>{i.meaning}</Select.Option>
                        ))}
                      </Select>
                    )
                  ) : (
                    <span>{detailInfo.checkAssetCodeMeaning}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.providedObjectCode`).d('必须提供工作对象至')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('providedObjectCode', {
                      initialValue: detailInfo.providedObjectCode,
                      rules: [],
                    })(
                      <Select>
                        {mustBeProvidedMap.map(i => (
                          <Select.Option key={i.value}>{i.meaning}</Select.Option>
                        ))}
                      </Select>
                    )
                  ) : (
                    <span>{detailInfo.providedObjectCodeMeaning}</span>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.solutionTypeCode`).d('解决方式输入类型')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {isNew || editFlag ? (
                    getFieldDecorator('solutionTypeCode', {
                      initialValue: detailInfo.solutionTypeCode,
                      rules: [],
                    })(
                      <Select>
                        {inputTypeMap.map(i => (
                          <Select.Option key={i.value}>{i.meaning}</Select.Option>
                        ))}
                      </Select>
                    )
                  ) : (
                    <span>{detailInfo.solutionTypeCodeMeaning}</span>
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
export default InfoExhibit;
