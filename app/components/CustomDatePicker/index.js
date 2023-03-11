import React, { memo, useEffect, useState } from 'react';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import TodayIcon from '@material-ui/icons/Today';
import { IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

function CustomDatePicker(props) {
  const { value, label, onChange, top, right, ...restProps } = props;
  function handleClr(e) {
    e.stopPropagation();
    onChange(null);
  }
  return (
    <MuiPickersUtilsProvider utils={MomentUtils} locale="vi-VN">
      <div style={{ position: 'relative' }}>
        <DatePicker
          style={{ width: '100%' }}
          invalidLabel="DD/MM/YYYY"
          // invalidDateMessage="Nhập ngày"
          inputVariant="outlined"
          format="DD/MM/YYYY"
          variant="outlined"
          margin="dense"
          required
          fullWidth
          onChange={onChange}
          label={label}
          value={value}
          keyboard
          keyboardIcon={<TodayIcon style={{ width: '85%' }} />}
          // InputProps={{
          //   endAdornment: (
          //     <IconButton edge="end" left onClick={e => handleClr(e)}>
          //       <ClearIcon />
          //     </IconButton>
          //   ),
          // }}
          {...restProps}
        />
        {value ? (
          <IconButton
            style={{ position: 'absolute', top: top ? top : '9px', right: right ? right : '27px' }}
            edge="end"
            size="small"
            onClick={() => onChange(null)}
          >
            <ClearIcon />
          </IconButton>
        ) : null}
      </div>
    </MuiPickersUtilsProvider>
  );
}
export default memo(CustomDatePicker);
