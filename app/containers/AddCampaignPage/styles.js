const styles = theme => ({
  breadcrumbs: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    marginBottom: '20px',
    maxWitdth: 500,
  },
  paper: {
    padding: 20,
    marginBottom: 20,
  },
  paperTitle: {
    fontWeight: 550,
    fontSize: '18px',
    // verticalAlign: 'middle',
    // marginLeft: 10,
  },
  spanTitle: {
    color: '#A4A4A4',
    fontStyle: 'italic',
    fontWeight: 500,
  },
  textField: {
    // width: '95%',
    // margin: '0 10px',
    marginTop: 10,
    marginBottom: 10,
  },
  addField: {
    width: '95%',
    // margin: '0 10px',
    marginTop: 10,
    marginBottom: 10,
  },
  avatar: {
    marginTop: 20,
    width: 200,
    height: 200,
  },
  button: {
    marginLeft: 16,
    // textAlign: 'center',
    marginTop: 10,
  },
  tabRoot: {
    textTransform: 'none',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing.unit * 4,
    '&:hover': {
      color: '#40a9ff',
      opacity: 1,
    },
    '&$tabSelected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#40a9ff',
    },
  },
  tabSelected: {},
  tabsRoot: {
    borderBottom: '1px solid #e8e8e8',
  },
  tabsIndicator: {
    backgroundColor: '#1890ff',
  },
  creatable: {
    width: '95%',
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },

  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  HearderappBarCustomer: {
    zIndex: '99 !important',
    width: '100% !important,',
  },
  BTNCustomer: {
    // marginLeft: '15% !important',
  },
  tableRoll: {
    overflowX: 'scroll !important',
  },
  spanAva: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: '#0795db',
    opacity: '0',
    borderRadius: 5,
    '@media screen and (max-width: 1360px)': {
      width: '190px',
      height: '190px',
    },
    top: -50,
    marginTop: 50,
  },
  textFieldAva: {
    opacity: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: '999',
    margin: '0px',
    top: 0,
  },
  avatar: {
    borderRadius: 5,
    width: '100%',
    height: '100%',
    '@media screen and (max-width: 1360px)': {
      width: '100%',
      height: '100%',
    },
  },
  gridAva: {
    width: 300,
    margin: '0 auto',
    position: 'relative',
  },
  iconCam: {
    fontSize: '50px',
    width : '100%',
    top: '39%',
    position: 'absolute',
  },
  inputAvt: {
    opacity: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: '999',
    margin: 0,
    cursor: 'pointer',
    top: '17%',
    left: '24px',
  },
});

export default styles;
