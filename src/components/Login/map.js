import React from 'react';
import { Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';

export default {
  UserName: {
    props: {
      size: 'large',
      id: 'userName',
      prefix: <Icon type="user" className={styles.prefixIcon} />,
      placeholder: '',
    },
    rules: [
      {
        required: true,
        message: formatMessage({ id: 'app.login.input.message-invalid-required' }),
      },
    ],
  },
  Password: {
    props: {
      size: 'large',
      prefix: <Icon type="lock" className={styles.prefixIcon} />,
      type: 'password',
      id: 'password',
      placeholder: formatMessage({ id: 'app.login.input.password.placeholder' }),
    },
    rules: [
      {
        required: true,
        message: formatMessage({ id: 'app.login.input.message-invalid-required' }),
      },
    ],
  },
  Mobile: {
    props: {
      size: 'large',
      prefix: <Icon type="mobile" className={styles.prefixIcon} />,
      placeholder: '',
    },
    rules: [
      {
        required: true,
        message: formatMessage({ id: 'app.login.input.message-invalid-required' }),
      },
      {
        pattern: /^1\d{10}$/,
        message: formatMessage({ id: 'app.login.input.message-invalid-wrong-mobile' }),
      },
    ],
  },
  Captcha: {
    props: {
      size: 'large',
      prefix: <Icon type="mail" className={styles.prefixIcon} />,
      placeholder: 'captcha',
    },
    rules: [
      {
        required: true,
        message: formatMessage({ id: 'app.login.input.message-invalid-required' }),
      },
    ],
  },
};
