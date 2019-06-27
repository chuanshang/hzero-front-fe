import React, { Component, Fragment } from 'react';
import { Collapse, Form, Input, Row, Col, Icon, Button, Modal } from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators/index';
import notification from 'utils/notification';
import uuidv4 from 'uuid/v4';
import HierDetailList from './HierDetailList';
import CalcsDetailList from './CalcsDetailList';

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
   * 新建评估计算项行
   */
  @Bind()
  handleNewCalcs() {
    const { dispatch, tenantId, dataSource, evaluateCalcsList } = this.props;
    const newItem = {
      sysCalcId: uuidv4(),
      tenantId,
      rcSystemId: dataSource.rcSystemId,
      enabledFlag: 1,
      _status: 'create',
    };
    dispatch({
      type: 'rcSystem/updateState',
      payload: {
        evaluateCalcsList: [...evaluateCalcsList, newItem],
      },
    });
  }

  /**
   * 新建评估字段层次行
   */
  @Bind()
  handleNewHierarchies() {
    const { dispatch, tenantId, dataSource, evaluateHierarchiesList } = this.props;
    const newItem = {
      sysHierarchyId: uuidv4(),
      tenantId,
      rcSystemId: dataSource.rcSystemId,
      enabledFlag: 1,
      _status: 'create',
    };
    dispatch({
      type: 'rcSystem/updateState',
      payload: {
        evaluateHierarchiesList: [...evaluateHierarchiesList, newItem],
      },
    });
  }

  /**
   * 行编辑
   * @param current
   * @param flag
   */
  @Bind()
  handleCalcsEditLine(current = {}, flag = false) {
    const { dispatch, evaluateCalcsList } = this.props;
    const newList = evaluateCalcsList.map(item =>
      item.sysCalcId === current.sysCalcId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'rcSystem/updateState',
      payload: {
        evaluateCalcsList: newList,
      },
    });
  }

  /**
   * 行取消
   * @param current
   */
  @Bind()
  handleCalcsCancelLine(current = {}) {
    const { dispatch, evaluateCalcsList } = this.props;
    const newList = evaluateCalcsList.filter(item => item.sysCalcId !== current.sysCalcId);
    dispatch({
      type: 'rcSystem/updateState',
      payload: {
        evaluateCalcsList: newList,
      },
    });
  }

  /**
   * 行删除
   * @param record
   */
  @Bind()
  handleCalcsDeleteContent(record) {
    const { dispatch, tenantId, dataSource } = this.props;
    const messagePrompt = 'amtc.rcSystem.view.message';
    Modal.confirm({
      content: intl.get(`${messagePrompt}.title.content`).d('确定删除吗？'),
      onOk() {
        dispatch({
          type: 'rcSystem/deleteEvaluateCalcs',
          payload: { ...record },
        }).then(res => {
          if (res) {
            notification.success();
            dispatch({
              type: 'rcSystem/queryEvaluateCalcsList',
              payload: {
                tenantId,
                rcSystemId: dataSource.rcSystemId,
              },
            });
          }
        });
      },
    });
  }

  /**
   * 行编辑
   * @param current
   * @param flag
   */
  @Bind()
  handleHierEditLine(current = {}, flag = false) {
    const { dispatch, evaluateHierarchiesList } = this.props;
    const newList = evaluateHierarchiesList.map(item =>
      item.sysHierarchyId === current.sysHierarchyId
        ? { ...item, _status: flag ? 'update' : '' }
        : item
    );
    dispatch({
      type: 'rcSystem/updateState',
      payload: {
        evaluateHierarchiesList: newList,
      },
    });
  }

  /**
   * 行取消
   * @param current
   */
  @Bind()
  handleHierCancelLine(current = {}) {
    const { dispatch, evaluateHierarchiesList } = this.props;
    const newList = evaluateHierarchiesList.filter(
      item => item.sysHierarchyId !== current.sysHierarchyId
    );
    dispatch({
      type: 'rcSystem/updateState',
      payload: {
        evaluateHierarchiesList: newList,
      },
    });
  }

  /**
   * 行删除
   * @param record
   */
  @Bind()
  handleHierDeleteContent(record) {
    const { dispatch, tenantId, dataSource } = this.props;
    Modal.confirm({
      content: intl.get(`amtc.rcSystem.view.message.title.content`).d('确定删除吗？'),
      onOk() {
        dispatch({
          type: 'rcSystem/deleteEvaluateHierarchies',
          payload: { ...record },
        }).then(res => {
          if (res) {
            notification.success();
            dispatch({
              type: 'rcSystem/queryEvaluateHierarchiesList',
              payload: {
                tenantId,
                rcSystemId: dataSource.rcSystemId,
              },
            });
          }
        });
      },
    });
  }

  render() {
    const {
      tenantId,
      dataSource,
      evaluateCalcsList,
      evaluateCalcsPagination,
      evaluateHierarchiesList,
      evaluateHierarchiesPagination,
      faultdefectCalcFormulaMap,
      faultdefectBasetypeMap,
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const { fetchEvaluateCalcsInfoLoading, fetchEvaluateHierarchiesInfoLoading } = loading;
    const { collapseKeys = [] } = this.state;
    const formLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const formLongLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 13 },
    };
    const prefix = `amtc.rcSystem.view.message`;
    const modelPrompt = 'amtc.rcSystem.model.rcSystem';
    const calcsListProps = {
      loading: fetchEvaluateCalcsInfoLoading,
      faultdefectCalcFormulaMap,
      tenantId,
      dataSource: evaluateCalcsList,
      pagination: evaluateCalcsPagination,
      onEditLine: this.handleCalcsEditLine,
      onCancelLine: this.handleCalcsCancelLine,
      onDeleteLine: this.handleCalcsDeleteContent,
    };
    const hierarchiesListProps = {
      loading: fetchEvaluateHierarchiesInfoLoading,
      faultdefectBasetypeMap,
      tenantId,
      dataSource: evaluateHierarchiesList,
      pagination: evaluateHierarchiesPagination,
      onEditLine: this.handleHierEditLine,
      onCancelLine: this.handleHierCancelLine,
      onDeleteLine: this.handleHierDeleteContent,
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
                  label={intl.get(`amtc.common.model.rcSystemName`).d('名称')}
                  {...formLayout}
                >
                  {getFieldDecorator('rcSystemName', {
                    initialValue: dataSource.rcSystemName,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`amtc.common.model.workcenterName`).d('名称'),
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`aafm.common.model.evaluateType`).d('评估方式')}
                  {...formLayout}
                >
                  {getFieldDecorator('evaluateType', {
                    initialValue: dataSource.evaluateType,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`amtc.common.model.evaluateType`).d('评估方式'),
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
              <h3>{intl.get(`${prefix}.attributeLine`).d('评估体系-评估计算项')}</h3>
            </Fragment>
          }
        >
          <Row style={{ margin: '10px' }}>
            <Col>
              <Button icon="plus" type="primary" onClick={this.handleNewCalcs}>
                {intl.get(`amtc.workCenter.view.button.add`).d('新增')}
              </Button>
            </Col>
          </Row>
          <CalcsDetailList {...calcsListProps} />
        </Collapse.Panel>
        <Collapse.Panel
          showArrow={false}
          key="C"
          header={
            <Fragment>
              <Icon type={collapseKeys.includes('C') ? 'minus' : 'plus'} />
              <h3>{intl.get(`${prefix}.attributeLine`).d('评估体系-评估字段层次')}</h3>
            </Fragment>
          }
        >
          <Row style={{ margin: '10px' }}>
            <Col>
              <Button icon="plus" type="primary" onClick={this.handleNewHierarchies}>
                {intl.get(`amtc.workCenter.view.button.add`).d('新增')}
              </Button>
            </Col>
          </Row>
          <HierDetailList {...hierarchiesListProps} />
        </Collapse.Panel>
      </Collapse>
    );
  }
}
export default InfoExhibit;
