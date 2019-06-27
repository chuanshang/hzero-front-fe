/**
 * WorkOrder - 工单管理
 * @date: 2019-4-18
 * @author: hq <qing.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Button, Modal } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty } from 'lodash';
import { routerRedux } from 'dva/router';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { getCurrentOrganizationId, filterNullValueObject, getDateTimeFormat } from 'utils/utils';
import moment from 'moment';
import { HALM_MTC } from '@/utils/config';
import intl from 'utils/intl';
import ListTable from './ListTable';
import FilterForm from './FilterForm';

@connect(({ workOrder, loading }) => ({
  workOrder,
  tenantId: getCurrentOrganizationId(),
  loading: {
    fetchListLoading: loading.effects['workOrder/queryWorkOrdersList'],
  },
}))
class WorkOrder extends Component {
  form;
  /**
   * state初始化
   * @param {props} props -参数
   */
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
    };
  }

  componentDidMount() {
    const {
      workOrder: { pagination = {} },
      location: { state: { _back } = {} },
    } = this.props;
    // 校验是否从详情页返回
    const page = _back === -1 ? pagination : {};
    this.handleSearch(page);
  }

  /**
   * 数据行选择操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
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
      type: 'workOrder/queryWorkOrdersList',
      payload: {
        tenantId,
        ...filterValues,
        planStartDateFrom: filterValues.planStartDateFrom
          ? moment(filterValues.planStartDateFrom).format(getDateTimeFormat())
          : null,
        planStartDateTo: filterValues.planStartDateTo
          ? moment(filterValues.planStartDateTo).format(getDateTimeFormat())
          : null,
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
    dispatch({
      type: 'workOrder/updateState',
      payload: {
        materialList: [],
        materialReturnList: [],
        materialPagination: {},
        materialReturnPagination: {},
      },
    });
    dispatch(routerRedux.push({ pathname: `/amtc/work-order/create` }));
  }

  /**
   * 删除
   * 跳转到新增明细页
   */
  @Bind()
  handleDelete() {
    const { id, tenantId, dispatch, workOrder } = this.props;
    const { dataList = [] } = workOrder;
    const { selectedRows } = this.state;
    Modal.confirm({
      iconType: '',
      content: intl.get('amtc.workOrder.view.message.detailLine.delete').d('是否删除选中的工单？'),
      onOk: () => {
        const newDataList = dataList;
        selectedRows.forEach(element1 => {
          dataList.forEach(element2 => {
            if (element1.workorderId === element2.workorderId) {
              newDataList.splice(
                newDataList.findIndex(item => item.workorderId === element2.workorderId),
                1
              );
            }
          });
        });
        dispatch({
          type: 'workOrder/deleteWorkOrder',
          payload: {
            tenantId,
            projectId: id,
            data: [...selectedRows],
          },
        }).then(res => {
          if (res) {
            dispatch({
              type: 'workOrder/updateState',
              payload: {
                dataList: [...newDataList],
              },
            });
            this.setState({
              selectedRowKeys: [],
              selectedRows: [],
            });
          }
        });
      },
    });
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
        pathname: `/amtc/work-order/${linkUrl}`,
      })
    );
  }

  render() {
    const {
      workOrder,
      tenantId,
      loading: { fetchListLoading },
      pagination = {},
    } = this.props;
    const { dataList = [], selectMaps } = workOrder;
    const { selectedRowKeys = [] } = this.state;
    const filterProps = {
      selectMaps,
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      selectedRowKeys,
      loading: fetchListLoading,
      dataSource: dataList,
      pagination,
      onSelectRow: this.handleSelectRow,
      onSearch: this.handleSearch,
      onLinkToDetail: this.handleLinkToDetail,
    };
    const fieldValues = this.form ? this.form.getFieldsValue() : {};
    return (
      <React.Fragment>
        <Header title={intl.get(`amtc.workorder.view.message.title`).d('工单管理')}>
          <Button icon="plus" type="primary" onClick={this.handleAdd}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button
            icon="delete"
            disabled={isEmpty(selectedRowKeys)}
            onClick={() => this.handleDelete()}
          >
            {intl.get('hzero.common.button.delete').d('删除')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_MTC}/v1/${tenantId}/work-orders/export`}
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
export default WorkOrder;
