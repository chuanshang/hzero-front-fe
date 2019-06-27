import React, { Component, Fragment } from 'react';
import { Form, Row, Col, Input, Collapse, Icon, DatePicker, Button } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { isUndefined } from 'lodash';
import uuidv4 from 'uuid/v4';
import { Bind } from 'lodash-decorators/index';
import notification from 'utils/notification';
import moment from 'moment';
import { getCurrentOrganizationId, getDateTimeFormat } from 'utils/utils';
import ListTable from './ListTable';

const { TextArea } = Input;

@Form.create({ fieldNameProp: null })
class MaterialTsTypeDetail extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      collapseKeys: ['A', 'B'],
      ownName: '',
    };
  }
  componentDidMount() {}

  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'materialTsMulti/updateState',
      payload: {
        innerList: [],
      },
    });
  }

  // 新建
  @Bind()
  handleNewLine() {
    const {
      dispatch,
      tenantId,
      materialTsMulti,
      defaultMaterialTsMulti: { lineMaxNum },
      indexnum,
      indexnumAdd,
    } = this.props;
    const { innerList } = materialTsMulti;
    const newItem = {
      rownum: indexnum + 1 * lineMaxNum,
      translineId: uuidv4(),
      tenantId,
      itemId: '',
      martialnum: '',
      fromMaintsitesId: '',
      toMaintsitesId: '',
      primaryUomCode: '',
      primaryQty: '',
      lotNum: '',
      fromLocationId: '',
      fromLocatorId: '',
      toLocationId: '',
      toLocatorId: '',
      woopId: '',
      description: '',
      _status: 'create',
    };
    indexnumAdd();
    dispatch({
      type: 'materialTsMulti/updateState',
      payload: {
        innerList: [newItem, ...innerList],
      },
    });
  }

  /**
   * 行编辑
   * @param current
   * @param flag
   */
  @Bind()
  handleEditLine(current = {}, flag = false) {
    const {
      dispatch,
      materialTsMulti: { innerList = [] },
    } = this.props;
    const newList = innerList.map(item =>
      item.translineId === current.translineId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'materialTsMulti/updateState',
      payload: {
        innerList: newList,
      },
    });
  }

  /**
   * 行取消
   * @param current
   */
  @Bind()
  handleCancelLine(current = {}) {
    const {
      dispatch,
      materialTsMulti: { innerList = [] },
    } = this.props;
    const newList = innerList.filter(item => item.translineId !== current.translineId);
    dispatch({
      type: 'materialTsMulti/updateState',
      payload: {
        innerList: newList,
      },
    });
  }

  /**
   * 行删除
   * @param record
   */
  @Bind()
  handleDeleteContent(record) {
    const { dispatch, tenantId } = this.props;
    const { $form, _status, ...otherProps } = record;
    dispatch({
      type: 'materialTsMulti/deleteInnerRow',
      payload: { tenantId, ...otherProps },
    }).then(res => {
      if (res) {
        notification.success();
      }
    });
  }

  @Bind()
  handleLOVOk(record) {
    this.setState({ ownName: record.realName });
  }

  render() {
    const {
      form: { getFieldDecorator },
      defaultMaterialTsMulti,
      detailId,
      loading,
      onChange,
      materialTsMulti: { innerList = [], innerpagination = {} },
      user,
      isEditable,
      deleteinnerrowloading,
    } = this.props;
    let isNew = false;
    if (isUndefined(detailId)) {
      isNew = true;
    }
    const { collapseKeys = [], ownName } = this.state;
    const formLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const longFormLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    const listProp = {
      dataSource: innerList,
      innerpagination,
      loading,
      onChange,
      onCancelLine: this.handleCancelLine,
      onEditLine: this.handleEditLine,
      onDeleteLine: this.handleDeleteContent,
      detailId,
      isEditable,
      deleteinnerrowloading,
    };
    return (
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
              <h3>基础信息</h3>
            </Fragment>
          }
        >
          <Form>
            <Row>
              <Col span={8}>
                <Form.Item label="事务处理批号" {...formLayout}>
                  {isEditable || isNew ? (
                    getFieldDecorator('transbatchNum', {
                      initialValue: isUndefined(detailId)
                        ? ''
                        : defaultMaterialTsMulti.transbatchNum,
                    })(<Input disabled />)
                  ) : (
                    <span>{defaultMaterialTsMulti.transbatchNum}</span>
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="服务区域" {...formLayout}>
                  {isEditable || isNew ? (
                    getFieldDecorator('maintSitesId', {
                      initialValue: isUndefined(detailId)
                        ? ''
                        : defaultMaterialTsMulti.maintSitesId,
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: '服务区域',
                          }),
                        },
                      ],
                    })(
                      <Lov
                        code="AMDM.ASSET_MAINT_SITE"
                        textValue={
                          isUndefined(detailId) ? '' : defaultMaterialTsMulti.maintSitesName
                        }
                      />
                    )
                  ) : (
                    <span>{defaultMaterialTsMulti.maintSitesName}</span>
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="处理类型" {...formLayout}>
                  {isEditable || isNew ? (
                    getFieldDecorator('transtypeId', {
                      initialValue: isUndefined(detailId) ? '' : defaultMaterialTsMulti.transtypeId,
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: '处理类型',
                          }),
                        },
                      ],
                    })(
                      <Lov
                        code="AAFM.ASSET_CLASS"
                        textValue={
                          isUndefined(detailId) ? '' : defaultMaterialTsMulti.transtypeName
                        }
                      />
                    )
                  ) : (
                    <span>{defaultMaterialTsMulti.transtypeName}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="状态" {...formLayout}>
                  {isEditable || isNew ? (
                    getFieldDecorator('transStatus', {
                      initialValue: isUndefined(detailId)
                        ? '拟定'
                        : defaultMaterialTsMulti.transStatus,
                      rules: [],
                    })(<Input disabled />)
                  ) : (
                    <span>{defaultMaterialTsMulti.transStatus}</span>
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="处理时间" {...formLayout}>
                  {isEditable || isNew ? (
                    getFieldDecorator('transDate', {
                      initialValue: isUndefined(detailId)
                        ? moment(moment().format(getDateTimeFormat()), getDateTimeFormat())
                        : moment(defaultMaterialTsMulti.transDate, getDateTimeFormat()),
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: '处理时间',
                          }),
                        },
                      ],
                    })(
                      <DatePicker
                        placeholder=""
                        style={{ width: '100%' }}
                        format={getDateTimeFormat()}
                        showTime
                      />
                    )
                  ) : (
                    <span>{defaultMaterialTsMulti.transDate}</span>
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="工单" {...formLayout}>
                  {isEditable || isNew ? (
                    getFieldDecorator('woId', {
                      initialValue: isUndefined(detailId) ? '' : defaultMaterialTsMulti.woId,
                    })(
                      <Lov
                        code="AMTC.WORKORDER_PENDING"
                        textValue={isUndefined(detailId) ? '' : defaultMaterialTsMulti.woName}
                      />
                    )
                  ) : (
                    <span>{defaultMaterialTsMulti.woName}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="申请人" {...formLayout}>
                  {isEditable || isNew ? (
                    getFieldDecorator('applyName', {
                      initialValue: user.currentUser.realName,
                    })(<Input disabled />)
                  ) : (
                    <span>{defaultMaterialTsMulti.applyName}</span>
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="负责人" {...formLayout}>
                  {isEditable || isNew ? (
                    getFieldDecorator('ownerId', {
                      initialValue: isUndefined(detailId) ? '' : defaultMaterialTsMulti.ownerId,
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: '负责人',
                          }),
                        },
                      ],
                    })(
                      <Lov
                        code="HIAM.TENANT.USER"
                        textValue={
                          isUndefined(detailId) ? ownName : defaultMaterialTsMulti.ownerName
                        }
                        queryParams={{ organizationId: getCurrentOrganizationId() }}
                        onOk={this.handleLOVOk}
                        setTextFlag={ownName !== ''}
                      />
                    )
                  ) : (
                    <span>{defaultMaterialTsMulti.ownerName}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="说明" {...longFormLayout}>
                  {isEditable || isNew ? (
                    getFieldDecorator('description', {
                      initialValue: isUndefined(detailId) ? '' : defaultMaterialTsMulti.description,
                    })(<TextArea rows={3} />)
                  ) : (
                    <span>{defaultMaterialTsMulti.description}</span>
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
              <Icon type={collapseKeys.includes('B') ? 'minus' : 'plus'} />
              <h3>事务处理行信息</h3>
            </Fragment>
          }
        >
          <Row style={{ marginTop: 10, marginBottom: 10 }}>
            <Col offset={1}>
              <Button
                disabled={!isEditable && !isNew}
                style={
                  isEditable || isNew
                    ? { backgroundColor: 'rgb(24,144,255)', color: 'white' }
                    : {
                        backgroundColor: 'rgb(193,193,193)',
                        color: 'white',
                      }
                }
                onClick={this.handleNewLine}
              >
                新增
              </Button>
            </Col>
          </Row>
          <Row>
            <ListTable {...listProp} />
          </Row>
        </Collapse.Panel>
      </Collapse>
    );
  }
}
export default MaterialTsTypeDetail;
