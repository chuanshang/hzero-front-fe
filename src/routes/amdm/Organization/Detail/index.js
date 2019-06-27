/**
 * index - 组织明细页
 * @date: 2019-2-25
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { Fragment, Component } from 'react';
import { Button, Row, Col, Spin } from 'hzero-ui';
import { connect } from 'dva';
import { isUndefined, isNumber } from 'lodash';
import classNames from 'classnames';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import { getCurrentOrganizationId, getEditTableData, getCurrentUser } from 'utils/utils';
import { DETAIL_DEFAULT_CLASSNAME } from 'utils/constants';
import notification from 'utils/notification';
import uuidv4 from 'uuid/v4';
import formatterCollections from 'utils/intl/formatterCollections';
import FullTextSearch from './FullTextSearch';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ loading, organization }) => ({
  organization,
  loading: {
    fetchDetailInfoLoading: loading.effects['organization/fetchDetailInfo'],
    fullTextSearchLoading: loading.effects['organization/queryOrganizationList'],
    saveDetailLoading:
      loading.effects['organization/saveEditData'] || loading.effects['organization/saveAddData'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: ['amdm.organization', 'amdm.common'],
})
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultDetailItem: {
        legalPersonFlag: 0, // 法人
        supplierFlag: 0, // 供应商
        customerFlag: 0, // 是否客户
        assetOrgFlag: 1, // 可分配使用资产
        outServicesFlag: 0, // 是否可提供委外服务
        orgType: 'INTERNAL_ORG', // 组织类型 默认"内部"
        email: getCurrentUser().email, // 用户邮箱
        costCenterCode: 'test', // todo 后续lov维护之后删除
        businessTypeCode: 'test', // todo 业务类型 后续维护lov后删掉
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
          type: 'organization/fetchParentOrganization',
          payload: { tenantId, orgId: id },
        }).then(res => {
          this.setState({
            defaultDetailItem: {
              ...defaultDetailItem,
              parentOrganizationName: res,
              parentOrgId: Number(id),
            },
          });
        });
      }
    }
    dispatch({
      type: 'organization/init',
      payload: {
        tenantId,
      },
    });
  }

  /**
   * 明细页-数据检索
   */
  @Bind()
  handleFullSearch(condition = '') {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'organization/queryOrganizationList',
      payload: {
        tenantId,
        condition,
      },
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
        url,
        params: { id },
      },
    } = this.props;
    const { dispatch } = this.props;
    if (!isUndefined(id)) {
      dispatch({
        type: 'organization/fetchDetailInfo',
        payload: {
          tenantId,
          orgId: id,
        },
      }).then(res => {
        if (res && res.parentOrganizationName) {
          dispatch({
            type: 'organization/updateState',
            payload: {
              isCreateFlag: true,
            },
          });
        }
        if (res && res.relatedLocations && url.indexOf('create') === -1) {
          this.fetchProvinceCity();
        }
      });
    }
  }

  /**
   * 数据保存
   */
  @Bind()
  handleSaveOrganization() {
    const {
      tenantId,
      dispatch,
      organization,
      match: {
        url,
        params: { id },
      },
    } = this.props;
    const { detail = {}, serviceZoneList = [], addressList = [] } = organization;
    const { defaultDetailItem } = this.state;
    this.form.validateFields((err, values) => {
      if (!err) {
        const newServiceZoneList = [];
        const newAddressList = [];
        serviceZoneList.forEach(item => {
          if (['create', 'update'].includes(item._status)) {
            newServiceZoneList.push(item);
          }
        });
        addressList.forEach(item => {
          if (['create', 'update'].includes(item._status)) {
            newAddressList.push(item);
          }
        });
        const serviceZoneData =
          (newServiceZoneList.length && getEditTableData(newServiceZoneList, ['orgToSitesId'])) ||
          [];
        const addressData =
          (newAddressList.length && this.getMyEditTableData(newAddressList)) || [];
        const { enabledFlag } = values;
        const params = isUndefined(id)
          ? {
              ...defaultDetailItem,
              ...values,
              tenantId,
              relatedLocations: addressData || [],
              relatedSites: serviceZoneData || [],
            } // 新增顶级
          : url.indexOf('create') !== -1
          ? {
              ...defaultDetailItem,
              ...values,
              tenantId,
              parentLocationId: Number(id),
              relatedLocations: addressData || [],
              relatedSites: serviceZoneData || [],
            } // 新增下级
          : {
              ...detail,
              ...values,
              tenantId,
              relatedLocations: addressData || [],
              relatedSites: serviceZoneData || [],
            }; // 编辑
        const dispatchType =
          url.indexOf('create') !== -1
            ? {
                type: 'organization/saveAddData',
                payload: { tenantId, data: params },
              }
            : {
                type: 'organization/saveEditData',
                payload: {
                  tenantId,
                  orgs: params,
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
                  pathname: `/amdm/organization/detail/${res.orgId}`,
                })
              );
            }
          } else {
            // 保存失败时，地址中新增的id会清除，需要重新刷进新的id
            const list = this.props.organization.addressList.map(item =>
              isUndefined(item.orgToLocationId) ? { ...item, orgToLocationId: uuidv4() } : item
            );
            dispatch({
              type: 'organization/updateState',
              payload: {
                addressList: list,
              },
            });
          }
        });
      }
    });
  }

  @Bind()
  getMyEditTableData(data = []) {
    const newList = data;
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        if (data[i]._status === 'create') {
          delete newList[i].orgToLocationId;
        }
        if (data[i]._status === 'update' && !isNumber(data[i].orgToLocationId)) {
          delete newList[i].orgToLocationId;
        }
      }
    }
    return newList;
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
   *
   * @param {string} id - 组织Id
   */
  @Bind()
  handleLinkToDetail(id) {
    this.props.dispatch(
      routerRedux.push({
        pathname: `/amdm/organization/detail/${id}`,
      })
    );
  }

  /**
   * 根据国家id获取省份城市
   * @param {string} countryId - 国家id 默认中国id
   */
  @Bind
  fetchProvinceCity(countryId = 150536) {
    if (countryId) {
      const { dispatch } = this.props;
      dispatch({
        type: `organization/queryProvinceCity`,
        payload: countryId,
      });
    }
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
      organization: { expandedRowKeys = [] },
    } = this.props;
    const rowKeys = isExpand
      ? [...expandedRowKeys, record.orgId]
      : expandedRowKeys.filter(item => item !== record.orgId);
    dispatch({
      type: 'organization/updateState',
      payload: {
        expandedRowKeys: [...rowKeys],
      },
    });
  }

  /**
   * 明细页-服务区域添加行数据
   */
  @Bind
  handleAddServiceZoneLine() {
    const {
      dispatch,
      organization: { serviceZoneList = [] },
    } = this.props;
    dispatch({
      type: 'organization/updateState',
      payload: {
        serviceZoneList: [
          {
            orgToSitesId: uuidv4(),
            enabledFlag: 1, // 启用标记
            maintSitesId: '', // 服务区域
            maintenanceServiceFlag: 1, // 维修维护业务
            otherServiceFlag: 0, // 其他业务
            _status: 'create',
          },
          ...serviceZoneList,
        ],
      },
    });
  }

  /**
   * 明细页-服务区域删除行数据
   */
  @Bind()
  handleCleanServiceZoneLine(record) {
    const {
      dispatch,
      organization: { serviceZoneList = [] },
    } = this.props;
    const newList = serviceZoneList.filter(item => item.orgToSitesId !== record.orgToSitesId);
    dispatch({
      type: 'organization/updateState',
      payload: {
        serviceZoneList: [...newList],
      },
    });
  }

  /**
   * 明细页-服务区域编辑行数据
   * @param {Object} record 行数据
   * @param {Boolean} flag  编辑/取消标记
   */
  @Bind()
  handleEditServiceZoneLine(record, flag) {
    const {
      dispatch,
      organization: { serviceZoneList = [] },
    } = this.props;
    const newList = serviceZoneList.map(item =>
      item.orgToSitesId === record.orgToSitesId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'organization/updateState',
      payload: {
        serviceZoneList: [...newList],
      },
    });
  }

  /**
   * 明细页-服务区域删除行数据
   */
  @Bind()
  handleCleanAddressLine(record) {
    const {
      dispatch,
      organization: { addressList = [] },
    } = this.props;
    const newList = addressList.filter(item => item.orgToLocationId !== record.orgToLocationId);
    dispatch({
      type: 'organization/updateState',
      payload: {
        addressList: [...newList],
      },
    });
  }

  render() {
    const { defaultDetailItem } = this.state;
    const {
      tenantId,
      loading,
      organization,
      dispatch,
      match: { url, params },
    } = this.props;
    const { id } = params;
    const {
      detail,
      isCreateFlag,
      expandedRowKeys,
      treeList = [],
      orgTypes = [],
      addressList = [],
      serviceZoneList = [],
      cityList = [],
    } = organization;
    const { fetchDetailInfoLoading, fullTextSearchLoading, saveDetailLoading } = loading;
    const fullTextSearchProps = {
      expandedRowKeys,
      loading: fullTextSearchLoading,
      dataSource: treeList,
      onSearch: this.handleFullSearch,
      onLinkToDetail: this.handleLinkToDetail,
      onExpand: this.handleExpandSubLine,
    };
    const isNew = url.indexOf('create') !== -1;
    const infoProps = {
      url,
      dispatch,
      orgTypes,
      tenantId,
      addressList,
      serviceZoneList,
      cityList,
      fetchDetailInfoLoading,
      isNew,
      isCreateFlag,
      detailInfo: isNew ? defaultDetailItem : detail,
      onRef: this.handleBindRef,
      onSearch: this.fetchDetailList,
      onRefresh: this.fetchDetailInfo,
      onCleanAddress: this.handleCleanAddressLine,
      onAddServiceZoneLine: this.handleAddServiceZoneLine,
      onCleanServiceZoneLine: this.handleCleanServiceZoneLine,
      onEditServiceZoneLine: this.handleEditServiceZoneLine,
      key: id,
    };
    return (
      <Fragment>
        <Header
          title={intl.get(`amdm.organization.view.title.detail`).d('组织详情')}
          backPath="/amdm/organization/list"
        >
          <Button
            type="primary"
            icon="save"
            loading={saveDetailLoading}
            onClick={this.handleSaveOrganization}
          >
            {intl.get(`hzero.common.button.save`).d('保存')}
          </Button>
        </Header>
        <Content>
          <Row className={classNames(styles['organization-detail'])}>
            <Col span={isNew ? 0 : 6}>
              <FullTextSearch {...fullTextSearchProps} />
            </Col>
            <Col span={isNew ? 24 : 17} offset={isNew ? 0 : 1}>
              <Spin
                spinning={isNew ? false : fetchDetailInfoLoading}
                wrapperClassName={classNames(
                  styles['organization-detail'],
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
