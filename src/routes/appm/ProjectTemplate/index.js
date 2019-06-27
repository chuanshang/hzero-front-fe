/**
 * ProjectTemplate - 项目模板
 * @date: 2019-3-6
 * @author: WH <heng.wei@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Button, Modal } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { isUndefined, isEmpty } from 'lodash';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import FilterForm from './FilterForm';
import ListTable from './ListTable';
import HistoryModal from './HistoryModal';

@connect(({ projectTemplate, loading }) => ({
  projectTemplate,
  tenantId: getCurrentOrganizationId(),
  loading: {
    search: loading.effects['projectTemplate/fetchTemplate'],
    remove: loading.effects['projectTemplate/removeTemplate'],
    history: loading.effects['projectTemplate/fetchHistory'],
  },
}))
@formatterCollections({ code: ['appm.common', 'appm.projectTemplate'] })
class ProjectTemplate extends Component {
  form;
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selectedRowKeys: [],
      selectedRows: [],
    };
  }
  componentDidMount() {
    const {
      dispatch,
      tenantId,
      projectTemplate: { pagination = {} },
      location: { state: { _back } = {} },
    } = this.props;
    // 校验是否从详情页返回
    const page = isUndefined(_back) ? {} : pagination;
    this.handleSearch(page);
    dispatch({
      type: 'projectTemplate/fetchLov',
      payload: { tenantId },
    });
  }
  /**
   * 页面查询
   * @param {object} fields - 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch, tenantId } = this.props;
    let filterValues = {};
    if (!isUndefined(this.form)) {
      const formValue = this.form.getFieldsValue();
      filterValues = filterNullValueObject(formValue);
    }
    dispatch({
      type: 'projectTemplate/fetchTemplate',
      payload: {
        tenantId,
        page: isEmpty(fields) ? {} : fields,
        ...filterValues,
      },
    });
  }
  /**
   * 点击模板编码进入明细页
   * @param {string} templateId - 项目模板Id
   */
  @Bind()
  handlePageSkip(record) {
    const { dispatch } = this.props;
    let path = '';
    if (record.proTemplateStatus === 'PRESET') {
      path = 'new-detail';
    } else {
      path = 'detail';
    }
    dispatch(
      routerRedux.push({ pathname: `/appm/project-template/${path}/${record.proTemplateId}` })
    );
  }
  /**
   * 编辑新版本跳转到new-detail页面
   */
  @Bind()
  handleGotoNewDetail(record) {
    this.props.dispatch(
      routerRedux.push({ pathname: `/appm/project-template/new-detail/${record.proTemplateId}` })
    );
  }
  /**
   * 新增模板
   * 跳转到新增明细页
   */
  @Bind()
  handleAddTemplate() {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectTemplate/updateState',
      payload: {
        templateDetail: {},
      },
    });
    dispatch(routerRedux.push({ pathname: `/appm/project-template/create` }));
  }
  /**
   * 删除
   * 仅能删除"草稿"状态的模板
   */
  @Bind()
  handleRemoveTemplate() {
    const { selectedRows } = this.state;
    const {
      dispatch,
      tenantId,
      loading,
      projectTemplate: { pagination = {} },
    } = this.props;
    Modal.confirm({
      content: intl.get('appm.projectTemplate.view.message.delete').d('是否删除数据?'),
      confirmLoading: loading.remove,
      onOk: () => {
        dispatch({
          type: 'projectTemplate/removeTemplate',
          payload: {
            tenantId,
            data: selectedRows,
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.handleSearch(pagination);
            this.setState({ selectedRowKeys: [] });
          }
        });
      },
    });
  }
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  }
  /**
   *设置form对象
   * @param {object} ref - FilterForm子组件对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }
  /**
   * 打开模态框
   */
  @Bind()
  handleShowModal() {
    this.setState({ modalVisible: true });
  }

  /**
   * 关闭模态框
   */
  @Bind()
  handleCancel() {
    this.setState({
      modalVisible: false,
    });
  }
  /**
   * 查看历史版本
   * @param {object} record - 行记录
   */
  @Bind()
  handleViewHistory(record) {
    const { tenantId, dispatch } = this.props;
    dispatch({
      type: 'projectTemplate/fetchHistory',
      payload: {
        tenantId,
        proTemplateId: record.proTemplateId,
      },
    });
    this.handleShowModal();
  }

  render() {
    const {
      loading,
      tenantId,
      projectTemplate: {
        pagination = {},
        templateList = [],
        templateStatus = [],
        historyList = [],
      },
    } = this.props;
    const { modalVisible, selectedRowKeys = [] } = this.state;
    const filterProps = {
      tenantId,
      templateStatus,
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      pagination,
      selectedRowKeys,
      loading: loading.search,
      dataSource: templateList,
      onSkip: this.handlePageSkip,
      onSearch: this.handleSearch,
      onSelect: this.handleSelectRow,
      onView: this.handleViewHistory,
      onGotoNewDetail: this.handleGotoNewDetail,
    };
    const historyModalProps = {
      modalVisible,
      loading: loading.history,
      onCancel: this.handleCancel,
      dataSource: historyList,
      onGotoHistory: this.handlePageSkip,
    };
    const prefix = 'appm';
    return (
      <React.Fragment>
        <Header title={intl.get(`${prefix}`).d('项目模板')}>
          <Button type="primary" icon="plus" onClick={this.handleAddTemplate}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button
            icon="delete"
            loading={loading.remove}
            onClick={this.handleRemoveTemplate}
            disabled={isEmpty(selectedRowKeys)}
          >
            {intl.get('hzero.common.button.remove').d('删除')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
          <HistoryModal {...historyModalProps} />
        </Content>
      </React.Fragment>
    );
  }
}
export default ProjectTemplate;
