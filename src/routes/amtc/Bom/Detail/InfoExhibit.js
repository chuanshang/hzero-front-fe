import React, { Component, Fragment } from 'react';
import { Collapse, Form, Select, Button, Input, Row, Col, Icon, Divider, Tabs } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import Switch from 'components/Switch';
import uuidv4 from 'uuid/v4';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { isUndefined } from 'lodash';
import { routerRedux } from 'dva/router';
import { yesOrNoRender } from 'utils/renderer';
import { EDIT_FORM_ITEM_LAYOUT, EDIT_FORM_ROW_LAYOUT, FORM_COL_3_LAYOUT } from 'utils/constants';
import ChildBomTable from './ChildBomTable';
import DetailList from './DetailList';

@Form.create({ fieldNameProp: null })
class InfoExhibit extends Component {
  uploadButton;
  constructor(props) {
    super(props);
    props.onRef(this);
    const { parentId } = props;
    this.state = {
      collapseKeys: ['A', 'B', 'C'],
      parentTypeChangeCode: '',
      requiredFlag: !isUndefined(parentId),
    };
  }

  componentDidMount() {
    this.props.onRefresh();
    const { dispatch } = this.props;
    dispatch({
      type: 'bom/updateState',
      payload: {
        detail: {},
        treeList: [],
        chileBomlist: [],
        list: [],
      },
    });
  }

  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
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
   * 根据节点路径，在树形结构树中的对应节点添加或替换children属性
   * @param {Array} collections 树形结构树
   * @param {Array} cursorPath 节点路径
   * @param {Array} data  追加或替换的children数据
   * @returns {Array} 新的树形结构
   */
  findAndSetNodeProps(collections, cursorPath = [], data) {
    let newCursorList = cursorPath;
    const cursor = newCursorList[0];
    const tree = collections.map(n => {
      const m = n;
      if (m.bomLineId === cursor) {
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
   * 清除
   * @param {Object} record 清除新增组织行对象
   */
  @Bind()
  handleCancelLine(record = {}) {
    const {
      dispatch,
      bom: { treeList = [], pathMap = {} },
    } = this.props;
    let newTreeList = [];
    if (record.parentBomLineId) {
      // 找到父节点的children, 更新children数组
      const node = this.findNode(treeList, pathMap[record.parentBomLineId], 'bomLineId');
      const newChildren = node.children.filter(item => item.bomLineId !== record.bomLineId);
      newTreeList = this.findAndSetNodeProps(
        treeList,
        pathMap[record.parentBomLineId],
        newChildren
      );
    } else {
      newTreeList = treeList.filter(item => item.bomLineId !== record.bomLineId);
    }
    dispatch({
      type: 'bom/updateState',
      payload: {
        treeList: newTreeList,
      },
    });
  }

  /**
   * 编辑/取消
   * @param {Object} record 新增组织行对象
   * @param {Boolean} flag 新增/取消组织行对象
   */
  @Bind()
  handleEditLine(record = {}, flag) {
    const {
      dispatch,
      bom: { treeList = [], pathMap = {} },
    } = this.props;
    const currentNode = this.findNode(treeList, pathMap[record.bomLineId], 'bomLineId');
    currentNode._status = flag ? 'update' : '';
    const newTreeList = [...treeList];
    dispatch({
      type: 'bom/updateState',
      payload: {
        treeList: newTreeList,
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
      bom: { expandedRowKeys = [] },
    } = this.props;
    const rowKeys = isExpand
      ? [...expandedRowKeys, record.bomLineId]
      : expandedRowKeys.filter(item => item !== record.bomLineId);
    dispatch({
      type: 'bom/updateState',
      payload: {
        expandedRowKeys: [...rowKeys],
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
      bom: { pathMap = {} },
    } = this.props;
    dispatch({
      type: 'bom/updateState',
      payload: {
        expandedRowKeys: Object.keys(pathMap).map(item => +item),
      },
    });
  }

  /**
   * 添加产品
   */
  @Bind()
  handleAddDetail() {
    const {
      dispatch,
      tenantId,
      bom: { treeList = [], expandedRowKeys = [] },
    } = this.props;
    const bomLineId = uuidv4();
    const newItem = {
      bomLineId,
      tenantId,
      enabledFlag: 1,
      _status: 'create',
    };
    dispatch({
      type: 'bom/updateState',
      payload: {
        treeList: [newItem, ...treeList],
        expandedRowKeys: [...expandedRowKeys, bomLineId],
      },
    });
  }

  /**
   * 添加下级
   * @param {Object} record  操作对象
   */
  @Bind()
  handleAddDetailLists(record = {}) {
    const {
      dispatch,
      tenantId,
      bom: { treeList = [], expandedRowKeys = [], pathMap = {} },
    } = this.props;
    const bomLineId = uuidv4();
    const newItem = {
      tenantId,
      bomLineId,
      enabledFlag: 1,
      levelNumber: record.levelNumber + 1,
      _status: 'create',
      parentBomLineId: record.bomLineId,
    };
    const newChildren = [...(record.children || []), newItem];
    const newTreeList = this.findAndSetNodeProps(treeList, pathMap[record.bomLineId], newChildren);
    dispatch({
      type: 'bom/updateState',
      payload: {
        treeList: [...newTreeList],
        expandedRowKeys: [...expandedRowKeys, record.bomLineId],
      },
    });
  }

  /**
   * 查询
   */
  @Bind()
  handleSearch() {
    const { dispatch, tenantId, match } = this.props;
    const { id } = match.params;
    if (!isUndefined(id)) {
      dispatch({
        type: 'bom/listBomTree',
        payload: {
          tenantId,
          bomId: id,
        },
      });
    }
  }

  /**
   * 新增子BOM
   */
  @Bind()
  handleAddChildLists() {
    const { dispatch, bom } = this.props;
    const {
      detail: { bomId, bomName },
    } = bom;
    if (!isUndefined(bomId)) {
      dispatch(routerRedux.push({ pathname: `/amtc/bom/createChild/${bomId}/${bomName}` }));
    } else {
      const message = 'BOM没有保存，无法添加子BOM！';
      notification.warning({ message });
    }
  }

  @Bind()
  handleParentTypeChange(value) {
    let key = '';
    if (value === 'LOCATION') {
      this.setState({
        requiredFlag: false,
      });
      key = 'AMDM.LOCATIONS';
    } else if (value === 'ASSET') {
      this.setState({
        requiredFlag: false,
      });
      key = 'AAFM.ASSETS';
    } else if (value === 'ASSET_SET') {
      this.setState({
        requiredFlag: false,
      });
      key = 'AAFM.ASSET_SET';
    } else if (value === 'BOM') {
      this.setState({
        requiredFlag: true,
      });
      key = 'AMTC.BOM';
    }
    this.setState({
      parentTypeChangeCode: key,
    });
  }

  @Bind()
  handleSetLov(_, record) {
    const { dispatch, form } = this.props;
    form.setFieldsValue({
      enabledFlag: record.enabledFlag,
      parentTypeCode: record.parentTypeCode,
      parentId: record.parentId,
      childNodeName: record.childNodeName,
      bomName: record.bomName,
    });
    dispatch({
      type: 'bom/updateState',
      payload: {
        detail: {
          parentName: record.parentName,
        },
      },
    });
  }

  render() {
    const {
      id,
      isNew,
      parentId,
      parentName,
      editFlag,
      tenantId,
      loading,
      dataSource,
      expandedRowKeys,
      ParentTypeMap, // 对象字段独立值集
      chileBomlist, // 子BOM结构清单
      treeList, // 结构清单行
      onEditLine,
      form: { getFieldDecorator },
    } = this.props;
    const { collapseKeys = [], parentTypeChangeCode, requiredFlag } = this.state;
    const { listLoading } = loading;
    const maxLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    const prefix = `amtc.bom.model.bom`;
    const childBomListProps = {
      onEditLine,
      dataSource: chileBomlist,
    };
    const detailListProps = {
      tenantId,
      loading: listLoading,
      dataSource: treeList,
      isNew,
      editFlag,
      expandedRowKeys,
      onExpand: this.handleExpandSubLine,
      onAddLine: this.handleAddDetailLists,
      onDeleteLine: this.handleDeleteLine,
      onEditLine: this.handleEditLine,
      onCancelLine: this.handleCancelLine,
    };
    const disFlag = !isNew || editFlag ? { display: 'block' } : { display: 'none' };
    const disDetaliFlag = isUndefined(id) ? { display: 'none' } : { display: 'block' };
    const requiredStyle = dataSource.parentTypeCode === 'BOM' ? true : requiredFlag;
    return (
      <React.Fragment>
        {isNew ? (
          <React.Fragment>
            <Row>
              <Col span={3}>
                <Icon type="picture" style={{ fontSize: 80 }} />
              </Col>
              <Col span={21}>
                <Row style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 'bold' }}>{dataSource.bomName}</span>
                </Row>
                <Row>
                  <Col span={7}>
                    <Row>
                      <span>{intl.get(`${prefix}.bomName`).d('名称')}</span>
                    </Row>
                    <Row style={{ fontWeight: 'bold' }}>{dataSource.bomName}</Row>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Divider style={{ marginTop: 5, marginBottom: 0 }} />
          </React.Fragment>
        ) : (
          ''
        )}
        <Tabs defaultActiveKey="basicTab">
          <Tabs.TabPane
            tab={intl.get(`${prefix}.tab.basicTab`).d('基本')}
            key="basicTab"
            style={{ height: window.screen.availHeight / 2, overflow: 'auto' }}
          >
            <Collapse
              bordered={false}
              defaultActiveKey={['A', 'B', 'C']}
              className="form-collapse"
              onChange={this.handleChangeKey.bind(this)}
            >
              <Collapse.Panel
                showArrow={false}
                key="A"
                header={
                  <Fragment>
                    <h3>{intl.get(`${prefix}.panel.A`).d('基础信息')}</h3>
                    <a>
                      {collapseKeys.includes('A')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('A') ? 'up' : 'down'} />
                  </Fragment>
                }
              >
                <Form>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.maintSiteId`).d('服务区域')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('maintSiteId', {
                            initialValue: dataSource.maintSiteId,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${prefix}.maintSiteId`).d('服务区域'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              code="AMDM.ASSET_MAINT_SITE"
                              queryParams={{ organizationId: tenantId }}
                              textValue={dataSource.maintSiteName}
                            />
                          )
                        ) : (
                          <span>{dataSource.maintSiteName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.copyBomId`).d('复制自BOM')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('copyBomId', {
                            initialValue: dataSource.copyBomId,
                          })(
                            <Lov
                              code="AMTC.BOM"
                              queryParams={{ organizationId: tenantId }}
                              textValue={dataSource.copyBomName}
                              onChange={this.handleSetLov}
                            />
                          )
                        ) : (
                          <span>{dataSource.copyBomName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.enabledFlag`).d('是否启用')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('enabledFlag', {
                            initialValue: isNew ? 1 : dataSource.enabledFlag,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${prefix}.enabledFlag`).d('是否启用'),
                                }),
                              },
                            ],
                          })(<Switch />)
                        ) : (
                          <span>{yesOrNoRender(dataSource.enabledFlag)}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.parentTypeCode`).d('对象类型')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('parentTypeCode', {
                            initialValue: parentId ? 'BOM' : dataSource.parentTypeCode,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${prefix}.parentTypeCode`).d('对象'),
                                }),
                              },
                            ],
                          })(
                            <Select onChange={this.handleParentTypeChange}>
                              {ParentTypeMap.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )
                        ) : (
                          <span>{dataSource.parentTypeMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.parentId`).d('对象')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('parentId', {
                            initialValue: parentId || dataSource.parentId,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${prefix}.parentId`).d('对象'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              code={parentTypeChangeCode}
                              queryParams={{ organizationId: tenantId }}
                              textValue={parentId ? parentName : dataSource.parentName}
                            />
                          )
                        ) : (
                          <span>{dataSource.parentName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.bomName`).d('BOM名称')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('bomName', {
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${prefix}.bomName`).d('BOM名称'),
                                }),
                              },
                              {
                                max: 60,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 60,
                                }),
                              },
                            ],
                            initialValue: dataSource.bomName,
                          })(<Input />)
                        ) : (
                          <span>{dataSource.bomName}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.childNodeName`).d('虚拟/子节点名称')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('childNodeName', {
                            rules: [
                              {
                                required: requiredStyle,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${prefix}.childNodeName`).d('虚拟/子节点名称'),
                                }),
                              },
                              {
                                max: 60,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 60,
                                }),
                              },
                            ],
                            initialValue: dataSource.childNodeName,
                          })(<Input />)
                        ) : (
                          <span>{dataSource.childNodeName}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col span={22}>
                      <Form.Item label={intl.get(`${prefix}.description`).d('说明')} {...maxLayout}>
                        {!isNew || editFlag ? (
                          getFieldDecorator('description', {
                            initialValue: dataSource.description,
                            rules: [
                              {
                                max: 240,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 240,
                                }),
                              },
                            ],
                          })(<Input.TextArea rows={3} />)
                        ) : (
                          <span>{dataSource.description}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Collapse.Panel>
              <Collapse.Panel
                showArrow={false}
                key="B"
                header={
                  <Fragment>
                    <h3>{intl.get(`${prefix}.panel.B`).d('子BOM结构清单')}</h3>
                    <a>
                      {collapseKeys.includes('B')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('B') ? 'up' : 'down'} />
                  </Fragment>
                }
                style={disDetaliFlag}
              >
                <Row style={{ margin: '10px' }}>
                  <Col>
                    <Button
                      icon="plus"
                      type="primary"
                      style={disFlag}
                      onClick={this.handleAddChildLists}
                    >
                      {intl.get(`amtc.bom.view.button.add`).d('新增')}
                    </Button>
                  </Col>
                </Row>
                <ChildBomTable {...childBomListProps} />
              </Collapse.Panel>
              <Collapse.Panel
                showArrow={false}
                key="C"
                header={
                  <Fragment>
                    <h3>{intl.get(`${prefix}.panel.C`).d('结构清单行')}</h3>
                    <a>
                      {collapseKeys.includes('C')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('C') ? 'up' : 'down'} />
                  </Fragment>
                }
              >
                <Row style={{ margin: '10px' }}>
                  <Col>
                    <Button
                      icon="plus"
                      type="primary"
                      style={disFlag}
                      onClick={this.handleAddDetail}
                    >
                      {intl.get(`amtc.bom.view.button.add`).d('新增')}
                    </Button>
                  </Col>
                </Row>
                <DetailList {...detailListProps} />
              </Collapse.Panel>
            </Collapse>
          </Tabs.TabPane>
        </Tabs>
      </React.Fragment>
    );
  }
}
export default InfoExhibit;
