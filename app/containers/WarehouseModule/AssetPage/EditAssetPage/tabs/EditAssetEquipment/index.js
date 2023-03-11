/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/**
 *
 * EditAssetEquipment
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { TextField } from 'components/LifetekUi';

import { Dialog, DialogTitle, DialogContent, Grid, DialogActions, Button, FormHelperText, MenuItem } from '@material-ui/core';
import ListPage from 'components/List';
import { API_ASSET, API_PERSONNEL } from '../../../../../../config/urlConfig';
import SimpleListPage from '../../../../../../components/List/SimpleListPage';
import { DatePicker } from 'material-ui-pickers';
import request from '../../../../../../utils/request';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

const columns = [
  {
    name: 'name',
    title: 'Tên thiết bị',
  },
  {
    name: 'depreciationType',
    title: 'Loại khấu hao',
  },
  {
    name: 'depreciationValue',
    title: 'Giá trị',
  },
  {
    name: 'usingDate',
    title: 'Ngày bắt đầu sử dụng',
  },
  {
    name: 'depreciationTime',
    title: 'Thời gian khấu hao',
  },
  {
    name: 'note',
    title: 'Mô tả',
  }
]


/* eslint-disable react/prefer-stateless-function */
class EditAssetEquipment extends React.PureComponent {
  state = {
    equipments: [],
    equipment: {},
    openDialog: false,
  };

  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
  }

  componentDidUpdate(preProps) {
    const { asset } = this.props;

    if (asset && !this.state.isSubmit && preProps.asset !== asset) {
      this.state.equipments = asset.assetIds.filter(c => c._id && c._id.status !== 3).map(id => ({ ...id._id }));
    }
  }

  handleAdd = () => {
    this.setState({ openDialog: true });
  };

  handleEdit = (item) => {
    this.setState({ equipment: item, openDialog: true });
  };

  handleClose = () => {
    this.setState({ openDialog: false });
  };

  handleChangeInput = e => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      equipment: {
        ...prevState.equipment,
        [name]: value,
      },
    }));
  };

  handleDateChange = (name, value) => {
    this.setState(prevState => ({
      equipment: {
        ...prevState.equipment,
        [name]: value,
      },
    }));
  }

  handleSave = () => {
    const newEquipment = { ...this.state.equipment, level: 1 };
    this.handleUpdateData(newEquipment);
  }

  handleUpdateData = (data) => {
    try {
      if (!data._id) {
        request(API_ASSET, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }).then(data => {
          this.setState(prevState => ({
            equipments: [
              ...prevState.equipments,
              data,
            ],
            equipment: {},
            openDialog: false,
          }));
        });
      } else {
        request(`${API_ASSET}/${data._id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }).then(() => {
          const index = this.state.equipments.findIndex(e => e._id === data._id);
          if (index > - 1) {
            this.state.equipments[index] = {
              ...data,
              usingDate: data.usingDate && data.usingDate.toString(),
              depreciationTime: data.depreciationTime && data.depreciationTime.toString(),
              warrantyPeriod: data.warrantyPeriod && parseInt(data.warrantyPeriod),
              maintenanceQuota: data.maintenanceQuota && parseInt(data.maintenanceQuota),
              depreciationValue: data.depreciationValue && parseInt(data.depreciationValue),
            };
            this.setState({
              equipments: [...this.state.equipments],
              equipment: {},
              openDialog: false,
            });
          }
        })
      }
    } catch (error) {

    }

  }

  handleDete = (items) => {
    const ids = this.state.equipments.filter((item, index) => items.includes(index)).map(i => i._id);
    const self = this;
    try {
      request(API_ASSET, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 'ids': ids }),
      }).then(respon => {
        // eslint-disable-next-line eqeqeq
        let newEquipments =  [...self.state.equipments];
        console.log('1212121', self.state.equipments);
        for (let i = items.length - 1; i >= 0; i--) {
          const item = items[i];
          newEquipments.splice(item, 1);
        }
        self.setState({ equipments: newEquipments });

      });
    } catch (error) {

    }
  }



  getData = () => {
    this.setState({ isSubmit: true });
    return this.state.equipments.filter(i => i._id).map(c => ({ _id: c._id }));
  };

  handleImport = () => {

  }

  render() {
    const { equipments, equipment } = this.state;
    const { units } = this.props;
    return (
      <Grid container>
        <Grid item xs={12}>
          <SimpleListPage
            onAdd={this.handleAdd}
            onEdit={this.handleEdit}
            showAction
            columns={columns}
            rows={equipments}
            onDelete={this.handleDete}
            onImport={this.handleImport}
          />
        </Grid>
        {/* <FormattedMessage {...messages.header} /> */}
        <Dialog maxWidth="md" open={this.state.openDialog} onClose={this.handleClose}>
          <DialogTitle>
            <h4>Thiết bị tài sản </h4>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={16}>
              <Grid md={6} item>
                <TextField
                  label="Tên thiết bị"
                  name="name"
                  fullWidth
                  value={equipment.name || ''}
                  onChange={this.handleChangeInput} />
                {this.state.errorName && (
                  <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                    Tên có độ dài không quá 200 kí tự và không được để trống
                  </FormHelperText>
                )}
              </Grid>
              <Grid md={6} item>
                <TextField
                  //select
                  label="Loại thiết bị"
                  name="type"
                  fullWidth
                  value={equipment.type || ''}
                  onChange={this.handleChangeInput}
                >
                </TextField>
              </Grid>
              <Grid md={6} item>
                <TextField
                  //select
                  label="Loại khấu hao"
                  name="depreciationType"
                  fullWidth
                  value={equipment.depreciationType || ''}
                  onChange={this.handleChangeInput}
                >
                </TextField>
              </Grid>
              <Grid md={6} item>
                <Grid container spacing={8}>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      label="Giá trị tính khấu hao"
                      value={equipment.depreciationValue || ''}
                      onChange={this.handleChangeInput}
                      name="depreciationValue"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField select fullWidth label="Giá trị" name="depreciationUnit" value={equipment.depreciationUnit || ''} onChange={this.handleChangeInput}>
                      {units &&
                        units.map((item) => (
                          <MenuItem key={item._id} value={item._id}>
                            {item.name}
                          </MenuItem>
                        ))}
                    </TextField>
                    {this.state.errorUnit && (
                      <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                        Phải chọn đơn vị tính
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY"
                  value={equipment.usingDate || null}
                  variant="outlined"
                  label="Ngày bắt đầu sử dụng"
                  margin="dense"
                  fullWidth
                  onChange={(date) => this.handleDateChange('usingDate', date)}
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY"
                  value={equipment.depreciationTime || null}
                  variant="outlined"
                  label="Thời gian khấu hao"
                  margin="dense"
                  fullWidth
                  onChange={(date) => this.handleDateChange('depreciationTime', date)}
                />
              </Grid>
              <Grid md={6} item>
                <Grid container spacing={8}>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      label="Thời gian bảo hành"
                      value={equipment.warrantyPeriod || ''}
                      onChange={this.handleChangeInput}
                      name="warrantyPeriod"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField select fullWidth label="Giá trị" name="warrantyPeriodUnit" value={equipment.warrantyPeriodUnit || ''} onChange={this.handleChangeInput}>
                      {units &&
                        units.map((item) => (
                          <MenuItem key={item._id} value={item._id}>
                            {item.name}
                          </MenuItem>
                        ))}
                    </TextField>
                    {this.state.errorUnit && (
                      <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                        Phải chọn đơn vị tính
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid md={6} item>
                <Grid container spacing={8}>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      label="Định mức bảo trì"
                      value={equipment.maintenanceQuota || ''}
                      onChange={this.handleChangeInput}
                      name="maintenanceQuota"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField select fullWidth label="Giá trị" name="maintenanceQuotaUnit" value={equipment.maintenanceQuotaUnit || ''} onChange={this.handleChangeInput}>
                      {units &&
                        units.map((item) => (
                          <MenuItem key={item._id} value={item._id}>
                            {item.name}
                          </MenuItem>
                        ))}
                    </TextField>
                    {this.state.errorUnit && (
                      <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                        Phải chọn đơn vị tính
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid md={6} item>
                <TextField label="Mô tả" multiline rows={3} fullWidth name="note" value={equipment.note} onChange={this.handleChangeInput} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={this.handleSave} color="primary">
              Lưu
            </Button>
            <Button variant="contained" color="default" onClick={this.handleClose}>
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  }
}

EditAssetEquipment.propTypes = {};

export default EditAssetEquipment;
