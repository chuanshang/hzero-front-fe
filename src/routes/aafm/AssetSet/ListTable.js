import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
// import classNames from 'classnames';
import { enableRender } from 'utils/renderer';
import intl from 'utils/intl';
// import styles from './index.less';

/**
 * 资产组数据列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} onSearch - 分页查询
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @reactProps {object} pagination - 分页器
 * @reactProps {Number} pagination.current - 当前页码
 * @reactProps {Number} pagination.pageSize - 分页大小
 * @reactProps {Number} pagination.total - 数据总量
 * @return React.element
 */
export default class ListTable extends PureComponent {
  /**
   * render
   * @returns React.element
   */
  render() {
    const { loading, dataSource, pagination, onSearch, onEdit } = this.props;
    const prefix = `aafm.assetSet.model.assetSet`;
    const columns = [
      {
        title: intl.get(`aafm.common.model.num`).d('编号'),
        dataIndex: 'assetsSetNum',
        width: 150,
        render: (val, record) => <a onClick={() => onEdit(record.assetsSetId)}>{val}</a>,
      },
      {
        title: intl.get(`aafm.common.model.name`).d('资产组名称'),
        dataIndex: 'assetsSetName',
        width: 250,
        render: (val, record) => <a onClick={() => onEdit(record.assetsSetId)}>{val}</a>,
      },
      {
        title: intl.get(`${prefix}.assetName`).d('资产名称'),
        dataIndex: 'assetName',
        width: 90,
      },
      {
        title: intl.get(`${prefix}.assetClassCode`).d('产品类别/资产分类'),
        dataIndex: 'assetClassMeaning',
        width: 140,
      },
      {
        title: intl.get(`${prefix}.brand`).d('品牌/厂商'),
        dataIndex: 'brand',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.specifications`).d('规格型号'),
        dataIndex: 'specifications',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.specialAsset`).d('所属特殊资产'),
        dataIndex: 'specialAssetMeaning',
        width: 120,
      },
      {
        title: intl.get(`${prefix}.assetCriticality`).d('资产重要性'),
        dataIndex: 'assetCriticalityMeaning',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.specialAssetClass`).d('资产专业归类'),
        dataIndex: 'specialAssetClassMeaning',
        width: 120,
      },
      {
        title: intl.get(`${prefix}.fixedAssetType`).d('固定资产类别'),
        dataIndex: 'fixedAssetTypeMeaning',
        width: 120,
      },
      {
        title: intl.get(`${prefix}.attributeSet`).d('属性组'),
        dataIndex: 'attributeSetMeaning',
        width: 100,
      },
      {
        title: intl.get(`hzero.common.enabledFlag`).d('是否启用'),
        dataIndex: 'enabledFlag',
        width: 100,
        render: enableRender,
      },
    ];
    return (
      <Table
        bordered
        rowKey="assetsSetId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        onChange={page => onSearch(page)}
      />
    );
  }
}
