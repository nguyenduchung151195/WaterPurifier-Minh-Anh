/**
 *
 * AddDismissed
 *
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Info } from '@material-ui/icons';
import { Grid, Typography, FileUpload } from '../../../../../../../../components/LifetekUi';
import CustomInputBase from '../../../../../../../../components/Input/CustomInputBase';
import CustomButton from '../../../../../../../../components/Button/CustomButton';
import CustomGroupInputField from '../../../../../../../../components/Input/CustomGroupInputField';
import { viewConfigName2Title, viewConfigCheckForm, viewConfigCheckRequired } from 'utils/common';
import CustomAppBar from 'components/CustomAppBar';

/* eslint-disable react/prefer-stateless-function */
function AddDismissed(props) {
  const { dismissed, onSave, onClose, code, fileName, hrmEmployeeId } = props;
  const [localState, setLocalState] = useState({
    others: {},
  });
  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const [name2Title, setName2Title] = useState({});

  useEffect(() => {
    const newName2Title = viewConfigName2Title(code);
    setName2Title(newName2Title);
    const checkRequired = viewConfigCheckRequired(code, 'required');
    setLocalCheckRequired(checkRequired);
    const checkShowForm = viewConfigCheckRequired(code, 'showForm');
    setLocalCheckShowForm(checkShowForm);
    return () => {
      newName2Title;
      checkRequired;
      checkShowForm;
    };
  }, []);

  useEffect(
    () => {
      if (dismissed && dismissed.originItem) {
        setLocalState({ ...dismissed.originItem });
      } else {
        setLocalState({
          hrmEmployeeId: hrmEmployeeId,
        });
      }
    },
    [dismissed],
  );

  const handleInputChange = e => {
    setLocalState({ ...localState, [e.target.name]: e.target.value });
  };

  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );

  return (
    <div style={{ width: 'calc(100vw - 260px)', padding: 20 }}>
      <CustomAppBar title="Thông tin kiêm nhiệm" onGoBack={() => props.onClose && props.onClose()} onSubmit={() => onSave(localState)} />
      <Grid style={{ marginTop: 60 }} />

      <Grid container spacing={8}>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.decisionNumber}
            value={localState.decisionNumber}
            name="decisionNumber"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.decisionNumber}
            required={localCheckRequired && localCheckRequired.decisionNumber}
            error={localMessages && localMessages.decisionNumber}
            helperText={localMessages && localMessages.decisionNumber}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="date"
            label={name2Title.startDate}
            value={localState.startDate}
            name="startDate"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.startDate}
            required={localCheckRequired && localCheckRequired.startDate}
            error={localMessages && localMessages.startDate}
            helperText={localMessages && localMessages.startDate}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="date"
            label={name2Title.endDate}
            value={localState.endDate}
            name="endDate"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.endDate}
            required={localCheckRequired && localCheckRequired.endDate}
            error={localMessages && localMessages.endDate}
            helperText={localMessages && localMessages.endDate}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.organizationUnit}
            value={localState.organizationUnit}
            name="organizationUnit"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.organizationUnit}
            required={localCheckRequired && localCheckRequired.organizationUnit}
            error={localMessages && localMessages.organizationUnit}
            helperText={localMessages && localMessages.organizationUnit}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.positionConcur}
            value={localState.positionConcur}
            name="positionConcur"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.positionConcur}
            required={localCheckRequired && localCheckRequired.positionConcur}
            error={localMessages && localMessages.positionConcur}
            helperText={localMessages && localMessages.positionConcur}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.note}
            rows={4}
            value={localState.note}
            name="note"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.note}
            required={localCheckRequired && localCheckRequired.note}
            error={localMessages && localMessages.note}
            helperText={localMessages && localMessages.note}
          />
        </Grid>
        {/* <Grid item xs={4}>
          <CustomInputBase type="file" label={name2Title.file} value={localState.file} name="file"
            // onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.file}
            required={localCheckRequired && localCheckRequired.file}
            error={localMessages && localMessages.file}
            helperText={localMessages && localMessages.file} />
        </Grid> */}
        <Grid item xs={12}>
          {dismissed && <FileUpload name={`${fileName}/Thông tin kinh nghiệm ${dismissed._id}`} id={dismissed._id} code={'hrm/' + fileName} />}
        </Grid>
      </Grid>
      <CustomGroupInputField code={code} columnPerRow={3} value={localState.others} onChange={handleOtherDataChange} />
    </div>
  );
}

AddDismissed.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

export default memo(AddDismissed);
