import React, { Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';

const copyright = (
  <Fragment>
    <Icon type="copyright" /> {formatMessage({ id: 'app.copyright' })}{' '}
    {formatMessage({ id: 'app.name' })}
  </Fragment>
);

class UserLayout extends React.PureComponent {
  // @TODO title
  // getPageTitle() {
  //   const { routerData, location } = this.props;
  //   const { pathname } = location;
  //   let title = '运维管理系统';
  //   if (routerData[pathname] && routerData[pathname].name) {
  //     title = `${routerData[pathname].name} - 运维管理系统`;
  //   }
  //   return title;
  // }

  render() {
    const { children } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>{formatMessage({ id: 'app.name' })}</span>
              </Link>
            </div>
            <div className={styles.desc}>{formatMessage({ id: 'app.desc.short' })}</div>
          </div>
          {children}
        </div>
        <GlobalFooter copyright={copyright} />
      </div>
    );
  }
}

export default UserLayout;
