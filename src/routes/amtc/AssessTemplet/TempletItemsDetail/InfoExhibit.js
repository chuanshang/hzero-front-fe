import React, { Component, Fragment } from 'react';
import {
  Collapse,
  Form,
  Input,
  Row,
  Col,
  Icon,
  Button,
  Modal,
  InputNumber,
  Select,
} from 'hzero-ui';
import Switch from 'components/Switch';
import intl from 'utils/intl';
import uuidv4 from 'uuid/v4';
import Lov from 'components/Lov';
import { isUndefined } from 'lodash';
import notification from 'utils/notification';
import { Bind } from 'lodash-decorators/index';
import TempletItemsList from './TempletProblems';

@Form.create({ fieldNameProp: null })
class InfoExhibit extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      collapseKeys: ['A', 'B', 'C'],
      isNumber: false,
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
   * 行编辑
   * @param current
   * @param flag
   */
  @Bind()
  handleEditLine(current = {}, flag = false) {
    const { dispatch, templetProblems } = this.props;
    const newList = templetProblems.map(item =>
      item.templetProblemId === current.templetProblemId
        ? { ...item, _status: flag ? 'update' : '' }
        : item
    );
    dispatch({
      type: 'assessTemplet/updateState',
      payload: {
        templetProblems: newList,
      },
    });
  }

  /**
   * 行取消
   * @param current
   */
  @Bind()
  handleCancelLine(current = {}) {
    const { dispatch, templetProblems } = this.props;
    const newList = templetProblems.filter(
      item => item.templetProblemId !== current.templetProblemId
    );
    dispatch({
      type: 'assessTemplet/updateState',
      payload: {
        templetProblems: newList,
      },
    });
  }

  /**
   * 行删除
   * @param record
   */
  @Bind()
  handleDeleteContent(record) {
    const { dispatch, tenantId, dataSource } = this.props;
    const messagePrompt = 'amtc.assessTemplet.view.message';
    Modal.confirm({
      content: intl.get(`${messagePrompt}.title.content`).d('确定删除吗？'),
      onOk() {
        dispatch({
          type: 'assessTemplet/deleteProblem',
          payload: { ...record },
        }).then(res => {
          if (res) {
            notification.success();
            dispatch({
              type: 'assessTemplet/queryTempletProblems',
              payload: {
                tenantId,
                templetItemId: dataSource.templetItemId,
              },
            });
          }
        });
      },
    });
  }

  /**
   * 新建对象
   */
  @Bind()
  handleNewLine() {
    const { dispatch, tenantId, dataSource, templetProblems } = this.props;
    const newItem = {
      templetProblemId: uuidv4(),
      tenantId,
      templetItemId: dataSource.templetItemslistId,
      assessTempletId: dataSource.assessTempletId,
      enabledFlag: 1,
      _status: 'create',
    };
    dispatch({
      type: 'assessTemplet/updateState',
      payload: {
        templetProblems: [...templetProblems, newItem],
      },
    });
  }

  handleChange(value) {
    if (value === 'NUMBER') {
      this.setState({ isNumber: true });
    } else {
      this.setState({ isNumber: false });
    }
  }

  render() {
    const {
      tenantId,
      dataSource,
      templetProblems,
      detailPagination,
      yesOrNoMap,
      startMap,
      relateObjectCodeMap,
      valueTypeCodeMap,
      fetchTempletProblemsLoading,
      form: { getFieldDecorator, getFieldsValue },
    } = this.props;
    const { collapseKeys = [], isNumber } = this.state;
    const prefix = `amtc.assessTemplet.view.message`;
    const listProps = {
      loading: fetchTempletProblemsLoading,
      relateObjectCodeMap,
      tenantId,
      dataSource: templetProblems,
      pagination: detailPagination,
      onEditLine: this.handleEditLine,
      onDeleteLine: this.handleDeleteContent,
      onCancelLine: this.handleCancelLine,
    };
    const formLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const switchLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const formLongLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 13 },
    };
    return (
      <Collapse
        bordered={false}
        defaultActiveKey={['A', 'B', 'C']}
        className="associated-collapse"
        onChange={this.handleChangeKey.bind(this)}
      >
        <Collapse.Panel
          showArrow={false}
          key="A"
          header={
            <Fragment>
              <Icon type={collapseKeys.includes('A') ? 'minus' : 'plus'} />
              <h3>{intl.get(`${prefix}.basicInfo`).d('基础信息')}</h3>
            </Fragment>
          }
        >
          <Form>
            <Row>
              <Col span={8}>
                <Form.Item
                  label={intl.get(`amtc.common.model.templetItemSeq`).d('序号')}
                  {...formLayout}
                >
                  {getFieldDecorator('templetItemSeq', {
                    initialValue: dataSource.templetItemSeq,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`amtc.common.model.templetItemSeq`).d('序号'),
                        }),
                      },
                    ],
                  })(<InputNumber style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`amtc.common.model.templetItemName`).d('名称')}
                  {...formLayout}
                >
                  {getFieldDecorator('templetItemName', {
                    initialValue: dataSource.templetItemName,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`amtc.common.model.templetItemName`).d('名称'),
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item
                  label={intl.get(`amtc.common.model.methodCode`).d('检测方式')}
                  {...formLayout}
                >
                  {getFieldDecorator('methodCode', {
                    initialValue: dataSource.methodCode,
                    rules: [],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`amtc.common.model.standardReference`).d('参考标准')}
                  {...formLayout}
                >
                  {getFieldDecorator('standardReference', {
                    initialValue: dataSource.standardReference,
                    rules: [],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`amtc.common.model.valueTypeCode`).d('字段类型')}
                  {...formLayout}
                >
                  {getFieldDecorator('valueTypeCode', {
                    initialValue: isUndefined(dataSource.valueTypeCode)
                      ? 'YESORNO'
                      : dataSource.valueTypeCode,
                    rules: [],
                  })(
                    <Select onChange={this.handleChange.bind(this)}>
                      {valueTypeCodeMap.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item
                  label={intl.get(`amtc.common.model.parentActChecklistsId`).d('父项')}
                  {...formLayout}
                >
                  {getFieldDecorator('parentItemId', {
                    initialValue: dataSource.parentItemId,
                  })(
                    <Lov
                      code="AMTC.ASSESS_TEMPLET_ITEMS"
                      queryParams={{
                        organizationId: tenantId,
                        templteId: dataSource.assessTempletId,
                      }}
                      textValue={dataSource.parentItemName}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`amtc.common.model.mustCheckFlag`).d('是否必检')}
                  {...switchLayout}
                >
                  {getFieldDecorator('mustCheckFlag', {
                    initialValue: isUndefined(dataSource.mustCheckFlag)
                      ? '1'
                      : dataSource.mustCheckFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`amtc.common.model.showTableCode`).d('是否展示在表头')}
                  {...formLayout}
                >
                  {getFieldDecorator('showTableCode', {
                    initialValue: isUndefined(dataSource.showTableCode)
                      ? '0'
                      : dataSource.showTableCode,
                    rules: [],
                  })(
                    <Select>
                      {yesOrNoMap.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            {getFieldsValue().valueTypeCode === 'LISTOFVALUE' ? (
              <Row>
                <Col span={8}>
                  <Form.Item
                    label={intl.get(`amtc.common.model.listName`).d('值列表')}
                    {...formLayout}
                  >
                    {getFieldDecorator('listName', {
                      initialValue: isUndefined(dataSource.listName) ? '0' : dataSource.listName,
                      rules: [],
                    })(
                      <Select>
                        {yesOrNoMap.map(i => (
                          <Select.Option key={i.value}>{i.meaning}</Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            ) : null}
            {getFieldsValue().valueTypeCode === 'START' ? (
              <Row>
                <Col span={8}>
                  <Form.Item
                    label={intl.get(`amtc.common.model.showStarCode`).d('最高星级')}
                    {...formLayout}
                  >
                    {getFieldDecorator('showStarCode', {
                      initialValue: dataSource.showStarCode,
                      rules: [],
                    })(
                      <Select>
                        {startMap.map(i => (
                          <Select.Option key={i.value}>{i.meaning}</Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            ) : null}
            <Row>
              <Col span={24}>
                <Form.Item
                  label={intl.get(`amtc.common.model.showTableCode`).d('描述')}
                  {...formLongLayout}
                >
                  {getFieldDecorator('description', {
                    initialValue: dataSource.description,
                  })(<Input.TextArea rows={3} />)}
                </Form.Item>
              </Col>
            </Row>
            {getFieldsValue().valueTypeCode === 'YESORNO' ? (
              <Row>
                <Col span={8}>
                  <Form.Item
                    label={intl.get(`amtc.common.model.defaultShowFlag`).d('默认拍照类型')}
                    {...formLayout}
                  >
                    {getFieldDecorator('defaultShowFlag', {
                      initialValue: isUndefined(dataSource.defaultShowFlag)
                        ? '0'
                        : dataSource.defaultShowFlag,
                      rules: [],
                    })(
                      <Select>
                        {yesOrNoMap.map(i => (
                          <Select.Option key={i.value}>{i.meaning}</Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            ) : null}
            {getFieldsValue().valueTypeCode === 'TEXT' ? (
              <Row>
                <Col span={8}>
                  <Form.Item
                    label={intl.get(`amtc.common.model.minimumWordLimit`).d('最低字数限制')}
                    {...formLayout}
                  >
                    {getFieldDecorator('minimumWordLimit', {
                      initialValue: dataSource.minimumWordLimit,
                      rules: [],
                    })(<Input />)}
                  </Form.Item>
                </Col>
              </Row>
            ) : null}
          </Form>
        </Collapse.Panel>
        {isNumber ? (
          <Collapse.Panel
            showArrow={false}
            key="B"
            header={
              <Fragment>
                <Icon type={collapseKeys.includes('B') ? 'minus' : 'plus'} />
                <h3>{intl.get(`${prefix}.attributeLine`).d('数字型字段参数')}</h3>
              </Fragment>
            }
          >
            <Form>
              <Row>
                <Col span={8}>
                  <Form.Item
                    label={intl.get(`amtc.common.model.targetValue`).d('目标值')}
                    {...formLayout}
                  >
                    {getFieldDecorator('targetValue', {
                      initialValue: dataSource.targetValue,
                      rules: [],
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={8} className="ant-left-48">
                  <Form.Item
                    label={intl.get(`amtc.common.model.numUomCode`).d('数值单位')}
                    {...formLayout}
                  >
                    {getFieldDecorator('numUomCode', {
                      initialValue: dataSource.numUomCode,
                    })(
                      <Lov
                        code=""
                        queryParams={{ organizationId: tenantId }}
                        textValue={dataSource.numUomName}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Collapse.Panel>
        ) : null}
        <Collapse.Panel
          showArrow={false}
          key="C"
          header={
            <Fragment>
              <Icon type={collapseKeys.includes('C') ? 'minus' : 'plus'} />
              <h3>{intl.get(`${prefix}.attributeLine`).d('标准问题清单')}</h3>
            </Fragment>
          }
        >
          <Row style={{ margin: '10px' }}>
            <Col>
              <Button icon="plus" type="primary" onClick={this.handleNewLine}>
                {intl.get(`amtc.workCenter.view.button.add`).d('新增')}
              </Button>
            </Col>
          </Row>
          <TempletItemsList {...listProps} />
        </Collapse.Panel>
      </Collapse>
    );
  }
}
export default InfoExhibit;
