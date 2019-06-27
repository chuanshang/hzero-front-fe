import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Button, InputNumber } from 'hzero-ui';
import Lov from 'components/Lov';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';

@Form.create({ fieldNameProp: null })
class AcceptanceLineDrawer extends PureComponent {
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
   * 确定操作，在新建时，不保存在数据库
   */
  @Bind()
  saveBtn() {
    const { form, dataSource } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { lovMeanings } = this.state;
        this.props.onAcceptanceLineDrawerOK([{ ...dataSource, ...values, ...lovMeanings }]);
      }
    });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const commonPromptCode = 'arcv.acceptance.model.acceptance';
    const {
      anchor,
      drawerVisible,
      title,
      form,
      isNew,
      editFlag,
      AcceptanceLinePanelReadOnly,
      loading,
      onCancel,
      dataSource = {}, // 当前行list传进来的信息
      tenantId,
      currentWbsHeaderId,
      lineProjectVisible,
      lineProjectBudgetVisible,
      lineContractVisible,
      getWbsHeader,
    } = this.props;
    const { lovMeanings } = this.state;
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
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
          (isNew || editFlag) && !AcceptanceLinePanelReadOnly
            ? [
              <Button key="submit" type="primary" onClick={this.saveBtn}>
                {isNew
                    ? intl.get('hzero.common.button.sure').d('确定')
                    : intl.get('hzero.common.button.save').d('保存')}
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
          {lineProjectVisible ? (
            <div>
              <Form.Item
                label={intl.get(`${commonPromptCode}.projectId`).d('项目')}
                {...formLayout}
              >
                {(isNew || editFlag) && !AcceptanceLinePanelReadOnly ? (
                  getFieldDecorator('projectId', {
                    initialValue: dataSource.projectId,
                  })(
                    <Lov
                      code="APPM.PROJECT"
                      queryParams={{ tenantId }}
                      textValue={dataSource.projectMeaning}
                      onChange={(val, record) => {
                        this.setState({
                          lovMeanings: { ...lovMeanings, projectMeaning: record.projectName },
                        });
                        getWbsHeader(val);
                      }}
                    />
                  )
                ) : (
                  <span>{dataSource.projectMeaning}</span>
                )}
              </Form.Item>
              <Form.Item
                label={intl.get(`${commonPromptCode}.wbsLineId`).d('WBS任务')}
                {...formLayout}
              >
                {(isNew || editFlag) && !AcceptanceLinePanelReadOnly ? (
                  getFieldDecorator('wbsLineId', {
                    initialValue: dataSource.wbsLineId,
                  })(
                    <Lov
                      code="APPM.PRO_WBS"
                      queryParams={
                        currentWbsHeaderId !== ''
                          ? { organization: tenantId, wbsHeaderId: currentWbsHeaderId }
                          : {}
                      }
                      textValue={dataSource.wbsLineMeaning}
                      onChange={(_, record) => {
                        this.setState({
                          lovMeanings: { ...lovMeanings, wbsLineMeaning: record.taskName },
                        });
                      }}
                    />
                  )
                ) : (
                  <span>{dataSource.wbsLineMeaning}</span>
                )}
              </Form.Item>
            </div>
          ) : null}
          {lineProjectBudgetVisible ? (
            <div>
              <Form.Item
                label={intl.get(`${commonPromptCode}.budgetHeaderId`).d('项目预算')}
                {...formLayout}
              >
                {(isNew || editFlag) && !AcceptanceLinePanelReadOnly ? (
                  getFieldDecorator('budgetHeaderId', {
                    initialValue: dataSource.budgetHeaderId,
                  })(
                    <Lov
                      code=""
                      queryParams={{ tenantId }}
                      textValue={dataSource.budgetHeaderMeaning}
                    />
                  )
                ) : (
                  <span>{dataSource.budgetHeaderMeaning}</span>
                )}
              </Form.Item>
              <Form.Item
                label={intl.get(`${commonPromptCode}.budgetLineId`).d('项目预算行')}
                {...formLayout}
              >
                {(isNew || editFlag) && !AcceptanceLinePanelReadOnly ? (
                  getFieldDecorator('budgetLineId', {
                    initialValue: dataSource.budgetLineId,
                  })(
                    <Lov
                      code=""
                      queryParams={{ tenantId }}
                      textValue={dataSource.budgetLineMeaning}
                    />
                  )
                ) : (
                  <span>{dataSource.budgetLineMeaning}</span>
                )}
              </Form.Item>
            </div>
          ) : null}
          {lineContractVisible ? (
            <div>
              <Form.Item
                label={intl.get(`${commonPromptCode}.contractId`).d('合同')}
                {...formLayout}
              >
                {(isNew || editFlag) && !AcceptanceLinePanelReadOnly ? (
                  getFieldDecorator('contractId', {
                    initialValue: dataSource.contractId || 0, // 该字段为必输，但目前没有合同对应的模块，所以先给个0
                  })(
                    <Lov
                      code=""
                      queryParams={{ tenantId }}
                      textValue={dataSource.contractMeaning}
                    />
                  )
                ) : (
                  <span>{dataSource.contractMeaning}</span>
                )}
              </Form.Item>
              <Form.Item
                label={intl.get(`${commonPromptCode}.contractLineId`).d('合同行')}
                {...formLayout}
              >
                {(isNew || editFlag) && !AcceptanceLinePanelReadOnly ? (
                  getFieldDecorator('contractLineId', {
                    initialValue: dataSource.contractLineId,
                  })(
                    <Lov
                      code=""
                      queryParams={{ tenantId }}
                      textValue={dataSource.contractLineMeaning}
                    />
                  )
                ) : (
                  <span>{dataSource.contractLineMeaning}</span>
                )}
              </Form.Item>
            </div>
          ) : null}
          <Form.Item
            label={intl.get(`${commonPromptCode}.productCategory`).d('资产类别')}
            {...formLayout}
          >
            {(isNew || editFlag) && !AcceptanceLinePanelReadOnly ? (
              getFieldDecorator('productCategoryId', {
                initialValue: dataSource.productCategoryId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonPromptCode}.productCategory`).d('资产类别'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="AAFM.ASSET_CLASS"
                  queryParams={{ tenantId }}
                  textValue={
                    lovMeanings.productCategoryMeaning || dataSource.productCategoryMeaning
                  }
                  onChange={(_, record) => {
                    this.setState({
                      lovMeanings: {
                        ...lovMeanings,
                        productCategoryMeaning: record.productCategoryName,
                      },
                    });
                  }}
                />
              )
            ) : (
              <span>{dataSource.productCategoryMeaning}</span>
            )}
          </Form.Item>
          <Form.Item label={intl.get(`${commonPromptCode}.assetsSet`).d('资产组')} {...formLayout}>
            {(isNew || editFlag) && !AcceptanceLinePanelReadOnly ? (
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
                  queryParams={{ tenantId, assetClassId: getFieldValue('productCategoryId') }}
                  onChange={(_, record) => {
                    setFieldsValue({ productCategoryId: record.assetClassId });
                    if (isEmpty(getFieldValue('acceptanceLineName'))) {
                      setFieldsValue({ acceptanceLineName: record.assetsSetName });
                    }
                    this.setState({
                      lovMeanings: {
                        ...lovMeanings,
                        assetsSetMeaning: record.assetsSetName,
                        productCategoryMeaning: record.assetClassMeaning,
                      },
                    });
                  }}
                  textValue={dataSource.assetsSetMeaning}
                />
              )
            ) : (
              <span>{dataSource.assetsSetMeaning}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.deliveryListId`).d('交付清单行')}
            {...formLayout}
          >
            {(isNew || editFlag) && !AcceptanceLinePanelReadOnly ? (
              getFieldDecorator('deliveryListId', {
                initialValue: dataSource.deliveryListId,
              })(
                <Lov
                  disabled
                  code="ARCV.DELIVERY_LIST"
                  queryParams={{ tenantId }}
                  textValue={dataSource.deliveryListMeaning}
                  onChange={(_, record) => {
                    this.setState({
                      lovMeanings: { ...lovMeanings, deliveryListMeaning: record.deliveryListName },
                    });
                  }}
                />
              )
            ) : (
              <span>{dataSource.deliveryListMeaning}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.acceptanceLineName`).d('名称')}
            {...formLayout}
          >
            {(isNew || editFlag) && !AcceptanceLinePanelReadOnly ? (
              getFieldDecorator('acceptanceLineName', {
                initialValue: dataSource.acceptanceLineName,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonPromptCode}.acceptanceLineName`).d('名称'),
                    }),
                  },
                ],
              })(<Input />)
            ) : (
              <span>{dataSource.acceptanceLineName}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.specifications`).d('规格型号')}
            {...formLayout}
          >
            {(isNew || editFlag) && !AcceptanceLinePanelReadOnly ? (
              getFieldDecorator('specifications', {
                initialValue: dataSource.specifications,
              })(<Input />)
            ) : (
              <span>{dataSource.specifications}</span>
            )}
          </Form.Item>
          <Form.Item label={intl.get(`${commonPromptCode}.unitPrice`).d('单价')} {...formLayout}>
            {(isNew || editFlag) && !AcceptanceLinePanelReadOnly ? (
              getFieldDecorator('unitPrice', {
                initialValue: dataSource.unitPrice,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonPromptCode}.unitPrice`).d('单价'),
                    }),
                  },
                ],
              })(<InputNumber step={0.01} />)
            ) : (
              <span>{dataSource.unitPrice}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.deliveryQuantity`).d('数量')}
            {...formLayout}
          >
            {(isNew || editFlag) && !AcceptanceLinePanelReadOnly ? (
              getFieldDecorator('deliveryQuantity', {
                initialValue: dataSource.deliveryQuantity,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonPromptCode}.deliveryQuantity`).d('数量'),
                    }),
                  },
                ],
              })(<InputNumber />)
            ) : (
              <span>{dataSource.deliveryQuantity}</span>
            )}
          </Form.Item>
          <Form.Item label={intl.get(`${commonPromptCode}.uom`).d('单位')} {...formLayout}>
            {(isNew || editFlag) && !AcceptanceLinePanelReadOnly ? (
              getFieldDecorator('uomId', {
                initialValue: dataSource.uomId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonPromptCode}.uom`).d('单位'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="AMDM.UOM"
                  queryParams={{ tenantId }}
                  textValue={dataSource.uomMeaning}
                  onChange={(_, record) => {
                    this.setState({ lovMeanings: { ...lovMeanings, uomMeaning: record.uomName } });
                  }}
                />
              )
            ) : (
              <span>{dataSource.uomMeaning}</span>
            )}
          </Form.Item>
          <Form.Item label={intl.get(`${commonPromptCode}.description`).d('备注')} {...formLayout}>
            {(isNew || editFlag) && !AcceptanceLinePanelReadOnly ? (
              getFieldDecorator('description', {
                initialValue: dataSource.description,
              })(<Input />)
            ) : (
              <span>{dataSource.description}</span>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default AcceptanceLineDrawer;
