/* eslint-disable consistent-return */
/**
 *
 * ProductInforDrawer
 *
 */

import React from 'react';
import {
  Table,
  Paper,
  TableCell,
  TableRow,
  TableBody,
  withStyles,
  Toolbar,
  AppBar,
  Typography,
  IconButton,
  TableHead,
  Button,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import classnames from 'classnames';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import styles from './styles';
import moment from 'moment';
import { API_BILLS } from '../../../config/urlConfig';
import axios from 'axios';
/* eslint-disable react/prefer-stateless-function */
class InforBill extends React.Component {
  state = {
    data: {},
  };
  componentDidMount() {
    const token = localStorage.getItem('token');
    axios
      .get(`${API_BILLS}\\${this.props.idBill}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(data => {
        this.setState({ data: data.data });
      })
      .catch(function (error) {
        console.log('lỗi rồi', error);
      });
  }
  render() {
    const { data } = this.state;
    //      const { classes, Asset = {} } = this.props;
    // let agencyListDisplay = [];
    // let text = '';
    // let amountBackup = 0;
    // if (product.sellingPoint) {
    //   if (!product.isService && product.otherInfo) {
    //     agencyListDisplay = product.sellingPoint.filter(item => item.amount > 0).map(n => n.name);
    //     let amount = 0;
    //     if (this.props.currentStock === 0) {
    //       product.sellingPoint.forEach(item => {
    //         amount += item.amount;
    //       });
    //     } else {
    //       // eslint-disable-next-line array-callback-return
    //       const x = product.sellingPoint.find(n => {
    //         if (this.props.currentStock === n.organizationUnitId) return true;
    //       });
    //       if (x) {
    //         amount = x.amount;
    //       }
    //     }
    //     amountBackup = amount;
    //     let listUnit = product.otherInfo.unitChange;
    //     if (listUnit.length > 0) {
    //       // let unitArr = [];
    //       const numberExchange = [];
    //       if (product.unit && product.unit.unitId === listUnit[0].from.unitId) {
    //         listUnit = listUnit.reverse();
    //       }
    //       listUnit.forEach(item => {
    //         numberExchange.push(item.numberExchange);
    //       });
    //       let number = [];
    //       if (numberExchange.length > 1) {
    //         for (let i = 0; i < numberExchange.length; i++) {
    //           let x = numberExchange[i];
    //           for (let j = i + 1; j < numberExchange.length; j++) {
    //             x *= numberExchange[j];
    //           }
    //           number.push(x);
    //         }
    //       } else number = numberExchange;
    //       listUnit.forEach((item, index) => {
    //         const unit = parseInt(amount / number[index], 10);
    //         amount %= number[index];
    //         if (text !== '') {
    //           text += `, ${unit} ${item.to.unit}`;
    //         } else text += `${unit} ${item.to.unit}`;
    //         if (index === listUnit.length - 1 && amount !== 0) {
    //           if (text !== '') {
    //             text += `, ${amount} ${item.from.unit}`;
    //           } else text += `${amount} ${item.from.unit}`;
    //         }
    //       });
    //     } else text = `${amount} ${product.unit ? product.unit.name : ''}`;
    //   } else text = 'là dịch vụ';
    // }

    return (
      <div style={{ marginTop: 100, width: '40vw' }}>
        <AppBar>
          <Toolbar>
            <IconButton color="inherit" aria-label="Close" onClick={this.props.onClose}>
              <Close />
            </IconButton>
            <Typography variant="h6" color="inherit" style={{ width: '92%' }}>
              {this.props.status === 1 ? 'Thông tin chung' : 'Thông tin chi tiết'}
            </Typography>
          </Toolbar>
        </AppBar>
        {this.props.status === 1 ? <div>
          <Paper
          // className={classnames(classes.paper, classes.productBlock)}
          // style={{ display: 'flex', justifyContent: 'space-around', cursor: 'pointer' }}
          >
            <div style={{ width: '20%' }} />
            <div style={{ width: '70%', marginTop: 20 }}>
              <Typography color="primary" style={{ fontWeight: 'bold', textAlign: 'center', marginLeft: '12rem' }} />
              <Typography component="p" />
            </div>
          </Paper>
          <Paper>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Tên hóa đơn
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Số đơn hàng
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.code}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Ngày đặt hàng
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.orderDate}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Loại hóa đơn
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.billType}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Mã khách hàng
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data && data.customer && data.customer.customerId}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Diễn giải
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.explain}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Loại hình thanh toán
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.paidList}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Thời hạn thanh toán
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.paymentTerm}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Địa chỉ giao hàng
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.deliveryAddress}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    HÌnh thức vận chuyển
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.transportationType}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Cao,Dài,Rộng,Khối,Kg
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.height},{data.long},{data.width},{data.block},{data.Kg}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Đơn vị vận chuyển
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.shippingUnit}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Mã Affiliate
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.affiliateCode}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Nguồn
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.source}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Kênh
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.channel}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Chiến dịch
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.campaign}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Tổng tiền hàng
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.totalAmountOfGoods}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Tổng tiền Ck
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.totalDiscount}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Tổng tiền thuế
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.totalTaxAmount}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Tổng thanh toán
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.totalPayment}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Công nợ
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.debt}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Điểm quy đổi
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.redemptionPoints}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Chuyển khoản
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.transfer}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Tk NH
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.bankAccount}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Tên ngân hàng
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.bankName}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Mã POS
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.posCode}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Tiền qua POS
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.posMoney}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Mã QRCOD
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.qrCode}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Tiền qua QRCODE
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.qrCodeMoney}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    số voucher
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.voucherNumber}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Tiền qua Voucher
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.voucherMoney}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Tiền mặt
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.cash}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    COD Y/N
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.codRequirements}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Số thẻ VIP
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {data.vipNumber}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>

        </div> : null}
        {this.props.status === 2 ? <div>
          <Paper
          // className={classnames(classes.paper, classes.productBlock)}
          // style={{ display: 'flex', justifyContent: 'space-around', cursor: 'pointer' }}
          >
            <div style={{ width: '20%' }} />
            <div style={{ width: '70%', marginTop: 20 }}>
              <Typography color="primary" style={{ fontWeight: 'bold', textAlign: 'center', marginLeft: '12rem' }} />
              <Typography component="p" />
            </div>
          </Paper>
          <Paper>
            {data && Array.isArray(data.products) && data.products.map((item, index = 0) => {
              return (
                <>
                  <p style={{ textAlign: 'center', fontWeight: 600 }}>Hàng hóa {index}</p>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Mã hàng hóa
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 'bold' }}>
                          {item._id}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Tên hàng hóa
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 'bold' }}>
                          {item.name}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Đơn vị tính
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 'bold' }}>
                          {item.unit}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell component="th" scope="row">
                          Kho
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 'bold' }}>
                          {item.wareHouse}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Số lượng
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 'bold' }}>
                          {item.amount}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Đơn giá
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 'bold' }}>
                          {item && item.pricePolicy && item.pricePolicy.costPrice}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell component="th" scope="row">
                          Thành tiền
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 'bold' }}>
                          {item && item.pricePolicy && item.pricePolicy.costPrice && Number(item.amount) && Number(item.amount * item.pricePolicy.costPrice) ? Number(item.amount * item.pricePolicy.costPrice) - Number(item.amount * item.pricePolicy.costPrice * item.discount / 100) : ''}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Lắp đặt YN
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 'bold' }}>
                          {item.installationRequirements ? 'Đã yêu cầu lắp đặt' : 'Chưa yêu cầu lắp đặt'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </>)
            })}

          </Paper>

        </div> : null}
      </div>
    );
  }
}

InforBill.propTypes = {};

export default withStyles(styles)(InforBill);
