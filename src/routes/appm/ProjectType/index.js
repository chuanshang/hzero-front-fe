/**
 * ProjectType - 项目类型
 * @date: 2019-2-19
 * @author: WH <heng.wei@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Button } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import uuidv4 from 'uuid/v4';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import ExcelExport from 'components/ExcelExport';
import { HALM_PPM } from '@/utils/config';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, getEditTableData, filterNullValueObject } from 'utils/utils';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ projectType, loading }) => ({
  projectType,
  loading: {
    fetch: loading.effects['projectType/fetchProjectType'],
    save: loading.effects['projectType/saveProjectType'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: ['appm.projectType'],
})
class ProjectType extends Component {
  form;
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.handleSearch();
  }
  /**
   * 根据节点路径，在树形结构树中的对应节点添加或替换children属性
   * @param {Array} collections 树形结构
   * @param {Array} pathMap 节点路径
   * @param {Array} data  追加或替换的children数据
   * @returns {Array} 新的树形结构
   */
  findAndSetNodeProps(collections, pathMap = [], data) {
    let newCursorList = pathMap;
    const cursor = newCursorList[0];
    const tree = collections.map(n => {
      const m = n;
      if (m.proTypeId === cursor) {
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
   * @param {object} ref - FilterForm子组件对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
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
      type: 'projectType/fetchProjectType',
      payload: {
        tenantId,
        ...filterValues,
      },
    });
  }
  /**
   * 按钮 - 保存(批量)
   */
  @Bind()
  handleSaveProjectType() {
    const {
      dispatch,
      tenantId,
      projectType: { treeList = [] },
    } = this.props;
    // 处理表单效验，获取处理后的表单数据
    const params = getEditTableData(treeList, ['children', 'proTypeId']);
    // debugger;
    if (Array.isArray(params) && params.length > 0) {
      dispatch({
        type: 'projectType/saveProjectType',
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
   * 添加产品
   */
  @Bind()
  handleAddTopType() {
    const {
      dispatch,
      tenantId,
      projectType: { treeList = [], expandedRowKeys = [] },
    } = this.props;
    const proTypeId = uuidv4();
    const newItem = {
      proTypeId,
      tenantId,
      enabledFlag: 1,
      _status: 'create',
    };
    dispatch({
      type: 'projectType/updateState',
      payload: {
        treeList: [newItem, ...treeList],
        expandedRowKeys: [...expandedRowKeys, proTypeId],
      },
    });
  }
  /**
   * 行 - 新增下级
   * @param {Object} current 当前行对象
   */
  @Bind()
  handleAddSubType(current = {}) {
    const {
      dispatch,
      tenantId,
      projectType: { treeList = [], expandedRowKeys = [], pathMap = {} },
    } = this.props;
    const proTypeId = uuidv4();
    const newItem = {
      proTypeId,
      tenantId,
      enabledFlag: 1,
      _status: 'create',
      parentTypeId: current.proTypeId,
    };
    const newChildren = [...(current.children || []), newItem];
    const newTreeList = this.findAndSetNodeProps(treeList, pathMap[current.proTypeId], newChildren);
    dispatch({
      type: 'projectType/updateState',
      payload: {
        treeList: [...newTreeList],
        expandedRowKeys: [...expandedRowKeys, current.proTypeId],
      },
    });
  }
  /**
   * 行 - 清除
   * @param {Object} current - 当前行对象
   */
  @Bind()
  handleCancelLine(current = {}) {
    const {
      dispatch,
      projectType: { treeList = [], pathMap = {} },
    } = this.props;
    let newTreeList = [];
    if (current.parentTypeId) {
      // 找到父节点的children, 更新children数组
      const node = this.findNode(treeList, pathMap[current.parentTypeId], 'proTypeId');
      const newChildren = node.children.filter(item => item.proTypeId !== current.proTypeId);
      // 替换children，获得新treeList
      newTreeList = this.findAndSetNodeProps(treeList, pathMap[current.parentTypeId], newChildren);
    } else {
      newTreeList = treeList.filter(item => item.proTypeId !== current.proTypeId);
    }
    dispatch({
      type: 'projectType/updateState',
      payload: {
        treeList: newTreeList,
      },
    });
  }

  /**
   * 行 - 编辑/取消
   * @param {Object} current - 当前行对象
   * @param {Boolean} flag - 状态标记
   */
  @Bind()
  handleEditLine(current = {}, flag) {
    const {
      dispatch,
      projectType: { treeList = [], pathMap = {} },
    } = this.props;
    const currentNode = this.findNode(treeList, pathMap[current.proTypeId], 'proTypeId');
    currentNode._status = flag ? 'update' : '';
    const newTreeList = [...treeList];
    dispatch({
      type: 'projectType/updateState',
      payload: {
        treeList: newTreeList,
      },
    });
  }
  /**
   * 展开全部
   * 将页面展示的数据进行展开
   */
  @Bind()
  handleExpand() {
    const {
      dispatch,
      projectType: { pathMap = {} },
    } = this.props;
    dispatch({
      type: 'projectType/updateState',
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
      type: 'projectType/updateState',
      payload: { expandedRowKeys: [] },
    });
  }
  /**
   * 行 - 行展开/收起
   *  @param {Boolean} isExpand 展开标记
   *  @param {Object} current 当前行对象
   */
  @Bind()
  handleExpandSubLine(isExpand, current) {
    const {
      dispatch,
      projectType: { expandedRowKeys = [] },
    } = this.props;
    const rowKeys = isExpand
      ? [...expandedRowKeys, current.proTypeId]
      : expandedRowKeys.filter(item => item !== current.proTypeId);
    dispatch({
      type: 'projectType/updateState',
      payload: {
        expandedRowKeys: [...rowKeys],
      },
    });
  }
  /**
   * 行 - 启用
   * 启用当前项目类型及所有下级
   * @param {Object} current 当前行对象
   */
  @Bind()
  handleEnabledLine(current = {}) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'projectType/enabledLine',
      payload: {
        tenantId,
        data: current,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }

  /**
   * 行- 禁用
   * 禁用当前项目类型及所有下级
   * @param {Object} current 当前行对象
   */
  @Bind()
  handleForbidLine(current = {}) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'projectType/forbidLine',
      payload: {
        tenantId,
        data: current,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }

  render() {
    const {
      tenantId,
      loading: { save, init },
      projectType: { treeList = [], expandedRowKeys = [] },
    } = this.props;
    const exportParams = {};
    const filterProps = {
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };
    const listProps = {
      tenantId,
      expandedRowKeys,
      dataSource: treeList,
      loading: init,
      onEditLine: this.handleEditLine,
      onCancelLine: this.handleCancelLine,
      onAddLine: this.handleAddSubType,
      onForbidLine: this.handleForbidLine,
      onEnabledLine: this.handleEnabledLine,
      onExpand: this.handleExpandSubLine,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('appm.projectType.view.message.title').d('项目类型')}>
          <Button
            icon="save"
            type="primary"
            onClick={this.handleSaveProjectType}
            loading={save || init}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <Button icon="plus" onClick={this.handleAddTopType}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_PPM}/v1/${tenantId}/project-type/export`}
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
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
        </Content>
      </React.Fragment>
    );
  }
}
export default ProjectType;
