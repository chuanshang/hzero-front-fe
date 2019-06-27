import React, { Component } from 'react';
import { Tabs, Table, Button, Col, Row, Icon, Divider } from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { getDateFormat } from 'utils/utils';
import moment from 'moment';
import FilterModal from './FilterModal';

class AssetRecordTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      tag: 'event',
    };
  }
  /**
   * 获取事件或者字段的列表
   * @param {string} key - 事件or字段
   */
  @Bind()
  handleSearch(key) {
    const { onSearchField, onSearchEvent, onSearchAssetFields } = this.props;
    this.setState({ tag: key });
    switch (key) {
      case 'event':
        onSearchEvent();
        break;
      case 'field':
        onSearchField();
        onSearchAssetFields();
        break;
      default:
    }
  }
  /**
   * 展示筛选框
   */
  @Bind()
  handleShowFilterModal() {
    this.setState({ modalVisible: true });
  }
  /**
   * 关闭筛选框
   */
  @Bind()
  handleCloseFilterModal() {
    this.setState({ modalVisible: false });
  }

  render() {
    const {
      eventLoading,
      fieldLoading,
      eventPagination,
      transactionTypes,
      eventDataSource,
      fieldDataSource,
      assetFields,
      onSearchTransactionTypes,
      onSearch,
      onSearchEvent,
      onSearchField,
    } = this.props;
    const { modalVisible, tag } = this.state;
    const modalProps = {
      modalVisible,
      tag,
      assetFields,
      transactionTypes,
      onSearchEvent,
      onSearchField,
      onSearchTransactionTypes,
      defaultPageFields: assetFields.base_msg,
      onCancel: this.handleCloseFilterModal,
    };
    const prefix = 'aafm.equipmentAsset.model.equipment';
    const eventColumns = [
      {
        title: intl.get(`${prefix}.shortName`).d('事务类型'),
        dataIndex: 'shortName',
        width: 120,
      },
      {
        title: intl.get(`${prefix}.transactionNum`).d('事务处理单'),
        dataIndex: 'transactionNum',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.titleOverview`).d('标题概述'),
        dataIndex: 'titleOverview',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.description`).d('描述'),
        dataIndex: 'description',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.process`).d('处理过程'),
        dataIndex: 'process',
        width: 300,
        render: (_, record) => {
          const timeList = JSON.parse(record.processTimeRecord);
          const statusMeaningList = JSON.parse(record.processStatusRecordMeaning);
          const statusValueList = JSON.parse(record.processStatusRecord);
          const templateList = [];
          for (let i = 0; i < timeList.length; i++) {
            const statusMeaning = statusMeaningList[i];
            const statusValue = statusValueList[i];
            // eslint-disable-next-line radix
            const date = moment(parseInt(timeList[i])).format(getDateFormat());
            const template = (
              <Col span={6}>
                <Row>
                  <span>{date}</span>
                </Row>
                <Row>
                  <span>{statusMeaning}</span>
                </Row>
              </Col>
            );
            templateList.push(template);
            if (i !== timeList.length - 1) {
              // 添加向右箭头
              templateList.push(
                <Col span={2}>
                  <Row style={{ marginTop: 20 }}>
                    <Icon type="arrow-right" style={{ color: '#00A854' }} />
                  </Row>
                </Col>
              );
            }
            if (
              statusValue === 'RETURNED' ||
              statusValue === 'SCRAPPED' ||
              statusValue === 'COMPLETED' ||
              statusValue === 'PROCESSED' ||
              statusValue === 'DISPOSED'
            ) {
              // 最终状态添加勾号
              templateList.push(
                <Col span={2}>
                  <Row style={{ marginTop: 20 }}>
                    <Icon type="check-circle" style={{ color: '#00A854' }} />
                  </Row>
                </Col>
              );
            }
          }
          return <Row style={{ width: '100%' }}>{templateList}</Row>;
        },
      },
    ];
    const fieldColumns = [
      {
        title: intl.get(`${prefix}.fieldName`).d('字段'),
        dataIndex: 'fieldName',
        width: 120,
        render: (_, record) => record.fieldName,
      },
      {
        title: intl.get(`${prefix}.changeProcess`).d('变更过程'),
        dataIndex: 'changeProcess',
        render: (_, record) => {
          const dataList = record.listData;
          const templateList = [];
          for (let i = 0; i < dataList.length; i++) {
            const template = (
              <Col span={6}>
                <Row>
                  <span>{moment(dataList[i].occurTime).format(getDateFormat())}</span>
                </Row>
                <Row>
                  <span>{dataList[i].fieldMeaning}</span>
                </Row>
                <Row>
                  <span>{`${dataList[i].typeName}/${dataList[i].transactionNum}`}</span>
                </Row>
                <Row>
                  <span>{dataList[i].titleOverview}</span>
                </Row>
                {dataList.length > 3 ? <Divider dashed /> : ''}
              </Col>
            );
            templateList.push(template);
            if (i !== dataList.length - 1) {
              // 添加向右箭头
              templateList.push(
                <Col span={2}>
                  <Row style={{ marginTop: 20 }}>
                    <Icon type="arrow-right" style={{ color: '#00A854' }} />
                  </Row>
                </Col>
              );
            }
          }
          return <Row style={{ width: '100%' }}>{templateList}</Row>;
        },
      },
    ];
    return (
      <React.Fragment>
        <Tabs defaultActiveKey="event" onChange={this.handleSearch}>
          <Tabs.TabPane key="event" tab={intl.get(`${prefix}.event`).d('事件')}>
            <Button style={{ marginBottom: 10 }} onClick={this.handleShowFilterModal}>
              {intl.get(`${prefix}.event`).d('筛选')}
            </Button>
            <Table
              bordered
              rowKey="transactionHistoryId"
              loading={eventLoading}
              columns={tag === 'event' ? eventColumns : []}
              dataSource={eventDataSource}
              pagination={eventPagination}
              onChange={page => onSearch(page)}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="field" tab={intl.get(`${prefix}.field`).d('字段')}>
            <Button style={{ marginBottom: 10 }} onClick={this.handleShowFilterModal}>
              {intl.get(`${prefix}.event`).d('筛选')}
            </Button>
            <Table
              bordered
              rowKey="transactionHistoryId"
              loading={fieldLoading}
              columns={tag === 'field' ? fieldColumns : []}
              dataSource={fieldDataSource}
              pagination={false}
            />
          </Tabs.TabPane>
        </Tabs>
        <FilterModal {...modalProps} />
      </React.Fragment>
    );
  }
}
export default AssetRecordTab;
