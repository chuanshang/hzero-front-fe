/**
 * Detail - 属性组明细页面
 * @date: 2019-01-15
 * @author: FQL <qilin.feng@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Fragment, Component } from 'react';
import { Button, Row, Col, Spin } from 'hzero-ui';
import { connect } from 'dva';
import { isUndefined } from 'lodash';
import classNames from 'classnames';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
import { DETAIL_DEFAULT_CLASSNAME } from 'utils/constants';
import notification from 'utils/notification';
import FullTextSearch from './FullTextSearch';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ loading, location }) => ({
  location,
  loading: {
    fetchDetailInfoLoading: loading.effects['location/fetchDetailInfo'],
    fullTextSearchLoading: loading.effects['location/queryLocationList'],
    saveDetailLoading:
      loading.effects['location/saveEditData'] || loading.effects['location/saveAddData'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({ code: ['amdm.location', 'amdm.common'] })
export default class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultDetailItem: {
        enabledFlag: 1,
        assetLocationFlag: 1,
        rackLocationFlag: 0,
        directMaintainFlag: 1,
        stockFlag: 0,
        negativeBalancesFlag: 0,
        movableLocationFlag: 0,
        pickingFlag: 0,
        inventoryModeFlag: 0,
        mapEnabledFlag: 0,
        costCenterCode: 'test', // todo 后续lov维护之后删除
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
          type: 'location/fetchParentLocation',
          payload: { tenantId, id },
        }).then(res => {
          this.setState({
            defaultDetailItem: {
              ...defaultDetailItem,
              parentLocationName: res,
              parentLocationId: Number(id),
            },
          });
        });
      }
    }
    dispatch({
      type: 'location/init',
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
      type: 'location/queryLocationList',
      payload: {
        tenantId,
        condition,
      },
    });
  }

  /**
   * fetchDetailInfo - 查询位置详细信息
   */
  @Bind()
  fetchDetailInfo() {
    const {
      dispatch,
      tenantId,
      match: {
        url,
        params: { id },
      },
    } = this.props;
    if (!isUndefined(id)) {
      dispatch({
        type: 'location/fetchDetailInfo',
        payload: { tenantId, id },
      }).then(res => {
        if (res && res.countryId && url.indexOf('create') === -1) {
          this.fetchProvinceCity(res.countryId);
        }
      });
    }
  }

  /**
   * 数据保存
   */
  @Bind()
  handleSaveLocation() {
    const {
      tenantId,
      match: {
        url,
        params: { id },
      },
    } = this.props;
    const {
      dispatch,
      location: { detail = {} },
    } = this.props;
    const { defaultDetailItem } = this.state;
    this.form.validateFields((err, values) => {
      if (!err) {
        const { enabledFlag, regionIds } = values;
        const regionId = regionIds && regionIds.length && regionIds[regionIds.length - 1];
        const params = isUndefined(id)
          ? { ...defaultDetailItem, ...values, tenantId } // 新增顶级
          : url.indexOf('create') !== -1
          ? { ...defaultDetailItem, ...values, parentLocationId: Number(id), tenantId, regionId } // 新增下级
          : { ...detail, ...values, tenantId, regionId }; // 编辑
        const dispatchType =
          url.indexOf('create') !== -1
            ? {
                type: 'location/saveAddData',
                payload: { tenantId, data: params },
              }
            : {
                type: 'location/saveEditData',
                payload: {
                  tenantId,
                  assetLocations: params,
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
                  pathname: `/amdm/location/detail/${res.assetLocationId}`,
                })
              );
            }
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
   *
   * @param {string} id - 资产组Id
   */
  @Bind()
  handleLinkToDetail(id) {
    this.props.dispatch(
      routerRedux.push({
        pathname: `/amdm/location/detail/${id}`,
      })
    );
  }

  /**
   * 根据国家id获取省份城市
   * @param {string} countryId - 国家id
   */
  @Bind
  fetchProvinceCity(countryId) {
    if (countryId) {
      const { dispatch } = this.props;
      dispatch({
        type: `location/queryProvinceCity`,
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
      location: { expandedRowKeys = [] },
    } = this.props;
    const rowKeys = isExpand
      ? [...expandedRowKeys, record.assetLocationId]
      : expandedRowKeys.filter(item => item !== record.assetLocationId);
    dispatch({
      type: 'location/updateState',
      payload: {
        expandedRowKeys: [...rowKeys],
      },
    });
  }

  render() {
    const { defaultDetailItem } = this.state;
    const {
      tenantId,
      match: {
        url,
        params: { id },
      },
    } = this.props;
    const {
      loading,
      location: { expandedRowKeys, treeList = [], detail, enumMap = {}, cityList = [] },
    } = this.props;
    const { fieldTypes, locationTypes } = enumMap;
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
      locationTypes,
      fieldTypes,
      tenantId,
      cityList,
      fetchDetailInfoLoading,
      isNew,
      detailInfo: isNew ? defaultDetailItem : detail,
      onRef: this.handleBindRef,
      onSearch: this.fetchDetailList,
      onFetchProvinceCity: this.fetchProvinceCity,
      onRefresh: this.fetchDetailInfo,
      key: id,
    };
    return (
      <Fragment>
        <Header
          title={intl.get(`amdm.location.view.title.detail`).d('位置详情')}
          backPath="/amdm/location/list"
        >
          <Button
            type="primary"
            icon="save"
            loading={saveDetailLoading}
            onClick={this.handleSaveLocation}
          >
            {intl.get(`hzero.common.button.save`).d('保存')}
          </Button>
        </Header>
        <Content>
          <Row className={classNames(styles['location-detail'])}>
            <Col span={isNew ? 0 : 6}>
              <FullTextSearch {...fullTextSearchProps} />
            </Col>
            <Col span={isNew ? 24 : 17} offset={isNew ? 0 : 1}>
              <Spin
                spinning={isNew ? false : fetchDetailInfoLoading}
                wrapperClassName={classNames(styles['location-detail'], DETAIL_DEFAULT_CLASSNAME)}
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
