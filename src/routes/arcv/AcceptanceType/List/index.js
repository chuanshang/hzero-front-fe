/**
 * 验收单类型入口-列表
 * @date: 2019-04-17
 * @author: QZQ <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Button } from 'hzero-ui';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { isUndefined, isEmpty } from 'lodash';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { HALM_ATN } from '@/utils/config';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ acceptanceType, loading }) => ({
  acceptanceType,
  loading: {
    search: loading.effects['acceptanceType/fetchAcceptanceType'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: ['aafm.common', 'arcv.acceptanceType'],
})
class AcceptanceType extends Component {
  form;
  componentDidMount() {
    const {
      tenantId,
      dispatch,
      acceptanceType: { state: { _back } = {}, pagination = {} },
    } = this.props;
    // 校验是否从详情页返回
    const page = _back === -1 ? pagination : {};
    this.handleSearch(page);
    dispatch({ type: 'acceptanceType/fetchLov', payload: { tenantId } });
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
      type: 'acceptanceType/fetchAcceptanceType',
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
  handleAcceptanceType() {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/arcv/acceptance-type/create`,
      })
    );
  }
  /**
   * 禁用/启用
   */
  @Bind()
  handleChange(record, flag) {
    const { tenantId, dispatch } = this.props;
    if (flag) {
      dispatch({
        type: 'acceptanceType/enabledAcceptanceType',
        payload: { tenantId, acceptanceTypeId: record.acceptanceTypeId },
      }).then(res => {
        if (res) {
          notification.success();
          this.handleSearch();
        }
      });
    } else {
      dispatch({
        type: 'acceptanceType/disabledAcceptanceType',
        payload: { tenantId, acceptanceTypeId: record.acceptanceTypeId },
      }).then(res => {
        if (res) {
          notification.success();
          this.handleSearch();
        }
      });
    }
  }
  /**
   * 页面跳转
   * @param {string} acceptanceTypeId - 资产专业管理ID
   */
  @Bind()
  handleGoToDetail(acceptanceTypeId) {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/arcv/acceptance-type/detail/${acceptanceTypeId}`,
      })
    );
  }
  render() {
    const {
      loading,
      tenantId,
      acceptanceType: { list = [], pagination = {}, acceptanceType = [], transferFixed = [] },
    } = this.props;
    const { search } = loading;
    const exportParams = this.form ? this.form.getFieldsValue() : {};
    const filterProps = {
      tenantId,
      transferFixed,
      acceptanceType,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };
    const listProps = {
      pagination,
      loading: search,
      dataSource: list,
      onSearch: this.handleSearch,
      onChangeStatus: this.handleChange,
      onEditLine: this.handleGoToDetail,
      onHandleGoToDetail: this.handleGoToDetail,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('arcv.acceptanceType.view.message.title').d('验收单类型')}>
          <Button icon="plus" type="primary" onClick={this.handleAcceptanceType}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_ATN}/v1/${tenantId}/acceptance-type/export`}
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
export default AcceptanceType;
