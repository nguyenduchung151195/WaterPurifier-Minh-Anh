import React, { useState, useEffect, useCallback } from 'react';
import {
  Paper,
  Grid,
  Button,
  TableHead,
  TableBody,
  TableCell,
  Table,
  TableRow,
  Checkbox,
  TablePagination,
  makeStyles,
  withStyles,
} from '@material-ui/core';
import { compose } from 'redux';
import moment from 'moment';
import styles from './styles';
import ListAsync from '../../../../../../components/List';
import { API_CRM_CAMPAIGN } from 'config/urlConfig';
import { DatePicker } from 'material-ui-pickers';

// import { fetchData  } from '../../helper';
const view =
  JSON.parse(localStorage.getItem('viewConfig')) && JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === 'HistoryAsset');
const columns = view && view.editDisplay.type.fields.type.columns;
function HistoryAsset(props) {
  const { classes, id } = props;
  const [data, setData] = useState();
  const [keys, setKeys] = useState();
  const [perPage, setPerPage] = useState(1);
  const [count, setCount] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [dateFrom, setDateFrom] = useState();
  const [dateTo, setDateTo] = useState();

  const getApi = async (id, dateFrom, dateTo, pageIndex, pageSize) => {
    try {
      const respon = await fetch(`https://api-mwa.sse.net.vn/api/v1/thietbi/lichsu-crm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          id_thietbi: id,
          dateFrom: dateFrom || moment().format('YYYY-MM-DD'),
          dateTo: dateTo || moment().format('YYYY-MM-DD'),
          pageIndex:parseInt(pageIndex) + 1   || 1,
          pageSize:parseInt(pageSize)   || 10,
        }),
        // body: JSON.stringify({
        //   id_thietbi: '184,232,170',
          dateFrom: '2022-06-01',
          dateTo: '2022-08-31',
        //   pageIndex: 1,
        //   pageSize: 1,
        // }),
      });
      const data = await respon.json();
      setCount(data.paging && data.paging.totalRecords);
      let key = Object.keys(data && data.data);
      setData(data && data.data);
    } catch (error) {
      console.log('error', error);
    }

    return data;
  };
  useEffect(
    () => {
      if (id) {
        
        getApi(id, dateFrom, dateTo, activePage, perPage);
      }
    },
    [perPage, activePage, dateFrom, dateTo, id],
  );
  // Xử lý phân trang
  const handleChangePage = (event, activePage) => {
    console.log('activePage',activePage);
    setActivePage(activePage);
  };
  const handleChangeRowsPerPage = event => {
    setActivePage(0);
    setPerPage(event.target.value);
  };

  return (
    <>
      <Grid container alignItems="center" style={{ padding: 10 }} spacing={8}>
        <Grid item md={2}>
          <div className="marginNew">
            <DatePicker
              inputVariant="outlined"
              format="DD/MM/YYYY"
              fullWidth
              value={dateFrom}
              variant="outlined"
              label={'Từ ngày'}
              margin="dense"
              // views={['day, month, year']}
              onChange={date => {
                setDateFrom(date.format('YYYY-MM-DD'));
              }}
              required
            />
          </div>
        </Grid>
        <Grid item md={2}>
          <div className="marginNew">
            <DatePicker
              inputVariant="outlined"
              format="DD/MM/YYYY"
              fullWidth
              value={dateTo}
              variant="outlined"
              label={'Đến ngày'}
              margin="dense"
              // views={['day,month, year']}
              onChange={date => {
                setDateTo(date.format('YYYY-MM-DD'));
              }}
              required
            />
          </div>
        </Grid>
      </Grid>
      <div style={{ overflow: 'auto', height: 500 }}>
        <Table style={{ minWidth: '1900px' }}>
          <TableHead>
            <TableRow>
              {Array.isArray(columns) &&
                columns.length > 0 &&
                columns.map(column => <TableCell className={classes.customTableCell}>{column.title} </TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(data) &&
              data &&
              data.map(dt => {
                let newValues = Object.values(dt);
                return (
                  <>
                    {<TableRow>{newValues && newValues.map(value => <TableCell className={classes.customTableCell}>{value}</TableCell>)}</TableRow>}
                  </>
                );
              })}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        rowsPerPageOptions={[1, 10, 50]}
        colSpan={3}
        count={count}
        rowsPerPage={perPage}
        page={activePage}
        SelectProps={{
          native: true,
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        labelRowsPerPage="Số dòng hiển thị"
      />
    </>
  );
}

export default compose(withStyles(styles))(HistoryAsset);
