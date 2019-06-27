import React, { Component, Fragment } from 'react';
import { Input, Table, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';

class FullTextSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // condition: '',
      page: {},
    };
  }

  @Bind()
  handleSearch(param) {
    const { page = {} } = this.state;
    this.props.onSearch(param, page);
  }

  render() {
    const { dataSource, loading, onLinkToDetail, expandedRowKeys, onExpand } = this.props;
    const columns = [
      {
        dataIndex: 'locationName',
        render: (val, record) => (
          <Fragment>
            <a style={{ fontSize: 16 }} onClick={() => onLinkToDetail(record.assetLocationId)}>
              {val}
            </a>
            <Row className="full-search-span">
              <Col span={7} offset={2}>
                {record.locationTitle}
              </Col>
              <Col span={7}>{record.locationTypeMeaning}</Col>
              <Col span={7}>{record.maintSitesName}</Col>
            </Row>
          </Fragment>
        ),
      },
    ];
    return (
      <React.Fragment>
        <Input.Search
          enterButton
          placeholder={intl.get('amdm.common.view.option.search').d('搜索区域')}
          onSearch={this.handleSearch}
        />
        <Table
          bordered
          rowKey="assetLocationId"
          loading={loading}
          dataSource={dataSource}
          pagination={false}
          columns={columns}
          scroll={{ x: 320, y: 410 }}
          expandedRowKeys={expandedRowKeys}
          onExpand={onExpand}
        />
      </React.Fragment>
    );
  }
}
export default FullTextSearch;
