import React, { PureComponent } from 'react';
import { Form, Modal, Table, Input, Button } from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';

@Form.create({ fieldNameProp: null })
class AcceptanceListModal extends PureComponent {
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
    const { onSearchAcceptanceList, form } = this.props;
    if (onSearchAcceptanceList) {
      form.validateFields((err, value) => {
        if (!err) {
          onSearchAcceptanceList(value);
        }
      });
    }
  }

  render() {
    const prefix = 'arcv.AcceptanceList.model.AcceptanceList';
    const {
      dataSource,
      onCancel,
      acceptanceModalVisible,
      acceptancePagination,
      loading,
      isMulti,
      onSelectAcceptanceRow,
      selectedAcceptanceRowKeys,
      onSearchAcceptanceList,
      onAcceptanceListModalOk,
      form: { getFieldDecorator },
    } = this.props;
    const columns = [
      {
        title: intl.get(`${prefix}.title`).d('标题概述'),
        dataIndex: 'title',
        width: 100,
      },
    ];
    return (
      <Modal
        destroyOnClose
        visible={acceptanceModalVisible}
        onOk={onAcceptanceListModalOk}
        okText={intl.get('hzero.common.button.sure').d('确认')}
        onCancel={onCancel}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
      >
        <Header>{intl.get(`${prefix}.AcceptanceList`).d('验收单')}</Header>
        <Content>
          <Form layout="inline" className="table-list-search">
            <Form.Item label={intl.get(`${prefix}.title`).d('标题概述')}>
              {getFieldDecorator('title', {})(<Input />)}
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
            rowKey="acceptanceHeaderId"
            columns={columns}
            loading={loading}
            dataSource={dataSource}
            pagination={acceptancePagination}
            rowSelection={{
              selectedAcceptanceRowKeys,
              onChange: onSelectAcceptanceRow,
              type: isMulti ? 'checkbox' : 'radio',
            }}
            onChange={page => onSearchAcceptanceList(page)}
          />
        </Content>
      </Modal>
    );
  }
}
export default AcceptanceListModal;
