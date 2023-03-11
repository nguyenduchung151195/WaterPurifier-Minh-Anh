import { Grid, MenuItem, Paper, Typography, Button, Menu } from '@material-ui/core';
import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { API_BY_CHANNEL } from 'config/urlConfig';
import { MODULE_CODE } from 'utils/constants';
import moment from 'moment';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import _ from 'lodash';
import ReportChart from './ReportChart';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { fetchData, serialize } from '../../../../helper';
import { changeSnackbar } from '../../../Dashboard/actions';
import CustomInputField from '../../../../components/Input/CustomInputField';
import ExportTable from './exportTable';
import { tableToExcelCustomNoList, tableToPDF } from '../../../../helper';
import TodayIcon from '@material-ui/icons/Today';
import { IconButton } from '@material-ui/core';
import CustomAppBar from 'components/CustomAppBar';
import { mergeData as MergeData } from '../../../Dashboard/actions';
import DepartmentAndEmployee from '../../../../components/Filter/DepartmentAndEmployee';
import { makeSelectProfile } from '../../../../containers/Dashboard/selectors';

function ReportChannel(props) {
  const numberWithCommas = x => {
    return !!x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : x == 0 ? 0 : '';
  };
  const [listData, setListData] = useState([]);
  const [exportAnchor, setExportAnchor] = useState(null);
  const [openExcel, setOpenExcel] = useState(null);
  const [month, setMonth] = useState(moment().month() + 1);
  const [months, setMonths] = useState(moment());
  const [year, setYear] = useState(moment().year());
  const [filter, setFilter] = useState();
  useEffect(
    () => {
      if (months) {
        fetchData(`${API_BY_CHANNEL}?month=${month}&year=${year}&${serialize(filter)}`)
          .then(res => {
            if (res.result) setListData(res.result);
          })
          .catch(() => {
            props.onChangeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại!', variant: 'error' });
          });
      }
    },
    [month, year, filter],
  );

  const [html, setHtml] = useState([]);
  const [htmlTotal, setHtmlTotal] = useState(0);

  useEffect(
    () => {
      if ((html.length > 0) & (htmlTotal !== 0)) {
        if (html.length === htmlTotal) {
          for (let index = 0; index < htmlTotal; index++) {
            const win = window.open();
            win.document.write(html[index].content);
            win.document.close();
            win.print();
          }

          setHtml([]);
          setHtmlTotal(0);
        }
      }
    },
    [html, htmlTotal],
  );

  useEffect(() => {
    return () => {
      setTimeout(() => {
        props.onMergeData && props.onMergeData({ hiddenHeader: false });
      }, 1);
    };
  }, []);

  const handleCloseExcel = () => {
    const type = openExcel;
    setOpenExcel(null);
    // let title = `Giá trị lũy kế hợp đồng từ ${startDay.format('YYYY')} - ${endDay.format('YYYY')}`;
    let title = 'Báo cáo theo kênh';
    switch (type) {
      case 'PDF':
        // console.log('sss');
        const { totalPage = 1, pageNumber = 1 } = {};
        const content = tableToPDF('reportChannel');
        setHtml(e => [...e, { content, pageNumber }]);
        setHtmlTotal(totalPage);
        break;
      default:
        tableToExcelCustomNoList('reportChannel', 'W3C Example Table', undefined, undefined, title);
    }
  };

  const handleChangeMonth = e => {
    const month = moment(e).month() + 1;
    const year = moment(e).year();
    setMonths(e);
    setMonth(month);
    setYear(year);
  };
  const handleChangeDepartment = useCallback(
    res => {
      const value = res.department;
      if (value) {
        let x = {
          organizationUnit: value,
        };
        setFilter(x);
      } else {
        setFilter(null);
      }
    },
    [filter],
  );

  return (
    <>
      <Paper style={{ width: props.miniActive ? window.innerWidth - 80 : window.innerWidth - 260 }}>
        <Grid className="helloCVDA" style={{ padding: '0 20px', width: props.miniActive ? 'calc( 100vw - 80px)' : 'calc( 100vw - 260px)' }}>
          <CustomAppBar title="BÁO CÁO THEO KÊNH" onGoBack={props.onClose} disableAdd />
          <Typography gutterBottom align="center" variant="h5" style={{ marginTop: 70 }}>
            BÁO CÁO THEO KÊNH
          </Typography>
          <Grid item md={12} container spacing={32} style={{ paddingTop: 30, paddingLeft: 50 }}>
            <Grid item xs={1} />
            <Grid item xs={2}  >
              <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment} >
                <DatePicker
                  views={['year', 'month']}
                  variant="outlined"
                  value={months}
                  label="Tháng, năm"
                  okLabel="Xác nhận"
                  cancelLabel="Hủy"
                  fullWidth
                  disableFuture
                  // margin="dense"
                  // required
                  onChange={handleChangeMonth}
                  InputProps={{
                    endAdornment: (
                      <IconButton>
                        <TodayIcon />
                      </IconButton>
                    ),
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={2} >
              <DepartmentAndEmployee onChange={handleChangeDepartment} disableEmployee moduleCode="Employee" profile={props.profile} fullWidth />
            </Grid>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
              <Grid item sm={12} md={10} xs={10} id="reportChannel">
                <table style={{ width: '100%' }} border="1">
                  <tr>
                    <th align="center" rowspan="2" style={{ width: '5%' }}>
                      STT
                    </th>
                    <th align="center" rowspan="2" style={{ width: '35%' }}>
                      KÊNH
                    </th>
                    <th align="center" colSpan="3">
                      LOẠI DOANH THU
                    </th>
                  </tr>
                  <tr>
                    <th align="center" style={{ width: '20%' }}>
                      DOANH THU GỘP
                    </th>
                    <th align="center" style={{ width: '20%' }}>
                      DOANH THU THỰC
                    </th>
                    <th align="center" style={{ width: '20%' }}>
                      DOANH THU THUẦN
                    </th>
                  </tr>
                  {listData.map((el, index) => {
                    return (
                      <tr>
                        <td align="center">{index + 1}</td>
                        <td align="left" style={{ maxWidth: 300 }}>
                          {el && el.name}
                        </td>
                        <td align="center">{numberWithCommas(el && el.grossRevenue ? el.grossRevenue : 0)}</td>
                        <td align="center">{numberWithCommas(el && el.realRevenue ? el.realRevenue : 0)}</td>
                        <td align="center">{numberWithCommas(el && el.netRevenue ? el.netRevenue : 0)}</td>
                      </tr>
                    );
                  })}
                </table>
              </Grid>
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={10}>
              <ReportChart
                id="chartdiv"
                style={{ height: '500px' }}
                data={listData}
                // listyear={listYears}
              />
            </Grid>
          </Grid>

          {/* ) : null} */}
          <Grid item xs={12} container direction="row" alignItems="center" spacing={16} style={{ marginTop: 30 }}>
            <Grid item xs={4} container direction="row" alignItems="flex-end" style={{ paddingLeft: 50 }} />
            <Grid item xs={8} container direction="row" justify="flex-end" style={{ paddingRight: 50 }}>
              <Button variant="outlined" color="primary" onClick={e => setExportAnchor(e.currentTarget)} style={styles.importBtn}>
                Xuất báo cáo
              </Button>
              {/* <Button variant="outlined" color="secondary" onClick={props.onClose} style={styles.importBtn}>
                Thoát
              </Button> */}

              <Menu keepMounted open={Boolean(exportAnchor)} onClose={() => setExportAnchor(null)} anchorEl={exportAnchor}>
                <MenuItem
                  // onClick={onExportExcel}
                  onClick={() => {
                    setOpenExcel('Excell');
                    setExportAnchor(null);
                  }}
                  style={styles.menuItem}
                >
                  Excel
                </MenuItem>
                <MenuItem
                  // onClick={onExportPDF}
                  onClick={() => {
                    setOpenExcel('PDF');
                    setExportAnchor(null);
                  }}
                  style={styles.menuItem}
                >
                  PDF
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <ExportTable
        exportType={openExcel}
        open={openExcel}
        onClose={handleCloseExcel}
        // col={listYears}
        // listTitle={listTitle}
        // titleExcel={`Giá trị lũy kế hợp đồng từ ${startDay.format('YYYY')} - ${endDay.format('YYYY')}`}
        row={listData}
        // listDataSmall={listDataSmall}
        // dataRevenueRxpend={dataRevenueRxpend}
      />
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
});

// export default compose(withConnect)(ReportChannel);

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onMergeData: data => dispatch(MergeData(data)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// const withReducer = injectReducer({ key: 'addCustomerPage', reducer });
// const withSaga = injectSaga({ key: 'addCustomerPage', saga });

export default compose(withConnect)(ReportChannel);

const styles = {
  importBtn: {
    marginLeft: 10,
    // marginRight: 20,
    width: 200,
  },
  menuItem: {
    width: 200,
    justifyContent: 'center',
  },

};
