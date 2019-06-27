import React, { Component, Fragment } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Collapse,
  Icon,
  Select,
  Button,
  Modal,
  DatePicker,
  InputNumber,
  Tabs,
  Divider,
} from 'hzero-ui';
import intl from 'utils/intl';
import { isUndefined, isEmpty, isNull } from 'lodash';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import uuidv4 from 'uuid/v4';
import { getDateFormat } from 'utils/utils';
import { EDIT_FORM_ITEM_LAYOUT, EDIT_FORM_ROW_LAYOUT, FORM_COL_3_LAYOUT } from 'utils/constants';
import { dateRender } from 'utils/renderer';
import moment from 'moment';
import DetailChangeLines from './DetailChangeLines';
import DetailChangeLinesDrawer from './DetailChangeLinesDrawer';
import LineChart from './LineChart';

@Form.create({ fieldNameProp: null })
class FixedAssetsDetail extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      collapseKeys: ['A', 'B', 'C', 'D'],
      changeDetail: {},
    };
  }

  componentDidMount() {
    const { fixedAssetId, onSearchChanges, changeLinesPagination = {} } = this.props;
    if (!isUndefined(fixedAssetId)) {
      onSearchChanges(changeLinesPagination);
    }
    this.props.onRefresh();
  }

  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }

  /**
   * 数据行选择操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }

  /**
   * @function handleModalVisible - 控制modal显示与隐藏
   * @param {boolean} flag 是否显示modal
   */
  @Bind
  handleModalVisible(flag) {
    const { dispatch } = this.props;
    dispatch({
      type: 'fixedAssets/updateState',
      payload: {
        modalVisible: !!flag,
      },
    });
  }

  /**
   * @function showCreateModal - 显示新增modal
   */
  @Bind
  showCreateModal() {
    this.setState({ changeDetail: {} });
    this.handleModalVisible(true);
  }

  /**
   *  @function showEditDrawer - 显示编辑modal
   */
  @Bind()
  showEditDrawer(record) {
    this.setState({ changeDetail: record });
    this.handleModalVisible(true);
  }

  /**
   * 删除价值变动
   */
  @Bind()
  handleDelete() {
    const {
      fixedAssetId,
      tenantId,
      dispatch,
      changeLines,
      onSearchChanges,
      changeLinesPagination = {},
    } = this.props;
    const { selectedRows } = this.state;
    Modal.confirm({
      iconType: '',
      content: intl.get('afam.fixedAssets.view.message.detailLine.delete').d('是否删除价值变动？'),
      onOk: () => {
        const newChangeLines = changeLines;
        selectedRows.forEach(element1 => {
          changeLines.forEach(element2 => {
            if (element1.changeId === element2.changeId) {
              newChangeLines.splice(
                newChangeLines.findIndex(item => item.changeId === element2.changeId),
                1
              );
            }
          });
        });
        const newSelectedRows = [];
        selectedRows.forEach(item => {
          if (item._status !== 'create') {
            newSelectedRows.push(item);
          }
        });
        dispatch({
          type: 'fixedAssets/deleteChangeLines',
          payload: {
            tenantId,
            fixedAssetId,
            data: [...newSelectedRows],
          },
        }).then(res => {
          if (res) {
            // dispatch({
            //   type: 'fixedAssets/updateState',
            //   payload: {
            //     changeLines: [...newChangeLines],
            //   },
            // });
            onSearchChanges(changeLinesPagination);
            this.setState({
              selectedRowKeys: [],
              selectedRows: [],
            });
          }
        });
      },
    });
  }

  /**
   * Drawer Ok
   * @param {obejct} values - 操作数据对象
   */
  @Bind()
  handleDrawerOk(values = {}) {
    const { dispatch, changeLines } = this.props;
    if (isUndefined(values.changeId)) {
      // 新建
      const id = uuidv4();
      dispatch({
        type: 'fixedAssets/updateState',
        payload: {
          changeLines: [{ ...values, changeId: id, _status: 'create' }, ...changeLines],
        },
      });
    } else {
      // 编辑
      const newList = changeLines.map(item =>
        item.changeId === values.changeId ? { ...item, ...values, _status: 'update' } : item
      );
      dispatch({
        type: 'fixedAssets/updateState',
        payload: {
          changeLines: [...newList],
        },
      });
    }
    this.setState({ changeDetail: {} });
    this.handleModalVisible(false);
  }

  render() {
    const commonPromptCode = 'afam.fixedAssets.model.fixedAssets';
    const {
      isNew,
      editFlag,
      showSearchFlag,
      dataSource,
      changeLines,
      modalVisible,
      form: { getFieldDecorator },
      tenantId,
      depreciationTypeCodeMap,
      changeTypeCodeMap,
      loading,
    } = this.props;
    const { collapseKeys = [], changeDetail = {}, selectedRowKeys = [] } = this.state;
    const longFormLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    const detailChangeLinesProps = {
      dataSource: changeLines,
      selectedRowKeys,
      loading: loading.listChangeLines,
      onEditLine: this.showEditDrawer,
      onSelectRow: this.handleSelectRow,
    };
    const drawerProps = {
      tenantId,
      changeDetail,
      changeTypeCodeMap,
      visible: modalVisible,
      onHideDrawer: this.handleModalVisible,
      onOk: this.handleDrawerOk,
    };
    const lineChartProps = {
      showSearchFlag,
      dataSource: changeLines,
    };
    const displayFlag = editFlag ? { display: 'block' } : { display: 'none' };
    return (
      <React.Fragment>
        {isNew ? (
          <React.Fragment>
            <Row>
              <Col span={3}>
                <Icon type="picture" style={{ fontSize: 80 }} />
              </Col>
              <Col span={21}>
                <Row style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 'bold' }}>
                    {dataSource.fixedAssetName}
                  </span>
                </Row>
                <Row>
                  <Col span={7}>
                    <Row>
                      <span>{intl.get(`${commonPromptCode}.financialNum`).d('固定资产编号')}</span>
                    </Row>
                    <Row style={{ fontWeight: 'bold' }}>{dataSource.financialNum}</Row>
                  </Col>
                  <Col span={7}>
                    <Row>
                      <span>{intl.get(`${commonPromptCode}.assetBookCode`).d('资产帐簿')}</span>
                    </Row>
                    <Row style={{ fontWeight: 'bold' }}>{dataSource.assetBookCode}</Row>
                  </Col>
                  <Col span={7}>
                    <Row>
                      <span>{intl.get(`${commonPromptCode}.assetCatalogId`).d('资产目录')}</span>
                    </Row>
                    <Row style={{ fontWeight: 'bold' }}>{dataSource.assetCatalogName}</Row>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Divider style={{ marginTop: 5, marginBottom: 0 }} />
          </React.Fragment>
        ) : (
          ''
        )}
        <Tabs defaultActiveKey="basicTab">
          <Tabs.TabPane
            tab={intl.get(`${commonPromptCode}.tab.basicTab`).d('基本')}
            key="basicTab"
            style={{ height: window.screen.availHeight / 2, overflow: 'auto' }}
          >
            <Collapse
              bordered={false}
              defaultActiveKey={['A', 'B', 'C']}
              className="form-collapse"
              onChange={this.handleChangeKey.bind(this)}
            >
              <Collapse.Panel
                showArrow={false}
                key="A"
                header={
                  <Fragment>
                    <h3>{intl.get(`${commonPromptCode}.panel.A`).d('基础信息')}</h3>
                    <a>
                      {collapseKeys.includes('A')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('A') ? 'up' : 'down'} />
                  </Fragment>
                }
              >
                <Form>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.fixedAssetName`).d('名称')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('fixedAssetName', {
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${commonPromptCode}.fixedAssetName`).d('名称'),
                                }),
                              },
                              {
                                max: 60,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 60,
                                }),
                              },
                            ],
                            initialValue: dataSource.fixedAssetName,
                          })(<Input />)
                        ) : (
                          <span>{dataSource.fixedAssetName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.financialNum`).d('固定资产编号')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('financialNum', {
                            rules: [
                              {
                                max: 60,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 60,
                                }),
                              },
                            ],
                            initialValue: dataSource.financialNum,
                          })(<Input />)
                        ) : (
                          <span>{dataSource.financialNum}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.transferDate`).d('转固日期')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('transferDate', {
                            initialValue:
                              !isUndefined(dataSource.transferDate) &&
                              !isNull(dataSource.transferDate) &&
                              !isEmpty(dataSource.transferDate)
                                ? moment(dataSource.transferDate, getDateFormat())
                                : null,
                            rules: [],
                          })(
                            <DatePicker
                              placeholder=""
                              style={{ width: '100%' }}
                              format={getDateFormat()}
                            />
                          )
                        ) : (
                          <span>{dateRender(dataSource.transferDate)}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.assetBookCode`).d('资产帐簿')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('assetBookCode', {
                            rules: [
                              {
                                max: 60,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 60,
                                }),
                              },
                            ],
                            initialValue: dataSource.assetBookCode,
                          })(<Input />)
                        ) : (
                          <span>{dataSource.assetBookCode}</span>
                        )}
                      </Form.Item>
                      {/* <Form.Item
                        label={intl.get(`${commonPromptCode}.assetBookCode`).d('资产帐簿')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {getFieldDecorator('assetBookCode', {
                          initialValue: dataSource.assetBookCode,
                          rules: [
                            {
                              required: true,
                              message: intl.get('hzero.common.validation.notNull', {
                                name: intl.get(`${commonPromptCode}.assetBookCode`).d('资产帐簿'),
                              }),
                            },
                          ],
                        })(
                          <Lov
                            code="AMDM.ORGANIZATION"
                            queryParams={{ organizationId: tenantId }}
                            textValue={dataSource.assetBookMeaning}
                          />
                        )}
                      </Form.Item> */}
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.assetCatalogId`).d('资产目录')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('assetCatalogId', {
                            initialValue: dataSource.assetCatalogId,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl
                                    .get(`${commonPromptCode}.assetCatalogId`)
                                    .d('资产目录'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              code="AFAM.ASSET_CATALOG"
                              queryParams={{ tenantId }}
                              textValue={dataSource.assetCatalogName}
                            />
                          )
                        ) : (
                          <span>{dataSource.assetCatalogName}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col span={22}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.description`).d('描述')}
                        {...longFormLayout}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('description', {
                            initialValue: dataSource.description,
                            rules: [
                              {
                                max: 240,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 240,
                                }),
                              },
                            ],
                          })(<Input />)
                        ) : (
                          <span>{dataSource.description}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Collapse.Panel>
              <Collapse.Panel
                showArrow={false}
                key="B"
                header={
                  <Fragment>
                    <h3>{intl.get(`${commonPromptCode}.panel.B`).d('折旧方法')}</h3>
                    <a>
                      {collapseKeys.includes('B')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('B') ? 'up' : 'down'} />
                  </Fragment>
                }
              >
                <Form>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl
                          .get(`${commonPromptCode}.depreciationStartDate`)
                          .d('折旧起始日期')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('depreciationStartDate', {
                            initialValue:
                              !isUndefined(dataSource.depreciationStartDate) &&
                              !isNull(dataSource.depreciationStartDate) &&
                              !isEmpty(dataSource.depreciationStartDate)
                                ? moment(dataSource.depreciationStartDate, getDateFormat())
                                : null,
                            rules: [],
                          })(
                            <DatePicker
                              placeholder=""
                              style={{ width: '100%' }}
                              format={getDateFormat()}
                            />
                          )
                        ) : (
                          <span>{dateRender(dataSource.depreciationStartDate)}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.depreciationMouth`).d('折旧月份')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('depreciationMouth', {
                            rules: [],
                            initialValue: dataSource.depreciationMouth,
                          })(<InputNumber precision={0} />)
                        ) : (
                          <span>{dataSource.depreciationMouth}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.depreciationTypeCode`).d('折旧类型')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('depreciationTypeCode', {
                            initialValue: dataSource.depreciationTypeCode,
                            rules: [],
                          })(
                            <Select>
                              {depreciationTypeCodeMap.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )
                        ) : (
                          <span>{dataSource.depreciationTypeCodeMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.residualValueRate`).d('残值率(%)')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('residualValueRate', {
                            rules: [],
                            initialValue: dataSource.residualValueRate,
                          })(<InputNumber precision={2} />)
                        ) : (
                          <span>{dataSource.residualValueRate}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Collapse.Panel>
              <Collapse.Panel
                showArrow={false}
                key="C"
                header={
                  <Fragment>
                    <h3>{intl.get(`${commonPromptCode}.panel.C`).d('固定资产价值')}</h3>
                    <a>
                      {collapseKeys.includes('C')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('C') ? 'up' : 'down'} />
                  </Fragment>
                }
              >
                <Form>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.initOriginalValue`).d('初始原值')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        <span>{dataSource.initOriginalValue}</span>
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.currentOriginalValue`).d('当前原值')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        <span>{dataSource.currentOriginalValue}</span>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl
                          .get(`${commonPromptCode}.accumulatedDepreciation`)
                          .d('累计折旧')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        <span>{dataSource.accumulatedDepreciation}</span>
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.YTDDepreciation`).d('YTD折旧')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        <span>{dataSource.YTDDepreciation}</span>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.netValue`).d('净值')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        <span>{dataSource.netValue}</span>
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.residualValue`).d('残值')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        <span>{dataSource.residualValue}</span>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Collapse.Panel>
            </Collapse>
          </Tabs.TabPane>
          {!isNew ? null : (
            <Tabs.TabPane
              tab={intl.get(`${commonPromptCode}.panel.D`).d('价值变动')}
              key="changeTab"
            >
              <Collapse
                bordered={false}
                defaultActiveKey={['D']}
                className="associated-collapse"
                onChange={this.handleChangeKey.bind(this)}
              >
                <Collapse.Panel
                  showArrow={false}
                  key="D"
                  header={
                    <Fragment>
                      <h3>{intl.get(`${commonPromptCode}.panel.D`).d('价值变动')}</h3>
                      <a>
                        {collapseKeys.includes('D')
                          ? intl.get(`hzero.common.button.up`).d('收起')
                          : intl.get(`hzero.common.button.expand`).d('展开')}
                      </a>
                      <Icon type={collapseKeys.includes('D') ? 'up' : 'down'} />
                    </Fragment>
                  }
                >
                  <Row style={{ margin: '10px' }}>
                    <Col className="search-btn-more" style={displayFlag}>
                      <Button
                        icon="plus"
                        type="primary"
                        style={{ marginRight: '10px' }}
                        onClick={this.showCreateModal}
                      >
                        {intl.get('hzero.common.button.add').d('新增')}
                      </Button>
                      <Button
                        icon="delete"
                        disabled={isEmpty(selectedRowKeys)}
                        onClick={() => this.handleDelete()}
                      >
                        {intl.get('hzero.common.button.delete').d('删除')}
                      </Button>
                    </Col>
                  </Row>
                  <DetailChangeLines {...detailChangeLinesProps} />
                  <DetailChangeLinesDrawer {...drawerProps} />
                  <LineChart {...lineChartProps} />
                </Collapse.Panel>
              </Collapse>
            </Tabs.TabPane>
          )}
        </Tabs>
      </React.Fragment>
    );
  }
}
export default FixedAssetsDetail;
