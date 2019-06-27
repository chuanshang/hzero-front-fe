/**
 * 资产专业管理创建/编辑-列表
 * @date: 2019-2-25
 * @author: QZQ <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Button } from 'hzero-ui';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty } from 'lodash';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { HALM_ATN } from '@/utils/config';
import { getCurrentOrganizationId, filterNullValueObject, getEditTableData } from 'utils/utils';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ assetSpecialty, loading }) => ({
  assetSpecialty,
  loading: {
    search: loading.effects['assetSpecialty/fetchAssetSpecialty'],
    save: loading.effects['assetSpecialty/saveAssetSpecialty'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: ['aafm.common', 'aafm.assetSpecialty'],
})
class AssetSpecialty extends Component {
  form;
  componentDidMount() {
    const {
      assetSpecialty: { state: { _back } = {}, pagination = {} },
    } = this.props;
    // 校验是否从详情页返回
    const page = _back === -1 ? pagination : {};
    this.handleSearch(page);
  }
  /**
   * 页面查询
   * @param {object} fields - 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch, tenantId } = this.props;
    let filterValues = {};
    if (!isUndefined(this.form)) {
      const formValue = this.form.getFieldsValue();
      filterValues = filterNullValueObject(formValue);
    }
    dispatch({
      type: 'assetSpecialty/fetchAssetSpecialty',
      payload: {
        tenantId,
        page: isEmpty(fields) ? {} : fields,
        ...filterValues,
      },
    });
  }
  /**
   * 传递表单对象
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }
  /**
   * 创建
   */
  @Bind()
  handleAssetSpecialty() {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/aafm/asset-specialty/create`,
      })
    );
    dispatch({
      type: 'assetSpecialty/updateState',
      payload: {
        detailList: [],
      },
    });
  }
  /**
   * 获取form数据
   */
  @Bind()
  handleGetFormValue() {
    const filterForm = this.form;
    const filterValues = isUndefined(filterForm)
      ? {}
      : filterNullValueObject(filterForm.getFieldsValue());
    return filterValues;
  }
  /**
   * 页面跳转
   * @param {string} assetSpecialtyId - 资产专业管理ID
   */
  @Bind()
  handleGoToDetail(assetSpecialtyId) {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/aafm/asset-specialty/detail/${assetSpecialtyId}`,
      })
    );
  }
  /**
   * 保存表单数据
   */
  @Bind()
  handleDataSave() {
    const {
      dispatch,
      tenantId,
      assetSpecialty: { list },
    } = this.props;
    const params = getEditTableData(list.filter(i => i._status === 'update'));
    if (Array.isArray(params) && params.length > 0) {
      // 编辑
      dispatch({
        type: 'assetSpecialty/updateAssetSpecialty',
        payload: {
          tenantId,
          data: [...params],
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
      assetSpecialty: { list = [] },
    } = this.props;
    const newList = list.map(item =>
      item.assetSpecialtyId === current.assetSpecialtyId
        ? { ...item, assetToOrgList: [], _status: flag ? 'update' : '' }
        : item
    );
    dispatch({
      type: 'assetSpecialty/updateState',
      payload: {
        list: newList,
      },
    });
  }
  render() {
    const {
      loading,
      tenantId,
      assetSpecialty: { list = [], pagination = {} },
    } = this.props;
    const exportParams = this.form ? this.form.getFieldsValue() : {};
    const filterProps = {
      tenantId,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };
    const listProps = {
      pagination,
      loading: loading.search,
      dataSource: list,
      onSearch: this.handleSearch,
      onEdit: this.handleEditLine,
      onHandleGoToDetail: this.handleGoToDetail,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('aafm.assetSpecialty.view.message.title').d('资产专业管理')}>
          <Button icon="plus" type="primary" onClick={this.handleAssetSpecialty}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button icon="save" loading={loading.save} onClick={this.handleDataSave}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_ATN}/v1/${tenantId}/asset-specialty/export`}
            queryParams={exportParams}
          />
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
        </Content>
      </React.Fragment>
    );
  }
}
export default AssetSpecialty;
