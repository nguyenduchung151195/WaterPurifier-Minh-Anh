import React from 'react';
import { Checkbox, Button, MenuItem, Typography, Tooltip, Box } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { Dialog, TextField } from '../LifetekUi';
import VisibilityIcon from '@material-ui/icons/Visibility';
import InputIcon from '@material-ui/icons/Input';
import FormatIndentIncreaseIcon from '@material-ui/icons/FormatIndentIncrease';
import GridMUI from '@material-ui/core/Grid';
import CustomInputField from 'components/Input/CustomInputField';
import { VIEWCONFIG_FILTER_FIELD_CONFIG } from 'variable';
import Accordion from './Accordion';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import { TrendingFlat } from '@material-ui/icons';
import MomentUtils from '@date-io/moment';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import AddIcon from '@material-ui/icons/Add';
import InputAdornment from '@material-ui/core/InputAdornment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { Autocomplete } from 'components/LifetekUi';
import CustomInputBase from '../Input/CustomInputBase';
import { changeSnackbar } from '../../containers/Dashboard/actions';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

const DATE_FILTER_TYPES = [
  { name: 'week', title: 'TUẦN' },
  { name: 'month', title: 'THÁNG' },
  { name: 'quarter', title: 'QUÝ' },
  { name: 'year', title: 'NĂM' },
];
// const columns = Array.from({ length: 10 }, (v, i) => ({ name: i, title: i, checked: true }));

const typeOfDate = [
  { title: 'DD/MM/YYYY', name: 'DD/MM/YYYY', _id: 'date-vn-type-01' },
  { title: 'DD/MM/YYYY HH:mm', name: 'DD/MM/YYYY HH:mm', _id: 'date-vn-type-02' },
  { title: 'MM/DD/YYYY', name: 'MM/DD/YYYY', _id: 'date-type-01' },
  { title: 'MM/DD/YYYY HH:mm', name: 'MM/DD/YYYY HH:mm', _id: 'date-type-02' },
];
const typeOfInput = [
  {
    name: 'Chứa ký tự viết hoa',
    title: 'Chứa ký tự viết hoa',
    _id: 'upercase-type',
    includes: '(?=.*[A-Z])',
  },
  {
    name: 'Chứa ký tự có dấu',
    title: 'Chứa ký tự có dấu',
    _id: 'accented-type',
    includes: '/^[a-zA-Z\u00C0-\u017F]+,s[a-zA-Z\u00C0-\u017F]+$/',
  },
  {
    name: 'Chứa ký tự đặc biệt',
    title: 'Chứa ký tự đặc biệt',
    _id: 'special-type',
    includes: '(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]',
  },
  {
    name: 'Email',
    title: 'Email',
    _id: 'email-type',
    includes: '/^[^s@]+@[^s@]+.[^s@]+$/',
  },
  {
    name: 'Số điện thoại',
    title: 'Số điện thoại',
    _id: 'phoneNumber-type',
    includes: '/^[0-9]$/',
  },
];
const blockInvalidChar = e => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault();

class DialogAsync extends React.PureComponent {
  constructor(props) {
    super(props);
    // const view = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === this.props.code);

    this.state = {
      columns: [],
      fileColumns: [],
      addField: false,
      crmSource: [],
      name: '',
      sl: '',
      addFieldError: false,
      inputValue: '',
      inputValueType: '',
      // eslint-disable-next-line react/no-unused-state
      open: false,
      filterField: 0,
      hasUpperCase: false,
      hasSpecialCh: false,
      hasAccentedCh: false,
      formatDateNoHour: false,
      formatDateHasHour: true,
      compare: {},
      compareField: {},
      calculation: {},
      calculationField: {},
      openAccordion: {},
      dateType: {},
      inputType: [],
      errorEmail: false,
      messages: {
        errorEmail: '',
      },
      tab: 0,
    };
  }

  handleSave = () => {
    const { columns, filterField, filterFieldValue, inputType, fileColumns } = this.state;
    this.props.saveSetting(columns, 1, filterField, inputType, fileColumns);
    this.props.onChangeSnackbar({ status: true, message: 'Cập nhật cấu hình bảng thành công!', variant: 'success' });
    // console.log('columns', columns, inputType);
    // body = {
    //   inputType: this.state.inputType,
    // }
  };

  handleSaveAll = () => {
    const { columns, filterField, filterFieldValue, inputType, fileColumns } = this.state;
    this.props.saveSettingAll(columns, 1, filterField, inputType, fileColumns);
  };
  componentDidMount() {
    this.setState({ crmSource: JSON.parse(localStorage.getItem('crmSource')), filterField: this.props.filterField });
  }

  handleChangeFilterField = e => {
    this.setState({ filterField: e.target.value });
  };

  handleCancel = () => {
    const { columns } = this.props;
    this.setState({ columns });
    this.props.saveSetting(columns, false);
  };

  handleChecked = e => {
    const { columns, filterField, filterFieldValue } = this.state;
    const curentColumns = { name: e.target.name, checked: e.target.checked };
    if (filterField && filterFieldValue) {
      const newColumns = columns.map(item => {
        if (item.name === curentColumns.name) {
          if (!item.filterConfig) {
            item.filterConfig = {};
          }
          if (!item.filterConfig[filterFieldValue.type]) {
            item.filterConfig[filterFieldValue.type] = {};
          }
          item.filterConfig[filterFieldValue.type].checked = e.target.checked;
        }
        return item;
      });
      this.setState({ columns: newColumns });
    } else {
      const newColumns = columns.map(item => (item.name === curentColumns.name ? { ...item, checked: e.target.checked } : item)); // em phai nhet thang inputType vao columms nhuw the nay @@
      this.setState({ columns: newColumns });
    }
    const newColumns = columns.map(item => (item.name === curentColumns.name ? { ...item, checked: e.target.checked } : item));
    this.setState({ columns: newColumns });
  };

  handleCheckedRequireForm = e => {
    const { columns, filterField, filterFieldValue } = this.state;
    const curentColumns = { name: e.target.name, checkedRequireForm: e.target.checked };
    if (e.target.checked) {
      if (filterField && filterFieldValue) {
        const newColumns = columns.map(item => {
          if (item.name === curentColumns.name) {
            if (!item.filterConfig) {
              item.filterConfig = {};
            }
            if (!item.filterConfig[filterFieldValue.type]) {
              item.filterConfig[filterFieldValue.type] = {};
            }
            item.filterConfig[filterFieldValue.type].checkedRequireForm = e.target.checked;
            item.filterConfig[filterFieldValue.type].checkedShowForm = e.target.checked;
          }
          return item;
        });
        this.setState({ columns: newColumns });
      } else {
        const newColumns = columns.map(
          item => (item.name === curentColumns.name ? { ...item, checkedRequireForm: e.target.checked, checkedShowForm: e.target.checked } : item),
        );
        this.setState({ columns: newColumns });
      }
    } else {
      if (filterField && filterFieldValue) {
        const newColumns = columns.map(item => {
          if (item.name === curentColumns.name) {
            if (!item.filterConfig) {
              item.filterConfig = {};
            }
            if (!item.filterConfig[filterFieldValue.type]) {
              item.filterConfig[filterFieldValue.type] = {};
            }
            item.filterConfig[filterFieldValue.type].checkedRequireForm = e.target.checked;
          }
          return item;
        });
        this.setState({ columns: newColumns });
      } else {
        const newColumns = columns.map(item => (item.name === curentColumns.name ? { ...item, checkedRequireForm: e.target.checked } : item));
        this.setState({ columns: newColumns });
      }
    }
  };

  handleCheckedShowForm = e => {
    const { columns, filterField, filterFieldValue } = this.state;
    const curentColumns = { name: e.target.name, checkedShowForm: e.target.checked };
    if (filterField && filterFieldValue) {
      const newColumns = columns.map(item => {
        if (item.name === curentColumns.name) {
          if (!item.filterConfig) {
            item.filterConfig = {};
          }
          if (!item.filterConfig[filterFieldValue.type]) {
            item.filterConfig[filterFieldValue.type] = {};
          }
          item.filterConfig[filterFieldValue.type].checkedShowForm = e.target.checked;
        }
        return item;
      });
      this.setState({ columns: newColumns });
    } else {
      const newColumns = columns.map(item => (item.name === curentColumns.name ? { ...item, checkedShowForm: e.target.checked } : item));
      this.setState({ columns: newColumns });
    }
  };

  handleEnabaleSearch = e => {
    const { columns, filterField, filterFieldValue } = this.state;
    const curentColumns = { name: e.target.name, enabaleSearch: e.target.checked };
    if (filterField && filterFieldValue) {
      const newColumns = columns.map(item => {
        if (item.name === curentColumns.name) {
          if (!item.filterConfig) {
            item.filterConfig = {};
          }
          if (!item.filterConfig[filterFieldValue.type]) {
            item.filterConfig[filterFieldValue.type] = {};
          }
          item.filterConfig[filterFieldValue.type].enabaleSearch = e.target.checked;
        }
        return item;
      });
      this.setState({ columns: newColumns });
    } else {
      const newColumns = columns.map(item => (item.name === curentColumns.name ? { ...item, enabaleSearch: e.target.checked } : item));
      this.setState({ columns: newColumns });
    }
    const newColumns = columns.map(item => (item.name === curentColumns.name ? { ...item, enabaleSearch: e.target.checked } : item));
    this.setState({ columns: newColumns });
  };

  handleIsInSearchbar = e => {
    const { columns } = this.state;
    const curentColumns = { name: e.target.name, isInSearchbar: e.target.checked };

    const newColumns = columns.map(item => (item.name === curentColumns.name ? { ...item, isInSearchbar: e.target.checked } : item));
    this.setState({ columns: newColumns });
  };

  handleChangeDateFilterType = (e, editItem) => {
    const { columns } = this.state;

    const newColumns = columns.map(item => (item.name === editItem.name ? { ...item, dateFilterType: e.target.value } : item));
    this.setState({ columns: newColumns });
  };

  isChecked = (name, key) => {
    const itemFound = this.state.columns.find(item => item.name === name);
    if (!itemFound) return false;

    const { filterField, filterFieldValue } = this.state;
    if (filterField && filterFieldValue && itemFound.filterConfig && itemFound.filterConfig[filterFieldValue.type]) {
      return itemFound.filterConfig[filterFieldValue.type][key];
    }
    return itemFound[key];
  };

  handleImportTable = e => {
    const { columns, filterField, filterFieldValue } = this.state;
    const curentColumns = { name: e.target.name, importTable: e.target.checked };
    if (filterField && filterFieldValue) {
      const newColumns = columns.map(item => {
        if (item.name === curentColumns.name) {
          if (!item.filterConfig) {
            item.filterConfig = {};
          }
          if (!item.filterConfig[filterFieldValue.type]) {
            item.filterConfig[filterFieldValue.type] = {};
          }
          item.filterConfig[filterFieldValue.type].importTable = e.target.checked;
        }
        return item;
      });
      this.setState({ columns: newColumns });
    } else {
      const newColumns = columns.map(item => (item.name === curentColumns.name ? { ...item, importTable: e.target.checked } : item));
      this.setState({ columns: newColumns });
    }
    const newColumns = columns.map(item => (item.name === curentColumns.name ? { ...item, importTable: e.target.checked } : item));
    this.setState({ columns: newColumns });
  };

  handleExportTable = e => {
    const { columns, filterField, filterFieldValue } = this.state;
    const curentColumns = { name: e.target.name, exportTable: e.target.checked };
    if (filterField && filterFieldValue) {
      const newColumns = columns.map(item => {
        if (item.name === curentColumns.name) {
          if (!item.filterConfig) {
            item.filterConfig = {};
          }
          if (!item.filterConfig[filterFieldValue.type]) {
            item.filterConfig[filterFieldValue.type] = {};
          }
          item.filterConfig[filterFieldValue.type].exportTable = e.target.checked;
        }
        return item;
      });
      this.setState({ columns: newColumns });
    } else {
      const newColumns = columns.map(item => (item.name === curentColumns.name ? { ...item, exportTable: e.target.checked } : item));
      this.setState({ columns: newColumns });
    }
    const newColumns = columns.map(item => (item.name === curentColumns.name ? { ...item, exportTable: e.target.checked } : item));
    this.setState({ columns: newColumns });
  };

  getValue = name => {
    const { columns, fileColumns, tab, filterField, filterFieldValue } = this.state;
    if (tab === 0) {
      const itemFound = columns.find(item => item.name === name);
      if (
        itemFound &&
        filterField &&
        filterFieldValue &&
        filterFieldValue.type &&
        itemFound.filterConfig &&
        itemFound.filterConfig[filterFieldValue.type] &&
        typeof itemFound.filterConfig[filterFieldValue.type].title !== 'undefined'
      ) {
        return itemFound.filterConfig[filterFieldValue.type].title;
      }
      return itemFound.title;
    } else {
      const itemFound = fileColumns.find(item => item.name === name);
      return itemFound.title;
    }
  };

  handleChange = e => {
    const { columns, filterField, filterFieldValue } = this.state;
    if (filterField && filterFieldValue && filterFieldValue.type) {
      const newColumns = columns.map(item => {
        if (item.name === e.target.name) {
          if (!item.filterConfig) {
            item.filterConfig = {};
          }
          if (!item.filterConfig[filterFieldValue.type]) {
            item.filterConfig[filterFieldValue.type] = {};
          }
          item.filterConfig[filterFieldValue.type] = { ...item.filterConfig[filterFieldValue.type], title: e.target.value };
        }
        return item;
      });
      this.setState({ columns: newColumns });
    } else {
      const curentColumns = { name: e.target.name, title: e.target.value };
      const newColumns = columns.map(item => (item.name === curentColumns.name ? { ...item, title: e.target.value } : item));
      this.setState({ columns: newColumns });
    }
  };
  handleChangeFileColumns = e => {
    const { fileColumns } = this.state;
    const curentColumns = { name: e.target.name, title: e.target.value };
    const newColumns = fileColumns.map(item => (item.name === curentColumns.name ? { ...item, title: e.target.value } : item));
    this.setState({ fileColumns: newColumns });
  };

  handleMinLength = e => {
    const { columns } = this.state;
    const curentColumns = { name: e.target.name, minLength: e.target.value };
    const newColumns = columns.map(item => (item.name === curentColumns.name ? { ...item, minLength: e.target.value } : item));
    this.setState({ columns: newColumns });
  };

  handleMaxLength = e => {
    const { columns } = this.state;
    const curentColumns = { name: e.target.name, maxLength: e.target.value };
    const newColumns = columns.map(item => (item.name === curentColumns.name ? { ...item, maxLength: e.target.value } : item));
    this.setState({ columns: newColumns });
  };

  handleMin = e => {
    const { columns } = this.state;
    const curentColumns = { name: e.target.name, min: e.target.value };
    const newColumns = columns.map(item => (item.name === curentColumns.name ? { ...item, min: e.target.value } : item));
    this.setState({ columns: newColumns });
  };

  handleMax = e => {
    const { columns } = this.state;
    const curentColumns = { name: e.target.name, max: e.target.value };
    const newColumns = columns.map(item => (item.name === curentColumns.name ? { ...item, max: e.target.value } : item));
    this.setState({ columns: newColumns });
  };

  // componentWillUpdate(props) {
  //   this.state.columns = props.columns;
  // }

  static getDerivedStateFromProps(props, state) {
    if (props.open && !state.open && props.columns !== state.columns) {
      // console.log('set lai');
      return {
        open: true,
        columns: props.columns.map(i => ({ ...i, dateFilterType: i.dateFilterType || '' })),
        filterField: props.filterField,
        fileColumns: props.fileColumns || [],
      };
    }
    if (props.open && !state.open)
      return {
        open: true,
      };
    if (!props.open && state.open) {
      return { open: false };
    }
    return null;
  }

  addColumn = () => {
    const { columns, fileColumns, tab, name, sl, inputValue, addFieldError, inputValueType, inputType } = this.state;
    if (
      inputValueType === '' ||
      inputValue === '' ||
      inputValue.charAt(0) === ' ' ||
      inputValue.charAt(inputValue.length - 1) === ' ' ||
      inputValue.length > 100 ||
      addFieldError
    ) {
      alert('Lưu thất bại!');
      return;
    }
    let add = {
      checked: true,
      checkedRequireForm: false,
      checkedShowForm: true,
      isFilter: false,
      isRequire: false,
      isSort: false,
      name: `others.${name}`,
      order: 1000 + columns.length,
      title: name,
      type: sl,
      tp: 1,
      inputType: [],
    };
    if (this.state.filterField && this.state.filterFieldValue && tab === 0) {
      add = {
        checked: true,
        isFilter: false,
        isRequire: false,
        isSort: false,
        inputType: [], // em truyen input type vao day thu xem
        name: `others.${name}`,
        order: 1000 + columns.length,
        title: `${name}`,
        type: sl,
        tp: 1,
        filterConfig: {
          [`${this.state.filterFieldValue.type}`]: {
            checked: true,
            checkedShowForm: true,
          },
        },
      };
    }
    let newCls;
    if (tab === 0) {
      newCls = columns.concat(add);
      this.setState({ columns: newCls, addField: false });
    } else {
      newCls = fileColumns.concat(add);
      this.setState({ fileColumns: newCls, addField: false });
    }
    alert('Lưu thành công!');
  };

  onChangeText = e => {
    this.setState({ sl: e.target.value });
  };

  formatData = (name, value) => {
    const { columns } = this.state;
    const curentColumns = { name: name, inputFormat: value };
    this.setState({ inputType: value || [] });
    const newColumns = columns.map(item => (item.name === curentColumns.name ? { ...item, inputFormat: value } : item));
    this.setState({ columns: newColumns });
    const reEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const rePhoneNumber = /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/;
    if (this.state.inputType === 'email') {
      if (reEmail.test(String(e.target.value).toLowerCase())) {
        this.setState({
          errorEmail: false,
          messages: { ...messages, errorEmail: '' },
        });
        this.checkMatchData(e.target.name, e.target.value);
      } else {
        this.setState({
          errorEmail: true,
          messages: { ...messages, errorEmail: 'Email không hợp lệ!' },
        });
      }
    }
    if (this.state.inputType === 'phoneNumber') {
      if (rePhoneNumber.test(String(e.target.value).toLowerCase())) {
        this.setState({
          errorEmail: false,
          messages: { ...messages, errorEmail: '' },
        });
        this.checkMatchData(e.target.name, e.target.value);
      } else {
        this.setState({
          errorEmail: true,
          messages: { ...messages, errorEmail: 'Email không hợp lệ!' },
        });
      }
    }
  };

  renderDialogTitle = () => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ flexGrow: 1, width: '50%', borderBottom: this.state.tab === 0 ? '1px solid' : '' }} onClick={() => this.setState({ tab: 0 })}>
          Cấu hình bảng
        </span>
        <span style={{ flexGrow: 1, width: '50%', borderBottom: this.state.tab === 1 ? '1px solid' : '' }} onClick={() => this.setState({ tab: 1 })}>
          Cấu hình trường thông tin tài liệu
        </span>
      </div>
    );
  };
  content = item => {
    return (
      <div style={{ width: '100%', display: 'block' }}>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                inputProps={{
                  name: [item.name],
                }}
                onChange={this.handleChecked}
                checked={this.isChecked(item.name, 'checked')}
                color="primary"
              />
            }
            label="Ẩn hiện thông tin trong bảng"
          />
          {item.name === 'owner.ownerId' ? null : (
            <FormControlLabel
              control={
                <Checkbox
                  inputProps={{
                    name: [item.name],
                  }}
                  onChange={this.handleCheckedRequireForm}
                  checked={item.isRequire ? true : this.isChecked(item.name, 'checkedRequireForm')}
                  color="primary"
                  disabled={item.isRequire}
                />
              }
              label="Bắt buộc phải nhập thông tin"
            />
          )}

          <FormControlLabel
            control={
              <Checkbox
                inputProps={{
                  name: [item.name],
                }}
                onChange={this.handleCheckedShowForm}
                checked={item.isRequire || item.checkedRequireForm ? true : this.isChecked(item.name, 'checkedShowForm')}
                color="primary"
                disabled={item.isRequire || item.checkedRequireForm}
              />
            }
            label="Ẩn hiện trường thông tin trong form"
          />
          {item.hideImportCheckBox ? null : (
            <FormControlLabel
              control={
                <Checkbox
                  inputProps={{
                    name: [item.name],
                  }}
                  onChange={this.handleImportTable}
                  checked={this.isChecked(item.name, 'importTable')}
                  color="primary"
                />
              }
              label="Cho phép Import"
            />
          )}

          {item.hideExportCheckBox ? null : (
            <FormControlLabel
              control={
                <Checkbox
                  inputProps={{
                    name: [item.name],
                  }}
                  onChange={this.handleExportTable}
                  checked={this.isChecked(item.name, 'exportTable')}
                  color="primary"
                />
              }
              label="Cho phép Export"
            />
          )}
          {item.hideSearchCheckBox ? null : (
            <>
              <FormControlLabel
                control={
                  <Checkbox
                    inputProps={{
                      name: [item.name],
                    }}
                    onChange={this.handleEnabaleSearch}
                    checked={this.isChecked(item.name, 'enabaleSearch')}
                    color="primary"
                  />
                }
                label="Cho phép Search"
              />
              {this.isChecked(item.name, 'enabaleSearch') && item.type !== 'String' ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      inputProps={{
                        name: [item.name],
                      }}
                      onChange={this.handleIsInSearchbar}
                      checked={this.isChecked(item.name, 'isInSearchbar')}
                      color="primary"
                    />
                  }
                  label="Hiển thị trên thanh tìm kiếm"
                />
              ) : null}
            </>
          )}
        </FormGroup>
        <div>
          {item.type === 'String' ? (
            <div>
              <h5>ĐỊNH DẠNG DỮ LIỆU ĐẦU VÀO</h5>
              <GridMUI container alignItems="center">
                <GridMUI item sm={10} className="pr-3">
                  <Autocomplete
                    onChange={val => this.formatData(item['name'], val)}
                    suggestions={typeOfInput}
                    value={this.state.inputType}
                    label="Định dạng dữ liệu đầu vào"
                    isMulti
                    name={item['name']}
                    helperText={this.state.messages && this.state.messages.errorEmail}
                    error={this.state.errorEmail}
                    // checkedShowForm={true}
                  />
                </GridMUI>
              </GridMUI>
            </div>
          ) : null}

          {item.type === 'String' ? (
            <div>
              <h5>ĐỘ DÀI KÝ TỰ CÓ THỂ NHẬP</h5>
              <GridMUI container alignItems="center">
                <GridMUI item sm={5} className="pr-3">
                  <TextField
                    label="Số lượng ký tự tối thiểu"
                    type="number"
                    fullWidth
                    InputProps={{ inputProps: { min: 0, style: { padding: '18.5px 14px 18.5px 14px' } }, style: { marginRight: '20px' } }}
                    name={item['name']}
                    value={item.minLength}
                    onChange={this.handleMinLength}
                    InputLabelProps={{ shrink: true }}
                    onKeyDown={blockInvalidChar}
                  />
                </GridMUI>
                <GridMUI item sm={5} className="pr-3">
                  <TextField
                    label="Số lượng ký tự tối đa"
                    type="number"
                    fullWidth
                    InputProps={{ inputProps: { min: 0, style: { padding: '18.5px 14px 18.5px 14px' } } }}
                    name={item['name']}
                    value={item.maxLength}
                    onChange={this.handleMaxLength}
                    InputLabelProps={{ shrink: true }}
                    onKeyDown={blockInvalidChar}
                  />
                </GridMUI>
              </GridMUI>
            </div>
          ) : null}
          {item.type === 'Number' ? (
            <div>
              <h5>Số lớn nhất và nhỏ nhất có thể nhập</h5>
              <GridMUI item sm={5} className="pr-3">
                <TextField
                  label="Số nhỏ nhất"
                  type="number"
                  name={item['name']}
                  value={item.min}
                  InputProps={{ inputProps: { style: { marginRight: '20px' } } }}
                  onChange={this.handleMin}
                  onKeyDown={blockInvalidChar}
                />
              </GridMUI>
              <GridMUI item sm={5} className="pr-3">
                <TextField
                  label="Số lớn nhất"
                  type="number"
                  name={item['name']}
                  value={item.max}
                  onChange={this.handleMax}
                  onKeyDown={blockInvalidChar}
                />
              </GridMUI>
            </div>
          ) : null}
          {item.type === 'Date' ? (
            <div>
              <h5>ĐỊNH DẠNG THỜI GIAN</h5>
              <GridMUI container alignItems="center">
                <GridMUI item sm={10} className="pr-3">
                  <Autocomplete
                    onChange={value => this.setState({ dateType: value })}
                    suggestions={typeOfDate}
                    value={this.state.dateType}
                    label="Chọn cấu hình thời gian"
                    isMulti={false}
                    // checkedShowForm={true}
                  />
                </GridMUI>
                <GridMUI item sm={10} className="pr-3">
                  <TextField
                    id="select-date-filter-type"
                    select
                    onChange={e => {
                      this.handleChangeDateFilterType(e, item);
                    }}
                    value={item.dateFilterType}
                    label="LỌC THEO"
                    name="dateFilterType"
                    style={{ width: '100%' }}
                    variant="outlined"
                    margin="normal"
                    inputProps={{
                      style: {
                        padding: 0,
                      },
                    }}
                    SelectProps={{
                      MenuProps: {},
                    }}
                  >
                    <MenuItem key="-999" value="">
                      --- Chọn ---
                    </MenuItem>
                    {DATE_FILTER_TYPES.map(field => (
                      <MenuItem key={field.name} value={field.name}>
                        {field.title}
                      </MenuItem>
                    ))}
                  </TextField>
                </GridMUI>
              </GridMUI>
            </div>
          ) : null}
        </div>
      </div>
    );
  };
  render() {
    const { onClose, open, dashboardPage } = this.props;
    const profile = dashboardPage ? dashboardPage.profile : undefined;
    const Admin = profile !== undefined ? profile.admin : false;
    const { columns, fileColumns, addField, crmSource, name, sl, inputValue, addFieldError, inputValueType, filterField, openAccordion } = this.state;
    let c = {};
    if (filterField) {
      c = columns.find(i => i.name === filterField) || {};
    }
    const filterFieldColumns = columns.filter(i => i.type === 'MenuItem' || i.configType);
    let func = {};
    if (Admin === true)
      func = {
        extraText: 'Lưu Toàn Hệ Thống',
        onExtra: this.handleSaveAll,
      };
    return (
      <Dialog title={this.renderDialogTitle()} open={open} onSave={this.handleSave} onCancel={this.handleCancel} onClose={onClose} {...func}>
        <>
          {this.state.tab === 0 ? (
            <>
              <GridMUI container alignItems="center" spacing={8} style={{ paddingRight: '1rem' }}>
                <GridMUI item sm={6}>
                  <CustomInputBase
                    id="select-filter-field"
                    select
                    onChange={this.handleChangeFilterField}
                    value={this.state.filterField}
                    label="Trường dữ liệu phân loại"
                    name="filterField"
                    style={{ width: '100%' }}
                    SelectProps={{
                      MenuProps: {},
                    }}
                  >
                    {filterFieldColumns.map((item, index) => (
                      <MenuItem value={item.name} key={`${item.name}_${index}`}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </CustomInputBase>
                </GridMUI>
                {/* {test.type === "MenuItem" ?  */}
                <GridMUI item sm={6}>
                  {c && (
                    <CustomInputField
                      options={c.menuItem ? c.menuItem : ''}
                      configType={c.configType ? c.configType : ''}
                      configCode={c.configCode ? c.configCode : ''}
                      type={c.type}
                      label={c.title}
                      value={this.state.filterFieldValue}
                      onChange={e => {
                        if (typeof e.target.value.type === 'undefined') {
                          this.setState({ filterFieldValue: { ...e.target.value, type: e.target.value ? e.target.value.value : undefined } });
                        } else {
                          this.setState({ filterFieldValue: e.target.value });
                        }
                      }}
                    />
                  )}
                </GridMUI>
                {/* : null }  */}
              </GridMUI>
              {columns
                .filter(item => {
                  if (!item.filterConfig) {
                    return true;
                  }
                  if (this.state.filterField && this.state.filterFieldValue) {
                    if (!item.name.includes('others.') && typeof item.filterConfig[this.state.filterFieldValue.type] === 'undefined') {
                      return true;
                    }
                    if (item.filterConfig[this.state.filterFieldValue.type]) {
                      return true;
                    }
                  }
                  return false;
                })
                .map(
                  (item, index) =>
                    item.name === 'edit' ? null : (
                      <div key={`${item.name}_${index}`}>
                        {/* {console.log(item)} */}
                        <GridMUI container alignItems="center">
                          <GridMUI item sm={12} className="pr-3">
                            <TextField
                              fullWidth
                              value={this.getValue(item.name)}
                              name={item.name}
                              onChange={this.handleChange}
                              label={`${this.getValue(item.name)} (${item.name})`}
                              InputProps={{
                                endAdornment:
                                  item.name === 'edit' ? null : (
                                    <InputAdornment style={{ cursor: 'pointer' }} position="end">
                                      {openAccordion.order === item.order && openAccordion.status ? (
                                        <ExpandLessIcon
                                          color="primary"
                                          onClick={() => this.setState({ openAccordion: { order: item.order, status: false } })}
                                        />
                                      ) : (
                                        <ExpandMoreIcon
                                          color="primary"
                                          onClick={() => this.setState({ openAccordion: { order: item.order, status: true } })}
                                        />
                                      )}
                                    </InputAdornment>
                                  ),
                              }}
                            />
                            <Accordion
                              title={this.getValue(item.name)}
                              content={this.content(item)}
                              order={item.order}
                              openAccordion={openAccordion}
                            />
                          </GridMUI>
                          {item.tp === 1 ? (
                            <GridMUI>
                              <Tooltip title="Xóa trường">
                                <Delete onClick={() => this.delColumn(item.name)} style={{ cursor: 'pointer' }} />
                              </Tooltip>
                            </GridMUI>
                          ) : null}
                        </GridMUI>
                      </div>
                    ),
                )}
              <div>
                <Button onClick={() => this.setState({ addField: true })} variant="outlined" color="primary">
                  Thêm trường
                </Button>
              </div>
            </>
          ) : (
            <>
              {fileColumns.map((item, index) => (
                <div key={`${item.name}_${index}`}>
                  <GridMUI container alignItems="center">
                    <GridMUI item sm={12} className="pr-3">
                      <TextField
                        fullWidth
                        value={this.getValue(item.name)}
                        name={item.name}
                        onChange={this.handleChangeFileColumns}
                        label={`${this.getValue(item.name)} (${item.name})`}
                        // InputProps={{
                        //   endAdornment: (
                        //     <InputAdornment style={{ cursor: 'pointer' }} position="end">
                        //       {openAccordion.order === item.order && openAccordion.status ? (
                        //         <ExpandLessIcon
                        //           color="primary"
                        //           onClick={() => this.setState({ openAccordion: { order: item.order, status: false } })}
                        //         />
                        //       ) : (
                        //         <ExpandMoreIcon
                        //           color="primary"
                        //           onClick={() => this.setState({ openAccordion: { order: item.order, status: true } })}
                        //         />
                        //       )}
                        //     </InputAdornment>
                        //   ),
                        // }}
                      />
                      <Accordion title={this.getValue(item.name)} content={this.content(item)} order={item.order} openAccordion={openAccordion} />
                    </GridMUI>
                    {item.tp === 1 ? (
                      <GridMUI>
                        <Tooltip title="Xóa trường">
                          <Delete onClick={() => this.delColumn(item.name)} style={{ cursor: 'pointer' }} />
                        </Tooltip>
                      </GridMUI>
                    ) : null}
                  </GridMUI>
                </div>
              ))}
              <div>
                <Button onClick={() => this.setState({ addField: true })} variant="outlined" color="primary">
                  Thêm trường
                </Button>
              </div>
            </>
          )}
        </>
        <Dialog title="Thêm trường mới" onSave={this.addColumn} onClose={this.closeAddField} open={addField}>
          <TextField
            error={
              inputValue === '' ||
              inputValue.charAt(0) === ' ' ||
              inputValue.charAt(inputValue.length - 1) === ' ' ||
              inputValue.length > 100 ||
              addFieldError
            }
            helperText={
              inputValue === ''
                ? 'Không được để trống tên trường'
                : addFieldError
                  ? // ? 'Tên trường không có ký tự đặc biệt'
                    'Tên trường viết bằng tiếng Việt có dấu'
                  : inputValue.charAt(0) === ' ' || inputValue.charAt(inputValue.length - 1) === ' '
                    ? 'Đầu tên trường và cuối tên trường không được để space'
                    : inputValue.length > 100
                      ? 'Tên trường không quá 100 ký tự'
                      : addFieldError
                        ? // ? 'Tên trường không có ký tự đặc biệt'
                          'Tên trường viết bằng tiếng Việt có dấu'
                        : ''
            }
            value={name}
            onChange={this.handleChangeAddField}
            label="Tên trường(Viết bằng tiếng Việt có dấu)"
          />
          <TextField
            error={inputValueType === ''}
            helperText={inputValueType === '' ? 'Không được để trống kiểu dữ liệu' : ''}
            onChange={this.handleChangeAddFieldType}
            value={sl}
            select
            label="Kiểu dữ liệu"
          >
            <MenuItem value="text">Kiểu chữ</MenuItem>
            <MenuItem value="number">Kiểu số</MenuItem>
            <MenuItem value="date">Kiểu ngày/tháng</MenuItem>
            {/* {crmSource
              ? crmSource.map(item => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.title}
                  </MenuItem>
                ))
              : null} */}
          </TextField>
        </Dialog>
      </Dialog>
    );
  }

  closeAddField = () => {
    this.setState({ addField: false, sl: '', name: '' });
  };

  delColumn = name => {
    const { columns, fileColumns, tab } = this.state;
    if (tab === 0) {
      const newCls = columns.filter(item => item.name !== name);
      this.setState({ columns: newCls });
    } else {
      const newCls = fileColumns.filter(item => item.name !== name);
      this.setState({ fileColumns: newCls });
    }
  };

  handleChangeAddField = e => {
    // const rex = /^[A-Za-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]+(?:[_][A-Za-z0-9]+)*$/;
    const rex = /[^a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]/u;
    const addFieldError = rex.test(e.target.value);
    const inputValue = e.target.value;
    this.setState({ addFieldError, inputValue, name: e.target.value });
  };

  handleChangeAddFieldType = e => {
    const inputValueType = e.target.value;
    this.setState({ inputValueType, sl: e.target.value });
  };
}
const mapStateToProps = createStructuredSelector({});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(DialogAsync);
