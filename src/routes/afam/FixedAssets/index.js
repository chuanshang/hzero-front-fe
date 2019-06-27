/**
 * TransactionTypes - 资产事务处理类型
 * @date: 2019-3-20
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
import { HALM_ATN } from '@/utils/config';
import intl from 'utils/intl';
import ListTable from './ListTable';
import FilterForm from './FilterForm';

@connect(({ fixedAssets, loading }) => ({
  fixedAssets,
  tenantId: getCurrentOrganizationId(),
  loading: {
    fetchListLoading: loading.effects['fixedAssets/queryFixedAssetsList'],
  },
}))
class FixedAssets extends Component {
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
      fixedAssets: { pagination = {} },
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
      type: 'fixedAssets/queryFixedAssetsList',
      payload: {
        tenantId,
        ...filterValues,
        transferDateFrom: filterValues.transferDateFrom
          ? moment(filterValues.transferDateFrom).format(getDateTimeFormat())
          : null,
        transferDateTo: filterValues.transferDateTo
          ? moment(filterValues.transferDateTo).format(getDateTimeFormat())
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
    dispatch(routerRedux.push({ pathname: `/afam/fixed-assets/create` }));
  }

  /**
   * 删除
   * 跳转到新增明细页
   */
  @Bind()
  handleDelete() {
    const { id, tenantId, dispatch, fixedAssets } = this.props;
    const { dataList = [] } = fixedAssets;
    const { selectedRows } = this.state;
    Modal.confirm({
      iconType: '',
      content: intl
        .get('afam.fixedAssets.view.message.detailLine.delete')
        .d('是否删除选中的固定资产？'),
      onOk: () => {
        const newDataList = dataList;
        selectedRows.forEach(element1 => {
          dataList.forEach(element2 => {
            if (element1.fixedAssetId === element2.fixedAssetId) {
              newDataList.splice(
                newDataList.findIndex(item => item.fixedAssetId === element2.fixedAssetId),
                1
              );
            }
          });
        });
        dispatch({
          type: 'fixedAssets/deleteFixedAssets',
          payload: {
            tenantId,
            projectId: id,
            data: [...selectedRows],
          },
        }).then(res => {
          if (res) {
            dispatch({
              type: 'fixedAssets/updateState',
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
        pathname: `/afam/fixed-assets/${linkUrl}`,
      })
    );
  }

  render() {
    const {
      fixedAssets,
      tenantId,
      loading: { fetchListLoading },
      pagination = {},
    } = this.props;
    const { dataList = [] } = fixedAssets;
    const { selectedRowKeys = [] } = this.state;
    const filterProps = {
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
        <Header title={intl.get(`afam.fixedAssets.view.message.title`).d('固定资产')}>
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
            requestUrl={`${HALM_ATN}/v1/${tenantId}/fixed-assets/export`}
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
export default FixedAssets;
