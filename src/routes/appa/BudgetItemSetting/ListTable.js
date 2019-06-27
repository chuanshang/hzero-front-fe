import React, { PureComponent } from 'react';
import { Form, Input, Select, Popconfirm, Icon } from 'hzero-ui';
import intl from 'utils/intl';
import { yesOrNoRender, enableRender } from 'utils/renderer';
import EditTable from 'components/EditTable';
import Switch from 'components/Switch';
import { Bind } from 'lodash-decorators';
import styles from './index.less';

/**
 * 预算项设置数据列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} onCleanLine - 清除行
 * @reactProps {Function} onEditLine - 编辑行
 * @reactProps {Function} onSearch - 分页查询
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @reactProps {object} pagination - 分页器
 * @reactProps {Number} pagination.current - 当前页码
 * @reactProps {Number} pagination.pageSize - 分页大小
 * @reactProps {Number} pagination.total - 数据总量
 * @return React.element
 */
class ListTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      productFlag: {}, // 产品类型
      assetFlag: {}, // 资产组
    };
  }

  @Bind()
  handleSwitchChange(val, record, flag) {
    const { productFlag, assetFlag } = this.state;
    switch (flag) {
      case 'product':
        this.setState({
          productFlag: { ...productFlag, [record.itemId]: val },
        });
        break;
      case 'asset':
        this.setState({
          assetFlag: { ...assetFlag, [record.itemId]: val },
        });
        break;
      default:
    }
  }
  render() {
    const {
      loading,
      budgetItemType,
      dataSource,
      reportRequirements,
      expandedRowKeys,
      onEditLine,
      onAddLine,
      onForbidLine,
      onEnabledLine,
      onExpand,
      onCancelLine,
      onShowModal,
      onAddNode,
    } = this.props;
    const { productFlag, assetFlag } = this.state;
    const modelPrompt = 'appa.budgetItemSetting.model.budgetItemSetting';
    const columns = [
      {
        title: intl.get(`${modelPrompt}.levelNumber`).d('层级'),
        dataIndex: 'levelNumber',
        width: 150,
        render: (val, record) =>
          record.nodeType === 'NODE' ? (
            <span>
              <Icon type="bars" style={{ color: '#2db7f5' }} /> {val + 1}
            </span>
          ) : (
            ''
          ),
      },
      {
        title: intl.get(`${modelPrompt}.name`).d('预算项/节点'),
        dataIndex: 'itemName',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('itemName', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.name`).d('预算项'),
                    }),
                  },
                  {
                    max: 60,
                    message: intl.get('hzero.common.validation.max', {
                      max: 60,
                    }),
                  },
                ],
              })(<Input />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${modelPrompt}.typeCode`).d('类型'),
        dataIndex: 'itemTypeCode',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && record.levelNumber === 0 ? (
            <Form.Item>
              {record.$form.getFieldDecorator('itemTypeCode', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.typeCode`).d('类型'),
                    }),
                  },
                ],
              })(
                <Select>
                  {budgetItemType.map(i => (
                    <Select.Option key={i.value}>{i.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : record.levelNumber === 0 ? (
            record.itemTypeCodeMeaning
          ) : (
            ''
          ),
      },
      {
        title: intl.get(`${modelPrompt}.reportRequirement`).d('填报要求'),
        dataIndex: 'reportRequirement',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && record.nodeType === 'BUDGET' ? (
            <Form.Item>
              {record.$form.getFieldDecorator('reportRequirement', {
                initialValue: record.reportRequirement,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.reportRequirement`).d('填报要求'),
                    }),
                  },
                ],
              })(
                <Select>
                  {reportRequirements.map(i => (
                    <Select.Option key={i.value}>{i.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            record.reportRequirementMeaning
          ),
      },
      {
        title: intl.get(`${modelPrompt}.ensureProductTypeFlag`).d('预算需明确产品类别'),
        dataIndex: 'ensureProductTypeFlag',
        width: 170,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) && record.nodeType === 'BUDGET' ? (
            <Form.Item>
              {record.$form.getFieldDecorator('ensureProductTypeFlag', {
                initialValue: val,
              })(<Switch onChange={value => this.handleSwitchChange(value, record, 'product')} />)}
            </Form.Item>
          ) : record.nodeType === 'BUDGET' ? (
            yesOrNoRender(val)
          ) : (
            ''
          ),
      },
      {
        title: intl.get(`${modelPrompt}.ensureAssetSetFlag`).d('预算需明确资产组/物料'),
        dataIndex: 'ensureAssetSetFlag',
        width: 160,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && record.nodeType === 'BUDGET' ? (
            <Form.Item>
              {record.$form.getFieldDecorator('ensureAssetSetFlag', {
                initialValue: value,
              })(<Switch onChange={val => this.handleSwitchChange(val, record, 'asset')} />)}
            </Form.Item>
          ) : record.nodeType === 'BUDGET' ? (
            yesOrNoRender(value)
          ) : (
            ''
          ),
      },
      {
        title: intl.get(`${modelPrompt}.enabledFlag`).d('是否启用'),
        dataIndex: 'enabledFlag',
        width: 100,
        render: enableRender,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 250,
        render: (val, record) =>
          record.nodeType === 'BUDGET' ? (
            record._status === 'create' ? ( // 预算项
              <a onClick={() => onCancelLine(record)}>
                {intl.get('hzero.common.button.clean').d('清除')}
              </a>
            ) : record._status === 'update' ? (
              <span className="action-link">
                <a onClick={() => onEditLine(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a
                  style={{
                    display:
                      productFlag[record.itemId] || assetFlag[record.itemId]
                        ? productFlag[record.itemId] === 1 || assetFlag[record.itemId] === 1
                        : record.ensureProductTypeFlag === 1 || record.ensureAssetSetFlag === 1
                        ? 'inline'
                        : 'none',
                  }}
                  onClick={() => onShowModal(record)}
                >
                  {intl.get(`${modelPrompt}.show`).d('产品类别/资产组')}
                </a>
              </span>
            ) : record.enabledFlag ? (
              <span className="action-link">
                <a onClick={() => onEditLine(record, true)}>
                  {intl.get('hzero.common.button.edit').d('编辑')}
                </a>
                <a
                  style={{
                    display:
                      record.ensureProductTypeFlag === 0 && record.ensureAssetSetFlag === 0
                        ? 'none'
                        : 'inline',
                  }}
                  onClick={() => onShowModal(record)}
                >
                  {intl.get(`${modelPrompt}.show`).d('产品类别/资产组')}
                </a>
                <Popconfirm
                  title={intl.get(`${modelPrompt}.disabledTitle`).d('是否禁用数据')}
                  onConfirm={() => onForbidLine(record)}
                  okText={intl.get('hzero.common.button.sure').d('确认')}
                  cancelText={intl.get('hzero.common.button.sure').d('取消')}
                >
                  <a>{intl.get('hzero.common.status.disable').d('禁用')}</a>
                </Popconfirm>
              </span>
            ) : (
              <span className="action-link">
                <a onClick={() => onEditLine(record, true)}>
                  {intl.get('hzero.common.button.edit').d('编辑')}
                </a>
                <a
                  style={{
                    display:
                      record.ensureProductTypeFlag === 0 && record.ensureAssetSetFlag === 0
                        ? 'none'
                        : 'inline',
                  }}
                  onClick={() => onShowModal(record)}
                >
                  {intl.get(`${modelPrompt}.show`).d('产品类别/资产组')}
                </a>
                <Popconfirm
                  title={intl.get(`${modelPrompt}.enabledTitle`).d('是否启用数据')}
                  onConfirm={() => onEnabledLine(record)}
                  okText={intl.get('hzero.common.button.sure').d('确认')}
                  cancelText={intl.get('hzero.common.button.sure').d('取消')}
                >
                  <a>{intl.get('hzero.common.status.enable').d('启用')}</a>
                </Popconfirm>
              </span>
            )
          ) : record._status === 'create' ? ( // 节点
            <a onClick={() => onCancelLine(record)}>
              {intl.get('hzero.common.button.clean').d('清除')}
            </a>
          ) : record._status === 'update' ? (
            <span className="action-link">
              <a onClick={() => onEditLine(record, false)}>
                {intl.get('hzero.common.button.cancel').d('取消')}
              </a>
              <a onClick={() => onAddLine(record)}>
                {intl.get('hzero.common.button.add.sub').d('新增预算项')}
              </a>
              <a onClick={() => onAddNode(record)}>
                {intl.get('hzero.common.button.add.sub').d('新增下级')}
              </a>
            </span>
          ) : record.enabledFlag ? (
            <span className="action-link">
              <a onClick={() => onEditLine(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
              <a onClick={() => onAddLine(record)}>
                {intl.get('hzero.common.button.add.sub').d('新增预算项')}
              </a>
              <a onClick={() => onAddNode(record)}>
                {intl.get('hzero.common.button.add.sub').d('新增下级')}
              </a>
              <Popconfirm
                title={intl.get(`${modelPrompt}.disabledTitle`).d('是否禁用该节点及节点下的预算项')}
                onConfirm={() => onForbidLine(record)}
                okText={intl.get('hzero.common.button.sure').d('确认')}
                cancelText={intl.get('hzero.common.button.sure').d('取消')}
              >
                <a>{intl.get('hzero.common.status.disable').d('禁用')}</a>
              </Popconfirm>
            </span>
          ) : (
            <span className="action-link">
              <a onClick={() => onEditLine(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
              <a onClick={() => onAddLine(record)}>
                {intl.get('hzero.common.button.add.sub').d('新增预算项')}
              </a>
              <a onClick={() => onAddNode(record)}>
                {intl.get('hzero.common.button.add.sub').d('新增下级')}
              </a>
              <Popconfirm
                title={intl.get(`${modelPrompt}.enabledTitle`).d('是否启用数据')}
                onConfirm={() => onEnabledLine(record)}
                okText={intl.get('hzero.common.button.sure').d('确认')}
                cancelText={intl.get('hzero.common.button.sure').d('取消')}
              >
                <a>{intl.get('hzero.common.status.enable').d('启用')}</a>
              </Popconfirm>
            </span>
          ),
      },
    ];
    return (
      <EditTable
        bordered
        expandedRowKeys={expandedRowKeys}
        rowKey="itemId"
        loading={loading}
        onExpand={onExpand}
        className={styles['budget-item-setting-show']}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    );
  }
}
export default ListTable;
