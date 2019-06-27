import React from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/toolbox';
import { Bind } from 'lodash-decorators';

class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.myChart = null;
  }

  @Bind
  compare(keyName) {
    return (obj1, obj2) => {
      const val1 = obj1[keyName];
      const val2 = obj2[keyName];
      if (val1 > val2) {
        return 1;
      } else if (val1 < val2) {
        return -1;
      } else {
        return 0;
      }
    };
  }

  @Bind
  setOption() {
    if (!this.myChart) {
      return;
    }

    const { dataSource = [] } = this.props;
    // 期间排序
    let newDataSource = [];
    dataSource.forEach(i => {
      newDataSource.push({
        periodName: i.periodName,
        changeValue: i.changeValue,
      });
    });
    newDataSource = newDataSource.sort(this.compare('periodName'));
    const xData = [];
    const yData = [];
    newDataSource.forEach(i => {
      xData.push(i.periodName);
      yData.push(i.changeValue);
    });

    const option = {
      title: {
        text: '价值变动图',
        x: 'center',
        align: 'right',
      },
      toolbox: {
        feature: {
          magicType: { type: ['line', 'bar'] },
          restore: {},
          saveAsImage: {},
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          animation: false,
          label: {
            backgroundColor: '#505765',
          },
        },
      },
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          filterMode: 'empty',
        },
        {
          type: 'slider',
          yAxisIndex: 0,
          filterMode: 'empty',
        },
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'empty',
        },
        {
          type: 'inside',
          yAxisIndex: 0,
          filterMode: 'empty',
        },
      ],
      xAxis: [
        {
          name: '期间',
          type: 'category',
          boundaryGap: false,
          axisLine: { onZero: false },
          data: xData,
        },
      ],
      yAxis: [
        {
          name: '价值变动',
          type: 'value',
          // max: 500
        },
      ],
      series: [
        {
          name: '价值变动',
          type: 'line',
          animation: false,
          lineStyle: {
            width: 1,
          },
          data: yData,
        },
      ],
    };

    this.myChart.setOption(option);
  }

  componentDidMount() {
    // 基于准备好的dom，初始化echarts实例
    this.myChart = echarts.init(document.getElementById('main'));
    this.setOption();
  }

  componentDidUpdate() {
    // 每次更新组件都重置
    this.setOption();
    // 重新布局大小
    this.myChart.resize();
  }

  render() {
    return <div id="main" style={{ height: 400, marginTop: 15 }} />;
  }
}

export default LineChart;
