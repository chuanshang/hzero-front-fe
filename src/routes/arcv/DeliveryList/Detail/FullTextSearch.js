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
    this.props.onSearch(param, { size: 10, page: 0 });
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
        dataIndex: 'deliveryListName',
        render: (val, record) => (
          <Fragment>
            <Row>
              <Row>
                <Col span={15}>
                  <a
                    style={{ display: 'flex', fontSize: 16 }}
                    onClick={() => onGotoDetail(record.deliveryListId)}
                  >
                    {val}
                  </a>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <span>{record.contractMeaning}</span>
                </Col>
                <Col span={12}>
                  <span>{record.assetsSetMeaning}</span>
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
          placeholder={intl.get('arcv.common.view.option.search').d('搜索区域')}
          onSearch={this.handleSearch}
          onChange={this.handleChangeCondition}
        />
        <Table
          bordered
          rowKey="deliveryListId"
          className="delivery-list-full-search"
          loading={loading}
          dataSource={dataSource}
          pagination={{
            ...pagination,
            size: '10',
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
