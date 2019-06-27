/**
 * FixedAssets - 固定资产-详细页面
 * @date: 2019-4-10
 * @author: HQ <qing.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { PureComponent } from 'react';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { Button, Row, Col, Spin, Icon } from 'hzero-ui';
import { getCurrentOrganizationId, getEditTableData, getDateTimeFormat } from 'utils/utils';
import moment from 'moment';
import { isEmpty, isUndefined } from 'lodash';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { DETAIL_DEFAULT_CLASSNAME } from 'utils/constants';
import classNames from 'classnames';
import { routerRedux } from 'dva/router';
import FullTextSearch from './FullTextSearch';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ fixedAssets, loading }) => ({
  fixedAssets,
  tenantId: getCurrentOrganizationId(),
  loading: {
    queryDetailHeaderLoading: loading.effects['fixedAssets/fetchDetailInfo'],
    saveDetailLoading: loading.effects['fixedAssets/saveData'],
    fullTextSearchLoading: loading.effects['fixedAssets/searchFullText'],
    listChangeLines: loading.effects['fixedAssets/searchChangeLines'],
  },
}))
class Detail extends PureComponent {
  form;

  constructor(props) {
    super(props);
    this.state = {
      editFlag: false,
      showSearchFlag: true,
      defaultDetailItem: {},
    };
  }

  componentDidMount() {
    const {
      dispatch,
      tenantId,
      match: { params },
    } = this.props;
    const { id } = params;
    dispatch({
      type: 'fixedAssets/init',
      payload: {
        tenantId,
      },
    });
    if (!isUndefined(id)) {
      this.handleFullSearch('', {});
    }
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
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 保存明细
   */
  @Bind()
  save() {
    const {
      dispatch,
      tenantId,
      match: {
        url,
        params: { fixedAssetId },
      },
      fixedAssets: { detail, changeLines = [] },
    } = this.props;
    const { editFlag } = this.state;
    const { validateFields = e => e } = this.form;
    const fieldValues = isUndefined(this.form) ? {} : this.form.getFieldsValue();
    validateFields(err => {
      if (isEmpty(err)) {
        const newChangeLines = [];
        changeLines.forEach(item => {
          if (['create', 'update'].includes(item._status)) {
            newChangeLines.push(item);
          }
        });
        const changeLinesData =
          (newChangeLines.length && getEditTableData(newChangeLines, ['changeId'])) || [];
        dispatch({
          type: 'fixedAssets/saveData',
          payload: {
            ...detail,
            ...fieldValues,
            tenantId,
            transferDate: moment(fieldValues.transferDate).format(getDateTimeFormat()),
            depreciationStartDate: moment(fieldValues.depreciationStartDate).format(
              getDateTimeFormat()
            ),
            fixedAssetsChangesList: changeLinesData,
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.setState({ editFlag: !editFlag });
            if (!isUndefined(fixedAssetId) && url.indexOf('create') === -1) {
              this.handleFullSearch('', {});
            } else {
              dispatch(
                routerRedux.push({
                  pathname: `/afam/fixed-assets/detail/${res.fixedAssetId}`,
                })
              );
            }
            // this.handleSearch();
          }
        });
      }
    });
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
   * 明细页全文检索
   * @param {*}
   */
  @Bind()
  handleFullSearch(condition = '', page = {}) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'fixedAssets/searchFullText',
      payload: {
        tenantId,
        page,
        detailSelectItem: condition,
      },
    });
    this.handleSearch();
  }

  /**
   * 查询
   */
  @Bind()
  handleSearch() {
    const { dispatch, tenantId, match } = this.props;
    const { fixedAssetId } = match.params;
    const { defaultDetailItem } = this.state;
    if (!isUndefined(fixedAssetId)) {
      dispatch({
        type: 'fixedAssets/fetchDetailInfo',
        payload: {
          tenantId,
          fixedAssetId,
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
    } else {
      dispatch({
        type: 'fixedAssets/updateState',
        payload: {
          detail: {},
          changeLines: [],
          changeLinesPagination: [],
        },
      });
    }
  }

  /**
   * 价值变动查询
   * @param {object} fields - 查询参数
   */
  @Bind()
  handleSearchChanges(fields = {}) {
    const {
      dispatch,
      tenantId,
      match: {
        params: { fixedAssetId },
      },
    } = this.props;
    dispatch({
      type: 'fixedAssets/searchChangeLines',
      payload: {
        tenantId,
        fixedAssetId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   * @param {string} id - id
   */
  @Bind()
  handleGotoDetail(id) {
    this.props.dispatch(
      routerRedux.push({
        pathname: `/afam/fixed-assets/detail/${id}`,
      })
    );
  }

  render() {
    const { editFlag, showSearchFlag } = this.state;
    const { dispatch, loading, match, tenantId, fixedAssets } = this.props;
    const { queryDetailHeaderLoading, saveDetailLoading, fullTextSearchLoading } = loading;
    const {
      fullList,
      fullPagination,
      detail,
      changeLinesPagination,
      depreciationTypeCodeMap = [],
      changeTypeCodeMap = [],
      changeLines = [],
      modalVisible,
    } = fixedAssets;
    const { fixedAssetId } = match.params;
    const isNew = !isUndefined(fixedAssetId);
    const detailFormProps = {
      showSearchFlag,
      fixedAssetId,
      dispatch,
      tenantId,
      editFlag,
      modalVisible,
      changeLines,
      changeLinesPagination,
      changeTypeCodeMap,
      depreciationTypeCodeMap,
      dataSource: detail,
      isNew: !isUndefined(fixedAssetId),
      key: fixedAssetId,
      loading,
      onRef: this.handleBindRef,
      onRefresh: this.handleSearch,
      onSearchChanges: this.handleSearchChanges,
    };
    const fullTextSearchProps = {
      isNew: isUndefined(fixedAssetId),
      loading: fullTextSearchLoading,
      pagination: fullPagination,
      dataSource: fullList,
      onSearch: this.handleFullSearch,
      onGotoDetail: this.handleGotoDetail,
    };
    const displayFlag = !isNew || editFlag ? { display: 'none' } : { display: 'block' };
    const displayFullFlag =
      !isNew || editFlag || !showSearchFlag ? { display: 'none' } : { display: 'block' };
    const displayFlagBtn = !isNew || editFlag ? { display: 'block' } : { display: 'none' };
    const displayCloseBtn = !isNew || !editFlag ? { display: 'none' } : { display: 'block' };
    return (
      <React.Fragment>
        <Header
          title={intl.get('afam.fixedAssets.view.message.detail').d('固定资产')}
          backPath="/afam/fixed-assets/list"
        >
          <Button
            loading={saveDetailLoading}
            icon="save"
            style={displayFlagBtn}
            type="primary"
            onClick={this.save}
          >
            {intl.get(`hero.common.button.save`).d('保存')}
          </Button>
          <Button icon="edit" type="primary" style={displayFlag} onClick={this.handleEdit}>
            {intl.get('hzero.common.button.edit').d('编辑')}
          </Button>
          <Button icon="close" style={displayCloseBtn} onClick={this.handleEdit}>
            {intl.get('hzero.common.button.close').d('取消编辑')}
          </Button>
        </Header>
        <Content style={{ height: window.screen.availHeight / 2 + 50 }}>
          <div className={classNames(styles['fixed-assets-tail'])}>
            <Row>
              <Col style={displayFullFlag} span={isUndefined(fixedAssetId) ? 0 : 6}>
                <FullTextSearch {...fullTextSearchProps} />
              </Col>
              <Col style={displayFlag} span={isUndefined(fixedAssetId) ? 0 : 1}>
                <Icon
                  type={showSearchFlag ? 'menu-fold' : 'menu-unfold'}
                  onClick={this.setShowSearchFlag}
                  style={{ fontSize: 18, padding: 10, border: 0, cursor: 'pointer' }}
                >
                  {intl.get(`hero.common.click.menu`).d('')}
                </Icon>
              </Col>
              <Col span={isUndefined(fixedAssetId) ? 24 : editFlag ? 23 : showSearchFlag ? 17 : 23}>
                <Spin
                  spinning={isUndefined(fixedAssetId) ? false : queryDetailHeaderLoading}
                  wrapperClassName={classNames(styles['location-detail'], DETAIL_DEFAULT_CLASSNAME)}
                >
                  <InfoExhibit {...detailFormProps} />
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
