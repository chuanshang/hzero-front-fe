import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, DatePicker, Button, Select, InputNumber, Row } from 'hzero-ui';
import Lov from 'components/Lov';
import { Bind } from 'lodash-decorators';
import { dateRender } from 'utils/renderer';
import moment from 'moment';
import { getDateFormat, getDateTimeFormat } from 'utils/utils';
import intl from 'utils/intl';
import { isUndefined } from 'lodash';

/**
 * 事务处理行明细-滑窗(抽屉)
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {string} anchor - 抽屉滑动位置
 * @reactProps {string} title - 抽屉标题
 * @reactProps {boolean} visible - 抽屉是否可见
 * @reactProps {Function} onOk - 抽屉确定操作
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
class TransactionDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // currentLocationName: '',
      targetLocationName: '',
      processStatusMeaning: '',
    };
  }

  /**
   * 组件属性定义
   */
  static propTypes = {
    anchor: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
    title: PropTypes.string,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  /**
   * 组件属性默认值设置
   */
  static defaultProps = {
    anchor: 'right',
    title: '',
    visible: false,
    onOk: e => e,
    onCancel: e => e,
  };

  /**
   * 确定操作
   */
  @Bind()
  saveBtn(lineData) {
    const { form, onOk } = this.props;
    const {
      targetLocationName,
      // currentLocationName,
      processStatusMeaning,
    } = this.state;
    const { currentLocationName } = lineData;
    if (onOk) {
      form.validateFields((err, values) => {
        if (!err) {
          // 校验通过，进行保存操作
          onOk({
            ...lineData,
            ...values,
            currentLocationName,
            targetLocationName,
            processStatusMeaning,
            description: this.handleMakeDescription({
              ...lineData,
              ...values,
              currentLocationName,
              targetLocationName,
            }),
          });
        }
      });
    }
  }

  /**
   * 资产报废行确认
   */
  @Bind()
  conformLineBtn(lineData) {
    const { onConformLine } = this.props;
    const {
      targetLocationName,
      // currentLocationName,
      processStatusMeaning,
    } = this.state;
    const { currentLocationName } = lineData;
    if (onConformLine) {
      // 校验通过，进行报废操作
      onConformLine({
        ...lineData,
        currentLocationName,
        targetLocationName,
        processStatusMeaning,
        description: this.handleMakeDescription({
          ...lineData,
          currentLocationName,
          targetLocationName,
        }),
      });
    }
  }

  /**
   * 拼接描述字段
   */
  @Bind()
  handleMakeDescription(lineData) {
    const {
      form: { getFieldsValue },
      scrapTypeMap = [],
      disposeTypeLovMap = [],
    } = this.props;
    const { scrapTypeCode, disposeTypeCode, remark } = getFieldsValue();
    const {
      currentAssetStatus,
      targetAssetStatus,
      currentLocationName,
      targetLocationName,
    } = lineData;
    const currentScrapType = scrapTypeMap.filter(item => item.value === scrapTypeCode)[0] || {};
    const currentDisposeType =
      disposeTypeLovMap.filter(item => item.value === disposeTypeCode)[0] || {};
    const message = intl
      .get('aatn.assetScrap.view.message')
      .d(
        `资产状态由${currentAssetStatus}变为${targetAssetStatus},位置由${currentLocationName}变为${targetLocationName},资产报废类型为${
          currentScrapType.meaning
        },资产处置类型为${currentDisposeType.meaning},${remark}`
      );
    return message;
  }

  /**
   * 修改目标位置LOV
   */
  @Bind()
  handleChangTargetLocation(_, record) {
    const { locationName } = record;
    this.setState({ targetLocationName: locationName });
  }

  /**
   * 修改处置类型lov
   */
  @Bind()
  handleScrapLineProcessStatus(_, record) {
    this.setState({ processStatusMeaning: record.props.children });
  }

  /**
   * 处理动态字段
   */
  @Bind()
  getAttributeInfo(assetId, scrapLineId) {
    const { form, onDynamicGetHtml } = this.props;
    if (!isUndefined(assetId)) {
      return onDynamicGetHtml(form, assetId, scrapLineId);
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const commonPromptCode = 'aatn.assetScrap.model.assetScrap';
    const {
      anchor,
      drawerVisible,
      title,
      isNew,
      editFlag,
      form,
      headerProcessStatus,
      loading,
      onCancel,
      lineDetail, // 当前行list传进来的信息
      dataSource, // 所有的行记录信息
      scrapLineProcessStatusMap,
      disposeTypeLovMap,
      scrapTypeMap,
      tenantId,
    } = this.props;
    const { getFieldDecorator } = form;
    // lineData 本条记录信息,从行总信息dataSource中取出本行信息
    const lineData = !isUndefined(lineDetail)
      ? { ...dataSource.filter(item => item.scrapLineId === lineDetail.scrapLineId)[0] }
      : {};
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal
        destroyOnClose
        title={title}
        width={450}
        wrapClassName={`ant-modal-sidebar-${anchor}`}
        transitionName={`move-${anchor}`}
        visible={drawerVisible}
        // confirmLoading={loading}
        onOk={this.saveBtn}
        onCancel={onCancel}
        footer={
          isNew || editFlag
            ? [
                <Button key="cancel" onClick={onCancel}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  loading={loading.detailLineListLoading}
                  onClick={() => this.saveBtn(lineData)}
                >
                  {intl.get('hzero.common.button.sure').d('确认')}
                </Button>,
              ]
            : [
                <Button key="cancel" onClick={onCancel}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </Button>,
                <Button
                  disabled={
                    !(
                      lineData.processStatus === 'WAIT_FOR_SCRAP' &&
                      (headerProcessStatus === 'APPROVED' || headerProcessStatus === 'PROCESSING')
                    )
                  }
                  key="scrapConfirm"
                  type="primary"
                  onClick={() => this.conformLineBtn(lineData)}
                >
                  {intl.get('hzero.common.button.scrapConfirm').d('报废确认')}
                </Button>,
              ]
        }
      >
        <Form>
          <Form.Item label={intl.get(`${commonPromptCode}.assetId`).d('设备/资产')} {...formLayout}>
            {isNew || editFlag ? (
              getFieldDecorator('assetId', {
                initialValue: lineData.assetId,
              })(<Lov disabled code="" queryParams={{ tenantId }} textValue={lineData.assetName} />)
            ) : (
              <span>{lineData.assetName}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.assetDesc`).d('资产名称')}
            {...formLayout}
          >
            {isNew || editFlag ? (
              getFieldDecorator('assetDesc', {
                initialValue: lineData.assetDesc,
              })(<Input disabled />)
            ) : (
              <span>{lineData.assetDesc}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.processStatus`).d('处理状态')}
            {...formLayout}
          >
            {isNew || editFlag ? (
              getFieldDecorator('processStatus', {
                initialValue: lineData._status === 'create' ? `NEW` : lineData.processStatus,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonPromptCode}.processStatus`).d('处理状态'),
                    }),
                  },
                ],
              })(
                <Select disabled onChange={this.handleScrapLineProcessStatus}>
                  {scrapLineProcessStatusMap.map(i => (
                    <Select.Option key={i.value}>{i.meaning}</Select.Option>
                  ))}
                </Select>
              )
            ) : (
              <span>{lineData.processStatusMeaning}</span>
            )}
          </Form.Item>
          <Row>{this.getAttributeInfo(lineData.assetId, lineDetail.scrapLineId)}</Row>
          <Form.Item
            label={intl.get(`${commonPromptCode}.currentAssetStatus`).d('当前资产状态')}
            {...formLayout}
          >
            {isNew || editFlag ? (
              getFieldDecorator('currentAssetStatusId', {
                initialValue: lineData.currentAssetStatusId,
              })(
                <Lov
                  disabled
                  code="AAFM.ASSET_STATUS"
                  queryParams={{ tenantId }}
                  textValue={lineData.currentAssetStatus}
                />
              )
            ) : (
              <span>{lineData.currentAssetStatus}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.targetAssetStatus`).d('目标资产状态')}
            {...formLayout}
          >
            {isNew || editFlag ? (
              getFieldDecorator('targetAssetStatusId', {
                initialValue: lineData.targetAssetStatusId,
              })(
                <Lov
                  disabled
                  code="AAFM.ASSET_STATUS"
                  queryParams={{ tenantId }}
                  textValue={lineData.targetAssetStatus}
                />
              )
            ) : (
              <span>{lineData.targetAssetStatus}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.currentLocation`).d('当前位置')}
            {...formLayout}
          >
            {isNew || editFlag ? (
              getFieldDecorator('currentLocationId', {
                initialValue: lineData.currentLocationId,
              })(
                <Lov
                  disabled
                  code="AMDM.LOCATIONS"
                  queryParams={{ tenantId }}
                  textValue={lineData.currentLocationName}
                />
              )
            ) : (
              <span>{lineData.currentLocationName}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.targetLocation`).d('目标位置')}
            {...formLayout}
          >
            {isNew || editFlag ? (
              getFieldDecorator('targetLocationId', {
                initialValue: lineData.targetLocationId,
              })(
                <Lov
                  code="AMDM.LOCATIONS"
                  onChange={this.handleChangTargetLocation}
                  queryParams={{ tenantId }}
                  textValue={lineData.targetLocationName}
                />
              )
            ) : (
              <span>{lineData.targetLocationName}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.originalCost`).d('资产原值')}
            {...formLayout}
          >
            {isNew || editFlag ? (
              getFieldDecorator('originalCost', {
                initialValue: lineData.originalCost,
              })(<Input disabled />)
            ) : (
              <span>{lineData.originalCost}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.remainCost`).d('剩余价值')}
            {...formLayout}
          >
            {isNew || editFlag ? (
              getFieldDecorator('remainCost', {
                initialValue: lineData.remainCost,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonPromptCode}.remainCost`).d('剩余价值'),
                    }),
                  },
                ],
              })(<InputNumber disabled={!isNew && lineData._status !== 'create'} />)
            ) : (
              <span>{lineData.remainCost}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.capitalizationDate`).d('资本化日期')}
            {...formLayout}
          >
            {isNew || editFlag ? (
              getFieldDecorator('capitalizationDate', {
                initialValue: lineData.capitalizationDate
                  ? moment(lineData.capitalizationDate, getDateTimeFormat())
                  : null,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonPromptCode}.capitalizationDate`).d('资本化日期'),
                    }),
                  },
                ],
              })(
                <DatePicker
                  disabled={!isNew && lineData._status !== 'create'}
                  placeholder=""
                  format={getDateFormat()}
                />
              )
            ) : (
              <span>{dateRender(lineData.capitalizationDate)}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.remainDepreciationMouth`).d('剩余折旧月份')}
            {...formLayout}
          >
            {isNew || editFlag ? (
              getFieldDecorator('remainDepreciationMouth', {
                initialValue: lineData.remainDepreciationMouth,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl
                        .get(`${commonPromptCode}.remainDepreciationMouth`)
                        .d('剩余折旧月份'),
                    }),
                  },
                ],
              })(<InputNumber disabled={!isNew && lineData._status !== 'create'} />)
            ) : (
              <span>{lineData.remainDepreciationMouth}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.scrapTypeCode`).d('资产报废类型')}
            {...formLayout}
          >
            {isNew || editFlag ? (
              getFieldDecorator('scrapTypeCode', {
                initialValue: lineData.scrapTypeCode,
              })(
                <Select>
                  {scrapTypeMap.map(i => (
                    <Select.Option key={i.value}>{i.meaning}</Select.Option>
                  ))}
                </Select>
              )
            ) : (
              <span>{lineData.scrapTypeCodeMeaning}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.disposeTypeCode`).d('资产处置类型')}
            {...formLayout}
          >
            {isNew || editFlag ? (
              getFieldDecorator('disposeTypeCode', {
                initialValue: lineData.disposeTypeCode,
              })(
                <Select>
                  {disposeTypeLovMap.map(i => (
                    <Select.Option key={i.value}>{i.meaning}</Select.Option>
                  ))}
                </Select>
              )
            ) : (
              <span>{lineData.disposeTypeCodeMeaning}</span>
            )}
          </Form.Item>
          <Form.Item label={intl.get(`${commonPromptCode}.remark`).d('备注')} {...formLayout}>
            {isNew || editFlag ? (
              getFieldDecorator('remark', {
                initialValue: lineData.remark,
              })(<Input />)
            ) : (
              <span>{lineData.remark}</span>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default TransactionDrawer;
