/**
 * AssetRoute - BOM
 * @date: 2019-4-18
 * @author: LYF <yufang.luo@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Header, Content } from 'components/Page';
import { Button, notification, Modal } from 'hzero-ui';
import intl from 'utils/intl';
import { isUndefined, isEmpty } from 'lodash';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { routerRedux } from 'dva/router';
// import notification from 'utils/notification';
import ExcelExport from 'components/ExcelExport';
import { HALM_MTC } from '@/utils/config';

import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ bom, loading }) => ({
  bom,
  loading: {
    list: loading.effects['bom/listBom'],
    delete: loading.effects['bom/deleteBom'],
  },
  tenantId: getCurrentOrganizationId(),
}))
class Bom extends Component {
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
      tenantId,
      dispatch,
      location: { state: { _back } = {} },
      bom: { pagination = {} },
    } = this.props;
    // 校验是否从详情页返回
    const page = _back === -1 ? pagination : {};
    dispatch({
      type: 'bom/init',
      payload: {
        tenantId,
      },
    });
    this.handleSearch(page);
  }

  /**
   * 数据查询
   * @param {object} page - 查询查询
   */
  @Bind()
  handleSearch(page = {}) {
    const { dispatch, tenantId } = this.props;
    const fieldValues = isUndefined(this.form)
      ? {}
      : filterNullValueObject(this.form.getFieldsValue());
    dispatch({
      type: 'bom/listBom',
      payload: {
        tenantId,
        ...fieldValues,
        page: isEmpty(page) ? {} : page,
      },
    });
  }

  /**
   * 删除BOM结构清单
   */
  @Bind()
  handleDelete() {
    const { dispatch, tenantId } = this.props;
    const { selectedRows } = this.state;
    Modal.confirm({
      iconType: '',
      content: intl.get('amtc.common.view.message.confirm.delete').d('是否删除BOM结构清单'),
      onOk: () => {
        dispatch({
          type: 'bom/deleteBom',
          payload: {
            tenantId,
            data: [...selectedRows],
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.handleSearch();
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
   * 跳转详情页面
   * @param bomId
   */
  @Bind()
  handleBomDetail(bomId) {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/amtc/bom/detail/${bomId}` }));
  }

  /**
   * 新增
   */
  @Bind()
  handleAddBom() {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/amtc/bom/create` }));
  }

  /**
   * 数据行选择操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  render() {
    const promptCode = 'amtc.bom';
    const { selectedRowKeys = [] } = this.state;
    const {
      loading,
      tenantId,
      bom: { list = [], pagination = {}, referenceModeMap = [], ParentTypeMap },
    } = this.props;
    const filterProps = {
      tenantId,
      ParentTypeMap,
      referenceModeMap,
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      pagination,
      loading,
      dataSource: list,
      selectedRowKeys,
      onSearch: this.handleSearch,
      onEditLine: this.handleBomDetail,
      onSelectRow: this.handleSelectRow,
    };
    const fieldValues = isUndefined(this.form)
      ? {}
      : filterNullValueObject(this.form.getFieldsValue());
    return (
      <React.Fragment>
        <Header title={intl.get(`${promptCode}.view.message.title`).d('BOM结构清单')}>
          <Button icon="plus" type="primary" onClick={this.handleAddBom}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button
            icon="delete"
            loading={loading.delete}
            onClick={this.handleDelete}
            disabled={isEmpty(selectedRowKeys)}
          >
            {intl.get('hzero.common.button.delete').d('删除')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_MTC}/v1/${tenantId}/bom/export`}
            queryParams={fieldValues}
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
export default Bom;
