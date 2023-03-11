import React from 'react';
import { Fab as Fa, withStyles } from '@material-ui/core';
// import PropTypes from 'prop-types';

const styles = theme => ({
  root: {
    margin: '5px',
    float: 'right',
    color: '#1d1d1f',
  },
});

const Fab = props => <Fa size="small" color="primary" {...props} />;

export default withStyles(styles)(Fab);
