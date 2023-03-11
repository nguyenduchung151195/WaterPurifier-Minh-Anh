import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

// material-ui components
import { withStyles, List, ListItem } from '@material-ui/core';

import footerStyle from 'assets/jss/material-dashboard-pro-react/components/footerStyle';

function Footer({ ...props }) {
  const { classes, fluid, white } = props;
  let { companyWebsite } = props;
  if (companyWebsite) {
    if (companyWebsite.indexOf('www.') === -1) {
      companyWebsite = `www.${companyWebsite}`;
    }
    if (companyWebsite.indexOf('http://') === -1) {
      companyWebsite = `http://${companyWebsite}`;
    }
  }
  const container = cx({
    [classes.container]: !fluid,
    [classes.containerFluid]: fluid,
    [classes.whiteColor]: white,
  });
  const anchor =
    classes.a +
    cx({
      [` ${classes.whiteColor}`]: white,
    });
  const block = cx({
    [classes.block]: true,
    [classes.whiteColor]: white,
  });
  return (
    <footer className={classes.footer}>
      <div className={container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a href="https://lifetek.com.vn/" className={block}>
                Trang chủ
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="https://lifetek.com.vn/about/" className={block}>
                Giới thiệu
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="https://lifetek.com.vn/thong-tin-lien/" className={block}>
                Hỗ trợ
              </a>
            </ListItem>
          </List>
        </div>
        <p className={classes.right}>
          &copy; {1900 + new Date().getYear()}{' '}
          <a target="_blank" href="http://lifetek.com.vn" className={anchor}>
            {'LifeTek '}
          </a>
          Công nghệ cho cuộc sống
        </p>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  fluid: PropTypes.bool,
  white: PropTypes.bool,
  rtlActive: PropTypes.bool,
};

export default withStyles(footerStyle)(Footer);
