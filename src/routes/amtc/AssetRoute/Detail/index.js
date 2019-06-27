/**
 * Detail - 资产路线
 * @date: 2019-01-15
 * @author: FQL <qilin.feng@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Fragment, Component } from 'react';
import { Button, Row, Col } from 'hzero-ui';
import { connect } from 'dva';
import { isEmpty, isUndefined } from 'lodash';
import classNames from 'classnames';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, getEditTableData } from 'utils/utils';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ loading, assetRoute }) => ({
  assetRoute,
  loading: {
    detailLoading: loading.effects['assetRoute/fetchAssetRouteDetail'],
    detailListLoading: loading.effects['assetRoute/fetchDetailListInfo'],
    saveDetailLoading:
      loading.effects['assetRoute/saveEditData'] || loading.effects['assetRoute/saveAddData'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({ code: ['amtc.assetRoute', 'amtc.common'] })
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultDetailItem: {
        enabledFlag: 1,
      },
    };
  }

  /**
   * 资产路线明细查询：头信息&行信息
   * @param {object} [page = {}] - 分页参数
   */
  @Bind()
  handleSearch() {
    const {
      dispatch,
      tenantId,
      match: { params = {} },
    } = this.props;
    if (!isUndefined(params.id)) {
      dispatch({
        type: 'assetRoute/fetchAssetRouteDetail',
        payload: {
          tenantId,
          assetRouteId: params.id,
        },
      });
      dispatch({
        type: 'assetRoute/fetchDetailListInfo',
        payload: {
          tenantId,
          assetRouteId: params.id,
        },
      });
    } else {
      dispatch({
        type: 'assetRoute/updateState',
        payload: {
          detailList: [],
        },
      });
      this.setState({
        defaultDetailItem: {
          enabledFlag: 1,
        },
      });
    }
  }

  /**
   * 数据保存
   */
  @Bind()
  handleSaveAssetRoute() {
    const {
      dispatch,
      tenantId,
      match: {
        url,
        params: { id },
      },
      assetRoute: { detail, detailList = [] },
    } = this.props;
    const { defaultDetailItem } = this.state;
    const { validateFields = e => e } = this.form;
    const fieldValues = isUndefined(this.form) ? {} : this.form.getFieldsValue();
    validateFields(err => {
      if (isEmpty(err)) {
        const newList = [];
        detailList.forEach(item => {
          if (['create', 'update'].includes(item._status)) {
            newList.push(item);
          }
        });
        const assetRouteLineList =
          (newList.length && getEditTableData(newList, ['routeAssignmentId'])) || [];
        dispatch({
          type: isUndefined(id) ? 'assetRoute/saveAddData' : 'assetRoute/saveEditData',
          payload: !isUndefined(id)
            ? {
                ...detail,
                ...fieldValues,
                tenantId,
                assetRouteLineList,
              }
            : {
                ...defaultDetailItem,
                ...fieldValues,
                tenantId,
                assetRouteLineList,
              },
        }).then(res => {
          if (res) {
            notification.success();
            if (!isUndefined(id) && url.indexOf('create') === -1) {
              this.handleSearch();
            } else {
              dispatch(
                routerRedux.push({
                  pathname: `/amtc/asset-route/detail/${res.assetRouteId}`,
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

  render() {
    const { defaultDetailItem } = this.state;
    const {
      loading,
      match,
      tenantId,
      dispatch,
      assetRoute: { detail = {}, detailList, detailListPagination = {}, referenceModeMap = [] },
    } = this.props;
    const { id } = match.params;
    const { saveDetailLoading } = loading;
    const infoProps = {
      tenantId,
      detailList,
      detailListPagination,
      dispatch,
      referenceModeMap,
      key: id,
      loading,
      dataSource: isUndefined(id) ? defaultDetailItem : detail,
      onRef: this.handleBindRef,
      onRefresh: this.handleSearch,
    };
    return (
      <Fragment>
        <Header
          title={intl.get(`amtc.assetRoute.view.message.title.detail`).d('资产路线')}
          backPath="/amtc/asset-route/list"
        >
          <Button
            type="primary"
            icon="save"
            loading={saveDetailLoading}
            onClick={this.handleSaveAssetRoute}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content>
          <Row className={classNames(styles['asset-route-detail'])}>
            <Col>
              <InfoExhibit {...infoProps} />
            </Col>
          </Row>
        </Content>
      </Fragment>
    );
  }
}
export default Detail;
