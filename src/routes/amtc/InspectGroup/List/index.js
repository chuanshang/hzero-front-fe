/**
 * InspectGroup - 标准检查组
 * @date: 2019-5-17
 * @author: qzq <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Button } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty } from 'lodash';
import { routerRedux } from 'dva/router';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { HALM_MTC } from '@/utils/config';
import intl from 'utils/intl';
import notification from 'utils/notification';
import ListTable from './ListTable';
import FilterForm from './FilterForm';

@connect(({ inspectGroup, loading }) => ({
  inspectGroup,
  tenantId: getCurrentOrganizationId(),
  loading: {
    fetchListLoading: loading.effects['inspectGroup/fetchInspectGroupList'],
  },
}))
class InspectGroup extends Component {
  form;
  /**
   * state初始化
   * @param {props} props -参数
   */
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {
      tenantId,
      dispatch,
      inspectGroup: { pagination = {} },
      location: { state: { _back } = {} },
    } = this.props;
    // 校验是否从详情页返回
    const page = _back === -1 ? pagination : {};
    dispatch({ type: 'inspectGroup/fetchLov', payload: { tenantId } });
    this.handleSearch(page);
  }
  /**
   *  查询列表
   * @param {object} page 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch, tenantId } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'inspectGroup/fetchInspectGroupList',
      payload: {
        tenantId,
        ...filterValues,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 新增
   * 跳转到新增明细页
   */
  @Bind()
  handleAdd() {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/amtc/inspect-group/create` }));
  }
  /**
   * 跳转到详情页
   * @param {string} id id
   */
  @Bind()
  handleLinkToDetail(id) {
    const { dispatch } = this.props;
    const linkUrl = isUndefined(id) ? 'create' : `detail/${id}`;
    dispatch(
      routerRedux.push({
        pathname: `/amtc/inspect-group/${linkUrl}`,
      })
    );
  }

  /**
   * 启用/禁用
   * @param {object} record
   * @param {boolean} flag
   */
  @Bind()
  handleChangeEnabled(record, flag) {
    const { dispatch, tenantId } = this.props;
    if (flag) {
      dispatch({
        type: 'inspectGroup/enabledInspectGroup',
        payload: {
          tenantId,
          checklistGroupId: record.checklistGroupId,
        },
      }).then(r => {
        if (r) {
          notification.success();
          this.handleSearch();
        }
      });
    } else {
      dispatch({
        type: 'inspectGroup/disabledInspectGroup',
        payload: {
          tenantId,
          checklistGroupId: record.checklistGroupId,
        },
      }).then(r => {
        if (r) {
          notification.success();
          this.handleSearch();
        }
      });
    }
  }

  render() {
    const {
      inspectGroup,
      tenantId,
      loading: { fetchListLoading },
      pagination = {},
    } = this.props;
    const { checkGroupTypeList, list = [] } = inspectGroup;
    const filterProps = {
      checkGroupTypeList,
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      pagination,
      dataSource: list,
      loading: fetchListLoading,
      onSearch: this.handleSearch,
      onSwitch: this.handleChangeEnabled,
      onLinkToDetail: this.handleLinkToDetail,
    };
    const fieldValues = this.form ? this.form.getFieldsValue() : {};
    return (
      <React.Fragment>
        <Header title={intl.get(`amtc.inspectGroup.view.message.title`).d('标准检查组')}>
          <Button icon="plus" type="primary" onClick={this.handleAdd}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_MTC}/v1/${tenantId}/inspect-group/export`}
            queryParams={fieldValues}
          />
        </Header>
        <Content>
          <div className="table-list-search">
            <FilterForm {...filterProps} />
          </div>
          <ListTable {...listProps} />
        </Content>
      </React.Fragment>
    );
  }
}
export default InspectGroup;
