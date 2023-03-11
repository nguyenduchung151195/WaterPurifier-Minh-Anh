import React, { useState, useEffect, useCallback } from 'react';
import { Grid } from '@material-ui/core';
import request from '../../utils/request';
import { serialize } from '../../helper';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';

import { API_REPORT_FREQUENCY_SELL, API_REPORT_CUSTOMER_SELL } from '../../config/urlConfig';
import CustomChartWrapper from '../../components/Charts/CustomChartWrapper';
import { makeSelectProfile } from '../Dashboard/selectors';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import ListPage from 'containers/ListPage';

const CustomChart1 = props => {
  const { data = [], titleTex, isExport, id } = props;
  const [chartExport, setChartExport] = useState();
  let result = [];
  if (data) {
    data.map(i => {
      let obj = {};
      let { customer, products = [] } = i || {};
      obj.name = customer.name;
      if (Array.isArray(products)) {
        products.map(product => {
          obj[product.name] = product.amount;
        });
      }
      result.push(obj);
    });
  }
  let finalResult = [];
  let listName = [];

  if (result.length > 0) {
    result.map(i => {
      if (i.name && listName.indexOf(i.name) === -1) {
        listName.push(i.name);
      }
    });
  }

  if (listName && listName.length !== 0) {
    listName.map(i => {
      let obj = {};
      result.length !== 0 &&
        result.map(j => {
          if (i === j.name) {
            let { name, ...rest } = j;
            obj.name = i;
            Object.keys(rest).map(product => {
              if (Object.keys(obj).indexOf(product) !== -1) {
                obj[product] += rest[product];
              } else {
                obj[product] = rest[product];
              }
            });
          }
        });
      finalResult.push(obj);
    });
  }

  let series = [];
  if (finalResult.length > 0) {
    finalResult.map(i => {
      let arr = Object.keys(i).filter(f => f !== 'name');
      arr.map(product => {
        if (series.indexOf(product) === -1) {
          series.push(product);
        }
      });
    });
  }

  let columnChart;
  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.XYChart);
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 25;
      title.marginBottom = 20;
      title.fontWeight = 'bold';
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      chart.data = finalResult;

      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = 'name';
      categoryAxis.renderer.minGridDistance = 70;
      categoryAxis.renderer.cellStartLocation = 0.2;
      categoryAxis.renderer.cellEndLocation = 0.8;
      categoryAxis.fontSize = 11;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.renderer.minGridDistance = 50;

      function createSeries(field, name) {
        const series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryX = 'name';
        series.columns.template.width = am4core.percent(50);
        series.dataFields.valueY = field;
        series.name = name;
        series.stacked = true;
        series.columns.template.tooltipText = name + ': {valueY.value}';
        series.columns.template.tooltipY = 0;
      }
      chart.legend = new am4charts.Legend();
      chart.legend.valign = 'bottom';
      columnChart = chart;
      if (Array.isArray(series) && series.length > 0) {
        series.map(i => {
          createSeries(i, i);
        });
      }

      setChartExport(data);
    },
    [data],
  );
  useEffect(
    () => {
      if (chartExport && isExport === true) {
        chartExport.exporting.export('pdf');
        onExportSuccess();
      }
    },
    [data, isExport, chartExport],
  );

  useEffect(
    () => () => {
      if (columnChart) {
        columnChart.dispose();
      }
    },
    [],
  );
  return <div {...props} id={id} />;
};
const CustomChart2 = props => {
  const { data = [], titleTex, isExport, id } = props;
  const [chartExport, setChartExport] = useState();
  let finalResult = [];
  if (data && Array.isArray(data)) {
    data.map(item => {
      let obj = {
        name: item.name,
        amoutProduct: item.data ? item.data.amoutProduct : 0,
      };
      finalResult.push(obj);
    });
  }
  console.log(finalResult);
  let columnChart;
  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.XYChart);
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 25;
      title.marginBottom = 20;
      title.fontWeight = 'bold';
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      chart.data = finalResult;

      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = 'name';
      categoryAxis.renderer.minGridDistance = 70;
      categoryAxis.renderer.cellStartLocation = 0.2;
      categoryAxis.renderer.cellEndLocation = 0.8;
      categoryAxis.fontSize = 11;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.strictMinMax = true;
      valueAxis.renderer.minGridDistance = 50;

      function createSeries(field, name) {
        const series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryX = 'name';
        series.columns.template.width = am4core.percent(50);
        series.dataFields.valueY = field;
        series.name = name;
        series.columns.template.tooltipText = '{valueY.value}';
        series.columns.template.tooltipY = 0;
      }
      columnChart = chart;
      createSeries('amoutProduct', 'Tần suất mua hàng');
      setChartExport(data);
    },
    [data],
  );
  useEffect(
    () => {
      if (chartExport && isExport === true) {
        chartExport.exporting.export('pdf');
        onExportSuccess();
      }
    },
    [data, isExport, chartExport],
  );

  useEffect(
    () => () => {
      if (columnChart) {
        columnChart.dispose();
      }
    },
    [],
  );
  return <div {...props} id={id} />;
};
function AddCustomerReport(props) {
  const { tab, profile } = props;
  const INIT_QUERY = {
    year: 2021,
    organizationUnitId: '',
    employeeId: '',
    skip: 0,
    limit: 10,
  };
  const [isExport, setIsExport] = useState(false);
  const [queryFilter, setQueryFilter] = useState(INIT_QUERY);
  const [zoom, setZoom] = useState(false);
  const [count, setCount] = useState(1);
  const [data, setData] = useState([]);
  const handleExportSuccess = () => {
    setIsExport(false);
  };
  const getData = obj => {
    let url;
    switch (Number(tab)) {
      // case 0:
      //     url = API_REPORT_CUSTOMER_SELL
      //     break;
      case 0:
        url = API_REPORT_CUSTOMER_SELL;
        break;
      case 1:
        url = API_REPORT_FREQUENCY_SELL;
        break;
    }
    request(`${url}?${serialize(obj)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    }).then(res => {
      if (res && res.data) {
        setData(res.data);
        setCount(res.count);
      }
    });
  };
  const handleLoadData = useCallback(
    (page = 0, skip = 0, limit = 10) => {
      let { year, organizationUnitId, employeeId } = queryFilter || {};
      let obj = {
        year,
        organizationUnitId,
        employeeId,
        skip,
        limit,
      };
      setQueryFilter(obj);
      getData(obj);
    },
    [queryFilter],
  );

  const customDataChart1 = ({ data = [] }) => {
    let result = [];
    if (Array.isArray(data)) {
      data.map(i => {
        let { customer, products } = i || {};
        let obj = {
          customerName: customer ? customer.name : '',
          totalProduct: i.totalProduct,
        };
        let [item] = products || [];
        if (item) {
          obj.managerEmployee = item.managerEmployee;
        }
        result.push(obj);
      });
    }
    return result;
  };
  const customFieldChart1 = () => {
    let viewConfig = [];
    viewConfig[0] = { name: 'customerName', title: 'Khách hàng', checked: true, width: 120 };
    viewConfig[1] = { name: 'managerEmployee', title: 'Người phụ trách', checked: true, width: 120 };
    viewConfig[2] = { name: 'totalProduct', title: 'Tổng số lượng mua', checked: true, width: 120 };
    return viewConfig;
  };

  const customFieldChart2 = () => {
    let viewConfig = [];
    viewConfig[0] = { name: 'customerName', title: 'Khách hàng', checked: true, width: 120 };
    viewConfig[1] = { name: 'managerEmployee', title: 'Người phụ trách', checked: true, width: 120 };
    viewConfig[2] = { name: 'amoutProduct', title: 'Tổng trong năm', checked: true, width: 120 };
    // viewConfig[3] = { name: 'amoutProduct', title: 'Tổng trong năm', checked: true, width: 120 };
    return viewConfig;
  };
  function customDataChart2({ data = [] }) {
    let result = [];
    if (Array.isArray(data) && data.length > 0) {
      data.map(i => {
        let obj = {};
        obj.customerName = i.name ? i.name : '';
        obj.managerEmployee = i.managerEmployee && i.managerEmployee ? i.managerEmployee.name : '';
        obj.amoutProduct = i.data && i.data.amoutProduct ? i.data.amoutProduct : 0;
        result.push(obj);
      });
    }
    return result;
  }
  const handleSearch = obj => {
    getData(obj);
  };
  const handleClear = () => {
    getData(INIT_QUERY);
  };
  useEffect(() => {
    getData(INIT_QUERY);
  }, []);

  return (
    <>
      <Grid container>
        {tab === 0 ? (
          <div>
            <Grid item md={12}>
              <CustomChartWrapper
                onGetData={handleSearch}
                profile={profile}
                onZoom={z => setZoom(z)}
                onRefresh={handleClear}
                isReport={true}
                code="reportCustomerNumberSell"
                id="customerChart1"
                onExport={() => setIsExport(true)}
              >
                <CustomChart1
                  data={data}
                  titleTex="Báo cáo khách hàng theo số lượng mua hàng"
                  id="chart1"
                  onExportSuccess={handleExportSuccess}
                  isExport={isExport}
                  style={{ width: '100%', height: zoom ? '90vh' : '60vh', marginTop: 30 }}
                />
              </CustomChartWrapper>
            </Grid>
            <Grid item md={12}>
              <ListPage
                apiUrl={`${API_REPORT_CUSTOMER_SELL}?${serialize(queryFilter)}`}
                columns={data && customFieldChart1()}
                customRows={customDataChart1}
                perPage={queryFilter.limit}
                isReport={true}
                count={count}
                onLoad={handleLoadData}
                client
                disableEdit
                disableAdd
                disableConfig
                disableSearch
                disableSelect
              />
            </Grid>
          </div>
        ) : null}

        {tab === 1 ? (
          <div>
            <Grid item md={12}>
              <CustomChartWrapper
                onGetData={handleSearch}
                profile={profile}
                onZoom={z => setZoom(z)}
                onRefresh={handleClear}
                isReport={true}
                code="reportCustomerFrequencySell"
                id="customerChart2"
                onExport={() => setIsExport(true)}
              >
                <CustomChart2
                  data={data}
                  titleTex="Báo cáo tần suất khách hàng mua hàng"
                  id="chart2"
                  onExportSuccess={handleExportSuccess}
                  isExport={isExport}
                  style={{ width: '100%', height: zoom ? '80vh' : '60vh', marginTop: 30 }}
                />
              </CustomChartWrapper>
            </Grid>
            <Grid item md={12}>
              <ListPage
                apiUrl={`${API_REPORT_FREQUENCY_SELL}?${serialize(queryFilter)}`}
                columns={data && customFieldChart2()}
                customRows={customDataChart2}
                perPage={queryFilter.limit}
                isReport={true}
                count={count}
                onLoad={handleLoadData}
                client
                disableEdit
                disableAdd
                disableConfig
                disableSearch
                disableSelect
              />
            </Grid>
          </div>
        ) : null}
      </Grid>
    </>
  );
}
const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(AddCustomerReport);
