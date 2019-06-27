/**
 * AttributeSet - 属性组
 * @date: 2019-1-15
 * @author: FQL <qilin.feng@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component, Fragment } from 'react';
import { Button } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { routerRedux } from 'dva/router';
import { isUndefined } from 'lodash';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HALM_PPM } from '@/utils/config';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import Search from './Search';
import ListTable from './ListTable';

@connect(({ proAttributeSet, loading }) => ({
  proAttributeSet,
  loading: {
    fetchLoading: loading.effects['proAttributeSet/queryAttributeSetList'],
    saveLoading: loading.effects['proAttributeSet/saveData'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({ code: ['appm.proAttributeSet', 'appm.common'] })
class AttributeSet extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {
      tenantId,
      location: { state: { _back } = {} },
      proAttributeSet: { pagination = {} },
    } = this.props;
    if (_back === -1) {
      this.handleSearch(pagination);
    } else {
      this.props.dispatch({
        type: 'proAttributeSet/init',
        payload: {
          tenantId,
        },
      });
      this.handleSearch();
    }
  }

  /**
   *  查询列表
   * @param {object} page 查询参数
   */
  @Bind()
  handleSearch(page = {}) {
    const { dispatch, tenantId } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'proAttributeSet/queryAttributeSetList',
      payload: {
        tenantId,
        page,
        ...filterValues,
      },
    });
  }

  @Bind()
  handleLinkToDetail(id) {
    const { dispatch } = this.props;
    const linkUrl = isUndefined(id) ? 'create' : `detail/${id}`;
    dispatch(
      routerRedux.push({
        pathname: `/appm/attribute-set/${linkUrl}`,
      })
    );
  }

  /**
   *
   * @param {object} ref - Search子组件对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  render() {
    const { loading, proAttributeSet, tenantId } = this.props;
    const { pagination = {}, list = [], enumMap = {} } = proAttributeSet;
    const { flag } = enumMap;
    const searchProps = {
      flag,
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      pagination,
      onSearch: this.handleSearch,
      loading: loading.fetchLoading,
      dataSource: list,
      onHandleToDetail: this.handleLinkToDetail,
    };
    const exportParams = this.form ? this.form.getFieldsValue() : {};
    return (
      <Fragment>
        <Header title={intl.get('appm.proAttributeSet.view.message.title').d('属性组')}>
          <Button icon="plus" type="primary" onClick={() => this.handleLinkToDetail()}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_PPM}/v1/${tenantId}/attribute-set/export`}
            queryParams={exportParams}
          />
        </Header>
        <Content>
          <Search {...searchProps} />
          <ListTable {...listProps} />
        </Content>
      </Fragment>
    );
  }
}
export default AttributeSet;
