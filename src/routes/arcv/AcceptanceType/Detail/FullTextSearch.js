import React, { Component, Fragment } from 'react';
import { Input, Table, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';

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
    const { dataSource, pagination, loading, onLinkToDetail } = this.props;
    const columns = [
      {
        dataIndex: 'shortName',
        render: (val, record) => (
          <Fragment>
            <Row>
              <Col span={18}>
                <a
                  style={{ display: 'flex', fontSize: 16 }}
                  onClick={() => onLinkToDetail(record.acceptanceTypeId)}
                >
                  {val}
                </a>
              </Col>
              <Col span={6}>
                <span>{record.enabledFlagMeaning}</span>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <span>{record.fullName}</span>
              </Col>
              <Col span={12}>
                <span>{record.acceptanceTypeCodeMeaning}</span>
              </Col>
              <Col span={6}>
                <span>{record.code}</span>
              </Col>
            </Row>
          </Fragment>
        ),
      },
    ];
    return (
      <React.Fragment>
        <Input.Search
          enterButton
          placeholder={intl.get('aafm.common.view.option.search').d('搜索区域')}
          onSearch={this.handleSearch}
          onChange={this.handleChangeCondition}
        />
        <Table
          bordered
          rowKey="attributeSetId"
          loading={loading}
          dataSource={dataSource}
          pagination={{
            ...pagination,
            size: 'small',
          }}
          className="acceptance-type-full-search"
          columns={columns}
          scroll={{ y: 410 }}
          onChange={this.handlePageSearch}
        />
      </React.Fragment>
    );
  }
}
export default FullTextSearch;
