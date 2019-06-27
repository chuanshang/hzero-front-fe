/**
 * 项目基本信息 创建/编辑-明细
 * @date: 2019-2-19
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { Component } from 'react';
import { Button, Row, Col, Spin, Modal } from 'hzero-ui';
import { connect } from 'dva';
import { isUndefined, isEmpty } from 'lodash';
import classNames from 'classnames';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId, getDateTimeFormat, getEditTableData } from 'utils/utils';
import notification from 'utils/notification';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import moment from 'moment';
import formatterCollections from 'utils/intl/formatterCollections';
import FullTextSearch from './FullTextSearch';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ proBasicInfo, loading }) => ({
  proBasicInfo,
  loading: {
    detail: loading.effects['proBasicInfo/fetchPropBasicInfoDetail'],
    delete: loading.effects['proBasicInfo/deletePropBasicInfo'],
    submit: loading.effects['proBasicInfo/submitProBasicInfo'],
    history: loading.effects['proBasicInfo/fetchWbsPain'],
    budget: loading.effects['proBasicInfo/fetchProjectBudgets'],
    fullTextSearch: loading.effects['proBasicInfo/searchFullText'],
    listProSource: loading.effects['proBasicInfo/fetchProjectSourceInfo'],
    initProjectBudget: loading.effects['proBasicInfo/initProjectBudget'],
    save:
      loading.effects['proBasicInfo/addProBasicInfo'] ||
      loading.effects['proBasicInfo/updateProBasicInfo'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: ['appm.proBasicInfo', 'appm.common'],
})
class Detail extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      editFlag: true,
      newVersionFlag: '',
      defaultDetailItem: {
        workdayFlag: 0,
      },
      dateTimeFormat: getDateTimeFormat(),
    };
  }

  componentDidMount() {
    const {
      dispatch,
      tenantId,
      match: { params },
    } = this.props;
    const { id } = params;
    if (!isUndefined(id)) {
      this.handleFullSearch('', {});
    }
    dispatch({ type: 'proBasicInfo/fetchLov', payload: { tenantId } });
    dispatch({ type: 'proBasicInfo/fetchProjectStatus', payload: { tenantId } }).then(res => {
      if (res) {
        let draftStatusId;
        let draftStatusName;
        res.forEach(i => {
          if (i.proStatusCode === 'DRAFT') {
            draftStatusId = i.proStatusId;
            draftStatusName = i.sysStatusName;
          }
        });
        this.setState({
          defaultDetailItem: {
            workdayFlag: 0,
            proStatusId: draftStatusId, // 状态ID
            proStatusName: draftStatusName, // 状态名称
          },
        });
      }
    });
  }

  /**
   * 数据保存
   */
  @Bind()
  handleProBasicInfoSave() {
    const {
      dispatch,
      tenantId,
      match,
      proBasicInfo: { detail, projectSourceList },
    } = this.props;
    const { id } = match.params;
    const { defaultDetailItem, dateTimeFormat } = this.state;
    this.form.validateFields((err, values) => {
      if (!err) {
        const newProjectSourceList = [];
        projectSourceList.forEach(item => {
          if (['create', 'update'].includes(item._status)) {
            newProjectSourceList.push(item);
          }
        });
        const projectSourceData =
          (newProjectSourceList.length &&
            getEditTableData(newProjectSourceList, ['proResourceId'])) ||
          [];
        if (isUndefined(id)) {
          // 新增
          dispatch({
            type: 'proBasicInfo/addProBasicInfo',
            payload: {
              tenantId,
              data: {
                ...defaultDetailItem,
                ...values,
                projectResourceList: projectSourceData || [],
                startDate: moment(values.startDate).format(dateTimeFormat),
                endDate: moment(values.endDate).format(dateTimeFormat),
              },
            },
          }).then(res => {
            if (res) {
              notification.success();
              dispatch(
                routerRedux.push({
                  pathname: `/appm/pro-basic-info/detail/${res.projectId}`,
                })
              );
            }
          });
        } else {
          // 编辑
          dispatch({
            type: 'proBasicInfo/updateProBasicInfo',
            payload: {
              tenantId,
              data: {
                ...defaultDetailItem,
                ...detail,
                ...values,
                projectResourceList: projectSourceData || [],
                startDate: moment(values.startDate).format(dateTimeFormat),
                endDate: moment(values.endDate).format(dateTimeFormat),
                creationDate: moment(values.creationDate).format(dateTimeFormat),
              },
            },
          }).then(res => {
            if (res) {
              notification.success();
              this.handleSearch();
              this.handleSearchProResource();
            }
          });
        }
      }
    });
  }

  /**
   * 数据删除
   */
  @Bind()
  handleProBasicInfoDelete() {
    const {
      dispatch,
      tenantId,
      proBasicInfo: { detail },
    } = this.props;
    Modal.confirm({
      iconType: '',
      content: intl
        .get('appm.proBasicInfo.view.message.detail.delete')
        .d('是否删除该条项目基础信息记录'),
      onOk: () => {
        dispatch({
          type: 'proBasicInfo/deletePropBasicInfo',
          payload: {
            tenantId,
            data: [{ ...detail, projectResourceList: null }],
          },
        }).then(res => {
          if (res) {
            notification.success();
            dispatch(
              routerRedux.push({
                pathname: '/appm/pro-basic-info/list',
              })
            );
          }
        });
      },
    });
  }

  /**
   * 明细页详细信息查询
   */
  @Bind()
  handleSearch() {
    const { dispatch, match, tenantId } = this.props;
    const { id } = match.params;
    if (!isUndefined(id)) {
      dispatch({
        type: 'proBasicInfo/fetchPropBasicInfoDetail',
        payload: {
          tenantId,
          projectId: id,
        },
      }).then(res => {
        if (!isUndefined(res) && res.proStatusCode !== 'DRAFT') {
          this.setState({
            editFlag: false,
          });
        }
      });
      dispatch({
        type: 'proBasicInfo/fetchWbsPain',
        payload: {
          tenantId,
          projectId: id,
        },
      });
      dispatch({
        type: 'proBasicInfo/fetchProjectBudgets',
        payload: {
          tenantId,
          projectId: id,
        },
      });
    } else {
      dispatch({
        type: 'proBasicInfo/updateState',
        payload: {
          projectSourceList: [],
          wbsPlanList: [],
          proBudgetList: [],
        },
      });
      this.setState({
        defaultDetailItem: {
          workdayFlag: 0, // 考虑工作日
        },
      });
    }
  }

  /**
   * 明细页-数据检索
   */
  @Bind()
  handleFullSearch(condition = '', page = {}) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'proBasicInfo/searchFullText',
      payload: {
        tenantId,
        page,
        detailSelectItem: condition,
      },
    });
  }

  /**
   * 页面查询
   * @param {object} fields - 查询参数
   */
  @Bind()
  handleSearchProResource(fields = {}) {
    const {
      dispatch,
      tenantId,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch({
      type: 'proBasicInfo/fetchProjectSourceInfo',
      payload: {
        tenantId,
        projectId: id,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   * 跳转到明细页
   * @param {string} id - 项目基础信息id
   */
  @Bind()
  handleGotoDetail(id) {
    this.props.dispatch(
      routerRedux.push({
        pathname: `/appm/pro-basic-info/detail/${id}`,
      })
    );
  }

  /**
   * 提交项目
   */
  @Bind()
  handleProBasicInfoSubmit() {
    const {
      dispatch,
      tenantId,
      match,
      proBasicInfo: { detail, projectSourceList },
    } = this.props;
    const { id } = match.params;
    const { defaultDetailItem, dateTimeFormat } = this.state;
    this.form.validateFields((err, values) => {
      if (!err) {
        const newProjectSourceList = [];
        projectSourceList.forEach(item => {
          if (['create', 'update'].includes(item._status)) {
            newProjectSourceList.push(item);
          }
        });
        const projectSourceData =
          (newProjectSourceList.length &&
            getEditTableData(newProjectSourceList, ['proResourceId'])) ||
          [];
        dispatch({
          type: 'proBasicInfo/submitProBasicInfo',
          payload: {
            tenantId,
            projectId: id,
            data: {
              ...defaultDetailItem,
              ...detail,
              ...values,
              projectResourceList: projectSourceData || [],
              startDate: moment(values.startDate).format(dateTimeFormat),
              endDate: moment(values.endDate).format(dateTimeFormat),
              creationDate: moment(values.creationDate).format(dateTimeFormat),
            },
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.handleSearch();
            this.handleSearchProResource();
          }
        });
      }
    });
  }

  /**
   * 传递表单对象
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 跳转到项目预算页面
   */
  @Bind()
  handleGotoProBudget(record) {
    this.props.dispatch(
      routerRedux.push({
        pathname: `/appm/pro-basic-info/budget/${record.projectId}/${record.proBudgetId}`,
      })
    );
  }

  /**
   * 编辑新版本时，先生成拟定版本数据再跳转到项目预算页面
   */
  @Bind()
  handleGotoNewProBudget(record) {
    const { tenantId, dispatch, match } = this.props;
    const { id } = match.params;
    this.setState({
      newVersionFlag: record.budgetTypeId,
    });
    dispatch({
      type: 'proBasicInfo/initProjectBudget',
      payload: {
        tenantId,
        projectId: id,
        data: {
          budgetTypeId: record.budgetTypeId,
        },
      },
    }).then(res => {
      if (res) {
        dispatch(
          routerRedux.push({
            pathname: `/appm/pro-basic-info/budget/${id}/${res.proBudgetId}`,
          })
        );
      }
    });
  }

  render() {
    const { loading, tenantId, match, proBasicInfo, dispatch } = this.props;
    const { id } = match.params;
    const { defaultDetailItem, editFlag, newVersionFlag } = this.state;
    const {
      detail,
      fullList,
      fullPagination,
      proSourcePagination,
      projectSourceList,
      modalVisible,
      priorityMap,
      heathMap,
      wbsPlanList,
      proBudgetList,
    } = proBasicInfo;
    const fullTextSearchProps = {
      loading: loading.fullTextSearch,
      pagination: fullPagination,
      dataSource: fullList,
      onSearch: this.handleFullSearch,
      onGotoDetail: this.handleGotoDetail,
    };
    const infoProps = {
      id,
      loading,
      tenantId,
      dispatch,
      modalVisible,
      editFlag,
      priorityMap,
      heathMap,
      projectSourceList,
      wbsPlanList,
      proSourcePagination,
      proBudgetList,
      newVersionFlag,
      isNew: !isUndefined(id),
      dataSource: isUndefined(id) ? defaultDetailItem : detail,
      onRef: this.handleBindRef,
      onRefresh: this.handleSearch,
      onSearchProResource: this.handleSearchProResource,
      onGotoNewProBudget: this.handleGotoNewProBudget,
      onGoToProBudget: this.handleGotoProBudget,
      key: id,
    };
    return (
      <React.Fragment>
        <Header
          title={intl.get('appm.proBasicInfo.view.message.title.detail').d('项目基本信息详情')}
          backPath="/appm/pro-basic-info/list"
        >
          <Button
            type="primary"
            icon="save"
            loading={loading.save}
            onClick={this.handleProBasicInfoSave}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <Button
            icon="select"
            disabled={isUndefined(id) && editFlag}
            loading={loading.submit}
            onClick={this.handleProBasicInfoSubmit}
          >
            {intl.get('hzero.common.button.post').d('提交')}
          </Button>
          <Button icon="folder">
            {intl.get('appm.proBasicInfo.view.button.approvalHistory').d('审批历史')}
          </Button>
          <Button icon="upload">
            {intl.get('appm.proBasicInfo.view.button.upload').d('附件上传')}
          </Button>
          <Button
            icon="delete"
            disabled={isUndefined(id) && editFlag}
            loading={loading.delete}
            onClick={this.handleProBasicInfoDelete}
          >
            {intl.get('hzero.common.button.delete').d('删除')}
          </Button>
        </Header>
        <Content>
          <div className={classNames(styles['pro-basic-info-detail'])}>
            <Row>
              <Col span={isUndefined(id) ? 0 : 6}>
                <FullTextSearch {...fullTextSearchProps} />
              </Col>
              <Col span={isUndefined(id) ? 24 : 17} offset={isUndefined(id) ? 0 : 1}>
                <Spin spinning={isUndefined(id) ? false : loading.detail}>
                  <InfoExhibit {...infoProps} />
                </Spin>
              </Col>
            </Row>
          </div>
        </Content>
      </React.Fragment>
    );
  }
}
export default Detail;
