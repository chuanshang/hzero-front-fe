import React, { PureComponent } from 'react';
import { Form, Row, Col, Modal } from 'hzero-ui';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import { getEditTableData } from 'utils/utils';
import { Bind } from 'lodash-decorators';
import EditTable from 'components/EditTable';
import { Header, Content } from 'components/Page';

@Form.create({ fieldNameProp: null })
class WrdModal extends PureComponent {
  /**
   * 确定
   */
  @Bind()
  clickWrdModalOk() {
    const { form, onWrdModalOk, woopList } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const woop = getEditTableData(woopList, ['_status']);
        onWrdModalOk({ wo: values, woop });
      }
    });
  }

  render() {
    const prefix = 'amtc.workOrder.model.wrdModal';
    const {
      tenantId,
      wrdModalDisplay,
      headerData,
      woopList,
      form: { getFieldDecorator },
      onCancel,
    } = this.props;
    const formLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const columns = [
      {
        title: intl.get(`${prefix}.woopNum`).d('工单任务'),
        dataIndex: 'woopNum',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.ownerGroupName`).d('负责人组'),
        dataIndex: 'ownerGroupId',
        width: 150,
        render: (val, record) => (
          <Form.Item>
            {record.$form.getFieldDecorator('ownerGroupId', {
              initialValue: record.ownerGroupId,
              rules: [],
            })(
              <Lov
                code="AMTC.SKILLTYPES"
                queryParams={{ tenantId }}
                textValue={record.ownerGroupName}
              />
            )}
          </Form.Item>
        ),
      },
      {
        title: intl.get(`${prefix}.ownerName`).d('负责人'),
        dataIndex: 'ownerId',
        width: 150,
        render: (val, record) => (
          <Form.Item>
            {record.$form.getFieldDecorator('ownerId', {
              initialValue: record.ownerId,
              rules: [],
            })(
              <Lov
                code="AMTC.WORKCENTER_PRINCIPAL"
                queryParams={{ tenantId }}
                textValue={record.ownerName}
              />
            )}
          </Form.Item>
        ),
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={650}
        visible={wrdModalDisplay}
        onOk={this.clickWrdModalOk}
        okText={intl.get('hzero.common.button.sure').d('确认')}
        onCancel={onCancel}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
      >
        <Header>{intl.get(`${prefix}.woOwner`).d('工单负责人')}</Header>
        <Content>
          <Form layout="inline" className="table-list-search">
            <Row>
              <Col span={12}>
                <Form.Item label={intl.get(`${prefix}.ownerGroupId`).d('负责人组')} {...formLayout}>
                  {getFieldDecorator('ownerGroupId', {
                    initialValue: headerData.ownerGroupId,
                    rules: [],
                  })(
                    <Lov
                      code="AMTC.SKILLTYPES"
                      queryParams={{ organizationId: tenantId }}
                      textValue={headerData.ownerGroupName}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={intl.get(`${prefix}.ownerId`).d('负责人')} {...formLayout}>
                  {getFieldDecorator('ownerId', {
                    initialValue: headerData.ownerId,
                    rules: [],
                  })(
                    <Lov
                      code="AMTC.WORKCENTERSTAFF"
                      queryParams={{
                        organizationId: tenantId,
                        skilltypeId: headerData.ownerGroupId,
                      }}
                      textValue={headerData.ownerName}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Content>
        <Header> {intl.get(`${prefix}.woopOwner`).d('工序负责人')}</Header>
        <EditTable
          bordered
          rowKey="woopId"
          columns={columns}
          dataSource={woopList}
          pagination={false}
        />
      </Modal>
    );
  }
}
export default WrdModal;
