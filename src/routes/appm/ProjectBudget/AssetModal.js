import React, { PureComponent } from 'react';
import { Form, Modal, Input, Button, Row, Col, InputNumber } from 'hzero-ui';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import ExcelExport from 'components/ExcelExport';
import { isUndefined, isEmpty, isNull } from 'lodash';
import { HALM_PPM } from '@/utils/config';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import { getDateFormat } from 'utils/utils';
import AttributeModal from './AttributeModal';

class AssetModal extends PureComponent {
  form;

  constructor(props) {
    super(props);
    this.state = {
      attributeModalVisible: false,
      _record: {},
      _attributeFields: {}, // 补充描述中的字段
      loadingFlag: false, // 补充描述弹窗中的loading
    };
  }

  /**
   * 选择资产组后设置品牌/厂商、规格型号
   * 获取其关联的属性组行列表
   */
  @Bind()
  handleAssetSetChange(val, lovRecord, record) {
    this.props.onSelectedAssetSet(val);
    record.$form.registerField('assetsSetName');
    const productCategoryId = record.$form.getFieldValue('productCategoryId');
    record.$form.setFieldsValue({
      assetsSetName: lovRecord.assetsSetName,
      brand: lovRecord.brand,
      specifications: lovRecord.specifications,
      // productCategoryId: !isEmpty(productCategoryId)
      //   ? productCategoryId : lovRecord.productCategoryId,
      name: `${lovRecord.assetsSetName}.${lovRecord.brand}.${
        lovRecord.specifications
      }.${record.$form.getFieldValue('attributeDes')}`,
    });
    if (isEmpty(productCategoryId)) {
      this.props.onSearchProductCategory(lovRecord.assetClassId, record);
    }
  }

  /**
   * 根据产品类别、资产组禁用标志删除相应的列
   * @param {Array} columns 列数组
   */
  @Bind()
  handleRemoveColumn(columns) {
    const { productTypeFlag, assetSetFlag, versionStatus } = this.props;
    if (productTypeFlag === 0) {
      columns.splice(columns.findIndex(item => item.dataIndex === 'productCategoryName'), 1);
    }
    if (assetSetFlag === 0) {
      columns.splice(columns.findIndex(item => item.dataIndex === 'assetsSetName'), 1);
      columns.splice(columns.findIndex(item => item.dataIndex === 'brand'), 1);
      columns.splice(columns.findIndex(item => item.dataIndex === 'specifications'), 1);
      columns.splice(columns.findIndex(item => item.dataIndex === 'attributeDes'), 1);
    }
    if (versionStatus !== 'PRESET') {
      columns.splice(columns.findIndex(item => item.dataIndex === 'operate'), 1);
    }
    return columns;
  }

  /**
   * 打开补充描述弹窗
   */
  @Bind()
  handleShowModal(record) {
    this.props.onSearchAttributeSets(record);
    this.setState({
      _record: record,
      loadingFlag: true,
      attributeModalVisible: true,
    });
  }

  /**
   * 关闭补充描述弹窗
   */
  @Bind()
  handleCloseModal() {
    this.setState({ attributeModalVisible: false });
  }

  /**
   * 传递表单参数
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 补充描述
   */
  @Bind()
  handleGetDescription() {
    const { _record } = this.state;
    const fields = this.form.getFieldsValue();
    const keys = Object.keys(fields);
    const values = [];
    keys.forEach(item => {
      if (!isUndefined(fields[item])) {
        if (typeof fields[item] === 'object') {
          values.push(moment(fields[item]).format(getDateFormat()));
          fields[item] = moment(fields[item]).format(getDateFormat());
        } else {
          values.push(fields[item]);
        }
      }
    });
    _record.$form.setFieldsValue({ attributeDes: values.toString().replace(/,/g, '.') });
    _record.$form.registerField('_attributeFields');
    _record.$form.setFieldsValue({ _attributeFields: fields });
    this.setState({ _attributeFields: fields });
    this.handleSetName(_record);
    this.handleCloseModal();
  }

  /**
   * 根据数量和单价计算金额
   */
  @Bind()
  handleSetTotalPrice(val, record, flag) {
    switch (flag) {
      case 'assetQuantity':
        {
          const price = record.$form.getFieldValue('assetPrice');
          if (!isUndefined(price)) {
            record.$form.setFieldsValue({
              price: price * val,
            });
          }
        }
        break;
      case 'assetPrice':
        {
          const quantity = record.$form.getFieldValue('assetQuantity');
          if (!isUndefined(quantity)) {
            record.$form.setFieldsValue({
              price: quantity * val,
            });
          }
        }
        break;
      default:
    }
  }

  /**
   * 设置名称
   */
  handleSetName(record) {
    const { assetsSetName, brand, specifications, attributeDes } = record.$form.getFieldsValue();
    record.$form.setFieldsValue({
      name: `${
        isUndefined(assetsSetName) ? record.assetsSetName : assetsSetName
      }.${brand}.${specifications}.${attributeDes}`,
    });
  }

  /**
   * 格式化接口返回的补充描述
   */
  @Bind()
  handleAttributeDescription(value) {
    const temp = !isEmpty(value) ? JSON.parse(value) : {};
    const keys = Object.keys(temp);
    const values = [];
    keys.forEach(item => {
      if (!isUndefined(temp[item])) {
        values.push(temp[item]);
      }
    });
    return values.toString().replace(/,/g, '.');
  }
  /**
   * 金额转换为千分位并保留两位小数
   */
  @Bind()
  renderAmount(amount) {
    let temp = amount;
    if (!isNull(amount) && !isUndefined(amount)) {
      temp = amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }
    return temp;
  }

  render() {
    const prefix = 'appa.budgetTemplate.model.budgetTemplate';
    const {
      selectedAssetSet,
      dataSource,
      tenantId,
      proBudgetItemId,
      modalVisible,
      pagination,
      loading,
      saveLoading,
      selectedRowKeys,
      attributeList,
      versionStatus,
      // productCategoryName,
      productTypeFlag,
      assetSetFlag,
      dynamicFields,
      onSelectRow,
      onCancel,
      onSearch,
      onNew,
      onDelete,
      onCleanLine,
      onEditLine,
      onSave,
    } = this.props;
    const { attributeModalVisible, _record, _attributeFields, loadingFlag } = this.state;
    const attributeModalProps = {
      loadingFlag,
      attributeList,
      dynamicFields,
      modalVisible: attributeModalVisible,
      dataSource: !isEmpty(_attributeFields)
        ? _attributeFields
        : _record.attributeDes
        ? JSON.parse(_record.attributeDes)
        : {},
      onOk: this.handleGetDescription,
      onRef: this.handleBindRef,
      onCancel: this.handleCloseModal,
    };
    const columns = [
      {
        title: intl.get(`${prefix}.productCategory`).d('产品类别'),
        dataIndex: 'productCategoryName',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('productCategoryId', {
                initialValue: record.productCategoryId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.productCategory`).d('产品类别'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="AAFM.ASSET_CLASS"
                  queryParams={{ organizationId: tenantId }}
                  // textValue={
                  //   !isUndefined(productCategoryName[record.proAssetId])
                  //     ? productCategoryName[record.proAssetId]
                  //     : record.productCategoryName
                  // }
                  textValue={record.productCategoryName}
                />
              )}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefix}.assetSet`).d('资产组'),
        dataIndex: 'assetsSetName',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('assetSetId', {
                initialValue: record.assetSetId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.assetSet`).d('资产组'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="AAFM.ASSET_SET"
                  queryParams={{
                    assetClassId: record.$form.getFieldValue('productCategoryId'),
                    organizationId: tenantId,
                    usedIds: selectedAssetSet,
                  }}
                  textValue={record.assetsSetName}
                  onChange={(val, lovRecord) => this.handleAssetSetChange(val, lovRecord, record)}
                />
              )}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefix}.brand`).d('品牌/厂商'),
        dataIndex: 'brand',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('brand', {
                initialValue: value,
              })(<Input />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefix}.specifications`).d('规格型号'),
        dataIndex: 'specifications',
        width: 120,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('specifications', {
                initialValue: value,
              })(<Input />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefix}.attributeDes`).d('补充描述'),
        dataIndex: 'attributeDes',
        width: 120,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('attributeDes', {
                initialValue: `${this.handleAttributeDescription(value)}`,
              })(<Input onClick={() => this.handleShowModal(record)} />)}
            </Form.Item>
          ) : (
            this.handleAttributeDescription(value)
          ),
      },
      {
        title: intl.get(`${prefix}.name`).d('名称'),
        dataIndex: 'name',
        width: 250,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('name', {
                initialValue: value,
              })(<Input disabled={productTypeFlag === 1 || assetSetFlag === 1} />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefix}.assetQuantity`).d('数量'),
        dataIndex: 'assetQuantity',
        width: 120,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('assetQuantity', {
                initialValue: value,
              })(
                <InputNumber
                  min={0}
                  step={0.1}
                  onChange={val => this.handleSetTotalPrice(val, record, 'assetQuantity')}
                />
              )}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefix}.uom`).d('单位'),
        dataIndex: 'uomMeaning',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('uomId', {
                initialValue: record.uomId,
              })(
                <Lov
                  code="AMDM.UOM"
                  textValue={record.uomMeaning}
                  queryParams={{ organizationId: tenantId }}
                />
              )}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefix}.assetPrice`).d('单价'),
        dataIndex: 'assetPrice',
        width: 120,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('assetPrice', {
                initialValue: value,
              })(
                <InputNumber
                  min={0}
                  step={0.01}
                  onChange={val => this.handleSetTotalPrice(val, record, 'assetPrice')}
                />
              )}
            </Form.Item>
          ) : (
            this.renderAmount(value)
          ),
      },
      {
        title: intl.get(`${prefix}.price`).d('金额'),
        dataIndex: 'price',
        width: 120,
        render: (_, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('price', {
                initialValue: `${record.assetQuantity * record.assetPrice}`,
              })(<InputNumber step={0.01} disabled />)}
            </Form.Item>
          ) : (
            this.renderAmount(record.assetQuantity * record.assetPrice)
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 80,
        dataIndex: 'operate',
        render: (val, record) =>
          record._status === 'create' ? (
            <a onClick={() => onCleanLine(record)}>
              {intl.get('hzero.common.button.clean').d('清除')}
            </a>
          ) : record._status === 'update' ? (
            <a onClick={() => onEditLine(record, false)}>
              {intl.get('hzero.common.button.cancel').d('取消')}
            </a>
          ) : (
            <a onClick={() => onEditLine(record, true)}>
              {intl.get('hzero.common.button.edit').d('编辑')}
            </a>
          ),
      },
    ];
    const newColumns = this.handleRemoveColumn(columns);
    return (
      <Modal
        destroyOnClose
        width={1170}
        maskClosable={false}
        title={intl.get(`${prefix}.modalName`).d('选择产品类别/资产组')}
        visible={modalVisible}
        onOk={versionStatus === 'PRESET' ? onSave : onCancel}
        confirmLoading={saveLoading}
        okText={
          versionStatus === 'PRESET'
            ? intl.get('hzero.common.button.save').d('保存')
            : intl.get('hzero.common.button.save').d('关闭')
        }
        onCancel={onCancel}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
      >
        <React.Fragment>
          <Row style={{ marginBottom: 10 }}>
            <Col>
              <Button
                type="primary"
                onClick={onNew}
                style={{
                  marginRight: 10,
                  display: versionStatus === 'PRESET' ? 'inline' : 'none',
                }}
              >
                {intl.get('hzero.common.button.create').d('新建')}
              </Button>
              <Button
                disabled={isEmpty(selectedRowKeys)}
                onClick={onDelete}
                style={{
                  marginRight: 10,
                  display: versionStatus === 'PRESET' ? 'inline' : 'none',
                }}
              >
                {intl.get('hzero.common.button.delete').d('删除')}
              </Button>
              <ExcelExport
                requestUrl={`${HALM_PPM}/v1/${tenantId}/project-budget-asset/export`}
                queryParams={{ proBudgetItemId }}
              />
            </Col>
          </Row>
          <Row>
            <EditTable
              bordered
              rowKey="proAssetId"
              columns={newColumns}
              loading={loading}
              dataSource={dataSource}
              pagination={pagination}
              rowSelection={{
                selectedRowKeys,
                onChange: onSelectRow,
              }}
              onChange={page => onSearch(page)}
            />
          </Row>
          <AttributeModal {...attributeModalProps} />
        </React.Fragment>
      </Modal>
    );
  }
}
export default AssetModal;
