import React, { Component } from 'react';
import { Form, Row, Col, Input, Select, InputNumber, Tag, Icon } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { Bind } from 'lodash-decorators';
import { isNull, isUndefined } from 'lodash';
import { dateRender } from 'utils/renderer';
import EditTable from 'components/EditTable';
import { Button } from 'components/Permission';

@Form.create({ fieldNameProp: null })
class InfoExhibit extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      selectedNodes: [], // 已选的预算项/节点
    };
  }
  componentDidMount() {
    this.props.onRefresh();
  }

  /**
   * 预算项/节点变更
   */
  @Bind()
  handleNodeChange(_, lovRecord, record) {
    const { onRebuildTree } = this.props;
    onRebuildTree(record, lovRecord);
  }

  /**
   * 点击复制自标准按钮
   */
  @Bind()
  handleClickCopyItself() {
    this.props.onSearchTemplate();
  }

  /**
   * 点击复制自历史版本
   */
  @Bind()
  handleClickCopyHistory() {
    this.props.onCopyHistory();
  }

  /**
   * 前序模板变更
   */
  @Bind()
  handleTemplateChange(value, record) {
    this.props.onSearchBudgetItems(value, record.templateCode);
  }
  /**
   * 动态展示控制期间的列
   */
  @Bind()
  handlePeriodColumn(columns) {
    const { thinPeriodFlag, periodList } = this.props;
    if (thinPeriodFlag === 1 && periodList.length > 0) {
      const prefix = 'appm.projectBudget.model.projectBudget';
      const children = [];
      for (let i = 0; i < periodList.length; i++) {
        const item = periodList[i];
        children.push({
          title: item.periodName,
          dataIndex: item.periodName,
          width: 120,
          render: (_, record) =>
            ['create', 'update'].includes(record._status) && record.nodeType === 'BUDGET' ? (
              <Form.Item>
                {record.$form.getFieldDecorator(`${item.periodName}`, {
                  initialValue: this.handleFormatPeriodList(
                    item.periodName,
                    record.projectBudgetPeriodList
                  ),
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${prefix}.${item.periodName}`).d(`${item.periodName}`),
                      }),
                    },
                    // {
                    //   validator: (rule, value, callback) =>
                    //     this.handleLimitAmount(rule, value, callback, record, item.periodName),
                    // },
                  ],
                })(<InputNumber allowThousandth min={0} precision={2} />)}
              </Form.Item>
            ) : (
              this.renderAmount(
                this.handleFormatPeriodList(item.periodName, record.projectBudgetPeriodList)
              )
            ),
        });
      }
      columns.splice(
        8, // 第8列开始往后添加列
        0,
        {
          children,
          width: 120 * periodList.length,
          title: intl.get(`${prefix}.period`).d('期间明细'),
        }
      );
    }
    return columns;
  }
  /**
   * 对比时，删除操作列
   */
  @Bind()
  handleRemoveOperatorColumn(columns) {
    const { compareFlag } = this.props;
    if (compareFlag) {
      columns.splice(columns.findIndex(item => item.dataIndex === 'operate'), 1);
    }
    return columns;
  }
  /**
   * 对比时，添加需要对比的列
   */
  @Bind()
  handleSetCompareColumn(columns) {
    const { compareFields, compareFlag, uomName = '' } = this.props;
    const prefix = 'appm.projectBudget.model.projectBudget';
    let temps = columns;
    // 请求接口成功，说明存在对比信息，则添加对比列
    if (compareFlag) {
      compareFields.forEach(item => {
        // 对比列模板
        const compareColumns = [
          {
            title:
              item.type === 'standardTemplate'
                ? '标准模板'
                : item.type === 'preVersion'
                ? '上一版本'
                : item.type === 'otherVersion'
                ? '其它版本'
                : '',
            width: 420,
            children: [
              {
                title: intl
                  .get(`${prefix}.budgetStandard`)
                  .d(`预算标准/单位面积(${isNull(uomName) ? '' : uomName})`),
                dataIndex: `${item.type}standardTemplate`,
                width: 180,
                render: (_, record) => {
                  const { budgetSpreadMap = {} } = record;
                  const temp = budgetSpreadMap[item.version];
                  const spread = !isUndefined(temp) ? temp.budgetStandardSpread : 0;
                  return !isUndefined(temp) ? (
                    <span>
                      {`${this.renderAmount(temp.budgetStandard)}`}
                      <span style={{ color: spread > 0 ? '#F04134' : '#00A854' }}>
                        {` (${spread > 0 ? '+' : ''}${this.renderAmount(spread)})`}
                      </span>
                    </span>
                  ) : (
                    0
                  );
                },
              },
              {
                title: intl.get(`${prefix}.fixedBudget`).d('固定预算'),
                dataIndex: `${item.type}fixedBudget`,
                width: 120,
                render: (_, record) => {
                  const { budgetSpreadMap = {} } = record;
                  const temp = budgetSpreadMap[item.version];
                  const spread = !isUndefined(temp) ? temp.fixedBudgetSpread : 0;
                  return !isUndefined(temp) ? (
                    <span>
                      {`${this.renderAmount(temp.fixedBudget)}`}
                      <span style={{ color: spread > 0 ? '#F04134' : '#00A854' }}>
                        {` (${spread > 0 ? '+' : ''}${this.renderAmount(spread)})`}
                      </span>
                    </span>
                  ) : (
                    0
                  );
                },
              },
              {
                title: intl.get(`${prefix}.proBudgetAmount`).d('项目预算金额'),
                dataIndex: `${item.type}proBudgetAmount`,
                width: 120,
                render: (_, record) => {
                  const { budgetSpreadMap = {} } = record;
                  const temp = budgetSpreadMap[item.version];
                  const spread = !isUndefined(temp) ? temp.proBudgetAmountSpread : 0;
                  return !isUndefined(temp) ? (
                    <span>
                      {`${this.renderAmount(temp.proBudgetAmount)}`}
                      <span style={{ color: spread > 0 ? '#F04134' : '#00A854' }}>
                        {` (${spread > 0 ? '+' : ''}${this.renderAmount(spread)})`}
                      </span>
                    </span>
                  ) : (
                    0
                  );
                },
              },
            ],
          },
        ];
        temps = [...temps, ...compareColumns];
      });
    }
    return temps;
  }
  /**
   * 提取后台返回的期间列表
   */
  @Bind()
  handleFormatPeriodList(periodName, periodList) {
    if (!isNull(periodList) && !isUndefined(periodList)) {
      const tempList = periodList.filter(item => item.budgetPeriodName === periodName);
      return tempList[0].budgetPeriodAmount;
    }
    return 0;
  }
  /**
   * 金额转换为千分位并保留两位小数
   */
  @Bind()
  renderAmount(amount = 0) {
    let temp = amount;
    if (!isNull(amount)) {
      temp = amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }
    return temp;
  }
  /**
   * 根据项目预算金额限制预算期间输入的最大值
   */
  // @Bind()
  // handleLimitAmount(rule, value, callback, record, periodName) {
  //   const { proDetail, periodList } = this.props;
  //   const tempList = periodList.filter(item => item.periodName === periodName);
  //   let periodBudget = 0;
  //   tempList.forEach(item => {
  //     periodBudget += record.$form.getFieldValue(item.periodName);
  //   });
  //   const budgetStandard = record.$form.getFieldValue('budgetStandard') || 0;
  //   const fixedBudget = record.$form.getFieldValue('fixedBudget') || 0;
  //   const proBudgetAmount = proDetail.projectArea * budgetStandard + fixedBudget;
  //   if (record.$form.getFieldValue(periodName) + periodBudget > proBudgetAmount) {
  //     callback(intl.get('appm.common.view.validation.budget').d(`${periodName}与总金额不一致`));
  //   } else {
  //     callback();
  //   }
  // }
  /**
   * 点击预算项/节点Lov时，获取已选的预算项/节点
   */
  @Bind()
  handleSelectedNode() {
    const { dataSource, onSelectedNode } = this.props;
    const selectedNodes = onSelectedNode(dataSource);
    this.setState({ selectedNodes });
  }

  /**
   * 新增节点
   */
  handleAddNode(record) {
    this.props.onAddNode(record);
    this.handleSelectedNode();
  }
  /**
   * 新增预算项
   */
  handleAddBudgetItem(record) {
    this.props.onAddBudgetItem(record);
    this.handleSelectedNode();
  }
  render() {
    const prefix = 'appm.projectBudget.model.projectBudget';
    const {
      compareFlag,
      proDetail,
      dataSource,
      budgetDetail,
      tenantId,
      reportRequirements,
      loading,
      templateLoading,
      budgetItemList,
      expandedRowKeys,
      onCancelLine,
      onEditLine,
      onExpand,
      onShowModal,
      onDeleteBudgetItem,
      onShowCompareModal,
      uomName = '',
      periodList = [],
      compareFields = [],
      form: { getFieldDecorator },
    } = this.props;
    const { selectedNodes } = this.state;
    const formLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const midLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 19 },
    };
    const columns = [
      {
        title: intl.get(`${prefix}.levelNumber`).d('层级'),
        dataIndex: 'levelNumber',
        fixed: compareFlag ? 'left' : false,
        width: 150,
        render: (val, record) =>
          record.nodeType !== 'BUDGET' ? (
            <span>
              <Icon type="bars" style={{ color: '#2db7f5' }} /> {val}
            </span>
          ) : (
            ''
          ),
      },
      {
        title: intl.get(`${prefix}.itemName`).d('预算项/节点'),
        dataIndex: 'itemName',
        width: 150,
        fixed: compareFlag ? 'left' : false,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && record.nodeType !== 'ROOT' ? (
            <Form.Item>
              {record.$form.getFieldDecorator('budgetItemId', {
                initialValue: record.budgetItemId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.itemName`).d('预算项/节点'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="APPA.BUDGET_ITEM_LOWWER"
                  queryParams={{ organizationId: tenantId, usedIds: selectedNodes }}
                  textValue={record.itemName}
                  onChange={(_, lovRecord) => this.handleNodeChange(_, lovRecord, record)}
                />
              )}
            </Form.Item>
          ) : record.newItemFlag ? (
            <span style={{ color: '#F04134' }}>{value}</span>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefix}.itemType`).d('填报要求'),
        dataIndex: 'itemTypeMeaning',
        width: 120,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && record.nodeType === 'BUDGET' ? (
            <Form.Item>
              {record.$form.getFieldDecorator('itemTypeCode', {
                initialValue: record.itemTypeCode,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.itemType`).d('填报要求'),
                    }),
                  },
                ],
              })(
                <Select>
                  {reportRequirements.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : record.nodeType === 'BUDGET' ? (
            value
          ) : (
            ''
          ),
      },
      {
        title: intl
          .get(`${prefix}.budgetStandard`)
          .d(`预算标准/单位面积(${isNull(uomName) ? '' : uomName})`),
        dataIndex: 'budgetStandard',
        width: 180,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && record.nodeType === 'BUDGET' ? (
            <Form.Item>
              {record.$form.getFieldDecorator('budgetStandard', {
                initialValue: value,
                rules: [
                  {
                    required: record.$form.getFieldValue('itemTypeCode') === 'COST_OF_UNILATERAL',
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.budgetStandard`).d('预算标准/单位面积'),
                    }),
                  },
                ],
              })(
                <InputNumber
                  allowThousandth
                  min={0}
                  precision={2}
                  disabled={record.$form.getFieldValue('itemTypeCode') !== 'COST_OF_UNILATERAL'}
                />
              )}
            </Form.Item>
          ) : record.nodeType === 'BUDGET' ? (
            this.renderAmount(value)
          ) : (
            ''
          ),
      },
      {
        title: intl.get(`${prefix}.fixedBudget`).d('固定预算'),
        dataIndex: 'fixedBudget',
        width: 120,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && record.nodeType === 'BUDGET' ? (
            <Form.Item>
              {record.$form.getFieldDecorator('fixedBudget', {
                initialValue: value,
                rules: [
                  {
                    required: record.$form.getFieldValue('itemTypeCode') === 'TOTAL_AMOUNT',
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.fixedBudget`).d('固定预算'),
                    }),
                  },
                ],
              })(
                <InputNumber
                  allowThousandth
                  min={0}
                  precision={2}
                  disabled={record.$form.getFieldValue('itemTypeCode') !== 'TOTAL_AMOUNT'}
                />
              )}
            </Form.Item>
          ) : record.nodeType === 'BUDGET' ? (
            this.renderAmount(value)
          ) : (
            ''
          ),
      },
      {
        title: intl.get(`${prefix}.proBudgetAmount`).d('项目预算金额'),
        dataIndex: 'proBudgetAmount',
        width: 120,
        render: value => this.renderAmount(value),
      },
      {
        title: intl.get(`${prefix}.occupiedBudgetAmount`).d('已占预算金额'),
        dataIndex: 'occupiedBudgetAmount',
        width: 120,
        render: value => this.renderAmount(isNull(value) ? 0 : value),
      },
      {
        title: intl.get(`${prefix}.remainingBudgetAmount`).d('剩余预算金额'),
        dataIndex: 'remainingBudgetAmount',
        width: 120,
        render: value => this.renderAmount(value),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 250,
        fixed: 'right',
        dataIndex: 'operate',
        render: (val, record) =>
          record.nodeType === 'ROOT' ? (
            <a
              disabled={dataSource.versionStatus !== 'PRESET'}
              onClick={() => this.handleAddNode(record)}
            >
              {intl.get(`${prefix}.add`).d('新增节点')}
            </a>
          ) : record.nodeType === 'BUDGET' ? (
            record._status === 'create' ? (
              <span className="action-link">
                <a onClick={() => onCancelLine(record)}>
                  {intl.get('hzero.common.button.clean').d('清除')}
                </a>
              </span>
            ) : record._status === 'update' ? (
              <span className="action-link">
                <a onClick={() => onEditLine(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a
                  style={{
                    display:
                      record.ensureProductTypeFlag === 0 && record.ensureAssetSetFlag === 0
                        ? 'none'
                        : 'inline',
                  }}
                  onClick={() => onShowModal(record)}
                >
                  {intl.get(`${prefix}.productAsset`).d('产品类别/资产组')}
                </a>
              </span>
            ) : (
              <span className="action-link">
                <a
                  disabled={dataSource.versionStatus !== 'PRESET'}
                  onClick={() => onEditLine(record, true)}
                >
                  {intl.get('hzero.common.button.edit').d('编辑')}
                </a>
                <a
                  style={{
                    display:
                      record.ensureProductTypeFlag === 0 && record.ensureAssetSetFlag === 0
                        ? 'none'
                        : 'inline',
                  }}
                  onClick={() => onShowModal(record)}
                >
                  {intl.get(`${prefix}.productAsset`).d('产品类别/资产组')}
                </a>
                <a
                  disabled={dataSource.versionStatus !== 'PRESET'}
                  onClick={() => onDeleteBudgetItem(record)}
                >
                  {intl.get('hzero.common.button.delete').d('删除')}
                </a>
              </span>
            )
          ) : record.nodeType === 'NODE' ? (
            record._status === 'create' ? (
              <a onClick={() => onCancelLine(record)}>
                {intl.get('hzero.common.button.clean').d('清除')}
              </a>
            ) : record._status === 'update' ? (
              <a onClick={() => onEditLine(record, false)}>
                {intl.get('hzero.common.button.cancel').d('取消')}
              </a>
            ) : (
              <span className="action-link">
                <a
                  disabled={dataSource.versionStatus !== 'PRESET'}
                  onClick={() => onEditLine(record, true)}
                >
                  {intl.get('hzero.common.button.edit').d('编辑')}
                </a>
                <a
                  disabled={dataSource.versionStatus !== 'PRESET'}
                  onClick={() => this.handleAddBudgetItem(record)}
                >
                  {intl.get(`${prefix}.addBudgetItem`).d('新增预算项')}
                </a>
                <a
                  disabled={dataSource.versionStatus !== 'PRESET'}
                  onClick={() => this.handleAddNode(record)}
                >
                  {intl.get('hzero.common.button.add.sub').d('新增下级')}
                </a>
                <a
                  disabled={dataSource.versionStatus !== 'PRESET'}
                  onClick={() => onDeleteBudgetItem(record)}
                >
                  {intl.get('hzero.common.button.delete').d('删除')}
                </a>
              </span>
            )
          ) : (
            ''
          ),
      },
    ];
    let newColumns = [];
    newColumns = this.handlePeriodColumn(columns);
    newColumns = this.handleRemoveOperatorColumn(newColumns);
    newColumns = this.handleSetCompareColumn(newColumns);
    // 初始列表宽度1330+期间列宽度+对比列宽度
    const scrollX = 1330 + 120 * periodList.length + (compareFlag ? 420 * compareFields.length : 0);
    return (
      <React.Fragment>
        <Row style={{ marginLeft: 20, marginBottom: 10 }}>
          <Col>
            <Row>
              <span style={{ marginRight: 10, fontSize: 18, fontWeight: 'bold' }}>
                {proDetail.projectName}.{proDetail.proType}.{proDetail.maintSitesName}.
                {proDetail.projectCode}
              </span>
              <Tag color="#2db7f5">{proDetail.proStatusName}</Tag>
            </Row>
          </Col>
        </Row>
        <Form>
          <Row>
            <Col span={7}>
              <Form.Item label={intl.get(`${prefix}.manageOrg`).d('项目管理组织')} {...formLayout}>
                {getFieldDecorator('manageOrg', {})(<span>{proDetail.manageOrgName}</span>)}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label={intl.get(`${prefix}.startDate`).d('预计开始日期')} {...formLayout}>
                {getFieldDecorator('startDate', {})(<span>{dateRender(proDetail.startDate)}</span>)}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label={intl.get(`${prefix}.endDate`).d('预计结束日期')} {...formLayout}>
                {getFieldDecorator('endDate', {})(<span>{dateRender(proDetail.endDate)}</span>)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={7}>
              <Form.Item label={intl.get(`${prefix}.budgetTypeName`).d('预算类型')} {...formLayout}>
                {getFieldDecorator('budgetTypeName', {})(
                  <span>{budgetDetail.budgetTypeName}</span>
                )}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                label={intl.get(`${prefix}.budgetAmount`).d('当前项目预算')}
                {...formLayout}
              >
                {getFieldDecorator('budgetAmount', {})(
                  <span>{this.renderAmount(budgetDetail.budgetAmount)}</span>
                )}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                label={intl.get(`${prefix}.preBudgetAmount`).d('上一版本预算')}
                {...formLayout}
              >
                {getFieldDecorator('preBudgetAmount', {})(
                  <span>{this.renderAmount(budgetDetail.previousVersionAmount)}</span>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={14}>
              <Form.Item label={intl.get(`${prefix}.description`).d('版本概述')} {...midLayout}>
                {getFieldDecorator('description', {
                  initialValue: budgetDetail.description,
                  rules: [
                    {
                      required: budgetDetail.versionStatus === 'PRESET',
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${prefix}.description`).d('版本概述'),
                      }),
                    },
                    {
                      max: 240,
                      message: intl.get('hzero.common.validation.max', {
                        max: 240,
                      }),
                    },
                  ],
                })(<Input disabled={budgetDetail.versionStatus !== 'PRESET'} />)}
              </Form.Item>
            </Col>
            <Col span={9} offset={1}>
              <Row style={{ marginTop: 5 }}>
                <Button
                  disabled={budgetDetail.versionStatus !== 'PRESET'}
                  loading={templateLoading}
                  onClick={this.handleClickCopyItself}
                >
                  {intl.get(`${prefix}.copyItself`).d('复制自标准')}
                </Button>
                <Button
                  disabled={budgetDetail.versionStatus !== 'PRESET'}
                  onClick={this.handleClickCopyHistory}
                >
                  {intl.get(`${prefix}.copyHistory`).d('复制自历史版本')}
                </Button>
                <Button onClick={onShowCompareModal}>
                  {intl.get(`${prefix}.compare`).d('选择对比信息')}
                </Button>
              </Row>
            </Col>
          </Row>
          <Row>
            <EditTable
              bordered
              scroll={{ x: scrollX }}
              rowKey="proBudgetItemId"
              expandedRowKeys={expandedRowKeys}
              onExpand={onExpand}
              columns={newColumns}
              loading={loading}
              dataSource={budgetItemList}
              pagination={false}
            />
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}
export default InfoExhibit;
