import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators/index';
import { isUndefined } from 'lodash';
import { routerRedux } from 'dva/router';
import { Collapse, Form, Input, Row, Col, Icon, Button } from 'hzero-ui';
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
      workcenterResDetail: {},
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
    this.setState({ drawerVisible: false, workcenterResDetail: {} });
  }

  /**
   * 新增工作中心信息
   */
  @Bind()
  handleAddSkillType() {
    this.setState({ drawerVisible: true });
  }

  /**
   *  @function showEditDrawer - 显示编辑modal
   */
  @Bind()
  showEditDrawer(record) {
    this.setState({ drawerVisible: true, workcenterResDetail: record });
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
      dataSource: { workcenterId },
    } = this.props;
    dispatch({
      type: isUndefined(values.workcenterResId)
        ? 'workCenter/saveWorkCenterResAddData'
        : 'workCenter/saveWorkCenterResEditData',
      payload: { ...values, tenantId },
    }).then(res => {
      if (res) {
        notification.success();
        dispatch({
          type: 'workCenter/fetchDetailListInfo',
          payload: {
            tenantId,
            workcenterId,
          },
        });
        this.setState({ workcenterResDetail: {}, drawerVisible: false });
      }
    });
  }

  @Bind()
  onGotoDetail(workcenterResId) {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/amtc/work-center-res/detail/${workcenterResId}` }));
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
    const { collapseKeys = [], drawerVisible = false, workcenterResDetail = {} } = this.state;
    const formLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const formLongLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 13 },
    };
    const { workcenterName, workcenterId } = dataSource;
    const prefix = `amtc.workCenter.view.message`;
    const modelPrompt = 'amtc.workCenter.model.workCenter';
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
      dataSource: { ...workcenterResDetail, workcenterName, workcenterId },
      title: intl.get(`amtc.workCenter.view.message.drawer`).d('新建技能类型'),
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
                  label={intl.get(`amtc.common.model.workcenterName`).d('工作中心名称')}
                  {...formLayout}
                >
                  {getFieldDecorator('workcenterName', {
                    initialValue: dataSource.workcenterName,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`amtc.common.model.workcenterName`).d('工作中心名称'),
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`aafm.common.model.workcenterShortName`).d('代码／简称')}
                  {...formLayout}
                >
                  {getFieldDecorator('workcenterShortName', {
                    initialValue: dataSource.workcenterShortName,
                    rules: [],
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`aafm.common.model.workcenterNum`).d('工作中心编号')}
                  {...formLayout}
                >
                  {getFieldDecorator('workcenterNum', {
                    initialValue: dataSource.workcenterNum,
                    rules: [],
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item
                  label={intl.get(`amtc.common.model.maintSitesId`).d('服务区域')}
                  {...formLayout}
                >
                  {getFieldDecorator('maintSitesId', {
                    initialValue: dataSource.maintSitesId,
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
                  label={intl.get(`amtc.common.model.workcenterOwner`).d('工作中心负责人')}
                  {...formLayout}
                >
                  {getFieldDecorator('workcenterOwnerId', {
                    initialValue: dataSource.workcenterOwnerId,
                  })(
                    <Lov
                      code="AMTC.WORKCENTER_PRINCIPAL"
                      queryParams={{ organizationId: tenantId }}
                      textValue={dataSource.workcenterStaffName}
                    />
                  )}
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
              <h3>{intl.get(`${prefix}.attributeLine`).d('技能类型')}</h3>
            </Fragment>
          }
        >
          <Row style={{ margin: '10px' }}>
            <Col>
              <Button icon="plus" type="primary" onClick={this.handleAddSkillType}>
                {intl.get(`amtc.workCenter.view.button.add`).d('新增')}
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
