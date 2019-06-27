import React, { Component, Fragment } from 'react';
import { Collapse, Form, Input, Row, Col, Icon, Button, Modal, Select, message } from 'hzero-ui';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators/index';
import TempletItemsList from './TempletItemsList';

@Form.create({ fieldNameProp: null })
class InfoExhibit extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      collapseKeys: ['A', 'B'],
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
   * 新建评估项关联对象
   */
  @Bind()
  handleNewLine() {
    const { dispatch, isNew, id } = this.props;
    if (isNew) {
      message.error('请先保存基础信息！');
    } else {
      dispatch(
        routerRedux.push({
          pathname: `/amtc/assess-templet/templet-items/create/${id}`,
        })
      );
    }
  }

  /**
   * 行编辑
   * @param current
   * @param flag
   */
  @Bind()
  handleEditLine(current = {}) {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/amtc/assess-templet/templet-items/detail/${current.templetItemId}`,
      })
    );
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
          type: 'assessTemplet/deleteTempletItems',
          payload: { ...record },
        }).then(res => {
          if (res) {
            notification.success();
            dispatch({
              type: 'assessTemplet/queryTempletItemsList',
              payload: {
                tenantId,
                templetId: dataSource.templetId,
              },
            });
          }
        });
      },
    });
  }

  render() {
    const {
      tenantId,
      dataSource,
      templetItemsList,
      templetItemsPagination,
      evaluationPointMap,
      form: { getFieldDecorator },
    } = this.props;
    const { fetchTempletItemsListLoading } = this.props;
    const { collapseKeys = [] } = this.state;
    const formLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const prefix = `amtc.assessTemplet.view.message`;
    const listProps = {
      tenantId,
      loading: fetchTempletItemsListLoading,
      dataSource: templetItemsList,
      pagination: templetItemsPagination,
      onEditLine: this.handleEditLine,
      onDeleteLine: this.handleDeleteContent,
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
              <h3>{intl.get(`${prefix}.basicInfo`).d('基础信息')}</h3>
            </Fragment>
          }
        >
          <Form>
            <Row>
              <Col span={8}>
                <Form.Item
                  label={intl.get(`amtc.common.model.templetName`).d('名称')}
                  {...formLayout}
                >
                  {getFieldDecorator('templetName', {
                    initialValue: dataSource.templetName,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`amtc.common.model.templetName`).d('名称'),
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`amtc.common.model.templetNum`).d('模板编号')}
                  {...formLayout}
                >
                  {getFieldDecorator('templetNum', {
                    initialValue: dataSource.templetNum,
                    rules: [],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item
                  label={intl.get(`amtc.common.model.assessTimeCode`).d('评价时点')}
                  {...formLayout}
                >
                  {getFieldDecorator('assessTimeCode', {
                    initialValue: dataSource.assessTimeCode,
                    rules: [],
                  })(
                    <Select>
                      {evaluationPointMap.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
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
              <h3>{intl.get(`${prefix}.attributeLine`).d('评价项')}</h3>
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
