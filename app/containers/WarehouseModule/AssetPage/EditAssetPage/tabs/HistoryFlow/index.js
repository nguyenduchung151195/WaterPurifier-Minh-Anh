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
import { API_HISTORY_FLOW } from 'config/urlConfig';
import { DatePicker } from 'material-ui-pickers';
import { serialize, fetchData } from '../../../../../../helper';
// import { fetchData  } from '../../helper';
const columns = ['ID thiết bị', 'Lưu lượng nước', 'Thời gian nhận bản ghi'];
function HistoryFlow(props) {
  const { classes, id } = props;
  const [data, setData] = useState();
  const [keys, setKeys] = useState();
  const [perPage, setPerPage] = useState(1);
  const [count, setCount] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const [dateFrom, setDateFrom] = useState();
  const [dateTo, setDateTo] = useState();

  const getApi = async (id, dateFrom, dateTo, pageIndex, pageSize) => {
    console.log('vaoooo3', API_HISTORY_FLOW);
    console.log('dateTo',dateTo);
    try {
      const INITIAL_QUERY = {
        filter: {
          timeFlow: {
            $gte: dateFrom || moment().format('YYYY-MM-DD'),
            $lte: dateTo || moment().format('YYYY-MM-DD'),
          },
          assetId : id
        },
        limit: pageSize || 10,
        skip: pageIndex*pageSize || 0,
      };
     
      let query = serialize(INITIAL_QUERY);
      console.log('query', query);
      const URL = `${API_HISTORY_FLOW}?${query}`;
      const respon = await fetchData(URL);
      console.log('respon', respon);
      setCount(respon.count);
      setData(respon && respon.data);
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
                setDateFrom(moment(date).startOf('day').toISOString());
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
                setDateTo(moment(date).endOf('day').toISOString());
              }}
              required
            />
          </div>
        </Grid>
      </Grid>
      <div style={{ overflow: 'auto', height: 500 }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell className={classes.customTableCell}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(data) &&
              data &&
              data.map(dt => {
                return (
                  <>
                    <TableRow>
                      <TableCell className={classes.customTableCell}>{dt && dt.assetId}</TableCell>
                      <TableCell className={classes.customTableCell}>{dt && dt.flow}</TableCell>
                      <TableCell className={classes.customTableCell}>{dt && dt.timeFlow}</TableCell>
                    </TableRow>
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

export default compose(withStyles(styles))(HistoryFlow);
