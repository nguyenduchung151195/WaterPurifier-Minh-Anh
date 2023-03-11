import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, TextField } from '@material-ui/core';
import React, { memo, useEffect, useState, useCallback } from 'react';
import { compose } from 'redux';
import CustomButton from 'components/Button/CustomButton';
import CustomInputBase from 'components/Input/CustomInputBase';
import { AsyncAutocomplete, Autocomplete } from 'components/LifetekUi';
import { API_PERSONNEL, API_HRM_EMPLOYEE } from 'config/urlConfig';
import Department from 'components/Filter/DepartmentAndEmployee';
import moment from 'moment';
import CustomDatePicker from '../../../../../components/CustomDatePicker';
import CustomGroupInputField from '../../../../../components/Input/CustomGroupInputField';

function AddTakeLeaveManager(props) {
  const { onSave, onClose, data, name2Title, open, profile, onChangeSnackbar } = props;
  const [localData, setLocalData] = useState({
    // hrmEmployeeId: {},
    date: moment().format('YYYY-MM-DD'),
    approved: [],
    type: '',
    reason: '',
  });

  const [vacationMode, setVactionMode] = useState([]);
  const [localMessages, setLocalMessages] = useState({});
  useEffect(() => {
    const viewConfig = JSON.parse(localStorage.getItem('hrmSource')) || null;
    const viewConfigCode = viewConfig ? viewConfig.filter(item => item.code === 'S19') : null;
    const data = viewConfigCode ? viewConfigCode[0].data : null;
    setVactionMode(data);
  }, []);
  useEffect(
    () => {
      if (data && data.originItem) {
        setLocalData({
          _id: data.originItem._id,
          reason: data.originItem.reason,
          date: data.originItem.date ? moment(data.originItem.date).format('YYYY-MM-DD') : '',
          hrmEmployeeId: { _id: data.originItem.hrmEmployeeId, name: data.originItem.name },
          organizationUnitId: data.originItem.organizationUnitId,
          type: data.originItem.type,
        });
      } else {
        setLocalData({});
      }
    },
    [data],
  );

  const handleChange = useCallback(
    e => {
      const {
        target: { value, name },
      } = e;
      setLocalData({
        ...localData,
        [name]: value,
      });
    },
    [localData],
  );

  const handleInputChange = e => {
    const name = 'date';
    const value = moment(e).format('YYYY-MM-DD');
    setLocalData({ ...localData, [name]: value });
  };

  const handeChangeDepartment = useCallback(
    result => {
      const { department, employee } = result;
      setLocalData({ ...localData, organizationUnitId: department, hrmEmployeeId: employee });
    },
    [localData],
  );

  // const handleOtherDataChange = useCallback(
  //   newOther => {
  //     setLocalData(state => ({ ...state, others: newOther }));
  //   },
  //   [localData],
  // );
  // console.log('fdsafdsa', localData);

  const getSelectedValue = val => {
    if (!val) return null;
    return vacationMode.find(i => i._id === val._id);
  };
  const handleSave = () => {
    if (localData.organizationUnitId && localData.hrmEmployeeId !== null) {
      onSave(localData);
    } else {
      if (!localData.organizationUnitId) {
        onChangeSnackbar({ status: true, message: 'Không được để trống phòng ban', variant: 'error' });
      }
      if (localData.hrmEmployeeId === null) {
        onChangeSnackbar({ status: true, message: 'Không được để trống nhân viên', variant: 'error' });
      }
    }
  };

  const handleClose = () => {
    onClose();
    setLocalData({});
  };
  return (
    <React.Fragment>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle id="alert-dialog-title">{data && data.originItem ? 'Sửa nghỉ phép' : 'Thêm nghỉ phép'}</DialogTitle>
        <DialogContent style={{ width: 600 }}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Department
                onChange={handeChangeDepartment}
                department={localData.organizationUnitId}
                isHrm
                employee={localData.hrmEmployeeId}
                profile={profile}
                moduleCode="TakeLeave"
              />
            </Grid>
            <Grid item xs={6}>
              <CustomDatePicker
                invalidDateMessage="Vui lòng nhập ngày nghỉ"
                label={name2Title.date}
                value={localData.date}
                onChange={e => handleInputChange(e, true)}
                name="date"
              />
            </Grid>
            <Grid item xs={6}>
              <CustomInputBase select label={name2Title['type.title']} value={getSelectedValue(localData.type)} onChange={handleChange} name="type">
                {Array.isArray(vacationMode) && vacationMode.length && vacationMode.map(item => <MenuItem value={item}>{item.title}</MenuItem>)}
              </CustomInputBase>
            </Grid>
            <Grid item xs={12}>
              <CustomInputBase label={name2Title.reason} value={localData.reason} onChange={handleChange} name="reason" />
            </Grid>
            {/* <Grid item xs={12}>
              <CustomGroupInputField code="TakeLeave" columnPerRow={2} value={localData.others} onChange={handleOtherDataChange} />
            </Grid> */}
          </Grid>
        </DialogContent>
        {/* <DialogActions>
          <Grid container spacing={8} justify="flex-end">
            <Grid item>
              <CustomButton disabled={!localData.hrmEmployeeId || !localData.type} varian="outlined" color="primary" onClick={handleSave}>
                Lưu
              </CustomButton>
            </Grid>
            <Grid item>
              <CustomButton varian="outlined" color="secondary" onClick={e => onClose()}>
                HỦY
              </CustomButton>
            </Grid>
          </Grid>
        </DialogActions> */}
        <DialogActions>
          <Grid item xs={12}>
            <Grid container spacing={8} justify="flex-end">
              <Grid item>
                <CustomButton
                  color="primary"
                  onClick={e => {
                    if (Object.keys(localMessages).length === 0) {
                      handleSave();
                    } else {
                      onChangeSnackbar({ status: true, message: 'Thêm mới thất bại!', variant: 'error' });
                    }
                  }}
                  varian="outlined"
                >
                  Lưu
                </CustomButton>
              </Grid>
              <Grid item>
                <CustomButton varian="outlined" color="secondary" onClick={e => handleClose()}>
                  HỦY
                </CustomButton>
              </Grid>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default compose(memo)(AddTakeLeaveManager);
