import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';

class AcceptanceAssetList extends PureComponent {
  render() {
    const { isNew, editFlag, dataSource, AcceptanceAssetPanelReadOnly, onEdit } = this.props;
    const promptCode = 'arcv.acceptance.model.acceptanceAsset';
    const columns = [
      {
        title: intl.get(`${promptCode}.assetNum`).d('资产编号'),
        dataIndex: 'assetNum',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.assetClassMeaning`).d('资产类别'),
        dataIndex: 'assetClassMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.assetsSetMeaning`).d('资产组'),
        dataIndex: 'assetsSetMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.supplierHeaderMeaning`).d('供应商'),
        dataIndex: 'supplierHeaderMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.brand`).d('品牌/厂商'),
        dataIndex: 'brand',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.model`).d('规格型号'),
        dataIndex: 'model',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.assetStatusMeaning`).d('资产状态'),
        dataIndex: 'assetStatusMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.assetLocationMeaning`).d('资产位置'),
        dataIndex: 'assetLocationMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.owningOrgMeaning`).d('所属组织'),
        dataIndex: 'owningOrgMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.usingOrgMeaning`).d('使用组织'),
        dataIndex: 'usingOrgMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.owningPersonMeaning`).d('固资管理员'),
        dataIndex: 'owningPersonMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.userPersonMeaning`).d('使用人'),
        dataIndex: 'userPersonMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.costCenterMeaning`).d('成本中心'),
        dataIndex: 'costCenterMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.originalCost`).d('获取价格'),
        dataIndex: 'originalCost',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.parentAssetMeaning`).d('父资产'),
        dataIndex: 'parentAssetMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.transferFixedMeaning`).d('转固'),
        dataIndex: 'transferFixedMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.completeFlagMeaning`).d('资产信息是否完整'),
        dataIndex: 'completeFlagMeaning',
        width: 100,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 100,
        align: 'center',
        render: (val, record) => (
          <div>
            <a style={{ marginRight: '15px' }} onClick={() => onEdit(record)}>
              {(isNew || editFlag) && !AcceptanceAssetPanelReadOnly
                ? intl.get('hzero.common.button.edit').d('编辑')
                : intl.get('hzero.common.button.detail').d('详细')}
            </a>
          </div>
        ),
      },
    ];
    return <Table bordered rowKey="acceptanceAssetId" columns={columns} dataSource={dataSource} />;
  }
}
export default AcceptanceAssetList;
