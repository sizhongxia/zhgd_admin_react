import React, { Component } from 'react';
import { Row } from 'antd';
import router from "umi/router";

import GridContent from '@/components/PageHeaderWrapper/GridContent';

class Home extends Component {
  componentDidMount() {
    const loginInfo = localStorage.getItem("loginfo");
    let user;
    try {
      user = JSON.parse(loginInfo);
    } catch (e) {
      localStorage.setItem("loginfo", "{}");
      router.push("/user/login");
      return;
    }
    if (!(!!user && !!user.token)) {
      localStorage.setItem("loginfo", "{}");
      router.push("/user/login");
      return;
    }
  };
  render() {
    return (
      <GridContent>
        <Row gutter={24}>
          <span>欢迎使用</span>
        </Row>
      </GridContent>
    );
  }
}

export default Home;
