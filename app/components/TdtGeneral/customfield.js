/* eslint-disable no-lonely-if */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  Checkbox,
  InputLabel,
  Radio,
  ListItem,
  // ListItemAvatar,
  ListItemText,
  Avatar,
  OutlinedInput,
  FormControl,
  Typography,
} from '@material-ui/core';
// import { Link } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import { Add } from '@material-ui/icons';
import dot from 'dot-object';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import { components } from 'react-select';
import { serialize, getLabelName } from '../../utils/common';
import TextFieldCode from '../TextFieldCode';
import { API_USERS, API_SUPPLIERS, API_CUSTOMERS, API_CAMPAIGN, API_CRM_CAMPAIGN, API_ASSET } from '../../config/urlConfig';
import CustomInputBase from '../Input/CustomInputBase';
import CustomDatePicker from 'components/CustomDatePicker';
import makeSelectDashboardPage, { makeSelectProfile } from '../../containers/Dashboard/selectors';
import { AsyncAutocomplete } from '../../components/LifetekUi';
import moment from 'moment';
import avatarDefault from '../../images/default-avatar.png';
import './styles.css';
let people = null;

const currencies = [
  {
    value: 'USD',
    label: '$',
  },
  {
    value: 'EUR',
    label: '€',
  },
  {
    value: 'BTC',
    label: '฿',
  },
  {
    value: 'JPY',
    label: '¥',
  },
  {
    value: 'VNĐ',
    label: 'VNĐ',
  },
];
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

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator
    />
  );
}
const addItem = code => {
  const dataRenderLocal = JSON.parse(localStorage.getItem('crmSource')) || null;
  const dataRender = dataRenderLocal ? dataRenderLocal.find(item => item.code === code) : null;
  if (dataRender) return dataRender.data.map(element => <MenuItem value={element.title}>{element.title}</MenuItem>);
  return null;
};
const employeeOptionLabel = option => {
  const code = option.code ? option.code : '';
  const customerName = option.name ? option.name : '';
  if (customerName || code) {
    return `${code} - ${customerName}`;
  }
  return '';
};
export const renderNewFieldContent = (state, callBack, props) => {
  let fieldCode;
  const { newFieldConfig, generalData } = state;
  switch (newFieldConfig.type) {
    case 'String':
      fieldCode = (
        <div>
          <TextField
            variant="outlined"
            margin="normal"
            id="name"
            label="Nội dung"
            value={generalData[`others.${newFieldConfig.name}`]}
            onChange={event => {
              const { generalData } = state;
              generalData[`others.${newFieldConfig.name}`] = event.target.value;
              callBack('custom-field-input-change', generalData);
            }}
            fullWidth
          />
        </div>
      );
      break;

    case 'Money':
      {
        let amount = 0;
        let currencyUnit = 'VNĐ';
        if (generalData[`others.${newFieldConfig.name}`]) {
          amount = generalData[`others.${newFieldConfig.name}`].replace(/[^\d.-]/g, '');
          currencyUnit = currencies[currencies.findIndex(d => d.label === generalData[`others.${newFieldConfig.name}`].replace(amount, ''))].value;
          // console.log('kkk', currencies[currencies.findIndex(d => d.label === generalData[`others.${newFieldConfig.name}`].replace(amount, ''))]);
        }

        fieldCode = (
          <Grid container justify="center" alignItems="center" className="my-2">
            <Grid item sm={8}>
              <TextField
                variant="outlined"
                label="Số tiền"
                value={amount}
                onChange={event => {
                  const labelOfCurrency = currencies[currencies.findIndex(d => d.value === currencyUnit)].label;
                  generalData[`others.${newFieldConfig.name}`] = event.target.value + labelOfCurrency;
                  callBack('custom-field-input-change', generalData);
                }}
                id="formatted-numberformat-input"
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
              />
            </Grid>
            <Grid item sm={1} />
            <Grid item sm={3}>
              <TextField
                variant="outlined"
                fullWidth
                id="standard-select-currency"
                select
                label="Đơn vị"
                value={currencyUnit}
                onChange={event => {
                  const newCurrency = event.target.value;
                  generalData[`others.${newFieldConfig.name}`] = amount + currencies[currencies.findIndex(d => d.value === newCurrency)].label;
                  callBack('custom-field-input-change', generalData);
                }}
              >
                {currencies.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        );
      }

      break;
    case 'Source': {
      const listSources = JSON.parse(localStorage.getItem('crmSource'));
      const currentSource = listSources[listSources.findIndex(d => d._id === newFieldConfig.fromSource)];

      if (newFieldConfig.fromSource !== '') {
        let convertedSelected = [];
        if (generalData[`others.${newFieldConfig.name}`]) {
          convertedSelected = generalData[`others.${newFieldConfig.name}`].split(', ');
        }
        fieldCode = (
          <div>
            <InputLabel htmlFor="select-multiple-checkbox">List</InputLabel>
            <Select
              variant="outlined"
              fullWidth
              multiple
              value={convertedSelected}
              input={<OutlinedInput id="select-multiple-checkbox" />}
              renderValue={selected => selected.join(', ')}
            >
              {currentSource.data.map(element => (
                <MenuItem key={element.value} value={element.value}>
                  <Checkbox
                    onChange={event => {
                      if (event.target.checked) {
                        convertedSelected.push(element.title);
                      } else {
                        convertedSelected.splice(convertedSelected.indexOf(element.title), 1);
                      }
                      generalData[`others.${newFieldConfig.name}`] = convertedSelected.join(', ');

                      callBack('custom-field-input-change', generalData);
                    }}
                    checked={
                      generalData[`others.${newFieldConfig.name}`] ? generalData[`others.${newFieldConfig.name}`].indexOf(element.title) > -1 : false
                    }
                  />
                  <ListItemText primary={element.title} />
                </MenuItem>
              ))}
            </Select>
          </div>
        );
      }

      break;
    }

    case 'Date':
      fieldCode = (
        <div className="picker mt-3 text-center">
          {/* <MuiPickersUtilsProvider utils={MomentUtils}> */}
          <TextField
            type="Date"
            keyboard
            clearable
            variant="outlined"
            label="Chọn ngày"
            InputLabelProps={{ shrink: true }}
            value={generalData[`others.${newFieldConfig.name}`]}
            onChange={event => {
              generalData[`others.${newFieldConfig.name}`] = event.target.value;
              callBack('custom-field-input-change', generalData);
            }}
          />
          {/* </MuiPickersUtilsProvider> */}
        </div>
      );
      break;
    case 'Number':
      fieldCode = (
        <TextField
          variant="outlined"
          id="standard-number"
          label="Number"
          value={generalData[`others.${newFieldConfig.name}`]}
          onChange={event => {
            generalData[`others.${newFieldConfig.name}`] = event.target.value;
            callBack('custom-field-input-change', generalData);
          }}
          fullWidth
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />
      );
      break;
    case 'Link':
      fieldCode = (
        <TextField
          variant="outlined"
          margin="normal"
          id="name"
          label="Đường dẫn"
          value={generalData[`others.${newFieldConfig.name}`]}
          onChange={event => {
            generalData[`others.${newFieldConfig.name}`] = event.target.value;
            callBack('custom-field-input-change', generalData);
          }}
          fullWidth
        />
      );
      break;
    // case 6:
    //   fieldCode = <DropzoneArea filesLimit={12} showFileNamesInPreview showAlerts={false} onChange={files => {}} />;
    //   break;
    case 7:
      fieldCode = (
        <Grid container justify="center" alignItems="center">
          <Grid item sm={6}>
            <Radio
              checked={this.newFieldData.radio ? this.newFieldData.radio === 'yes' : true}
              onChange={event => {
                this.newFieldData.radio = event.target.value;
              }}
              value="yes"
              name="radio-button-demo"
              aria-label="A"
            />
            <span>Có</span>
          </Grid>
          <Grid item sm={6}>
            <Radio
              checked={this.newFieldData.radio ? this.newFieldData.radio !== 'yes' : false}
              onChange={event => {
                this.newFieldData.radio = event.target.value;
              }}
              value="no"
              name="radio-button-demo"
              aria-label="A"
            />
            <span>Không</span>
          </Grid>
        </Grid>
      );
      break;

    default:
      break;
  }
  return fieldCode;
};

export const renderFieldByType = (row, generalData, callBack, currency, classes, isTrading, localMessages, profile, checkReset) => {
  let fieldCode;
  switch (row.type) {
    case 'String':
      if (row.name === 'createdUser') {
        generalData['createdUser'] = profile.code;
      }
      if (row.name === 'kanbanStatus' || row.name === 'state') {
        fieldCode = '';
      } else if (row.name === 'crmStatus') {
        fieldCode = '';
      } else {
        let code = 1;
        if (window.location.pathname === '/crm/BusinessOpportunities') {
          code = 1;
        }
        if (window.location.pathname === '/crm/ExchangingAgreement') {
          code = 2;
        }
        // if (row.name === 'code' && !generalData[row.name]) {
        //   generalData[row.name] = firstCode;
        //   callBack('custom-field-input-change', generalData);
        // }

        fieldCode = (
          <div className="my-2">
            {/* <p style={{ display: row.checked ? 'intiial' : 'none' }} className="font-weight-bold mb-1">
              {row.title}
            </p> */}

            {/* {row.name === 'code' ? (
              <TextFieldCode
                code={code}
                value={generalData[row.name]}
                // value={row.name == 'code' ? generalData[row.name] || firstCode : generalData[row.name]}
                // defaultValue = {row.name=='code'?firstCode:''}
                onChange={event => {
                  generalData[row.name] = event.target.value;
                  callBack('custom-field-input-change', generalData);
                }}
                style={{ display: row.checked ? 'intiial' : 'none' }}
                disabled={row.name === 'code'}
                className="my-0"
                fullWidth
                label={row.title}
                checkedShowForm={row.checkedShowForm}
                required={row.checkedRequireForm}
                error={localMessages[`${row.name}`]}
                helperText={localMessages[`${row.name}`]}
              />
            ) : null} */}
            {row.name === 'name' ? (
              <CustomInputBase
                value={generalData[row.name]}
                // value={row.name=='code'?generalData[row.name]||firstCode:generalData[row.name]}
                // defaultValue = {row.name=='code'?firstCode:''}
                onChange={event => {
                  generalData[row.name] = event.target.value;
                  // generalData['createdUser'] = profile.roleGroupSource;
                  callBack('custom-field-input-change', generalData);
                }}
                className="my-0"
                fullWidth
                label={row.title}
                checkedShowForm={row.checkedShowForm}
                required={row.checkedRequireForm}
                error={generalData[row.name] === null || generalData[row.name] === '' ? true : ''}
                helperText={generalData[row.name] === null || generalData[row.name] === '' ? 'Không được để trống tên CHKD' : ''}
                onKeyDown={blockStringSpecial}
              />
            ) : null}
            {row.name !== 'name' && row.name !== 'code' ? (
              <CustomInputBase
                value={row.name === 'createdUser' ? profile.code : generalData[row.name]}
                // value={row.name=='code'?generalData[row.name]||firstCode:generalData[row.name]}
                // defaultValue = {row.name=='code'?firstCode:''}
                onChange={event => {
                  generalData[row.name] = event.target.value;
                  // generalData['createdUser'] = profile.roleGroupSource;
                  callBack('custom-field-input-change', generalData);
                }}
                disabled={row.name === 'createdUser'}
                className="my-0"
                fullWidth
                label={row.title}
                checkedShowForm={row.checkedShowForm}
                required={row.checkedRequireForm}
                error={localMessages[`${row.name}`]}
                helperText={localMessages[`${row.name}`]}
                onKeyDown={blockStringSpecial}
              />
            ) : null}
          </div>
        );
      }

      break;

    case 'Money': {
      let amount = 0;
      let currencyUnit = currency ? (currency.length > 0 ? currency[0].name : '') : '';
      // let title = '';
      if (!row.name.includes('others')) {
        amount = generalData[`${row.name}.amount`];
        currencyUnit = generalData[`${row.name}.currencyUnit`]
          ? generalData[`${row.name}.currencyUnit`]
          : currency
            ? currency.length > 0
              ? 0
              : ''
            : '';
        // title = 'Giá trị';
      } else {
        if (generalData[row.name]) {
          amount = generalData[row.name].replace(/[^\d.-]/g, '');
          // currencyUnit = currency[currency.findIndex(d => d.name === generalData[row.name].replace(amount, ''))].value;
          currencyUnit = currency && currency[currency.findIndex(d => d.name === generalData[row.name].replace(amount, ''))];
        }

        // title = row.title;
      }
      fieldCode = (
        <Grid container justify="center" alignItems="center" spacing={8}>
          {/* <Grid item sm={12}>
            <p className="font-weight-bold mb-1">{title}</p>
          </Grid> */}
          <Grid item sm={8}>
            <CustomInputBase
              fullWidth
              // label={getLabelName('value.amount', `${isTrading ? 'ExchangingAgreement' : 'BusinessOpportunities'}`)}
              value={amount}
              onChange={event => {
                if (!row.name.includes('others')) {
                  generalData[`${row.name}.amount`] = event.target.value;
                } else {
                  const newAmount = event.target.value;
                  // generalData[row.name] = newAmount + currency[currency.findIndex(d => d.name === currencyUnit)].name;
                  generalData[row.name] = newAmount + currency[currency.findIndex(d => d.name === currencyUnit)];
                }
                callBack('custom-field-input-change', generalData);
              }}
              id="formatted-numberformat-input"
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
              label={row.title}
              checkedShowForm={row.checkedShowForm}
              required={row.checkedRequireForm}
              error={localMessages['value.amount']}
              onKeyDown={blockStringSpecial}
              // helperText={localMessages["value.amount"]}
            />
          </Grid>
          <Grid item sm={4}>
            <CustomInputBase
              id="standard-select-currency"
              select
              // label={getLabelName('value.currencyUnit', `${isTrading ? 'ExchangingAgreement' : 'BusinessOpportunities'}`)}
              label={row.title}
              checkedShowForm={row.checkedShowForm}
              required={row.checkedRequireForm}
              error={localMessages['value.currencyUnit']}
              // helperText={localMessages["value.amount"]}
              value={currencyUnit}
              onKeyDown={blockStringSpecial}
              onChange={event => {
                if (!row.name.includes('others')) {
                  generalData[`${row.name}.currencyUnit`] = event.target.value;
                } else {
                  const newCurrency = event.target.value;
                  generalData[row.name] = amount + newCurrency;
                }
                callBack('custom-field-input-change', generalData);
              }}
            >
              <MenuItem disabled value={0}>
                ---- Chọn ----
              </MenuItem>
              {currency && currency.length > 0
                ? currency.map(option => (
                    <MenuItem key={option._id} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))
                : ''}
            </CustomInputBase>
          </Grid>
          <Grid item xs={12}>
            {localMessages['value.amount'] ? (
              <Typography color="error">{localMessages['value.amount']}</Typography>
            ) : localMessages['value.currencyUnit'] ? (
              <Typography color="error">{localMessages['value.currencyUnit']}</Typography>
            ) : (
              ''
            )}
          </Grid>
        </Grid>
      );
      break;
    }
    case 'People': {
      let title = '';
      // eslint-disable-next-line no-unused-vars
      let route = '';
      if (row.name === 'customer') {
        title = 'Khách hàng';

        route = `/crm/customer/${generalData[`${row.name}.customerId`]}`;
      }
      if (row.name === 'responsibilityPerson') {
        title = 'Người chịu trách nhiệm';
        // title = 'Người tạo';
        route = `/employee/${generalData[`${row.name}.employeeId`]}`;
      }
      if (row.name === 'presenter') {
        title = 'Người giám sát';
        // title = 'Người giới thiệu';
        route = `/employee/${generalData[`${row.name}.employeeId`]}`;
      }
      fieldCode =
        row.name !== 'contactCenter' && row.name !== 'businessOpportunities' ? (
          <div className="my-2">
            <Typography color={localMessages['customer.name'] ? 'secondary' : ''}>
              {row.checkedShowForm ? getLabelName(`${row.name}.name`, `${isTrading ? 'ExchangingAgreement' : 'BusinessOpportunities'}`) : ''}{' '}
              {row.checkedRequireForm ? '*' : ''}
            </Typography>
            {row.checkedShowForm ? (
              generalData[`${row.name}.name`] ? (
                <ListItem
                  button
                  color="primary"
                  onClick={() => {
                    // callBack('view-people-detail', row.name);
                  }}
                >
                  {/* <ListItemAvatar>
                  <Avatar alt="Remy Sharp">
                    <i className="far fa-user" />
                  </Avatar>
                </ListItemAvatar> */}
                  {/* <Link to={route}> */}
                  <ListItemText primary={generalData[`${row.name}.name`]} />
                  {/* </Link> */}
                </ListItem>
              ) : (
                <React.Fragment>
                  <Button
                    variant="outlined"
                    color={!row.checkedRequireForm ? 'primary' : 'secondary'}
                    onClick={() => {
                      callBack('open-find-people', row.name);
                      // this.setState({ openHOCFindPeopleDialog: true, peopleType: 'customer' });
                    }}
                  >
                    <Add /> {`Thêm ${title}`}
                  </Button>
                  {localMessages['customer.name'] ? (
                    <Typography color="error">{localMessages['customer.name'] ? localMessages['customer.name'] : ''}</Typography>
                  ) : (
                    ''
                  )}
                </React.Fragment>
              )
            ) : (
              ''
            )}
          </div>
        ) : (
          ''
        );
      break;
    }
    case 'ObjectId|Asset|Array|Instance|_id name': {
      let newGeneralData = dot.object(generalData);
      let filterCustomer;
      let filter;
      if (newGeneralData && newGeneralData.customer && newGeneralData.customer.customerId && newGeneralData.customer.customerId.code) {
        filterCustomer = newGeneralData.customer.customerId.code;
        filter = {
          ['customer.code']: filterCustomer,
        };
      }
      fieldCode =
        row.name === 'assets' && checkReset ? (
          row.checkedShowForm ? (
            <div className="my-2">
              <AsyncAutocomplete
                isMulti
                name={row.name}
                label={row.title}
                required={row.checkedRequireForm}
                error={localMessages[`${row.name}`]}
                helperText={localMessages[`${row.name}`]}
                customOptionLabel={employeeOptionLabel}
                onChange={event => {
                  console.log('event', event);
                  // let newData = [];
                  // Array.isArray(event) &&
                  //   event.map(item => {
                  //     console.log('item', item);
                  //     newData.push({ assetId: item._id , name: item.name, id: item.assetId });
                  //   });
                  // console.log('newData', newData);

                  generalData['assets'] = event;
                  callBack('custom-field-async-change', generalData);
                }}
                filter={filter}
                url={`${API_ASSET}`}
                value={newGeneralData['assets']}
              />
            </div>
          ) : (
            ''
          )
        ) : (
          ''
        );
      break;
    }
    case 'People Array': {
      const convertData = dot.object(Object.assign({}, generalData));
      // let title = '';
      // eslint-disable-next-line no-unused-vars
      let route = '';
      if (row.name === 'responsibilityPerson') {
        // title = 'Người chịu trách nhiệm';
        route = `/employee/${generalData[`${row.name}.employeeId`]}`;
      }
      if (row.name === 'presenter') {
        // title = 'Người giám sát';
        route = `/customer/${generalData[`${row.name}.customerId`]}`;
      }
      const dataWithLabel =
        convertData[row.name] && convertData[row.name].length > 0
          ? convertData[row.name].map(item => ({ ...item, label: item.name, value: item.employeeId }))
          : [];
      const style = {
        control: base => ({
          ...base,
          '&:hover': { borderColor: 'red' },
          '&:focus': { borderColor: 'red' },
          borderColor: 'red',
          boxShadow: 'none',
        }),
        menu: base => ({
          ...base,
          backgroundColor: 'white',
          zIndex: '2!important',
        }),
        menuList: base => ({
          ...base,
          backgroundColor: 'white',
          zIndex: '2!important',
        }),
      };

      const customStyles = {
        menu: base => ({
          ...base,
          backgroundColor: 'white',
          zIndex: '2!important',
        }),
        menuList: base => ({
          ...base,
          backgroundColor: 'white',
          zIndex: '2!important',
        }),
      };
      fieldCode =
        row.name !== 'contactCenter' ? (
          row.checkedShowForm ? (
            <div className="my-2">
              <p className="styless" style={{ color: localMessages[`${row.name}`] ? 'red' : '' }}>
                {/* {getLabelName(`${row.name}`, `${isTrading ? 'ExchangingAgreement' : 'BusinessOpportunities'}`)} */}
                {row.title}
              </p>
              <AsyncSelect
                // className='.css-2b097c-container'
                onChange={selectedOption => {
                  callBack('select-people', selectedOption, row.name);
                }}
                placeholder="Tìm kiếm ..."
                components={{
                  Option: ({ children, ...props }) => (
                    <components.Option {...props}>
                      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        {/* <Avatar src={`${props.data.avatar}?allowDefault=true`} /> */}
                        {props.data.avatar !== undefined ? <Avatar src={`${props.data.avatar}?allowDefault=true`} /> : <Avatar src={avatarDefault} />}
                        <div style={{ marginTop: 10, marginLeft: 20 }}>{props.data.name}</div>
                      </div>
                    </components.Option>
                  ),
                  MultiValueLabel: props => (
                    <components.MultiValueLabel
                      {...props}
                      onClick={() => {
                        callBack('view-people-detail', props.data._id || props.data.employeeId);
                      }}
                    >
                      <div
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          callBack('view-people-detail', props.data.employeeId || props.data._id);
                        }}
                      >
                        {props.data.name}
                      </div>
                    </components.MultiValueLabel>
                  ),
                }}
                value={dataWithLabel}
                isMulti
                defaultOptions
                loadOptions={(inputValue, callback) => {
                  // clearTimeout(people);
                  // people = setTimeout(() => {
                  promiseOptions(inputValue, callback);
                  // }, 500);
                }}
                styles={localMessages[`${row.name}`] ? style : customStyles}
                // styles={customStyles}+
                theme={theme => ({
                  ...theme,
                  spacing: {
                    ...theme.spacing,
                    controlHeight: '50px',
                  },
                })}
              />
            </div>
          ) : (
            ''
          )
        ) : (
          ''
        );
      break;
    }

    case 'Array Campaign': {
      fieldCode =
        row.name !== 'contactCenter' ? (
          row.checkedShowForm ? (
            <div className="my-2">
              <AsyncAutocomplete
                // isMulti
                name={row.name}
                label={row.title}
                required={row.checkedRequireForm}
                error={localMessages[`${row.name}`]}
                helperText={localMessages[`${row.name}`]}
                onChange={event => {
                  generalData['campaign'] = { _id: event._id, name: event.name };
                  callBack('custom-field-input-change', generalData);
                }}
                url={API_CRM_CAMPAIGN}
                value={{ _id: generalData['campaign._id'], name: generalData['campaign.name'] }}
              />
            </div>
          ) : (
            ''
          )
        ) : (
          ''
        );
      break;
    }
    case 'People Array Customer': {
      // generalData[row.name] = null;
      fieldCode =
        row.name !== 'contactCenter' ? (
          row.checkedShowForm ? (
            <div className="my-2">
              <AsyncAutocomplete
                // isMulti
                name={row.name}
                label={row.title}
                required={row.checkedRequireForm}
                error={localMessages[`${row.name}`]}
                helperText={localMessages[`${row.name}`]}
                onChange={event => {
                  generalData[row.name] = { _id: event._id, name: event.name };
                  callBack('custom-field-input-change', generalData);
                }}
                url={API_CUSTOMERS}
                // filter={{ customerType: 3 }}
                value={{ _id: generalData['presenter._id'], name: generalData['presenter.name'] }}
              />
            </div>
          ) : (
            ''
          )
        ) : (
          ''
        );
      break;
    }

    case 'Source': {
      // const localStorageSource = JSON.parse(localStorage.getItem('crmSource'));
      // // console.log('local', localStorageSource);
      // let generalSource;
      // if (!row.name.includes('others.')) {
      //   generalSource = localStorageSource[localStorageSource.findIndex(d => d.code === row.configCode)];
      // } else {
      //   // generalSource = localStorageSource[localStorageSource.findIndex(d => d.code === 'S06')];
      //   generalSource = localStorageSource[localStorageSource.findIndex(d => d._id === row.fromSource)];
      // }

      // let convertedSelected = [];

      // if (generalData[row.name]) {
      //   convertedSelected = generalData[row.name].split(', ');
      // }

      fieldCode = (
        <div>
          {/* <p className="font-weight-bold mb-1">{row.title}</p> */}
          <CustomInputBase
            checkedShowForm={row.checkedShowForm}
            required={row.checkedRequireForm}
            error={localMessages[`${row.name}`]}
            helperText={localMessages[`${row.name}`]}
            label={row.title}
            // error={localMessages && localMessages.channel}
            // helperText={localMessages && localMessages.channel}
            type={row.type}
            value={generalData[`${row.name}`]}
            displayEmpty
            name={row.name}
            select
            onChange={e => {
              // let data = {};
              generalData[`${row.name}`] = e.target.value;
              // setGeneralData({ ...generalData, ...data })
              // props.newAddtionData[`${row.name}`] = e.target.value;
              callBack('custom-field-input-change', generalData);
            }}
          >
            {addItem(row.configCode)}
          </CustomInputBase>
        </div>
      );
      break;
    }
    case 'Number':
      fieldCode = (
        <div className="">
          <CustomInputBase
            label={row.title}
            type="number"
            variant="outlined"
            margin="normal"
            value={generalData[row.name]}
            onChange={event => {
              generalData[row.name] = event.target.value;
              // this.setState({ generalData });
              callBack('custom-field-input-change', generalData);
            }}
            // className="my-0"
            fullWidth
            checkedShowForm={row.checkedShowForm}
            required={row.checkedRequireForm}
            error={localMessages[`${row.name}`]}
            helperText={localMessages[`${row.name}`]}
          />
        </div>
      );
      break;

    case 'Boolean':
      // let a = true;
      // generalData[row.name] = false;
      fieldCode = (
        <div className="">
          <TextField
            variant="outlined"
            fullWidth
            id="standard-select-currency"
            select
            label={row.title}
            value={generalData[row.name] ? 'Đã confirm' : 'Chưa confirm'}
            onChange={event => {
              // console.log('hihihi', event);
              if (event.target.value === 'Đã confirm') {
                generalData[row.name] = true;
              } else {
                generalData[row.name] = false;
              }
              callBack('custom-field-input-change', generalData);
            }}
            InputLabelProps={{ shrink: true }}
          >
            <MenuItem key="true" value="Đã confirm">
              Đã confirm
            </MenuItem>
            <MenuItem key="false" value="Chưa confirm">
              Chưa confirm
            </MenuItem>
          </TextField>
        </div>
      );
      break;

    case 'Date':
      // generalData[row.name] = moment().format('MM/DD/YYYY');
      row.name !== 'createdAt' && row.name !== 'updatedAt'
        ? (fieldCode = (
            <CustomDatePicker
              label={row.title}
              value={generalData[row.name] === null ? '' : generalData[row.name]}
              // disableFuture={row.name === 'createdDate' ? true : false}
              // disablePast={row.name === 'closingDate' ? true : false}
              checkedShowForm={row.checkedShowForm}
              required={row.checkedRequireForm}
              error={localMessages[`${row.name}`]}
              helperText={localMessages[`${row.name}`]}
              top={8}
              right={35}
              onChange={event => {
                try {
                  generalData[row.name] = moment(event).format('YYYY-MM-DD');
                  callBack('custom-field-input-change', generalData);
                  // console.log(event);
                } catch (err) {
                  console.log(err);
                }
              }}
            />
          ))
        : null;
      break;

    // date
    case 'date':
      fieldCode = (
        <CustomDatePicker
          label={row.title}
          top={8}
          right={35}
          value={generalData[row.name] === null ? moment().format('YYYY-MM-DD') : generalData[row.name]}
          onChange={event => {
            try {
              // console.log(event);
              generalData[row.name] = moment(event).format('YYYY-DD-MM');
              callBack('custom-field-input-change', generalData);
              // console.log(event);
            } catch (err) {
              console.log(err);
            }
          }}
        />
      );
      break;
    // number
    case 'number':
      fieldCode = (
        <div className="">
          <CustomInputBase
            label={row.title}
            type="number"
            variant="outlined"
            margin="normal"
            value={generalData[row.name]}
            onChange={event => {
              generalData[row.name] = event.target.value;
              callBack('custom-field-input-change', generalData);
            }}
            // className="my-0"
            fullWidth
            checkedShowForm={row.checkedShowForm}
            required={row.checkedRequireForm}
            error={localMessages[`${row.name}`]}
            helperText={localMessages[`${row.name}`]}
          />
        </div>
      );
      break;
    //text
    case 'text':
      if (row.name === 'kanbanStatus' || row.name === 'state') {
        fieldCode = '';
      } else if (row.name === 'crmStatus') {
        fieldCode = '';
      } else {
        let code = 1;
        if (window.location.pathname === '/crm/BusinessOpportunities') {
          code = 1;
        }
        if (window.location.pathname === '/crm/ExchangingAgreement') {
          code = 2;
        }
        // if (row.name === 'code' && !generalData[row.name]) {
        //   generalData[row.name] = firstCode;
        //   callBack('custom-field-input-change', generalData);
        // }
        fieldCode = (
          <div className="my-2">
            {/* <p style={{ display: row.checked ? 'intiial' : 'none' }} className="font-weight-bold mb-1">
                      {row.title}
                    </p> */}

            <CustomInputBase
              value={generalData[row.name]}
              // value={row.name=='code'?generalData[row.name]||firstCode:generalData[row.name]}
              // defaultValue = {row.name=='code'?firstCode:''}
              onChange={event => {
                generalData[row.name] = event.target.value;
                callBack('custom-field-input-change', generalData);
              }}
              className="my-0"
              fullWidth
              label={row.title}
              checkedShowForm={row.checkedShowForm}
              required={row.checkedRequireForm}
              error={localMessages[`${row.name}`]}
              helperText={localMessages[`${row.name}`]}
            />
          </div>
        );
      }

      break;

    case 'Link':
      fieldCode = (
        <div className="my-2">
          <p className="font-weight-bold mb-1">{row.title}</p>
          <TextField
            variant="outlined"
            margin="normal"
            value={generalData[row.name]}
            onChange={event => {
              generalData[row.name] = event.target.value;
              callBack('custom-field-input-change', generalData);
            }}
            className="my-0"
            fullWidth
          />
        </div>
      );
      break;
    case 'Avatar':
      // fieldCode = (
      //   <CustomInputBase type="file" label={row.name}
      //     value={generalData[row.name]}
      //     onChange={event => {
      //       generalData[row.name] = event.target.file[0];
      //       // callBack('custom-field-input-change', generalData);
      //     }}
      //   />
      // )
      break;
    default:
      break;
  }
  if (row.type && row.type.includes('Relation')) {
    const typeArr = row.type.split('|');
    const ref = JSON.parse(typeArr[1]);
    let api = '';
    if (String(ref.ref) === 'Employee') {
      api = API_USERS;
    }
    if (String(ref.ref) === 'Customer') {
      api = API_CUSTOMERS;
    }
    if (String(ref.ref) === 'Supplier') {
      api = API_SUPPLIERS;
    }
    const rowArr = row.name.split('.');
    const newRowName = `${rowArr[0]}.${rowArr[1]}`;
    const obj = dot.object(Object.assign({}, generalData));
    fieldCode = (
      <div className="my-2">
        <p className="font-weight-bold mb-1">{row.title}</p>
        <AsyncSelect
          className={classes.reactSelect}
          placeholder="Tìm kiếm ..."
          loadOptions={(newValue, callback) => loadOptions(newValue, callback, api)}
          loadingMessage={() => 'Đang tải ...'}
          components={{
            Option: ({ children, ...props }) => (
              <components.Option {...props}>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ marginTop: 5 }}>
                    {props.data[ref.select] ? props.data[ref.select] : ''} ({props.data.name})
                  </div>
                </div>
              </components.Option>
            ),
            SingleValue: ({ children, ...props }) => (
              <components.SingleValue {...props}>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ marginTop: 5 }}>{props.data[ref.select] ? props.data[ref.select] : ''}</div>
                </div>
              </components.SingleValue>
            ),
          }}
          defaultOptions
          onChange={selected => {
            generalData[newRowName] = {
              [ref.select]: selected[ref.select] || '',
              objectId: selected._id,
            };
            // generalData[row.name] = selected[ref.select] || '';
            // generalData[`${newRowName}.objectId`] = selected._id;
            callBack('custom-field-input-change', generalData);
          }}
          value={obj.others[`${rowArr[1]}`]}
          theme={theme => ({
            ...theme,
            spacing: {
              ...theme.spacing,
              controlHeight: '55px',
            },
          })}
        />
      </div>
    );
  }

  return fieldCode;
};

const loadOptions = (newValue, callback, api) => {
  const token = localStorage.getItem('token');
  const url = `${api}?filter%5Bname%5D%5B%24regex%5D=${newValue}&filter%5Bname%5D%5B%24options%5D=gi`;
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(response => response.json())
    .then(myJson => {
      const { data } = myJson;
      callback(
        data.map(item => ({
          ...item,
          value: item._id,
          // avatar: item.avatar || item.logo,
        })),
      );
    });
};

const promiseOptions = (searchString, putBack) => {
  const param = {
    // limit: '10',
    skip: '0',
  };
  if (searchString !== '') {
    param.filter = {
      name: {
        $regex: searchString,
      },
    };
  }
  const token = localStorage.getItem('token');
  axios
    .get(`${API_USERS}?${serialize(param)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(myJson => {
      const { data } = myJson;
      putBack(
        data.data.map(item => ({
          ...item,
          value: item._id,
          label: item.name,
          avatar: item.avatar || item.logo,
        })),
      );
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.log(err);
    });
};
