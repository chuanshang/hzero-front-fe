/**
 * AssetStatus - 资产状态
 * @date: 2019-2-20
 * @author: WH <heng.wei@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Button } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, getEditTableData } from 'utils/utils';
import ListTable from './ListTable';

@connect(({ assetStatus, loading }) => ({
  assetStatus,
  tenantId: getCurrentOrganizationId(),
  loading: {
    search: loading.effects['assetStatus/fetchAssetStatus'],
    save: loading.effects['assetStatus/saveAssetStatus'],
  },
}))
@formatterCollections({
  code: ['aafm.assetStatus'],
})
class AssetStatus extends Component {
  componentDidMount() {
    this.handleSearch();
  }
  @Bind()
  handleSearch() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'assetStatus/fetchAssetStatus',
      payload: {
        tenantId,
      },
    });
  }
  @Bind()
  handleDataSave() {
    const {
      dispatch,
      tenantId,
      assetStatus: { statusList },
    } = this.props;
    const params = getEditTableData(statusList.filter(i => i._status === 'update')).map(i => ({
      ...i,
      nextStatus: JSON.stringify(i.nextStatus),
    }));
    if (Array.isArray(params) && params.length > 0) {
      dispatch({
        type: 'assetStatus/saveAssetStatus',
        payload: {
          tenantId,
          data: params,
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.handleSearch();
        }
      });
    }
  }
  /**
   * 行 - 编辑/取消
   * @param {Object} current - 当前行对象
   * @param {Boolean} flag - 操作标记
   */
  @Bind()
  handleEditLine(current, flag) {
    const {
      dispatch,
      assetStatus: { statusList = [] },
    } = this.props;
    const newList = statusList.map(item =>
      item.assetStatusId === current.assetStatusId
        ? { ...item, _status: flag ? 'update' : '' }
        : item
    );
    dispatch({
      type: 'assetStatus/updateState',
      payload: {
        statusList: newList,
      },
    });
  }
  render() {
    const {
      loading,
      assetStatus: { statusList = [], sysStatus = [] },
    } = this.props;
    const listProps = {
      sysStatus,
      loading: loading.search,
      dataSource: statusList,
      onEdit: this.handleEditLine,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`aafm.assetStatus.view.message.title`).d('资产状态')}>
          <Button type="primary" icon="save" loading={loading.save} onClick={this.handleDataSave}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content>
          <ListTable {...listProps} />
        </Content>
      </React.Fragment>
    );
  }
}

export default AssetStatus;
