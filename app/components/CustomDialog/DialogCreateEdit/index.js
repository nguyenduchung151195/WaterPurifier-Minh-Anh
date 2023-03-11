import React, { useEffect, memo, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import CustomInputBase from '../../Input/CustomInputBase';
import CustomButton from '../../Button/CustomButton';

function DialogCreateEdit(props) {
  const { openModal, handleClose, handleEdit, handleAdd, title, label, isEdit, value, onChangeInput, error } = props;
  return (
    <Dialog open={openModal} onClose={handleClose}>
      <DialogTitle id="alert-dialog-title">{isEdit ? 'Cập nhật ' + title : 'Thêm mới ' + title}</DialogTitle>
      <DialogContent style={{ width: 600 }}>
        <CustomInputBase
          fullWidth
          id="standard-name"
          label={label}
          value={value}
          inputProps={{ maxLength: 250 }}
          onChange={e => onChangeInput(e.target.value)}
          margin="normal"
          // name={value}
          error={error && error.title}
          helperText={error && error.title}
        />
      </DialogContent>
      <DialogActions>
        <CustomButton
          onClick={() => {
            // handleClose()
            if (isEdit) {
              handleEdit();
            } else {
              handleAdd();
            }
          }}
          color="primary"
        >
          {isEdit ? 'LƯU' : 'LƯU'}
        </CustomButton>
        <CustomButton onClick={handleClose} color="secondary" autoFocus>
          Hủy
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
export default memo(DialogCreateEdit);
