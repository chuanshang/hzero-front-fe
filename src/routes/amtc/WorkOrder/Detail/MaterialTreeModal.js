import React, { PureComponent } from 'react';
import { Form, Modal, Table, Input, Checkbox } from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { isNull } from 'lodash';
import { Header, Content } from 'components/Page';

@Form.create({ fieldNameProp: null })
class MaterialTreeModal extends PureComponent {
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
    const prefix = 'aatn.assetHandover.model.assetHandover';
    const commonPromptCode1 = 'odel.gzg';
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    const {
      treeList,
      treeHisList,
      onCancel,
      modalVisible,
      loading,
      onSelectRow,
      onSelectHisRow,
      selectedRowKeys,
      selectedRowHisKeys,
      onAssetModalOk,
      form: { getFieldDecorator },
    } = this.props;
    const columns = [
      {
        title: intl.get(`${commonPromptCode1}.kill`).d('全局搜索结果'),
        dataIndex: 'kill',
      },
    ];
    const field = [
      {
        title: intl.get(`${prefix}.treeMeaning`).d('资产结构清单'),
        dataIndex: 'treeMeaning',
      },
    ];
    const rows = [
      {
        title: intl.get(`${prefix}.treeMeaning`).d('工单历史发出的物料'),
        dataIndex: 'treeMeaning',
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
        <Header>{intl.get(`${prefix}.name`).d('新建备件耗材')}</Header>
        <Content>
          <Form>
            <Form.Item {...formLayout}>
              <Input.Search
                enterButton
                placeholder={intl.get(`${prefix}.search`).d('请输入物料名称或编码')}
                onSearch={null}
                onChange={null}
              />
              {getFieldDecorator('locatorMeaning', {
                initialValue: treeList.locatorMeaning,
              })(<Checkbox />)}{' '}
              隐藏库存不足的物料
            </Form.Item>
          </Form>
          <Table
            bordered
            rowKey="treeId"
            columns={columns}
            loading={loading}
            dataSource={null}
            pagination={false}
            rowSelection={{
              selectedRowKeys,
              onChange: onSelectRow,
              getCheckboxProps: record => ({
                disabled: !isNull(record.children),
                name: record.children,
              }),
            }}
          />
          <Table
            bordered
            rowKey="treeId"
            columns={field}
            loading={loading}
            dataSource={treeList}
            pagination={false}
            rowSelection={{
              selectedRowKeys,
              onChange: onSelectRow,
              getCheckboxProps: record => ({
                disabled: !isNull(record.children),
                name: record.children,
              }),
            }}
          />
          <Table
            bordered
            rowKey="treeId"
            columns={rows}
            loading={loading}
            dataSource={treeHisList}
            pagination={false}
            rowSelection={{
              selectedRowHisKeys,
              onChange: onSelectHisRow,
              getCheckboxProps: record => ({
                disabled: !isNull(record.children),
                name: record.children,
              }),
            }}
          />
        </Content>
      </Modal>
    );
  }
}
export default MaterialTreeModal;
