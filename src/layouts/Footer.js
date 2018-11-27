import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import { formatMessage } from 'umi/locale';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: 'YeeTong',
          title: '一通无限',
          href: 'https://www.yeetong.cn',
          blankTarget: true,
        }
      ]}
      copyright={
        <Fragment>
          <Icon type="copyright" /> {formatMessage({ id: 'app.copyright' })} {' '} {formatMessage({ id: 'app.name' })}
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
