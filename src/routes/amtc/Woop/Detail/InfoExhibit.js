import React, { Component, Fragment } from 'react';
import { Form, Row, Col, Input, Collapse, Icon, Select, DatePicker, InputNumber } from 'hzero-ui';
import intl from 'utils/intl';
import { isUndefined, isEmpty } from 'lodash';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import Switch from 'components/Switch';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { getDateTimeFormat } from 'utils/utils';
import moment from 'moment';

@Form.create({ fieldNameProp: null })
class InfoExhibit extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      collapseKeys: ['A', 'B', 'C', 'D', 'E'],
    };
  }

  componentDidMount() {
    const { onRefresh } = this.props;
    onRefresh();
  }

  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }

  // 弹出日历
  @Bind()
  onOpenPlanChange(status) {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    if (status) {
      setFieldsValue({
        schedualedFinishDate: getFieldValue('schedualedStartDate'),
      });
    }
  }

  // 弹出日历
  @Bind()
  onOpenTargetChange(status) {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    if (status) {
      setFieldsValue({
        targetFinishDate: getFieldValue('targetStartDate'),
      });
    }
  }

  // 弹出日历
  @Bind()
  onOpenBestChange(status) {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    if (status) {
      setFieldsValue({
        BestEndDate: getFieldValue('BestStartDate'),
      });
    }
  }

  // 弹出日历
  @Bind()
  onOpenActualChange(status) {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    if (status) {
      setFieldsValue({
        schedualedFinishDate: getFieldValue('actualStartDate'),
      });
    }
  }

  render() {
    const commonPromptCode = 'amtc.woop.model.woop';
    const {
      dataSource,
      woopStatusMap,
      durationUnitMap,
      workOrderDetail,
      form: { getFieldDecorator, getFieldValue },
      tenantId,
    } = this.props;
    const { collapseKeys = [] } = this.state;
    const formLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const longFormLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <Collapse
        bordered={false}
        defaultActiveKey={['A', 'B', 'C', 'D', 'E']}
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
            <Row>
              <Col span={8}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.woopShortName`).d('工单任务名称')}
                  {...formLayout}
                >
                  {getFieldDecorator('woopShortName', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonPromptCode}.woopShortName`).d('工单任务名称'),
                        }),
                      },
                    ],
                    initialValue: dataSource.woopShortName,
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`${commonPromptCode}.parentWoopName`).d('父任务')}
                  {...formLayout}
                >
                  {getFieldDecorator('parentWoopId', {
                    initialValue: dataSource.parentWoopId,
                    rules: [],
                  })(
                    <Lov
                      code="AMTC.WORKPROCESS"
                      queryParams={{ tenantId }}
                      textValue={dataSource.parentWoopName}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`${commonPromptCode}.woopNum`).d('任务编号')}
                  {...formLayout}
                >
                  {getFieldDecorator('woopNum', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonPromptCode}.woopNum`).d('任务编号'),
                        }),
                      },
                    ],
                    initialValue: dataSource.woopNum,
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.woNum`).d('工单概述')}
                  {...formLayout}
                >
                  {getFieldDecorator('woNum', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonPromptCode}.woNum`).d('工单概述'),
                        }),
                      },
                    ],
                    initialValue: dataSource.woopNum,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`${commonPromptCode}.woopStatus`).d('状态')}
                  {...formLayout}
                >
                  {getFieldDecorator('woopStatus', {
                    initialValue: dataSource.woopStatus,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonPromptCode}.woopStatus`).d('状态'),
                        }),
                      },
                    ],
                  })(
                    <Select>
                      {woopStatusMap.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`${commonPromptCode}.waitingOwnerFlag`).d('小组内自行认领任务')}
                  {...formLayout}
                >
                  {getFieldDecorator('waitingOwnerFlag', {
                    initialValue: isUndefined(dataSource.waitingOwnerFlag)
                      ? 1
                      : dataSource.waitingOwnerFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.ownerGroupId`).d('负责人组')}
                  {...formLayout}
                >
                  {getFieldDecorator('ownerGroupId', {
                    initialValue: dataSource.ownerGroupId,
                    rules: [],
                  })(
                    <Lov
                      disabled={!isEmpty(workOrderDetail) && workOrderDetail.woStatus !== 'DRAFT'}
                      code="AMTC.SKILLTYPES"
                      queryParams={{ tenantId }}
                      textValue={dataSource.ownerGroupName}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`${commonPromptCode}.ownerId`).d('负责人')}
                  {...formLayout}
                >
                  {getFieldDecorator('ownerId', {
                    initialValue: dataSource.ownerId,
                    rules: [],
                  })(
                    <Lov
                      disabled={!isEmpty(workOrderDetail) && workOrderDetail.woStatus !== 'DRAFT'}
                      code="AMTC.WORKCENTER_PRINCIPAL"
                      queryParams={{ tenantId }}
                      textValue={dataSource.ownerName}
                    />
                  )}
                </Form.Item>
              </Col>

              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`${commonPromptCode}.workorderType`).d('工单类型')}
                  {...formLayout}
                >
                  {getFieldDecorator('workorderTypeName', {
                    initialValue: dataSource.workorderTypeName,
                    rules: [],
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.description`).d('描述')}
                  {...longFormLayout}
                >
                  {getFieldDecorator('description', {
                    initialValue: dataSource.description,
                  })(<Input.TextArea rows={3} />)}
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
              <h3>{intl.get(`${commonPromptCode}.panel.B`).d('计划与排程信息')}</h3>
            </Fragment>
          }
        >
          <Form>
            <Row>
              <Col span={8}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.schedualedStartDate`).d('计划开始时间')}
                  {...formLayout}
                >
                  {getFieldDecorator('schedualedStartDate', {
                    initialValue: dataSource.schedualedStartDate
                      ? moment(dataSource.schedualedStartDate, DEFAULT_DATETIME_FORMAT)
                      : null,
                  })(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateTimeFormat()}
                      showTime
                      disabledDate={currentDate =>
                        getFieldValue('schedualedFinishDate') &&
                        moment(getFieldValue('schedualedFinishDate')).isBefore(
                          currentDate,
                          'second'
                        )
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`${commonPromptCode}.schedualedFinishDate`).d('计划完成时间')}
                  {...formLayout}
                >
                  {getFieldDecorator('schedualedFinishDate', {
                    initialValue: dataSource.schedualedFinishDate
                      ? moment(dataSource.schedualedFinishDate, DEFAULT_DATETIME_FORMAT)
                      : null,
                  })(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateTimeFormat()}
                      showTime
                      onOpenChange={this.onOpenPlanChange}
                      disabledDate={currentDate =>
                        getFieldValue('schedualedStartDate') &&
                        moment(getFieldValue('schedualedStartDate')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`${commonPromptCode}.targetStartDate`).d('目标开始日期')}
                  {...formLayout}
                >
                  {getFieldDecorator('targetStartDate', {
                    initialValue: dataSource.targetStartDate
                      ? moment(dataSource.targetStartDate, DEFAULT_DATETIME_FORMAT)
                      : null,
                  })(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateTimeFormat()}
                      showTime
                      disabledDate={currentDate =>
                        getFieldValue('targetFinishDate') &&
                        moment(getFieldValue('targetFinishDate')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.startNotearlierDate`).d('最早开始时间')}
                  {...formLayout}
                >
                  {getFieldDecorator('startNotearlierDate', {
                    initialValue: dataSource.startNotearlierDate
                      ? moment(dataSource.startNotearlierDate, DEFAULT_DATETIME_FORMAT)
                      : null,
                  })(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateTimeFormat()}
                      showTime
                      disabledDate={currentDate =>
                        getFieldValue('finishNotlaterDate') &&
                        moment(getFieldValue('finishNotlaterDate')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`${commonPromptCode}.finishNotlaterDate`).d('最晚完成时间')}
                  {...formLayout}
                >
                  {getFieldDecorator('finishNotlaterDate', {
                    initialValue: dataSource.finishNotlaterDate
                      ? moment(dataSource.finishNotlaterDate, DEFAULT_DATETIME_FORMAT)
                      : null,
                  })(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateTimeFormat()}
                      showTime
                      onOpenChange={this.onOpenBestChange}
                      disabledDate={currentDate =>
                        getFieldValue('startNotearlierDate') &&
                        moment(getFieldValue('startNotearlierDate')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`${commonPromptCode}.targetFinishDate`).d('目标完成日期')}
                  {...formLayout}
                >
                  {getFieldDecorator('targetFinishDate', {
                    initialValue: dataSource.targetFinishDate
                      ? moment(dataSource.targetFinishDate, DEFAULT_DATETIME_FORMAT)
                      : null,
                  })(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateTimeFormat()}
                      showTime
                      onOpenChange={this.onOpenTargetChange}
                      disabledDate={currentDate =>
                        getFieldValue('targetStartDate') &&
                        moment(getFieldValue('targetStartDate')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.durationSchedualed`).d('计划时长')}
                  {...formLayout}
                >
                  {getFieldDecorator('durationSchedualed', {
                    initialValue: dataSource.durationSchedualed,
                    rules: [],
                  })(<InputNumber />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`${commonPromptCode}.durationUom`).d('工期单位')}
                  {...formLayout}
                >
                  {getFieldDecorator('durationUom', {
                    initialValue: dataSource.durationUom,
                    rules: [],
                  })(
                    <Select>
                      {durationUnitMap.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`${commonPromptCode}.planFixed`).d('计划已确认')}
                  {...formLayout}
                >
                  {getFieldDecorator('planFixed', {
                    initialValue: dataSource.planFixed,
                  })(<Switch />)}
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
              <Icon type={collapseKeys.includes('C') ? 'minus' : 'plus'} />
              <h3>{intl.get(`${commonPromptCode}.panel.C`).d('实际执行')}</h3>
            </Fragment>
          }
        >
          <Form>
            <Row>
              <Col span={8}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.actualStartDate`).d('实际开始时间')}
                  {...formLayout}
                >
                  {getFieldDecorator('actualStartDate', {
                    initialValue: dataSource.actualStartDate
                      ? moment(dataSource.actualStartDate, DEFAULT_DATETIME_FORMAT)
                      : null,
                  })(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateTimeFormat()}
                      showTime
                      disabledDate={currentDate =>
                        getFieldValue('actualFinishDate') &&
                        moment(getFieldValue('actualFinishDate')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`${commonPromptCode}.actualFinishDate`).d('实际完成时间')}
                  {...formLayout}
                >
                  {getFieldDecorator('actualFinishDate', {
                    initialValue: dataSource.actualFinishDate
                      ? moment(dataSource.actualFinishDate, DEFAULT_DATETIME_FORMAT)
                      : null,
                  })(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateTimeFormat()}
                      showTime
                      onOpenChange={this.onOpenActualChange}
                      disabledDate={currentDate =>
                        getFieldValue('actualStartDate') &&
                        moment(getFieldValue('actualStartDate')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`${commonPromptCode}.durationActual`).d('实际工期')}
                  {...formLayout}
                >
                  {getFieldDecorator('durationActual', {
                    initialValue: dataSource.durationActual,
                    rules: [],
                  })(<InputNumber />)}
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
              <Icon type={collapseKeys.includes('D') ? 'minus' : 'plus'} />
              <h3>{intl.get(`${commonPromptCode}.panel.D`).d('工作对象')}</h3>
            </Fragment>
          }
        >
          <Form>
            <Row>
              <Col span={8}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.assetLocationId`).d('位置')}
                  {...formLayout}
                >
                  {getFieldDecorator('assetLocationId', {
                    initialValue: dataSource.assetLocationId,
                    rules: [],
                  })(
                    <Lov
                      code="AMDM.LOCATIONS"
                      queryParams={{ organizationId: tenantId }}
                      textValue={dataSource.assetLocationName}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`${commonPromptCode}.assetId`).d('设备/资产')}
                  {...formLayout}
                >
                  {getFieldDecorator('assetId', {
                    initialValue: dataSource.assetId,
                    rules: [],
                  })(
                    <Lov
                      code="AAFM.ASSETS"
                      queryParams={{ tenantId }}
                      textValue={dataSource.assetName}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Collapse.Panel>
        <Collapse.Panel
          showArrow={false}
          key="E"
          header={
            <Fragment>
              <Icon type={collapseKeys.includes('E') ? 'minus' : 'plus'} />
              <h3>{intl.get(`${commonPromptCode}.panel.E`).d('后续任务')}</h3>
            </Fragment>
          }
        >
          <Form>
            <Row>
              <Col span={8}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.flownoSeq`).d('序号')}
                  {...formLayout}
                >
                  {getFieldDecorator('flownoSeq', {
                    initialValue: dataSource.flownoSeq,
                    rules: [],
                  })(<InputNumber />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`${commonPromptCode}.fllowupTask`).d('后续任务')}
                  {...formLayout}
                >
                  {getFieldDecorator('fllowupTask', {
                    initialValue: dataSource.fllowupTask,
                    rules: [],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`${commonPromptCode}.workcenter`).d('工作中心')}
                  {...formLayout}
                >
                  {getFieldDecorator('workcenterId', {
                    initialValue: dataSource.workcenterId,
                    rules: [],
                  })(
                    <Lov
                      code="AMTC.WORKCENTERS"
                      queryParams={{ tenantId }}
                      textValue={dataSource.workcenterName}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.nextGroupName`).d('后续负责人组')}
                  {...formLayout}
                >
                  {getFieldDecorator('nextGroupId', {
                    initialValue: dataSource.nextGroupId,
                    rules: [],
                  })(
                    <Lov
                      code="AMTC.SKILLTYPES"
                      queryParams={{ tenantId }}
                      textValue={dataSource.nextGroupName}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`${commonPromptCode}.nextOwnerName`).d('后续负责人')}
                  {...formLayout}
                >
                  {getFieldDecorator('nextOwnerId', {
                    initialValue: dataSource.nextOwnerId,
                    rules: [],
                  })(
                    <Lov
                      code="AMTC.WORKCENTER_PRINCIPAL"
                      queryParams={{ tenantId }}
                      textValue={dataSource.nextOwnerName}
                    />
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
