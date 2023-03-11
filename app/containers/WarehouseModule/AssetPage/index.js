/**
 *
 * AssetPage
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Grid, Paper, Typography, withStyles, Drawer } from '@material-ui/core';
import Buttons from 'components/CustomButtons/Button';
import { DateTimePicker } from 'material-ui-pickers';
import PositionedSnackbar from 'components/PositionedSnackbar';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAssetPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { AsyncAutocomplete, Grid as GridLT, Dialog } from '../../../components/LifetekUi';
import { API_ASSET, API_ORIGANIZATION, API_TAG_STOCK, API_USERS, API_ASSET_TYPE_STOCK } from '../../../config/urlConfig';
import ListPage from '../../../components/List';
import styles from './styles';
import { Breadcrumbs } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import { setTabIndex } from './actions';
import { MODULE_CODE } from '../../../utils/constants';
import dot from 'dot-object';
import AssetDrawer from './AssetDrawer';
import ViewContentCustomer from '../../../components/ViewContentCustomer/Loadable';
import moment from 'moment';
import { changeSnackbar } from '../../../containers/Dashboard/actions';

const tabs = [
  {
    name: 'Tất cả',
    index: -1,
  },
  {
    name: 'Đang sử dụng',
    index: 0,
  },
  {
    name: 'Yêu cầu bảo hành',
    index: 1,
  },
  {
    name: 'Yêu cầu bảo trì',
    index: 2,
  },
  // {
  //   name: 'Hỏng',
  //   index: 3,
  // },
  // {
  //   name: 'Mất',
  //   index: 4,
  // },
  // {
  //   name: 'Thanh lý',
  //   index: 5,
  // },
];

function AssetPage(props) {
  const { classes, assetPage, setTabIndex } = props;

  const { tabIndex } = assetPage;

  // const [tabIndex, setTabIndex] = useState(0);

  const [filter, setFilter] = useState({ level: 0 });

  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(null);

  const [tag, setTag] = useState(null);

  const [employee, setEmployee] = useState(null);

  const [org, setOrg] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [currentAsset, setCurrentAsset] = useState({});
  const [editDialogCustomer, setEditDialogCustomer] = useState(false);
  const [idCustomer, setIdCustomer] = useState(null);
  const CustomName = props => (
    <Typography
      component="div"
      style={{ fontSize: '13px', cursor: 'pointer', color: '#0795db' }}
      onClick={() => props.callBack('custom-click', props.item.originItem, 'name')}
      // onClick={() => props.customClick('name')}
    >
      {props.item.name}
    </Typography>
  );

  useEffect(
    () => {
      console.log('tabIndex', tabIndex);
      if (tabIndex === -1) {
        setFilter(null);
      } else if (tabIndex > 5) {
        setFilter({ level: 0 });
      } else {
        if (tabIndex === 1) {
          if (filter && filter.assetStatus !== undefined) {
            delete filter.assetStatus;
          }
          setFilter({
            ...filter,
            // assetStatus: tabIndex,
            warrantyPeriodDate: {
              $gte: moment().toISOString(),
            },
          });
        } else if (tabIndex === 2) {
          if (filter && filter.warrantyPeriodDate !== undefined) {
            delete filter.warrantyPeriodDate;
          }
          setFilter({
            ...filter,
            assetStatus: tabIndex,
          });
        } else {
          // console.log(6666, filter);
          if (filter && filter.warrantyPeriodDate !== undefined) {
            delete filter.warrantyPeriodDate;
            // delete filter.assetStatus;
          }
          setFilter({
            ...filter,
            assetStatus: tabIndex,
          });
        }
      }
    },
    [tabIndex],
  );
  const openCustomer = id => {
    if (id) {
      setIdCustomer(id);
      setEditDialogCustomer(true);
    } else {
      props.onChangeSnackbar({ status: true, message: 'Không lấy được thông tin khách hàng!', variant: 'error' });
    }
  };
  const handleCloseEditCustomer = () => {
    setEditDialogCustomer(false);
  };
  const mapFunctionProject = item => {
    return {
      ...item,

      ['customer.code']: (
        <button onClick={() => openCustomer(item['customer.customerId'])} type="button" style={{ cursor: 'pointer', color: '#2196f3' }}>
          {item['customer.code']}
        </button>
      ),
      name: <CustomName item={item} callBack={callBack} />,
      unit: item['unit.name'] || '',
      supplierId: item['supplierId.name'] || '',
      type: item['type.name'] || '',
      warrantyPeriodDate: item.warrantyPeriodDate ? item.warrantyPeriodDate : '',
      ['allocation.dateReceive']: item['allocation.dateReceive'] ? item['allocation.dateReceive'] : '',
    };
  };
  const callBack = (cmd, data, msg) => {
    const dataNew = dot.object(data);
    switch (cmd) {
      case 'custom-click':
        switch (msg) {
          case 'name':
            // this.setState({ openDetail: true, currentProduct: dataNew });
            setOpenDetail(true);
            setCurrentAsset(dataNew);
            break;
          case 'total':
            this.setState({ openInventory: true, currentProduct: dataNew });
            break;
          case 'inventory':
            this.setState({ openToEdit: true, currentProduct: dataNew });

            break;
        }
        break;

      default:
        break;
    }
  };
  const toggleDrawer = () => {
    setOpenDetail(!openDetail);
  };
  const addNewAssert = () => {
    props.history.push('/Stock/Asset/add');
  };

  const addLiquidation = () => {
    props.history.push('/Stock/Liquidation/add');
  };

  const editLiquidation = item => {
    if (item._id) {
      // props.history.push(`/Stock/Liquidation/${item._id}`);
      props.history.push({
        pathname: `/Stock/Liquidation/${item._id}`,
        idAsset: `${item._id}`,
      });
    }
  };
  const editAsset = item => {
    if (item.parentId) {
      props.history.push(`/Stock/Asset/${item._id}`);
    } else {
      props.onChangeSnackbar({ status: true, message: 'Không có chi tiết thiết bị!', variant: 'error' });
    }
  };
  const onCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const callSnackbar = () => {
    setOpenSnackbar(true);
  };
  const handleChangeTab = index => {
    setTabIndex(index);
    // if (index === -1) {
    //   setFilter({ level: 0 });
    // } else if (index > 5) {
    //   setFilter({ level: 0 });
    // } else {
    //   setFilter({
    //     ...filter,
    //     assetStatus: index,
    //   });
    // }
  };

  const ButtonUI = props => (
    <Buttons onClick={() => handleChangeTab(props.index)} color={props.index === tabIndex ? 'gradient' : 'simple'}>
      {props.children}
    </Buttons>
  );
  return (
    <div>
      <Dialog title="Xem chi tiết khách hàng" onClose={handleCloseEditCustomer} open={editDialogCustomer}>
        <ViewContentCustomer code="Customer" id={idCustomer} />
      </Dialog>
      {/* <Paper className={classes.breadcrumbs}>
        <Grid container spacing={24}>
          <Grid item xs={12} style={{ margin: 2 }}>
            <Breadcrumbs aria-label="Breadcrumb">
              <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
                Dashboard
              </Link>
              <Typography color="textPrimary">Tài sản </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper> */}
      <Paper style={{ padding: 10, marginTop: '20px' }}>
        <GridLT container spacing={16}>
          <Grid item sm={12}>
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <Grid container spacing={8}>
                  {tabIndex !== 7 &&
                    tabIndex !== 8 && (
                      <Grid item xs={3}>
                        {/* <AsyncAutocomplete
                          style={{ width: '80%' }}
                          name="Chọn loại..."
                          label="Loại"
                          onChange={value => {
                            setTag(value);
                            if (value) {
                              setFilter({
                                ...filter,
                                type: value._id,
                              });
                            } else {
                              let tempFilter = filter;
                              delete tempFilter.type;
                              setFilter(tempFilter);
                            }
                          }}
                          url={API_ASSET_TYPE_STOCK}
                          value={tag}
                        /> */}
                      </Grid>
                    )}

                  {(tabIndex === 7 || tabIndex === 8) && (
                    <React.Fragment>
                      <Grid item xs={2}>
                        <DateTimePicker
                          inputVariant="outlined"
                          format="DD/MM/YYYY HH:mm"
                          value={startDate}
                          variant="outlined"
                          label="Ngày bắt đầu"
                          margin="dense"
                          fullWidth
                          onChange={date => setStartDate(date)}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <DateTimePicker
                          inputVariant="outlined"
                          format="DD/MM/YYYY HH:mm"
                          value={endDate}
                          variant="outlined"
                          label="Ngày kết thúc"
                          fullWidth
                          margin="dense"
                          onChange={date => setEndDate(date)}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <AsyncAutocomplete
                          name="Chọn phòng ban..."
                          label="Phòng/ban"
                          onChange={value => setOrg(value)}
                          url={API_ORIGANIZATION}
                          value={org}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <AsyncAutocomplete
                          name="Chọn nhân viên..."
                          label="nhân viên"
                          onChange={value => setEmployee(value)}
                          url={API_USERS}
                          value={employee}
                        />
                      </Grid>
                    </React.Fragment>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={12}>
            <Grid container>
              {tabs.map(tab => (
                <Grid item>
                  <ButtonUI index={tab.index} onClick={() => setTabIndex(tab.index)}>
                    {tab.name}
                  </ButtonUI>
                </Grid>
              ))}
            </Grid>
          </Grid>
          {tabIndex !== 9 ? (
            <Grid item xs={12}>
              <ListPage
                tree
                code={MODULE_CODE.Asset}
                apiUrl={API_ASSET}
                mapFunction={mapFunctionProject}
                filter={filter}
                isAssetList
                addFunction={addNewAssert}
                // exportExcel
                // disableMenuAction
                importExcel={false}
                callLiquidation={true}
                // disableDelete
                disableAdd
                disableImport
                // callStock={true}
                height="600px"
                customerNode
                onEdit={editAsset}
              />
            </Grid>
          ) : (
            <Grid item xs={12}>
              <ListPage
                tree
                customerNode
                isAssetList
                code={MODULE_CODE.Asset}
                apiUrl={API_ASSET}
                mapFunction={mapFunctionProject}
                filter={filter}
                addFunction={addLiquidation}
                onEdit={editLiquidation}
                exportExcel
                callStock={true}
              />
            </Grid>
          )}
        </GridLT>
      </Paper>
      {openSnackbar ? <PositionedSnackbar onClose={onCloseSnackbar} /> : null}
      <Drawer anchor="right" open={openDetail} onClose={toggleDrawer}>
        <div tabIndex={0} role="button" className={classes.detailAsset}>
          <AssetDrawer Asset={currentAsset} onClose={toggleDrawer} />
          {/* hihi */}
        </div>
      </Drawer>
    </div>
  );
}

AssetPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  assetPage: makeSelectAssetPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    setTabIndex: tabIndex => dispatch(setTabIndex(tabIndex)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'assetPage', reducer });
const withSaga = injectSaga({ key: 'assetPage', saga });

export default compose(
  withReducer,
  withSaga,
  withStyles(styles),
  withConnect,
)(AssetPage);
