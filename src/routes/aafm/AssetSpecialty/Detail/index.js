/**
 * 资产专业管理创建/编辑-明细
 * @date: 2019-2-25
 * @author: QZQ <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Button, Spin, Row, Col, Icon } from 'hzero-ui';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import uuidv4 from 'uuid/v4';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import classNames from 'classnames';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { DETAIL_DEFAULT_CLASSNAME } from 'utils/constants';
import {
  getCurrentOrganizationId,
  addItemToPagination,
  delItemToPagination,
  getEditTableData,
} from 'utils/utils';
import notification from 'utils/notification';
import FullTextSearch from './FullTextSearch';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ assetSpecialty, loading }) => ({
  assetSpecialty,
  loading: {
    detail: loading.effects['assetSpecialty/fetchAssetSpecialty'],
    fullTextSearch: loading.effects['assetSpecialty/searchFullText'],
    save:
      loading.effects['assetSpecialty/updateAssetSpecialty'] ||
      loading.effects['assetSpecialty/addAssetSpecialty'],
  },
  tenantId: getCurrentOrganizationId(),
}))
class Detail extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      editFlag: false,
      showSearchFlag: true,
      assetSpecialtyItem: {
        enabledFlag: 1,
        description: '',
        assetToOrgList: [],
      },
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { assetSpecialtyId: id } = match.params;
    if (!isUndefined(id)) {
      this.handleFullSearch('', {});
    }
  }

  /**
   * 查询
   */
  @Bind()
  handleSearch() {
    const { dispatch, tenantId, match } = this.props;
    const { assetSpecialtyId: id } = match.params;
    if (!isUndefined(id)) {
      dispatch({
        type: 'assetSpecialty/fetchAssetSpecialtyDetail',
        payload: {
          tenantId,
          assetSpecialtyId: id,
        },
      });
    }
  }

  /**
   * 明细添加行数据
   */
  @Bind()
  handleAddDetailLine() {
    const {
      tenantId,
      dispatch,
      assetSpecialty: { detailList = [], detailPagination = {} },
    } = this.props;
    dispatch({
      type: 'assetSpecialty/updateState',
      payload: {
        detailList: [
          {
            tenantId,
            assetOrgId: uuidv4(),
            enabledFlag: 1,
            priority: 1,
            _status: 'create',
          },
          ...detailList,
        ],
        detailPagination: addItemToPagination(detailList.length, detailPagination),
      },
    });
  }

  /**
   * 清除新增行数据
   * @param {Objec} record 待清除的数据对象
   */
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      assetSpecialty: { detailList = [], detailPagination = {} },
    } = this.props;
    const newList = detailList.filter(item => item.assetOrgId !== record.assetOrgId);
    dispatch({
      type: 'assetSpecialty/updateState',
      payload: {
        detailList: [...newList],
        detailPagination: delItemToPagination(detailList.length, detailPagination),
      },
    });
  }

  /**
   * 数据保存
   */
  @Bind()
  handleAssetSpecialtySave() {
    const { editFlag } = this.state;
    const {
      dispatch,
      tenantId,
      match,
      assetSpecialty: { detail, detailList },
    } = this.props;
    const {
      params: { assetSpecialtyId },
    } = match;
    const data = (detailList.length && getEditTableData(detailList, ['assetOrgId'])) || [];
    this.form.validateFields((err, values) => {
      const params = isUndefined(assetSpecialtyId)
        ? { ...values, assetToOrgList: data, tenantId }
        : { tenantId, ...detail, ...values, assetToOrgList: data };
      if (!err) {
        // 新增
        dispatch({
          type: 'assetSpecialty/addAssetSpecialty',
          payload: {
            tenantId,
            data: { ...params },
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.setState({ editFlag: !editFlag });
            this.handleSearch();
            dispatch(
              routerRedux.push({
                pathname: `/aafm/asset-specialty/detail/${res.assetSpecialtyId}`,
              })
            );
          }
        });
      }
    });
  }

  /**
   * 编辑
   * @param {Object} record 行数据
   * @param {Boolean} flag  编辑/取消标记
   */
  @Bind()
  handleEditLine(record, flag) {
    const {
      dispatch,
      assetSpecialty: { detailList = [] },
    } = this.props;
    const newList = detailList.map(item =>
      item.assetOrgId === record.assetOrgId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'assetSpecialty/updateState',
      payload: {
        detailList: [...newList],
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
   * 明细页-数据检索
   * @param {string} [detailCondition = ''] - 查询条件
   * @param {object} [page = {}] - 分页参数
   * @param {Number} page.current - 当前页码
   * @param {Number} page.pageSize - 分页大小
   */
  @Bind()
  handleFullSearch(detailCondition = '', page = {}) {
    const { dispatch, tenantId } = this.props;
    this.setState({});
    dispatch({
      type: 'assetSpecialty/searchFullText',
      payload: {
        tenantId,
        page,
        condition: detailCondition,
      },
    });
  }

  /**
   * 搜索区域隐藏显示
   */
  @Bind()
  setShowSearchFlag() {
    const { showSearchFlag } = this.state;
    const reShowSearchFlag = !showSearchFlag;
    this.setState({ showSearchFlag: reShowSearchFlag });
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
   * 资产专业管理明细查询
   * @param {string} id - 资产专业管理Id
   */
  @Bind()
  handleGotoDetail(id) {
    this.props.dispatch(
      routerRedux.push({
        pathname: `/aafm/asset-specialty/detail/${id}`,
      })
    );
  }

  render() {
    const { editFlag, showSearchFlag, assetSpecialtyItem } = this.state;
    const { loading, match, tenantId, assetSpecialty } = this.props;
    const { assetSpecialtyId: id } = match.params;
    const isNew = !isUndefined(id);
    const {
      detail,
      detailList,
      detailPagination,
      fullList,
      fullPagination,
      nameplateRule = [],
    } = assetSpecialty;
    const fullTextSearchProps = {
      fullPagination,
      dataSource: fullList,
      loading: loading.fullTextSearch,
      onSearch: this.handleFullSearch,
      onGotoDetail: this.handleGotoDetail,
    };
    const infoProps = {
      isNew,
      tenantId,
      editFlag,
      nameplateRule,
      detailList,
      detailPagination,
      key: id,
      dataSource: isUndefined(id) ? assetSpecialtyItem : detail,
      onCleanLine: this.handleCleanLine,
      onEditLine: this.handleEditLine,
      onAddDetailLine: this.handleAddDetailLine,
      onRef: this.handleBindRef,
      onRefresh: this.handleSearch,
    };
    const displayFlag = !isNew || editFlag ? { display: 'none' } : { display: 'block' };
    const displayFullFlag =
      !isNew || editFlag || !showSearchFlag ? { display: 'none' } : { display: 'block' };
    const displayFlagBtn = !isNew || editFlag ? { display: 'block' } : { display: 'none' };
    const displayCloseBtn = !isNew || !editFlag ? { display: 'none' } : { display: 'block' };
    return (
      <React.Fragment>
        <Header
          title={intl.get(`aafm.assetSpecialty.view.message.detail.title`).d('资产专业管理明细')}
          backPath="/aafm/asset-specialty/list"
        >
          <Button
            icon="save"
            type="primary"
            style={displayFlagBtn}
            loading={loading.save}
            onClick={this.handleAssetSpecialtySave}
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
          <div className={classNames(styles['asset-specialty-detail'])}>
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
                  spinning={isUndefined(id) ? false : loading.fullTextSearch}
                  wrapperClassName={classNames(
                    styles['attribute-set-detail'],
                    DETAIL_DEFAULT_CLASSNAME
                  )}
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
