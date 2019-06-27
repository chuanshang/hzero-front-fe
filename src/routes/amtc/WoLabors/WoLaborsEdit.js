import React, { Component } from 'react';
import { Form, Row, Input, InputNumber, Select, Modal, Spin } from 'hzero-ui';
import { isUndefined } from 'lodash';
import intl from 'utils/intl';
import classNames from 'classnames';
import Lov from 'components/Lov';
import { DETAIL_DEFAULT_CLASSNAME } from 'utils/constants';
import { Bind } from 'lodash-decorators';
import styles from './index.less';

@Form.create({ fieldNameProp: null })
class WoLaborsEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 保存
   */
  @Bind()
  handleSave() {
    const { form, dataSource, onConfirmLine } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onConfirmLine({ ...dataSource, ...values });
      }
    });
  }

  render() {
    const modelPrompt = 'amtc.woLabors.model.woLabors';
    const {
      anchor,
      title,
      loading,
      editVisible,
      tenantId,
      dataSource = {},
      form,
      limitTimeUom,
      onCancelLine,
    } = this.props;
    const { getFieldDecorator } = form;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    return (
      <React.Fragment>
        <Modal
          maskClosable
          destroyOnClose
          title={title}
          width={450}
          wrapClassName={`ant-modal-sidebar-${anchor}`}
          transitionName={`move-${anchor}`}
          visible={editVisible}
          confirmLoading={loading.saveLoading}
          onOk={this.handleSave}
          okText={intl.get('hzero.common.button.sure').d('确认')}
          onCancel={onCancelLine}
          cancelText={intl.get('hzero.common.button.cancel').d('取消')}
        >
          <Spin
            spinning={isUndefined(dataSource.checklistId) ? false : loading.listLoading}
            wrapperClassName={classNames(
              styles['wo-labors-group-detail'],
              DETAIL_DEFAULT_CLASSNAME
            )}
          >
            <Form>
              <Row>
                <Form.Item label={intl.get(`${modelPrompt}.woop`).d('工单任务')} {...formLayout}>
                  {getFieldDecorator('woopId', {
                    initialValue: dataSource.woopId,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.woop`).d('工单任务'),
                        }),
                      },
                    ],
                  })(
                    <Lov
                      code="AMTC.WOOP"
                      queryParams={{ tenantId }}
                      textValue={dataSource.woopName}
                    />
                  )}
                </Form.Item>
              </Row>
              <Row>
                <Form.Item
                  label={intl.get(`${modelPrompt}.workcenter`).d('工作中心')}
                  {...formLayout}
                >
                  {getFieldDecorator('workcenterId', {
                    initialValue: dataSource.workcenterId,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.workcenter`).d('工作中心'),
                        }),
                      },
                    ],
                  })(
                    <Lov
                      code="AMTC.WORKCENTERS	"
                      queryParams={{ tenantId }}
                      textValue={dataSource.workcenterName}
                    />
                  )}
                </Form.Item>
              </Row>
              <Row>
                <Form.Item
                  label={intl.get(`${modelPrompt}.workcenterRes`).d('资源/工种')}
                  {...formLayout}
                >
                  {getFieldDecorator('workcenterResId', {
                    initialValue: dataSource.workcenterResId,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.workcenterRes`).d('资源/工种'),
                        }),
                      },
                    ],
                  })(
                    <Lov
                      code="AMTC.SKILLTYPES	"
                      queryParams={{ tenantId }}
                      textValue={dataSource.workcenterResName}
                    />
                  )}
                </Form.Item>
              </Row>
              <Row>
                <Form.Item
                  label={intl.get(`${modelPrompt}.workcenterPeople`).d('工作中心人员')}
                  {...formLayout}
                >
                  {getFieldDecorator('workcenterPeopleId', {
                    initialValue: dataSource.workcenterPeopleId,
                  })(
                    <Lov
                      code="AMTC.WORKCENTERSTAFF	"
                      queryParams={{ tenantId }}
                      textValue={dataSource.workcenterPeopleName}
                    />
                  )}
                </Form.Item>
              </Row>
              <Row>
                <Form.Item
                  label={intl.get(`${modelPrompt}.laborQuantity`).d('人员数量')}
                  {...formLayout}
                >
                  {getFieldDecorator('laborQuantity', {
                    initialValue: dataSource.laborQuantity,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.laborQuantity`).d('人员数量'),
                        }),
                      },
                    ],
                  })(<InputNumber min={0} />)}
                </Form.Item>
              </Row>
              <Row>
                <Form.Item
                  label={intl.get(`${modelPrompt}.unitDuration`).d('投入单位时间')}
                  {...formLayout}
                >
                  {getFieldDecorator('unitDuration', {
                    initialValue: dataSource.unitDuration,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.unitDuration`).d('投入单位时间'),
                        }),
                      },
                    ],
                  })(<InputNumber min={0} />)}
                </Form.Item>
              </Row>
              <Row>
                <Form.Item
                  label={intl.get(`${modelPrompt}.durationUom`).d('时间单位')}
                  {...formLayout}
                >
                  {getFieldDecorator('durationUom', {
                    initialValue: dataSource.workcenterPeopleId,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.durationUom`).d('时间单位'),
                        }),
                      },
                    ],
                  })(
                    <Select allowClear>
                      {limitTimeUom.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Row>
              <Row>
                <Form.Item
                  label={intl.get(`${modelPrompt}.plannedTotalDuration`).d('计划用工')}
                  {...formLayout}
                >
                  {getFieldDecorator('plannedTotalDuration', {
                    initialValue: dataSource.plannedTotalDuration,
                  })(<InputNumber min={0} />)}
                </Form.Item>
              </Row>
              <Row>
                <Form.Item
                  label={intl.get(`${modelPrompt}.actualLaborQuantity`).d('实际人员数量')}
                  {...formLayout}
                >
                  {getFieldDecorator('actualLaborQuantity', {
                    initialValue: dataSource.actualLaborQuantity,
                  })(<InputNumber min={0} />)}
                </Form.Item>
              </Row>
              <Row>
                <Form.Item
                  label={intl.get(`${modelPrompt}.actualTotalDuration`).d('实际用工')}
                  {...formLayout}
                >
                  {getFieldDecorator('actualTotalDuration', {
                    initialValue: dataSource.actualTotalDuration,
                  })(<InputNumber min={0} />)}
                </Form.Item>
              </Row>
              <Row>
                <Form.Item label={intl.get(`${modelPrompt}.description`).d('描述')} {...formLayout}>
                  {getFieldDecorator('description', {
                    initialValue: dataSource.description,
                  })(<Input.TextArea rows={2} />)}
                </Form.Item>
              </Row>
            </Form>
          </Spin>
        </Modal>
      </React.Fragment>
    );
  }
}
export default WoLaborsEdit;
