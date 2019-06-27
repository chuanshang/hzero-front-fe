import React, { Component, Fragment } from 'react';
import {
  Collapse,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Icon,
  DatePicker,
  Button,
  Modal,
} from 'hzero-ui';
import Switch from 'components/Switch';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import moment from 'moment';
import { isUndefined, isEmpty } from 'lodash';
import { getDateTimeFormat, getDateFormat } from 'utils/utils';
import uuidv4 from 'uuid/v4';
import { routerRedux } from 'dva/router';

import DetailList from './DetailList';
import DetailFieldsDrawer from './DetailFieldsDrawer';
import WbsPlanList from './WbsPlanList';
import ProjectBudgetList from './ProjectBudgetList';

@Form.create({ fieldNameProps: null })
class InfoExhibit extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      proSourceDetail: {},
      collapseKeys: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    };
  }

  componentDidMount() {
    const { id, onSearchProResource, proSourcePagination = {} } = this.props;
    if (!isUndefined(id)) {
      onSearchProResource(proSourcePagination);
    }
    this.props.onRefresh();
  }

  /**
   * 数据行选择操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }

  /**
   * @function handleModalVisible - 控制modal显示与隐藏
   * @param {boolean} flag 是否显示modal
   */
  @Bind
  handleModalVisible(flag) {
    const { dispatch } = this.props;
    dispatch({
      type: 'proBasicInfo/updateState',
      payload: {
        modalVisible: !!flag,
      },
    });
  }

  /**
   * @function showCreateModal - 显示新增modal
   */
  @Bind
  showCreateModal() {
    this.setState({ proSourceDetail: {} });
    this.handleModalVisible(true);
  }

  /**
   *  @function showEditDrawer - 显示编辑modal
   */
  @Bind()
  showEditDrawer(record) {
    this.setState({ proSourceDetail: record });
    this.handleModalVisible(true);
  }

  /**
   * 删除项目资源
   */
  @Bind()
  handleDelete() {
    const { id, tenantId, dispatch, projectSourceList } = this.props;
    const { selectedRows } = this.state;
    Modal.confirm({
      iconType: '',
      content: intl.get('appm.proBasicInfo.view.message.detailLine.delete').d('是否删除项目资源？'),
      onOk: () => {
        const newProjectSourceList = projectSourceList;
        selectedRows.forEach(element1 => {
          projectSourceList.forEach(element2 => {
            if (element1.proResourceId === element2.proResourceId) {
              newProjectSourceList.splice(
                newProjectSourceList.findIndex(
                  item => item.proResourceId === element2.proResourceId
                ),
                1
              );
            }
          });
        });
        const newSelectedRows = [];
        selectedRows.forEach(item => {
          if (item._status !== 'create') {
            newSelectedRows.push(item);
          }
        });
        dispatch({
          type: 'proBasicInfo/deleteProjectSourceInfo',
          payload: {
            tenantId,
            projectId: id,
            data: [...newSelectedRows],
          },
        }).then(res => {
          if (res) {
            dispatch({
              type: 'proBasicInfo/updateState',
              payload: {
                projectSourceList: [...newProjectSourceList],
              },
            });
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
   * Drawer Ok
   * @param {obejct} values - 操作数据对象
   */
  @Bind()
  handleDrawerOk(values = {}) {
    const { dispatch, projectSourceList } = this.props;
    if (isUndefined(values.proResourceId)) {
      // 新建
      const id = uuidv4();
      dispatch({
        type: 'proBasicInfo/updateState',
        payload: {
          projectSourceList: [
            { ...values, proResourceId: id, _status: 'create' },
            ...projectSourceList,
          ],
        },
      });
    } else {
      // 编辑
      const newList = projectSourceList.map(item =>
        item.proResourceId === values.proResourceId
          ? { ...item, ...values, _status: 'update' }
          : item
      );
      dispatch({
        type: 'proBasicInfo/updateState',
        payload: {
          projectSourceList: [...newList],
        },
      });
    }
    this.setState({ proSourceDetail: {} });
    this.handleModalVisible(false);
  }

  @Bind()
  makePermission(record) {
    const permission = `${
      !isEmpty(record.planPermissionsCodeMeaning) ? `${record.planPermissionsCodeMeaning};` : ''
    }${
      !isEmpty(record.changePermissionsCodeMeaning) ? `${record.changePermissionsCodeMeaning};` : ''
    }${
      record.orderFlag === 1
        ? `${intl.get('appm.proBasicInfo.view.message.orderFlag').d('可下单')};`
        : ''
    }${
      record.convertAssetFlag === 1
        ? `${intl.get('appm.proBasicInfo.view.message.convertAssetFlag').d('可转资')};`
        : ''
    }${
      record.prepareBudgetFlag === 1
        ? `${intl.get('appm.proBasicInfo.view.message.prepareBudgetFlag').d('可编制预算')};`
        : ''
    }`;
    return permission;
  }

  /**
   * 跳转到WBS计划维护页面
   */
  @Bind()
  handleGotoWBSPlan(record) {
    this.props.dispatch(
      routerRedux.push({
        pathname: `/appm/pro-basic-info/wbs/${record.wbsHeaderId}`,
      })
    );
  }

  render() {
    const {
      isNew,
      loading,
      editFlag,
      dataSource,
      wbsPlanList,
      priorityMap,
      heathMap,
      tenantId,
      modalVisible,
      projectSourceList,
      proSourcePagination,
      proBudgetList,
      newVersionFlag,
      onGoToProBudget,
      onGotoNewProBudget,
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const { proSourceDetail, collapseKeys = [], selectedRowKeys = [] } = this.state;
    const detailListProps = {
      selectedRowKeys,
      onMakePermission: this.makePermission,
      onEditLine: this.showEditDrawer,
      onSelectRow: this.handleSelectRow,
      loading: loading.listProSource,
      dataSource: projectSourceList,
      pagination: proSourcePagination,
    };
    const drawerProps = {
      tenantId,
      projectSourceDetail: proSourceDetail,
      visible: modalVisible,
      onHideDrawer: this.handleModalVisible,
      onOk: this.handleDrawerOk,
    };
    const wbsPlanListProps = {
      loading: loading.history,
      onGoToWBS: this.handleGotoWBSPlan,
      dataSource: wbsPlanList,
    };
    const budgetListProps = {
      newVersionFlag,
      onGotoNewProBudget,
      onGoToProBudget,
      loading: loading.budget,
      initLoading: loading.initProjectBudget,
      dataSource: proBudgetList,
    };
    const promptCode = 'appm.proBasicInfo.model.proBasicInfo';
    const formLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const midFormLayout = {
      labelCol: { span: 11 },
      wrapperCol: { span: 13 },
    };
    const maxLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    return (
      <Collapse
        bordered={false}
        defaultActiveKey={['A', 'B', 'C', 'D', 'E']}
        className="associated-collapse"
      >
        <Collapse.Panel
          showArrow={false}
          key="A"
          header={
            <Fragment>
              <Icon type={collapseKeys.includes('A') ? 'minus' : 'plus'} />
              <h3>{intl.get(`${promptCode}.panel.a`).d('项目概览')}</h3>
            </Fragment>
          }
        >
          <Form>
            <Row>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${promptCode}.maintSitesName`).d('服务区域')}
                  {...formLayout}
                >
                  {getFieldDecorator('maintSitesId', {
                    initialValue: dataSource.maintSitesId,
                    rules: [],
                  })(
                    <Lov
                      disabled={!editFlag}
                      code="AMDM.ASSET_MAINT_SITE"
                      textValue={dataSource.maintSitesName}
                      queryParams={{ organizationId: tenantId }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label={intl.get(`${promptCode}.proType`).d('项目类型')} {...formLayout}>
                  {getFieldDecorator('proTypeId', {
                    initialValue: dataSource.proTypeId,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${promptCode}.proType`).d('项目类型'),
                        }),
                      },
                    ],
                  })(
                    <Lov
                      code="APPM.PROJECT_TYPE"
                      disabled={!editFlag}
                      queryParams={{ organizationId: tenantId }}
                      textValue={dataSource.proTypeName}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${promptCode}.projectTemplate`).d('项目模板')}
                  {...formLayout}
                >
                  {getFieldDecorator('projectTemplateId', {
                    initialValue: dataSource.projectTemplateId,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${promptCode}.projectTemplate`).d('项目模板'),
                        }),
                      },
                    ],
                  })(
                    <Lov
                      code="APPM.PROJECT_TEMPLATE"
                      disabled={!editFlag}
                      queryParams={{ organizationId: tenantId }}
                      textValue={dataSource.projectTemplateName}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={21}>
                <Form.Item
                  label={intl.get(`${promptCode}.projectName`).d('项目名称')}
                  {...maxLayout}
                >
                  {getFieldDecorator('projectName', {
                    initialValue: dataSource.projectName,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${promptCode}.projectName`).d('项目名称'),
                        }),
                      },
                      {
                        max: 240,
                        message: intl.get('hzero.common.validation.max', {
                          max: 240,
                        }),
                      },
                    ],
                  })(<Input disabled={isNew} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${promptCode}.preProjectCode`).d('预项目编号')}
                  {...formLayout}
                >
                  {getFieldDecorator('preProjectCode', {
                    initialValue: dataSource.preProjectCode,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${promptCode}.preProjectCode`).d('预项目编号'),
                        }),
                      },
                      {
                        max: 30,
                        message: intl.get('hzero.common.validation.max', {
                          max: 30,
                        }),
                      },
                    ],
                  })(<Input disabled={isNew} />)}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${promptCode}.projectCode`).d('项目编号')}
                  {...formLayout}
                >
                  {getFieldDecorator('projectCode', {
                    initialValue: dataSource.projectCode,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${promptCode}.projectCode`).d('项目编号'),
                        }),
                      },
                      {
                        max: 30,
                        message: intl.get('hzero.common.validation.max', {
                          max: 30,
                        }),
                      },
                    ],
                  })(<Input disabled={isNew} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Form.Item label={intl.get(`${promptCode}.createdBy`).d('创建人')} {...formLayout}>
                  {getFieldDecorator('createdByName', {
                    initialValue: dataSource.createdByName,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${promptCode}.creationDate`).d('创建时间')}
                  {...formLayout}
                >
                  {getFieldDecorator('creationDate', {
                    initialValue: dataSource.creationDate
                      ? moment(dataSource.creationDate, getDateTimeFormat())
                      : null,
                  })(
                    <DatePicker
                      disabled
                      format={getDateTimeFormat()}
                      style={{ width: '100%' }}
                      placeholder=""
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${promptCode}.proStatus`).d('项目状态')}
                  {...formLayout}
                >
                  {getFieldDecorator('proStatusId', {
                    initialValue: dataSource.proStatusId,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${promptCode}.proStatus`).d('项目状态'),
                        }),
                      },
                    ],
                  })(
                    <Lov
                      code="APPM.PROJECT_STATUS"
                      disabled={!editFlag}
                      queryParams={{ organizationId: tenantId }}
                      textValue={dataSource.proStatusName}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={21}>
                <Form.Item
                  label={intl.get(`${promptCode}.description`).d('项目概述')}
                  {...maxLayout}
                >
                  {getFieldDecorator('description', {
                    initialValue: dataSource.description,
                    rules: [
                      {
                        max: 240,
                        message: intl.get('hzero.common.validation.max', {
                          max: 240,
                        }),
                      },
                    ],
                  })(<Input.TextArea rows={3} disabled={!editFlag} />)}
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
              <h3>{intl.get(`${promptCode}.panel.b`).d('基本信息')}</h3>
            </Fragment>
          }
        >
          <Form>
            <Row>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${promptCode}.startDate`).d('预计开始日期')}
                  {...midFormLayout}
                >
                  {getFieldDecorator('startDate', {
                    initialValue: dataSource.startDate
                      ? moment(dataSource.startDate, getDateFormat())
                      : null,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${promptCode}.startDate`).d('预计开始日期'),
                        }),
                      },
                    ],
                  })(
                    <DatePicker
                      format={getDateFormat()}
                      disabled={!editFlag}
                      style={{ width: '100%' }}
                      placeholder=""
                      disabledDate={currentDate =>
                        getFieldValue('endDate') &&
                        moment(getFieldValue('endDate')).isBefore(currentDate, 'day')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${promptCode}.endDate`).d('预计结束日期')}
                  {...midFormLayout}
                >
                  {getFieldDecorator('endDate', {
                    initialValue: dataSource.endDate
                      ? moment(dataSource.endDate, getDateFormat())
                      : null,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${promptCode}.endDate`).d('预计结束日期'),
                        }),
                      },
                    ],
                  })(
                    <DatePicker
                      format={getDateFormat()}
                      disabled={!editFlag}
                      style={{ width: '100%' }}
                      placeholder=""
                      disabledDate={currentDate =>
                        getFieldValue('startDate') &&
                        moment(getFieldValue('startDate')).isAfter(currentDate, 'day')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${promptCode}.projectArea`).d('项目面积(m2)')}
                  {...midFormLayout}
                >
                  {getFieldDecorator('projectArea', {
                    initialValue: dataSource.projectArea,
                  })(<InputNumber style={{ width: '100%' }} precision={2} disabled={!editFlag} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${promptCode}.manageOrg`).d('项目管理组织')}
                  {...midFormLayout}
                >
                  {getFieldDecorator('manageOrgId', {
                    initialValue: dataSource.manageOrgId,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${promptCode}.manageOrg`).d('项目管理组织'),
                        }),
                      },
                    ],
                  })(
                    <Lov
                      code="AMDM.ORGANIZATION"
                      disabled={!editFlag}
                      queryParams={{ organizationId: tenantId }}
                      textValue={dataSource.manageOrgName}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${promptCode}.implementOrg`).d('项目实施组织')}
                  {...midFormLayout}
                >
                  {getFieldDecorator('implementOrgId', {
                    initialValue: dataSource.implementOrgId,
                    rules: [],
                  })(
                    <Lov
                      code="AMDM.ORGANIZATION"
                      disabled={!editFlag}
                      queryParams={{ organizationId: tenantId }}
                      textValue={dataSource.implementOrgName}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${promptCode}.principal`).d('项目负责人')}
                  {...midFormLayout}
                >
                  {getFieldDecorator('principalPersonId', {
                    initialValue: dataSource.principalPerson,
                    rules: [],
                  })(
                    <Lov
                      code="HALM_EMPLOYEE"
                      disabled={!editFlag}
                      queryParams={{ organizationId: tenantId }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${promptCode}.priority`).d('优先级')}
                  {...midFormLayout}
                >
                  {getFieldDecorator('priorityCode', {
                    initialValue: dataSource.priorityCode,
                  })(
                    <Select disabled={!editFlag}>
                      {priorityMap.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${promptCode}.healthCondition`).d('项目健康状况')}
                  {...midFormLayout}
                >
                  {getFieldDecorator('healthCondition', {
                    initialValue: dataSource.healthCondition,
                  })(
                    <Select disabled={!editFlag}>
                      {heathMap.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Form.Item
                  label={intl.get(`${promptCode}.workdayFlag`).d('考虑工作日')}
                  {...midFormLayout}
                >
                  {getFieldDecorator('workdayFlag', {
                    initialValue: dataSource.workdayFlag,
                  })(<Switch disabled={!editFlag} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Collapse.Panel>
        <Collapse.Panel
          showArrow={false}
          key="C"
          header={
            <Fragment>
              <Icon type={collapseKeys.includes('C') ? 'minus' : 'plus'} />
              <h3>{intl.get(`${promptCode}.panel.c`).d('项目资源')}</h3>
            </Fragment>
          }
        >
          <Row style={{ margin: '10px' }}>
            <Col>
              <Button
                icon="plus"
                type="primary"
                style={{ marginRight: '10px' }}
                onClick={this.showCreateModal}
              >
                {intl.get('appm.proBasicInfo.view.button.add').d('新增')}
              </Button>
              <Button
                icon="delete"
                disabled={isEmpty(selectedRowKeys)}
                onClick={() => this.handleDelete()}
              >
                {intl.get('hzero.common.button.delete').d('删除')}
              </Button>
            </Col>
          </Row>
          <DetailList {...detailListProps} />
          <DetailFieldsDrawer {...drawerProps} />
        </Collapse.Panel>
        <Collapse.Panel
          showArrow={false}
          key="D"
          header={
            <Fragment>
              <Icon type={collapseKeys.includes('D') ? 'minus' : 'plus'} />
              <h3>{intl.get(`${promptCode}.panel.d`).d('项目计划')}</h3>
            </Fragment>
          }
        >
          <WbsPlanList {...wbsPlanListProps} />
        </Collapse.Panel>
        <Collapse.Panel
          showArrow={false}
          key="E"
          header={
            <Fragment>
              <Icon type={collapseKeys.includes('E') ? 'minus' : 'plus'} />
              <h3>{intl.get(`${promptCode}.panel.e`).d('项目预算概览')}</h3>
            </Fragment>
          }
        >
          <ProjectBudgetList {...budgetListProps} />
        </Collapse.Panel>
        {/* <Collapse.Panel
          showArrow={false}
          key="E"
          header={
            <Fragment>
              <Icon type={collapseKeys.includes('E') ? 'minus' : 'plus'} />
              <h3>{intl.get(`${promptCode}.panel.e`).d('物流信息')}</h3>
            </Fragment>
          }
        >

        </Collapse.Panel>
        <Collapse.Panel
          showArrow={false}
          key="F"
          header={
            <Fragment>
              <Icon type={collapseKeys.includes('F') ? 'minus' : 'plus'} />
              <h3>{intl.get(`${promptCode}.panel.f`).d('评估结论')}</h3>
            </Fragment>
          }
        >

        </Collapse.Panel>
        <Collapse.Panel
          showArrow={false}
          key="G"
          header={
            <Fragment>
              <Icon type={collapseKeys.includes('G') ? 'minus' : 'plus'} />
              <h3>{intl.get(`${promptCode}.panel.g`).d('租赁合同')}</h3>
            </Fragment>
          }
        >

        </Collapse.Panel> */}
      </Collapse>
    );
  }
}
export default InfoExhibit;
