/* eslint-disable consistent-return */
/**
 *
 * ListOfProperties
 *
 */

import React from 'react';
// import {
//   Grid,
//   DragDropProvider,
//   Table,
//   TableHeaderRow,
//   TableColumnReordering,
//   TableColumnResizing,
//   TableFixedColumns,
// } from '@devexpress/dx-react-grid-material-ui';
// import { connect } from 'react-redux';
// import { createStructuredSelector } from 'reselect';
// import { compose } from 'redux';
// import styled from 'styled-components';
// import injectSaga from 'utils/injectSaga';
// import injectReducer from 'utils/injectReducer';
import {
  Typography,
  Fab,
  TablePagination,
  Button,
  TextField,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import GridUI from '@material-ui/core/Grid';
import { Edit, Delete } from '@material-ui/icons';

import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// import makeSelectPropertiesPage from '../../containers/PropertiesPage/selectors';
// import reducer from '../../containers/PropertiesPage/reducer';
// import saga from '../../containers/PropertiesPage/saga';
// import { SortingState, IntegratedSorting, IntegratedFiltering } from '@devexpress/dx-react-grid';
// import styled from 'styled-components';
// import { resetNoti, deletePropertieAct } from '../../containers/PropertiesPage/actions';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
class ListOfProperties extends React.Component {
  state = {
    rowsPerPage: 20, // số hàng hiển thị trên một bảng
    page: 0, // trang hiện tại
    onDelete: false,
    id: '',
    content: '',
    search: '',
  };

  componentDidUpdate() {
    const { successDelete } = this.props;
    if (successDelete) {
      this.props.changeCountAuto(2);
      this.handleClose();
    }
  }

  render() {
    const { classes, propertiesList } = this.props;
    // console.log(this.props.propertiesList);
    const { rowsPerPage, page } = this.state;
    // eslint-disable-next-line array-callback-return
    const temp = propertiesList.filter(i => {
      // console.log(i)
      if (this.state.search === '') return true;
      if (i.code.indexOf(this.state.search) > -1 || i.name.indexOf(this.state.search) > -1 || i.describe.indexOf(this.state.search) > -1) return true;
    });
    // console.log(temp)
    this.state.content = temp.slice(rowsPerPage * page, rowsPerPage * page + rowsPerPage).map(item => (
      <TableRow key={item.id}>
        <TableCell>{item.code}</TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.describe}</TableCell>
        <TableCell>
          <Fab size="small" title="Chỉnh sửa" style={{ marginLeft: 10 }} color="primary" onClick={() => this.handleEdit(item.id)}>
            {' '}
            <Edit color="default" />
          </Fab>
          &nbsp;
          <Fab
            size="small"
            title="Xóa mục đã chọn"
            style={{ marginLeft: 10, color: '#fff' }}
            color="secondary"
            onClick={() => this.handleClickOpen(item.id)}
          >
            <Delete />
          </Fab>
        </TableCell>
      </TableRow>
    ));
    // console.log(this.state.content)
    return (
      <div style={{ width: '100%' }}>
        <Typography variant="h6">Danh sách thuộc tính</Typography>
        <GridUI item md={12} container style={{ height: 40, marginBottom: 10 }}>
          <GridUI item md={3} container justify="flex-start">
            <TextField
              className={classes.search}
              label="Tìm kiếm"
              margin="dense"
              variant="outlined"
              name="search"
              value={this.state.search}
              onChange={this.handleChange}
            />
          </GridUI>
          <GridUI item md={8} container justify="flex-end">
            <Button component={Link} to="/setting/properties/properties/0" style={{ height: 40 }} variant="outlined" color="primary">
              Thêm mới
            </Button>
          </GridUI>
        </GridUI>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{this.state.content ? this.state.content : ''}</TableBody>
        </Table>
        {/* <Grid rows={newRows} columns={newColumns} style={{ width: '100%' }}>
          <SortingState defaultSorting={[{ columnName: 'title', direction: 'asc' }]} />
          <DragDropProvider />
          <IntegratedFiltering />
          <IntegratedSorting />
          <Table />
          {columnOrder.length !== 0 ? <TableColumnReordering defaultOrder={columnOrder} /> : null}
          {columnOrder.length !== 0 ? <TableColumnResizing defaultColumnWidths={this.state.defaultColumnWidths} /> : null}

          <TableHeaderRow showSortingControls />
          <SortingState defaultSorting={[{ columnName: 'name', direction: 'asc' }]} />
          <SearchState defaultValue="" />
          <TableFixedColumns rightColumns={this.state.rightColumns} />
        </Grid> */}
        <TablePagination
          rowsPerPageOptions={[15, 30, 50]}
          component="div"
          count={propertiesList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Trang trước',
          }}
          nextIconButtonProps={{
            'aria-label': 'Trang tiếp theo',
          }}
          labelRowsPerPage="Hiển thị: "
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
        {/* <FormattedMessage {...messages.header} /> */}
        <Dialog
          open={this.state.onDelete}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Bạn có chắc chắn muốn xóa?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="primary" onClick={() => this.handleDeletes()}>
              LƯU
            </Button>
            <Button onClick={this.handleClose} variant="outlined" color="secondary" autoFocus>
              HỦY
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  // Thay đổi số dòng trên một trang
  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleEdit = id => {
    if (id !== 0) this.props.history.push(`/setting/properties/properties/${id}`);
  };

  handleDeletes = () => {
    this.props.onDeletePropertie(this.state.id);
  };

  handleClickOpen = id => {
    this.setState({ onDelete: true, id });
  };

  handleClose = () => {
    this.setState({ onDelete: false });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
}

ListOfProperties.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default ListOfProperties;
