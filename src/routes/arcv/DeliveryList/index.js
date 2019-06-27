/**
 * DeliveryList - 交付清单行
 * @date: 2019-3-22
 * @author: ZZS <zhisheng.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { Component } from 'react';
import { Button } from 'hzero-ui';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty, omit } from 'lodash';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import ExcelExport from 'components/ExcelExport';
import { HALM_ATN } from '@/utils/config';
import notification from 'utils/notification';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
import AcceptanceHeaderModal from './AcceptanceHeaderModal';

@connect(({ deliveryList, loading }) => ({
  deliveryList,
  loading: {
    list: loading.effects['deliveryList/listDelivery'],
    addAcceptance: loading.effects['deliveryList/addAcceptance'],
  },
  tenantId: getCurrentOrganizationId(),
}))
class DeliveryList extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      acceptanceModalVisible: false,
      acceptanceNumRequired: false,
      currentAcceptanceType: {},
      selectedRowKeys: [],
      selectedRows: [],
    };
  }

  componentDidMount() {
    this.handleSearch();
  }

  /**
   * 数据行选中操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }

  /**
   * 根据输入参数的codeRule改变验收单编号和资产编号是必输还是自动生成
   */
  @Bind()
  handChangeAcceptanceType(record) {
    this.setState({
      currentAcceptanceType: record,
    });
    if (!isUndefined(record.codeRule) && !isEmpty(record.codeRule)) {
      this.setState({
        acceptanceNumRequired: false,
      });
    } else {
      this.setState({
        acceptanceNumRequired: true,
      });
    }
  }

  /**
   * 页面查询
   * @param {object} fields - 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch, tenantId } = this.props;
    let filterValues = {};
    if (!isUndefined(this.form)) {
      const formValue = this.form.getFieldsValue();
      filterValues = filterNullValueObject(formValue);
    }
    dispatch({
      type: 'deliveryList/listDelivery',
      payload: {
        tenantId,
        page: isEmpty(fields) ? {} : fields,
        ...filterValues,
      },
    });
  }

  /**
   * 验收
   */
  @Bind()
  handleToAcceptance() {
    this.setState({ acceptanceModalVisible: true });
  }

  /**
   * 生成验收单
   */
  @Bind()
  handleAcceptanceModalOk(header, lines) {
    const { currentAcceptanceType } = this.state;
    const { tenantId, dispatch } = this.props;
    const newLines = [...lines].map(item => {
      const lineValue = {
        ...item,
        deliveryListMeaning: item.deliveryListName,
        acceptanceLineName: item.assetsSetMeaning,
        deliveryQuantity:
          item.needDeliveryQuantity -
          (isUndefined(item.deliveredQuantity) || isEmpty(item.deliveredQuantity)
            ? 0
            : item.deliveredQuantity),
      };
      const deleteItem = ['_token', 'acceptanceLineId'];
      if (currentAcceptanceType.projectFlag !== 1) {
        deleteItem.push('projectId');
        deleteItem.push('wbsLineId');
      }
      if (currentAcceptanceType.budgetFlag !== 1) {
        deleteItem.push('budgetHeaderId');
        deleteItem.push('budgetLineId');
      }
      if (currentAcceptanceType.inContractFlag !== 1) {
        deleteItem.push('contractId');
        deleteItem.push('contractLineId');
      }
      return omit(lineValue, deleteItem);
    });
    const acceptanceObj = {
      ...header,
      acceptanceLineList: newLines,
    };
    dispatch({
      type: 'deliveryList/addAcceptance',
      payload: {
        tenantId,
        data: acceptanceObj,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.setState({
          acceptanceModalVisible: false,
          acceptanceNumRequired: false,
          currentAcceptanceType: {},
        });
      }
    });
  }

  /**
   * 关闭验收窗口
   */
  @Bind()
  handleCancelAcceptanceHeaderModal() {
    this.setState({
      acceptanceModalVisible: false,
      acceptanceNumRequired: false,
      currentAcceptanceType: {},
    });
  }

  /**
   * 页面跳转
   * @param {string} id - id
   */
  @Bind()
  handleGotoDetail(id) {
    const { dispatch } = this.props;
    const linkUrl = isUndefined(id) ? 'create' : `detail/${id}`;
    dispatch(
      routerRedux.push({
        pathname: `/arcv/delivery-list/${linkUrl}`,
      })
    );
  }

  /**
   * 传递表单参数
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  render() {
    const promptCode = 'arcv.deliveryList';
    const {
      selectedRowKeys = [],
      selectedRows = [],
      acceptanceModalVisible,
      acceptanceNumRequired,
    } = this.state;
    const {
      loading,
      tenantId,
      deliveryList: { pagination = {}, list = [] },
    } = this.props;
    const filterProps = {
      tenantId,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };
    const listProps = {
      pagination,
      selectedRowKeys,
      loading: loading.list,
      dataSource: list,
      onSearch: this.handleSearch,
      onEdit: this.handleGotoDetail,
      onSelectRow: this.handleSelectRow,
    };
    const acceptanceHeaderModalProps = {
      tenantId,
      loading: loading.addAcceptance,
      acceptanceModalVisible,
      acceptanceNumRequired,
      dataSource: selectedRows,
      onCancel: this.handleCancelAcceptanceHeaderModal,
      onAcceptanceModalOk: this.handleAcceptanceModalOk,
      onChangeAcceptanceType: this.handChangeAcceptanceType,
    };
    const exportParams = this.form ? this.form.getFieldsValue() : {};
    return (
      <React.Fragment>
        <Header title={intl.get(`${promptCode}.view.message.title`).d('交付清单行')}>
          <Button icon="plus" type="primary" onClick={() => this.handleGotoDetail()}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_ATN}/v1/${tenantId}/delivery-list/export`}
            queryParams={exportParams}
          />
          <Button onClick={() => this.handleToAcceptance()} disabled={isEmpty(selectedRowKeys)}>
            {intl.get('hzero.common.button.acceptance').d('验收')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
          <AcceptanceHeaderModal {...acceptanceHeaderModalProps} />
        </Content>
      </React.Fragment>
    );
  }
}
export default DeliveryList;
