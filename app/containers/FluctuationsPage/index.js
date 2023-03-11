/**
 *
 * FluctuationsPage
 *
 */

import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectFluctuationsPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import ListPage from '../../components/List';
import { API_SALE_POLICY } from '../../config/urlConfig';
import makeSelectDashboardPage from '../Dashboard/selectors';
import VerticalDepartmentTree from '../../components/Filter/VerticalDepartmentTree';
import { Paper } from 'components/LifetekUi';
import { Grid } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import CustomChartWrapper from 'components/Charts/CustomChartWrapper';
import { getIncreasesOrDecreases } from './actions';
/* eslint-disable react/prefer-stateless-function */
am4core.useTheme(Am4themesAnimated);

function createChart(id, data, category, value, legend, titleChart) {
  const chart = am4core.create(id, am4charts.XYChart);
  const title = chart.titles.create();
  title.text = titleChart;
  title.fontSize = 25;
  title.marginBottom = 30;
  title.fontWeight = 'bold';
  // Add data
  chart.data = data;

  // Create axes
  const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.renderer.minGridDistance = 30;
  categoryAxis.dataFields.category = category;
  categoryAxis.renderer.inversed = false;
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.renderer.cellStartLocation = 0.1;
  categoryAxis.renderer.cellEndLocation = 0.9;
  categoryAxis.renderer.minGridDistance = 40;

  const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.renderer.opposite = false;
  valueAxis.min = 0;
  // Create series
  function createSeries(field, name) {
    const series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = field;
    series.dataFields.categoryX = category;
    series.name = name;
    series.tooltipText = '{categoryX}: [b]{valueY}[/]';
    series.strokeWidth = 2;
    series.sequencedInterpolation = true;
    series.sequencedInterpolationDelay = 1;

    const bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.stroke = am4core.color('#fff');
    bullet.circle.strokeWidth = 2;

    return series;
  }
  if (value) {
    value.map(item => createSeries(item.field, item.name));
  }

  if (legend) {
    chart.legend = new am4charts.Legend();
  }
  chart.cursor = new am4charts.XYCursor();

  return chart;
}

function ColumnXYChart(props) {
  const [chart, setChart] = useState(null);
  const { id, data, category, isExport, onExportSuccess, value, legend, titleChart } = props;

  useEffect(
    () => {
      if (isExport && chart) {
        chart.exporting.export('png');
        onExportSuccess();
      }
    },
    [isExport],
  );

  useEffect(
    () => {
      const columnChart = createChart(id, data, category, value, legend, titleChart);
      setChart(columnChart);
      return () => {
        if (columnChart) {
          columnChart.dispose();
        }
      };
    },
    [data],
  );

  return <div id={id} {...props} />;
}

function FluctuationsPage(props) {
  const {
    timekeepingPage,
    fluctuationsPage,
    dashboardPage,
    tableId,
    onGetTimekeepingData,
    onSaveCellData,
    onGetAllTimekeepType,
    getIncreasesOrDecreases,
  } = props;
  const { increasesOrDecreases, loadingChart } = fluctuationsPage;
  const { allDepartment, allSymbol } = dashboardPage;
  const [query, setQuery] = useState({
    tableId,
    hrmEmployeeId: null,
    organizationId: null,
  });
  const [expansive, setExpansive] = useState(true);
  const [widthColumn, setWidthColumn] = useState(300);
  const [organizationUnitId, setOrganizationUnitId] = useState('');
  const [fields, setFields] = useState([]);
  const [localState, setLocalState] = useState({
    isExportRevenueChart: false,
  });

  useEffect(() => {
    getIncreasesOrDecreases();
  }, []);

  useEffect(() => {
    const hrmStatus = JSON.parse(localStorage.getItem('hrmStatus'));
    const foundKanban = hrmStatus && hrmStatus.find(item => item.code === 'ST01');
    const { data } = foundKanban;
    if (data) {
      const formatData = data.map(item => ({ field: item._id, name: item.name }));
      setFields(formatData);
    }
  }, []);

  const onClickExpansive = () => {
    if (expansive) {
      setExpansive(false);
      setWidthColumn(50);
    } else {
      setExpansive(true);
      setWidthColumn(300);
    }
  };

  const handleSelectDepart = useCallback(
    depart => {
      try {
        const { hrmEmployeeId, organizationId, ...rest } = query;
        const newQuery = {
          ...rest,
        };
        if (depart && depart._id) {
          if (depart.isHrm) {
            newQuery.hrmEmployeeId = depart._id;
          } else {
            newQuery.organizationId = depart._id;
          }
        }
        setQuery(newQuery);
        // onGetTimekeepingData(parseQuery(newQuery));
      } catch (error) {
        console.log('errr', error);
      }
    },
    [query],
  );

  return (
    <Paper>
      <Grid container spacing={16} direction="row" justify="flex-start" alignItems="flex-start" style={{ width: '100%', paddingTop: 15 }}>
        {expansive ? (
          <Grid item container style={{ width: `${widthColumn}px` }}>
            <Grid item container>
              <ArrowBackIcon color="primary" onClick={onClickExpansive} />
            </Grid>

            <VerticalDepartmentTree
              addUser={false}
              addHrm={true}
              departments={allDepartment}
              onChange={handleSelectDepart}
              departmentId={organizationUnitId}
            />
          </Grid>
        ) : (
          <Grid item container style={{ width: `${widthColumn}px` }}>
            <Grid item container className="ml-1">
              <ArrowForwardIcon color="primary" onClick={onClickExpansive} />
            </Grid>
          </Grid>
        )}
        <Grid item style={{ width: `calc(100% - ${widthColumn}px)` }}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <CustomChartWrapper
                height="450px"
                onRefresh={getIncreasesOrDecreases}
                isLoading={loadingChart}
                onExport={() => {
                  setLocalState({ ...localState, isExportRevenueChart: true });
                }}
              >
                <ColumnXYChart
                  id="chartIncreasesOrDecreases"
                  data={increasesOrDecreases}
                  style={{ width: '100%', height: '100%' }}
                  titleChart="Biểu đồ biến động tăng giảm" // tiêu đề biểu đồ
                  category="month" // danh mục
                  value={fields} // dữ liệu string or array
                  lenged // hiển thị lenged
                  isExport={localState.isExportRevenueChart}
                  onExportSuccess={() => setLocalState({ ...localState, isExportRevenueChart: false })}
                />
              </CustomChartWrapper>
            </Grid>
          </Grid>
          {/* <ListPage code="SalesPolicy" apiUrl={API_SALE_POLICY} /> */}
        </Grid>
      </Grid>
    </Paper>
  );
}

FluctuationsPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  fluctuationsPage: makeSelectFluctuationsPage(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getIncreasesOrDecreases: () => dispatch(getIncreasesOrDecreases()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'fluctuationsPage', reducer });
const withSaga = injectSaga({ key: 'fluctuationsPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(FluctuationsPage);
