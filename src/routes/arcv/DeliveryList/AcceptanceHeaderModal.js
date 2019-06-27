import React, { PureComponent } from 'react';
import { Form, Modal, Table, Input, Row, Col } from 'hzero-ui';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { dateRender, yesOrNoRender } from 'utils/renderer';
import { Header, Content } from 'components/Page';

@Form.create({ fieldNameProp: null })
class AcceptanceHeaderModal extends PureComponent {
  /**
   * 确定
   */
  @Bind()
  clickAcceptanceModalOk(dataSource) {
    const { form, onAcceptanceModalOk } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onAcceptanceModalOk(values, dataSource);
      }
    });
  }

  /**
   * 修改验收单类型
   */
  @Bind()
  handChangeAcceptanceType(_, record) {
    this.props.onChangeAcceptanceType(record);
  }

  render() {
    const prefix = 'arcv.deliveryList.model.AcceptanceHeaderModal';
    const {
      tenantId,
      dataSource,
      acceptanceModalVisible,
      acceptanceNumRequired,
      acceptancePagination,
      loading,
      form: { getFieldDecorator },
      onCancel,
    } = this.props;
    const formLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const columns = [
      {
        title: intl.get(`${prefix}.deliveryListName`).d('名称'),
        dataIndex: 'deliveryListName',
        width: 120,
      },
      {
        title: intl.get(`${prefix}.productCategory`).d('产品类别'),
        dataIndex: 'productCategoryMeaning',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.assetsSet`).d('资产组'),
        dataIndex: 'assetsSetMeaning',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.specifications`).d('规格型号'),
        dataIndex: 'specifications',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${prefix}.unitPrice`).d('单价'),
        dataIndex: 'unitPrice',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.contractId`).d('合同'),
        dataIndex: 'contractMeaning',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.contractLine`).d('合同行'),
        dataIndex: 'contractLineMeaning',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.needDeliveryQuantity`).d('应交付数量'),
        dataIndex: 'needDeliveryQuantity',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.deliveredQuantity`).d('已交付数量'),
        dataIndex: 'deliveredQuantity',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.deliveryCompleteDate`).d('交付完成日期'),
        dataIndex: 'deliveryCompleteDate',
        width: 120,
        align: 'center',
        render: dateRender,
      },
      {
        title: intl.get(`${prefix}.deliveryCompleteFlag`).d('是否交付完成'),
        dataIndex: 'deliveryCompleteFlag',
        width: 120,
        render: value => yesOrNoRender(value),
      },
    ];
    return (
      <Modal
        destroyOnClose
        visible={acceptanceModalVisible}
        confirmLoading={loading}
        onOk={() => this.clickAcceptanceModalOk(dataSource)}
        okText={intl.get('hzero.common.button.createAcceptance').d('生成验收单')}
        onCancel={onCancel}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
      >
        <Header>{intl.get(`${prefix}.Acceptance`).d('验收单')}</Header>
        <Content>
          <Form layout="inline" className="table-list-search">
            <Row>
              <Col span={12}>
                <Form.Item
                  label={intl.get(`${prefix}.acceptanceType`).d('验收类型')}
                  {...formLayout}
                >
                  {getFieldDecorator('acceptanceTypeId', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${prefix}.acceptanceType`).d('验收类型'),
                        }),
                      },
                    ],
                  })(
                    <Lov
                      code="ARCV.ACCEPTANCE_ORDER_TYPE"
                      onChange={this.handChangeAcceptanceType}
                      queryParams={{
                        organization: tenantId,
                        accTypeCondition: 'ASSET_ACCOUNTS,MATERIAL_TRANSACTION_PROCESS',
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={intl.get(`${prefix}.acceptanceNum`).d('验收单编号')}
                  {...formLayout}
                >
                  {getFieldDecorator('acceptanceNum', {
                    rules: acceptanceNumRequired
                      ? [
                          {
                            required: true,
                            message: intl.get('hzero.common.validation.notNull', {
                              name: intl.get(`${prefix}.acceptanceNum`).d('验收单编号'),
                            }),
                          },
                        ]
                      : [],
                  })(<Input disabled={!acceptanceNumRequired} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label={intl.get(`${prefix}.title`).d('标题概述')} {...formLayout}>
                  {getFieldDecorator('title', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${prefix}.title`).d('标题概述'),
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={intl.get(`${prefix}.principalPerson`).d('负责人')}
                  {...formLayout}
                >
                  {getFieldDecorator('principalPersonId', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${prefix}.principalPerson`).d('负责人'),
                        }),
                      },
                    ],
                  })(<Lov code="HALM.EMPLOYEE" queryParams={{ tenantId }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label={intl.get(`${prefix}.requestDepartment`).d('申请部门')}
                  {...formLayout}
                >
                  {getFieldDecorator('requestDepartmentId', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${prefix}.requestDepartment`).d('申请部门'),
                        }),
                      },
                    ],
                  })(<Lov code="AMDM.ORGANIZATION" queryParams={{ organization: tenantId }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={intl.get(`${prefix}.purchaseDepartment`).d('采购部门')}
                  {...formLayout}
                >
                  {getFieldDecorator('purchaseDepartmentId', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${prefix}.purchaseDepartment`).d('采购部门'),
                        }),
                      },
                    ],
                  })(<Lov code="AMDM.ORGANIZATION" queryParams={{ organization: tenantId }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label={intl.get(`${prefix}.description`).d('描述')} {...formLayout}>
                  {getFieldDecorator('description', {})(<Input />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Table
            bordered
            rowKey="deliveryListId"
            columns={columns}
            dataSource={dataSource}
            pagination={acceptancePagination}
          />
        </Content>
      </Modal>
    );
  }
}
export default AcceptanceHeaderModal;
