/**
 *
 * AddRecruitment
 *
 */

import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Info, Close } from '@material-ui/icons';
import { TextField } from 'components/LifetekUi';

import { Grid, Typography, AsyncAutocomplete } from 'components/LifetekUi';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomButton from 'components/Button/CustomButton';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
import Department from 'components/Filter/DepartmentAndEmployee';
import { viewConfigName2Title, viewConfigCheckRequired, viewConfigCheckForm } from 'utils/common';
import moment from 'moment';
import Buttons from 'components/CustomButtons/Button';
import { Helmet } from 'react-helmet';
import { API_USERS, API_HRM_RECRUITMEN, API_RECRUITMENT, API_HUMAN_RESOURCE } from 'config/urlConfig';
import { MenuItem, Button, Checkbox, Avatar, FormControlLabel, AppBar, Toolbar, IconButton } from '@material-ui/core';
import CustomInputField from 'components/Input/CustomInputField';
import KanbanStepper from 'components/KanbanStepper';
import { ValidatorForm } from 'react-material-ui-form-validator';
import CustomDatePicker from '../../../../../../components/CustomDatePicker';
import './style.css';
import CustomAppBar from 'components/CustomAppBar';
import { mergeData as MergeData } from '../../../../../Dashboard/actions';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

/* eslint-disable react/prefer-stateless-function */

function AddRecruitment(props) {
  const [localState, setLocalState] = useState({
    code: '',
    decisionNo: '',
    amount: '',
    name: '',
    hrmRecruitmentId: '',
    vacancy: '',
  });

  const [kanbanStatuses, setKanbanStatuses] = useState(['']);
  const [name2Title, setName2Title] = useState({});
  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});

  const { recruitmentWavePage, recruitmentWave, onSave, onClose, code, onGetRoleGroup } = props;
  const { roleGroups } = recruitmentWavePage;
  useEffect(() => {
    onGetRoleGroup();
    setName2Title({ ...viewConfigName2Title(code) });
    setLocalCheckRequired(viewConfigCheckRequired(code, 'required'));
    setLocalCheckShowForm(viewConfigCheckRequired(code, 'showForm'));
    setLocalMessages(viewConfigCheckForm(code, localState));

    const listCrmStatus = JSON.parse(localStorage.getItem('hrmStatus'));
    const crmStatus = listCrmStatus ? listCrmStatus.find(element => String(element.code) === 'ST09') : null;
    if (crmStatus) {
      setKanbanStatuses(crmStatus.data);
    }
  }, []);

  useEffect(
    () => {
      setLocalMessages(viewConfigCheckForm(code, localState));
    },
    [localState],
  );
  useEffect(
    () => {
      setLocalState(localState => ({ kanbanStatus: kanbanStatuses[0] && kanbanStatuses[0]._id, ...localState }));
    },
    [kanbanStatuses],
  );

  useEffect(
    () => {
      if (recruitmentWave && recruitmentWave.originItem) {
        setLocalState({ ...recruitmentWave.originItem, gender: getGender(recruitmentWave.originItem.gender) });
      } else {
        setLocalState({
          code: '',
          decisionNo: '',
          amount: '',
          name: '',
          hrmRecruitmentId: '',
          vacancy: '',
        });
      }
    },
    [recruitmentWave],
  );

  const handleInputChange = useCallback(
    (e, isDate) => {
      const name = isDate ? 'dateNeed' : 'dateFounded';
      const value = isDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
      setLocalState({ ...localState, [name]: value });
      setLocalState({ ...localState, [e.target.name]: e.target.value });
    },
    [localState],
  );
  useEffect(() => {
    if (localState && localState.vacanciesId) {
      props.getId(localState.vacanciesId);
    }
  }, []);

  const handleHrmRecruitmentChange = useCallback(
    e => {
      const vacancy = e.vacancy;
      const role = roleGroups.find(role => role.code === vacancy.roleCode);
      const description = role && role.description;
      setLocalState({
        hrmRecruitmentId: e,
        dateFounded: formatDate(moment()),
        dateNeed: formatDate(moment()),
        name: e.name + ' - ' + vacancy.roleName,
        vacancy: vacancy,
        vacanciesId: e.vacanciesId ? e.vacanciesId._id : null,
        certificate: e.certificate,
        specialized: e.specialized,
        age: e.age,
        levelLanguage: e.levelLanguage,
        marriage: e.marriage,
        proponent: e.proponent,
        reason: e.reason,
        amount: e.amount,
        experienceYear: e.experienceYear ? e.experienceYear : null,
        gender: e.gender ? getGender(e.gender) : null,
        skill: e.skill ? e.skill : null,
        experience: e.experience ? e.experience : null,
        requirementsOther: e.requirementsOther ? e.requirementsOther : null,
        code: e.code ? e.code : null,
        decisionNo: e.decisionNo ? e.decisionNo : null,
        startingSalary: e.startingSalary ? e.startingSalary : null,
        cvDescription: description,
        contact: e.contact ? e.contact : null,
        informatics: e.informatics ? e.informatics : null,
        kanbanStatus: localState.kanbanStatus,
      });
    },
    [localState],
  );

  const formatDate = date => {
    if (date) {
      return moment(date).format('YYYY-MM-DD');
    }
    return date;
  };

  const getGender = gender => {
    if (recruitmentWave) {
      props.getId(recruitmentWave.vacanciesId);
      props.getRecruitmentWaveId(recruitmentWave._id);
      props.getRecruitmentWaveCode(recruitmentWave.code);
    }

    if (recruitmentWave && recruitmentWave.gender && recruitmentWave.gender.toLowerCase() === 'nam') gender = '0';
    if (recruitmentWave && recruitmentWave.gender && recruitmentWave.gender.toLowerCase() === 'nữ') gender = '1';
    return gender;
  };
  useEffect(() => {
    return () => {
      setTimeout(() => {
        props.onMergeData && props.onMergeData({ hiddenHeader: false });
      }, 1);
    };
  }, []);

  return (
    <div>
      <CustomAppBar
        title={props.recruitmentWave === null ? 'THÊM MỚI đợt tuyển dụng' : 'CẬP NHẬT đợt tuyển dụng'}
        onGoBack={e => onClose()}
        onSubmit={() => {
          onSave(localState);
        }}
        className
        isTask
      />

      <Grid item xs={12}>
        <KanbanStepper
          listStatus={kanbanStatuses}
          onKabanClick={values => setLocalState({ ...localState, kanbanStatus: values })}
          activeStep={localState.kanbanStatus}
        />
      </Grid>
      <Grid container>
        <Typography variant="h5" color="primary" style={{ fontSize: 16, fontWeight: 500 }}>
          <Info />
          Đợt tuyển dụng
        </Typography>
      </Grid>
      <Grid container spacing={16} style={{ paddingLeft: '10px', paddingRight: '10px' }}>
        {!localState._id && (
          <React.Fragment>
            <Grid item xs={8}>
              <AsyncAutocomplete
                className="CustomForm"
                value={localState.hrmRecruitmentId}
                label={name2Title.hrmRecruitmentId}
                error={localMessages && localMessages['hrmRecruitmentId']}
                helperText={localMessages && localMessages['hrmRecruitmentId']}
                checkedShowForm={localCheckShowForm && localCheckShowForm['']}
                required={localCheckRequired && localCheckRequired['hrmRecruitmentId']}
                onChange={handleHrmRecruitmentChange}
                url={API_RECRUITMENT}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" color="primary" style={{ fontSize: 16, fontWeight: 500 }}>
                <Info />
                THÔNG TIN CHI TIẾT
              </Typography>
            </Grid>
          </React.Fragment>
        )}

        <Grid item xs={4}>
          <CustomInputBase
            select
            label={name2Title['vacancy.roleName']}
            value={localState.vacancy}
            name="vacancy"
            error={localState.vacancy === '' ? true : false}
            helperText={localState.vacancy !== '' ? '' : 'Không được để trống Chức vụ'}
            checkedShowForm={localCheckShowForm && localCheckShowForm['vacancy.roleName']}
            required={localCheckRequired && localCheckRequired['vacancy']}
          >
            {localState && localState.vacancy && <MenuItem value={localState.vacancy}>{localState.vacancy.roleName}</MenuItem>}
          </CustomInputBase>
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title['positionVacation']}
            name="vacanciesId"
            value={localState.hrmRecruitmentId && localState.hrmRecruitmentId.vacanciesId ? localState.hrmRecruitmentId.vacanciesId.name : ''}
            error={
              localState.hrmRecruitmentId === '' ||
              !localState.hrmRecruitmentId.vacanciesId ||
              (localState.hrmRecruitmentId.vacanciesId && localState.hrmRecruitmentId.vacanciesId.name === '')
                ? true
                : false
            }
            helperText={
              localState.hrmRecruitmentId.vacanciesId && localState.hrmRecruitmentId.vacanciesId.name ? '' : 'Vị trí tuyển dụng không được để trống'
            }
            checkedShowForm={localCheckShowForm && localCheckShowForm['vacanciesId']}
            required={localCheckRequired && localCheckRequired['vacanciesId']}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomInputBase
            className="CustomForm"
            label={name2Title['code']}
            onChange={handleInputChange}
            name="code"
            value={localState.code}
            error={localMessages && localMessages['code']}
            helperText={localMessages && localMessages['code']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['code']}
            required={localCheckRequired && localCheckRequired['code']}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            className="CustomForm"
            label={name2Title['decisionNo']}
            onChange={handleInputChange}
            name="decisionNo"
            value={localState.decisionNo}
            error={localMessages && localMessages['decisionNo']}
            helperText={localMessages && localMessages['decisionNo']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['decisionNo']}
            required={localCheckRequired && localCheckRequired['decisionNo']}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomInputBase
            className="CustomForm"
            label={name2Title['amount']}
            type="number"
            onChange={handleInputChange}
            name="amount"
            value={localState.amount}
            error={localMessages && localMessages['amount']}
            helperText={localMessages && localMessages['amount']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['amount']}
            required={localCheckRequired && localCheckRequired['amount']}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title['dateFounded'] || ['Chọn ngày']}
            onChange={e => handleInputChange(e, false)}
            name="dateFounded"
            value={localState.dateFounded}
            error={localMessages && localMessages['dateFounded']}
            helperText={localMessages && localMessages['dateFounded']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['dateFounded']}
            required={localCheckRequired && localCheckRequired['dateFounded']}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title['dateNeed'] || ['Chọn ngày']}
            onChange={e => handleInputChange(e, true)}
            name="dateNeed"
            value={localState.dateNeed}
            error={localMessages && localMessages['dateNeed']}
            helperText={localMessages && localMessages['dateNeed']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['dateNeed']}
            required={localCheckRequired && localCheckRequired['dateNeed']}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomInputBase
            className="CustomForm"
            label={name2Title.name}
            onChange={handleInputChange}
            name="name"
            value={localState.name}
            error={localMessages && localMessages['name']}
            helperText={localMessages && localMessages['name']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['name']}
            required={localCheckRequired && localCheckRequired['name']}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title['startingSalary']}
            onChange={handleInputChange}
            name="startingSalary"
            value={localState.startingSalary}
            type="number"
            formatType="Money"
            error={localMessages && localMessages['startingSalary']}
            helperText={localMessages && localMessages['startingSalary']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['startingSalary']}
            required={localCheckRequired && localCheckRequired['startingSalary']}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            rows={5}
            label={name2Title['cvDescription']}
            onChange={handleInputChange}
            name="cvDescription"
            value={localState.cvDescription}
            multiline
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            error={localMessages && localMessages['cvDescription']}
            helperText={localMessages && localMessages['cvDescription']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['cvDescription']}
            required={localCheckRequired && localCheckRequired['cvDescription']}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" color="primary" style={{ fontSize: 16, fontWeight: 500 }}>
            <Info />
            YÊU CẦU CHI TIẾT
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <CustomInputField
            select
            type="1"
            configType="hrmSource"
            configCode="S07"
            label={name2Title['certificate']}
            name="certificate"
            value={localState.certificate}
            onChange={handleInputChange}
            error={localMessages && localMessages['certificate']}
            helperText={localMessages && localMessages['certificate']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['certificate']}
            required={localCheckRequired && localCheckRequired['certificate']}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomInputField
            select
            value={localState.specialized}
            onChange={handleInputChange}
            name="specialized"
            label={name2Title['specialized']}
            type="1"
            configType="hrmSource"
            configCode="S06"
            error={localMessages && localMessages['specialized']}
            helperText={localMessages && localMessages['specialized']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['specialized']}
            required={localCheckRequired && localCheckRequired['specialized']}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomInputField
            select
            value={localState.levelLanguage}
            onChange={handleInputChange}
            name="levelLanguage"
            label={name2Title['levelLanguage']}
            type="1"
            configType="hrmSource"
            configCode="S09"
            error={localMessages && localMessages['levelLanguage']}
            helperText={localMessages && localMessages['']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['levelLanguage']}
            required={localCheckRequired && localCheckRequired['levelLanguage']}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputField
            label={name2Title['informatics']}
            onChange={handleInputChange}
            name="informatics"
            value={localState.informatics}
            type="1"
            configType="hrmSource"
            configCode="S08"
            error={localMessages && localMessages['informatics']}
            helperText={localMessages && localMessages['informatics']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['informatics']}
            required={localCheckRequired && localCheckRequired['informatics']}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title['gender']}
            select
            onClick={handleInputChange}
            name="gender"
            value={localState.gender}
            error={localMessages && localMessages['gender']}
            helperText={localMessages && localMessages['gender']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['gender']}
            required={localCheckRequired && localCheckRequired['gender']}
          >
            <MenuItem key={null} value={null}>
              -- CHỌN GIỚI TÍNH --
            </MenuItem>
            <MenuItem key="0" value="0">
              Nam
            </MenuItem>
            <MenuItem key="1" value="1">
              Nữ
            </MenuItem>
          </CustomInputBase>
        </Grid>
        <Grid item xs={4}>
          <CustomInputField
            select
            value={localState.age}
            onChange={handleInputChange}
            name="age"
            label={name2Title['age']}
            type="1"
            configType="hrmSource"
            configCode="S21"
            error={localMessages && localMessages['age']}
            helperText={localMessages && localMessages['age']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['age']}
            required={localCheckRequired && localCheckRequired['age']}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title['experienceYear']}
            type="number"
            onChange={handleInputChange}
            name="experienceYear"
            value={localState.experienceYear}
            error={localMessages && localMessages['experienceYear']}
            helperText={localMessages && localMessages['experienceYear']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['experienceYear']}
            required={localCheckRequired && localCheckRequired['experienceYear']}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            rows={5}
            multiline
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            label={name2Title.skill}
            value={localState.skill}
            name="skill"
            onChange={handleInputChange}
            error={localMessages && localMessages['skill']}
            helperText={localMessages && localMessages['skill']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['skill']}
            required={localCheckRequired && localCheckRequired['skill']}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            rows={5}
            multiline
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            label={name2Title['experience']}
            value={localState.experience}
            name="experience"
            onChange={handleInputChange}
            error={localMessages && localMessages['experience']}
            helperText={localMessages && localMessages['experience']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['experience']}
            required={localCheckRequired && localCheckRequired['experience']}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" color="primary" style={{ fontSize: 16, fontWeight: 500 }}>
            <Info />
            QUYỀN LỢI
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label={name2Title['requirementsOther']}
            rows={5}
            onChange={handleInputChange}
            name="requirementsOther"
            value={localState.requirementsOther}
            multiline
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            error={localMessages && localMessages['requirementsOther']}
            helperText={localMessages && localMessages['requirementsOther']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['requirementsOther']}
            required={localCheckRequired && localCheckRequired['requirementsOther']}
          />
        </Grid>

        {/* <Grid item xs={12}>
          <CustomInputBase
            label={name2Title['contact']}
            rows={5}
            onChange={handleInputChange}
            name="contact"
            value={localState.contact}
            multiline
            error={localMessages && localMessages['contact']}
            helperText={localMessages && localMessages['contact']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['contact']}
            required={localCheckRequired && localCheckRequired['contact']}
          />
        </Grid> */}
      </Grid>

      {/* <Grid container spacing={8} justify="flex-end">
        <Grid item>
          <CustomButton color="primary" onClick={e => onSave(localState)}>
            Lưu thông tin
          </CustomButton>
        </Grid>
        <Grid item>
          <CustomButton color="secondary" onClick={e => onClose()}>
            Đóng
          </CustomButton>
        </Grid>
      </Grid> */}
    </div>
  );
}

AddRecruitment.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};
const mapStateToProps = createStructuredSelector({});
function mapDispatchToProps(dispatch) {
  return {
    onMergeData: data => dispatch(MergeData(data)),
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
// export default memo(AddRecruitment);
export default compose(
  memo,
  withConnect,
)(AddRecruitment);
