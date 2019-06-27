import React, { PureComponent } from 'react';
import { Form, Modal, Row, Checkbox, Col, DatePicker, Tag, Radio } from 'hzero-ui';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { Bind } from 'lodash-decorators';
import { getDateFormat, getDateTimeFormat } from 'utils/utils';
import moment from 'moment';

@Form.create({ fieldNameProp: null })
class FilterModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      transactionTypes: [], // 事件处理类型
      selectedFields: [], // 已选字段
      pageFields: [], // 基础信息、跟踪和管理、属性描述、来源和日期字段
      checkedCommonFields: [], // 已选常用字段
      checkedPageFields: [], // 已选页签字段
    };
  }
  componentDidMount() {
    const { tag, onSearchTransactionTypes } = this.props;
    if (tag === 'event') {
      onSearchTransactionTypes();
    }
  }
  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    this.props.form.resetFields();
  }
  /**
   * 关闭
   */
  @Bind()
  handleClose() {
    this.props.onCancel();
    this.setState({
      transactionTypes: [],
      selectedFields: [],
      checkedCommonFields: [],
      checkedPageFields: [],
    });
  }
  /**
   * 选择字段后查询
   */
  @Bind()
  handleSearch() {
    const { form, tag, onSearchEvent, onSearchField } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        if (tag === 'event') {
          const { transactionTypes } = this.state;
          onSearchEvent({
            ...values,
            transactionTypeIdList: transactionTypes,
            createDateFrom: values.createDateFrom
              ? moment(values.createDateFrom).format(getDateTimeFormat())
              : null,
            createDateTo: values.createDateTo
              ? moment(values.createDateTo).format(getDateTimeFormat())
              : null,
          });
          this.handleClose();
        }
        if (tag === 'field') {
          const { selectedFields } = this.state;
          onSearchField({
            ...values,
            fieldSet: selectedFields,
            occurTimeFrom: values.occurTimeFrom
              ? moment(values.occurTimeFrom).format(getDateTimeFormat())
              : null,
            occurTimeTo: values.occurTimeTo
              ? moment(values.occurTimeTo).format(getDateTimeFormat())
              : null,
          });
          this.handleClose();
        }
      }
    });
  }
  /**
   * 获取事务类型列表
   */
  @Bind()
  handleGetSelectedTypes(checkedValues) {
    this.setState({ transactionTypes: checkedValues });
  }
  /**
   * 获取选中的常用字段列表
   */
  @Bind()
  handleGetCommonFields(checkedValues) {
    const { checkedPageFields } = this.state;
    this.setState({
      selectedFields: [...checkedPageFields, ...checkedValues],
      checkedCommonFields: checkedValues,
    });
  }
  /**
   * 获取选中的页签字段列表
   */
  @Bind()
  handleGetSelectedPageFields(checkedValues) {
    const { checkedCommonFields } = this.state;
    this.setState({
      selectedFields: [...checkedCommonFields, ...checkedValues],
      checkedPageFields: checkedValues,
    });
  }
  /**
   * radio改变触发
   */
  @Bind()
  handleRadioChange(e) {
    const { assetFields, checkedCommonFields = [] } = this.props;
    switch (e.target.value) {
      case 'basic':
        this.setState({ pageFields: assetFields.base_msg });
        break;
      case 'manage':
        this.setState({ pageFields: assetFields.manage_track });
        break;
      case 'attribute':
        this.setState({ pageFields: assetFields.attribute_des ? assetFields.attribute_des : [] });
        break;
      case 'source':
        this.setState({ pageFields: assetFields.source_track });
        break;
      default:
    }
    this.setState({
      selectedFields: checkedCommonFields,
      checkedPageFields: [],
    });
  }
  /**
   * 删除标签
   */
  @Bind()
  handleTagClose(val, e) {
    console.log(val);
    console.log(e);
  }

  render() {
    const commonFields = [
      { value: 'asset_status_id', meaning: '资产状态' },
      { value: 'using_org_id', meaning: '使用组织' },
      { value: 'owning_org_id', meaning: '所属组织' },
      { value: 'asset_location_id', meaning: '位置' },
    ];
    const prefix = 'aafm.equipmentAsset.model.equipment';
    const { selectedFields, pageFields } = this.state;
    const {
      tag,
      modalVisible,
      transactionTypes,
      defaultPageFields = [],
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const fields = [...commonFields, ...defaultPageFields, ...pageFields];
    const showedFields = isEmpty(pageFields) ? defaultPageFields : pageFields;
    return (
      <Modal
        destroyOnClose
        width={600}
        visible={modalVisible}
        onOk={this.handleSearch}
        okText={intl.get(`${prefix}.search`).d('查询')}
        onCancel={this.handleClose}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
      >
        <Form layout="inline" className="table-list-search">
          {tag === 'event' ? (
            <React.Fragment>
              <Row style={{ marginTop: 10, marginBottom: 10, fontSize: 13 }}>
                <span>{intl.get(`${prefix}.selectedTypes`).d('选择需要展示的事务处理类型')}</span>
              </Row>
              <Row offset={1}>
                <Checkbox.Group style={{ width: '100%' }} onChange={this.handleGetSelectedTypes}>
                  <Row>
                    {transactionTypes.map(item => (
                      <Col span={8} style={{ marginTop: 5, marginBottom: 5 }}>
                        <Checkbox value={item.value}>{item.meaning}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Row>
              <Row style={{ marginTop: 10, marginBottom: 10, fontSize: 13 }}>
                <span>{intl.get(`${prefix}.limitedTime`).d('限定需要展示的时间范围')}</span>
              </Row>
              <Row>
                <Col>
                  <Form.Item label={intl.get(`${prefix}.createDateFrom`).d('日期从')}>
                    {getFieldDecorator('createDateFrom', {})(
                      <DatePicker
                        placeholder=""
                        format={getDateFormat()}
                        style={{ width: '100%' }}
                        disabledDate={currentDate =>
                          getFieldValue('createDateTo') &&
                          moment(getFieldValue('createDateTo')).isBefore(currentDate, 'day')
                        }
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={intl.get(`${prefix}.createDateTo`).d('日期至')}>
                    {getFieldDecorator('createDateTo', {})(
                      <DatePicker
                        placeholder=""
                        format={getDateFormat()}
                        style={{ width: '100%' }}
                        disabledDate={currentDate =>
                          getFieldValue('createDateFrom') &&
                          moment(getFieldValue('createDateFrom')).isAfter(currentDate, 'day')
                        }
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Row style={{ marginTop: 10, marginBottom: 10, fontSize: 13 }}>
                <span>{intl.get(`${prefix}.commonFields`).d('常用字段')}</span>
              </Row>
              <Row>
                <Checkbox.Group style={{ width: '100%' }} onChange={this.handleGetCommonFields}>
                  <Row>
                    {commonFields.map(item => (
                      <Col span={6} style={{ marginTop: 5, marginBottom: 5 }}>
                        <Checkbox value={item.value}>{item.meaning}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Row>
              <Row style={{ marginTop: 10, marginBottom: 10, fontSize: 13 }}>
                <span>{intl.get(`${prefix}.page`).d('选择所属页签')}</span>
              </Row>
              <Row>
                <Radio.Group
                  defaultValue="basic"
                  style={{ width: '100%' }}
                  onChange={this.handleRadioChange}
                >
                  <Row>
                    <Col span={6}>
                      <Radio style={{ width: '100%' }} value="basic">
                        {intl.get(`${prefix}.basic`).d('基本信息')}
                      </Radio>
                    </Col>
                    <Col span={6}>
                      <Radio style={{ width: '100%' }} value="manage">
                        {intl.get(`${prefix}.manage`).d('管理和跟踪')}
                      </Radio>
                    </Col>
                    <Col span={6}>
                      <Radio style={{ width: '100%' }} value="attribute">
                        {intl.get(`${prefix}.attribute`).d('属性描述')}
                      </Radio>
                    </Col>
                    <Col span={6}>
                      <Radio style={{ width: '100%' }} value="source">
                        {intl.get(`${prefix}.source`).d('来源和跟踪')}
                      </Radio>
                    </Col>
                  </Row>
                </Radio.Group>
                <Row offset={1}>
                  <Checkbox.Group
                    style={{ width: '100%' }}
                    onChange={this.handleGetSelectedPageFields}
                  >
                    <Row>
                      {showedFields.map(item => (
                        <Col span={8} style={{ marginTop: 5, marginBottom: 5 }}>
                          <Checkbox value={item.value}>{item.meaning}</Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </Row>
              </Row>
              <Row style={{ marginTop: 10, marginBottom: 10, fontSize: 13 }}>
                <span>{intl.get(`${prefix}.limitedTime`).d('限定需要展示的时间范围')}</span>
              </Row>
              <Row>
                <Col>
                  <Form.Item label={intl.get(`${prefix}.occurTimeFrom`).d('日期从')}>
                    {getFieldDecorator('occurTimeFrom', {})(
                      <DatePicker
                        placeholder=""
                        format={getDateFormat()}
                        style={{ width: '100%' }}
                        disabledDate={currentDate =>
                          getFieldValue('occurTimeTo') &&
                          moment(getFieldValue('occurTimeTo')).isBefore(currentDate, 'day')
                        }
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={intl.get(`${prefix}.occurTimeTo`).d('日期至')}>
                    {getFieldDecorator('occurTimeTo', {})(
                      <DatePicker
                        placeholder=""
                        format={getDateFormat()}
                        style={{ width: '100%' }}
                        disabledDate={currentDate =>
                          getFieldValue('occurTimeFrom') &&
                          moment(getFieldValue('occurTimeFrom')).isAfter(currentDate, 'day')
                        }
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ marginTop: 10, marginBottom: 10, fontSize: 13 }}>
                <span>{intl.get(`${prefix}.selectedField`).d('已选字段')}</span>
              </Row>
              <Row>
                {selectedFields.map(item => {
                  const list = fields.filter(i => i.value === item);
                  return (
                    <Tag
                      closable
                      key={list[0].value}
                      onClose={this.handleTagClose}
                      color="#2db7f5"
                      style={{ marginBottom: 5 }}
                    >
                      {list[0].meaning}
                    </Tag>
                  );
                })}
              </Row>
            </React.Fragment>
          )}
        </Form>
      </Modal>
    );
  }
}
export default FilterModal;
