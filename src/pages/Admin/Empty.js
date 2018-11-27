import React, { PureComponent } from 'react';
import { Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

class Empty extends PureComponent {

  render() {
    
    return (
      <PageHeaderWrapper title="Doing..." content="功能开发...">
        <Card bordered={false}>
          
        </Card>
      </PageHeaderWrapper>
    );
    
  }
}

export default Empty;
