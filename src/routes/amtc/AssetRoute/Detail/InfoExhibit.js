import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators/index';
import { Collapse, Form, Input, Row, Col, Icon, Button, Select, Modal } from 'hzero-ui';
import intl from 'utils/intl';
import uuidv4 from 'uuid/v4';
import notification from 'utils/notification';
import Lov from 'components/Lov';
import DetailList from './DetailList';

const { TextArea } = Input;

@Form.create({ fieldNameProp: null })
class InfoExhibit extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      collapseKeys: ['A', 'B'],
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
   * 新增行信息
   */
  @Bind()
  handleAddLine() {
    const { dispatch, tenantId, detailList } = this.props;
    const newItem = {
      routeAssignmentId: uuidv4(),
      flownoSeq: this.getFlowNoSeq(detailList),
      tenantId,
      enabledFlag: 1,
      _status: 'create',
    };
    dispatch({
      type: 'assetRoute/updateState',
      payload: {
        detailList: [...detailList, newItem],
      },
    });
  }

  getFlowNoSeq(detailList = []) {
    const maxSeq = detailList.length > 0 ? detailList[detailList.length - 1].flownoSeq : 1;
    const newSeq = (Math.floor(maxSeq / 10) + 1) * 10;
    return newSeq;
  }

  /**
   * 行编辑
   * @param current
   * @param flag
   */
  @Bind()
  handleEditLine(current = {}, flag = false) {
    const { dispatch, detailList } = this.props;
    const newList = detailList.map(item =>
      item.routeAssignmentId === current.routeAssignmentId
        ? { ...item, _status: flag ? 'update' : '' }
        : item
    );
    dispatch({
      type: 'assetRoute/updateState',
      payload: {
        detailList: newList,
      },
    });
  }

  /**
   * 行取消
   * @param current
   */
  @Bind()
  handleCancelLine(current = {}) {
    const { dispatch, detailList } = this.props;
    const newList = detailList.filter(item => item.routeAssignmentId !== current.routeAssignmentId);
    dispatch({
      type: 'assetRoute/updateState',
      payload: {
        detailList: newList,
      },
    });
  }

  /**
   * 行删除
   * @param record
   */
  @Bind()
  handleDeleteContent(record) {
    const { dispatch, tenantId } = this.props;
    const messagePrompt = 'amtc.faultDefect.view.message';
    Modal.confirm({
      content: intl.get(`${messagePrompt}.title.content`).d('确定删除吗？'),
      onOk() {
        dispatch({
          type: 'assetRoute/deleteAssetRouteLine',
          payload: { ...record },
        }).then(res => {
          if (res) {
            notification.success();
            dispatch({
              type: 'assetRoute/fetchDetailListInfo',
              payload: {
                tenantId,
                assetRouteId: record.assetRouteId,
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
      detailList,
      detailListPagination,
      loading: { detailListLoading },
      referenceModeMap,
      form: { getFieldDecorator },
    } = this.props;
    const { collapseKeys = [] } = this.state;
    const formLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const formLongLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 10 },
    };
    const prefix = `amtc.assetRoute.view.message`;
    const modelPrompt = 'amtc.assetRoute.model.assetRoute';
    const detailListProps = {
      tenantId,
      dataSource: detailList,
      pagination: detailListPagination,
      loading: detailListLoading,
      onEditLine: this.handleEditLine,
      onDeleteLine: this.handleDeleteContent,
      onCancelLine: this.handleCancelLine,
    };
    return (
      <Collapse
        bordered={false}
        defaultActiveKey={['A', 'B']}
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
                  label={intl.get(`amtc.common.model.assetRouteName`).d('资产路线名称')}
                  {...formLayout}
                >
                  {getFieldDecorator('assetRouteName', {
                    initialValue: dataSource.assetRouteName,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`amtc.common.model.assetRouteName`).d('资产路线名称'),
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`amtc.common.model.maintSitesId`).d('服务区域')}
                  {...formLayout}
                >
                  {getFieldDecorator('maintSitesId', {
                    initialValue: dataSource.maintSitesId,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`amtc.common.model.maintSitesName`).d('服务区域'),
                        }),
                      },
                    ],
                  })(
                    <Lov
                      code="AMDM.ASSET_MAINT_SITE"
                      queryParams={{ organizationId: tenantId }}
                      textValue={dataSource.maintSitesName}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`amtc.common.model.routeMode`).d('引用模式')}
                  {...formLayout}
                >
                  {getFieldDecorator('routeMode', {
                    initialValue: dataSource.routeMode,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`amtc.common.model.routeMode`).d('引用模式'),
                        }),
                      },
                    ],
                  })(
                    <Select>
                      {referenceModeMap.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.description`).d('描述')}
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
              <h3>{intl.get(`${prefix}.attributeLine`).d('行信息')}</h3>
            </Fragment>
          }
        >
          <Row style={{ margin: '10px' }}>
            <Col>
              <Button icon="plus" type="primary" onClick={this.handleAddLine}>
                {intl.get(`amtc.assetRoute.view.button.add`).d('新增')}
              </Button>
            </Col>
          </Row>
          <DetailList {...detailListProps} />
        </Collapse.Panel>
      </Collapse>
    );
  }
}
export default InfoExhibit;
