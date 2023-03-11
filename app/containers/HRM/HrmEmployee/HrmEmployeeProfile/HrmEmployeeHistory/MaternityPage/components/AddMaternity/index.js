/**
 *
 * AddMaternity
 *
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Info } from '@material-ui/icons';
import { Checkbox } from '@material-ui/core';
import { Grid, Typography } from '../../../../../../../../components/LifetekUi';
import CustomInputBase from '../../../../../../../../components/Input/CustomInputBase';
import CustomButton from '../../../../../../../../components/Button/CustomButton';
import CustomGroupInputField from '../../../../../../../../components/Input/CustomGroupInputField';
import { viewConfigName2Title, viewConfigCheckForm, viewConfigCheckRequired } from 'utils/common';
import CustomAppBar from 'components/CustomAppBar';
/* eslint-disable react/prefer-stateless-function */
function AddMaternity(props) {
  const { maternity, onSave, onClose, code, hrmEmployeeId } = props;
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
      if (maternity && maternity.originItem) {
        setLocalState({ ...maternity.originItem });
      } else {
        setLocalState({
          hrmEmployeeId: hrmEmployeeId,
        });
      }
    },
    [maternity],
  );

  useEffect(
    () => {
      const messages = viewConfigCheckForm(code, localState);
      setLocalMessages(messages);
      return () => {
        messages;
      };
    },
    [localState],
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

  const handeCheckbox = (name, value) => {
    setLocalState({ ...localState, [name]: value });
  };

  return (
    <>
      <div style={{ width: 'calc(100vw - 260px)', padding: 20 }}>
        <CustomAppBar
          title="Thông tin thai sản"
          onGoBack={() => onClose()}
          // onSubmit={this.onSubmit}
          onSubmit={e => {
            onSave(localState);
          }}
        />
        <Grid container style={{ marginTop: 60 }} />
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
              label={name2Title.decisionDate}
              value={localState.decisionDate}
              name="decisionDate"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.decisionDate}
              required={localCheckRequired && localCheckRequired.decisionDate}
              error={localMessages && localMessages.decisionDate}
              helperText={localMessages && localMessages.decisionDate}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" color="primary">
              <Info />
              Chế độ từ ngày/tới ngày
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <CustomInputBase
              type="date"
              label={name2Title.dateFounded}
              value={localState.dateFounded}
              name="dateFounded"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.dateFounded}
              required={localCheckRequired && localCheckRequired.dateFounded}
              error={localMessages && localMessages.dateFounded}
              helperText={localMessages && localMessages.dateFounded}
            />
          </Grid>

          <Grid item xs={4}>
            <CustomInputBase
              type="date"
              label={name2Title.duedate}
              value={localState.duedate}
              name="duedate"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.duedate}
              required={localCheckRequired && localCheckRequired.duedate}
              error={localMessages && localMessages.duedate}
              helperText={localMessages && localMessages.duedate}
            />
          </Grid>

          <Grid item xs={4}>
            <CustomInputBase
              type="date"
              label={name2Title.dateOfBirth}
              value={localState.dateOfBirth}
              name="dateOfBirth"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.dateOfBirth}
              required={localCheckRequired && localCheckRequired.dateOfBirth}
              error={localMessages && localMessages.dateOfBirth}
              helperText={localMessages && localMessages.dateOfBirth}
            />
          </Grid>

          <Grid item xs={4}>
            <CustomInputBase
              type="date"
              label={name2Title.backDate}
              value={localState.backDate}
              name="backDate"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.backDate}
              required={localCheckRequired && localCheckRequired.backDate}
              error={localMessages && localMessages.backDate}
              helperText={localMessages && localMessages.backDate}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography>
              <Checkbox
                color="primary"
                checked={localState.adoptedChild ? localState.adoptedChild : false}
                onChange={e => handeCheckbox('adoptedChild', e.target.checked)}
              />
              Nuôi con nuôi
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              type="number"
              label={name2Title.ageChild}
              value={localState.ageChild}
              name="ageChild"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.ageChild}
              required={localCheckRequired && localCheckRequired.ageChild}
              error={localMessages && localMessages.ageChild}
              helperText={localMessages && localMessages.ageChild}
            />
          </Grid>

          <Grid item xs={4}>
            <CustomInputBase
              type="number"
              label={name2Title.numbericalChild}
              value={localState.numbericalChild}
              name="numbericalChild"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.numbericalChild}
              required={localCheckRequired && localCheckRequired.numbericalChild}
              error={localMessages && localMessages.numbericalChild}
              helperText={localMessages && localMessages.numbericalChild}
            />
          </Grid>

          <Grid item xs={4}>
            <CustomInputBase
              type="date"
              label={name2Title.fromMonth}
              value={localState.fromMonth}
              name="fromMonth"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.fromMonth}
              required={localCheckRequired && localCheckRequired.fromMonth}
              error={localMessages && localMessages.fromMonth}
              helperText={localMessages && localMessages.fromMonth}
            />
          </Grid>

          <Grid item xs={4}>
            <CustomInputBase
              type="date"
              label={name2Title.toMonth}
              value={localState.toMonth}
              name="toMonth"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.toMonth}
              required={localCheckRequired && localCheckRequired.toMonth}
              error={localMessages && localMessages.toMonth}
              helperText={localMessages && localMessages.toMonth}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" color="primary">
            <Info />
            Sinh con - Tên con - Dưỡng sức
          </Typography>
        </Grid>
        <Grid container spacing={8}>
          <Grid item xs={4}>
            <CustomInputBase
              type="date"
              label={name2Title.dateOfBirthChild}
              value={localState.dateOfBirthChild}
              name="dateOfBirthChild"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.dateOfBirthChild}
              required={localCheckRequired && localCheckRequired.dateOfBirthChild}
              error={localMessages && localMessages.dateOfBirthChild}
              helperText={localMessages && localMessages.dateOfBirthChild}
            />
          </Grid>

          <Grid item xs={4}>
            <CustomInputBase
              type="date"
              label={name2Title.decisionDate}
              value={localState.decisionDate}
              name="decisionDate"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.decisionDate}
              required={localCheckRequired && localCheckRequired.decisionDate}
              error={localMessages && localMessages.decisionDate}
              helperText={localMessages && localMessages.decisionDate}
            />
          </Grid>

          <Typography style={{ width: '23%', marginLeft: 10 }}>
            <Checkbox
              color="primary"
              checked={localState.keepHealth ? localState.keepHealth : false}
              onChange={e => handeCheckbox('keepHealth', e.target.checked)}
            />
            Có nghỉ dưỡng sức
          </Typography>

          <Grid item xs={4}>
            <CustomInputBase
              type="date"
              label={name2Title.atHome}
              value={localState.atHome}
              name="atHome"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.atHome}
              required={localCheckRequired && localCheckRequired.atHome}
              error={localMessages && localMessages.atHome}
              helperText={localMessages && localMessages.atHome}
            />
          </Grid>

          <Grid item xs={4}>
            <CustomInputBase
              type="date"
              label={name2Title.concentrate}
              value={localState.concentrate}
              name="concentrate"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.concentrate}
              required={localCheckRequired && localCheckRequired.concentrate}
              error={localMessages && localMessages.concentrate}
              helperText={localMessages && localMessages.concentrate}
            />
          </Grid>

          <Grid item xs={4}>
            <CustomInputBase
              label={name2Title.nameChild1}
              value={localState.nameChild1}
              name="nameChild1"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.nameChild1}
              required={localCheckRequired && localCheckRequired.nameChild1}
              error={localMessages && localMessages.nameChild1}
              helperText={localMessages && localMessages.nameChild1}
            />
          </Grid>

          <Grid item xs={4}>
            <CustomInputBase
              label={name2Title.nameChild2}
              value={localState.nameChild2}
              name="nameChild2"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.nameChild2}
              required={localCheckRequired && localCheckRequired.nameChild2}
              error={localMessages && localMessages.nameChild2}
              helperText={localMessages && localMessages.nameChild2}
            />
          </Grid>

          <Grid item xs={4}>
            <CustomInputBase
              label={name2Title.nameChild3}
              value={localState.nameChild3}
              name="nameChild3"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.nameChild3}
              required={localCheckRequired && localCheckRequired.nameChild3}
              error={localMessages && localMessages.nameChild3}
              helperText={localMessages && localMessages.nameChild3}
            />
          </Grid>

          <Grid item xs={4}>
            <CustomInputBase
              label={name2Title.nameChild4}
              value={localState.nameChild4}
              name="nameChild4"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.nameChild4}
              required={localCheckRequired && localCheckRequired.nameChild4}
              error={localMessages && localMessages.nameChild4}
              helperText={localMessages && localMessages.nameChild4}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              type="number"
              label={name2Title.ageChild}
              value={localState.ageChild}
              name="ageChild"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.ageChild}
              required={localCheckRequired && localCheckRequired.ageChild}
              error={localMessages && localMessages.ageChild}
              helperText={localMessages && localMessages.ageChild}
            />
          </Grid>

          <Grid item xs={4}>
            <CustomInputBase
              type="number"
              label={name2Title.numbericalChild}
              value={localState.numbericalChild}
              name="numbericalChild"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.numbericalChild}
              required={localCheckRequired && localCheckRequired.numbericalChild}
              error={localMessages && localMessages.numbericalChild}
              helperText={localMessages && localMessages.numbericalChild}
            />
          </Grid>

          <Grid item xs={4}>
            <CustomInputBase
              type="date"
              label={name2Title.fromMonth}
              value={localState.fromMonth}
              name="fromMonth"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.fromMonth}
              required={localCheckRequired && localCheckRequired.fromMonth}
              error={localMessages && localMessages.fromMonth}
              helperText={localMessages && localMessages.fromMonth}
            />
          </Grid>

          <Grid item xs={4}>
            <CustomInputBase
              type="date"
              label={name2Title.toMonth}
              value={localState.toMonth}
              name="toMonth"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.toMonth}
              required={localCheckRequired && localCheckRequired.toMonth}
              error={localMessages && localMessages.toMonth}
              helperText={localMessages && localMessages.toMonth}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" color="primary">
              <Info />
              Thông tin thêm
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              type="number"
              label={name2Title.salarySocialInsurance}
              value={localState.salarySocialInsurance}
              name="salarySocialInsurance"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.salarySocialInsurance}
              required={localCheckRequired && localCheckRequired.salarySocialInsurance}
              error={localMessages && localMessages.salarySocialInsurance}
              helperText={localMessages && localMessages.salarySocialInsurance}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              type="number"
              label={name2Title.minimumWage}
              value={localState.minimumWage}
              name="minimumWage"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.minimumWage}
              required={localCheckRequired && localCheckRequired.minimumWage}
              error={localMessages && localMessages.minimumWage}
              helperText={localMessages && localMessages.minimumWage}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              type="number"
              label={name2Title.averageWage}
              value={localState.averageWage}
              name="averageWage"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.averageWage}
              required={localCheckRequired && localCheckRequired.averageWage}
              error={localMessages && localMessages.averageWage}
              helperText={localMessages && localMessages.averageWage}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              type="number"
              label={name2Title.benefitAmount}
              value={localState.benefitAmount}
              name="benefitAmount"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.benefitAmount}
              required={localCheckRequired && localCheckRequired.benefitAmount}
              error={localMessages && localMessages.benefitAmount}
              helperText={localMessages && localMessages.benefitAmount}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              type="number"
              label={name2Title.averageWageFostering}
              value={localState.averageWageFostering}
              name="averageWageFostering"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.averageWageFostering}
              required={localCheckRequired && localCheckRequired.averageWageFostering}
              error={localMessages && localMessages.averageWageFostering}
              helperText={localMessages && localMessages.averageWageFostering}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputBase
              type="number"
              label={name2Title.moneyFostering}
              value={localState.moneyFostering}
              name="moneyFostering"
              onChange={handleInputChange}
              checkedShowForm={localCheckShowForm && localCheckShowForm.moneyFostering}
              required={localCheckRequired && localCheckRequired.moneyFostering}
              error={localMessages && localMessages.moneyFostering}
              helperText={localMessages && localMessages.moneyFostering}
            />
          </Grid>
        </Grid>
        <CustomGroupInputField code={code} columnPerRow={3} value={localState.others} onChange={handleOtherDataChange} />
      </div>
    </>
  );
}

AddMaternity.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  // dispatch: PropTypes.func.isRequired,
};

export default memo(AddMaternity);
