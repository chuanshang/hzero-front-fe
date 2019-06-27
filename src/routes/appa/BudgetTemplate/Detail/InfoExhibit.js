import React, { Component, Fragment } from 'react';
import { Form, Row, Col, Input, Select, InputNumber, Collapse, Icon, Tag } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import Switch from 'components/Switch';
import { Bind } from 'lodash-decorators';
import { isEmpty, isNull, isUndefined } from 'lodash';
import EditTable from 'components/EditTable';

@Form.create({ fieldNameProp: null })
class InfoExhibit extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      uomName: '', // 单位
      preorderBudgetTypeMeaning: '', // 前序预算类型中文名
      templateFlag: false, // 是否选择前序模板标记
      collapseKeys: ['A', 'B'],
      selectedNodes: [], // 已选的预算项/节点
    };
  }
  componentDidMount() {
    const { isNew, url, onRefresh, onInitEmptyList } = this.props;
    if (!isNew) {
      let flag = 0;
      if (url.indexOf('new-detail') !== -1) {
        flag = 1;
      }
      onRefresh(flag);
    } else {
      onInitEmptyList();
    }
  }
  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }
  /**
   * 预算类型变更
   */
  @Bind()
  handleBudgetTypeChange(_, record) {
    this.props.onSetFlag(record.thinWbsFlag, record.thinBudgetItemFlag);
    this.setState({
      preorderBudgetTypeMeaning: record.preorderBudgetTypeMeaning,
      uomName: record.uomName,
    });
    this.props.form.setFieldsValue({
      preorderBudgetTypeId: record.preorderBudgetTypeId,
    });
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
   * 前序模板变更
   */
  @Bind()
  handleTemplateChange(value, record) {
    this.props.onSearchBudgetItems(value, record.templateCode);
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
    const prefix = 'appa.budgetTemplate.model.budgetTemplate';
    const {
      disabledFlag,
      isNew,
      dataSource,
      tenantId,
      reportRequirements,
      loading,
      budgetItemList,
      expandedRowKeys,
      onCancelLine,
      onEditLine,
      onExpand,
      onShowModal,
      onDeleteBudgetItem,
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const {
      uomName,
      templateFlag,
      preorderBudgetTypeMeaning,
      selectedNodes,
      collapseKeys = [],
    } = this.state;
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
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && record.nodeType !== 'ROOT' ? (
            <Form.Item>
              {record.$form.getFieldDecorator('itemId', {
                initialValue: record.itemId,
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
                  onClick={this.handleSelectedNode}
                  onChange={(_, lovRecord) => this.handleNodeChange(_, lovRecord, record)}
                />
              )}
            </Form.Item>
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
          .d(
            `预算标准/单位面积(${
              isEmpty(uomName)
                ? isUndefined(dataSource.uomName)
                  ? ''
                  : dataSource.uomName
                : uomName
            })`
          ),
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
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 250,
        dataIndex: 'operate',
        render: (val, record) =>
          record.nodeType === 'ROOT' ? (
            <a
              disabled={dataSource.templateStatus !== 'PRESET' || templateFlag || disabledFlag}
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
                  disabled={dataSource.templateStatus !== 'PRESET' || templateFlag}
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
                  disabled={dataSource.templateStatus !== 'PRESET' || templateFlag}
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
                  disabled={dataSource.templateStatus !== 'PRESET' || templateFlag}
                  onClick={() => onEditLine(record, true)}
                >
                  {intl.get('hzero.common.button.edit').d('编辑')}
                </a>
                <a
                  disabled={dataSource.templateStatus !== 'PRESET' || templateFlag}
                  onClick={() => this.handleAddBudgetItem(record)}
                >
                  {intl.get(`${prefix}.addBudgetItem`).d('新增预算项')}
                </a>
                <a
                  disabled={dataSource.templateStatus !== 'PRESET' || templateFlag}
                  onClick={() => this.handleAddNode(record)}
                >
                  {intl.get('hzero.common.button.add.sub').d('新增下级')}
                </a>
                <a
                  disabled={dataSource.templateStatus !== 'PRESET' || templateFlag}
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
    return (
      <React.Fragment>
        {!isNew ? (
          <Row style={{ marginBottom: 10 }}>
            <Col>
              <Row>
                <span style={{ marginRight: 10, fontSize: 18, fontWeight: 'bold' }}>
                  {dataSource.templateName}.{dataSource.templateCode}
                </span>
                <Tag color="#2db7f5">{dataSource.templateStatusMeaning}</Tag>
                <Tag color="#2db7f5">{`V${dataSource.templateVersion}`}</Tag>
              </Row>
            </Col>
          </Row>
        ) : (
          ''
        )}
        <Collapse
          bordered={false}
          defaultActiveKey={['A', 'B']}
          className="associated-collapse"
          onChange={this.handleChangeKey.bind(this)}
        >
          <Collapse.Panel
            showArrow={false}
            key="A"
            header={
              <Fragment>
                <Icon type={collapseKeys.includes('A') ? 'minus' : 'plus'} />
                <h3>{intl.get(`${prefix}.panel.a`).d('基本信息')}</h3>
              </Fragment>
            }
          >
            <Form className="associated-collapse">
              <Row>
                <Col span={7}>
                  <Form.Item
                    label={intl.get(`${prefix}.templateCode`).d('模板编码')}
                    {...formLayout}
                  >
                    {getFieldDecorator('templateCode', {
                      initialValue: dataSource.templateCode,
                      rules: [
                        {
                          required: isNew,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: intl.get(`${prefix}.templateCode`).d('模板编码'),
                          }),
                        },
                      ],
                    })(<Input disabled={!isNew} />)}
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    label={intl.get(`${prefix}.templateName`).d('模板名称')}
                    {...formLayout}
                  >
                    {getFieldDecorator('templateName', {
                      initialValue: dataSource.templateName,
                      rules: [
                        {
                          required: dataSource.templateStatus === 'PRESET',
                          message: intl.get('hzero.common.validation.notNull', {
                            name: intl.get(`${prefix}.templateName`).d('模板名称'),
                          }),
                        },
                        {
                          max: 240,
                          message: intl.get('hzero.common.validation.max', {
                            max: 240,
                          }),
                        },
                      ],
                    })(<Input disabled={dataSource.templateStatus !== 'PRESET'} />)}
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    label={intl.get(`${prefix}.projectType`).d('项目类型')}
                    {...formLayout}
                  >
                    {getFieldDecorator('proTypeId', {
                      initialValue: dataSource.proTypeId,
                      rules: [
                        {
                          required: dataSource.templateStatus === 'PRESET',
                          message: intl.get('hzero.common.validation.notNull', {
                            name: intl.get(`${prefix}.projectType`).d('项目类型'),
                          }),
                        },
                      ],
                    })(
                      <Lov
                        disabled={dataSource.templateStatus !== 'PRESET'}
                        code="APPM.PROJECT_TYPE"
                        queryParams={{ organizationId: tenantId }}
                        textValue={dataSource.proTypeName}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={7}>
                  <Form.Item label={intl.get(`${prefix}.budgetType`).d('预算类型')} {...formLayout}>
                    {getFieldDecorator('budgetTypeId', {
                      initialValue: dataSource.budgetTypeId,
                      rules: [
                        {
                          required: dataSource.templateStatus === 'PRESET',
                          message: intl.get('hzero.common.validation.notNull', {
                            name: intl.get(`${prefix}.budgetType`).d('预算类型'),
                          }),
                        },
                      ],
                    })(
                      <Lov
                        disabled={dataSource.templateStatus !== 'PRESET'}
                        code="APPA.BUDGET_TYPE_SETTING"
                        queryParams={{ organizationId: tenantId, enabledFlag: 1 }}
                        textValue={dataSource.budgetTypeName}
                        onChange={this.handleBudgetTypeChange}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    label={intl.get(`${prefix}.preorderBudgetType`).d('关联前序预算')}
                    {...formLayout}
                  >
                    {getFieldDecorator('preorderBudgetTypeId', {
                      initialValue: dataSource.preorderBudgetTypeId,
                    })(
                      <Lov
                        disabled
                        code=""
                        queryParams={{ organizationId: tenantId }}
                        textValue={
                          preorderBudgetTypeMeaning || dataSource.preorderBudgetTypeMeaning
                        }
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    label={intl.get(`${prefix}.preorderTemplate`).d('前序预算模板')}
                    {...formLayout}
                  >
                    {getFieldDecorator('preorderTemplateId', {
                      initialValue: dataSource.preorderTemplateId,
                      rules: [
                        {
                          required:
                            dataSource.templateStatus === 'PRESET' &&
                            getFieldValue('preorderBudgetTypeId'),
                          message: intl.get('hzero.common.validation.notNull', {
                            name: intl.get(`${prefix}.preorderTemplate`).d('前序预算模板'),
                          }),
                        },
                      ],
                    })(
                      <Lov
                        disabled={
                          dataSource.templateStatus !== 'PRESET' ||
                          !getFieldValue('preorderBudgetTypeId')
                        }
                        code="APPA.BUDGET_TEMPLATE"
                        queryParams={{
                          budgetTypeId: getFieldValue('preorderBudgetTypeId'),
                          organizationId: tenantId,
                        }}
                        textValue={dataSource.preorderTemplateName}
                        onChange={this.handleTemplateChange}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={14}>
                  <Form.Item label={intl.get(`${prefix}.description`).d('版本概述')} {...midLayout}>
                    {getFieldDecorator('description', {
                      initialValue: dataSource.description,
                      rules: [
                        {
                          required: dataSource.templateStatus === 'PRESET',
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
                    })(<Input disabled={dataSource.templateStatus !== 'PRESET'} />)}
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    label={intl.get(`${prefix}.enabledFlag`).d('是否启用')}
                    {...formLayout}
                  >
                    {getFieldDecorator('enabledFlag', {
                      initialValue: dataSource.enabledFlag,
                    })(<Switch />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <EditTable
                  bordered
                  rowKey="templateItemId"
                  expandedRowKeys={expandedRowKeys}
                  onExpand={onExpand}
                  columns={columns}
                  loading={loading}
                  dataSource={budgetItemList}
                  pagination={false}
                />
              </Row>
            </Form>
          </Collapse.Panel>
        </Collapse>
      </React.Fragment>
    );
  }
}
export default InfoExhibit;
