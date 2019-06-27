/**
 * index - 组织入口界面
 * @date: 2019-2-25
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { Button } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { routerRedux } from 'dva/router';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import notification from 'utils/notification';
import intl from 'utils/intl';
import { HALM_MDM } from '@/utils/config';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import Search from './FilterForm';
import ListTable from './ListTable';

@connect(({ organization, loading }) => ({
  organization,
  loading: {
    fetchListLoading: loading.effects['organization/queryOrganizationList'],
    saveLoading: loading.effects['organization/saveData'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: ['amdm.organization'],
})
class Organization extends Component {
  form;
  constructor(props) {
    super(props);
    this.state = {
      selectedListRowKeys: [], // 选中的行
    };
  }

  componentDidMount() {
    const {
      tenantId,
      organization: { state: { _back } = {} },
    } = this.props;
    if (_back === -1) {
      this.handleSearch();
    } else {
      this.props.dispatch({
        type: 'organization/init',
        payload: {
          tenantId,
        },
      });
      this.handleSearch();
    }
  }
  /**
   * 根据节点路径，在树形结构树中的对应节点添加或替换children属性
   * @param {Array} list 树形结构树
   * @param {Array} pathMap 节点路径
   * @param {Array} data  追加或替换的children数据
   * @returns {Array} 新的树形结构
   */
  findAndSetNodeProps(collections, cursorPath = [], data) {
    let newCursorList = cursorPath;
    const cursor = newCursorList[0];
    const tree = collections.map(n => {
      const m = n;
      if (m.assetLocationId === cursor) {
        if (newCursorList[1]) {
          if (!m.children) {
            m.children = [];
          }
          newCursorList = newCursorList.filter(o => newCursorList.indexOf(o) !== 0);
          m.children = this.findAndSetNodeProps(m.children, newCursorList, data);
        } else {
          m.children = [...data];
        }
        if (m.children.length === 0) {
          const { children, ...others } = m;
          return { ...others };
        } else {
          return m;
        }
      }
      return m;
    });
    return tree;
  }

  /**
   * 根据节点路径，在树形结构树中的对应节点
   * @param {Array} collection 树形结构树
   * @param {Array} cursorList 节点路径
   * @param {String} keyName 主键名称
   * @returns {Object} 节点信息
   */
  findNode(collection, cursorList = [], keyName) {
    let newCursorList = cursorList;
    const cursor = newCursorList[0];
    for (let i = 0; i < collection.length; i++) {
      if (collection[i][keyName] === cursor) {
        if (newCursorList[1]) {
          newCursorList = newCursorList.slice(1);
          return this.findNode(collection[i].children, newCursorList, keyName);
        }
        return collection[i];
      }
    }
  }

  /**
   *  查询列表
   * @param {object} page 查询参数
   */
  @Bind()
  handleSearch() {
    const { dispatch, tenantId } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'organization/queryOrganizationList',
      payload: {
        tenantId,
        ...filterValues,
      },
    });
  }

  /**
   * 点击展开图标，展开行
   *  @param {Boolean} isExpand 展开标记
   *  @param {Object} record 组织行信息
   */
  @Bind()
  handleExpandSubLine(isExpand, record) {
    const {
      dispatch,
      organization: { expandedRowKeys = [] },
    } = this.props;
    const rowKeys = isExpand
      ? [...expandedRowKeys, record.orgId]
      : expandedRowKeys.filter(item => item !== record.orgId);
    dispatch({
      type: 'organization/updateState',
      payload: {
        expandedRowKeys: [...rowKeys],
      },
    });
  }

  /**
   * 跳转到详情页
   * @param {string} id 位置行id
   * @param {boolean} isCreateFlag 判断是新增下级还是新增顶级
   */
  @Bind()
  handleLinkToDetail(id, isCreateFlag) {
    const { dispatch } = this.props;
    const linkUrl = isUndefined(id) ? 'create' : isCreateFlag ? `create-sub/${id}` : `detail/${id}`;
    dispatch(
      routerRedux.push({
        pathname: `/amdm/organization/${linkUrl}`,
      })
    );
    dispatch({
      type: 'organization/updateState',
      payload: {
        addressList: [],
        serviceZoneList: [],
      },
    });
    if (isCreateFlag) {
      dispatch({
        type: 'organization/updateState',
        payload: {
          isCreateFlag: true,
        },
      });
    } else {
      dispatch({
        type: 'organization/updateState',
        payload: {
          isCreateFlag: false,
        },
      });
    }
  }

  /**
   * 展开全部
   * 将页面展示的数据进行展开
   */
  @Bind()
  handleExpand() {
    const {
      dispatch,
      organization: { pathMap = {} },
    } = this.props;
    dispatch({
      type: 'organization/updateState',
      payload: {
        expandedRowKeys: Object.keys(pathMap).map(item => +item),
      },
    });
  }

  /**
   * 收起全部
   * 页面顶部收起全部按钮，将内容树收起
   */
  @Bind()
  handleShrink() {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/updateState',
      payload: { expandedRowKeys: [] },
    });
  }

  /**
   * 启用 - 启用某组织，如果有下级组织则同时启用所有下属组织
   * @param {Object} item 组织行信息
   */
  @Bind()
  handleEnabledLine(item = {}) {
    const { dispatch, tenantId } = this.props;
    const { orgId, objectVersionNumber, _token } = item;
    dispatch({
      type: 'organization/enabledLine',
      payload: {
        orgId,
        tenantId,
        objectVersionNumber,
        _token,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }

  /**
   *  禁用 - 禁用特定组织，同时禁用所有下属组织
   * @param {Object} item 组织行信息
   */
  @Bind()
  handleForbidLine(item = {}) {
    const { dispatch, tenantId } = this.props;
    const { orgId, objectVersionNumber, _token } = item;
    dispatch({
      type: 'organization/forbidLine',
      payload: {
        orgId,
        tenantId,
        objectVersionNumber,
        _token,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }

  /**
   * @param {object} ref - FilterForm子组件对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  render() {
    const {
      organization,
      tenantId,
      loading: { fetchListLoading },
    } = this.props;
    const { expandedRowKeys = [], treeList = [], orgTypes = [], flags = [] } = organization;
    const searchProps = {
      orgTypes,
      flags,
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      expandedRowKeys,
      loading: fetchListLoading,
      dataSource: treeList,
      onLinkToDetail: this.handleLinkToDetail,
      onExpand: this.handleExpandSubLine,
      onAddLine: this.handleLinkToDetail,
      onForbidLine: this.handleForbidLine,
      onEnabledLine: this.handleEnabledLine,
    };
    const exportParams = this.form ? this.form.getFieldsValue() : {};
    return (
      <Fragment>
        <Header title={intl.get('amdm.organization.view.message.title').d('组织')}>
          <Button icon="plus" type="primary" onClick={() => this.handleLinkToDetail()}>
            {intl.get('amdm.common.button.create').d('新建顶层')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_MDM}/v1/${tenantId}/org/export`}
            queryParams={exportParams}
          />
          <Button icon="down" onClick={this.handleExpand}>
            {intl.get('hzero.common.button.expandAll').d('全部展开')}
          </Button>
          <Button icon="up" onClick={this.handleShrink}>
            {intl.get('hzero.common.button.collapseAll').d('全部收起')}
          </Button>
        </Header>
        <Content>
          <div className="table-list-search">
            <Search {...searchProps} />
          </div>
          <ListTable {...listProps} />
        </Content>
      </Fragment>
    );
  }
}
export default Organization;
