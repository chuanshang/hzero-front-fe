import React, { PureComponent } from 'react';
import { Form, Modal, Table, Input, Button } from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';

@Form.create({ fieldNameProp: null })
class AssetModal extends PureComponent {
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
    const { onSearchAsset, form } = this.props;
    if (onSearchAsset) {
      form.validateFields((err, values) => {
        if (!err) {
          onSearchAsset(values);
        }
      });
    }
  }

  render() {
    const prefix = 'aatn.assetStatusChange.model.assetStatusChange';
    const {
      dataSource,
      onCancel,
      modalVisible,
      assetPagination,
      loading,
      isMulti,
      onSelectRow,
      selectedRowKeys,
      onSearchAsset,
      onAssetModalOk,
      form: { getFieldDecorator },
    } = this.props;
    const columns = [
      {
        title: intl.get(`${prefix}.name`).d('设备/资产'),
        dataIndex: 'name',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.assetDesc`).d('资产名称'),
        dataIndex: 'assetDesc',
        width: 150,
      },
    ];
    return (
      <Modal
        destroyOnClose
        visible={modalVisible}
        onOk={onAssetModalOk}
        okText={intl.get('hzero.common.button.sure').d('确认')}
        onCancel={onCancel}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
      >
        <Header>{intl.get(`${prefix}.name`).d('设备/资产')}</Header>
        <Content>
          <Form layout="inline" className="table-list-search">
            <Form.Item label={intl.get(`${prefix}.assetDesc`).d('资产名称')}>
              {getFieldDecorator('assetDesc', {})(<Input />)}
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
            rowKey="assetId"
            columns={columns}
            loading={loading}
            dataSource={dataSource}
            pagination={assetPagination}
            rowSelection={{
              selectedRowKeys,
              onChange: onSelectRow,
              type: isMulti ? 'checkbox' : 'radio',
            }}
            onChange={page => onSearchAsset(page)}
          />
        </Content>
      </Modal>
    );
  }
}
export default AssetModal;
