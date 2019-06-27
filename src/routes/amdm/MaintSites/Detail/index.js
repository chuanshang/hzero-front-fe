/**
 * MaintSites - 服务区域-详细页面
 * @date: 2019-1-7
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { PureComponent } from 'react';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { Button, Row, Col, Spin } from 'hzero-ui';
import { getCurrentOrganizationId } from 'utils/utils';
import { isEmpty, isUndefined } from 'lodash';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { DETAIL_DEFAULT_CLASSNAME } from 'utils/constants';
import classname from 'classnames';
import { routerRedux } from 'dva/router';
import FullTextSearch from './FullTextSearch';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ maintSites, loading }) => ({
  maintSites,
  queryDetailHeaderLoading: loading.effects['maintSites/queryDetail'],
  saveDetailLoading: loading.effects['maintSites/saveDetail'],
  fullTextSearchLoading: loading.effects['maintSites/searchFullText'],
  tenantId: getCurrentOrganizationId(),
}))
class Detail extends PureComponent {
  form;

  constructor(props) {
    super(props);
    this.state = {
      defaultDetailItem: {},
    };
  }

  componentDidMount() {
    this.handleFullSearch('', {});
  }

  /**
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 保存服务区域明细
   */
  @Bind()
  save() {
    const {
      dispatch,
      maintSites: { detail },
    } = this.props;
    const { validateFields = e => e } = this.form;
    const fieldValues = isUndefined(this.form) ? {} : this.form.getFieldsValue();
    validateFields(err => {
      if (isEmpty(err)) {
        dispatch({
          type: 'maintSites/saveDetail',
          data: {
            ...detail,
            ...fieldValues,
            maintSitesCode: isEmpty(fieldValues.maintSitesCode) ? null : fieldValues.maintSitesCode,
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.handleSearch();
          }
        });
      }
    });
  }

  /**
   * 明细页全文检索
   * @param {*}
   */
  @Bind()
  handleFullSearch(condition = '', page = {}) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'maintSites/searchFullText',
      payload: {
        tenantId,
        page,
        content: condition,
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
   * @param {string} id - 服务区域id
   */
  @Bind()
  handleGotoDetail(id) {
    this.props.dispatch(
      routerRedux.push({
        pathname: `/amdm/maint-sites/detail/${id}`,
      })
    );
  }

  render() {
    const {
      queryDetailHeaderLoading,
      saveDetailLoading,
      fullTextSearchLoading,
      match,
      tenantId,
      maintSites,
    } = this.props;
    const { fullList, fullPagination, detail } = maintSites;
    const { maintSitesId } = match.params;
    const detailFormProps = {
      tenantId,
      onRef: this.handleBindRef,
      onRefresh: this.handleSearch,
      dataSource: detail,
      isNew: !isUndefined(maintSitesId),
      key: maintSitesId,
    };
    const fullTextSearchProps = {
      loading: fullTextSearchLoading,
      pagination: fullPagination,
      dataSource: fullList,
      onSearch: this.handleFullSearch,
      onGotoDetail: this.handleGotoDetail,
    };
    return (
      <React.Fragment>
        <Header
          title={intl.get('amdm.maintSites.view.message.detail').d('服务区域明细')}
          backPath="/amdm/maint-sites"
        >
          <Button loading={saveDetailLoading} icon="save" type="primary" onClick={this.save}>
            {intl.get(`hero.common.button.save`).d('保存')}
          </Button>
        </Header>
        <Content>
          <div className={classname(styles['maint-sites-tail'])}>
            <Row>
              <Col span={isUndefined(maintSitesId) ? 0 : 6}>
                <FullTextSearch {...fullTextSearchProps} />
              </Col>
              <Col
                span={isUndefined(maintSitesId) ? 24 : 17}
                offset={isUndefined(maintSitesId) ? 0 : 1}
              >
                <Spin
                  spinning={isUndefined(maintSitesId) ? false : queryDetailHeaderLoading}
                  wrapperClassName={classname(styles['maint-sites-tail'], DETAIL_DEFAULT_CLASSNAME)}
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
