import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';

import { Tab, Tabs } from '@material-ui/core';

import { SwipeableDrawer } from '../../components/LifetekUi';
import AddCustomerReport from '../AddCustomerReport';

const VerticalTabs = withStyles(() => ({
  flexContainer: {
    flexDirection: 'column',
  },
  indicator: {
    display: 'none',
  },
}))(Tabs);

const VerticalTab = withStyles(() => ({
  selected: {
    color: 'white',
    backgroundColor: `#2196F3`,
    borderRadius: '5px',
    boxShadow: '3px 5.5px 7px rgba(0, 0, 0, 0.15)',
  },
  root: {},
}))(Tab);

function CustomerReportPage(props) {
  const { dataRole = [] } = props;
  const [tab, setTab] = useState();
  const [open, setOpen] = useState(false);
  function handleChangeTab(value) {
    setTab(value);
  }
  function handleOpen(index) {
    setTab(index);
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  };
  const customLable = (name) => {
    switch (name) {
      case 'reportMeetingCustomer':
        return 'Báo cáo tiếp xúc khách hàng';
      case 'Báo cáo tiếp xúc khác hàng':
        return 'Báo cáo tiếp xúc khách hàng';
    }
  };
  return (
    <div style={{ width: '360px' }}>
      <VerticalTabs value={tab} wrapped={true}>
        {dataRole &&
          dataRole.map((i, index) => (
            <VerticalTab
              style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
              label={customLable(i.titleFunction)}
              onClick={() => handleOpen(index)}
            />
          ))}
      </VerticalTabs>

      <SwipeableDrawer anchor="right" onClose={handleClose} open={open} width={window.innerWidth - 260}>
        <AddCustomerReport tab={tab} onChangeTab={handleChangeTab} />
      </SwipeableDrawer>
    </div>
  );
}

export default CustomerReportPage;
