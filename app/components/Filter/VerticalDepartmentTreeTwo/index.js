/**
 *
 * AdvanceSearch
 *
 */

import React, { memo, useState, useEffect } from 'react';
import { compose } from 'redux';
import TableUI from '@material-ui/core/Table';
import { TableRow, TableCell, TableHead, TableBody, Checkbox, TextField } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { addUserToDepartment, addHrmToDepartment, fetchData, flatChild } from '../../../helper';
import { API_USERS } from '../../../config/urlConfig';
import FluctuationsMonth from 'components/FluctuationsMonth';
import { Grid, Tabs, Tab } from 'components/LifetekUi';

let level = 0;
const blockStringSpecial = e =>
  [
    '`',
    '-',
    '@',
    '$',
    '#',
    '+',
    '!',
    '.',
    '~',
    '*',
    '%',
    '^',
    '?',
    '>',
    '<',
    '|',
    '\\',
    ':',
    '&',
    "'",
    '(',
    ')',
    ';',
    '"',
    '{',
    '}',
    '[',
    ']',
    '=',
    ',',
    '/',
    '_',
  ].includes(e.key) && e.preventDefault();
function VerticalDepartmentTreeTwo(props) {
  const { classes = {}, departments = [], onChange, show, addUser = true, addHrm, departmentId, listData, openDetail, allocation, disabled } = props;
  const [localDepartments, setLocalDepartments] = useState([]);
  const [employees, setEmployees] = useState(null);
  const [hrm, setHrm] = useState(null);
  const [selected, setSelected] = useState('');
  const [load, setLoad] = useState(false);
  const [number, setNumber] = useState(null);
  const [tabColumn, setTabColumn] = useState(0);
  const [data, setData] = useState([]);

  const [dataTextCustomer, setDataTextCustomer] = useState(null);
  useEffect(
    () => {
      setLoad(!load);
    },
    [number],
  );

  useEffect(() => {
    if (addUser) {
      fetchData(API_USERS)
        .then(response => {
          if (response && response.data) {
            setEmployees(response.data);
          }
        })
        .catch(console.log);
    }
  }, []);

  useEffect(
    () => {
      let newDepartment = JSON.parse(JSON.stringify(departments));
      if (departmentId) {
        const seletedDepart = selectDepartment(newDepartment, departmentId);

        if (seletedDepart !== null) {
          newDepartment = seletedDepart;
        }
      }

      if (addUser) {
        setLocalDepartments(addUserToDepartment(newDepartment, employees));
      }
      // if (addHrm) {
      //   setLocalDepartments(addHrmToDepartment(newDepartment, hrm));
      // }
    },
    [departments, employees, departmentId],
  );

  const selectDepartment = (departments, id) => {
    for (let i = 0; i < departments.length; i++) {
      if (departments[i]._id === id) {
        return [departments[i]];
      } else {
        if (Array.isArray(departments[i].child) && departments[i].child.length > 0) {
          const selectedDepart = selectDepartment(departments[i].child, id);
          if (selectedDepart) {
            return selectedDepart;
          }
        }
      }
    }
    return null;
  };

  const clickOpen = depart => {
    if (!depart.open) {
      depart.open = true;
    } else {
      depart.open = false;
    }
  };

  const handleChangeDepartment = depart => {
    if (onChange) {
      setSelected(depart._id);
      onChange(depart);
    }
  };
  const handleChangeNumber = (e, department) => {
    let value = parseInt(e.target.value);
    setNumber(value);
    allocation.forEach((item, index) => {
      if (item.employeeId === department._id) {
        item.number = value;
      }
    });

    valueText(department._id);
  };
  const valueText = id => {
    const value = allocation.find(el => el.employeeId === id);
    if (value && value.number) return value.number;
    else return null;
  };
  const checkValue = (id, department) => {
    const value = allocation.find(el => el.employeeId === id);
    if (value && value.checked === false) return true;
    else return false;
  };
  const displayTableContent = (dataList, level) => {
    const handleCheck = (e, index, id) => {
      if (checkValue(id)) {
        let value = allocation.find(el => el.employeeId === id);
        if (value) {
          value.checked = !value.checked;
          value.number = 0;
        }
        dataList.forEach((item, i) => {
          if (i === index) {
            item.checked = false;
          }
        });
      } else {
        let value = allocation.find(el => el.employeeId === id);
        if (value) {
          value.checked = !value.checked;
        } else {
          allocation.push({
            employeeId: id,
            checked: false,
          });
        }
      }

      allocation.forEach((item, index) => {
        if (item.number === 0) {
          allocation.splice(index, 1);
        }
      });
    };
    return dataList.map((department, index) => {
      const color = department.username || department.email ? '#2196F3' : null;
      if (department.child && department.child.length > 0) {
        return (
          <React.Fragment key={department._id}>
            <TableRow onClick={() => handleChangeDepartment(department)} className="tbColSpan">
              <TableCell onClick={() => clickOpen(department)} className={department._id === selected ? 'selected' : ''}>
                <span style={{ padding: `${level}px` }} />
                {department.open ? <ExpandLess /> : <ExpandMore />}
                &nbsp;
                {department.name}
              </TableCell>
            </TableRow>
            {department.open ? displayTableContent(department.child, level + 20) : null}
          </React.Fragment>
        );
      }
      return (
        <TableRow key={department._id} onClick={() => handleChangeDepartment(department)} className="tbColSpan">
          <TableCell>
            <span style={{ padding: `${level}px` }} />
            {department && department.organizationUnit ? (
              <Checkbox
                color="primary"
                onClick={e => handleCheck(e, index, department._id)}
                checked={checkValue(department._id)}
                disabled={disabled}
              />
            ) : null}

            {department.name}
            <span style={{ padding: `5px` }} />
            {department.checked || checkValue(department._id) ? (
              <TextField
                type="number"
                onKeyDown={blockStringSpecial}
                disabled={disabled}
                variant="standard"
                style={{ padding: 0, width: 30, height: 30 }}
                value={valueText(department._id)}
                onChange={e => handleChangeNumber(e, department)}
              />
            ) : null}
          </TableCell>
        </TableRow>
      );
    });
  };

  const renderFluctuationsMonth = () => {
    return (
      <Grid item container spacing={16} style={{ padding: 0 }}>
        {listData.map(item => {
          return (
            <Grid item xs={6}>
              <FluctuationsMonth
                style={{ marginTop: 15 }}
                icon={item.icon}
                text={item.name}
                backColor={item.color}
                color={`linear-gradient(to right, #03A9F4, #03a9f4ad)`}
                onClick={() => {
                  openDetail(item.type);
                }}
              />
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <>
      {/* <Tabs value={tabColumn} onChange={(e, tab) => setTabColumn(tab)} centered={true} style={{ minWidth: '300px' }}>
        <Tab value={0} label={'Sơ đồ cây'} />
      </Tabs> */}
      {/* {show && tabColumn === 1 && renderFluctuationsMonth()} */}
      {tabColumn === 0 && (
        <TableUI className={classes.table} aria-labelledby="tableTitle">
          <TableBody>
            <TableRow>
              <TableCell>Tất cả tổ chức</TableCell>
            </TableRow>
            {localDepartments.map(depart => {
              if (depart.child && depart.child.length > 0) {
                return (
                  <React.Fragment key={depart._id}>
                    <TableRow onClick={() => handleChangeDepartment(depart)} className="tbColSpan">
                      <TableCell onClick={() => clickOpen(depart)} className={depart._id === selected ? 'selected' : ''}>
                        {depart.open ? <ExpandLess /> : <ExpandMore />}
                        &nbsp;
                        {depart.name}
                      </TableCell>
                    </TableRow>
                    {!depart.open ? displayTableContent(depart.child, level + 20) : null}
                  </React.Fragment>
                );
              }
              return (
                <TableRow key={depart._id} onClick={() => handleChangeDepartment(depart)} className="tbColSpan">
                  <TableCell className={depart._id === selected ? 'selected' : ''}>{depart.name}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </TableUI>
      )}
    </>
  );
}

VerticalDepartmentTreeTwo.propTypes = {
  title: PropTypes.string,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  handleSave: PropTypes.func,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

export default compose(
  memo,
  injectIntl,
)(VerticalDepartmentTreeTwo);
