/* eslint-disable react/no-access-state-in-setstate */
/**
 *
 * EditPricePolicy
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { TextField, withStyles, MenuItem, FormHelperText, FormControl } from '@material-ui/core'; // Typography, Fab, Button
import NumberFormat from 'react-number-format';
// import { Delete } from '@material-ui/icons';

import styles from './styles';
import { getLabelName } from '../../utils/common';
import CustomInputBase from '../Input/CustomInputBase';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';
import { viewConfigHandleOnChange, viewConfigCheckForm } from 'utils/common';
import dot from 'dot-object';
function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onChange={onChange}
      // onValueChange={values => {
      //   onChange({
      //     target: {
      //       value: values.value,
      //     },
      //   });
      // }}
      thousandSeparator
    />
  );
}

/* eslint-disable react/prefer-stateless-function */
class EditPricePolicy extends React.Component {
  state = {
    costPrice: 0,
    profitRate: 0,
    sellPrice: 0,
    agencyList: [],
    taxOption: [],
    currentTax: 0,
    product: null,
    errorRate: false,
    isSubmit: false,
    localMessages: {}
  };

  timeChange = null;

  timerValue = null;

  handleChangeMoney = (e, fieldName) => {

    this.setState({ [e.target.name]: e.target.value });
    const messages = viewConfigHandleOnChange('Stock', this.state.localMessages, fieldName, e.target.value);
    this.setState({
      localMessages: messages
    })
    if (e.target.name === 'costPrice') {
      let { profitRate } = this.state;
      let newProfitRate = 0;
      if (profitRate === '') newProfitRate = 0;
      else newProfitRate = profitRate;
      let sourcePrice = e.target.value.split(',').join("");
      const x = Math.floor((sourcePrice * (100 + Number(newProfitRate) || 0)) / 100);
      this.setState({ sellPrice: x });
    }
  };

  handleChange = (e, fieldName) => {
    // this.setState({ [e.target.name]: e.target.value });
    const messages = viewConfigHandleOnChange('Stock', this.state.localMessages, fieldName, e.target.value)
    this.setState({
      localMessages: messages,
      [e.target.name]: e.target.value
    })

    if (e.target.name === 'profitRate') {
      if (e.target.value > 100) {
        // this.setState({ errorRate: true });
        const newMessagesFieldName = {};
        newMessagesFieldName[fieldName] = "Lỗi không được nhập lớn hơn 100";
        this.setState(prevState => ({
          ...prevState,
          localMessages: newMessagesFieldName
        }));
      } else {
        // this.setState({ errorRate: false });
      }
      let { costPrice } = this.state;
      let sourcePrice = 0;
      if (costPrice === '') sourcePrice = 0;
      else sourcePrice = costPrice;
      sourcePrice = sourcePrice.split(',').join("");
      const x = Math.floor((sourcePrice * (100 + Number(e.target.value) || 0)) / 100);
      this.setState({ sellPrice: x });
    }
  };
  getMessages() {
    const { costPrice, profitRate, agencyList, taxOption, sellPrice } = this.state;
    const body = {
      pricePolicy: {
        sourcePrice: costPrice,
        profitRate,
        costPrice: sellPrice,
        agentPrice: agencyList,
      },
      taxs: taxOption
    }

    const data = dot.dot(body);
    const messages = viewConfigCheckForm(this.props.moduleCode, data);
    this.state.localMessages = messages;
  }

  componentDidMount() {
    this.props.onRef(this);
    this.state.isSubmit = false;
  }

  componentWillReceiveProps(props) {
    const { product } = props;
    if (Object.keys(product).length > 0 && !this.state.isSubmit && props.product !== this.props.product) {
      this.state.product = product;
      const { pricePolicy } = product;
      this.state.costPrice = pricePolicy.sourcePrice;
      this.state.profitRate = pricePolicy.profitRate;
      this.state.sellPrice = pricePolicy.costPrice;
      const list = [];
      pricePolicy.agentPrice.forEach(item => {
        list.push({
          id: item._id,
          name: item.name,
          option: item.changePrice,
          value: item.costPrice,
        });
      });
      this.state.agencyList = list;
      this.state.isSubmit = true;
    }
  }

  componentDidUpdate(props) {
    const { agencyList, product } = props;
    if (this.state.agencyList.length === 0 && agencyList.length > 0) {
      agencyList.forEach(item => {
        this.state.agencyList.push({
          id: item.index,
          name: item.title,
          value: '',
          option: 0,
        });
      });
    }
    if (Object.keys(product).length > 0 && !this.state.isSubmit && props.product !== this.props.product) {
      this.state.product = product;
      const { pricePolicy } = product;
      this.state.costPrice = pricePolicy.sourcePrice;
      this.state.profitRate = pricePolicy.profitRate;
      this.state.sellPrice = pricePolicy.costPrice;
      const list = [];
      pricePolicy.agentPrice.forEach(item => {
        list.push({
          id: item._id,
          name: item.name,
          option: item.changePrice,
          value: item.costPrice,
        });
      });
      this.state.agencyList = list;
      this.state.isSubmit = true;
    }
    this.getMessages();
  }

  render() {
    const { classes, name2Title } = this.props;
    const { sellPrice, costPrice, profitRate } = this.state;
    const { checkRequired, checkShowForm } = this.props;
    const { localMessages } = this.state;
    return (
      <div>
        <CustomInputBase
          // label={getLabelName('pricePolicy.sourcePrice', 'Stock')}
          label={name2Title['pricePolicy.sourcePrice']}
          className={classes.textField}
          value={costPrice}
          name="costPrice"
          onChange={e => this.handleChangeMoney(e, 'pricePolicy.sourcePrice')}
          // InputProps={{
          //   inputComponent: NumberFormatCustom,
          // }}
          type="number"
          formatType="Money"
          error={localMessages && localMessages["pricePolicy.sourcePrice"]}
          helperText={localMessages && localMessages["pricePolicy.sourcePrice"]}
          required={checkRequired["pricePolicy.sourcePrice"]}
          checkedShowForm={checkShowForm["pricePolicy.sourcePrice"]}
        />
        <FormControl className={classes.textField}>
          <CustomInputBase
            // label={getLabelName('pricePolicy.profitRate', 'Stock')}
            label={name2Title['pricePolicy.profitRate']}
            // className={classes.textField}
            value={profitRate}
            name="profitRate"
            type="number"
            onChange={e => this.handleChange(e, 'pricePolicy.profitRate')}
            error={localMessages && localMessages["pricePolicy.profitRate"]}
            helperText={localMessages && localMessages["pricePolicy.profitRate"]}
            required={checkRequired["pricePolicy.profitRate"]}
            checkedShowForm={checkShowForm["pricePolicy.profitRate"]}
          />
        </FormControl>
        <CustomInputBase
          // label={getLabelName('pricePolicy.costPrice', 'Stock')}
          label={name2Title['pricePolicy.costPrice']}
          className={classes.textField}
          value={sellPrice}
          name="sellPrice"
          disabled
          onChange={e => this.handleChangeMoney(e, 'pricePolicy.costPrice')}
          margin="normal"
          // InputProps={{
          //   inputComponent: NumberFormatCustom,
          // }}
          type="number"
          formatType="Money"
          error={localMessages && localMessages["pricePolicy.costPrice"]}
          helperText={localMessages && localMessages["pricePolicy.costPrice"]}
          required={checkRequired["pricePolicy.costPrice"]}
          checkedShowForm={checkShowForm["pricePolicy.costPrice"]}
        />
        <div />
        {this.state.agencyList.map((item, index) => (
          <div style={{ display: 'flex' }} key={item.id}>
            <span style={{ marginTop: 50, width: 150 }}>{item.name}</span>
            {/* {console.log(this.state.agencyList)} */}
            <CustomInputBase
              select
              label="Đơn vị tính"
              variant="outlined"
              value={item.option}
              onChange={e => this.handleChangeOption(index, e)}
              className={classes.textField}
              style={{ width: '50%' }}
            // helperText="Please select your currency"
            // error={localMessages && localMessages["pricePolicy.costPrice"]}
            // helperText={localMessages && localMessages["pricePolicy.costPrice"]}
            // required={checkRequired["pricePolicy.costPrice"]}
            // checkedShowForm={checkShowForm["pricePolicy.costPrice"]}
            >
              <MenuItem key={0} value={0}>
                Giá tính theo tiền
              </MenuItem>
              <MenuItem key={0} value={1}>
                Giá tính theo %
              </MenuItem>
            </CustomInputBase>
            <CustomInputBase
              label="Giá bán"
              className={classes.textField}
              name="sellPrice"
              variant="outlined"
              onChange={e => this.handleChangeValueAgency(index, e)}
              margin="normal"
              value={item.value}
              // InputProps={{
              //   inputComponent: NumberFormatCustom,
              // }}
              type="number"
              formatType="Money"
              error={localMessages && localMessages.sellPrice}
              helperText={localMessages && localMessages.sellPrice}
              required={checkRequired.sellPrice}
              checkedShowForm={checkShowForm.sellPrice}
            />
          </div>
        ))}
        {/* <Typography component="p" style={{ textAlign: 'left', marginTop: '20px', marginLeft: '10px' }}>
          Các loại thuế
        </Typography>
        {this.state.taxOption.length > 0
          ? this.state.taxOption.map((item, indexTax) => (
              <div style={{ display: 'flex' }}>
                <span style={{ marginTop: 44, width: 150 }}>{item.title} </span>

                <TextField
                  label="Tên thuế"
                  onChange={e => this.handleChangeOptionTaxName(indexTax, e)}
                  style={{ marginTop: 16 }}
                  variant="outlined"
                  className={classes.textField}
                  margin="normal"
                  value={item.option.name}
                />
                <TextField
                  label="%"
                  style={{ marginTop: 16 }}
                  onChange={e => this.handleChangeOptionTaxValue(indexTax, e)}
                  className={classes.textField}
                  variant="outlined"
                  margin="normal"
                  type="number"
                  value={item.option.value}
                />
                <Fab
                  size="small"
                  color="secondary"
                  onClick={() => this.handleDeleteTax(indexTax)}
                  style={{ marginTop: 20, width: '5%' }}
                  className={classes.margin}
                >
                  <Delete />
                </Fab>
              </div>
            ))
          : ''} */}
        {/* <Button size="small" style={{ float: 'left' }} onClick={this.handleAddField} variant="contained" color="primary">
          Thêm trường
        </Button> */}
      </div>
    );
  }

  handleDeleteTax = indexTax => {
    const { taxOption } = this.state;
    taxOption.splice(indexTax, 1);
    this.setState({ taxOption });
  };

  handleChangeOptionTaxName = (indexTax, e) => {
    const { taxOption } = this.state;
    taxOption[indexTax].option.name = e.target.value;
    this.setState({ taxOption });
  };

  handleChangeOptionTaxValue = (indexTax, e) => {
    const { taxOption } = this.state;
    taxOption[indexTax].option.value = e.target.value;
    this.setState({ taxOption });
  };

  handleAddField = () => {
    const { taxOption } = this.state;
    taxOption.push({ title: `Thuế ${this.state.currentTax + 1}`, option: { name: '', value: '' } });
    this.setState({ taxOption, currentTax: this.state.currentTax + 1 });
  };

  handleChangeOption = (index, e) => {
    const { agencyList } = this.state;
    agencyList[index].option = e.target.value;
    this.setState({ agencyList });
  };

  handleChangeValueAgency = (index, e) => {
    const { agencyList } = this.state;
    agencyList[index].value = e.target.value;
    this.setState({ agencyList });
  };

  getData = () => {
    // if (!this.state.errorRate) {
    //   this.setState({ isSubmit: true });
    //   this.props.pricePolicy.data = this.state;
    // }
    this.setState({ isSubmit: true });
    this.props.pricePolicy.data = this.state;
  };
}

EditPricePolicy.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(EditPricePolicy);
