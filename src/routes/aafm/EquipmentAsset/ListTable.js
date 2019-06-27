import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import moment from 'moment';
import { getDateFormat } from 'utils/utils';
import { dateRender, yesOrNoRender } from 'utils/renderer';
import intl from 'utils/intl';

class ListTable extends PureComponent {
  render() {
    const {
      loading,
      dataSource,
      pagination,
      onSearch,
      onEdit,
      selectedRowKeys,
      onSelectRow,
    } = this.props;
    const promptCode = 'aafm.equipmentAsset.model.equipmentAsset';
    const columns = [
      {
        title: intl.get(`${promptCode}.assetDesc`).d('资产全称'),
        dataIndex: 'assetDesc',
        width: 250,
        fixed: true,
        render: (val, record) => <a onClick={() => onEdit(record.assetId)}>{val}</a>,
      },
      {
        title: intl.get(`${promptCode}.name`).d('资产标签/铭牌'),
        dataIndex: 'name',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.assetsSetName`).d('资产组'),
        dataIndex: 'assetsSetName',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.assetClassCode`).d('资产类别'),
        dataIndex: 'assetClassMeaning',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.assetSpecialty`).d('资产专业归类'),
        dataIndex: 'assetSpecialtyName',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.location`).d('资产位置'),
        dataIndex: 'assetLocationName',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.owningOrg`).d('所属组织'),
        dataIndex: 'owningOrgName',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.usingOrgName`).d('使用组织'),
        dataIndex: 'usingOrgName',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.userPersonName`).d('使用人'),
        dataIndex: 'userPersonName',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.assetCriticality`).d('资产重要性'),
        dataIndex: 'assetCriticalityMeaning',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.warrantyExpireDate`).d('质保到期日'),
        dataIndex: 'warrantyExpireDate',
        width: 100,
        align: 'center',
        render: dateRender,
      },
      {
        title: intl.get(`${promptCode}.Expire`).d('是否已经到期'),
        dataIndex: 'warrantyExpireDate',
        width: 150,
        align: 'center',
        render: val =>
          yesOrNoRender(
            moment(new Date()).format(getDateFormat()) > moment(val).format(getDateFormat()) ? 1 : 0
          ),
      },
    ];
    return (
      <Table
        bordered
        scroll={{ x: 1850 }}
        rowKey="assetId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectRow,
        }}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTable;
