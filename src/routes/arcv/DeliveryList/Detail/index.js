/**
 * DeliveryList - 交付清单行
 * @date: 2019-3-22
 * @author: ZZS <zhisheng.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Button, Spin, Row, Col } from 'hzero-ui';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import classNames from 'classnames';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { getCurrentOrganizationId, getDateFormat } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import moment from 'moment';

import styles from './index.less';
import FullTextSearch from './FullTextSearch';
import InfoExhibit from './InfoExhibit';

@connect(({ deliveryList, loading }) => ({
  deliveryList,
  loading: {
    detail: loading.effects['deliveryList/detailDelivery'],
    save:
      loading.effects['deliveryList/addDeliveryList'] ||
      loading.effects['deliveryList/updateDeliveryList'],
    fullTextSearch: loading.effects['deliveryList/fullTextSearch'],
    selectWbsPlan: loading.effects['deliveryList/selectWbsPlan'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: ['arcv.common', 'arcv.deliveryList'],
})
class Detail extends Component {
  form;
  constructor(props) {
    super(props);
    this.state = {
      defaultItem: {
        currentWbsHeaderId: null,
        contractId: 0, // 该字段在后端为必输，但模块还没建所以给个初始值
      },
    };
  }
  componentDidMount() {
    const { id } = this.props.match.params;
    if (!isUndefined(id)) {
      // 详细界面，查询数据
      this.handleFullSearch('', { size: 10, page: 0 });
    }
  }
  /**
   * 明细页-数据检索
   * @param {string} [condition = ''] - 查询条件
   * @param {object} [page = {}] - 分页参数
   * @param {Number} page.current - 当前页码
   * @param {Number} page.pageSize - 分页大小
   */
  @Bind()
  handleFullSearch(condition = '', page = {}) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'deliveryList/fullTextSearch',
      payload: {
        tenantId,
        page,
        condition,
      },
    });
  }
  /**
   * 新增/更新数据
   */
  @Bind()
  handleDeliveryList() {
    const {
      dispatch,
      tenantId,
      match,
      deliveryList: { detail = {} },
    } = this.props;
    const { id } = match.params;
    this.form.validateFields((err, values) => {
      if (!err) {
        if (isUndefined(id)) {
          // 新增
          dispatch({
            type: 'deliveryList/addDeliveryList',
            payload: {
              tenantId,
              data: {
                ...values,
                tenantId,
                deliveryCompleteDate: moment(values.deliveryCompleteDate).format(getDateFormat()),
              },
            },
          }).then(res => {
            if (res) {
              notification.success();
              dispatch(
                routerRedux.push({
                  pathname: `/arcv/delivery-list/detail/${res.deliveryListId}`,
                })
              );
            }
          });
        } else {
          // 更新
          dispatch({
            type: 'deliveryList/updateDeliveryList',
            payload: {
              tenantId,
              data: {
                ...detail,
                ...values,
                tenantId,
                deliveryCompleteDate: moment(values.deliveryCompleteDate).format(getDateFormat()),
              },
            },
          }).then(res => {
            if (res) {
              notification.success();
              this.handleSearch();
            }
          });
        }
      }
    });
  }
  /**
   * 重新查询详情界面数据
   */
  @Bind()
  handleSearch() {
    const { tenantId, match, dispatch } = this.props;
    const { id } = match.params;
    if (!isUndefined(id)) {
      dispatch({
        type: 'deliveryList/detailDelivery',
        payload: {
          tenantId,
          deliveryListId: id,
        },
      }).then(res => {
        if (res) {
          this.getWbsHeader(res.projectId);
        }
      });
    }
  }
  /**
   * 页面跳转
   * @param {string} id - id
   */
  @Bind()
  handleGotoDetail(id) {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/arcv/delivery-list/detail/${id}`,
      })
    );
  }
  /**
   * 通过项目id获取wbs计划
   */
  @Bind()
  getWbsHeader(projectId) {
    const { tenantId, dispatch } = this.props;
    dispatch({
      type: 'deliveryList/selectWbsPlan',
      payload: {
        tenantId,
        projectId,
      },
    }).then(res => {
      if (res) {
        this.setState({ currentWbsHeaderId: res.wbsHeaderId });
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
    const { currentWbsHeaderId } = this.state;
    const { defaultItem } = this.state;
    const { loading, match, tenantId, deliveryList } = this.props;
    const { detail = [], fullList = [], fullPagination = {} } = deliveryList;
    const { id } = match.params;
    const fullTextSearchProps = {
      loading: loading.fullTextSearch,
      pagination: fullPagination,
      dataSource: fullList,
      onSearch: this.handleFullSearch,
      onGotoDetail: this.handleGotoDetail,
    };
    const infoProps = {
      key: id,
      tenantId,
      currentWbsHeaderId,
      detailDataSource: isUndefined(id) ? defaultItem : detail,
      onRef: this.handleBindRef,
      onRefresh: this.handleSearch,
      getWbsHeader: this.getWbsHeader,
    };
    return (
      <React.Fragment>
        <Header
          title={intl.get(`arcv.deliveryList.view.message.detail.title`).d('交付清单行明细')}
          backPath="/arcv/delivery-list/list"
        >
          <Button
            icon="save"
            type="primary"
            loading={loading.save}
            onClick={this.handleDeliveryList}
          >
            {intl.get(`hzero.common.button.save`).d('保存')}
          </Button>
        </Header>
        <Content>
          <div className={classNames(styles['delivery-list-detail'])}>
            <Row>
              <Col span={isUndefined(id) ? 0 : 6}>
                <FullTextSearch {...fullTextSearchProps} />
              </Col>
              <Col span={isUndefined(id) ? 24 : 17} offset={isUndefined(id) ? 0 : 1}>
                <Spin
                  spinning={loading.selectWbsPlan || (isUndefined(id) ? false : loading.detail)}
                >
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
