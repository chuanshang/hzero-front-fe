import React, { Component, Fragment } from 'react';
import { Collapse, Form, Input, Row, Col, Icon, Button, Modal } from 'hzero-ui';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Bind } from 'lodash-decorators/index';
import uuidv4 from 'uuid/v4';
import ObjectsDetailList from './ObjectsDetailList';
import CodesDetailList from './CodesDetailList';

const { TextArea } = Input;

@Form.create({ fieldNameProp: null })
class InfoExhibit extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      collapseKeys: ['A', 'B', 'C'],
    };
  }

  componentDidMount() {
    const { onRefresh } = this.props;
    onRefresh();
  }

  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }

  /**
   * 新建评估项关联对象
   */
  @Bind()
  handleNewObject() {
    const { dispatch, tenantId, dataSource, evaluateObjectsList } = this.props;
    const newItem = {
      asmtObjectsId: uuidv4(),
      tenantId,
      rcAssesmentId: dataSource.rcAssesmentId,
      enabledFlag: 1,
      _status: 'create',
    };
    dispatch({
      type: 'rcAssesment/updateState',
      payload: {
        evaluateObjectsList: [...evaluateObjectsList, newItem],
      },
    });
  }

  /**
   * 行编辑
   * @param current
   * @param flag
   */
  @Bind()
  handleObjectEditLine(current = {}, flag = false) {
    const { dispatch, evaluateObjectsList } = this.props;
    const newList = evaluateObjectsList.map(item =>
      item.asmtObjectsId === current.asmtObjectsId
        ? { ...item, _status: flag ? 'update' : '' }
        : item
    );
    dispatch({
      type: 'rcAssesment/updateState',
      payload: {
        evaluateObjectsList: newList,
      },
    });
  }

  /**
   * 行取消
   * @param current
   */
  @Bind()
  handleObjectCancelLine(current = {}) {
    const { dispatch, evaluateObjectsList } = this.props;
    const newList = evaluateObjectsList.filter(
      item => item.asmtObjectsId !== current.asmtObjectsId
    );
    dispatch({
      type: 'rcAssesment/updateState',
      payload: {
        evaluateObjectsList: newList,
      },
    });
  }

  /**
   * 行删除
   * @param record
   */
  @Bind()
  handleObjectDeleteContent(record) {
    const { dispatch, tenantId, dataSource } = this.props;
    const messagePrompt = 'amtc.rcAssesment.view.message';
    Modal.confirm({
      content: intl.get(`${messagePrompt}.title.content`).d('确定删除吗？'),
      onOk() {
        dispatch({
          type: 'rcAssesment/deleteEvaluateObjects',
          payload: { ...record },
        }).then(res => {
          if (res) {
            notification.success();
            dispatch({
              type: 'rcAssesment/queryEvaluateObjectsList',
              payload: {
                tenantId,
                rcAssesmentId: dataSource.rcAssesmentId,
              },
            });
          }
        });
      },
    });
  }

  /**
   * 新建顶层
   */
  @Bind()
  handleCodesAddItem() {
    const { dispatch, tenantId, dataSource, evaluateCodesTreeList, expandedRowKeys } = this.props;
    const asmtCodesId = uuidv4();
    const newItem = {
      asmtCodesId,
      tenantId,
      rcAssesmentId: dataSource.rcAssesmentId,
      enabledFlag: 1,
      _status: 'create',
    };
    dispatch({
      type: 'rcAssesment/updateState',
      payload: {
        evaluateCodesTreeList: [newItem, ...evaluateCodesTreeList],
        expandedRowKeys: [...expandedRowKeys, asmtCodesId],
      },
    });
  }

  /**
   * 清除
   * @param {Object} record 清除新增组织行对象
   */
  @Bind()
  handleCodesCancelLine(record = {}) {
    const { dispatch, evaluateCodesTreeList = [], pathMap = {} } = this.props;
    let newTreeList = [];
    if (record.parentCodeId) {
      // 找到父节点的children, 更新children数组
      const node = this.findNode(
        evaluateCodesTreeList,
        pathMap[record.parentCodeId],
        'asmtCodesId'
      );
      const newChildren = node.children.filter(item => item.asmtCodesId !== record.asmtCodesId);
      newTreeList = this.findAndSetNodeProps(
        evaluateCodesTreeList,
        pathMap[record.parentCodeId],
        newChildren
      );
    } else {
      newTreeList = evaluateCodesTreeList.filter(item => item.asmtCodesId !== record.asmtCodesId);
    }
    dispatch({
      type: 'rcAssesment/updateState',
      payload: {
        evaluateCodesTreeList: newTreeList,
      },
    });
  }

  /**
   * 新增下级
   * @param {Object} record  操作对象
   */
  @Bind()
  handleAddLineItem(record = {}) {
    const {
      dispatch,
      tenantId,
      evaluateCodesTreeList = [],
      expandedRowKeys = [],
      pathMap = {},
    } = this.props;
    const asmtCodesId = uuidv4();
    const newItem = {
      tenantId,
      asmtCodesId,
      enabledFlag: 1,
      _status: 'create',
      parentCodeId: record.asmtCodesId,
    };
    const newChildren = [...(record.children || []), newItem];
    const newTreeList = this.findAndSetNodeProps(
      evaluateCodesTreeList,
      pathMap[record.asmtCodesId],
      newChildren
    );
    dispatch({
      type: 'rcAssesment/updateState',
      payload: {
        evaluateCodesTreeList: [...newTreeList],
        expandedRowKeys: [...expandedRowKeys, record.asmtCodesId],
      },
    });
  }

  /**
   * 编辑/取消
   * @param {Object} record 新增组织行对象
   * @param {Boolean} flag 新增/取消组织行对象
   */
  @Bind()
  handleCodesEditLine(record = {}, flag) {
    const { dispatch, evaluateCodesTreeList = [], pathMap = {} } = this.props;
    const currentNode = this.findNode(
      evaluateCodesTreeList,
      pathMap[record.asmtCodesId],
      'asmtCodesId'
    );
    currentNode._status = flag ? 'update' : '';
    const newTreeList = [...evaluateCodesTreeList];
    dispatch({
      type: 'rcAssesment/updateState',
      payload: {
        evaluateCodesTreeList: newTreeList,
      },
    });
  }

  /**
   * 行删除
   * @param record
   */
  @Bind()
  handleCodesDeleteContent(record) {
    const { dispatch, tenantId, dataSource } = this.props;
    const messagePrompt = 'amtc.rcAssesment.view.message';
    Modal.confirm({
      content: intl.get(`${messagePrompt}.title.content`).d('确定删除吗？'),
      onOk() {
        dispatch({
          type: 'rcAssesment/deleteEvaluateCodes',
          payload: { ...record },
        }).then(res => {
          if (res) {
            notification.success();
            dispatch({
              type: 'rcAssesment/queryEvaluateCodesList',
              payload: {
                tenantId,
                rcAssesmentId: dataSource.rcAssesmentId,
              },
            });
          }
        });
      },
    });
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
      if (m.asmtCodesId === cursor) {
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
   * 全部层级展开/收起
   */
  @Bind()
  handleExpand() {
    const { isExpandAll } = this.state;
    const { dispatch, pathMap = {} } = this.props;
    dispatch({
      type: 'rcAssesment/updateState',
      payload: {
        expandedRowKeys: isExpandAll ? Object.keys(pathMap).map(item => +item) : [],
      },
    });
    this.setState({ isExpandAll: !isExpandAll });
  }

  /**
   * 点击展开图标，展开行
   *  @param {Boolean} isExpand 展开标记
   *  @param {Object} record 组织行信息
   */
  @Bind()
  handleExpandSubLine(isExpand, record) {
    const { dispatch, expandedRowKeys = [] } = this.props;
    const rowKeys = isExpand
      ? [...expandedRowKeys, record.asmtCodesId]
      : expandedRowKeys.filter(item => item !== record.asmtCodesId);
    dispatch({
      type: 'rcAssesment/updateState',
      payload: {
        expandedRowKeys: [...rowKeys],
      },
    });
  }

  render() {
    const {
      tenantId,
      dataSource,
      evaluateObjectsList,
      evaluateObjectsPagination,
      evaluateCodesTreeList,
      objectTypeCodeMap,
      expandedRowKeys,
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const { fetchEvaluateObjectsInfoLoading, fetchEvaluateCodesInfoLoading } = loading;
    const { collapseKeys = [] } = this.state;
    const formLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const formLongLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 13 },
    };
    const prefix = `amtc.rcAssesment.view.message`;
    const modelPrompt = 'amtc.rcAssesment.model.rcAssesment';
    const objectListProps = {
      loading: fetchEvaluateObjectsInfoLoading,
      objectTypeCodeMap,
      tenantId,
      dataSource: evaluateObjectsList,
      pagination: evaluateObjectsPagination,
      onEditLine: this.handleObjectEditLine,
      onCancelLine: this.handleObjectCancelLine,
      onDeleteLine: this.handleObjectDeleteContent,
    };
    const codesListProps = {
      rcSystemId: dataSource.rcSystemId,
      loading: fetchEvaluateCodesInfoLoading,
      tenantId,
      expandedRowKeys,
      dataSource: evaluateCodesTreeList,
      onExpand: this.handleExpandSubLine,
      onAddLine: this.handleAddLineItem,
      onEditLine: this.handleCodesEditLine,
      onCancelLine: this.handleCodesCancelLine,
      onDeleteLine: this.handleCodesDeleteContent,
    };
    return (
      <Collapse
        bordered={false}
        defaultActiveKey={['A', 'B', 'C']}
        className="associated-collapse"
        onChange={this.handleChangeKey.bind(this)}
      >
        <Collapse.Panel
          showArrow={false}
          key="A"
          header={
            <Fragment>
              <Icon type={collapseKeys.includes('A') ? 'minus' : 'plus'} />
              <h3>{intl.get(`${prefix}.basicInfo`).d('基础信息')}</h3>
            </Fragment>
          }
        >
          <Form>
            <Row>
              <Col span={8}>
                <Form.Item
                  label={intl.get(`amtc.common.model.rcSystemId`).d('评估体系')}
                  {...formLayout}
                >
                  {getFieldDecorator('rcSystemId', {
                    initialValue: dataSource.rcSystemId,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`amtc.common.model.rcSystemId`).d('评估体系'),
                        }),
                      },
                    ],
                  })(
                    <Lov
                      code="AMTC.FAULTDEFECTS"
                      queryParams={{ organizationId: tenantId }}
                      textValue={dataSource.rcSystemName}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`amtc.common.model.categroyCode`).d('评估类别')}
                  {...formLayout}
                >
                  {getFieldDecorator('categroyCode', {
                    initialValue: dataSource.categroyCode,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`amtc.common.model.categroyCode`).d('评估类别'),
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`amtc.common.model.rcAssesmentName`).d('名称')}
                  {...formLayout}
                >
                  {getFieldDecorator('rcAssesmentName', {
                    initialValue: dataSource.rcAssesmentName,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`amtc.common.model.rcAssesmentName`).d('名称'),
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.description`).d('详细说明')}
                  {...formLongLayout}
                >
                  {getFieldDecorator('description', {
                    initialValue: dataSource.description,
                  })(<TextArea rows={2} />)}
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
              <Icon type={collapseKeys.includes('B') ? 'minus' : 'plus'} />
              <h3>{intl.get(`${prefix}.attributeLine`).d('评估项关联对象')}</h3>
            </Fragment>
          }
        >
          <Row style={{ margin: '10px' }}>
            <Col>
              <Button icon="plus" type="primary" onClick={this.handleNewObject}>
                {intl.get(`amtc.workCenter.view.button.add`).d('新增')}
              </Button>
            </Col>
          </Row>
          <ObjectsDetailList {...objectListProps} />
        </Collapse.Panel>
        <Collapse.Panel
          showArrow={false}
          key="C"
          header={
            <Fragment>
              <Icon type={collapseKeys.includes('C') ? 'minus' : 'plus'} />
              <h3>{intl.get(`${prefix}.attributeLine`).d('评估对象代码')}</h3>
            </Fragment>
          }
        >
          <Row style={{ margin: '10px' }}>
            <Col>
              <Button icon="plus" type="primary" onClick={this.handleCodesAddItem}>
                {intl.get(`amtc.workCenter.view.button.add`).d('新增顶层')}
              </Button>
            </Col>
          </Row>
          <CodesDetailList {...codesListProps} />
        </Collapse.Panel>
      </Collapse>
    );
  }
}
export default InfoExhibit;
