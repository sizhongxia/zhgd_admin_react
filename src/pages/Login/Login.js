import React, { Component } from "react";
import { connect } from "dva";
import { formatMessage, FormattedMessage } from "umi/locale";
import { Alert } from "antd";
import Login from "@/components/Login";
import styles from "./Login.less";

const { Tab, UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects["login/login"]
}))
class LoginPage extends Component {
  state = {
    type: "1",
    autoLogin: true
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: "login/login",
        payload: {
          ...values,
          type
        }
      });
    }
  };

  renderMessage = content => (
    <Alert
      style={{ marginBottom: 24 }}
      message={content}
      type="error"
      showIcon
    />
  );

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab
            key="1"
            tab={formatMessage({ id: "app.login.tab-login-credentials" })}
          >
            {login.status === "error" &&
              !submitting &&
              this.renderMessage(
                formatMessage({ id: "app.login.message-invalid-credentials" })
              )}
            <UserName
              name="loginName"
              placeholder={formatMessage({
                id: "app.login.input.username.placeholder"
              })}
            />
            <Password
              name="loginPwd"
              placeholder={formatMessage({
                id: "app.login.input.password.placeholder"
              })}
              onPressEnter={() =>
                this.loginForm.validateFields(this.handleSubmit)
              }
            />
          </Tab>

          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
