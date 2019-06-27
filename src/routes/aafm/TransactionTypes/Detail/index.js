/**
 * index - 资产事务处理类型明细页
 * @date: 2019-3-22
 * @author: HBT <qing.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { Fragment, Component } from 'react';
import { Button, Row, Col, Spin } from 'hzero-ui';
import { connect } from 'dva';
import { isUndefined } from 'lodash';
import classNames from 'classnames';
import { Bind } from 'lodash-decorators';
import { routerRedux } from 'dva/router';
import uuidv4 from 'uuid/v4';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { DETAIL_DEFAULT_CLASSNAME } from 'utils/constants';
import { getCurrentOrganizationId, getEditTableData } from 'utils/utils';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import FullTextSearch from './FullTextSearch';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ loading, transactionTypes }) => ({
  transactionTypes,
  loading: {
    fetchDetailInfoLoading: loading.effects['transactionTypes/fetchDetailInfo'],
    fullTextSearchLoading: loading.effects['transactionTypes/searchFullText'],
    saveDetailLoading:
      loading.effects['transactionTypes/saveEditData'] ||
      loading.effects['transactionTypes/saveAddData'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: ['aafm.transactionTypes', 'amdm.common'],
})
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultDetailItem: {
        enabledFlag: 1,
        crossLegalFlag: 0,
        checkCurrentOrgFlag: 0,
        checkTargetOrgFlag: 0,
        basicColumnFlag: 0,
        attributeColumnFlag: 0,
        trackingFlag: 0,
        statusUpdateFlag: 0,
        specialAssetFlag: 0,
      },
    };
  }

  /**
   * componentDidMount 生命周期函数
   * render后请求页面数据
   */
  componentDidMount() {
    const {
      dispatch,
      tenantId,
      match: { url, params },
    } = this.props;
    const { defaultDetailItem } = this.state;
    if (url.indexOf('create') === -1) {
      this.handleFullSearch();
    } else {
      const { id } = params;
      if (!isUndefined(id)) {
        dispatch({
          type: 'transactionTypes/fetchParentTransactionTypes',
          payload: { tenantId, transactionTypeId: id },
        }).then(res => {
          this.setState({
            defaultDetailItem: {
              ...defaultDetailItem,
              parentTypeName: res,
              parentTypeId: Number(id),
            },
          });
        });
      }
    }
    dispatch({
      type: 'transactionTypes/init',
      payload: {
        tenantId,
      },
    });
    dispatch({ type: 'transactionTypes/fetchTransactionTypesOrg', payload: { tenantId } });
    dispatch({ type: 'transactionTypes/fetchAssetStatus', payload: { tenantId } });
    dispatch({ type: 'transactionTypes/fetchAssetSpecialty', payload: { tenantId } });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'transactionTypes/updateState',
      payload: {
        statusUpdateFlag: false,
        basicColumnFlag: false,
        basicAssetColumnList: [],
        trackingFlag: false,
        trackingManagementColumnList: [],
        deleteColumnList: [],
      },
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
   * 明细页全文检索
   * @param {*}
   */
  @Bind()
  handleFullSearch(condition = '', page = {}) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'transactionTypes/searchFullText',
      payload: {
        tenantId,
        page,
        detailSelectItem: condition,
      },
    });
    // this.handleSearch();
  }

  /**
   * 查询
   */
  @Bind()
  handleSearch() {
    const { dispatch, tenantId, match } = this.props;
    const { maintSitesId } = match.params;
    const { defaultDetailItem } = this.state;
    dispatch({
      type: 'maintSites/queryDetail',
      payload: {
        tenantId,
        maintSitesId,
      },
    }).then(res => {
      if (res) {
        const newDefaultDetailItem = {
          ...defaultDetailItem,
        };
        this.setState({
          defaultDetailItem: newDefaultDetailItem,
        });
      }
    });
  }

  /**
   * fetchDetailInfo - 查询组织详细信息
   */
  @Bind()
  fetchDetailInfo() {
    const {
      tenantId,
      match: {
        params: { id },
      },
    } = this.props;
    const { dispatch } = this.props;

    if (!isUndefined(id)) {
      dispatch({
        type: 'transactionTypes/fetchDetailInfo',
        payload: {
          tenantId,
          transactionTypeId: id,
        },
      }).then(res => {
        if (res) {
          dispatch({
            type: 'transactionTypes/updateState',
            payload: {
              isCreateFlag: true,
            },
          });
        }
      });
    }
  }

  /**
   * deleteBasicColumnLine - 删除基础字段变更信息
   */
  @Bind()
  deleteBasicColumnLine(record) {
    const {
      dispatch,
      transactionTypes: { basicAssetColumnList = [], deleteColumnList = [] },
    } = this.props;
    const newList = basicAssetColumnList.filter(item => item.fieldId !== record.fieldId);

    dispatch({
      type: 'transactionTypes/updateState',
      payload: {
        basicAssetColumnList: [...newList],
        deleteColumnList: [...deleteColumnList, record],
      },
    });
  }

  /**
   * addBasicColumnLine - 新增基础字段变更信息
   */
  @Bind()
  addBasicColumnLine() {
    const {
      dispatch,
      transactionTypes: { basicAssetColumnList = [] },
    } = this.props;
    dispatch({
      type: 'transactionTypes/updateState',
      payload: {
        basicAssetColumnList: [
          {
            fieldId: uuidv4(),
            fieldColumn: '', // 字段
            fieldType: '', // 类型
            _status: 'create',
          },
          ...basicAssetColumnList,
        ],
      },
    });
  }

  /**
   * deleteTrackingManagementColumnLine - 删除跟踪管理字段变更信息
   */
  @Bind()
  deleteTrackingManagementColumnLine(record) {
    const {
      dispatch,
      transactionTypes: { trackingManagementColumnList = [], deleteColumnList = [] },
    } = this.props;
    const newList = trackingManagementColumnList.filter(item => item.fieldId !== record.fieldId);

    dispatch({
      type: 'transactionTypes/updateState',
      payload: {
        trackingManagementColumnList: [...newList],
        deleteColumnList: [...deleteColumnList, record],
      },
    });
  }

  /**
   * addTrackingManagementColumnLine - 新增跟踪管理字段变更信息
   */
  @Bind()
  addTrackingManagementColumnLine() {
    const {
      dispatch,
      transactionTypes: { trackingManagementColumnList = [] },
    } = this.props;
    dispatch({
      type: 'transactionTypes/updateState',
      payload: {
        trackingManagementColumnList: [
          {
            fieldId: uuidv4(),
            _status: 'create',
          },
          ...trackingManagementColumnList,
        ],
      },
    });
  }

  /**
   * 需要修改资产状态开关方法
   */
  @Bind
  changeStatusUpdateFlag(flag) {
    const { dispatch } = this.props;
    const newStatusUpdateFlag = flag === 1;
    dispatch({
      type: 'transactionTypes/updateState',
      payload: {
        statusUpdateFlag: newStatusUpdateFlag,
      },
    });
  }

  /**
   * 涉及基本信息变更开关方法
   */
  @Bind
  changeBasicColumnFlag(flag) {
    const {
      dispatch,
      transactionTypes: { basicAssetColumnList = [] },
    } = this.props;
    const newBasicColumnFlag = flag === 1;

    let newBasicAssetColumnList = [];
    if (basicAssetColumnList.length === 0 && newBasicColumnFlag === 1) {
      newBasicAssetColumnList = [
        {
          fieldId: uuidv4(),
          fieldColumn: 'tracking_num',
          fieldColumnMeaning: '其它跟踪编号',
          _status: 'create',
        },
      ];
    } else {
      newBasicAssetColumnList = basicAssetColumnList;
    }
    dispatch({
      type: 'transactionTypes/updateState',
      payload: {
        basicColumnFlag: newBasicColumnFlag,
        basicAssetColumnList: newBasicAssetColumnList,
      },
    });
  }

  /**
   * 涉及跟踪管理变更开关方法
   */
  @Bind
  changetrackingFlag(flag) {
    const {
      dispatch,
      transactionTypes: { trackingManagementColumnList = [] },
    } = this.props;
    const newtrackingFlag = flag === 1;
    let newTrackingManagementColumnList;
    if (trackingManagementColumnList.length === 0 && newtrackingFlag === 1) {
      newTrackingManagementColumnList = [
        {
          fieldId: uuidv4(),
          fieldColumn: 'owning_org_id',
          fieldColumnMeaning: '所属组织',
          _status: 'create',
        },
        {
          fieldId: uuidv4(),
          fieldColumn: 'cost_center_code',
          fieldColumnMeaning: '成本中心',
          _status: 'create',
        },
      ];
    } else {
      newTrackingManagementColumnList = trackingManagementColumnList;
    }
    dispatch({
      type: 'transactionTypes/updateState',
      payload: {
        trackingFlag: newtrackingFlag,
        trackingManagementColumnList: newTrackingManagementColumnList,
      },
    });
  }

  /**
   * 数据保存
   */
  @Bind()
  handleSaveTransactionTypes() {
    const {
      tenantId,
      dispatch,
      transactionTypes,
      match: {
        url,
        params: { id },
      },
    } = this.props;
    const {
      detail = {},
      basicAssetColumnList,
      trackingManagementColumnList,
      deleteColumnList,
    } = transactionTypes;
    const { defaultDetailItem } = this.state;
    this.form.validateFields((err, values) => {
      if (!err) {
        const basicAssetColumnListData =
          (basicAssetColumnList.length && getEditTableData(basicAssetColumnList, ['fieldId'])) ||
          [];
        const trackingManagementColumnListData =
          (trackingManagementColumnList.length &&
            getEditTableData(trackingManagementColumnList, ['fieldId'])) ||
          [];
        const deleteColumnListData =
          (deleteColumnList.length && getEditTableData(deleteColumnList, ['fieldId'])) || [];
        deleteColumnListData.filter(item => !isUndefined(item.fieldId) && item.fieldId !== '');

        const { enabledFlag } = values;
        const params = isUndefined(id)
          ? {
              ...defaultDetailItem,
              ...values,
              organizationScope: JSON.stringify(values.organizationScope),
              statusScope: JSON.stringify(values.statusScope),
              specialtyScope: JSON.stringify(values.specialtyScope),
              targetAssetStatusScope: JSON.stringify(values.targetAssetStatusScope),
              tenantId,
              basicAssetColumnList: basicAssetColumnListData,
              trackingManagementColumnList: trackingManagementColumnListData,
              deleteColumnList: deleteColumnListData,
            } // 新增顶级
          : url.indexOf('create') !== -1
          ? {
              ...defaultDetailItem,
              ...values,
              tenantId,
              organizationScope: JSON.stringify(values.organizationScope),
              statusScope: JSON.stringify(values.statusScope),
              specialtyScope: JSON.stringify(values.specialtyScope),
              targetAssetStatusScope: JSON.stringify(values.targetAssetStatusScope),
              parentTypeId: Number(id),
              basicAssetColumnList: basicAssetColumnListData,
              trackingManagementColumnList: trackingManagementColumnListData,
              deleteColumnList: deleteColumnListData,
            } // 新增下级
          : {
              ...detail,
              ...values,
              organizationScope: JSON.stringify(values.organizationScope),
              statusScope: JSON.stringify(values.statusScope),
              specialtyScope: JSON.stringify(values.specialtyScope),
              targetAssetStatusScope: JSON.stringify(values.targetAssetStatusScope),
              tenantId,
              basicAssetColumnList: basicAssetColumnListData,
              trackingManagementColumnList: trackingManagementColumnListData,
              deleteColumnList: deleteColumnListData,
            }; // 编辑

        const dispatchType =
          url.indexOf('create') !== -1
            ? {
                type: 'transactionTypes/saveAddData',
                payload: { tenantId, data: params },
              }
            : {
                type: 'transactionTypes/saveEditData',
                payload: {
                  tenantId,
                  data: params,
                  statusChanged: enabledFlag !== detail.enabledFlag, // '是否启用'字段的值是否发生了变化
                },
              };
        dispatch(dispatchType).then(res => {
          if (res) {
            notification.success();
            if (!isUndefined(id) && url.indexOf('create') === -1) {
              this.fetchDetailInfo();
            } else {
              dispatch(
                routerRedux.push({
                  pathname: `/aafm/transaction-type/detail/${res.transactionTypeId}`,
                })
              );
            }
          }
        });
      }
    });
  }

  /**
   * @param {string} id - id
   */
  @Bind()
  handleGotoDetail(id) {
    this.props.dispatch(
      routerRedux.push({
        pathname: `/aafm/transaction-type/detail/${id}`,
      })
    );
  }

  render() {
    const { defaultDetailItem } = this.state;
    const {
      tenantId,
      loading,
      transactionTypes,
      dispatch,
      match: { url, params },
    } = this.props;
    const { fetchDetailInfoLoading, fullTextSearchLoading, saveDetailLoading } = loading;

    const {
      isCreateFlag,
      fullList,
      fullPagination,
      transactionTypesOrg,
      assetStatus,
      assetSpecialty,
      specialAssetMap,
      basicTypeMap,
      needTwiceConfirmMap,
      fieldTypeMap,
      statusUpdateFlag,
      basicColumnFlag,
      basicAssetColumnList,
      trackingFlag,
      trackingManagementColumnList,
      detail,
    } = transactionTypes;
    // const { transactionTypeId } = match.params;
    const isNew = url.indexOf('create') !== -1;
    const { id } = params;
    const fullTextSearchProps = {
      loading: fullTextSearchLoading,
      pagination: fullPagination,
      dataSource: fullList,
      onSearch: this.handleFullSearch,
      onGotoDetail: this.handleGotoDetail,
    };
    const infoProps = {
      url,
      dispatch,
      tenantId,
      fetchDetailInfoLoading,
      isNew,
      isCreateFlag,
      transactionTypesOrg,
      assetStatus,
      assetSpecialty,
      specialAssetMap,
      basicTypeMap,
      needTwiceConfirmMap,
      fieldTypeMap,
      statusUpdateFlag,
      basicColumnFlag,
      basicAssetColumnList,
      trackingFlag,
      trackingManagementColumnList,
      detailInfo: isNew ? defaultDetailItem : detail,
      onRef: this.handleBindRef,
      onSearch: this.fetchDetailList,
      onRefresh: this.fetchDetailInfo,
      onDeleteBasicColumnLine: this.deleteBasicColumnLine,
      onAddBasicColumnLine: this.addBasicColumnLine,
      onChangeStatusUpdateFlag: this.changeStatusUpdateFlag,
      onChangeBasicColumnFlag: this.changeBasicColumnFlag,
      onChangetrackingFlag: this.changetrackingFlag,
      onDeleteTrackingManagementColumnLine: this.deleteTrackingManagementColumnLine,
      onAddTrackingManagementColumnLine: this.addTrackingManagementColumnLine,
      key: id,
    };
    return (
      <Fragment>
        <Header
          title={intl.get(`aafm.transactionTypes.view.title.detail`).d('资产事务处理类型详情')}
          backPath="/aafm/transaction-type/list"
        >
          <Button
            type="primary"
            icon="save"
            loading={saveDetailLoading}
            onClick={this.handleSaveTransactionTypes}
          >
            {intl.get(`hzero.common.button.save`).d('保存')}
          </Button>
        </Header>
        <Content>
          <Row className={classNames(styles['transactionTypes-detail'])}>
            <Col span={isNew ? 0 : 6}>
              <FullTextSearch {...fullTextSearchProps} />
            </Col>
            <Col span={isNew ? 24 : 17} offset={isNew ? 0 : 1}>
              <Spin
                spinning={isNew ? false : fetchDetailInfoLoading}
                wrapperClassName={classNames(
                  styles['transactionTypes-detail'],
                  DETAIL_DEFAULT_CLASSNAME
                )}
              >
                <InfoExhibit {...infoProps} />
              </Spin>
            </Col>
          </Row>
        </Content>
      </Fragment>
    );
  }
}
export default Detail;
