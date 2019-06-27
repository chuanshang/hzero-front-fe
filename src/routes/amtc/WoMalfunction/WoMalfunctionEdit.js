import React, { Component, Fragment } from 'react';
import { Collapse, Form, Input, Row, Col, Icon, DatePicker, Button } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { getDateTimeFormat } from 'utils/utils';
import moment from 'moment';
import { EDIT_FORM_ITEM_LAYOUT, EDIT_FORM_ROW_LAYOUT, FORM_COL_3_LAYOUT } from 'utils/constants';
import { Bind } from 'lodash-decorators';

@Form.create({ fieldNameProp: null })
class WoMalfunctionEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseKeys: ['A'],
    };
  }
  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }
  /**
   * 保存
   */
  @Bind()
  handleSave() {
    const { form, dataSource, onConfirmlLine } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onConfirmlLine({ ...dataSource, ...values });
      }
    });
  }
  render() {
    const commonPromptCode = 'amtc.woMalfunction.model.WoMalfunctionEdit';
    const { woId, woName, tenantId, dataSource = {}, form, onCancelLine } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    const { collapseKeys = [] } = this.state;
    return (
      <React.Fragment>
        <Row style={{ margin: '10px' }}>
          <Button
            icon="save"
            style={{ marginRight: '10px' }}
            type="primary"
            onClick={this.handleSave}
          >
            {intl.get(`amtc.woMalfunction.view.button.save`).d('保存')}
          </Button>
          <Button style={{ marginRight: '10px' }} type="default" onClick={onCancelLine}>
            {intl.get(`amtc.woMalfunction.view.button.cancel`).d('取消')}
          </Button>
        </Row>
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
                <h3>{intl.get(`${commonPromptCode}.panel.A`).d('基础信息')}</h3>
              </Fragment>
            }
          >
            <Form>
              <Row {...EDIT_FORM_ROW_LAYOUT}>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.woName`).d('关联工单')}
                    {...EDIT_FORM_ITEM_LAYOUT}
                  >
                    {<span>{woName}</span>}
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.woop`).d('工单任务')}
                    {...EDIT_FORM_ITEM_LAYOUT}
                  >
                    {getFieldDecorator('woopId', {
                      initialValue: dataSource.woopId,
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: intl.get(`${commonPromptCode}.woop`).d('工单任务'),
                          }),
                        },
                      ],
                    })(
                      <Lov
                        code="AMTC.WOOP"
                        textValue={dataSource.woopMeaning}
                        queryParams={{ tenantId, woId }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.asset`).d('设备/资产')}
                    {...EDIT_FORM_ITEM_LAYOUT}
                  >
                    {getFieldDecorator('assetId', {
                      initialValue: dataSource.assetId,
                    })(
                      <Lov
                        code="AAFM.ASSETS"
                        textValue={dataSource.assetMeaning}
                        queryParams={{ tenantId }}
                        onChange={() => {
                          setFieldsValue({
                            rcAssesmentId: null,
                            partCodeId: null,
                            riskCodeId: null,
                            causeCodeId: null,
                            remedyCodeId: null,
                          });
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row {...EDIT_FORM_ROW_LAYOUT}>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.rcAssesment`).d('故障/缺陷目录')}
                    {...EDIT_FORM_ITEM_LAYOUT}
                  >
                    {getFieldDecorator('rcAssesmentId', {
                      initialValue: dataSource.rcAssesmentId,
                    })(
                      <Lov
                        disabled={!getFieldValue('assetId')}
                        code="AMTC.FAULT_EVALUATE"
                        textValue={dataSource.rcAssesmentMeaning}
                        queryParams={{ tenantId, assetId: getFieldValue('assetId') }}
                        onChange={() => {
                          setFieldsValue({
                            partCodeId: null,
                            riskCodeId: null,
                            causeCodeId: null,
                            remedyCodeId: null,
                          });
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.partCode`).d('设备/缺陷部位')}
                    {...EDIT_FORM_ITEM_LAYOUT}
                  >
                    {getFieldDecorator('partCodeId', {
                      initialValue: dataSource.partCodeId,
                    })(
                      <Lov
                        disabled={!getFieldValue('rcAssesmentId')}
                        code="AMTC.ASMT_CODES"
                        textValue={dataSource.partCodeMeaning}
                        queryParams={{
                          tenantId,
                          rcAssesmentId: getFieldValue('rcAssesmentId'),
                          basicTypeCodeList: 'PART',
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.riskCode`).d('设备/缺陷现象')}
                    {...EDIT_FORM_ITEM_LAYOUT}
                  >
                    {getFieldDecorator('riskCodeId', {
                      initialValue: dataSource.riskCodeId,
                    })(
                      <Lov
                        disabled={!getFieldValue('rcAssesmentId')}
                        code="AMTC.ASMT_CODES"
                        textValue={dataSource.riskCodeMeaning}
                        queryParams={{
                          tenantId,
                          rcAssesmentId: getFieldValue('rcAssesmentId'),
                          basicTypeCodeList: 'RISK',
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row {...EDIT_FORM_ROW_LAYOUT}>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.causeCode`).d('设备/缺陷原因')}
                    {...EDIT_FORM_ITEM_LAYOUT}
                  >
                    {getFieldDecorator('causeCodeId', {
                      initialValue: dataSource.causeCodeId,
                    })(
                      <Lov
                        disabled={!getFieldValue('rcAssesmentId')}
                        code="AMTC.ASMT_CODES"
                        textValue={dataSource.causeCodeMeaning}
                        queryParams={{
                          tenantId,
                          rcAssesmentId: getFieldValue('rcAssesmentId'),
                          basicTypeCodeList: 'CAUSE',
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.remedyCode`).d('设备/缺陷处理办法')}
                    {...EDIT_FORM_ITEM_LAYOUT}
                  >
                    {getFieldDecorator('remedyCodeId', {
                      initialValue: dataSource.remedyCodeId,
                    })(
                      <Lov
                        disabled={!getFieldValue('rcAssesmentId')}
                        code="AMTC.ASMT_CODES"
                        textValue={dataSource.remedyCodeMeaning}
                        queryParams={{
                          tenantId,
                          rcAssesmentId: getFieldValue('rcAssesmentId'),
                          basicTypeCodeList: 'REMEDY,CONTROL',
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.malfunctionTime`).d('设备/缺陷时间')}
                    {...EDIT_FORM_ITEM_LAYOUT}
                  >
                    {getFieldDecorator('malfunctionTime', {
                      initialValue: dataSource.malfunctionTime
                        ? moment(dataSource.malfunctionTime, getDateTimeFormat())
                        : null,
                    })(<DatePicker format={getDateTimeFormat()} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row {...EDIT_FORM_ROW_LAYOUT}>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.description`).d('解决方法描述')}
                    {...EDIT_FORM_ITEM_LAYOUT}
                  >
                    {getFieldDecorator('description', {
                      initialValue: dataSource.description,
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    label={intl.get(`${commonPromptCode}.remark`).d('记录备注')}
                    {...EDIT_FORM_ITEM_LAYOUT}
                  >
                    {getFieldDecorator('remark', {
                      initialValue: dataSource.remark,
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
      </React.Fragment>
    );
  }
}
export default WoMalfunctionEdit;
