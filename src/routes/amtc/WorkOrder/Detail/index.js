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
import { Button, Row, Col, Spin, Modal, Icon } from 'hzero-ui';
import {
  getCurrentOrganizationId,
  getDateTimeFormat,
  getDateFormat,
  addItemToPagination,
  delItemToPagination,
} from 'utils/utils';
import { DETAIL_DEFAULT_CLASSNAME } from 'utils/constants';
import moment from 'moment';
import { isEmpty, isUndefined, omit } from 'lodash';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import classNames from 'classnames';
import { routerRedux } from 'dva/router';
import uuidv4 from 'uuid/v4';
import FullTextSearch from './FullTextSearch';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ workOrder, woMalfuction, loading }) => ({
  workOrder,
  woMalfuction,
  tenantId: getCurrentOrganizationId(),
  loading: {
    queryDetailHeaderLoading: loading.effects['workOrder/fetchDetailInfo'],
    saveDetailLoading: loading.effects['workOrder/saveData'],
    fullTextSearchLoading: loading.effects['workOrder/searchFullText'],
    queryWorkProcessList: loading.effects['workOrder/queryWorkProcessList'],
    listWoMalfuction: loading.effects['woMalfuction/listWoMalfuction'],
    queryMaterialList: loading.effects['workOrder/queryMaterialList'],
    queryMaterialReturnList: loading.effects['workOrder/queryMaterialReturnList'],
    queryItemsTreeMaterial: loading.effects['workOrder/queryItemsTreeMaterial'],
    queryItemsHisTreeMaterial: loading.effects['workOrder/queryItemsHisTreeMaterial'],
  },
}))
class Detail extends PureComponent {
  form;

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      selectedRowHisKeys: [],
      selectedHisRows: [],
      modalVisible: false,
      isMulti: false,
      param: [],
      editFlag: false,
      showSearchFlag: true,
      showBtnList: false,
      wrdModalDisplay: false,
      tabPaneHeight: window.screen.availHeight - 450 < 380 ? 380 : window.screen.availHeight - 450,
      defaultDetailItem: {
        durationUnitCode: 'HOUR',
      },
      disabledStatus: false, // 根据状态来判断编辑按钮是否存在
      // 工单字段控制，初始值，新建时
      itemProperty: {
        maintSitesId: { required: true }, // 服务区域
        actId: {}, // 标准作业活动
        woTypeId: { required: true }, // 工单类型
        assetLocationId: {}, // 位置
        assetId: {}, // 设备/资产
        assetRouteId: {}, // 资产路线
        orgId: {}, // 客户/需求组织
        contactId: {}, // 需求方联系人
        plannerGroupId: { required: true }, // 签派/计划员组
        plannerId: { required: true }, // 签派/计划员
        ownerGroupId: { required: true }, // 负责人组
        ownerId: { required: true }, // 负责人
        targetStartDate: { disabled: true }, // 目标开始日期
        targetFinishDate: { disabled: true }, // 目标完成日期
        waitingWoopownerFlag: {}, // 允许自行接单来明确负责人
        ownerConfirmFlag: {}, // 需要工单负责人做最后确认
        scheduledStartDate: {}, // 计划开始时间
        scheduledFinishDate: {}, // 计划完成时间
        actualStartDate: {}, // 实际开始时间
        actualFinishDate: {}, // 实际完成时间
        // 工单来源面板
        reportOrgId: {}, // 报告人所在组织
        reporterId: {}, // 报告人
        reportDate: {}, // 报告时间
        reportPriorityId: {}, // 报告的优先级
        sourceTypeCode: {}, // 工单来源
        sourceReference: {}, // 来源单据号
      },
    };
  }

  componentDidMount() {
    this.screenChange();
    const {
      dispatch,
      tenantId,
      match: { params },
    } = this.props;
    const { id } = params;
    dispatch({
      type: 'workOrder/init',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'workOrder/getCurrentEmployee',
      payload: {
        tenantId,
      },
    });
    if (!isUndefined(id)) {
      this.handleFullSearch('', {});
    }
  }
  @Bind()
  screenChange() {
    window.addEventListener('resize', this.resize);
  }
  @Bind()
  resize() {
    this.setState({
      tabPaneHeight: window.screen.availHeight - 450 < 380 ? 380 : window.screen.availHeight - 450,
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
   * 根据工单状态来控制字段必输或不可用
   */
  @Bind()
  setItemProperty(woStatus) {
    let { itemProperty } = this.state;
    const itemPropertyKeys = Object.keys(itemProperty);
    switch (woStatus) {
      case 'DRAFT':
        itemProperty = {
          ...itemProperty,
        };
        break;
      case 'COMPLETED':
        itemPropertyKeys.forEach(itemName => {
          let itemObj = { disabled: true };
          if (itemName === 'actualStartDate' || itemName === 'actualFinishDate') {
            // 必须
            itemObj = { required: true };
          }
          itemProperty[itemName] = itemObj;
        });
        break;
      case 'PRECLOSED':
        // 全部修改为不可更改
        itemPropertyKeys.forEach(itemName => {
          itemProperty[itemName] = { disabled: true };
        });
        break;
      case 'CANCELED':
      case 'CLOSED':
      case 'UNABLE':
        this.setState({ disabledStatus: true });
        break;
      default:
        // 其他情况
        itemProperty = {
          ...itemProperty,
          maintSitesId: { disabled: true }, // 服务区域
          actId: { disabled: true }, // 标准作业活动
          woTypeId: { disabled: true }, // 工单类型
          assetRouteId: { disabled: true }, // 资产路线
          orgId: { disabled: true }, // 客户/需求组织
          contactId: { disabled: true }, // 需求方联系人
          plannerGroupId: { disabled: true }, // 签派/计划员组
          plannerId: { disabled: true }, // 签派/计划员
          targetStartDate: { disabled: true }, // 目标开始日期
          targetFinishDate: { disabled: true }, // 目标完成日期
          waitingWoopownerFlag: { disabled: true }, // 允许自行接单来明确负责人
          ownerConfirmFlag: { disabled: true }, // 需要工单负责人做最后确认
          // 工单来源面板
          reportOrgId: { disabled: true }, // 报告人所在组织
          reporterId: { disabled: true }, // 报告人
          reportDate: { disabled: true }, // 报告时间
          reportPriorityId: { disabled: true }, // 报告的优先级
          sourceTypeCode: { disabled: true }, // 工单来源
          sourceReference: { disabled: true }, // 来源单据号
        };
        break;
    }
    this.setState({ itemProperty });
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
   * 保存明细
   */
  @Bind()
  save() {
    const {
      dispatch,
      tenantId,
      match: {
        url,
        params: { woId },
      },
      workOrder: { detail, currentEmployee },
    } = this.props;
    const { validateFields = e => e } = this.form;
    const fieldValues = isUndefined(this.form) ? {} : this.form.getFieldsValue();
    validateFields(err => {
      if (isEmpty(err)) {
        dispatch({
          type: 'workOrder/saveData',
          payload: {
            ...detail,
            ...fieldValues,
            tenantId,
            reporterId: fieldValues.reporterId || detail.reporterId || currentEmployee.employeeId, // 报告人
            reportDate: moment(fieldValues.reportDate || detail.reportDate || new Date()).format(
              getDateFormat()
            ),
            planStartDate: moment(fieldValues.planStartDate).format(getDateTimeFormat()),
            planEndDate: moment(fieldValues.planEndDate).format(getDateTimeFormat()),
            targetStartDate: moment(fieldValues.targetStartDate).format(getDateTimeFormat()),
            targetEndDate: moment(fieldValues.targetEndDate).format(getDateTimeFormat()),
            actualStartDate: moment(fieldValues.actualStartDate).format(getDateTimeFormat()),
            actualEndDate: moment(fieldValues.actualEndDate).format(getDateTimeFormat()),
          },
        }).then(res => {
          if (res) {
            notification.success();
            if (!isUndefined(woId) && url.indexOf('create') === -1) {
              this.handleFullSearch('', {});
              this.setState({ editFlag: false });
            } else {
              dispatch(
                routerRedux.push({
                  pathname: `/amtc/work-order/detail/${res.woId}`,
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
   * 明细页全文检索
   * @param {*}
   */
  @Bind()
  handleFullSearch(condition = '', page = {}) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'workOrder/searchFullText',
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
    const { woId } = match.params;
    const { defaultDetailItem } = this.state;
    if (!isUndefined(woId)) {
      dispatch({
        type: 'workOrder/fetchDetailInfo',
        payload: {
          tenantId,
          woId,
        },
      }).then(res => {
        if (res) {
          const newDefaultDetailItem = {
            ...defaultDetailItem,
          };
          this.setState({
            defaultDetailItem: newDefaultDetailItem,
          });
          this.setItemProperty(res.woStatus);
        }
      });
      this.handleWoopSearch();
      this.handleMaterialSearch();
      this.handleMaterialReturnSearch();
    } else {
      dispatch({
        type: 'workOrder/updateState',
        payload: {
          detail: { ...defaultDetailItem },
        },
      });
    }
  }

  /**
   *  查询工序列表
   * @param {object} page 查询参数
   */
  @Bind()
  handleWoopSearch(fields = {}) {
    const { dispatch, tenantId, match } = this.props;
    const { woId } = match.params;
    if (!isUndefined(woId)) {
      dispatch({
        type: 'workOrder/queryWorkProcessList',
        payload: {
          tenantId,
          woId,
          page: isEmpty(fields) ? {} : fields,
        },
      });
    }
  }

  /**
   *  删除工序
   * @param {object} record 工序信息
   */
  @Bind()
  handleWoopDelete(record) {
    const { dispatch, tenantId, match } = this.props;
    const { woId } = match.params;
    const messagePrompt = 'amtc.workOrder.view.message';
    if (!isUndefined(woId)) {
      Modal.confirm({
        content: intl.get(`${messagePrompt}.title.content`).d('确定删除吗？'),
        onOk() {
          dispatch({
            type: 'workOrder/deleteWorkProcess',
            payload: {
              ...record,
              tenantId,
            },
          }).then(res => {
            if (res) {
              notification.success();
              dispatch({
                type: 'workOrder/queryWorkProcessList',
                payload: {
                  tenantId,
                  woId,
                },
              });
            }
          });
        },
      });
    }
  }

  /**
   * @param {string} id - id
   */
  @Bind()
  handleGotoDetail(id) {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/amtc/work-order/detail/${id}`,
      })
    );
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
   *  备件耗材投入列表
   * @param {object} page 查询参数
   */
  @Bind()
  handleMaterialSearch(fields = {}) {
    const { dispatch, tenantId, match } = this.props;
    const { woId } = match.params;
    if (!isUndefined(woId)) {
      dispatch({
        type: 'workOrder/queryMaterialList',
        payload: {
          tenantId,
          woId,
          page: isEmpty(fields) ? {} : fields,
        },
      });
    }
  }

  /**
   *  备件耗材退回列表
   * @param {object} page 查询参数
   */
  @Bind()
  handleMaterialReturnSearch(fields = {}) {
    const { dispatch, tenantId, match } = this.props;
    const { woId } = match.params;
    if (!isUndefined(woId)) {
      dispatch({
        type: 'workOrder/queryMaterialReturnList',
        payload: {
          tenantId,
          woId,
          page: isEmpty(fields) ? {} : fields,
        },
      });
    }
  }
  /**
   * 打开设备资产模态框
   */
  @Bind()
  handleShowAssetModal(flag, sign) {
    const { dispatch, tenantId, woId } = this.props;
    dispatch({
      type: 'workOrder/queryItemsTreeMaterial',
      payload: {
        tenantId,
        woId,
      },
    });
    dispatch({
      type: 'workOrder/queryItemsHisTreeMaterial',
      payload: {
        tenantId,
        woId,
      },
    });
    this.setState({
      modalVisible: true,
      isMulti: flag,
      param: sign,
      selectedRows: [],
      selectedHisRows: [],
    });
  }

  /**
   * 关闭模态框
   */
  @Bind()
  handleModalCancel() {
    this.setState({
      modalVisible: false,
      selectedRowKeys: [],
      selectedRowHisKeys: [],
      selectedRows: [],
      selectedHisRows: [],
    });
  }

  /**
   * 设备资产模态框确认操作
   */
  @Bind()
  handleAssetModalOk() {
    const { selectedRows, selectedHisRows, param } = this.state;
    const mylist = [...selectedRows, ...selectedHisRows];
    const {
      dispatch,
      workOrder: {
        materialList,
        materialPagination = {},
        materialReturnList,
        materialReturnPagination = {},
      },
    } = this.props;
    let newSelectedRows = [];
    let pagination = materialPagination;
    let paginationReturn = materialReturnPagination;
    let count = 0;
    let countReturn = 0;
    if (param === 'INVEST') {
      if (!isEmpty(mylist)) {
        newSelectedRows = mylist.map(item => {
          const id = uuidv4();
          const {
            itemId,
            itemName,
            itemNum,
            locationId,
            locationMeaning,
            locatorId,
            locatorMeaning,
            lotNumber,
            quantity,
            uomMeaning,
          } = item;
          const temp = {
            locationMeaning,
            locatorMeaning,
            itemMeaning: itemName,
            processedQuantity: quantity,
            processType: 'INVEST',
            uomMeaning,
            itemNum,
            itemId,
            locatorId,
            locationId,
            lotNumber,
            woMaterialId: id,
            _status: 'create',
          };
          pagination = addItemToPagination(materialList.length + count, pagination);
          count++;
          return temp;
        });
        dispatch({
          type: 'workOrder/updateState',
          payload: {
            materialList: [...materialList, ...newSelectedRows],
            materialPagination: pagination,
          },
        });
      }
    }
    if (param === 'RETURN') {
      if (!isEmpty(mylist)) {
        newSelectedRows = mylist.map(item => {
          const id = uuidv4();
          const {
            itemId,
            itemName,
            itemNum,
            locationId,
            locationMeaning,
            locatorId,
            locatorMeaning,
            lotNumber,
            quantity,
            uomMeaning,
          } = item;
          const temp = {
            locationMeaning,
            locatorMeaning,
            itemMeaning: itemName,
            processedQuantity: quantity,
            processType: 'RETURN',
            uomMeaning,
            itemNum,
            itemId,
            locatorId,
            locationId,
            lotNumber,
            woMaterialId: id,
            _status: 'create',
          };
          paginationReturn = addItemToPagination(
            materialReturnList.length + countReturn,
            paginationReturn
          );
          countReturn++;
          return temp;
        });
        dispatch({
          type: 'workOrder/updateState',
          payload: {
            materialReturnList: [...materialReturnList, ...newSelectedRows],
            materialReturnPagination: paginationReturn,
          },
        });
      }
    }
    this.setState({
      modalVisible: false,
      selectedRowKeys: [],
      selectedRowHisKeys: [],
      selectedRows: [],
      selectedHisRows: [],
    });
  }
  /**
   * 数据行选中操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }
  @Bind()
  handleSelectHisRow(selectedRowHisKeys, selectedHisRows) {
    this.setState({ selectedRowHisKeys, selectedHisRows });
  }
  /**
   *  删除备件耗材
   * @param {object} record 备件耗材信息
   */
  @Bind()
  handleMaterialDelete(record) {
    const {
      dispatch,
      tenantId,
      match,
      workOrder: {
        materialList,
        materialPagination = {},
        materialReturnList,
        materialReturnPagination = {},
      },
    } = this.props;
    const { woId } = match.params;
    const messagePrompt = 'amtc.workOrder.view.message';
    Modal.confirm({
      content: intl.get(`${messagePrompt}.title.content`).d('确定删除吗？'),
      onOk() {
        let newList = [];
        let newReturnList = [];
        newList = materialList.filter(item => item.woMaterialId !== record.woMaterialId);
        newReturnList = materialReturnList.filter(
          item => item.woMaterialId !== record.woMaterialId
        );
        if (record._status === 'create') {
          // 未保存的数据，从页面上删除
          dispatch({
            type: 'workOrder/updateState',
            payload: {
              materialList: newList,
              materialPagination: delItemToPagination(newList.length, materialPagination),
            },
          });
          dispatch({
            type: 'workOrder/updateState',
            payload: {
              materialReturnList: newReturnList,
              materialReturnPagination: delItemToPagination(
                newReturnList.length,
                materialReturnPagination
              ),
            },
          });
          notification.success();
        } else {
          dispatch({
            type: 'workOrder/deleteMaterial',
            payload: {
              ...record,
              tenantId,
            },
          }).then(res => {
            if (res) {
              notification.success();
              dispatch({
                type: 'workOrder/queryMaterialList',
                payload: {
                  tenantId,
                  woId,
                },
              });
              dispatch({
                type: 'workOrder/queryMaterialReturnList',
                payload: {
                  tenantId,
                  woId,
                },
              });
            }
          });
        }
      },
    });
  }
  /**
   * 修改状态修改按钮列表是否显示的state属性
   */
  @Bind()
  changeShowBtnList() {
    const { showBtnList } = this.state;
    this.setState({ showBtnList: !showBtnList });
  }
  /**
   * 状态修改按钮点击事件
   */
  @Bind()
  changeStatusBtnClick(btnObj = {}) {
    const {
      dispatch,
      tenantId,
      workOrder: { detail },
    } = this.props;
    let changeItem = {
      woStatus: btnObj.changeTo,
    };
    if (btnObj.btn === 'changeWRDtoAPPROVED') {
      // 改派
      this.setState({ wrdModalDisplay: true });
      return;
    } else if (btnObj.changeTo === 'INPRG') {
      // 开始工单,将点击时间记录在工单“实际开始时间”字段
      changeItem = {
        ...changeItem,
        actualStartDate: moment(new Date()).format(getDateTimeFormat()),
      };
    } else if (btnObj.changeTo === 'COMPLETED') {
      // 完成工单,将点击时间记录在工单“实际完成时间”字段
      changeItem = {
        ...changeItem,
        actualFinishDate: moment(new Date()).format(getDateTimeFormat()),
      };
    }
    // 调用 工单修改接口 来修改工单状态和时间
    dispatch({
      type: 'workOrder/changeWoStatus',
      payload: {
        ...detail,
        tenantId,
        ...changeItem,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }
  /**
   * 改派弹窗确定
   */
  @Bind()
  handleWrdModalOk(data) {
    const {
      dispatch,
      tenantId,
      workOrder: { detail },
    } = this.props;
    // 调用 工单修改接口 来修改工单状态
    dispatch({
      type: 'workOrder/changeWoStatus',
      payload: {
        ...detail,
        tenantId,
        ownerGroupId: data.wo.ownerGroupId,
        ownerId: data.wo.ownerId,
        woStatus: 'APPROVED', // 改派的时候，状态改为APPROVED
        woopList: data.woop,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.setState({ wrdModalDisplay: false });
        this.handleSearch();
      }
    });
  }
  /**
   * 改派弹窗取消
   */
  @Bind()
  handleWrdCancel() {
    this.setState({ wrdModalDisplay: false });
  }
  /**
   * 工单状态修改逻辑按钮HTML
   */
  @Bind()
  changeStatusBtnHtml(woStatus) {
    const {
      match: {
        params: { woId },
      },
    } = this.props;
    const { showBtnList, editFlag } = this.state;
    const isNew = isUndefined(woId);
    const displayFlag = isNew || editFlag;
    const topStep = 35; // 按钮间距离
    const btnList = []; // 按钮组html
    let displayBtnList = true; // 是否展示按钮组
    let btnDesc = {}; // 按钮组信息
    switch (woStatus) {
      case 'APPROVED': // 待处理
        btnDesc = {
          btn: 'changeAPPROVEDtoINPRG',
          btnDesc: '开始工单',
          changeTo: 'INPRG',
          list: [
            {
              btn: 'changeAPPROVEDtoWRD',
              btnDesc: '需改派',
              changeTo: 'WRD',
            },
            {
              btn: 'changeAPPROVEDtoWPCOND',
              btnDesc: '等待作业条件',
              changeTo: 'WPCOND',
            },
            {
              btn: 'changeAPPROVEDtoWSCH',
              btnDesc: '等待安排',
              changeTo: 'WSCH',
            },
            {
              btn: 'changeAPPROVEDtoCOMPLETED',
              btnDesc: '工作完成',
              changeTo: 'COMPLETED',
            },
            {
              btn: 'changeAPPROVEDtoCANCELED',
              btnDesc: '取消',
              changeTo: 'CANCELED',
            },
          ],
        };
        break;
      case 'INPRG': // 执行中
        btnDesc = {
          btn: 'changeINPRGtoCOMPLETED',
          btnDesc: '完成工单',
          changeTo: 'COMPLETED',
          list: [
            {
              btn: 'changeINPRGtoWRD',
              btnDesc: '需改派',
              changeTo: 'WRD',
            },
            {
              btn: 'changeINPRGtoWPCOND',
              btnDesc: '等待作业条件',
              changeTo: 'WPCOND',
            },
            {
              btn: 'changeINPRGtoPAUSE',
              btnDesc: '暂停作业',
              changeTo: 'PAUSE',
            },
            {
              btn: 'changeINPRGtoCANCELED',
              btnDesc: '取消',
              changeTo: 'CANCELED',
            },
          ],
        };
        break;
      case 'WRD': // 需改派
        btnDesc = {
          btn: 'changeWRDtoAPPROVED',
          btnDesc: '改派',
          changeTo: 'APPROVED',
          list: [
            {
              btn: 'changeWRDtoCANCELED',
              btnDesc: '取消',
              changeTo: 'CANCELED',
            },
          ],
        };
        break;
      case 'WPCOND': // 等待作业条件
      case 'PAUSE': // 暂停作业
        btnDesc = {
          btn: 'changeWPtoINPRG',
          btnDesc: '开始工单',
          changeTo: 'INPRG',
          list: [
            {
              btn: 'changeWPtoCANCELED',
              btnDesc: '取消',
              changeTo: 'CANCELED',
            },
          ],
        };
        break;
      case 'COMPLETED': // 工作完成
        btnDesc = {
          btn: 'changeCOMPLETEDtoCLOSED',
          btnDesc: '关闭工单',
          changeTo: 'CLOSED',
          list: [
            {
              btn: 'changeCOMPLETEDtoPRECLOSED',
              btnDesc: '等待关闭',
              changeTo: 'PRECLOSED',
            },
            {
              btn: 'changeCOMPLETEDtoRETURNED',
              btnDesc: '退回',
              changeTo: 'RETURNED',
            },
          ],
        };
        break;
      case 'WSCH': // 等待安排
        btnDesc = {
          btn: 'changeWSCHtoAPPROVED',
          btnDesc: '待处理',
          changeTo: 'APPROVED',
          list: [
            {
              btn: 'changeWSCHtoCANCELED',
              btnDesc: '取消',
              changeTo: 'CANCELED',
            },
          ],
        };
        break;
      case 'REWORK': // 返工
        btnDesc = {
          btn: 'changeREWORKtoCOMPLETED',
          btnDesc: '完成工单',
          changeTo: 'COMPLETED',
          list: [
            {
              btn: 'changeREWORKtoCANCELED',
              btnDesc: '取消',
              changeTo: 'CANCELED',
            },
          ],
        };
        break;
      case 'PRECLOSED': // 等待关闭
        btnDesc = {
          btn: 'changePRECLOSEDtoCLOSED',
          btnDesc: '关闭工单',
          changeTo: 'CLOSED',
          list: [
            {
              btn: 'changePRECLOSEDtoRETURNED',
              btnDesc: '退回',
              changeTo: 'RETURNED',
            },
          ],
        };
        break;
      case 'RETURNED': // 退回
        btnDesc = {
          btn: 'changeRETURNEDtoREWORK',
          btnDesc: '开始返工',
          changeTo: 'REWORK',
          list: [
            {
              btn: 'changeRETURNEDtoCANCELED',
              btnDesc: '取消',
              changeTo: 'CANCELED',
            },
          ],
        };
        break;
      case 'CLOSED': // 结束
      case 'CANCELED': // 取消
      case 'UNABLE': // 无法执行
      case 'DRAFT': // 拟定
      default:
        displayBtnList = false;
        break;
    }
    if (displayBtnList) {
      // 按钮列表
      if (showBtnList) {
        for (let i = 0; i < btnDesc.list.length; i++) {
          btnList.push(
            <div style={{ position: 'absolute', top: topStep * (i + 1) }}>
              <Button
                onClick={() => this.changeStatusBtnClick(btnDesc.list[i])}
                style={displayFlag ? { display: 'none' } : { zIndex: 9 }}
              >
                {intl.get(`hzero.common.button.${btnDesc.list[i].btn}`).d(btnDesc.list[i].btnDesc)}
              </Button>
            </div>
          );
        }
      }
      // 显示的主按钮
      btnList.push(
        <Button onClick={() => this.changeStatusBtnClick(omit(btnDesc, ['list']))}>
          {intl.get(`hzero.common.button.${btnDesc.btn}`).d(btnDesc.btnDesc)}
        </Button>
      );
      // 更多按钮
      btnList.push(
        <Button
          icon={showBtnList ? 'up' : 'down'}
          onClick={() => {
            this.setState({ showBtnList: !showBtnList });
          }}
        />
      );
      // 按钮组HTML
      return (
        <React.Fragment>
          <div style={displayFlag ? { display: 'none' } : { position: 'relative' }}>
            {btnList.map(item => item)}
          </div>
        </React.Fragment>
      );
    } else {
      return '';
    }
  }
  render() {
    const {
      showSearchFlag,
      editFlag,
      selectedRowKeys = [],
      selectedRowHisKeys = [],
      modalVisible,
      isMulti,
      param,
      wrdModalDisplay,
      itemProperty,
      disabledStatus,
      tabPaneHeight,
    } = this.state;
    const {
      dispatch,
      loading,
      match,
      tenantId,
      workOrder,
      woMalfuction,
      woChecklists,
      woChecklistGroups,
    } = this.props;
    const { queryDetailHeaderLoading, saveDetailLoading, fullTextSearchLoading } = loading;
    const {
      selectMaps,
      fullList,
      fullPagination,
      detail,
      woopList,
      woopPagination,
      materialList,
      materialReturnList,
      materialPagination,
      materialReturnPagination,
      treeList,
      pathMap,
      expandedRowKeys,
      treeHisList,
      expandedHisRowKeys,
    } = workOrder;
    const { woId } = match.params;
    const isNew = isUndefined(woId);
    const detailFormProps = {
      woId,
      editFlag,
      materialList,
      materialReturnList,
      materialPagination,
      materialReturnPagination,
      treeList,
      pathMap,
      expandedRowKeys,
      treeHisList,
      expandedHisRowKeys,
      modalVisible,
      isMulti,
      param,
      selectedRowKeys,
      selectedRowHisKeys,
      dispatch,
      woMalfuction,
      woChecklists,
      woChecklistGroups,
      tenantId,
      selectMaps,
      dataSource: detail,
      woopList,
      woopPagination,
      isNew,
      key: woId,
      loading,
      itemProperty,
      tabPaneHeight,
      wrdModalDisplay,
      onRef: this.handleBindRef,
      onRefresh: this.handleSearch,
      onWoopSearch: this.handleWoopSearch,
      onDeleteWoop: this.handleWoopDelete,
      onMaterialSearch: this.handleMaterialSearch,
      onMaterialReturnSearch: this.handleMaterialReturnSearch,
      onDeleteMaterial: this.handleMaterialDelete,
      onAssetModalOk: this.handleAssetModalOk,
      onModalCancel: this.handleModalCancel,
      onShowAssetModal: this.handleShowAssetModal,
      onSelectRow: this.handleSelectRow,
      onSelectHisRow: this.handleSelectHisRow,
      onWrdModalOk: this.handleWrdModalOk,
      onWrdCancel: this.handleWrdCancel,
    };
    const fullTextSearchProps = {
      isNew,
      currentWoId: woId,
      loading: fullTextSearchLoading,
      pagination: fullPagination,
      dataSource: fullList,
      onSearch: this.handleFullSearch,
      onGotoDetail: this.handleGotoDetail,
    };
    const displayFlag = isNew || editFlag ? { display: 'none' } : { display: 'block' };
    const displayEditFlag =
      isNew || editFlag || disabledStatus ? { display: 'none' } : { display: 'block' };
    const displayFullFlag =
      isNew || editFlag || !showSearchFlag ? { display: 'none' } : { display: 'block' };
    const displayFlagBtn = isNew || editFlag ? { display: 'block' } : { display: 'none' };
    const displayCloseBtn = isNew || !editFlag ? { display: 'none' } : { display: 'block' };
    return (
      <React.Fragment>
        <Header
          title={intl.get('amtc.workOrder.view.message.detail').d('工单管理')}
          backPath="/amtc/work-order/list"
        >
          <Button
            loading={saveDetailLoading}
            icon="save"
            type="primary"
            style={displayFlagBtn}
            onClick={this.save}
          >
            {intl.get(`hero.common.button.save`).d('保存')}
          </Button>
          <Button icon="edit" type="primary" style={displayEditFlag} onClick={this.handleEdit}>
            {intl.get('hzero.common.button.edit').d('编辑')}
          </Button>
          {this.changeStatusBtnHtml(detail.woStatus || '')}
          <Button icon="close" style={displayCloseBtn} onClick={this.handleEdit}>
            {intl.get('hzero.common.button.close').d('取消编辑')}
          </Button>
        </Header>
        <Content>
          <div className={classNames(styles['work-order-tail'])}>
            <Row>
              <Col span={isUndefined(woId) ? 0 : editFlag ? 1 : showSearchFlag ? 6 : 1}>
                <Row>
                  <Col style={displayFullFlag} span={isUndefined(woId) ? 0 : 21}>
                    <FullTextSearch {...fullTextSearchProps} />
                  </Col>
                  <Col style={displayFlag} span={isUndefined(woId) ? 0 : 3}>
                    <Icon
                      type={showSearchFlag ? 'menu-fold' : 'menu-unfold'}
                      onClick={this.setShowSearchFlag}
                      style={{ fontSize: 18, padding: 10, border: 0, cursor: 'pointer' }}
                    >
                      {intl.get(`hero.common.click.menu`).d('')}
                    </Icon>
                  </Col>
                </Row>
              </Col>
              <Col span={isUndefined(woId) ? 24 : editFlag ? 23 : showSearchFlag ? 18 : 23}>
                <Spin
                  spinning={isUndefined(woId) ? false : queryDetailHeaderLoading}
                  wrapperClassName={classNames(styles['work-order-tail'], DETAIL_DEFAULT_CLASSNAME)}
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
