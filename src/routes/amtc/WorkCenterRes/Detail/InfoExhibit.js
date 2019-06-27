import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators/index';
import { routerRedux } from 'dva/router';
import { Collapse, Form, Input, Row, Col, Icon, Button, InputNumber } from 'hzero-ui';
import Switch from 'components/Switch';
import intl from 'utils/intl';
import notification from 'utils/notification';
import Lov from 'components/Lov';
import DetailList from './DetailList';
import DetailDrawer from './DetailDrawer';

const { TextArea } = Input;

@Form.create({ fieldNameProp: null })
class InfoExhibit extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      collapseKeys: ['A', 'B'],
      workCenterStaffDetail: {},
    };
  }

  componentDidMount() {
    const { onRefresh } = this.props;
    onRefresh();
  }

  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }

  @Bind()
  handleDrawerCancel() {
    this.setState({ drawerVisible: false, workCenterStaffDetail: {} });
  }

  /**
   * 新增工作中心信息
   */
  @Bind()
  handleAddWorkCenterStaff() {
    this.setState({ drawerVisible: true });
  }

  /**
   *  @function showEditDrawer - 显示编辑modal
   */
  @Bind()
  showEditDrawer(record) {
    this.setState({ drawerVisible: true, workCenterStaffDetail: record });
  }

  /**
   * Drawer Ok
   * @param {obejct} values - 操作数据对象
   */
  @Bind()
  handleDrawerOk(values = {}) {
    const {
      dispatch,
      tenantId,
      dataSource: { workcenterResId },
    } = this.props;
    dispatch({
      type: 'workCenterRes/createOrUpdatePeople',
      payload: { ...values, tenantId },
    }).then(res => {
      if (res) {
        notification.success();
        dispatch({
          type: 'workCenterRes/fetchWorkCenterResDetail',
          payload: {
            tenantId,
            workcenterResId,
          },
        });
        dispatch({
          type: 'workCenterRes/fetchDetailListInfo',
          payload: {
            tenantId,
            resId: workcenterResId,
          },
        });
        this.setState({ workCenterStaffDetail: {}, drawerVisible: false });
      }
    });
  }

  /**
   * 跳转工作中心人员详情
   * @param workcenterResId
   */
  @Bind()
  onGotoDetail(workcenterPeopleId) {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({ pathname: `/amtc/work-center-people/detail/${workcenterPeopleId}` })
    );
  }

  render() {
    const {
      tenantId,
      dataSource,
      detailList,
      detailListPagination,
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const { collapseKeys = [], drawerVisible = false, workCenterStaffDetail = {} } = this.state;
    const formLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const { workcenterResName, workcenterResId } = dataSource;
    const formLongLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 13 },
    };
    const prefix = `amtc.workCenterRes.view.message`;
    const modelPrompt = 'amtc.workCenterRes.model.workCenterRes';
    const detailListProps = {
      loading,
      tenantId,
      dataSource: detailList,
      pagination: detailListPagination,
      onEdit: this.showEditDrawer,
      onGoto: this.onGotoDetail,
    };
    const drawerProps = {
      tenantId,
      dataSource: { ...workCenterStaffDetail, workcenterResName, resId: workcenterResId },
      title: intl.get(`amtc.workCenterRes.view.message.drawer`).d('新建工作中心人员'),
      anchor: 'right',
      maskClosable: false,
      visible: drawerVisible,
      onCancel: this.handleDrawerCancel,
      onOk: this.handleDrawerOk,
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
                  label={intl.get(`amtc.common.model.workcenterResName`).d('技能类型名称')}
                  {...formLayout}
                >
                  {getFieldDecorator('workcenterResName', {
                    initialValue: dataSource.workcenterResName,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`amtc.common.model.workcenterResName`).d('工作中心名称'),
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`amtc.common.model.workcenter`).d('工作中心')}
                  {...formLayout}
                >
                  {getFieldDecorator('workcenterId', {
                    initialValue: dataSource.workcenterId,
                  })(
                    <Lov
                      code="AMTC.WORKCENTERS"
                      queryParams={{ organizationId: tenantId }}
                      textValue={dataSource.workcenterName}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label={intl.get(`amtc.common.model.resQty`).d('资源数')} {...formLayout}>
                  {getFieldDecorator('resQty', {
                    initialValue: dataSource.resQty,
                  })(<InputNumber disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item
                  label={intl.get(`amtc.common.model.profession`).d('工种')}
                  {...formLayout}
                >
                  {getFieldDecorator('profession', {
                    initialValue: dataSource.profession,
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label={intl.get(`amtc.common.model.level`).d('级别')} {...formLayout}>
                  {getFieldDecorator('rank', {
                    initialValue: dataSource.rank,
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`amtc.common.model.workcenterStaff`).d('技能类型负责人')}
                  {...formLayout}
                >
                  {getFieldDecorator('resOwnerId', {
                    initialValue: dataSource.resOwnerId,
                  })(
                    <Lov
                      code="AMTC.WORKCENTER_PRINCIPAL"
                      queryParams={{ organizationId: tenantId }}
                      textValue={dataSource.resOwnerName}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.plannerFlag`).d('是否签派/计划员')}
                  {...formLayout}
                >
                  {getFieldDecorator('plannerFlag', {
                    initialValue: dataSource.plannerFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`${modelPrompt}.costFlag`).d('启用成本核算')}
                  {...formLayout}
                >
                  {getFieldDecorator('costFlag', {
                    initialValue: dataSource.costFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label={intl.get(`${modelPrompt}.enable`).d('是否启用')} {...formLayout}>
                  {getFieldDecorator('enabledFlag', {
                    initialValue: dataSource.enabledFlag,
                  })(<Switch />)}
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
              <h3>{intl.get(`${prefix}.workCenterStaff`).d('工作中心人员')}</h3>
            </Fragment>
          }
        >
          <Row style={{ margin: '10px' }}>
            <Col>
              <Button icon="plus" type="primary" onClick={this.handleAddWorkCenterStaff}>
                {intl.get(`amtc.workCenterRes.view.button.add`).d('新增')}
              </Button>
            </Col>
          </Row>
          <DetailList {...detailListProps} />
          <DetailDrawer {...drawerProps} />
        </Collapse.Panel>
      </Collapse>
    );
  }
}
export default InfoExhibit;
