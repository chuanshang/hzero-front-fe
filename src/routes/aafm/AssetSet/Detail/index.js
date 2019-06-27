/**
 * 资产组创建/编辑-明细
 * @date: 2019-1-14
 * @author: WH <heng.wei@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Button, Spin, Row, Col, Icon } from 'hzero-ui';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import classNames from 'classnames';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';
import { DETAIL_DEFAULT_CLASSNAME } from 'utils/constants';
import formatterCollections from 'utils/intl/formatterCollections';
import FullTextSearch from './FullTextSearch';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ assetSet, loading }) => ({
  assetSet,
  loading: {
    detail: loading.effects['assetSet/fetchAssetSetDetail'],
    fullTextSearch: loading.effects['assetSet/searchFullText'],
    save: loading.effects['assetSet/updateAssetSet'] || loading.effects['assetSet/addAssetSet'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: ['aafm.common', 'aafm.assetSet'],
})
class Detail extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      editFlag: false,
      showSearchFlag: true,
      assetSetItem: {},
    };
  }

  componentDidMount() {
    const { match, tenantId } = this.props;
    const { id } = match.params;
    if (!isUndefined(id)) {
      this.handleFullSearch('', {});
    }
    this.props.dispatch({ type: 'assetSet/fetchLov', payload: { tenantId } });
  }

  /**
   * 查询
   */
  @Bind()
  handleSearch() {
    const { dispatch, tenantId, match } = this.props;
    const { id } = match.params;
    if (!isUndefined(id)) {
      dispatch({
        type: 'assetSet/fetchAssetSetDetail',
        payload: {
          tenantId,
          assetSetId: id,
        },
      });
    } else {
      this.setState({
        assetSetItem: {
          onlyMaintSitesFlag: 1, // 限用于可分配服务区域
          tradeInFlag: 1, // 可在合同中交易
          maintainFlag: 1, // 可维修
          enabledFlag: 1, // 启用标记
          specialAssetCode: 'UN_SPECIFICNESS',
          nameplateRuleCode: 'ASSET_NUM',
        },
      });
    }
  }

  /**
   * 数据保存
   */
  @Bind()
  handleAssetSetSave() {
    const { editFlag } = this.state;
    const {
      dispatch,
      tenantId,
      match,
      assetSet: { detail },
    } = this.props;
    const { id } = match.params;
    this.form.validateFields((err, values) => {
      if (!err) {
        if (isUndefined(id)) {
          // 新增
          dispatch({
            type: 'assetSet/addAssetSet',
            payload: {
              tenantId,
              data: { ...values, tenantId },
            },
          }).then(res => {
            if (res) {
              notification.success();
              dispatch(
                routerRedux.push({
                  pathname: `/aafm/assetSet/detail/${res.assetsSetId}`,
                })
              );
            }
          });
        } else {
          // 编辑
          dispatch({
            type: 'assetSet/updateAssetSet',
            payload: {
              tenantId,
              data: { ...detail, ...values },
            },
          }).then(res => {
            if (res) {
              this.setState({ editFlag: !editFlag });
              notification.success();
              this.handleSearch();
            }
          });
        }
      }
    });
  }

  /**
   * 搜索区域隐藏显示
   */
  @Bind()
  setShowSearchFlag() {
    const { showSearchFlag } = this.state;
    this.setState({ showSearchFlag: !showSearchFlag });
  }

  /**
   * 编辑
   */
  @Bind()
  handleEdit() {
    const { editFlag } = this.state;
    this.setState({ editFlag: !editFlag });
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
   * 明细页-数据检索
   * @param {string} [condition = ''] - 查询条件
   * @param {object} [page = {}] - 分页参数
   * @param {Number} page.current - 当前页码
   * @param {Number} page.pageSize - 分页大小
   */
  @Bind()
  handleFullSearch(condition = '', page = {}) {
    const { dispatch, tenantId } = this.props;
    this.setState({});
    dispatch({
      type: 'assetSet/searchFullText',
      payload: {
        tenantId,
        page,
        detailCondition: condition,
      },
    });
  }

  /**
   * 资产组明细查询
   * @param {string} id - 资产组Id
   */
  @Bind()
  handleGotoDetail(id) {
    this.props.dispatch(
      routerRedux.push({
        pathname: `/aafm/assetSet/detail/${id}`,
      })
    );
  }

  render() {
    const { editFlag, showSearchFlag, assetSetItem } = this.state;
    const { loading, match, tenantId, assetSet } = this.props;
    const { id } = match.params;
    const isNew = !isUndefined(id);
    const {
      detail,
      fullList,
      fullPagination,
      specialAsset = [],
      nameplateRule = [],
      assetCriticality = [],
    } = assetSet;
    const fullTextSearchProps = {
      loading: loading.fullTextSearch,
      pagination: fullPagination,
      dataSource: fullList,
      onSearch: this.handleFullSearch,
      onGotoDetail: this.handleGotoDetail,
    };
    const infoProps = {
      tenantId,
      editFlag,
      specialAsset,
      nameplateRule,
      assetCriticality,
      dataSource: isUndefined(id) ? assetSetItem : detail,
      isNew,
      onRef: this.handleBindRef,
      onRefresh: this.handleSearch,
      key: id,
    };
    const displayFlag = !isNew || editFlag ? { display: 'none' } : { display: 'block' };
    const displayFullFlag =
      !isNew || editFlag || !showSearchFlag ? { display: 'none' } : { display: 'block' };
    const displayFlagBtn = !isNew || editFlag ? { display: 'block' } : { display: 'none' };
    const displayCloseBtn = !isNew || !editFlag ? { display: 'none' } : { display: 'block' };
    return (
      <React.Fragment>
        <Header
          title={intl.get(`aafm.assetSet.view.message.detail.title`).d('资产组明细')}
          backPath="/aafm/assetSet/list"
        >
          <Button
            icon="save"
            type="primary"
            style={displayFlagBtn}
            loading={loading.save}
            onClick={this.handleAssetSetSave}
          >
            {intl.get(`hzero.common.button.save`).d('保存')}
          </Button>
          <Button icon="edit" type="primary" style={displayFlag} onClick={this.handleEdit}>
            {intl.get('hzero.common.button.edit').d('编辑')}
          </Button>
          <Button icon="close" style={displayCloseBtn} onClick={this.handleEdit}>
            {intl.get('hzero.common.button.close').d('取消编辑')}
          </Button>
        </Header>
        <Content>
          <div className={classNames(styles['asset-set-detail'])}>
            <Row>
              <Col style={displayFullFlag} span={isUndefined(id) ? 0 : 6}>
                <FullTextSearch {...fullTextSearchProps} />
              </Col>
              <Col style={displayFlag} span={isUndefined(id) ? 0 : 1}>
                <Icon
                  type={showSearchFlag ? 'menu-fold' : 'menu-unfold'}
                  onClick={this.setShowSearchFlag}
                  style={{ fontSize: 18, padding: 10, border: 0, cursor: 'pointer' }}
                >
                  {intl.get(`hero.common.click.menu`).d('')}
                </Icon>
              </Col>
              <Col span={isUndefined(id) ? 24 : editFlag ? 23 : showSearchFlag ? 17 : 23}>
                <Spin
                  spinning={isUndefined(id) ? false : loading.detail}
                  wrapperClassName={classNames(styles['location-detail'], DETAIL_DEFAULT_CLASSNAME)}
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
