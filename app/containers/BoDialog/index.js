/* eslint-disable react/button-has-type */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/**
 *
 * BoDialog
 *
 */

import React, { Suspense } from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  withStyles,
  Slide,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tab,
  Tabs,
  Fab,
  Menu,
  MenuItem,
  TableRow,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Avatar,
} from '@material-ui/core';
import Progressbar from 'react-progressbar';
// import SwipeableViews from 'react-swipeable-views';
import { Close, Add } from '@material-ui/icons';
import dot from 'dot-object';
// import { Link } from 'react-router-dom';
import ListPage from 'components/List';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import AddExpensesPage from 'containers/AddExpensesPage/';
import AddSalesQuotation from 'containers/AddSalesQuotation';
import { injectIntl } from 'react-intl';
import { expensesDetail } from 'variable';
import { changeSnackbar } from '../Dashboard/actions';
import KanbanStepper from '../../components/KanbanStepper';
import HOCTable from '../HocTable';
import TDTGeneral from '../../components/TdtGeneral';
import { API_EXPENSES, API_PRICE } from '../../config/urlConfig';
import { viewConfigCheckForm } from 'utils/common';
import { Paper, SwipeableDrawer, Dialog as DialogLt, Grid, TextField } from '../../components/LifetekUi';
import { makeSelectMiniActive } from '../../containers/Dashboard/selectors';
import reducer from './reducer';
import saga from './saga';
import makeSelectAddSalesQuotation from 'containers/AddSalesQuotation/selectors';

// import TDTProduct from '../../components/TdtProduct';
import makeSelectBoDialog, { makeSelectDashboardPage } from './selectors';
import { makeSelectProfile } from '../Dashboard/selectors';
import {
  getContract,
  getBill,
  getLogAct,
  postLogAct,
  getData,
  mergeData,
  postSales,
  createTrading,
  createReminderAction,
  createMeetingAction,
  createVisitAction,
  getCurencyAct,
} from './actions';
import HistoryLog from '../HistoryLog';
import HistoryAsset from '../../containers/WarehouseModule/AssetPage/EditAssetPage/tabs/HistoryAsset';
import TabContainerComponent from '../../components/TabContainer';
import messages from './messages';
import LoadingIndicator from '../../components/LoadingIndicator';
const ImportItemsPage = React.lazy(() => import('../ImportItemsPage/Loadable'));
const SourcePage = React.lazy(() => import('../SourcePage/Loadable'));
import CustomAppBar from 'components/CustomAppBar';
import { mergeData as MergeData } from '../Dashboard/actions';

import { Loading } from 'components/LifetekUi';
// import { serialize } from '../../utils/common';

const groupCustomer = (
  (JSON.parse(localStorage.getItem('crmSource')) && JSON.parse(localStorage.getItem('crmSource')).find(item => item.code === 'S07')) || { data: [] }
).data;
const contactMethod = (
  (JSON.parse(localStorage.getItem('crmSource')) && JSON.parse(localStorage.getItem('crmSource')).find(item => item.code === 'S06')) || { data: [] }
).data;

/* eslint-disable react/prefer-stateless-function */
const stylePaper = {
  paperFullScreen: { marginLeft: 250 },
  root: {
    width: 500,
  },
  customStepper: {
    color: 'var(--kanban-color) !important',
  },
  zindex: {
    zIndex: 999,
  },
};
function formatNumber(num) {
  if (num) return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  return '';
}
const CustomTotal = props => {
  const item = dot.object(props.item);
  return <div>{formatNumber(item.total)}</div>;
};

const CustomRemaining = props => {
  const item = dot.object(props.item);
  return <div>{formatNumber(item.remaining)}</div>;
};
const CustomCatalog = () => <div />;
const Catalogcontract = props => <div>{props.item.catalogContract === '0' ? 'Hợp đồng nguyên tắc' : 'Hợp đồng thời vụ'}</div>;
const CustomKanbanStatus = props => {
  const propsFromTable = props.kanbanProps.slice();
  const laneStart = [];
  const laneAdd = [];
  const laneSucces = [];
  const laneFail = [];
  propsFromTable.forEach(item => {
    switch (item.code) {
      case 1:
        laneStart.push(item);
        break;
      case 2:
        laneAdd.push(item);
        break;

      case 3:
        laneSucces.push(item);
        break;

      case 4:
        laneFail.push(item);
        break;

      default:
        break;
    }
  });
  const sortedKanbanStatus = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
  const itemFromTable = Object.assign({}, props.item);
  const kanbanStatusNumber = sortedKanbanStatus.findIndex(n => String(n._id) === String(itemFromTable.kanbanStatus));
  const kanbanValue = ((kanbanStatusNumber + 1) / propsFromTable.length) * 100;
  return (
    <div>
      {sortedKanbanStatus[kanbanStatusNumber] !== undefined ? (
        <Progressbar color={sortedKanbanStatus[kanbanStatusNumber].color} completed={kanbanValue} />
      ) : (
        <span>Không xác định</span>
      )}
    </div>
  );
};
const TypeContract = props => {
  if (props.item.typeContract === '1') {
    return <div>HĐ Khách hàng</div>;
  }
  if (props.item.typeContract === '2') {
    return <div>HĐ Nhà Cung cấp</div>;
  }
  if (props.item.typeContract === '3') {
    return <div>HĐ Nguồn cung</div>;
  }
  return <div />;
};

const ListProduct = props => <>{props.item && Array.isArray(props.item.listProduct) && props.item.listProduct.map(i => i.name).join(', ')}</>;

function Transition(props) {
  return <Slide direction="left" {...props} />;
}
function TabContainer({ children, dir, tabIndex, order }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {/* {children} */}
      <TabContainerComponent tabIndex={tabIndex} order={order}>
        {children}
      </TabContainerComponent>
    </Typography>
  );
}

const TableHeadList = () => (
  <TableHead>
    <TableRow>
      <TableCell align="right">STT</TableCell>
      <TableCell align="right">Tên</TableCell>
      <TableCell align="right">Chi phí</TableCell>
      <TableCell align="right">Số lượng</TableCell>
      <TableCell align="right">Đơn vị</TableCell>
      <TableCell align="right">Tổng số</TableCell>
    </TableRow>
  </TableHead>
);

const GridRight = ({ children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0px', alignItems: 'flex-end' }}>{children}</div>
);

export class BoDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogData: {},
      tabIndex: 0,
      columnsnothers: [],
      deletedColumns: [],
      newOtherColumns: [],
      contractStatusSteps: [],
      contracts: [],
      bills: [],
      load: false,
      idCampaign: null,
      assets: null,
    };
    this.submitBtn = React.createRef();
  }

  componentDidMount() {
    if (this.props.history && this.props.history.location && this.props.history.location.idCampaign) {
      this.setState({ idCampaign: this.props.history.location.idCampaign });
    }
    if (this.props.history) this.props.history.valueTab = undefined;
    this.props.onGetCurrency();
    const localStorageViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = localStorageViewConfig[localStorageViewConfig.findIndex(d => d.path === this.props.path)];
    this.setState({ moduleCode: currentViewConfig.code });
    const { columns, others } = currentViewConfig.listDisplay && currentViewConfig.listDisplay.type.fields.type;
    const BOGeneralData = {};
    columns.forEach(element => {
      const isObject = element.name.includes('.');
      if (isObject) {
        const mainObjectName = element.name.substring(0, element.name.indexOf('.'));
        const subObjectName = element.name.split('.').pop();
        if (!BOGeneralData[mainObjectName]) {
          BOGeneralData[mainObjectName] = {};
        }

        BOGeneralData[mainObjectName][subObjectName] = null;
      } else if (element.name === 'responsibilityPerson' || element.name === 'presenter') {
        BOGeneralData[element.name] = [];
      } else {
        BOGeneralData[element.name] = null;
      }
    });
    others.forEach(element => {
      const isObject = element.name.includes('.');
      if (isObject) {
        const mainObjectName = element.name.substring(0, element.name.indexOf('.'));
        const subObjectName = element.name.split('.').pop();
        if (!BOGeneralData[mainObjectName]) {
          BOGeneralData[mainObjectName] = {};
        }
        BOGeneralData[mainObjectName][subObjectName] = null;
      } else {
        BOGeneralData[element.name] = null;
      }
    });
    BOGeneralData.kanbanStatus = 0;
    const listCrmStatus = JSON.parse(localStorage.getItem('crmStatus'));
    const currentCrmStatus = listCrmStatus[listCrmStatus.findIndex(d => d.code === 'ST05')];
    const laneStart = [];
    const laneAdd = [];
    const laneSucces = [];
    const laneFail = [];
    currentCrmStatus.data.forEach(item => {
      switch (item.code) {
        case 1:
          laneStart.push(item);
          break;
        case 2:
          laneAdd.push(item);
          break;
        case 3:
          laneSucces.push(item);
          break;
        case 4:
          laneFail.push(item);
          break;
        default:
          break;
      }
    });
    const sortedKanbanStatus = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
    this.setState({ contractStatusSteps: sortedKanbanStatus, columnsnothers: [...columns, ...others], dialogData: BOGeneralData });

    if (this.props.isEditting && this.props.open === true) {
      const editData = dot.object(Object.assign({}, this.props.editData));
      this.setState({
        contractStatusSteps: sortedKanbanStatus,
        columnsnothers: [...columns, ...others],
        dialogData: { ...BOGeneralData, ...editData, stepIndex: editData.kanbanStatus },
      });
    } else {
      this.setState({
        contractStatusSteps: sortedKanbanStatus,
        columnsnothers: [...columns, ...others],
        dialogData: BOGeneralData,
      });
    }
    if (this.props.isTrading && this.props.isEditting) {
      const currentTrading = JSON.parse(localStorage.getItem('edittingTrading'));
      let param = {};
      if (currentTrading && currentTrading.routingBackFromTabDialog) {
        param = {
          'exchangingAgreement.exchangingAgreementId': currentTrading._id,
        };
      } else {
        param = {
          'exchangingAgreement.exchangingAgreementId': this.props.editData._id,
        };
      }

      this.props.onGetContracts(param);
      this.props.onGetBills(param);
    }
    const { editData } = this.props;
    const objectId = editData._id ? editData._id : null;
    this.props.getData(objectId, this.props.isTrading, this.props.isEditting);
    if (this.props.isEditting) {
      this.props.onGetLogs({ objectId });
    }
  }
  componentWillUnmount() {
    setTimeout(() => {
      this.props.onMergeData({ hiddenHeader: false });
    }, 1);
  }
  componentWillReceiveProps(props) {
    const { boDialog } = props;
    if (boDialog.contracts !== undefined) {
      this.setState({ contracts: boDialog.contracts.data });
    }
    if (boDialog.bills !== undefined) {
      this.setState({ bills: boDialog.bills.data });
    }
  }

  callBack = (cmd, data) => {
    switch (cmd) {
      case 'change-input': {
        this.setState({ dialogData: data });
        break;
      }
      case 'change-async': {
        this.setState({ dialogData: data, assets: data.assets });
        break;
      }
      case 'push-to-others-viewconfig': {
        const { newOtherColumns, columnsnothers } = this.state;
        columnsnothers.push(data);
        newOtherColumns.push(data);
        this.setState({ columnsnothers, newOtherColumns });
        break;
      }
      case 'delete-an-others-column': {
        const { deletedColumns, columnsnothers } = this.state;
        deletedColumns.push(data);
        columnsnothers.splice(columnsnothers.findIndex(d => d.name === data.name), 1);
        this.setState({ deletedColumns, columnsnothers });
        break;
      }
      case 'cancel-add-field':
        this.setState({ dialogData: data });
        break;
      case 'add-contract': {
        localStorage.setItem(
          'edittingTrading',
          JSON.stringify({ _id: this.state.dialogData._id, name: this.state.dialogData.name, routingBackFromTabDialog: false }),
        );
        this.props.history.push('/crm/Contract/add/1');
        break;
      }
      case 'edit-contract': {
        localStorage.setItem(
          'edittingTrading',
          JSON.stringify({ _id: this.state.dialogData._id, routingBackFromTabDialog: false, name: this.state.dialogData.name }),
        );
        this.props.history.push(`/crm/Contract/edit/${data._id}`);
        break;
      }
      case 'add-bill': {
        localStorage.setItem(
          'edittingTrading',
          JSON.stringify({ _id: this.state.dialogData._id, name: this.state.dialogData.name, routingBackFromTabDialog: false }),
        );
        this.props.history.push('/crm/Bill/add');
        break;
      }
      case 'edit-bill': {
        localStorage.setItem(
          'edittingTrading',
          JSON.stringify({ _id: this.state.dialogData._id, routingBackFromTabDialog: false, name: this.state.dialogData.name }),
        );
        this.props.history.push(`/crm/Bill/edit/${data._id}`);
        break;
      }
      default:
        break;
    }
  };

  checkItem(item) {
    if (item.businessOpportunities === null) delete item.businessOpportunities;
    return item;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.miniActive !== this.props.miniActive) {
      return true;
    }
  }

  render() {
    const { isEditting, classes, open, kanbanSteppers, boDialog, intl, miniActive } = this.props;
    const { tabIndex, dialogData, columnsnothers, contracts, bills } = this.state;

    // const onSave = () => {
    //   this.setState({ load: true });
    //   const { dialogData } = this.state;
    //   let messages = {};
    //   if (this.state.moduleCode) {
    //     messages = viewConfigCheckForm(this.state.moduleCode, dialogData);
    //     delete messages.crmStatus;
    //     delete messages.state;
    //     delete messages['contactCenter.name'];
    //   }
    //   if (Object.keys(messages).length === 0) {
    //     if (this.state.newOtherColumns.length !== 0 || this.state.deletedColumns.length !== 0) {
    //       this.props.callBack('update-viewconfig', { newColumns: this.state.newOtherColumns, deletedColumns: this.state.deletedColumns });
    //       this.setState({ newOtherColumns: [], deletedColumns: [] });
    //     }
    //     if (dialogData.kanbanStatus === 0) {
    //       dialogData.kanbanStatus = kanbanSteppers[0]._id;
    //     }
    //     console.log('hihi10000', dialogData);
    //     isEditting ? this.props.callBack('update-bo', dialogData) : this.props.callBack('create-bo', dialogData);
    //     this.props.history.isEdit = true;
    //   } else {
    //     this.setState({ load: false });
    //     this.props.onChangeSnackbar({ status: true, message: Object.values(messages).join(', '), variant: 'error' });
    //   }
    // }

    const dotBills = bills.map(bill => dot.dot(bill));
    const {
      openDrawerExpenses,
      openDrawerCost,
      id,
      anchorEl,
      openDialogExpenses,
      openDrawerExpensesTable,
      reload,
      services,
      sales,
      profile,
      typeCost,
    } = boDialog;
    // console.log(sales, 'AAA', boDialog.expenses);
    // eslint-disable-next-line consistent-return
    const showButtonEx = () => {
      if (isEditting && this.props.path === '/crm/BusinessOpportunities') {
        if (this.state.dialogData) {
          if (this.state.dialogData.exchangingAgreement) {
            return (
              <Button
                variant="outlined"
                color="inherit"
                className="mx-2"
                // component={
                //   <Link to={`/crm/trading/${this.state.dialogData._id}`}></Link>
                // }
                onClick={() => {
                  this.props.history.push(`/crm/ExchangingAgreement/${this.state.dialogData.exchangingAgreement}`);
                }}
              >
                {'Trao đổi thỏa thuận'}
                {/* {intl.formatMessage(messages.taotraodoithoathuan)} */}
              </Button>
            );
          }
          return (
            <Button
              variant="outlined"
              color="inherit"
              className="mx-2"
              onClick={() => {
                const r = confirm('Bạn có muốn tạo trao đổi thỏa thuận từ cơ hội kinh doanh này ?');
                if (r) {
                  this.props.onCreateTrading(dot.object(this.props.editData));
                }
              }}
            >
              {' '}
              {intl.formatMessage(messages.taotraodoithoathuan)}
            </Button>
          );
        }
      }
      return null;
    };
    return (
      <div>
        <Dialog
          fullScreen
          maxWidth="md"
          fullWidth
          style={this.props.miniActive ? { marginLeft: 70 } : { marginLeft: 260 }}
          open={open}
          aria-labelledby="form-dialog-title"
          TransitionComponent={Transition}
        >
          <CustomAppBar
            className
            isTask
            title={
              this.props.path === '/crm/BusinessOpportunities'
                ? isEditting
                  ? `cập nhật cơ hội kinh doanh`
                  : `Thêm mới cơ hội kinh doanh`
                : isEditting
                  ? `cập nhật trao đổi thỏa thuận`
                  : `Thêm mới trao đổi thỏa thuận`
            }
            // frontBtn={showButtonEx()}
            onGoBack={() => {
              this.props.handleClose();
            }}
            onSubmit={() => {
              this.setState({ load: true });
              let { dialogData } = this.state;
              let messages = {};
              if (this.state.moduleCode) {
                messages = viewConfigCheckForm(this.state.moduleCode, dialogData);
                delete messages.crmStatus;
                delete messages.state;
                delete messages['contactCenter.name'];
              }
              if (Object.keys(messages).length === 0) {
                if (this.state.newOtherColumns.length !== 0 || this.state.deletedColumns.length !== 0) {
                  this.props.callBack('update-viewconfig', { newColumns: this.state.newOtherColumns, deletedColumns: this.state.deletedColumns });
                  this.setState({ newOtherColumns: [], deletedColumns: [] });
                }
                if (dialogData.kanbanStatus === 0) {
                  dialogData.kanbanStatus = kanbanSteppers[0]._id;
                }
                let campaign = dialogData['campaign._id'] ? dialogData['campaign._id'] : dialogData && dialogData.campaign && dialogData.campaign._id;
                let presenter = dialogData['presenter._id'] || (dialogData && dialogData.presenter && dialogData.presenter._id) || null;
                console.log('dialogData', dialogData);
                console.log('presenter', presenter);

                delete dialogData['campaign.code'];
                delete dialogData['campaign.name'];
                delete dialogData['campaign._id'];
                delete dialogData['presenter.name'];
                delete dialogData['presenter._id'];
                delete dialogData['assets'];
                console.log('this.state.assets', this.state.assets);
                let assets = [];
                Array.isArray(this.state.assets) &&
                  this.state.assets.map(item => {
                    assets.push({ assetId: item._id, name: item.name, id: item.assetId });
                  });
                console.log('assets', assets);
                dialogData = {
                  ...dialogData,
                  campaign: this.state.idCampaign ? this.state.idCampaign : campaign,
                  presenter: presenter,
                  assets: assets,
                };
                console.log('dialogData', dialogData);

                isEditting ? this.props.callBack('update-bo', dialogData) : this.props.callBack('create-bo', dialogData);
                this.props.history.isEdit = true;
              } else {
                this.setState({ load: false });
                this.props.onChangeSnackbar({ status: true, message: Object.values(messages).join(', '), variant: 'error' });
              }
            }}
          />

          <DialogContent className={classes.zindex}>
            <div style={{ marginTop: 64 }}>
              <KanbanStepper
                listStatus={kanbanSteppers}
                onKabanClick={value => {
                  dialogData.kanbanStatus = value;
                  this.setState({ dialogData });
                }}
                activeStep={dialogData.kanbanStatus}
              />
            </div>
            <div>
              <Tabs
                value={tabIndex}
                onChange={(event, tabIndex) => {
                  this.setState({ tabIndex });
                }}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab value={0} label={intl.formatMessage(messages.thongtinchung)} />
                <Tab value={2} disabled={!isEditting} label={intl.formatMessage(messages.dutoanchiphi)} />
                <Tab disabled={!isEditting} value={1} label={intl.formatMessage(messages.baogia)} />
                {this.props.isTrading ? <Tab value={3} disabled={!isEditting} label={intl.formatMessage(messages.hopdong)} /> : ''}
                {this.props.isTrading ? <Tab value={4} disabled={!isEditting} label={intl.formatMessage(messages.hoadon)} /> : ''}
                {this.props.isTrading ? <Tab value={5} disabled={!isEditting} label={intl.formatMessage(messages.yeucaumuahangpo)} /> : ''}
                <Tab value={6} disabled={!isEditting} label={intl.formatMessage(messages.nguongoc)} />
                <Tab value={7} disabled={!isEditting} label={intl.formatMessage(messages.lichsu)} />
                <Tab value={8} disabled={!isEditting} label="Lịch sử thiết bị" />
              </Tabs>
              <div style={{ backgroundColor: '#F4F6F8' }}>
                {tabIndex === 0 ? (
                  <TabContainer order={0} tabIndex={tabIndex}>
                    {/* {this.state.load ? <Loading /> : null} */}
                    {dialogData !== {} ? (
                      <TDTGeneral
                        {...this.props}
                        ref={ref => {
                          this.tdtGeneral = ref;
                        }}
                        kanbanSteppers={kanbanSteppers}
                        viewConfig={columnsnothers}
                        callBack={this.callBack}
                        currency={this.props.boDialog.currency}
                        generalData={dialogData}
                        profile={this.props.dashboardPage.profile}
                        enableSelectField
                        onChangeSnackbar={this.props.onChangeSnackbar}
                        mergeData={this.props.mergeData} // cong viec
                        businessOpportunities={this.state.moduleCode === 'BusinessOpportunities' ? this.state.dialogData._id : null} // cong viec
                        exchangingAgreement={this.state.moduleCode === 'ExchangingAgreement' ? this.state.dialogData._id : null}
                        businessOpportunities1={isEditting === true ? this.state.dialogData._id : null}
                        moduleCode={this.state.moduleCode}
                      />
                    ) : (
                      ''
                    )}
                  </TabContainer>
                ) : null}
                {/* Bao gia */}

                {tabIndex === 1 ? (
                  <TabContainer order={1} tabIndex={tabIndex}>
                    <Paper>
                      {this.props.isTrading === false ? (
                        <ListPage
                          // client
                          settingBar={[this.addItemCost()]}
                          // disableEdit
                          disableAdd
                          code="SalesQuotation"
                          apiUrl={API_PRICE}
                          mapFunction={this.mapFunctionCost}
                          filter={{ businessOpportunities: this.state.dialogData._id }}
                          reload={reload}
                          deleteOption="salesQuotations"
                          kanbanKey="_id"
                          kanban="ST02"
                        />
                      ) : dialogData.businessOpportunities ? (
                        <ListPage
                          onEdit={this.handleOpenCostDialog}
                          // client
                          settingBar={[this.addItemCost()]}
                          disableAdd
                          // disableEdit
                          code="SalesQuotation"
                          apiUrl={API_PRICE}
                          mapFunction={this.mapFunctionCostExchanging}
                          filter={{
                            $or: [
                              this.checkItem({ businessOpportunities: dialogData.businessOpportunities.objectId }),
                              { exchangingAgreement: this.state.dialogData._id },
                            ],
                          }}
                          reload={reload}
                          deleteOption="salesQuotations"
                          kanbanKey="_id"
                          kanban="ST02"
                        />
                      ) : (
                        <ListPage
                          // client
                          settingBar={[this.addItemCost()]}
                          disableAdd
                          // disableEdit
                          code="SalesQuotation"
                          apiUrl={API_PRICE}
                          mapFunction={this.mapFunctionCostExchanging}
                          filter={{ exchangingAgreement: this.state.dialogData._id }}
                          reload={reload}
                          deleteOption="salesQuotations"
                          kanbanKey="_id"
                          kanban="ST02"
                        />
                      )}

                      <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={() => this.props.mergeData({ anchorEl: null })}
                      >
                        <MenuItem onClick={() => this.props.mergeData({ openDrawerCost: true, anchorEl: null })}>Sản phẩm</MenuItem>
                        <MenuItem onClick={() => this.props.mergeData({ openDialogExpenses: true, anchorEl: null, typeCost: 1 })}>
                          Dự toán chi phí chi tiết
                        </MenuItem>
                        <MenuItem onClick={() => this.props.mergeData({ openDialogExpenses: true, anchorEl: null, typeCost: 2 })}>
                          Dự toán chi phí tổng hợp
                        </MenuItem>
                      </Menu>
                      <SwipeableDrawer
                        anchor="right"
                        onClose={() => this.props.mergeData({ openDrawerCost: false, id: 'add' })}
                        open={openDrawerCost}
                        width={window.innerWidth - 250}
                      >
                        <div>
                          <AddSalesQuotation
                            id={id}
                            callback={() => this.props.mergeData({ openDrawerCost: false, reload: reload + 1, id: 'add' })}
                            businessOpportunities={dialogData._id}
                            exchangingAgreementId={dialogData._id}
                            customerBoDialog={dialogData.customer}
                            addCustomer={boDialog.addCustomer}
                            isTrading={this.props.isTrading}
                          />
                        </div>
                      </SwipeableDrawer>
                      {/* BÁO GIÁ CHI TIẾT THEO DỰ TOÁN CHI PHÍ */}
                      <DialogLt
                        onSave="save"
                        title="Thêm mới báo giá"
                        open={openDialogExpenses}
                        onClose={() => this.props.mergeData({ openDialogExpenses: false })}
                      >
                        <Paper>
                          {this.props.isTrading === false ? (
                            <ListPage
                              withPagination
                              settingBar={[this.addItemExpenses()]}
                              disableDot
                              disableAdd
                              disableEdit
                              deleteOption="costEstimates"
                              apiUrl={API_EXPENSES}
                              columns={expensesDetail}
                              mapFunction={this.mapFunctionExpensesDetailt}
                              filter={{ businessOpportunities: this.state.dialogData._id }}
                              kanbanKey="_id"
                            />
                          ) : (
                            <ListPage
                              withPagination
                              settingBar={[this.addItemExpenses()]}
                              disableDot
                              disableAdd
                              disableEdit
                              deleteOption="costEstimates"
                              apiUrl={API_EXPENSES}
                              columns={expensesDetail}
                              mapFunction={this.mapFunctionExpensesDetailt}
                              filter={{ exchangingAgreement: this.state.dialogData._id }}
                              kanbanKey="_id"
                            />
                          )}
                        </Paper>
                      </DialogLt>
                      <SwipeableDrawer
                        anchor="right"
                        onClose={() => this.props.mergeData({ openDrawerExpensesTable: false })}
                        open={openDrawerExpensesTable}
                        // onOpen={() => this.props.mergeData({ reload: reload + 1 })}
                        width={window.innerWidth - 260}
                      >
                        <div style={{ width: window.innerWidth - 260 }}>
                          {typeCost === 1 ? (
                            <Grid container spacing={24}>
                              <Grid md={8} item>
                                <Typography color="primary" variant="h5">
                                  BÁO GIÁ THEO DỰ TOÁN CHI PHÍ CHI TIẾT
                                </Typography>
                                <Paper>
                                  <Table>
                                    <React.Fragment>
                                      <TableHeadList />
                                      <TableBody>
                                        <TableRow>
                                          <Typography color="primary">Sản phẩm</Typography>
                                        </TableRow>
                                        {this.productDetail()}
                                        <TableRow>
                                          <Typography color="primary">Nhân công</Typography>
                                        </TableRow>
                                        {this.laborsDetail()}
                                        <TableRow>
                                          <Typography color="primary">Vận chuyển/triển khai</Typography>
                                        </TableRow>
                                        {this.transportsDetail()}
                                        <TableRow>
                                          <Typography color="primary">Khác</Typography>
                                        </TableRow>
                                        {this.otherCostsDetail()}
                                        <TableRow>
                                          <TableCell align="right" />
                                          <TableCell align="right" />
                                          <TableCell align="right" />
                                          <TableCell align="right" />
                                          <TableCell align="right" style={{ fontSize: 16, color: '#163ddb', fontWeight: 'bold' }}>
                                            Tổng
                                          </TableCell>
                                          <TableCell align="right" style={{ fontSize: 16, color: '#163ddb', fontWeight: 'bold' }}>
                                            {this.totalLabors() + this.totalProduct() + this.totalOtherCosts() + this.totalTransports()}
                                          </TableCell>
                                        </TableRow>
                                      </TableBody>
                                    </React.Fragment>
                                  </Table>
                                </Paper>
                              </Grid>
                              <Grid md={4} style={{ padding: '20px', display: 'flex', flexDirection: 'column' }} item>
                                <Paper>
                                  <React.Fragment>
                                    {this.findAvatar()}
                                    <React.Fragment>
                                      <GridRight>
                                        <Typography variant="body1" color="primary">
                                          Tổng số lượng
                                        </Typography>
                                        <Typography variant="subtitle1">{this.totalAmount()}</Typography>
                                      </GridRight>
                                    </React.Fragment>
                                  </React.Fragment>
                                  <GridRight>
                                    <div style={{ width: '100%' }}>
                                      <TextField
                                        value={boDialog.code}
                                        onChange={this.changeCode}
                                        fullWidth
                                        label="code"
                                        name="code"
                                        error={boDialog.errorCode}
                                        helperText={boDialog.errorCode ? 'Mã Báo giá không được bỏ trống' : null}
                                      />
                                    </div>
                                  </GridRight>
                                  <GridRight>
                                    <div style={{ width: '100%' }}>
                                      <TextField
                                        variant="outlined"
                                        value={boDialog.service}
                                        fullWidth
                                        select
                                        label="Dịch vụ"
                                        name="service"
                                        onChange={e => this.handleChange('service', e.target.value)}
                                      >
                                        {services
                                          ? services.map(item => (
                                              <MenuItem key={item.code} value={item.code}>
                                                {item.name}
                                              </MenuItem>
                                            ))
                                          : ''}
                                      </TextField>
                                    </div>
                                  </GridRight>

                                  <GridRight>
                                    <div style={{ width: '100%' }}>
                                      <TextField
                                        value={boDialog.customer ? boDialog.customer.customerLevel : ''}
                                        fullWidth
                                        select
                                        label="Cấp khách hàng"
                                        disabled
                                      >
                                        {sales ? sales.map(item => <MenuItem>{item.custome ? item.customer.customerLevel : null}</MenuItem>) : null}
                                      </TextField>
                                    </div>
                                  </GridRight>
                                  <GridRight>
                                    <div style={{ width: '100%' }}>
                                      <TextField fullWidth value={profile ? profile.name : ''} disabled label="Nhân viên bán hàng" />
                                    </div>
                                  </GridRight>
                                  <GridRight />
                                  <GridRight>
                                    <div style={{ width: '100%' }}>
                                      <TextField
                                        type="number"
                                        value={boDialog.percentageDiscount}
                                        onChange={e => this.handleChange('percentageDiscount', e.target.value)}
                                        fullWidth
                                        label="Giảm giá tất cả các mục"
                                      />
                                    </div>
                                  </GridRight>
                                  <GridRight>
                                    <div style={{ width: '100%' }}>
                                      <TextField
                                        type="number"
                                        onChange={e => this.handleChange('priceDiscount', e.target.value)}
                                        value={boDialog.priceDiscount}
                                        fullWidth
                                        label="Giảm giá đơn hàng"
                                      />
                                    </div>
                                  </GridRight>
                                  <GridRight>
                                    <Typography variant="subtitle1" color="primary">
                                      Tổng đơn hàng
                                    </Typography>
                                    <Typography variant="subtitle1" color="primary">
                                      {this.converttoMoney(this.totalOrder())}$
                                    </Typography>
                                  </GridRight>
                                  <Button variant="outlined" component="span" className={classes.button} color="primary" onClick={this.onSaveSales}>
                                    Hoàn thành
                                  </Button>
                                </Paper>
                              </Grid>
                            </Grid>
                          ) : (
                            // BÁO GIÁ THEO DỰ TOÁN CHI PHÍ TỔNG HỢP
                            <Grid container spacing={24}>
                              <Grid md={8} item>
                                <Typography color="primary" variant="h5">
                                  BÁO GIÁ THEO DỰ TOÁN CHI PHÍ TỔNG HỢP
                                </Typography>
                                <Paper>
                                  <Table>
                                    <TableHead>
                                      <TableRow>
                                        <TableCell align="left">STT</TableCell>
                                        <TableCell align="left">Tên</TableCell>
                                        <TableCell align="left">Chi phí</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell align="left">1</TableCell>
                                        <TableCell align="left">
                                          <Typography color="primary">Sản phẩm</Typography>
                                        </TableCell>
                                        <TableCell align="left">{this.totalProduct()}</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell align="left">2</TableCell>
                                        <TableCell align="left">
                                          <Typography color="primary">Nhân công</Typography>
                                        </TableCell>
                                        <TableCell align="left">{this.totalLabors()}</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell align="left">3</TableCell>
                                        <TableCell align="left">
                                          <Typography color="primary">Vận chuyển/triển khai</Typography>
                                        </TableCell>
                                        <TableCell align="left">{this.totalTransports()}</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell align="left">4</TableCell>
                                        <TableCell align="left">
                                          <Typography color="primary">Khác</Typography>
                                        </TableCell>
                                        <TableCell align="left">{this.totalOtherCosts()}</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell align="left" />
                                        <TableCell align="left" style={{ fontSize: 16, color: '#163ddb', fontWeight: 'bold' }}>
                                          Tổng
                                        </TableCell>
                                        <TableCell align="left" style={{ fontSize: 16, color: '#163ddb', fontWeight: 'bold' }}>
                                          {this.totalLabors() + this.totalProduct() + this.totalOtherCosts() + this.totalTransports()}
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </Paper>
                              </Grid>
                              <Grid md={4} style={{ padding: '20px', display: 'flex', flexDirection: 'column' }} container>
                                <Paper>
                                  <React.Fragment>
                                    {this.findAvatar()}
                                    <React.Fragment>
                                      <GridRight>
                                        <Typography variant="body1" color="primary">
                                          Tổng số lượng
                                        </Typography>
                                        <Typography variant="subtitle1">{this.totalAmount()}</Typography>
                                      </GridRight>
                                    </React.Fragment>
                                  </React.Fragment>
                                  <GridRight>
                                    <div style={{ width: '100%' }}>
                                      <TextField
                                        value={boDialog.code}
                                        onChange={this.changeCode}
                                        fullWidth
                                        label="code"
                                        name="code"
                                        error={boDialog.errorCode}
                                        helperText={boDialog.errorCode ? 'Mã Báo giá không được bỏ trống' : null}
                                      />
                                    </div>
                                  </GridRight>
                                  <GridRight>
                                    <div style={{ width: '100%' }}>
                                      <TextField
                                        variant="outlined"
                                        value={boDialog.service}
                                        fullWidth
                                        select
                                        label="Dịch vụ"
                                        name="service"
                                        onChange={e => this.handleChange('service', e.target.value)}
                                      >
                                        {services
                                          ? services.map(item => (
                                              <MenuItem key={item.code} value={item.code}>
                                                {item.name}
                                              </MenuItem>
                                            ))
                                          : ''}
                                      </TextField>
                                    </div>
                                  </GridRight>

                                  <GridRight>
                                    <div style={{ width: '100%' }}>
                                      <TextField
                                        value={boDialog.customer ? boDialog.customer.customerLevel : ''}
                                        fullWidth
                                        select
                                        label="Cấp khách hàng"
                                        disabled
                                      >
                                        {sales ? sales.map(item => <MenuItem>{item.customer ? item.customer.customerLevel : ''}</MenuItem>) : null}
                                      </TextField>
                                    </div>
                                  </GridRight>
                                  <GridRight>
                                    <div style={{ width: '100%' }}>
                                      <TextField fullWidth value={profile ? profile.name : ''} disabled label="Nhân viên bán hàng" />
                                    </div>
                                  </GridRight>
                                  <GridRight />
                                  <GridRight>
                                    <div style={{ width: '100%' }}>
                                      <TextField
                                        type="number"
                                        value={boDialog.percentageDiscount}
                                        onChange={e => this.handleChange('percentageDiscount', e.target.value)}
                                        fullWidth
                                        label="Giảm giá tất cả các mục"
                                      />
                                    </div>
                                  </GridRight>
                                  <GridRight>
                                    <div style={{ width: '100%' }}>
                                      <TextField
                                        type="number"
                                        onChange={e => this.handleChange('priceDiscount', e.target.value)}
                                        value={boDialog.priceDiscount}
                                        fullWidth
                                        label="Giảm giá đơn hàng"
                                      />
                                    </div>
                                  </GridRight>
                                  <GridRight>
                                    <Typography variant="subtitle1" color="primary">
                                      Tổng đơn hàng
                                    </Typography>
                                    <Typography variant="subtitle1" color="primary">
                                      {this.converttoMoney(this.totalOrder())}$
                                    </Typography>
                                  </GridRight>
                                  <Button variant="outlined" component="span" className={classes.button} color="primary" onClick={this.onSaveSales}>
                                    Hoàn thành
                                  </Button>
                                </Paper>
                              </Grid>
                            </Grid>
                          )}
                        </div>
                      </SwipeableDrawer>
                      {/* BÁO GIÁ Tổng hợp THEO DỰ TOÁN CHI PHÍ */}
                    </Paper>
                  </TabContainer>
                ) : null}
                {/* Dự toán chi phí */}
                {tabIndex === 2 ? (
                  <div>
                    <TabContainer order={2} tabIndex={tabIndex}>
                      <Paper>
                        {this.props.isTrading === false ? (
                          // co hoi kinh doanh
                          <ListPage
                            // client
                            settingBar={[this.addItemExpenses()]}
                            onEdit={this.handleOpenExpensesDialog}
                            disableAdd
                            // disableEdit
                            code="CostEstimate"
                            apiUrl={API_EXPENSES}
                            filter={{ businessOpportunities: this.state.dialogData._id }}
                            reload={reload}
                            deleteOption="costEstimates"
                            mapFunction={this.mapFunctionExpensesBusines}
                            kanbanKey="_id"
                            kanban="ST07"
                          />
                        ) : // trao doi thoa thuan

                        dialogData.businessOpportunities ? (
                          <ListPage
                            // client
                            settingBar={[this.addItemTrading()]}
                            onEdit={this.handleOpenExpensesDialog}
                            disableAdd
                            disableEdit
                            code="CostEstimate"
                            apiUrl={API_EXPENSES}
                            filter={{
                              $or: [
                                this.checkItem({ businessOpportunities: dialogData.businessOpportunities.objectId }),
                                { exchangingAgreement: this.state.dialogData._id },
                              ],
                            }}
                            reload={reload}
                            deleteOption="costEstimates"
                            mapFunction={this.mapFunctionExpensesTrading}
                            kanbanKey="_id"
                          />
                        ) : (
                          <ListPage
                            // client
                            settingBar={[this.addItemTrading()]}
                            onEdit={this.handleOpenExpensesDialog}
                            disableAdd
                            disableEdit
                            code="CostEstimate"
                            apiUrl={API_EXPENSES}
                            filter={{ exchangingAgreement: this.state.dialogData._id }}
                            reload={reload}
                            deleteOption="costEstimates"
                            mapFunction={this.mapFunctionExpensesTrading}
                            kanbanKey="_id"
                          />
                        )}
                      </Paper>
                    </TabContainer>
                  </div>
                ) : null}
                {tabIndex === 3 ? (
                  <TabContainer order={3} tabIndex={tabIndex}>
                    <HOCTable
                      onRef={ref => (this.HOCTable = ref)}
                      handleEditClick={data => {
                        this.callBack('edit-contract', data);
                      }}
                      handleAddClick={() => {
                        this.callBack('add-contract');
                      }}
                      handleDeleteClick={this.handleDeleteClick}
                      customColumns={[
                        {
                          columnName: 'paymentRequest',
                          CustomComponent: CustomCatalog,
                        },
                        {
                          columnName: 'catalogContract',
                          CustomComponent: Catalogcontract,
                        },
                        {
                          columnName: 'deliverimentRequest',
                          CustomComponent: Catalogcontract,
                        },
                        {
                          columnName: 'typeContract',
                          CustomComponent: TypeContract,
                        },
                        {
                          columnName: 'otherRequest',
                          CustomComponent: CustomCatalog,
                        },
                        {
                          columnName: 'kanbanStatus',
                          CustomComponent: CustomKanbanStatus,
                        },
                        {
                          columnName: 'listProduct',
                          CustomComponent: ListProduct,
                        },
                      ]}
                      path="/crm/Contract"
                      collectionCode="Contract"
                      data={contracts}
                      enableEdit
                      kanbanStatuses={this.state.contractStatusSteps}
                      enablePaging={false}
                    />
                  </TabContainer>
                ) : null}
                {tabIndex === 4 ? (
                  <TabContainer order={4} tabIndex={tabIndex}>
                    <HOCTable
                      onRef={ref => (this.HOCTable = ref)}
                      handleEditClick={data => {
                        this.callBack('edit-bill', data);
                      }}
                      handleAddClick={() => {
                        this.props.history.valueTab = 4;
                        this.callBack('add-bill');
                      }}
                      handleDeleteClick={this.handleDeleteClick}
                      customColumns={[
                        {
                          columnName: 'kanbanStatus',
                          CustomComponent: CustomKanbanStatus,
                        },
                        {
                          columnName: 'total',
                          CustomComponent: CustomTotal,
                        },
                        {
                          columnName: 'remaining',
                          CustomComponent: CustomRemaining,
                        },
                      ]}
                      path="/crm/Bill"
                      collectionCode="Bill"
                      data={dotBills}
                      enableEdit
                      crmStatusCode="ST04"
                    />
                  </TabContainer>
                ) : null}
                {tabIndex === 5 ? (
                  <TabContainer order={5} tabIndex={tabIndex}>
                    <Suspense fallback={<LoadingIndicator />}>
                      <ImportItemsPage {...this.props} />
                    </Suspense>
                  </TabContainer>
                ) : null}
                {tabIndex === 6 ? (
                  <TabContainer order={6} tabIndex={tabIndex}>
                    <Suspense fallback={<LoadingIndicator />}>
                      <SourcePage {...this.props} />
                    </Suspense>
                  </TabContainer>
                ) : null}
                {tabIndex === 7 ? (
                  <TabContainer order={7} tabIndex={tabIndex}>
                    <HistoryLog generalData={dialogData} collectionCode="BusinessOpportunities" />
                  </TabContainer>
                ) : null}
                {tabIndex === 8 ? (
                  <TabContainer order={8} tabIndex={tabIndex}>
                    <HistoryAsset id={232} />
                  </TabContainer>
                ) : null}
                {/* </SwipeableViews> */}
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <SwipeableDrawer anchor="right" onClose={() => this.props.mergeData({ openDrawerExpenses: false, id: 'add' })} open={openDrawerExpenses}>
          <div>
            <AddExpensesPage
              callback={this.callbackExpenses}
              id={id}
              businessOpportunitiesId={this.state.dialogData._id}
              exchangingAgreementId={this.state.dialogData._id}
              isTrading={this.props.isTrading}
              customerBoDialog={dialogData.customer}
              addCustomer={boDialog.addCustomer}
            />
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
  // du toan chi phi chi tiet trong bao gia

  mapFunctionExpensesDetailt = item => ({
    ...item,
    add: (
      <Fab color="primary" size="small" onClick={() => this.props.mergeData({ openDrawerExpensesTable: true, expensesId: item._id, code: '' })}>
        <Add />
      </Fab>
    ),
    createdBy: item['createdBy.name'],
    customer: item['customer.name'],
  });

  // bao gia trao doi thoa thuan

  mapFunctionCostExchanging = item => {
    const { dialogData } = this.state;
    return {
      ...item,
      name: (
        <button style={{ color: '#0b99e0', cursor: 'pointer' }} onClick={() => this.props.mergeData({ openDrawerCost: true, id: item._id })}>
          {item.name}
        </button>
      ),
      customer: item.customer ? item.customer.name : '',

      exchangingAgreement: dialogData ? dialogData.name : '',
    };
  };

  // bao gia co hoi kinh doanh

  mapFunctionCost = item => {
    const group = groupCustomer.find(elm => elm.value === item['customer.group']);
    const contactMethods = contactMethod ? contactMethod.find(elm => elm.value === item.originItem.customer.contactWays[0]) : '';
    // const { businessOpportunities } = this.props;
    // const newBuss = businessOpportunities.bos ? businessOpportunities.bos.find(elm => elm._id === item.businessOpportunities) : '';
    const { dialogData } = this.state;
    const templateModule = this.props.addSalesQuotation.templates;
    const templateModules = templateModule.find(elm => elm._id === item['template']);

    return {
      ...item,
      name: (
        <button style={{ color: '#0b99e0', cursor: 'pointer' }} onClick={() => this.props.mergeData({ openDrawerCost: true, id: item._id })}>
          {item.name}
        </button>
      ),
      customer: item.customer ? item.customer.name : '',

      businessOpportunities: dialogData ? dialogData.name : '',
      'customer.group': group ? group.title : '',
      'customer.contactWays': contactMethods ? contactMethods.title : '',
      template: templateModules ? templateModules.title : null,
    };
  };

  customColumnsCost = columns => columns.concat({ name: 'edit', title: 'Sửa', checked: true });

  addItemCost = () => <Add onClick={event => this.props.mergeData({ anchorEl: event.currentTarget })}>Open Menu</Add>;

  // onSave = () => {
  //   this.setState({ load: true });
  //   const { dialogData } = this.state;

  //   // console.log('hihihi9999', dialogData.name, presenter._id);
  //   // const presenterId = this.state.dialogData.presenter;
  //   // console.log('hihihi9999', presenterId);
  //   // dialogData.
  //   // dialogData.presenter = dialogData.presenter._id;
  //   // this.setState({ dialogData: { ...dialogData, presenter: dialogData.presenter.viewableEmployees._id } });
  //   let messages = {};
  //   if (this.state.moduleCode) {
  //     messages = viewConfigCheckForm(this.state.moduleCode, dialogData);
  //     delete messages.crmStatus;
  //     delete messages.state;
  //     delete messages['contactCenter.name'];
  //     // delete messages.code;
  //   }
  //   if (Object.keys(messages).length === 0) {
  //     if (this.state.newOtherColumns.length !== 0 || this.state.deletedColumns.length !== 0) {
  //       this.props.callBack('update-viewconfig', { newColumns: this.state.newOtherColumns, deletedColumns: this.state.deletedColumns });
  //       this.setState({ newOtherColumns: [], deletedColumns: [] });
  //     }
  //     if (dialogData.kanbanStatus === 0) {
  //       dialogData.kanbanStatus = kanbanSteppers[0]._id;
  //     }
  //     console.log('hihi10000', dialogData);
  //     isEditting ? this.props.callBack('update-bo', dialogData) : this.props.callBack('create-bo', dialogData);
  //     this.props.history.isEdit = true;
  //   } else {
  //     this.setState({ load: false });
  //     this.props.onChangeSnackbar({ status: true, message: Object.values(messages).join(', '), variant: 'error' });
  //   }
  // }

  customFunctionCost = item => {
    let newItem = [];
    if (this.state.dialogData._id) newItem = item.filter(ele => ele.businessOpportunities === this.state.dialogData._id);
    return newItem;
  };

  openDialogExpenses = () => {
    const { boDialog } = this.props;
    boDialog.expenses.filter(item => item.length !== 0)
      ? this.props.mergeData({ openDialogExpenses: true, anchorEl: false })
      : this.props.mergeData({ openDrawerExpenses: true, anchorEl: false });
  };

  // du toan chi phi
  callbackExpenses = () => {
    const reload = this.props.boDialog.reload;
    this.props.mergeData({ openDrawerExpenses: false, reload: reload + 1 });
    this.props.getData(this.state.dialogData._id, this.props.isTrading, this.props.isEditting);
  };

  handleOpenExpensesDialog = item => {
    this.props.mergeData({ openDrawerExpenses: true, id: item._id });
  };

  handleOpenCostDialog = item => {
    this.props.mergeData({
      openDrawerCost: true,
      id: item._id,
    });
  };
  // du toan chi phi cua  cơ hội kinh doanh
  mapFunctionExpensesBusines = item => {
    const { dialogData } = this.state;
    return {
      ...item,
      createdBy: item['createdBy.name'],
      customer: item['customer.name'],
      name: (
        // eslint-disable-next-line react/button-has-type
        <button style={{ color: '#0b99e0', cursor: 'pointer' }} onClick={() => this.props.mergeData({ openDrawerExpenses: true, id: item._id })}>
          {item.name}
        </button>
      ),
      businessOpportunities: dialogData ? dialogData.name : '',
    };
  };

  mapFunctionExpensesTrading = item => {
    const { dialogData } = this.state;
    return {
      ...item,
      createdBy: item['createdBy.name'],
      customer: item['customer.name'],
      name: (
        // eslint-disable-next-line react/button-has-type
        <button style={{ color: '#0b99e0', cursor: 'pointer' }} onClick={() => this.props.mergeData({ openDrawerExpenses: true, id: item._id })}>
          {item.name}
        </button>
      ),
      exchangingAgreement: dialogData ? dialogData.name : '',
    };
  };

  customFunctionExpenses = item => {
    const businessOpportunities = this.props.businessOpportunities.bos ? this.props.businessOpportunities.bos : [];
    const exchangingAgreement = this.props.bos ? this.props.bos : [];
    let newItem = [];
    newItem = item.map(it => ({
      ...it,
      createdBy: it['createdBy.name'],
      customer: it['customer.name'],
      name: (
        // eslint-disable-next-line react/button-has-type
        <button style={{ color: '#0b99e0', cursor: 'pointer' }} onClick={() => this.props.mergeData({ openDrawerExpenses: true, id: it._id })}>
          {it.name}
        </button>
      ),
      businessOpportunities: businessOpportunities.find(elm => elm._id === item.businessOpportunities).name,
      exchangingAgreement: exchangingAgreement.find(el => el._id === item.exchangingAgreement).name,
    }));

    return newItem;
  };

  customColumnsExpenses = columns => columns.concat({ name: 'edit', title: 'Sửa', checked: true });

  addItemExpenses = () => <Add onClick={() => this.props.mergeData({ openDrawerExpenses: true, id: 'add' })}>Open Menu</Add>;

  addItemTrading = () => <Add onClick={() => this.props.mergeData({ openDrawerExpenses: true })}>Open Menu</Add>;

  totalProduct = () => {
    const { boDialog } = this.props;
    const { expenses, expensesId } = boDialog;
    const expensesItem = expenses.find(elm => elm._id === expensesId);
    let total = 0;
    expensesItem ? expensesItem.products.map(item => (total += item.costPrice * item.amount * 1)) : 0;
    return total;
  };

  totalLabors = () => {
    const { boDialog } = this.props;
    const { expenses, expensesId } = boDialog;
    const expensesItem = expenses.find(elm => elm._id === expensesId);
    let total = 0;
    expensesItem ? expensesItem.labors.map(item => (total += item.costPrice * 1)) : 0;
    return total;
  };

  totalTransports = () => {
    const { boDialog } = this.props;
    const { expenses, expensesId } = boDialog;
    const expensesItem = expenses.find(elm => elm._id === expensesId);
    let total = 0;
    expensesItem ? expensesItem.transports.map(item => (total += item.cost * 1)) : 0;
    return total;
  };

  totalOtherCosts = () => {
    const { boDialog } = this.props;
    const { expenses, expensesId } = boDialog;
    const expensesItem = expenses.find(elm => elm._id === expensesId);
    let total = 0;
    expensesItem ? expensesItem.otherCosts.map(item => (total += item.cost * item.amount * 1)) : 0;

    return total;
  };

  totalAmount = () => {
    const { boDialog } = this.props;
    const { expenses, expensesId } = boDialog;
    const expensesItem = expenses.find(elm => elm._id === expensesId);
    let total = 0;
    expensesItem ? expensesItem.products.forEach(item => (total += item.amount * 1)) : 0;
    return total;
  };

  findAvatar = () => {
    const { boDialog } = this.props;
    const { expenses, expensesId } = boDialog;
    const expensesItem = expenses.find(elm => elm._id === expensesId);
    return (
      <React.Fragment>
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'center', padding: 5 }}>
            {expensesItem ? (
              <Avatar
                style={{ width: 100, height: 100 }}
                src={
                  expensesItem.createdBy
                    ? expensesItem.createdBy.avatar
                    : 'https://thuthuatnhanh.com/wp-content/uploads/2019/07/hinh-nen-cristiano-ronaldo-585x390.jpg'
                }
              />
            ) : null}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', padding: 5 }}>
            {expensesItem ? (
              <Typography color="secondary" variant="outlined">
                {expensesItem.createdBy ? expensesItem.createdBy.name : 'Người tạo'}
              </Typography>
            ) : null}
          </div>
        </div>
        <GridRight>
          <Typography variant="body1" color="primary">
            Tổng số mặt hàng
          </Typography>
          <Typography variant="subtitle1">{expensesItem ? expensesItem.products.length : 0}</Typography>
        </GridRight>
      </React.Fragment>
    );
  };

  productDetail = () => {
    const { boDialog } = this.props;
    const { expenses, expensesId } = boDialog;
    const expensesItem = expenses.find(elm => elm._id === expensesId);
    return expensesItem
      ? expensesItem.products.map((item, index) => (
          <TableRow>
            <TableCell align="right">{index + 1}</TableCell>
            <TableCell align="right">{item.name}</TableCell>
            <TableCell align="right">{item.costPrice}</TableCell>
            <TableCell align="right">{item.amount ? item.amount : 0}</TableCell>
            <TableCell align="right">{item.unit}</TableCell>
            <TableCell align="right">{item.amount ? item.costPrice * item.amount : 0}</TableCell>
          </TableRow>
        ))
      : null;
  };

  laborsDetail = () => {
    const { boDialog } = this.props;
    const { expenses, expensesId } = boDialog;
    const expensesItem = expenses.find(elm => elm._id === expensesId);
    return expensesItem
      ? expensesItem.labors.map((item, index) => (
          <TableRow>
            <TableCell align="right">{index + 1}</TableCell>
            <TableCell align="right">{item.name}</TableCell>
            <TableCell align="right">{item.costPrice}</TableCell>
            <TableCell align="right" />
            <TableCell align="right" />
            <TableCell align="right">{item.costPrice * 1}</TableCell>
          </TableRow>
        ))
      : null;
  };

  transportsDetail = () => {
    const { boDialog } = this.props;
    const { expenses, expensesId } = boDialog;
    const expensesItem = expenses.find(elm => elm._id === expensesId);
    return expensesItem
      ? expensesItem.transports.map((item, index) => (
          <TableRow>
            <TableCell align="right">{index + 1}</TableCell>
            <TableCell align="right">{item.name}</TableCell>
            <TableCell align="right">{item.cost}</TableCell>
            <TableCell align="right" />
            <TableCell align="right" />
            <TableCell align="right">{item.cost}</TableCell>
          </TableRow>
        ))
      : null;
  };

  otherCostsDetail = () => {
    const { boDialog } = this.props;
    const { expenses, expensesId } = boDialog;
    const expensesItem = expenses.find(elm => elm._id === expensesId);
    return expensesItem
      ? expensesItem.otherCosts.map((item, index) => (
          <TableRow>
            <TableCell align="right">{index + 1}</TableCell>
            <TableCell align="right">{item.name}</TableCell>
            <TableCell align="right">{item.cost}</TableCell>
            <TableCell align="right">{item.amount}</TableCell>
            <TableCell align="right" />
            <TableCell align="right">{item.cost * item.amount * 1}</TableCell>
          </TableRow>
        ))
      : null;
  };

  // Tong don hang
  converttoMoney(number) {
    return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  totalOrder = () => {
    const { boDialog } = this.props;
    let total = 0;
    total += this.totalLabors() + this.totalProduct() + this.totalOtherCosts() + this.totalTransports();
    return total * (1 - boDialog.percentageDiscount / 100) - boDialog.priceDiscount;
  };

  handleChange = (name, value) => {
    this.props.mergeData({ [name]: value });
  };

  handleSave = () => {
    const { dialogData } = this.state;
    let messages = {};
    if (this.state.moduleCode) {
      messages = viewConfigCheckForm(this.state.moduleCode, dialogData);
      delete messages.crmStatus;
      delete messages.state;
      delete messages['contactCenter.name'];
    }
    if (Object.keys(messages).length === 0) {
      if (this.state.newOtherColumns.length !== 0 || this.state.deletedColumns.length !== 0) {
        this.props.callBack('update-viewconfig', { newColumns: this.state.newOtherColumns, deletedColumns: this.state.deletedColumns });
        this.setState({ newOtherColumns: [], deletedColumns: [] });
      }
      if (dialogData.kanbanStatus === 0) {
        dialogData.kanbanStatus = kanbanSteppers[0]._id;
      }
      isEditting ? this.props.callBack('update-bo', dialogData) : this.props.callBack('create-bo', dialogData);
      this.props.history.isEdit = true;
    } else {
      this.props.onChangeSnackbar({ status: true, message: 'Thêm dữ liệu thất bại', variant: 'error' });
    }
  };
  changeCode = e => {
    const rex = /^[a-zA-Z0-9]+[\s\w]{4,}$/;
    const value = e.target.value;
    const errorCode = !rex.test(value);
    this.props.mergeData({ code: value, errorCode });
  };

  onSaveSales = () => {
    if (this.props.boDialog.errorCode) return;
    const { boDialog } = this.props;

    const productsItem = boDialog.expensesId ? boDialog.expenses.find(elm => elm._id === boDialog.expensesId).products : [];
    const stockId = productsItem.map(it => it.productId);
    const stock = boDialog.stocks.data.filter(elm => stockId.includes(elm._id)).map(pro => ({
      code: pro.code,
      description: pro.description,
      unit: pro.unit,
      _id: pro._id,
    }));

    const product = productsItem.map(item => ({
      ...item,
      amount: item.amount,
      code: stock ? stock.find(el => el._id === item.productId).code : '',
      costPrice: item.costPrice,
      description: stock.find(el => el._id === item.productId).description,
      isDisplaySourcePrice: false,
      name: item.name,
      nameUnit: stock.find(el => el._id === item.productId).unit.nameUnit,
      productId: item.productId,
      discount: item.discount,
      sourcePrice: item.sourcePrice,
      total: this.totalProduct(),
      unit: stock ? stock.find(el => el._id === item.productId).unit.unitId : '',
    }));
    // lấy khách hàng từ dự toán chi phi
    const customerItem = boDialog.expenses.find(elm => elm._id === boDialog.expensesId).customer;
    // map lai khách hàng đúng định dang dự toán
    const customerItemId = customerItem._id;
    const newcustomer = {
      customerLevel: boDialog.customers.data ? boDialog.customers.data.find(el => el._id === customerItemId).detailInfo.typeCustomer.branches : '',
      customerId: customerItem._id,
      name: customerItem.name,
      code: customerItem.code,
      representName: boDialog.customers.data ? boDialog.customers.data.find(el => el._id === customerItemId).detailInfo.represent.name : '',
      representPosition: boDialog.customers.data ? boDialog.customers.data.find(el => el._id === customerItemId).detailInfo.represent.position : '',
      representPhoneNumber: boDialog.customers.data
        ? boDialog.customers.data.find(el => el._id === customerItemId).detailInfo.represent.phoneNumber
        : '',
    };

    const data = {
      name: boDialog.code,
      code: boDialog.code,
      exchangingAgreement: this.props.isTrading === true ? this.state.dialogData._id : null,
      businessOpportunities: this.props.isTrading === false ? this.state.dialogData._id : null,
      service: boDialog.service,
      customer: newcustomer,
      salesman: boDialog.profile ? { name: boDialog.profile.name, employeeId: boDialog.profile._id, code: boDialog.profile.code } : null,
      percentageDiscount: boDialog.percentageDiscount,
      priceDiscount: boDialog.priceDiscount,
      costEstimate: boDialog.expensesId,
      products: product || [],
      reload: boDialog.reload,
      _id: boDialog._id,
    };
    this.props.postSales(data);
    this.props.mergeData({ openDialogExpenses: false, openDrawerExpensesTable: false });
  };
}
BoDialog.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  boDialog: makeSelectBoDialog(),
  dashboardPage: makeSelectDashboardPage(),
  addSalesQuotation: makeSelectAddSalesQuotation(),
  miniActive: makeSelectMiniActive(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onMergeData: data => dispatch(MergeData(data)),
    onGetContracts: query => {
      dispatch(getContract(query));
    },
    onGetBills: query => {
      dispatch(getBill(query));
    },
    getData: (id, isTrading, isEditting) => dispatch(getData(id, isTrading, isEditting)),
    mergeData: data => dispatch(mergeData(data)),
    onGetLogs: query => {
      dispatch(getLogAct(query));
    },
    onPostLog: data => {
      dispatch(postLogAct(data));
    },
    postSales: data => dispatch(postSales(data)),
    onCreateTrading: data => dispatch(createTrading(data)),
    onCreateReminder: (reminder, id) => {
      dispatch(createReminderAction(reminder, id));
    },
    onCreateMeeting: (meeting, id) => {
      dispatch(createMeetingAction(meeting, id));
    },
    onCreateVisit: (visit, id) => {
      dispatch(createVisitAction(visit, id));
    },
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    onGetCurrency: () => {
      dispatch(getCurencyAct());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'boDialog', reducer });
const withSaga = injectSaga({ key: 'boDialog', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(stylePaper),
)(BoDialog);
