/**
 * Acceptance - 验收单
 * @date: 2019-3-22
 * @author: ZZS <zhisheng.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Button, Spin, Row, Col, Icon } from 'hzero-ui';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty, omit } from 'lodash';
import classNames from 'classnames';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { DETAIL_DEFAULT_CLASSNAME } from 'utils/constants';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import uuidv4 from 'uuid/v4';

import styles from './index.less';
import FullTextSearch from './FullTextSearch';
import InfoExhibit from './InfoExhibit';

@connect(({ acceptance, loading }) => ({
  acceptance,
  loading: {
    detail: loading.effects['acceptance/detailAcceptance'],
    save:
      loading.effects['acceptance/addAcceptance'] || loading.effects['acceptance/updateAcceptance'],
    list: loading.effects['acceptance/listAcceptance'],
    fullTextSearch: loading.effects['acceptance/fullTextSearch'],
    selectWbsPlan: loading.effects['acceptance/selectWbsPlan'],
    addAcceptanceLine: loading.effects['acceptance/addAcceptanceLine'],
    updateAcceptanceLine: loading.effects['acceptance/updateAcceptanceLine'],
    searchDeliveryList: loading.effects['acceptance/searchDeliveryList'],
    deleteAcceptanceLine: loading.effects['acceptance/deleteAcceptanceLine'],
    submitAcceptance: loading.effects['acceptance/submitAcceptance'],
    completeAcceptance: loading.effects['acceptance/completeAcceptance'],
    updateAcceptanceAsset: loading.effects['acceptance/updateAcceptanceAsset'],
    completeAsset: loading.effects['acceptance/updateAcceptanceAsset'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: ['arcv.common', 'arcv.acceptance'],
})
class Detail extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      editFlag: false,
      showSearchFlag: true,
      acceptanceLineVisible: false,
      acceptanceAssetListVisible: false,
      acceptanceNumRequired: false,
      assetNumRequired: false,
      selectedDeliveryRowKeys: [],
      selectedRows: [],
      isMulti: false,
      deliveryModalVisible: false,
      defaultItem: {},
      acceptanceModalVisible: false, // 验收单选择模态窗
      selectedAcceptanceRowKeys: [],
      AcceptanceLineDrawerData: {},
      AcceptanceAssetDrawerData: {},
      AcceptanceLinePanelVisible: false,
      AcceptanceRelationPanelVisible: false,
      AcceptanceAssetPanelVisible: false,
      AcceptanceLinePanelReadOnly: false,
      AcceptanceRelationPanelReadOnly: false,
      AcceptanceAssetPanelReadOnly: false,
      acceptanceTypeCode: '', // 验收单类型code
      currentWbsHeaderId: '',
      lineProjectVisible: false,
      lineProjectBudgetVisible: false,
      lineContractVisible: false,
    };
  }

  componentDidMount() {
    const { tenantId, match, dispatch } = this.props;
    const { id } = match.params;
    if (!isUndefined(id)) {
      // 详细界面，查询数据
      this.handleFullSearch('', { size: 10, page: 0 });
    }
    dispatch({ type: 'acceptance/fetchAcceptanceStatusLov', payload: { tenantId } });
    dispatch({ type: 'acceptance/fetchTranserFixedLovMap', payload: { tenantId } });
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
      type: 'acceptance/fullTextSearch',
      payload: {
        tenantId,
        page,
        condition,
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
   * 通过项目id获取wbs计划
   */
  @Bind()
  getWbsHeader(projectId) {
    const { tenantId, dispatch } = this.props;
    dispatch({
      type: 'acceptance/selectWbsPlan',
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
   * 新增/更新数据
   */
  @Bind()
  handleAcceptanceList() {
    const { acceptanceTypeCode } = this.state;
    const {
      dispatch,
      tenantId,
      match,
      acceptance: { acceptanceLineList = [], acceptanceRelationList = [], detail = [] },
    } = this.props;
    const { id } = match.params;

    const acceptanceLines = acceptanceLineList.map(item => {
      const lineValue = {
        ...item,
      };
      return lineValue._status === 'create'
        ? omit(lineValue, ['_status', 'acceptanceLineId'])
        : omit(lineValue, ['_status']);
    });

    this.form.validateFields((err, values) => {
      if (!err) {
        if (isUndefined(id)) {
          // 新增,分两种情况，当验收类型为”生成事务性单据”时，选择关联验收单，此时不保存验收单行，否则，不保存关联验收单行
          let addLinesObj = {};
          if (acceptanceTypeCode !== 'TRANSACTIONAL_ORDER') {
            addLinesObj = { acceptanceLineList: acceptanceLines };
          } else {
            const relationArr = [];
            acceptanceRelationList.forEach(item => {
              relationArr.push({
                relateAcceptanceId: item.acceptanceHeaderId,
                tenantId: item.tenantId,
              });
            });
            addLinesObj = { acceptanceRelationList: relationArr };
          }
          dispatch({
            type: 'acceptance/addAcceptance',
            payload: {
              tenantId,
              data: {
                ...values,
                tenantId,
                ...addLinesObj,
              },
            },
          }).then(res => {
            if (res) {
              notification.success();
              dispatch(
                routerRedux.push({
                  pathname: `/arcv/acceptance/detail/${res.acceptanceHeaderId}`,
                })
              );
            }
          });
        } else {
          const newHeader = omit(detail, [
            'acceptanceLineList',
            'acceptanceAssetList',
            'acceptanceRelationList',
          ]);
          dispatch({
            type: 'acceptance/updateAcceptance',
            payload: {
              tenantId,
              data: {
                ...newHeader,
                tenantId,
              },
            },
          }).then(res => {
            if (res) {
              notification.success();
              this.setState({ editFlag: false });
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
        type: 'acceptance/detailAcceptance',
        payload: {
          tenantId,
          acceptanceHeaderIds: id,
        },
      }).then(res => {
        this.handChangeAcceptanceType(res);
        this.handControlAcceptanceLineItemsByType(res.acceptanceHeaderId);
        this.handControlPanelByAcceptanceType(res.acceptanceTypeCode);
        const acceptanceHeaderIdStr = res.acceptanceRelationList
          .map(item => {
            return item.relateAcceptanceId;
          })
          .join(',');
        this.handleSearchAndListDetailByAcceptanceIdStr(acceptanceHeaderIdStr, 'detail');
      });
    }
  }

  /**
   * 打开资产明细行编辑(点击编辑时)
   */
  @Bind()
  handAcceptanceAssetEdit(record) {
    const { acceptanceAssetList } = this.props.acceptance;
    const AcceptanceAssetDrawerData = acceptanceAssetList.filter(
      item => item.acceptanceAssetId === record.acceptanceAssetId
    )[0];
    this.setState({
      acceptanceAssetListVisible: true,
      AcceptanceAssetDrawerData,
    });
  }

  /**
   * 关闭资产明细行
   */
  @Bind()
  handCancelAcceptanceAssetDrawer() {
    this.setState({
      acceptanceAssetListVisible: false,
      AcceptanceAssetDrawerData: {},
    });
  }

  /**
   * 资产明细行行编辑保存
   */
  @Bind()
  handAcceptanceAssetDrawerOK(newLine) {
    const {
      tenantId,
      dispatch,
      acceptance: { acceptanceAssetList },
    } = this.props;
    dispatch({
      type: 'acceptance/updateAcceptanceAsset',
      payload: {
        tenantId,
        data: newLine,
      },
    }).then(res => {
      if (res) {
        notification.success();
        const newLineList = [
          ...acceptanceAssetList.filter(
            item => item.acceptanceAssetId !== newLine.acceptanceAssetId
          ),
          {
            ...acceptanceAssetList.filter(
              item => item.acceptanceAssetId === newLine.acceptanceAssetId
            )[0],
            ...newLine,
            completeFlag: res.completeFlag,
            completeFlagMeaning: res.completeFlagMeaning,
          },
        ];
        dispatch({
          type: 'acceptance/updateState',
          payload: {
            acceptanceAssetList: newLineList,
          },
        });
        this.handCancelAcceptanceAssetDrawer();
      }
    });
  }

  /**
   * 关闭验收单行弹窗
   */
  @Bind()
  handCancelAcceptanceLineDrawer() {
    this.setState({
      acceptanceLineVisible: false,
      currentWbsHeaderId: '',
      AcceptanceLineDrawerData: {},
    });
  }

  /**
   * 打开验收单行弹窗(点击编辑时)
   */
  @Bind()
  handAcceptanceLineListEdit(record) {
    const { acceptanceLineList } = this.props.acceptance;
    const AcceptanceLineDrawerData = acceptanceLineList.filter(
      item => item.acceptanceLineId === record.acceptanceLineId
    )[0];
    this.getWbsHeader(AcceptanceLineDrawerData.projectId);
    this.setState({
      acceptanceLineVisible: true,
      AcceptanceLineDrawerData,
    });
  }

  /**
   * 新增验收单行
   */
  @Bind()
  handAddLine() {
    this.setState({
      acceptanceLineVisible: true,
      AcceptanceLineDrawerData: {},
    });
  }

  /**
   * 验收单行编辑确定
   */
  @Bind()
  handAcceptanceLineDrawerOK(newLine) {
    const { tenantId, dispatch, match } = this.props;
    const { id } = match.params;
    if (!isUndefined(id)) {
      const createLineList = [];
      const updateLineList = [];
      newLine.forEach(element => {
        if (isUndefined(element._token)) {
          createLineList.push({ ...element, tenantId, acceptanceHeaderId: id });
        } else {
          updateLineList.push({ ...element, tenantId, acceptanceHeaderId: id });
        }
      });
      if (createLineList.length > 0) {
        dispatch({
          type: 'acceptance/addAcceptanceLine',
          payload: {
            tenantId,
            data: createLineList,
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.handMergeAcceptanceLine(res);
            this.setState({ acceptanceLineVisible: false });
          }
        });
      }
      if (updateLineList.length > 0) {
        dispatch({
          type: 'acceptance/updateAcceptanceLine',
          payload: {
            tenantId,
            data: updateLineList,
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.handMergeAcceptanceLine(res);
            this.setState({ acceptanceLineVisible: false });
          }
        });
      }
    } else {
      // 直接更新数组
      this.handMergeAcceptanceLine(newLine);
      // 关闭验收单行弹窗
      this.setState({
        acceptanceLineVisible: false,
        currentWbsHeaderId: '',
      });
    }
  }

  /**
   * 将给定一条行记录合并到行列表中
   */
  @Bind()
  handMergeAcceptanceLine(newLine) {
    const {
      dispatch,
      acceptance: { acceptanceLineList = [] },
    } = this.props;
    let newLineList = acceptanceLineList;
    newLine.forEach(item => {
      if (isUndefined(item.acceptanceLineId)) {
        newLineList = [
          ...newLineList,
          {
            ...item,
            acceptanceLineId: uuidv4(),
            _status: 'create',
          },
        ];
      } else {
        newLineList = [
          ...newLineList.filter(element => element.acceptanceLineId !== item.acceptanceLineId),
          {
            ...newLineList.filter(element => element.acceptanceLineId === item.acceptanceLineId)[0],
            ...item,
          },
        ];
      }
    });
    dispatch({
      type: 'acceptance/updateState',
      payload: {
        acceptanceLineList: newLineList,
      },
    });
  }

  /**
   * 查询交付清单
   */
  @Bind()
  handleSearchDeliveryList(fields = {}) {
    const { dispatch, tenantId } = this.props;
    const { deliveryListName } = fields;
    dispatch({
      type: 'acceptance/searchDeliveryList',
      payload: {
        tenantId,
        deliveryListName,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   * 打开交付清单选择模态框
   */
  @Bind()
  handSelectdeliveryList(flag) {
    this.handleSearchDeliveryList();
    this.setState({ deliveryModalVisible: true, isMulti: flag });
  }

  /**
   * 关闭交付清单选择模态框
   */
  @Bind()
  handleDeliveryModalCancel() {
    this.setState({
      deliveryModalVisible: false,
      selectedDeliveryRowKeys: [],
    });
  }

  /**
   * 交付清单选择模态框确定操作
   */
  @Bind()
  handDeliveryListModalOk() {
    const {
      selectedRows,
      lineProjectVisible,
      lineProjectBudgetVisible,
      lineContractVisible,
    } = this.state;
    const newLines = [...selectedRows].map(item => {
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
      if (!lineProjectVisible) {
        deleteItem.push('projectId');
        deleteItem.push('wbsLineId');
      }
      if (!lineProjectBudgetVisible) {
        deleteItem.push('budgetHeaderId');
        deleteItem.push('budgetLineId');
      }
      if (!lineContractVisible) {
        deleteItem.push('contractId');
        deleteItem.push('contractLineId');
      }
      return omit(lineValue, deleteItem);
    });
    this.handAcceptanceLineDrawerOK(newLines);
    this.handleDeliveryModalCancel();
  }

  /**
   * 交付清单数据行选中操作
   */
  @Bind()
  handleSelectDeliveryRow(selectedDeliveryRowKeys, selectedRows) {
    this.setState({ selectedDeliveryRowKeys, selectedRows });
  }

  /**
   * 打开验收单查询模态框
   */
  @Bind()
  handAcceptanceList(flag) {
    this.handleSearchAcceptanceList();
    this.setState({ acceptanceModalVisible: true, isMulti: flag });
  }

  /**
   * 查询验收单
   */
  @Bind()
  handleSearchAcceptanceList(fields = {}) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'acceptance/listAcceptance',
      payload: {
        tenantId,
        page: isEmpty(fields) ? {} : fields,
        ...fields,
      },
    });
  }

  /**
   * 验收单选择模态框关闭
   */
  @Bind()
  handAcceptanceModalCancel() {
    this.setState({
      acceptanceModalVisible: false,
      selectedAcceptanceRowKeys: [],
    });
  }

  /**
   * 验收单选中操作
   */
  @Bind()
  handSelectAcceptanceRow(selectedAcceptanceRowKeys, selectedRows) {
    this.setState({ selectedAcceptanceRowKeys, selectedRows });
  }

  /**
   * 关联验收单删除操作
   */
  @Bind()
  handleDeleteAcceptanceRelation(record) {
    const {
      tenantId,
      dispatch,
      match,
      acceptance: { relationList },
    } = this.props;
    const { id } = match.params;
    if (isUndefined(id)) {
      // 新建的时候，从数组中直接删除
      this.handDeleteRelationLinesFromList(record);
    } else {
      // 先从接口删除，成功后再从数组删除
      const deleteRelation =
        relationList.filter(item => record.acceptanceHeaderId === item.relateAcceptanceId)[0] || {};
      dispatch({
        type: 'acceptance/deleteAcceptanceRelation',
        payload: {
          tenantId,
          data: { ...deleteRelation },
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.handDeleteRelationLinesFromList(record);
        }
      });
    }
  }

  /**
   * 通过验收单关联行信息从数组中删除相关行
   */
  @Bind()
  handDeleteRelationLinesFromList(record) {
    const {
      dispatch,
      acceptance: { acceptanceLineList, acceptanceRelationList, acceptanceAssetList, relationList },
    } = this.props;

    const newRelationList =
      relationList.filter(item => record.acceptanceHeaderId !== item.relateAcceptanceId) || [];

    const newAcceptanceRelationList =
      acceptanceRelationList.filter(
        item => item.acceptanceHeaderId !== record.acceptanceHeaderId
      ) || [];
    const deleteAcceptanceRelation =
      acceptanceRelationList.filter(
        item => item.acceptanceHeaderId === record.acceptanceHeaderId
      )[0] || {};

    const newAcceptanceLineList =
      acceptanceLineList.filter(
        item => item.acceptanceHeaderId !== deleteAcceptanceRelation.acceptanceHeaderId
      ) || [];
    const deleteAcceptanceLineList =
      acceptanceLineList.filter(
        item => item.acceptanceHeaderId === deleteAcceptanceRelation.acceptanceHeaderId
      ) || [];

    let newAcceptanceAssetList = acceptanceAssetList;
    deleteAcceptanceLineList.forEach(item => {
      newAcceptanceAssetList = newAcceptanceAssetList.filter(
        element => element.acceptanceLineId !== item.acceptanceLineId
      );
    });
    dispatch({
      type: 'acceptance/updateState',
      payload: {
        acceptanceRelationList: newAcceptanceRelationList,
        acceptanceLineList: newAcceptanceLineList,
        acceptanceAssetList: newAcceptanceAssetList,
        relationList: newRelationList,
      },
    });
  }

  /**
   * 验收单确定操作
   */
  @Bind()
  handAcceptanceListModalOk() {
    const { selectedRows } = this.state;
    const acceptanceHeaderIdStr = selectedRows
      .map(item => {
        return item.acceptanceHeaderId;
      })
      .join(',');
    this.handleSearchAndListDetailByAcceptanceIdStr(acceptanceHeaderIdStr, 'select');
    this.handAcceptanceModalCancel();
  }

  /**
   * 通过给定验收单的id 字符串，查找对应验收单详细信息及行明细
   */
  @Bind()
  handleSearchAndListDetailByAcceptanceIdStr(acceptanceHeaderIdStr, flag) {
    const {
      dispatch,
      tenantId,
      match,
      acceptance: { acceptanceRelationList, acceptanceLineList, acceptanceAssetList, relationList },
    } = this.props;
    const { id } = match.params;
    if (acceptanceHeaderIdStr.length > 0) {
      dispatch({
        type: 'acceptance/detailAcceptanceRelation',
        payload: {
          tenantId,
          acceptanceHeaderIds: acceptanceHeaderIdStr,
        },
      }).then(res => {
        if (res && res.length > 0) {
          const relationInsertValues = [];
          let acceptanceRelationListArr = [...acceptanceRelationList];
          let acceptanceLineListArr = [...acceptanceLineList];
          let acceptanceAssetListArr = [...acceptanceAssetList];
          res.forEach(element => {
            relationInsertValues.push({
              acceptanceHeaderId: id,
              relateAcceptanceId: element.acceptanceHeaderId,
              tenantId: element.tenantId,
            });
            acceptanceRelationListArr = [
              ...acceptanceRelationListArr,
              {
                ...omit(element, [
                  'acceptanceLineList',
                  'acceptanceAssetList',
                  'acceptanceRelationList',
                ]),
                acceptanceRelationId: uuidv4(),
                _status: 'create',
              },
            ];
            acceptanceLineListArr = [...acceptanceLineListArr, ...element.acceptanceLineList];
            acceptanceAssetListArr = [...acceptanceAssetListArr, ...element.acceptanceAssetList];
          });
          if (!isUndefined(id)) {
            // 在编辑界面
            if (flag === 'select') {
              // 如果是选择验收单添加，选择后直接将验收单关联保存进数据库 relationInsertValues
              dispatch({
                type: 'acceptance/addAcceptanceRelation',
                payload: {
                  tenantId,
                  data: relationInsertValues,
                },
              }).then(saveRes => {
                if (saveRes) {
                  notification.success();
                  dispatch({
                    type: 'acceptance/updateState',
                    payload: {
                      acceptanceRelationList: acceptanceRelationListArr,
                      acceptanceLineList: acceptanceLineListArr,
                      acceptanceAssetList: acceptanceAssetListArr,
                      relationList: [...relationList, ...saveRes],
                    },
                  });
                }
              });
            } else {
              // 如果是在编辑界面加载出来的
              dispatch({
                type: 'acceptance/updateState',
                payload: {
                  acceptanceRelationList: acceptanceRelationListArr,
                  acceptanceLineList: acceptanceLineListArr,
                  acceptanceAssetList: acceptanceAssetListArr,
                },
              });
            }
          } else {
            // 新建界面
            dispatch({
              type: 'acceptance/updateState',
              payload: {
                acceptanceRelationList: acceptanceRelationListArr,
                acceptanceLineList: acceptanceLineListArr,
                acceptanceAssetList: acceptanceAssetListArr,
              },
            });
          }
        }
      });
    }
  }

  /**
   * 根据 验收类型 的具体信息来控制验收单行字段
   */
  @Bind()
  handControlAcceptanceLineItemsByType(acceptanceTypeId) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'acceptance/detailAcceptanceType',
      payload: {
        tenantId,
        acceptanceTypeId,
      },
    }).then(res => {
      if (res) {
        if (res.projectFlag === 1) {
          this.setState({ lineProjectVisible: true });
        } else {
          this.setState({ lineProjectVisible: false });
        }
        if (res.budgetFlag === 1) {
          this.setState({ lineProjectBudgetVisible: true });
        } else {
          this.setState({ lineProjectBudgetVisible: false });
        }
        if (res.inContractFlag === 1) {
          this.setState({ lineContractVisible: true });
        } else {
          this.setState({ lineContractVisible: false });
        }
      }
    });
  }

  /**
   * 根据 验收基础类型 和 验收单状态 来控制子面板
   */
  @Bind()
  handControlPanelByAcceptanceType(code) {
    this.setState({ acceptanceTypeCode: code });
    const {
      acceptance: {
        detail: { acceptanceStatusCode },
      },
    } = this.props;
    if (code === 'TRANSACTIONAL_ORDER') {
      // 生成事物单据
      this.setState({
        AcceptanceLinePanelVisible: true,
        AcceptanceRelationPanelVisible: true,
        AcceptanceAssetPanelVisible: true,
        AcceptanceLinePanelReadOnly: true,
        AcceptanceAssetPanelReadOnly: true,
      });
      switch (acceptanceStatusCode) {
        case 'APPROVING':
        case 'APPROVED':
        case 'SUPPLEMENT':
        case 'COMPLETED':
          this.setState({
            AcceptanceRelationPanelReadOnly: true,
          });
          break;
        default:
          this.setState({
            AcceptanceRelationPanelReadOnly: false,
          });
          break;
      }
    } else {
      this.setState({
        AcceptanceLinePanelVisible: true,
        AcceptanceRelationPanelVisible: false,
        AcceptanceAssetPanelVisible: true,
      });
      switch (acceptanceStatusCode) {
        case 'APPROVING':
          this.setState({
            AcceptanceLinePanelReadOnly: true,
            AcceptanceRelationPanelReadOnly: true,
            AcceptanceAssetPanelReadOnly: true,
          });
          break;
        case 'APPROVED':
          this.setState({
            AcceptanceLinePanelReadOnly: true,
            AcceptanceRelationPanelReadOnly: true,
            AcceptanceAssetPanelReadOnly: true,
          });
          break;
        case 'SUPPLEMENT':
          this.setState({
            AcceptanceLinePanelReadOnly: true,
            AcceptanceRelationPanelReadOnly: true,
            AcceptanceAssetPanelReadOnly: false,
          });
          break;
        case 'COMPLETED':
          this.setState({
            AcceptanceLinePanelReadOnly: true,
            AcceptanceRelationPanelReadOnly: true,
            AcceptanceAssetPanelReadOnly: true,
          });
          break;
        default:
          this.setState({
            AcceptanceLinePanelReadOnly: false,
            AcceptanceRelationPanelReadOnly: false,
            AcceptanceAssetPanelReadOnly: false,
          });
          break;
      }
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
        pathname: `/arcv/acceptance/detail/${id}`,
      })
    );
  }

  /**
   * 删除验收单行
   */
  @Bind()
  handDeleteAcceptanceLine(record) {
    const { tenantId, dispatch, match, acceptance } = this.props;
    const { acceptanceLineList } = acceptance;
    const { id } = match.params;
    const deleteLine = acceptanceLineList.filter(
      item => item.acceptanceLineId === record.acceptanceLineId
    )[0];
    if (!isUndefined(id) && !isEmpty(deleteLine._token)) {
      // 调用接口删除数据
      dispatch({
        type: 'acceptance/deleteAcceptanceLine',
        payload: {
          tenantId,
          data: deleteLine,
        },
      });
    }
    const newLines = acceptanceLineList.filter(
      item => item.acceptanceLineId !== record.acceptanceLineId
    );
    dispatch({
      type: 'acceptance/updateState',
      payload: {
        acceptanceLineList: newLines,
      },
    });
  }

  /**
   * 提交审批&&完成验收&&完成资产
   */
  @Bind()
  handSubmitAcceptance(code) {
    const {
      tenantId,
      dispatch,
      acceptance: {
        detail: { acceptanceHeaderId },
      },
    } = this.props;
    switch (code) {
      case 'submit':
        dispatch({
          type: 'acceptance/submitAcceptance',
          payload: {
            tenantId,
            acceptanceHeaderId,
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.handleSearch();
          }
        });
        break;
      case 'completeAcceptance':
        dispatch({
          type: 'acceptance/completeAcceptance',
          payload: {
            tenantId,
            acceptanceHeaderId,
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.handleSearch();
          }
        });
        break;
      case 'completeAsset':
        dispatch({
          type: 'acceptance/completeAsset',
          payload: {
            tenantId,
            acceptanceHeaderId,
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.handleSearch();
          }
        });
        break;
      default:
        break;
    }
  }

  /**
   * 根据输入参数的codeRule改变验收单编号和资产编号是必输还是自动生成
   */
  @Bind()
  handChangeAcceptanceType(record) {
    if (!isUndefined(record.codeRule) && !isEmpty(record.codeRule)) {
      this.setState({
        acceptanceNumRequired: false,
        assetNumRequired: false,
      });
    } else {
      this.setState({
        acceptanceNumRequired: true,
        assetNumRequired: true,
      });
    }
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

  render() {
    const {
      editFlag,
      showSearchFlag,
      isMulti,
      deliveryModalVisible,
      acceptanceModalVisible,
      acceptanceAssetListVisible,
      acceptanceLineVisible,
      AcceptanceLinePanelVisible,
      AcceptanceRelationPanelVisible,
      AcceptanceAssetPanelVisible,
      AcceptanceLinePanelReadOnly,
      AcceptanceRelationPanelReadOnly,
      AcceptanceAssetPanelReadOnly,
      selectedDeliveryRowKeys,
      selectedAcceptanceRowKeys,
      defaultItem,
      acceptanceNumRequired,
      assetNumRequired,
      AcceptanceLineDrawerData,
      AcceptanceAssetDrawerData,
      acceptanceTypeCode,
      currentWbsHeaderId,
      lineProjectVisible,
      lineProjectBudgetVisible,
      lineContractVisible,
    } = this.state;
    const { loading, match, tenantId, acceptance } = this.props;
    const {
      list = [],
      pagination = {},
      detail = [],
      fullList = [],
      fullPagination = {},
      AcceptanceStatusLovMap = [],
      TranserFixedLovMap = [],
      acceptanceLineList = [],
      acceptanceAssetList = [],
      acceptanceRelationList = [],
      deliveryList = [],
      deliveryPagination = [],
    } = acceptance;
    const { id } = match.params;
    const isNew = isUndefined(id);
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
      loading,
      isMulti,
      editFlag,
      showSearchFlag,
      currentWbsHeaderId,
      deliveryModalVisible,
      acceptanceModalVisible,
      acceptanceAssetListVisible,
      selectedDeliveryRowKeys,
      selectedAcceptanceRowKeys,
      isNew,
      acceptanceLineList,
      acceptanceAssetList,
      acceptanceRelationList,
      AcceptanceLineDrawerData,
      AcceptanceAssetDrawerData,
      deliveryList,
      deliveryPagination,
      acceptanceLineVisible,
      AcceptanceLinePanelVisible,
      AcceptanceRelationPanelVisible,
      AcceptanceAssetPanelVisible,
      AcceptanceLinePanelReadOnly,
      AcceptanceRelationPanelReadOnly,
      AcceptanceAssetPanelReadOnly,
      acceptanceNumRequired,
      assetNumRequired,
      detailDataSource: isUndefined(id) ? defaultItem : detail,
      acceptanceList: list,
      acceptancePagination: pagination,
      AcceptanceStatusLovMap,
      TranserFixedLovMap,
      lineProjectVisible,
      lineProjectBudgetVisible,
      lineContractVisible,
      getWbsHeader: this.getWbsHeader,
      onRef: this.handleBindRef,
      onRefresh: this.handleSearch,
      onCancelAcceptanceLineDrawer: this.handCancelAcceptanceLineDrawer,
      onAcceptanceLineListEdit: this.handAcceptanceLineListEdit,
      onAcceptanceAssetEdit: this.handAcceptanceAssetEdit,
      onAddLine: this.handAddLine,
      onSelectdeliveryList: this.handSelectdeliveryList,
      onChangeAcceptanceType: this.handChangeAcceptanceType,
      onAcceptanceLineDrawerOK: this.handAcceptanceLineDrawerOK,
      onDeliveryModalCancel: this.handleDeliveryModalCancel,
      onAcceptanceModalCancel: this.handAcceptanceModalCancel,
      onSearchDeliveryList: this.handleSearchDeliveryList,
      onDeliveryListModalOk: this.handDeliveryListModalOk,
      onAcceptanceListModalOk: this.handAcceptanceListModalOk,
      onSelectDeliveryRow: this.handleSelectDeliveryRow,
      onSelectAcceptanceRow: this.handSelectAcceptanceRow,
      onDeleteAcceptanceLine: this.handDeleteAcceptanceLine,
      onControlPanelByAcceptanceType: this.handControlPanelByAcceptanceType,
      onControlAcceptanceLineItemsByType: this.handControlAcceptanceLineItemsByType,
      onAcceptanceList: this.handAcceptanceList,
      onSearchAcceptanceList: this.handleSearchAcceptanceList,
      onCancelAcceptanceAssetDrawer: this.handCancelAcceptanceAssetDrawer,
      onAcceptanceAssetDrawerOK: this.handAcceptanceAssetDrawerOK,
      onDeleteAcceptanceRelation: this.handleDeleteAcceptanceRelation,
    };
    const { acceptanceStatusCode = '' } = detail;
    const displayFlag = isNew || editFlag ? { display: 'none' } : { display: 'block' };
    const displayFullFlag =
      isNew || editFlag || !showSearchFlag ? { display: 'none' } : { display: 'block' };
    const displayFlagBtn = isNew || editFlag ? { display: 'block' } : { display: 'none' };
    const displayCloseBtn = isNew || !editFlag ? { display: 'none' } : { display: 'block' };
    return (
      <React.Fragment>
        <Header
          title={intl.get(`arcv.acceptance.view.message.detail.title`).d('验收单')}
          backPath="/arcv/acceptance/list"
        >
          <Button
            icon="save"
            type="primary"
            style={displayFlagBtn}
            loading={loading.save}
            onClick={this.handleAcceptanceList}
          >
            {intl.get(`hzero.common.button.save`).d('保存')}
          </Button>
          <Button icon="edit" type="primary" style={displayFlag} onClick={this.handleEdit}>
            {intl.get('hzero.common.button.edit').d('编辑')}
          </Button>
          <Button icon="close" style={displayCloseBtn} onClick={this.handleEdit}>
            {intl.get('hzero.common.button.close').d('取消编辑')}
          </Button>
          <Button
            loading={loading.completeAsset}
            style={displayFlag}
            onClick={() => this.handSubmitAcceptance('completeAsset')}
            disabled={
              isUndefined(id) ||
              !(
                acceptanceStatusCode === 'SUPPLEMENT' &&
                acceptanceTypeCode !== 'TRANSACTIONAL_ORDER'
              )
            }
          >
            {intl.get(`hzero.common.button.completeAsset`).d('完成资产')}
          </Button>
          <Button
            loading={loading.completeAcceptance}
            style={displayFlag}
            onClick={() => this.handSubmitAcceptance('completeAcceptance')}
            disabled={
              isUndefined(id) ||
              !(acceptanceStatusCode === 'APPROVED' && acceptanceTypeCode !== 'TRANSACTIONAL_ORDER')
            }
          >
            {intl.get(`hzero.common.button.completeAcceptance`).d('完成验收')}
          </Button>
          <Button
            loading={loading.submitAcceptance}
            style={displayFlag}
            onClick={() => this.handSubmitAcceptance('submit')}
            disabled={
              isUndefined(id) ||
              (acceptanceStatusCode !== 'NEW' && acceptanceStatusCode !== 'REFUSE') ||
              isEmpty(acceptanceLineList)
            }
          >
            {intl.get(`hzero.common.button.submit`).d('提交')}
          </Button>
        </Header>
        <Content>
          <div className={classNames(styles['acceptance-detail'])}>
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
                  wrapperClassName={classNames(
                    styles['acceptance-detail'],
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
