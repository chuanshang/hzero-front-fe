import React, { Component, Fragment } from 'react';
import { Input, Table } from 'hzero-ui';
import intl from 'utils/intl';

class FullTextSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      condition: '',
    };
  }
  handleSearch(param) {
    this.props.onSearch(param, {});
  }
  handleChangeCondition(event) {
    this.setState({ condition: event.target.value });
  }
  handlePageSearch(page) {
    const { condition } = this.state;
    this.props.onSearch(condition, page);
  }
  render() {
    const { dataSource, pagination, loading, onGotoDetail } = this.props;
    const columns = [
      {
        dataIndex: 'assetsSetName',
        render: (val, record) => (
          <Fragment>
            <a
              style={{ display: 'flex', fontSize: 16 }}
              onClick={() => onGotoDetail(record.assetsSetId)}
            >
              {val}
            </a>
            <span>{record.assetClassMeaning}</span>
          </Fragment>
        ),
      },
    ];
    return (
      <React.Fragment>
        <Input.Search
          enterButton
          placeholder={intl.get('aafm.common.view.option.search').d('搜索区域')}
          onSearch={this.handleSearch.bind(this)}
          onChange={this.handleChangeCondition.bind(this)}
        />
        <Table
          bordered
          rowKey="assetsSetId"
          loading={loading}
          className="attribute-full-search"
          dataSource={dataSource}
          pagination={{
            ...pagination,
            size: 'small',
          }}
          columns={columns}
          scroll={{ y: 410 }}
          onChange={this.handlePageSearch.bind(this)}
        />
      </React.Fragment>
    );
  }
}
export default FullTextSearch;
