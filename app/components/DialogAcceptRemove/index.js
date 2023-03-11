/**
 *
 * DialogAcceptRemove
 *
 */

import React from 'react';
import { Dialog, DialogActions, Button, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

function DialogAcceptRemove(props) {
  return (
    <div>
      <Dialog
        open={props.openDialogRemove}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{props.title}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="secondary" variant="outlined">
            Hủy
          </Button>
          <Button onClick={props.handleDelete} color="primary" variant="outlined" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

DialogAcceptRemove.propTypes = {
  title: PropTypes.string,
  handleClose: PropTypes.func,
  openDialogRemove: PropTypes.bool,
};

export default DialogAcceptRemove;
