/**
 * Detail - 验收单类型明细页面
 * @date: 2019-04-19
 * @author: QZQ <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Fragment, Component } from 'react';
import { Button, Row, Col, Spin } from 'hzero-ui';
import { connect } from 'dva';
import { isUndefined } from 'lodash';
import classNames from 'classnames';
import { routerRedux } from 'dva/router';
// import uuidv4 from 'uuid/v4';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
import FullTextSearch from './FullTextSearch';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ loading, acceptanceType }) => ({
  acceptanceType,
  loading: {
    detailLoading: loading.effects['acceptanceType/fetchAcceptanceTypeDetail'],
    fullTextSearchLoading: loading.effects['acceptanceType/searchFullText'],
    saveDetailLoading: loading.effects['acceptanceType/saveAcceptanceType'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({ code: ['arcv.acceptanceType', 'arcv.common'] })
export default class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultDetailItem: {
        approveFlowFlag: 1,
        transferInterfaceFlag: 0,
        directlyCompleteFlag: 0,
        inContractFlag: 1,
        createFaFlag: 0,
        enabledFlag: 1,
      },
    };
  }

  /**
   * componentDidMount 生命周期函数
   * render后请求页面数据
   */
  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    // this.handleSearchDetail();
    dispatch({ type: 'acceptanceType/fetchLov', payload: { tenantId } });
  }

  @Bind()
  handleSearchDetail() {
    const {
      dispatch,
      tenantId,
      match: { params = {} },
    } = this.props;
    if (!isUndefined(params.id)) {
      dispatch({
        type: 'acceptanceType/fetchAcceptanceTypeDetail',
        payload: {
          tenantId,
          acceptanceTypeId: params.id,
          page: {},
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
      type: 'acceptanceType/searchFullText',
      payload: {
        tenantId,
        page,
        condition,
      },
    });
  }
  /**
   * 数据保存
   */
  @Bind()
  handleSaveAcceptanceType() {
    const {
      dispatch,
      tenantId,
      match,
      acceptanceType: { detail },
    } = this.props;
    const {
      params: { id },
    } = match;
    this.form.validateFields((err, values) => {
      const params = isUndefined(id) ? { ...values, tenantId } : { tenantId, ...detail, ...values };
      if (!err) {
        // 新增
        dispatch({
          type: 'acceptanceType/saveAcceptanceType',
          payload: {
            tenantId,
            data: params,
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.handleSearchDetail();
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
   * @param {string} id - 验收单类型Id
   */
  @Bind()
  handleLinkToDetail(id) {
    this.props.dispatch(
      routerRedux.push({
        pathname: `/arcv/acceptance-type/detail/${id}`,
      })
    );
  }

  render() {
    const { defaultDetailItem } = this.state;
    const {
      loading,
      match,
      tenantId,
      acceptanceType: {
        detail = {},
        fullList = [],
        fullPagination = {},
        acceptanceType = [],
        transferFixed = [],
      },
    } = this.props;
    const { id } = match.params;
    const { detailLoading, fullTextSearchLoading, saveDetailLoading } = loading;
    const fullTextSearchProps = {
      dataSource: fullList,
      pagination: fullPagination,
      loading: fullTextSearchLoading,
      onSearch: this.handleFullSearch,
      onLinkToDetail: this.handleLinkToDetail,
    };
    const infoProps = {
      tenantId,
      transferFixed,
      acceptanceType,
      key: id,
      loading: detailLoading,
      dataSource: isUndefined(id) ? defaultDetailItem : detail,
      isNew: !isUndefined(id),
      onRef: this.handleBindRef,
      onRefresh: this.handleSearchDetail,
    };
    return (
      <Fragment>
        <Header
          title={intl.get(`arcv.acceptanceType.view.message.title.detail`).d('验收单类型')}
          backPath="/arcv/acceptance-type/list"
        >
          <Button
            type="primary"
            icon="save"
            loading={saveDetailLoading}
            onClick={this.handleSaveAcceptanceType}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content>
          <Row className={classNames(styles['acceptance-type-detail'])}>
            <Col span={isUndefined(id) ? 0 : 6}>
              <FullTextSearch {...fullTextSearchProps} />
            </Col>
            <Col span={isUndefined(id) ? 24 : 17} offset={isUndefined(id) ? 0 : 1}>
              <Spin spinning={isUndefined(id) ? false : detailLoading}>
                <InfoExhibit {...infoProps} />
              </Spin>
            </Col>
          </Row>
        </Content>
      </Fragment>
    );
  }
}
