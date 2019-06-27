import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Button, InputNumber, Select } from 'hzero-ui';
import Checkbox from 'components/Checkbox';
import Lov from 'components/Lov';
import { Bind } from 'lodash-decorators';
import { yesOrNoRender } from 'utils/renderer';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';

@Form.create({ fieldNameProp: null })
class AcceptanceAssetDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lovMeanings: {},
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
  saveBtn() {
    const { form, dataSource } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { lovMeanings } = this.state;
        this.props.onAcceptanceAssetDrawerOK({ ...dataSource, ...values, ...lovMeanings });
      }
    });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const commonPromptCode = 'aatn.acceptance.model.acceptanceAsset';
    const {
      isNew,
      editFlag,
      AcceptanceAssetPanelReadOnly,
      anchor,
      drawerVisible,
      title,
      form,
      loading,
      dataSource = {}, // 当前行list传进来的信息
      tenantId,
      TranserFixedLovMap,
      assetNumRequired,
      onCancel,
    } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal
        destroyOnClose
        title={title}
        width={450}
        maskClosable
        wrapClassName={`ant-modal-sidebar-${anchor}`}
        transitionName={`move-${anchor}`}
        visible={drawerVisible}
        confirmLoading={loading}
        onCancel={onCancel}
        footer={
          (isNew || editFlag) && !AcceptanceAssetPanelReadOnly
            ? [
                <Button key="submit" type="primary" loading={loading} onClick={this.saveBtn}>
                  {intl.get('hzero.common.button.save').d('保存')}
                </Button>,
              ]
            : [
                <Button key="cancel" onClick={onCancel}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </Button>,
              ]
        }
      >
        <Form>
          <Form.Item label={intl.get(`${commonPromptCode}.assetNum`).d('资产编号')} {...formLayout}>
            {(isNew || editFlag) && !AcceptanceAssetPanelReadOnly ? (
              getFieldDecorator('assetNum', {
                initialValue: dataSource.assetNum,
                rules: assetNumRequired
                  ? [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonPromptCode}.assetNum`).d('资产编号'),
                        }),
                      },
                    ]
                  : null,
              })(<Input disabled={!assetNumRequired} />)
            ) : (
              <span>{dataSource.assetNum}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.assetClass`).d('资产类别')}
            {...formLayout}
          >
            {(isNew || editFlag) && !AcceptanceAssetPanelReadOnly ? (
              getFieldDecorator('assetClassId', {
                initialValue: dataSource.assetClassId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonPromptCode}.assetClass`).d('资产类别'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="AAFM.ASSET_CLASS"
                  queryParams={{ tenantId }}
                  textValue={dataSource.assetClassMeaning}
                  onChange={(_, record) => {
                    const { lovMeanings } = this.state;
                    this.setState({
                      lovMeanings: {
                        ...lovMeanings,
                        assetClassMeaning: record.productCategoryName,
                      },
                    });
                  }}
                />
              )
            ) : (
              <span>{dataSource.assetClassMeaning}</span>
            )}
          </Form.Item>
          <Form.Item label={intl.get(`${commonPromptCode}.assetsSet`).d('资产组')} {...formLayout}>
            {(isNew || editFlag) && !AcceptanceAssetPanelReadOnly ? (
              getFieldDecorator('assetsSetId', {
                initialValue: dataSource.assetsSetId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonPromptCode}.assetsSet`).d('资产组'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="AAFM.ASSET_SET"
                  queryParams={{ tenantId }}
                  textValue={dataSource.assetsSetMeaning}
                  onChange={(_, record) => {
                    const { lovMeanings } = this.state;
                    this.setState({
                      lovMeanings: { ...lovMeanings, assetsSetMeaning: record.assetsSetName },
                    });
                    if (isEmpty(getFieldValue('brand'))) {
                      setFieldsValue({ brand: record.brand });
                    }
                    if (isEmpty(getFieldValue('model'))) {
                      setFieldsValue({ model: record.specifications });
                    }
                  }}
                />
              )
            ) : (
              <span>{dataSource.specifications}</span>
            )}
          </Form.Item>
          ÎÎ
          <Form.Item
            label={intl.get(`${commonPromptCode}.supplierHeader`).d('供应商')}
            {...formLayout}
          >
            {(isNew || editFlag) && !AcceptanceAssetPanelReadOnly ? (
              getFieldDecorator('supplierHeaderId', {
                initialValue: dataSource.supplierHeaderId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonPromptCode}.supplierHeader`).d('供应商'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="AMDM.ORGANIZATION"
                  queryParams={{ tenantId }}
                  textValue={dataSource.supplierHeaderMeaning}
                  onChange={(_, record) => {
                    const { lovMeanings } = this.state;
                    this.setState({
                      lovMeanings: { ...lovMeanings, supplierHeaderMeaning: record.orgName },
                    });
                  }}
                />
              )
            ) : (
              <span>{dataSource.supplierHeaderMeaning}</span>
            )}
          </Form.Item>
          <Form.Item label={intl.get(`${commonPromptCode}.brand`).d('品牌/厂商')} {...formLayout}>
            {(isNew || editFlag) && !AcceptanceAssetPanelReadOnly ? (
              getFieldDecorator('brand', {
                initialValue: dataSource.brand,
              })(<Input />)
            ) : (
              <span>{dataSource.brand}</span>
            )}
          </Form.Item>
          <Form.Item label={intl.get(`${commonPromptCode}.model`).d('规格型号')} {...formLayout}>
            {(isNew || editFlag) && !AcceptanceAssetPanelReadOnly ? (
              getFieldDecorator('model', {
                initialValue: dataSource.model,
              })(<Input />)
            ) : (
              <span>{dataSource.model}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.assetStatus`).d('资产状态')}
            {...formLayout}
          >
            {(isNew || editFlag) && !AcceptanceAssetPanelReadOnly ? (
              getFieldDecorator('assetStatusId', {
                initialValue: dataSource.assetStatusId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonPromptCode}.assetStatus`).d('资产状态'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="AAFM.ASSET_STATUS"
                  queryParams={{ tenantId }}
                  textValue={dataSource.assetStatusMeaning}
                  onChange={(_, record) => {
                    const { lovMeanings } = this.state;
                    this.setState({
                      lovMeanings: { ...lovMeanings, assetStatusMeaning: record.sysStatusName },
                    });
                  }}
                />
              )
            ) : (
              <span>{dataSource.assetStatusMeaning}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.assetLocation`).d('资产位置')}
            {...formLayout}
          >
            {(isNew || editFlag) && !AcceptanceAssetPanelReadOnly ? (
              getFieldDecorator('assetLocationId', {
                initialValue: dataSource.assetLocationId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonPromptCode}.assetLocation`).d('资产位置'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="AMDM.LOCATIONS"
                  queryParams={{ tenantId }}
                  textValue={dataSource.assetLocationMeaning}
                  onChange={(_, record) => {
                    const { lovMeanings } = this.state;
                    this.setState({
                      lovMeanings: { ...lovMeanings, assetLocationMeaning: record.locationName },
                    });
                  }}
                />
              )
            ) : (
              <span>{dataSource.assetLocationMeaning}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.owningOrg`).d('所属组织')}
            {...formLayout}
          >
            {(isNew || editFlag) && !AcceptanceAssetPanelReadOnly ? (
              getFieldDecorator('owningOrgId', {
                initialValue: dataSource.owningOrgId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonPromptCode}.owningOrg`).d('所属组织'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="AMDM.ORGANIZATION"
                  queryParams={{ tenantId }}
                  textValue={dataSource.owningOrgMeaning}
                  onChange={(_, record) => {
                    const { lovMeanings } = this.state;
                    this.setState({
                      lovMeanings: { ...lovMeanings, owningOrgMeaning: record.orgName },
                    });
                  }}
                />
              )
            ) : (
              <span>{dataSource.owningOrgMeaning}</span>
            )}
          </Form.Item>
          <Form.Item label={intl.get(`${commonPromptCode}.usingOrg`).d('使用组织')} {...formLayout}>
            {(isNew || editFlag) && !AcceptanceAssetPanelReadOnly ? (
              getFieldDecorator('usingOrgId', {
                initialValue: dataSource.usingOrgId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonPromptCode}.usingOrg`).d('使用组织'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="AMDM.ORGANIZATION"
                  queryParams={{ tenantId }}
                  textValue={dataSource.usingOrgMeaning}
                  onChange={(_, record) => {
                    const { lovMeanings } = this.state;
                    this.setState({
                      lovMeanings: { ...lovMeanings, usingOrgMeaning: record.orgName },
                    });
                  }}
                />
              )
            ) : (
              <span>{dataSource.usingOrgMeaning}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.owningPerson`).d('固资管理员')}
            {...formLayout}
          >
            {(isNew || editFlag) && !AcceptanceAssetPanelReadOnly ? (
              getFieldDecorator('owningPersonId', {
                initialValue: dataSource.owningPersonId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonPromptCode}.owningPerson`).d('固资管理员'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="HALM.EMPLOYEE"
                  queryParams={{ tenantId }}
                  textValue={dataSource.owningPersonMeaning}
                  onChange={(_, record) => {
                    const { lovMeanings } = this.state;
                    this.setState({
                      lovMeanings: { ...lovMeanings, owningPersonMeaning: record.name },
                    });
                  }}
                />
              )
            ) : (
              <span>{dataSource.owningPersonMeaning}</span>
            )}
          </Form.Item>
          <Form.Item label={intl.get(`${commonPromptCode}.userPerson`).d('使用人')} {...formLayout}>
            {(isNew || editFlag) && !AcceptanceAssetPanelReadOnly ? (
              getFieldDecorator('userPersonId', {
                initialValue: dataSource.owningPersonId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonPromptCode}.userPerson`).d('使用人'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="HALM.EMPLOYEE"
                  queryParams={{ tenantId }}
                  textValue={dataSource.userPersonMeaning}
                  onChange={(_, record) => {
                    const { lovMeanings } = this.state;
                    this.setState({
                      lovMeanings: { ...lovMeanings, userPersonMeaning: record.name },
                    });
                  }}
                />
              )
            ) : (
              <span>{dataSource.userPersonMeaning}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.costCenter`).d('成本中心')}
            {...formLayout}
          >
            {(isNew || editFlag) && !AcceptanceAssetPanelReadOnly ? (
              getFieldDecorator('costCenterId', {
                initialValue: dataSource.costCenterId || 0, // 给个初始值先
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonPromptCode}.costCenter`).d('成本中心'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="AAFM.ASSET_COST_CENTER"
                  queryParams={{ tenantId }}
                  textValue={dataSource.costCenterMeaning || `给个初始值先`}
                  onChange={(_, record) => {
                    const { lovMeanings } = this.state;
                    this.setState({
                      lovMeanings: { ...lovMeanings, costCenterMeaning: record.costCenterName },
                    });
                  }}
                />
              )
            ) : (
              <span>{dataSource.costCenterMeaning || `给个初始值先`}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.originalCost`).d('获取价格')}
            {...formLayout}
          >
            {(isNew || editFlag) && !AcceptanceAssetPanelReadOnly ? (
              getFieldDecorator('principalCostCenteoriginalCostrId', {
                initialValue: dataSource.originalCost,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonPromptCode}.originalCost`).d('获取价格'),
                    }),
                  },
                ],
              })(<InputNumber step={0.01} />)
            ) : (
              <span>{dataSource.originalCost}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.parentAsset`).d('父资产')}
            {...formLayout}
          >
            {(isNew || editFlag) && !AcceptanceAssetPanelReadOnly ? (
              getFieldDecorator('parentAssetId', {
                initialValue: dataSource.parentAssetId,
              })(
                <Lov
                  code="AAFM.ASSETS"
                  queryParams={{ tenantId }}
                  textValue={dataSource.parentAssetMeaning}
                  onChange={(_, record) => {
                    const { lovMeanings } = this.state;
                    this.setState({
                      lovMeanings: { ...lovMeanings, parentAssetMeaning: record.assetsName },
                    });
                  }}
                />
              )
            ) : (
              <span>{dataSource.parentAssetMeaning}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.transferFixedCode`).d('转固')}
            {...formLayout}
          >
            {(isNew || editFlag) && !AcceptanceAssetPanelReadOnly ? (
              getFieldDecorator('transferFixedCode', {
                initialValue: dataSource.transferFixedMeaning,
              })(
                <Select>
                  {TranserFixedLovMap.map(i => (
                    <Select.Option key={i.value}>{i.meaning}</Select.Option>
                  ))}
                </Select>
              )
            ) : (
              <span>{dataSource.parentAssetMeaning}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.completeFlag`).d('资产信息是否完整')}
            {...formLayout}
          >
            {(isNew || editFlag) && !AcceptanceAssetPanelReadOnly ? (
              getFieldDecorator('completeFlag', {
                initialValue: dataSource.completeFlag,
              })(<Checkbox disabled />)
            ) : (
              <span>{yesOrNoRender(dataSource.completeFlag)}</span>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default AcceptanceAssetDrawer;
