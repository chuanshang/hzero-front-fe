/**
 * 资产组创建/编辑-明细
 * @date: 2019-1-14
 * @author: WH <heng.wei@hand-china.com>
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
import { getCurrentOrganizationId, getEditTableData, getDateTimeFormat } from 'utils/utils';
import notification from 'utils/notification';
import { DETAIL_DEFAULT_CLASSNAME } from 'utils/constants';
import formatterCollections from 'utils/intl/formatterCollections';
import moment from 'moment';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ bom, loading }) => ({
  bom,
  loading: {
    detail: loading.effects['bom/detailBom'] && loading.effects['bom/listBomTree'],
    save: loading.effects['bom/updateBom'] || loading.effects['bom/addBom'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: ['amtc.common', 'amtc.bom'],
})
class Detail extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      editFlag: false,
      defaultDetailItem: {
        enabledFlag: 1,
      },
    };
  }

  componentDidMount() {
    const { tenantId } = this.props;
    this.props.dispatch({ type: 'bom/fetchLovMap', payload: { tenantId } });
    this.handleSearch();
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
        type: 'bom/detailBom',
        payload: {
          tenantId,
          bomId: id,
        },
      });
      dispatch({
        type: 'bom/listBomTree',
        payload: {
          tenantId,
          bomId: id,
        },
      });
      dispatch({
        type: 'bom/listChildBom',
        payload: {
          tenantId,
          parentId: id,
          parentTypeCode: 'BOM',
        },
      });
    }
  }

  /**
   * 数据保存
   */
  @Bind()
  handleBomSave() {
    const { editFlag } = this.state;
    const {
      dispatch,
      tenantId,
      match,
      bom: { detail, treeList },
    } = this.props;
    const { id, parentId } = match.params;
    // 处理表单效验，获取处理后的表单数据
    const bomLines = getEditTableData(treeList, ['children', 'bomLineId']);
    const newLine = bomLines.map(item => {
      const { effectiveEndDate, effectiveStartDate } = item;
      return {
        ...item,
        effectiveStartDate: moment(effectiveStartDate).format(getDateTimeFormat()),
        effectiveEndDate: moment(effectiveEndDate).format(getDateTimeFormat()),
      };
    });
    this.form.validateFields((err, values) => {
      if (!err) {
        if (isUndefined(id)) {
          // 新增
          dispatch({
            type: 'bom/addBom',
            payload: {
              tenantId,
              data: { ...values, tenantId, bomLineList: newLine },
            },
          }).then(res => {
            if (res) {
              notification.success();
              if (!isUndefined(parentId)) {
                dispatch(
                  routerRedux.push({
                    pathname: `/amtc/bom/detail/${parentId}`,
                  })
                );
              } else {
                dispatch(
                  routerRedux.push({
                    pathname: `/amtc/bom/detail/${res.bomId}`,
                  })
                );
              }
            }
          });
        } else {
          // 编辑
          dispatch({
            type: 'bom/updateBom',
            payload: {
              tenantId,
              data: { ...detail, ...values, bomLineList: newLine },
            },
          }).then(res => {
            if (res) {
              notification.success();
              if (!isUndefined(parentId)) {
                dispatch(
                  routerRedux.push({
                    pathname: `/amtc/bom/detail/${parentId}`,
                  })
                );
              } else {
                this.setState({ editFlag: !editFlag });
                this.handleSearch();
              }
            }
          });
        }
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
   * 跳转详情页面
   * @param bomId
   */
  @Bind()
  handleBomDetail(bomId) {
    const { dispatch, tenantId } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/amtc/bom/detail/${bomId}`,
      })
    );
    dispatch({
      type: 'bom/detailBom',
      payload: {
        tenantId,
        bomId,
      },
    });
    dispatch({
      type: 'bom/listBomTree',
      payload: {
        tenantId,
        bomId,
      },
    });
    dispatch({
      type: 'bom/listChildBom',
      payload: {
        tenantId,
        parentId: bomId,
        parentTypeCode: 'BOM',
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

  render() {
    const { editFlag, defaultDetailItem } = this.state;
    const { loading, match, tenantId, bom, dispatch } = this.props;
    const { id, parentId, parentName } = match.params;
    const isNew = !isUndefined(id);
    const {
      detail,
      chileBomlist, // 子BOM结构清单
      treeList, // 结构清单行
      expandedRowKeys,
      ParentTypeMap = [],
    } = bom;
    const infoProps = {
      id,
      parentId,
      parentName,
      tenantId,
      isNew,
      editFlag,
      loading,
      bom,
      dispatch,
      pathMap: {},
      expandedRowKeys,
      ParentTypeMap, // 对象字段独立值集
      chileBomlist, // 子BOM结构清单
      treeList, // 结构清单行
      dataSource: isUndefined(id) ? defaultDetailItem : detail,
      onRef: this.handleBindRef,
      onRefresh: this.handleSearch,
      onEditLine: this.handleBomDetail,
    };
    const displayFlag = !isNew || editFlag ? { display: 'none' } : { display: 'block' };
    const displayFlagBtn = !isNew || editFlag ? { display: 'block' } : { display: 'none' };
    const displayCloseBtn = !isNew || !editFlag ? { display: 'none' } : { display: 'block' };
    return (
      <React.Fragment>
        <Header
          title={intl.get(`amtc.bom.view.message.detail.title`).d('BOM结构清单')}
          backPath="/amtc/bom/list"
        >
          <Button
            icon="save"
            type="primary"
            style={displayFlagBtn}
            loading={loading.save}
            onClick={this.handleBomSave}
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
          <div className={classNames(styles['bom-detail'])}>
            <Row>
              <Col span={24}>
                <Spin
                  spinning={isUndefined(id) ? false : loading.detail}
                  wrapperClassName={classNames(styles['bom-detail'], DETAIL_DEFAULT_CLASSNAME)}
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
