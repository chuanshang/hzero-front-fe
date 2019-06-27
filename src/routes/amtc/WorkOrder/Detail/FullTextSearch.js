import React, { Component, Fragment } from 'react';
import { Input, Table, Row, Col, Icon, Tag } from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';

class FullTextSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      condition: '',
    };
  }

  componentDidMount() {
    const { isNew } = this.props;
    if (!isNew) {
      this.handleSearch();
    }
  }

  @Bind()
  handleSearch(param) {
    this.props.onSearch(param, {});
  }

  @Bind()
  handleChangeCondition(event) {
    this.setState({ condition: event.target.value });
  }

  @Bind()
  handlePageSearch(page) {
    const { condition } = this.state;
    this.props.onSearch(condition, page);
  }

  @Bind()
  getStatusColor(status) {
    let colorCode = '#fff';

    if (status === 'DRAFT') {
      colorCode = '#f2efe6';
    } else if (status === 'SUBMITTED') {
      colorCode = '#f1f3de';
    } else if (status === 'APPROVED') {
      colorCode = '#dee8f3';
    } else if (status === 'REJECTED') {
      colorCode = '#ddc5b4';
    } else if (status === 'WSCH') {
      colorCode = '#dbddab';
    } else if (status === 'WRD') {
      colorCode = '#f3dede';
    } else if (status === 'WPCOND') {
      colorCode = '#ffe0aa';
    } else if (status === 'INPRG') {
      colorCode = '#c0dcff';
    } else if (status === 'COMPLETED') {
      colorCode = '#c0f9ff';
    } else if (status === 'PRECLOSED') {
      colorCode = '#e0ffea';
    } else if (status === 'CLOSED') {
      colorCode = '#c9e6d2';
    } else if (status === 'CANCELED') {
      colorCode = '#e0e0e0';
    } else if (status === 'UNABLE') {
      colorCode = '#bec2d7';
    } else if (status === 'REWORK') {
      colorCode = '#efddff';
    } else if (status === 'RETURNED') {
      colorCode = '#ffaaaa';
    }

    return { backgroundColor: colorCode };
  }

  render() {
    const commonModelPrompt = 'amtc.workOrder.model.wo';
    const { currentWoId, dataSource, pagination, loading, onGotoDetail } = this.props;
    const columns = [
      {
        dataIndex: 'woName',
        render: (val, record) => (
          <Fragment>
            <Col span={1}>
              <Icon
                style={
                  record.woId === Number(currentWoId)
                    ? {
                        backgroundColor: '#69a43a',
                        marginTop: 8,
                        fontSize: 25,
                        height: 50,
                        width: 2,
                      }
                    : {}
                }
              />
            </Col>
            <Col span={23}>
              <Row>
                <Col span={4}>
                  <Icon type="picture" style={{ marginTop: 8, fontSize: 25 }} />
                </Col>
                <Col span={20}>
                  <Row>
                    <a onClick={() => onGotoDetail(record.woId)}>{record.woNum}</a>
                  </Row>
                  <Row>
                    <a onClick={() => onGotoDetail(record.woId)}>{record.woName}</a>
                  </Row>
                  <Row>
                    <Col span={8}>{record.orgName}</Col>
                    <Col span={8}>{record.assetName}</Col>
                    <Col span={8}>{record.assetLocationName}</Col>
                  </Row>
                </Col>
                <Tag style={this.getStatusColor(record.woStatus)}>{record.woStatusMeaning}</Tag>
              </Row>
            </Col>
          </Fragment>
        ),
      },
    ];
    return (
      <React.Fragment>
        <Input.Search
          enterButton
          placeholder={intl.get(`${commonModelPrompt}.search`).d('搜索名称或编号')}
          onSearch={this.handleSearch}
          onChange={this.handleChangeCondition}
        />
        <div className="full-search">
          <Table
            bordered
            rowKey="woId"
            loading={loading}
            dataSource={dataSource}
            pagination={{
              ...pagination,
              size: 'small',
            }}
            columns={columns}
            scroll={{ y: 340 }}
            onChange={this.handlePageSearch}
          />
        </div>
      </React.Fragment>
    );
  }
}
export default FullTextSearch;
