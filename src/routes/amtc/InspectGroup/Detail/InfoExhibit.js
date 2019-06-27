import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators/index';
import {
  Collapse,
  Form,
  Input,
  Row,
  Col,
  Icon,
  Button,
  Divider,
  Tabs,
  InputNumber,
  Select,
  Modal,
} from 'hzero-ui';
import { isUndefined } from 'lodash';
import { routerRedux } from 'dva/router';
import intl from 'utils/intl';
import notification from 'utils/notification';
import {
  EDIT_FORM_ITEM_LAYOUT,
  EDIT_FORM_ROW_LAYOUT,
  FORM_COL_3_LAYOUT,
  EDIT_FORM_ITEM_LAYOUT_COL_3,
} from 'utils/constants';
import Lov from 'components/Lov';
import CheckLists from './CheckLists';

const { TextArea } = Input;

@Form.create({ fieldNameProp: null })
class InfoExhibit extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      collapseKeys: ['A', 'B', 'C'],
      defaultItem: {
        mustCheckFlag: 0,
        defaultShowFlag: '1',
      },
    };
  }

  componentDidMount() {
    const { onRefresh } = this.props;
    onRefresh();
  }

  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }

  /**
   * 新增标准检查项
   */
  @Bind()
  handleAddCheckLists() {
    const { defaultItem } = this.state;
    this.setState({ defaultItem });
  }

  /**
   *  @function handleLinkToDetail - 跳转检查项
   */
  @Bind()
  handleLinkToDetail(record) {
    const { groupId, dispatch } = this.props;
    const linkUrl = isUndefined(record.checklistId) ? 'create' : `detail/${record.checklistId}`;
    dispatch(
      routerRedux.push({
        pathname: `/amtc/inspect-group/${groupId}/inspect-group/${linkUrl}`,
      })
    );
  }

  /**
   * 清除行
   */
  @Bind()
  handleClearLine(record) {
    const { dispatch, checklist } = this.props;
    const newList = checklist.filter(item => item.checklistId !== record.checklistId);
    dispatch({
      type: 'inspectGroup/updateState',
      payload: {
        checklist: newList,
      },
    });
  }
  /**
   * 删除行
   */
  @Bind()
  handleDeleteLine(record) {
    const { dispatch, checklist } = this.props;
    const messagePrompt = 'amtc.inspectGroup.view.message';
    Modal.confirm({
      content: intl.get(`${messagePrompt}.title.content`).d('确定删除吗？'),
      onOk() {
        dispatch({
          type: 'inspectGroup/deleteChecklist',
          payload: { ...record },
        }).then(res => {
          if (res) {
            notification.success();
            const newList = checklist.filter(item => item.checklistId !== record.checklistId);
            dispatch({
              type: 'inspectGroup/updateState',
              payload: {
                checklist: newList,
              },
            });
          }
        });
      },
    });
  }

  render() {
    const {
      isNew,
      editFlag,
      tenantId,
      treeList,
      dataSource,
      loading,
      expandedRowKeys,
      checkGroupTypeList,
      onExpand,
      form: { getFieldDecorator },
    } = this.props;
    const { collapseKeys = [] } = this.state;
    const prefix = `amtc.checkLists.view.message`;
    const modelPrompt = 'amtc.checkLists.model.checkLists';
    const detailListProps = {
      loading,
      tenantId,
      editFlag,
      onExpand,
      expandedRowKeys,
      dataSource: treeList,
      onEdit: this.handleLinkToDetail,
      onCancelLine: this.handleClearLine,
      onDeleteLine: this.handleDeleteLine,
    };
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
                  <span style={{ fontSize: 18, fontWeight: 'bold' }}>{dataSource.groupName}</span>
                </Row>
                <Row>
                  <Col span={7}>
                    <Row>
                      <span>{intl.get(`${modelPrompt}.groupClassCode`).d('组类别')}</span>
                    </Row>
                    <Row style={{ fontWeight: 'bold' }}>{dataSource.groupClassCode}</Row>
                  </Col>
                  <Col span={7}>
                    <Row>
                      <span>{intl.get(`${modelPrompt}.maintSites`).d('服务区域')}</span>
                    </Row>
                    <Row style={{ fontWeight: 'bold' }}>{dataSource.maintSitesMeaning}</Row>
                  </Col>
                  <Col span={7}>
                    <Row>
                      <span>{intl.get(`${modelPrompt}.groupSeq`).d('序号')}</span>
                    </Row>
                    <Row style={{ fontWeight: 'bold' }}>{dataSource.groupSeq}</Row>
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
            tab={intl.get(`${modelPrompt}.tab.basicTab`).d('基本')}
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
                    <h3>{intl.get(`${prefix}.basicInfo`).d('基础信息')}</h3>
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
                        label={intl.get(`${modelPrompt}.groupClassCode`).d('组类别')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('groupClassCode', {
                            initialValue: dataSource.groupClassCodeMeaning,
                          })(<Input />)
                        ) : (
                          <span>{dataSource.groupClassCodeMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.maintSites`).d('服务区域')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('maintSitesId', {
                            initialValue: dataSource.maintSitesId,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${modelPrompt}.maintSites`).d('服务区域'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              code="AMDM.ASSET_MAINT_SITE"
                              queryParams={{ organizationId: tenantId }}
                              textValue={dataSource.maintSitesMeaning}
                            />
                          )
                        ) : (
                          <span>{dataSource.maintSitesMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.groupSeq`).d('序号')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('groupSeq', {
                            initialValue: dataSource.groupSeq,
                          })(<InputNumber min={0} />)
                        ) : (
                          <span>{dataSource.groupSeq}</span>
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
                        label={intl.get(`${modelPrompt}.groupName`).d('检查组名称')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('groupName', {
                            initialValue: dataSource.groupName,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${modelPrompt}.groupName`).d('检查组名称'),
                                }),
                              },
                            ],
                          })(<Input />)
                        ) : (
                          <span>{dataSource.groupName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`amtc.common.model.groupTypeCode`).d('检查组类型')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('groupTypeCode', {
                            initialValue: dataSource.groupTypeCode,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${modelPrompt}.groupTypeCode`).d('检查组类型'),
                                }),
                              },
                            ],
                          })(
                            <Select allowClear>
                              {checkGroupTypeList.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )
                        ) : (
                          <span>{dataSource.groupTypeCodeMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.org`).d('适用组织')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('orgId', {
                            initialValue: dataSource.orgId,
                          })(
                            <Lov
                              code="AMDM.ORGANIZATION"
                              queryParams={{ organizationId: tenantId }}
                              textValue={dataSource.orgMeaning}
                            />
                          )
                        ) : (
                          <span>{dataSource.orgMeaning}</span>
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
                        label={intl.get(`${modelPrompt}.description`).d('描述')}
                        {...EDIT_FORM_ITEM_LAYOUT_COL_3}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('description', {
                            initialValue: dataSource.description,
                          })(<TextArea rows={2} />)
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
                    <h3>{intl.get(`${prefix}.panel.B`).d('作业对象')}</h3>
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
                        label={intl.get(`${modelPrompt}.assetLocation`).d('适用位置')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('assetLocationId', {
                            initialValue: dataSource.assetLocationId,
                          })(
                            <Lov
                              code="AMDM.LOCATIONS"
                              queryParams={{ organizationId: tenantId }}
                              textValue={dataSource.assetLocationName}
                            />
                          )
                        ) : (
                          <span>{dataSource.assetLocationName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.assetSet`).d('适用资产组')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('assetSetId', {
                            initialValue: dataSource.assetSetId,
                          })(
                            <Lov
                              code="AAFM.ASSET_SET"
                              queryParams={{ organizationId: tenantId }}
                              textValue={dataSource.assetSetName}
                            />
                          )
                        ) : (
                          <span>{dataSource.assetSetName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.asset`).d('适用设备/编号')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('assetId', {
                            initialValue: dataSource.assetId,
                          })(
                            <Lov
                              code="AAFM.ASSETS"
                              queryParams={{ organizationId: tenantId }}
                              textValue={dataSource.assetName}
                            />
                          )
                        ) : (
                          <span>{dataSource.assetName}</span>
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
                        label={intl.get(`${modelPrompt}.assetRoute`).d('适用资产路线')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('assetRouteId', {
                            initialValue: dataSource.assetRouteId,
                          })(
                            <Lov
                              code="AMTC.ASSET_AOUNT"
                              queryParams={{ organizationId: tenantId }}
                              textValue={dataSource.assetRouteName}
                            />
                          )
                        ) : (
                          <span>{dataSource.assetRouteName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.standardTotalScore`).d('标准总分')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('standardTotalScore', {
                            initialValue: dataSource.standardTotalScore,
                          })(<InputNumber />)
                        ) : (
                          <span>{dataSource.standardTotalScore}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.woType`).d('事件类型')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('woTypeId', {
                            initialValue: dataSource.woTypeId,
                          })(
                            <Lov
                              code="AMTC.WORKORDERTYPES"
                              queryParams={{ organizationId: tenantId }}
                              textValue={dataSource.woTypeName}
                            />
                          )
                        ) : (
                          <span>{dataSource.woTypeName}</span>
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
                    <h3>{intl.get(`${prefix}.panel.C`).d('标准检查项')}</h3>
                    <a>
                      {collapseKeys.includes('C')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('C') ? 'up' : 'down'} />
                  </Fragment>
                }
              >
                {isNew ? (
                  <React.Fragment>
                    <Row style={{ margin: '10px' }}>
                      <Col>
                        <Button icon="plus" type="primary" onClick={this.handleLinkToDetail}>
                          {intl.get(`amtc.InspectGroup.view.button.add`).d('新增')}
                        </Button>
                      </Col>
                    </Row>
                    <CheckLists {...detailListProps} />
                  </React.Fragment>
                ) : (
                  ''
                )}
              </Collapse.Panel>
            </Collapse>
          </Tabs.TabPane>
        </Tabs>
      </React.Fragment>
    );
  }
}
export default InfoExhibit;
