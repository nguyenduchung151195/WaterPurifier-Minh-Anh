/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * ReportHrmPage
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Card, CardContent, CardHeader, CardActions } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import lang3 from '../../assets/img/girls.jpg';
import lang2 from '../../assets/img/Womans.jpg';
import lang from '../../assets/img/Mans.jpg';
import injectReducer from 'utils/injectReducer';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import CustomChartWrapper from 'components/Charts/CustomChartWrapper';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import makeSelectReportHrmPage from './selectors';
import { Grid, Typography, Paper } from '../../components/LifetekUi';
import { mergeData as mergeDataCatagory } from '../ConfigHrmPage/actions';
import { Comment } from 'components/LifetekUi';
import { mergeData as mergeDataPersonnel } from '../PersonnelPage/actions';
import reducer from './reducer';
import { Close } from '@material-ui/icons';
import saga from './saga';
import { API_LATE_AND_LEAVE } from 'config/urlConfig';
import moment from 'moment';
import ColumnXYChartHuman from './Charts/ColumnXYChartHuman';
import ColumnXYChartWage from './Charts/ColumnXYChartWage';
import Calender from './Calender';
import { mergeData, getApi, getIncreasesOrDecreases, getLate, getHrm, getWage } from './actions';
am4core.useTheme(Am4themesAnimated);
const ReportBox = props =>
  props.noData ? (
    <div item md={3} spacing={4} style={{ background: 'white', padding: '25px 10px', width: '23%', position: 'relative' }} />
  ) : (
    <div item md={3} spacing={4} style={{ background: props.color, borderRadius: '3px', padding: '25px 10px', width: '23%', position: 'relative' }}>
      <div style={{ padding: 5, zIndex: 999 }}>
        <Typography style={{ color: 'white' }} variant="h4">
          {props.number}
        </Typography>
        <Typography variant="body1">{props.text}</Typography>
      </div>
      <div
        className="hover-dashboard"
        style={{
          position: 'absolute',
          background: props.backColor,
          textAlign: 'center',
          padding: 'auto',
          display: 'block',
          textDecoration: 'none',
          width: '100%',
          bottom: 0,
          left: 0,
          right: 0,
          cursor: 'pointer',
          zIndex: 555,
        }}
        onClick={props.openDetail}
      >
        Xem chi tiết
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.2,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          zIndex: 88,
          fontSize: '70px',
          padding: 5,
        }}
      >
        {props.icon}
      </div>
    </div>
  );



function ColumnXYChart(props) {
  const { id, data, category } = props;

  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.XYChart);
      const title = chart.titles.create();
      title.text = props.title;
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
      if (props.value) {
        props.value.map(item => createSeries(item.field, item.name));
      }

      if (props.lenged) {
        chart.legend = new am4charts.Legend();
      }
      chart.cursor = new am4charts.XYCursor();
      return () => {
        chart.dispose();
      };
    },
    [data],
  );

  return <div id={id} {...props} />;
}
function ColumnPieChart(props) {
  const { id, data, type = '', titleTex, isExport, all, leave } = props;
  let circleChart1;

  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.PieChart);

      // Add data
      chart.data = data;

      const title = chart.titles.create();
      title.text = titleTex && titleTex.toUpperCase();
      title.fontSize = 20;
      title.marginBottom = 10;
      title.fontWeight = 'bold';

      // Add and configure Series
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = 'value';
      pieSeries.dataFields.category = 'name';
      pieSeries.dataFields.id = 'fields';
      chart.legend = new am4charts.Legend();
      pieSeries.legendSettings.itemValueText = '{value}';
      chart.legend.position = 'right';
      chart.legend.scrollable = true;
      circleChart1 = chart;

      chart.innerRadius = am4core.percent(55);

      // disable logo
      if (chart.logo) {
        chart.logo.disabled = true
      }

      pieSeries.labels.template.disabled = true;
      pieSeries.ticks.template.disabled = true;
    },
    [data],
  );
  useEffect(
    () => () => {
      if (circleChart1) {
        circleChart1.dispose();
      }
    },
    [data],
  );

  return <React.Fragment style={{ position: 'relative' }}>
    <div {...props} style={{ height: '100%', padding: '20px 0', marginTop: 20, width: '100%' }} id={id} />
    <div style={{ position: 'relative', top: '-48%', left: '82%', transform: 'translate(-50%, -50%)', fontWeight: 'bold' }}>
      {`${all - leave} / ${all}`} <br />
    </div>
    <div style={{ position: 'relative', top: '-47%', left: '79%', transform: 'translate(-50%, -50%)', fontWeight: 'bold', color: 'rgb(192 123 131)' }}>
      <p>Tổng số nhân sự</p>
    </div>
  </React.Fragment>;
}

ReportBox.defaultProps = {
  color: 'linear-gradient(to right, #03A9F4, #03a9f4ad)',
  icon: 'CardTravel',
};

const Report = props => (
  <div
    item
    md={3}
    spacing={4}
    style={{
      background: props.color,
      borderRadius: '3px',
      padding: '25px 10px',
      width: props.size ? props.size : '20%',
      position: 'relative',
      marginTop: 20,
    }}
  >
    <div style={{ padding: 5, zIndex: 999 }}>
      <Typography style={{ color: 'white' }} variant="h4">
        {props.number}
      </Typography>
      <Typography variant="body1">{props.text}</Typography>
    </div>
    <div
      className="hover-dashboard"
      style={{
        position: 'absolute',
        background: props.backColor,
        textAlign: 'center',
        padding: 'auto',
        display: 'block',
        textDecoration: 'none',
        width: '100%',
        bottom: 0,
        left: 0,
        right: 0,
        cursor: 'pointer',
        zIndex: 555,
      }}
      onClick={props.openDetail}
    >
      Xem chi tiết
    </div>
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.2,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 88,
        fontSize: '70px',
        padding: 5,
      }}
    >
      {props.icon}
    </div>
  </div>
);

/* eslint-disable react/prefer-stateless-function */
export class ReportHrmPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataUser: {},
      fakeData: [
        {
          name: "Hải Yến",
          avatar: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fi.pinimg.com%2F564x%2Ff7%2Fa5%2F48%2Ff7a5489830eef765b2ba8bc77f66e25d.jpg&imgrefurl=https%3A%2F%2Fwww.pinterest.com%2Fpin%2F1149121661142005209%2F&tbnid=3ASb-VCsT4BZ0M&vet=12ahUKEwjv9aXT6571AhVszIsBHRSzAIIQMygAegUIARCkAQ..i&docid=sCXO-4aqWgijfM&w=540&h=720&itg=1&q=%E1%BA%A3nh%20g%C3%A1i%20%C4%91%E1%BA%B9p&ved=2ahUKEwjv9aXT6571AhVszIsBHRSzAIIQMygAegUIARCkAQ"
        },
        {
          name: "Quỳnh Chi",
          avatar: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fi.pinimg.com%2F564x%2Ff7%2Fa5%2F48%2Ff7a5489830eef765b2ba8bc77f66e25d.jpg&imgrefurl=https%3A%2F%2Fwww.pinterest.com%2Fpin%2F1149121661142005209%2F&tbnid=3ASb-VCsT4BZ0M&vet=12ahUKEwjv9aXT6571AhVszIsBHRSzAIIQMygAegUIARCkAQ..i&docid=sCXO-4aqWgijfM&w=540&h=720&itg=1&q=%E1%BA%A3nh%20g%C3%A1i%20%C4%91%E1%BA%B9p&ved=2ahUKEwjv9aXT6571AhVszIsBHRSzAIIQMygAegUIARCkAQ"
        },
      
      ]
    };
  }
  openPersonnel = () => {
    this.props.history.push('/hrm/personnel');
  };

  openCatagory = () => {
    this.props.history.push('/hrm/configHrm');
    this.props.mergeDataCatagory({ tab: 1 });
  };

  openIncrease = () => {
    this.props.history.push('/hrm/personnel');
    this.props.mergeDataPersonnel({ tab: 4 });
  };
  getDataLateAndLeave = () => {
    fetch(`${API_LATE_AND_LEAVE}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ dataUser: data.data })
      })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps &&
      nextProps.fields !== this.props.fields
    ) {
      return true;
    }
    if (
      nextProps &&
      nextProps.reportHrmPage &&
      nextProps.reportHrmPage.lateData !== this.props.reportHrmPage.lateData
    ) {
      return true;
    }
    if (
      nextProps &&
      nextProps.reportHrmPage &&
      nextProps.reportHrmPage.hrmData !== this.props.reportHrmPage.hrmData
    ) {
      return true;
    }
    if (
      nextProps &&
      nextProps.reportHrmPage &&
      nextProps.reportHrmPage.wageData !== this.props.reportHrmPage.wageData
    ) {
      return true;
    }
    if (this.state.fakeData !== nextState.fakeData) {
      return true;
    }
    return false;
  }


  componentDidMount() {
    this.props.getApi();
    this.props.getIncreasesOrDecreases();
    this.props.getLate();
    this.props.getHrm();
    this.props.getWage();
    const hrmStatus = JSON.parse(localStorage.getItem('hrmStatus'));
    const foundKanban = hrmStatus && hrmStatus.find(item => item.code === 'ST01');
    const { data } = foundKanban;
    if (data) {
      const formatData = data.map(item => ({ field: item._id, name: item.name }));
      this.setState({ fields: formatData });
    }
  }

  openHrmPage(kanbanStatus) {
    this.props.history.push(`hrm/personnel?kanbanStatus=${kanbanStatus}`);
  }
  deleteData = (e, number) =>{
    console.log(e,number,'kfkf')
    const newData = this.state.fakeData.filter((i, index) => number !== index)
    this.setState({fakeData: newData})
  }

  render() {
    const { reportHrmPage, loadingChart, getIncreasesOrDecreases, getLate, profile, getHrm, getWage } = this.props;
    const { increasesOrDecreases, personnel, catagory, lateData, hrmData, wageData } = reportHrmPage;
    const { fields } = this.state;
    const hrmReport = {};
    const feMalePercent = (((lateData && lateData.female) / (lateData && lateData.hrm)) * 100).toFixed(0)
    const malePercent = (((lateData && lateData.male) / (lateData && lateData.hrm)) * 100).toFixed(0)
    const dataPie = [
      {
        name: 'Nhân viên đi muộn',
        value: lateData && lateData.hrmLate,
      },
      {
        name: 'Nhân viên vắng mặt',
        value: lateData && lateData.hrmLeave,
      },
    ];
    if (increasesOrDecreases && fields) {
      const currentMonth = moment().get('M');
      const currentMonthData = increasesOrDecreases[currentMonth];
      if (currentMonthData) {
        fields.forEach(itemKb => {
          itemKb.value = currentMonthData[itemKb.field];
        })
      }
    }
    const allData = Array.isArray(fields) && fields.concat(dataPie || [])

    return (
      <div>
        <Paper>
          <Grid container spacing={12}>
            <Grid item xs={6}>
              <Grid item xs={12} style={{ marginTop: 0 }}>
                <Typography style={{ fontSize: 18 }}>LỊCH CHẤM CÔNG</Typography>
                <Calender />
              </Grid>
              <Grid item xs={12} style={{ marginTop: 33 , marginBottom: 10}}>
                <CustomChartWrapper onRefresh={getHrm} isLoading={loadingChart}>
                  <ColumnXYChartHuman
                    data={hrmData}
                    id="chartDataHuman"
                  />
                </CustomChartWrapper>
              </Grid>
              {/* <Grid container style={{ height: 400, marginTop: 30 }}>
                <Grid item xs={6}>
                  <CustomChartWrapper height="330px" onRefresh={getIncreasesOrDecreases} isLoading={loadingChart}>
                  </CustomChartWrapper>
                </Grid>
                <Grid item container xs={6} style={{ paddingLeft: 70 }}>
                  <Grid item xs={6} style={{ width: '100%', margin: '8px 0', justifyContent: 'flex-end' }}>
                    <Typography style={{ color: 'red', fontSize: 26, paddingLeft: 25 }}>{`${malePercent}%`}</Typography>
                    <img alt="Nguyễn văn A" src={lang} style={{ height: 200 }} />
                  </Grid>
                  <Grid item xs={6} style={{ width: '100%', margin: '8px 0' }}>
                    <Typography style={{ color: 'red', fontSize: 26, paddingLeft: 25 }}>{`${feMalePercent}%`}</Typography>
                    <img alt="Nguyễn thị B" src={lang2} style={{ height: 200 }} />
                  </Grid>
                </Grid>
              </Grid> */}
            </Grid>
            <Grid item xs={6}>
              <Grid item xs={12} style={{ marginTop: 50 }}>
                <CustomChartWrapper height="450px" onRefresh={getLate} isLoading={loadingChart}>
                  <ColumnPieChart
                    id="chartData"
                    data={allData}
                    all={lateData && lateData.hrm}
                    leave={lateData && lateData.hrmLeave}
                    titleTex="Tình hình nhân sự"
                  />
                </CustomChartWrapper>
              </Grid>
              <Grid item xs={12} style={{ marginTop: 32 , marginBottom: 10}}>
                <CustomChartWrapper onRefresh={getWage} isLoading={loadingChart}>
                  <ColumnXYChartWage
                    id="chartDataWage"
                    data={wageData}
                  />
                </CustomChartWrapper>
              </Grid>
              {/* <Grid item xs={12} style={{ marginTop: 33 }}>
                <Grid item xs={12} container direction="row" justify="flex-end" style={{ paddingRight: 50 }}>
                  <Grid item xs={6}>
                  </Grid>
                  {this.state.fakeData.map((item, index) => (
                    <Grid item xs={6} container direction="row" justify="flex-end">
                      <Card style={{ height: 100, width: 300, backgroundColor: '#f8f3f2' }}>
                        <Grid container direction="row" justify="flex-end" style={{ height: 0 }}>
                          <Close onClick={e => this.deleteData(e, index)} style={{ height: 15, transform: 'translate(15px, -5px)' }} />
                        </Grid>
                        <Grid container style={{ marginTop: -14 }}>
                          <Grid item xs={4}>
                            <img src={lang3} style={{ height: 70, width: 70, transform: 'translate(10px, 8px)', borderRadius: 5 }} />
                          </Grid>
                          <Grid item xs={8}>
                            <Typography>Hôm nay là sinh nhật</Typography>
                            <p style={{fontWeight: 700, paddingLeft: 10, marginTop: -10}}>{item.name}</p>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                <Grid item xs={8} style={{ marginTop: 30 }}>
                  <Comment code="HRMWage" />
                </Grid>
              </Grid> */}
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

ReportHrmPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  reportHrmPage: makeSelectReportHrmPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getApi: () => dispatch(getApi()),
    mergeDataCatagory: data => dispatch(mergeDataCatagory(data)),
    mergeDataPersonnel: data => dispatch(mergeDataPersonnel(data)),
    getIncreasesOrDecreases: () => dispatch(getIncreasesOrDecreases()),
    getLate: () => dispatch(getLate()),
    getHrm: () => dispatch(getHrm()),
    getWage: () => dispatch(getWage()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'reportHrmPage', reducer });
const withSaga = injectSaga({ key: 'reportHrmPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ReportHrmPage);
