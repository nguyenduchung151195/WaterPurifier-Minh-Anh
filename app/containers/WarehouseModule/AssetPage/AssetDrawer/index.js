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
/* eslint-disable react/prefer-stateless-function */
class AssetDrawer extends React.Component {
  render() {
    const { classes, Asset = {} } = this.props;
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
      <div style={{ marginTop: 100 }}>
        {/* {console.log(7777, Asset)} */}
        <AppBar>
          <Toolbar>
            <IconButton color="inherit" onClick={this.props.onClose} aria-label="Close">
              <Close />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.flex} style={{ width: '92%' }}>
              Thông tin chung
            </Typography>
          </Toolbar>
        </AppBar>
        <div>
          <Paper
          // className={classnames(classes.paper, classes.productBlock)}
          // style={{ display: 'flex', justifyContent: 'space-around', cursor: 'pointer' }}
          >
            <div style={{ width: '20%' }}>{Asset.logo ? <img height={150} alt="" src={Asset.logo} /> : ''}</div>
            <div style={{ width: '70%', marginTop: 20 }}>
              <Typography color="primary" style={{ fontWeight: 'bold', textAlign: 'center', marginLeft: '12rem' }}>
                {Asset.name || ''}
              </Typography>
              <Typography component="p">{Asset.catalog ? Asset.catalog.name : ''}</Typography>
            </div>
          </Paper>

          <Paper className={classes.paper}>
            <Table className={classes.table}>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Mã khách hàng
                  </TableCell>
                  <TableCell align="right">{Asset.customer && Asset.customer.code ? Asset.customer.code : ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Id thiết bị
                  </TableCell>
                  <TableCell align="right">{Asset.assetId || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Mã sản phẩm
                  </TableCell>
                  <TableCell align="right">{Asset.code || ''}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Ngày mua
                  </TableCell>
                  <TableCell align="right">{Asset.purchaseDate ? moment(Asset.purchaseDate).format('DD/MM/YYYY') : ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Hạn bảo hành
                  </TableCell>
                  <TableCell align="right">{Asset.warrantyPeriodDate ? moment(Asset.warrantyPeriodDate).format('DD/MM/YYYY') : ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Hạn cho mượn
                  </TableCell>
                  <TableCell align="right">{Asset.loanTerm ? moment(Asset.loanTerm).format('DD/MM/YYYY') : ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Ngày lắp đặt
                  </TableCell>
                  <TableCell align="right">{Asset.installationDate ? moment(Asset.installationDate).format('DD/MM/YYYY') : ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Vị trí lắp đặt
                  </TableCell>
                  <TableCell align="right">{Asset.installationLocation || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Ngày kích hoạt
                  </TableCell>
                  <TableCell align="right">{Asset.activateDate ? moment(Asset.activateDate).format('DD/MM/YYYY') : ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Ngày bảo trì lần cuối
                  </TableCell>
                  <TableCell align="right">{Asset.lastMaintenanceDate ? moment(Asset.lastMaintenanceDate).format('DD/MM/YYYY') : ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Ngày bảo trì dự kiến
                  </TableCell>
                  <TableCell align="right">{Asset.expectedMaintenanceDate ? moment(Asset.expectedMaintenanceDate).format('DD/MM/YYYY') : ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Sản lượng trung bình/tháng
                  </TableCell>
                  <TableCell align="right">{Asset.averageOutputMonth || ''}</TableCell>
                </TableRow>
                {/* <TableRow>
                  <TableCell component="th" scope="row">
                    Thứ tự lắp đặt
                  </TableCell>
                  <TableCell align="right">{Asset.orderOfInstallation || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Lịch sử thay lõi đúng hạn
                  </TableCell>
                  <TableCell align="right">{Asset.timelyCoreReplacementHistory ? 'Đúng hạn' : 'Không đúng hạn'}</TableCell>
                </TableRow> */}
              </TableBody>
            </Table>
          </Paper>
          {/* <Paper className={classes.paper}>
            <h4 className={classes.titleTable}>Bộ thuộc tính</h4>
            {product.attributeSet && Array.isArray(product.attributeSet.content ) && product.attributeSet.content.map(item => (
              <Paper style={{ margin: 10 }}>
                <h5 style={{ margin: 10 }}> {item.name}</h5>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell component="th">Tên</TableCell>
                      <TableCell component="th" align="right">
                        Giá trị
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody />
                  <TableBody>
                    {item.propertiesList.map(ele => (
                      <TableRow>
                        <TableCell>{ele.name}</TableCell>
                        <TableCell>{ele.options.map(item => item.name).join(',')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            ))}
          </Paper> */}
          {/* <Paper className={classes.paper}>
            <h4 className={classes.titleTable}>Danh sách các đơn bán hàng tạm dừng</h4>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell component="th">Mã sản phẩm</TableCell>
                  <TableCell component="th" align="right">
                    Số lượng
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody />
            </Table>
          </Paper>
          <Paper className={classes.paper} style={{ marginBottom: 20 }}>
            <h4 className={classes.titleTable}>Danh sách các đơn nhập tạm dừng </h4>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell component="th">Mã sản phẩm</TableCell>
                  <TableCell align="right">Số lượng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody />
            </Table>
          </Paper> */}
        </div>
      </div>
    );
  }
}

AssetDrawer.propTypes = {
  classes: PropTypes.object,
  onClose: PropTypes.func,
};

export default withStyles(styles)(AssetDrawer);
