import React, { PureComponent } from "react";
import { FormattedMessage, formatMessage } from "umi/locale";
import { Spin, Tag, Menu, Icon, Dropdown, Avatar, Tooltip } from "antd";
import moment from "moment";
import SelectLang from "../SelectLang";
import styles from "./index.less";

export default class GlobalHeaderRight extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { currentUser, onMenuClick, theme } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );

    let className = styles.right;
    if (theme === "dark") {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        {currentUser.loginName ? (
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
                alt="avatar"
              />
              <span className={styles.name}>{currentUser.loginName}</span>
            </span>
          </Dropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}

        <SelectLang className={styles.action} />
      </div>
    );
  }
}
