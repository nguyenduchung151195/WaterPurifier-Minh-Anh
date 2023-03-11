/* eslint-disable consistent-return */
/**
 *
 * PropertiesSet
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
import {
  Typography,
  Fab,
  TablePagination,
  // Checkbox,
  Button,
  TextField,
  Table,
  TableHead,
  TableBody,
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
// import { SortingState, IntegratedSorting, IntegratedFiltering } from '@devexpress/dx-react-grid';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

// const allId = [];

/* eslint-disable react/prefer-stateless-function */
class PropertiesSet extends React.Component {
  state = {
    rowsPerPage: 20, // số hàng hiển thị trên một bảng
    page: 0, // trang hiện tại
    content: [],
    // propertiesSet: [],
    onDelete: false,
    currentDelete: null,
    search: '',
  };

  componentDidUpdate() {
    const { successDelete } = this.props;
    if (successDelete) {
      this.props.changeCountAuto(0);
      this.handleClose();
    }
  }

  render() {
    const { classes, propertiesSet } = this.props;
    const { rowsPerPage, page } = this.state;
    // eslint-disable-next-line array-callback-return
    const temp = propertiesSet.filter(i => {
      // console.log(i)
      if (this.state.search === '') return true;
      if (i.code.indexOf(this.state.search) > -1 || i.name.indexOf(this.state.search) > -1 || i.describe.indexOf(this.state.search) > -1) return true;
    });
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
            onClick={() => this.handleClickOpen(item)}
          >
            <Delete />
          </Fab>
        </TableCell>
      </TableRow>
    ));
    return (
      <div style={{ width: '100%' }}>
        <Typography variant="h6">Danh sách bộ thuộc tính</Typography>
        <GridUI item md={12} container style={{ height: 40, marginBottom: 10 }}>
          <GridUI item md={3} container justify="flex-start">
            <TextField
              className={classes.search}
              label="Tìm kiếm"
              name="search"
              value={this.state.search}
              variant="outlined"
              onChange={this.handleChange}
              margin="dense"
            />
          </GridUI>
          <GridUI item md={8} container justify="flex-end">
            <Button component={Link} to="/setting/properties/propertiesSet" style={{ height: 40 }} variant="outlined" color="primary">
              Thêm mới
            </Button>
          </GridUI>
        </GridUI>
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
        <TablePagination
          rowsPerPageOptions={[15, 30, 50]}
          component="div"
          count={propertiesSet.length}
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
            <Button variant="outlined" onClick={this.handleClose} color="secondary" autoFocus>
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

  handleDeletes = () => {
    const { currentDelete } = this.state;
    // console.log(currentDelete);
    this.props.onDeletePropertiesSet(currentDelete);
  };

  handleClickOpen = item => {
    this.setState({ onDelete: true, currentDelete: item });
  };

  handleClose = () => {
    this.setState({ onDelete: false });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // handleSelectAll = () => {
  //   const selectAll = !this.state.selectAll;
  //   if (this.state.selectAll) {
  //     this.setState({ selected: [], selectAll });
  //   } else {
  //     this.setState({ selected: allId, selectAll });
  //   }
  // };

  handleEdit = id => {
    if (id !== 0) this.props.history.push(`/setting/properties/propertiesSet/${id}`);
  };

  // handleSelect = id => {
  //   const { selected } = this.state;
  //   const index = this.state.selected.findIndex(i => i === id);
  //   if (index === -1) selected.push(id);
  //   else selected.splice(index, 1);
  //   this.setState({ selected });
  // };
}

PropertiesSet.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default PropertiesSet;
