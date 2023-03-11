import { Grid, MenuItem, Paper, Typography, Button, Menu } from '@material-ui/core';
import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { API_REPORT_SALES_EMPLOYEE } from 'config/urlConfig';
import { MODULE_CODE } from 'utils/constants';
import moment from 'moment';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import _ from 'lodash';
import ReportChart from './ReportChart';
import { fetchData, serialize } from '../../../../helper';
import { changeSnackbar } from '../../../Dashboard/actions';
import CustomInputField from '../../../../components/Input/CustomInputField';
import ExportTable from './exportTable';
import { tableToExcelCustomNoList, tableToPDF } from '../../../../helper';
import TodayIcon from '@material-ui/icons/Today';
import { IconButton } from '@material-ui/core';
import { makeSelectMiniActive } from '../../../../containers/Dashboard/selectors';
import CustomAppBar from 'components/CustomAppBar';
import { mergeData as MergeData } from '../../../Dashboard/actions';
import { makeSelectProfile } from '../../../../containers/Dashboard/selectors';
import DepartmentAndEmployee from '../../../../components/Filter/DepartmentAndEmployee';

function ReportSalesEmployee(props) {
  const [listData, setListData] = useState([]);
  const [exportAnchor, setExportAnchor] = useState(null);
  const [openExcel, setOpenExcel] = useState(null);
  const [month, setMonth] = useState(moment().month() + 1);
  const [months, setMonths] = useState(moment());
  const [year, setYear] = useState(moment().year());
  const [filter, setFilter] = useState();

  const numberWithCommas = x => {
    return !!x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : x == 0 ? 0 : '';
  };

  useEffect(
    () => {
      if (months) {
        fetchData(`${API_REPORT_SALES_EMPLOYEE}?month=${month}&year=${year}&${serialize(filter)}`)
          .then(res => {
            if (res.data) {
              setListData(res.data);
            } else if (!res.data) {
              props.onChangeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại!', variant: 'error' });
            }
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
    let title = 'Báo cáo theo nhân viên kinh doanh';
    switch (type) {
      case 'PDF':
        const { totalPage = 1, pageNumber = 1 } = {};
        const content = tableToPDF('reportBySaleEmployee');
        setHtml(e => [...e, { content, pageNumber }]);
        setHtmlTotal(totalPage);
        break;
      default:
        tableToExcelCustomNoList('reportBySaleEmployee', 'W3C Example Table', undefined, undefined, title);
    }
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
  const handleChangeMonth = e => {
    const month = moment(e).month() + 1;
    const year = moment(e).year();
    setMonths(e);
    setMonth(month);
    setYear(year);
  };
  return (
    <>
      <Paper style={{ width: props.miniActive ? 'calc( 100vw - 80px)' : 'calc( 100vw - 260px)' }}>
        <Grid className="helloCVDA" style={{ padding: '0 20px', width: props.miniActive ? 'calc( 100vw - 80px)' : 'calc( 100vw - 260px)' }}>
          <CustomAppBar title=" BÁO CÁO THEO NHÂN VIÊN KINH DOANH" onGoBack={props.onClose} disableAdd />
          <Typography gutterBottom align="center" variant="h5" style={{ marginTop: 70 }}>
            BÁO CÁO THEO NHÂN VIÊN KINH DOANH
          </Typography>
          <Grid item md={12} container spacing={8} style={{ paddingLeft: 180 }}>
            <Grid item md={2} sm={2}>
              <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment}>
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
            <Grid item md={2} sm={2}>
              <DepartmentAndEmployee onChange={handleChangeDepartment} disableEmployee moduleCode="Employee" profile={props.profile} fullWidth />
            </Grid>
          </Grid>
          <Grid item md={12} container spacing={32} style={{ paddingTop: 30, paddingLeft: 50 }}>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
              <Grid item sm={12} md={10} xs={10} id="reportBySaleEmployee">
                <table style={{ width: '100%' }} border="1">
                  <tr>
                    <th align="center" rowspan="2" style={{ width: '5%' }}>
                      STT
                    </th>
                    <th align="center" rowspan="2" style={{ width: '35%' }}>
                      TÊN NHÂN VIÊN
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
                  onClick={() => {
                    setOpenExcel('Excell');
                    setExportAnchor(null);
                  }}
                  style={styles.menuItem}
                >
                  Excel
                </MenuItem>
                <MenuItem
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

      <ExportTable exportType={openExcel} open={openExcel} onClose={handleCloseExcel} titleExcel="Báo cáo theo nhân viên kinh doanh" row={listData} />
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  miniActive: makeSelectMiniActive(),
  profile: makeSelectProfile(),
});

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

export default compose(withConnect)(ReportSalesEmployee);

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
