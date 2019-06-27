/**
 * 项目基础信息-查询
 * @date: 2019-2-18
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Button, notification, Modal } from 'hzero-ui';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty } from 'lodash';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject, getDateTimeFormat } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import moment from 'moment';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ proBasicInfo, loading }) => ({
  proBasicInfo,
  loading: {
    fetch: loading.effects['proBasicInfo/fetchPropBasicInfo'],
    delete: loading.effects['proBasicInfo/deletePropBasicInfo'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: ['appm.proBasicInfo'],
})
class ProBasicInfo extends Component {
  form;
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
    };
  }
  componentDidMount() {
    const {
      dispatch,
      tenantId,
      proBasicInfo: { pagination = {} },
      location: { state: { _back } = {} },
    } = this.props;
    // 校验是否从详情页返回
    const page = _back === -1 ? pagination : {};
    this.handleSearch(page);
    dispatch({
      type: 'proBasicInfo/fetchLov',
      payload: { tenantId },
    });
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
      const fromValue = this.form.getFieldsValue();
      filterValues = filterNullValueObject(fromValue);
    }
    dispatch({
      type: 'proBasicInfo/fetchPropBasicInfo',
      payload: {
        tenantId,
        ...filterValues,
        createTimeFrom: filterValues.createTimeFrom
          ? moment(filterValues.createTimeFrom).format(getDateTimeFormat())
          : null,
        createTimeTo: filterValues.createTimeTo
          ? moment(filterValues.createTimeTo).format(getDateTimeFormat())
          : null,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }
  /**
   * 删除项目基本信息
   */
  @Bind()
  handleDelete() {
    const { dispatch, tenantId } = this.props;
    const { selectedRows } = this.state;
    Modal.confirm({
      iconType: '',
      content: intl.get('appm.proBasicInfo.view.message.delete').d('是否删除选中的项目基本信息'),
      onOk: () => {
        dispatch({
          type: 'proBasicInfo/deletePropBasicInfo',
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
   * 数据行选中操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }
  /**
   * 明细页跳转
   * @param {string} id 项目基础信息id
   */
  @Bind()
  handleGotoDetail(id) {
    const { dispatch } = this.props;
    const linkUrl = isUndefined(id) ? 'create' : `detail/${id}`;
    dispatch(
      routerRedux.push({
        pathname: `/appm/pro-basic-info/${linkUrl}`,
      })
    );
  }

  /**
   * 传递表单参数
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }
  render() {
    const promptCode = 'appm.proBasicInfo';
    const { selectedRowKeys = [] } = this.state;
    const {
      loading,
      tenantId,
      proBasicInfo: { priorityMap, pagination, list = [] },
    } = this.props;
    const filterProps = {
      tenantId,
      priorityMap,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };
    const listProps = {
      pagination,
      selectedRowKeys,
      loading: loading.fetch,
      dataSource: list,
      onEdit: this.handleGotoDetail,
      onSearch: this.handleSearch,
      onSelectRow: this.handleSelectRow,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`${promptCode}.view.message.title`).d('项目基础信息')}>
          <Button icon="plus" type="primary" onClick={() => this.handleGotoDetail()}>
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
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
        </Content>
      </React.Fragment>
    );
  }
}
export default ProBasicInfo;
