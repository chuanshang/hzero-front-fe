import React, { PureComponent } from 'react';
import { isNumber, sum } from 'lodash';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { yesOrNoRender } from 'utils/renderer';
import { Bind } from 'lodash-decorators';

const modelPrompt = 'amdm.productCategpry.model.productCategpry';
/**
 * 资产组数据列表
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
export default class ListTable extends PureComponent {
  /**
   * render
   * @returns React.element
   */

  @Bind()
  handleCheckProductCode(record) {
    if (record.$form.getFieldValue('productCategoryCodeEnable') === 1) {
      record.$form.setFieldsValue({ productCategoryCode: '' });
    }
  }
  handleCell(length) {
    return {
      style: {
        overflow: 'hidden',
        maxWidth: length,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      onClick: e => {
        const { target } = e;
        if (target.style.whiteSpace === 'normal') {
          target.style.whiteSpace = 'nowrap';
        } else {
          target.style.whiteSpace = 'normal';
        }
      },
    };
  }
  render() {
    const {
      loading,
      dataSource,
      expandedRowKeys,
      onLinkToDetail,
      onAddLine,
      onForbidLine,
      onEnabledLine,
      onExpand,
    } = this.props;
    const columns = [
      {
        title: intl.get(`amdm.common.model.name`).d('名称'),
        dataIndex: 'locationName',
        width: 300,
        render: (value, record) => (
          <a onClick={() => onLinkToDetail(record.assetLocationId)}>{value}</a>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.title`).d('位置标题'),
        dataIndex: 'locationTitle',
        onCell: () => this.handleCell(180), // width * 1.2
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.locationTypeCode`).d('位置类型'),
        dataIndex: 'locationTypeMeaning',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.maintSites`).d('服务区域'),
        dataIndex: 'maintSitesName',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.assetLocationFlag`).d('可放置设备/资产'),
        dataIndex: 'assetLocationFlag',
        width: 120,
        align: 'center',
        render: yesOrNoRender,
      },
      {
        title: intl.get(`${modelPrompt}.costCenterCode`).d('成本中心'),
        dataIndex: 'costCenterCode',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.stockFlag`).d('是否库存'),
        dataIndex: 'stockFlag',
        width: 100,
        align: 'center',
        render: yesOrNoRender,
      },
      {
        title: intl.get(`${modelPrompt}.serviceOrgCode`).d('服务机构'),
        dataIndex: 'serviceOrgCodeMeaning',
        width: 120,
      },
      {
        title: intl.get(`amdm.common.model.description`).d('描述'),
        dataIndex: 'description',
        onCell: () => this.handleCell(240), // width * 1.2
        // width: 200,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 200,
        align: 'center',
        render: (val, record) =>
          record.enabledFlag ? (
            <span className="action-link">
              <a onClick={() => onAddLine(record.assetLocationId, true)}>
                {intl.get('hzero').d('新增下级')}
              </a>
              <a onClick={() => onForbidLine(record)}>
                {intl.get('hzero.common.status.disable').d('禁用')}
              </a>
            </span>
          ) : (
            <span className="action-link">
              <a onClick={() => onAddLine(record.assetLocationId, true)}>
                {intl.get('hzero').d('新增下级')}
              </a>
              <a style={{ color: '#F04134' }}>
                {intl.get('hzero.common.status.disable').d('禁用')}
              </a>
              <a onClick={() => onEnabledLine(record)}>
                {intl.get('hzero.common.status.enable').d('启用')}
              </a>
            </span>
          ),
      },
    ];
    const scrollX = sum(columns.map(n => (isNumber(n.width) ? n.width : 200)));
    return (
      <div className="table-list-search">
        <Table
          bordered
          expandedRowKeys={expandedRowKeys}
          rowKey="assetLocationId"
          loading={loading}
          onExpand={onExpand}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: scrollX }}
        />
      </div>
    );
  }
}
