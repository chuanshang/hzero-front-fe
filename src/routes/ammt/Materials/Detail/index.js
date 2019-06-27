/**
 * workOrder - 工单-详细页面
 * @date: 2019-4-10
 * @author: HQ <qing.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { PureComponent } from 'react';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { Button, Row, Col, Spin } from 'hzero-ui';
import { getCurrentOrganizationId, getEditTableData } from 'utils/utils';
import { isUndefined } from 'lodash';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { routerRedux } from 'dva/router';
import classNames from 'classnames';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

// dva连接
@connect(({ materials, loading }) => ({
  materials,
  tenantId: getCurrentOrganizationId(),
  saveOrUpdateLoading: loading.effects['materials/createOrUpdateMaterials'],
  fetchMaterialByIdLoading: loading.effects['materials/fetchMaterialById'],
  fetchinnertableloading: loading.effects['materials/selectMaterialRow'],
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
    const { tenantId, match, dispatch } = this.props;
    this.props.dispatch({
      type: 'materials/init',
      payload: {
        tenantId,
      },
    });
    const { id } = match.params;
    if (!isUndefined(id)) {
      dispatch({
        type: 'materials/fetchMaterialById',
        payload: {
          itemId: id,
        },
      }).then(res => {
        if (res) {
          this.setState({
            defaultDetailItem: res,
          });
          this.fetchInnerRowList({ itemId: res.itemId });
        }
      });
    }
  }

  @Bind
  fetchInnerRowList(param) {
    const {
      materials: { innerpagination = {} },
    } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'materials/selectMaterialRow',
      payload: {
        page: innerpagination,
        ...param,
      },
    });
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
    // 处理表单效验，获取处理后的表单数据
    const {
      materials: { innerList = [] },
      dispatch,
      match,
    } = this.props;
    const { defaultDetailItem } = this.state;
    const params = getEditTableData(innerList, ['itemMaintsitesId']);
    this.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const queryparams = {
          ...defaultDetailItem,
          ...fieldsValue,
          itemMaintSitesList: [...params],
        };
        dispatch({
          type: 'materials/createOrUpdateMaterials',
          payload: queryparams,
        }).then(res => {
          if (res) {
            notification.success();
            const { id } = match.params;
            if (isUndefined(id)) {
              dispatch(routerRedux.push({ pathname: `/ammt/materials/detail/${res.itemId}` }));
            } else {
              dispatch({
                type: 'materials/fetchMaterialById',
                payload: {
                  itemId: id,
                },
              }).then(res1 => {
                if (res1) {
                  this.setState({
                    defaultDetailItem: res1,
                  });
                  dispatch({
                    type: 'materials/selectMaterialRow',
                    payload: {
                      itemId: res1.itemId,
                    },
                  });
                }
              });
            }
          }
        });
      }
    });
  }

  render() {
    const {
      match,
      materials: {
        productTypeMap = [],
        uomConversionMap = [],
        trackingUsedMap = [],
        pricingUsedMap = [],
        auxiliaryqtymethodMap = [],
      },
      saveOrUpdateLoading,
      fetchMaterialByIdLoading,
      fetchinnertableloading,
    } = this.props;
    const { id } = match.params;
    const { defaultDetailItem } = this.state;
    const detailFormProps = {
      onRef: this.handleBindRef,
      materials: this.props.materials,
      tenantId: this.props.tenantId,
      dispatch: this.props.dispatch,
      loading: fetchinnertableloading,
      onChange: this.fetchInnerRowList,
      productTypeMap,
      uomConversionMap,
      trackingUsedMap,
      pricingUsedMap,
      auxiliaryqtymethodMap,
      defaultDetailItem,
      detailId: id,
    };
    return (
      <React.Fragment>
        <Header title={isUndefined(id) ? '新增' : '编辑'} backPath="/ammt/materials/list">
          <Button loading={saveOrUpdateLoading} icon="save" type="primary" onClick={this.save}>
            {intl.get(`hero.common.button.save`).d('保存')}
          </Button>
        </Header>
        <Content>
          <div className={classNames(styles['materials-detail'])}>
            <Row>
              <Col span={24}>
                <Spin spinning={isUndefined(id) ? false : fetchMaterialByIdLoading}>
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
