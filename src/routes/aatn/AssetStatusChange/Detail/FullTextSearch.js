import React, { Component, Fragment } from 'react';
import { Input, Table, Row, Col } from 'hzero-ui';
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
    this.handleSearch();
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
  render() {
    const { dataSource, pagination, loading, onGotoDetail } = this.props;
    const columns = [
      {
        dataIndex: 'changeNum',
        render: (val, record) => (
          <Fragment>
            <Row>
              <Row>
                <Col>
                  <a
                    style={{ display: 'flex', fontSize: 16 }}
                    onClick={() => onGotoDetail(record.changeHeaderId)}
                  >
                    {val}
                  </a>
                </Col>
              </Row>
              <Row>
                <Col span={15}>
                  <span>{record.transactionTypeName}</span>
                </Col>
                <Col span={9}>
                  <span>{record.processStatusMeaning}</span>
                </Col>
              </Row>
            </Row>
          </Fragment>
        ),
      },
    ];
    return (
      <React.Fragment>
        <Input.Search
          enterButton
          placeholder={intl.get('aatn.common.view.option.search').d('搜索区域')}
          onSearch={this.handleSearch}
          onChange={this.handleChangeCondition}
        />
        <Table
          bordered
          rowKey="changeHeaderId"
          className="asset-status-change-full-search"
          loading={loading}
          dataSource={dataSource}
          pagination={{
            ...pagination,
            size: 'small',
          }}
          columns={columns}
          scroll={{ y: 410 }}
          onChange={this.handlePageSearch}
        />
      </React.Fragment>
    );
  }
}
export default FullTextSearch;
