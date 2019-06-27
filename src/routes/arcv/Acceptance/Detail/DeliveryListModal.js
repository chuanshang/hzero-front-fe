import React, { PureComponent } from 'react';
import { Form, Modal, Table, Input, Button } from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';

@Form.create({ fieldNameProp: null })
class DeliveryListModal extends PureComponent {
  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    this.props.form.resetFields();
  }

  /**
   * 表单校验
   */
  @Bind()
  handleSearch() {
    const { onSearchDeliveryList, form } = this.props;
    if (onSearchDeliveryList) {
      form.validateFields((err, value) => {
        if (!err) {
          onSearchDeliveryList(value);
        }
      });
    }
  }

  render() {
    const prefix = 'arcv.deliveryList.model.deliveryList';
    const {
      dataSource,
      onCancel,
      deliveryModalVisible,
      deliveryPagination,
      loading,
      isMulti,
      onSelectDeliveryRow,
      selectedDeliveryRowKeys,
      onSearchDeliveryList,
      onDeliveryListModalOk,
      form: { getFieldDecorator },
    } = this.props;
    const columns = [
      {
        title: intl.get(`${prefix}.deliveryListName`).d('名称'),
        dataIndex: 'deliveryListName',
        width: 100,
      },
    ];
    return (
      <Modal
        destroyOnClose
        visible={deliveryModalVisible}
        onOk={onDeliveryListModalOk}
        okText={intl.get('hzero.common.button.sure').d('确认')}
        onCancel={onCancel}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
      >
        <Header>{intl.get(`${prefix}.deliveryList`).d('交付清单')}</Header>
        <Content>
          <Form layout="inline" className="table-list-search">
            <Form.Item label={intl.get(`${prefix}.deliveryListName`).d('名称')}>
              {getFieldDecorator('deliveryListName', {})(<Input />)}
            </Form.Item>
            <Form.Item>
              <Button
                data-code="search"
                type="primary"
                htmlType="submit"
                onClick={this.handleSearch}
              >
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
              <Button data-code="reset" style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
            </Form.Item>
          </Form>
          <Table
            bordered
            rowKey="deliveryListId"
            columns={columns}
            loading={loading}
            dataSource={dataSource}
            pagination={deliveryPagination}
            rowSelection={{
              selectedDeliveryRowKeys,
              onChange: onSelectDeliveryRow,
              type: isMulti ? 'checkbox' : 'radio',
            }}
            onChange={page => onSearchDeliveryList(page)}
          />
        </Content>
      </Modal>
    );
  }
}
export default DeliveryListModal;
