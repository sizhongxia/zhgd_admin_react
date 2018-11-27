import React, { PureComponent } from 'react';

import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  Input,
  Select,
  Divider,
  InputNumber,
  Modal,
  message,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { Option } = Select;

@connect(({ video, loading }) => ({
  video,
  loading: loading.effects['video/initDevice', 'video/initProjectList'],
  creating: loading.effects['video/saveOrUpdate']
}))
@Form.create()
class VideoForm extends PureComponent {

  state = {
    uuid: '',
    isEyeClient: true,
    currProUuid: ''
  };
  
  componentDidMount() {
    const { dispatch, match } = this.props;

    const deviceUuid = match.params.deviceUuid;
    if(!!deviceUuid) {
      this.setState({
        uuid: deviceUuid
      });
      var that = this;
      new Promise((resolve) => {
        dispatch({
          type: "video/initDevice",
          payload: {
            resolve,
            uuid: deviceUuid
          }
        });
      }).then((res) => {
        if (res.code !== 200) {
          Modal.confirm({
            content: "无效的参数",
            okText: "确认",
            okType: "danger",
            cancelText: "取消",
            onOk() {
              router.push('/deviceMonitor/video')
            },
            onCancel() {
              router.push('/deviceMonitor/video')
            }
          });
        }
        that.setState({
          currProUuid: res.data.prouuid,
          isEyeClient: res.data.iseyeclient == 1
        })
      });
    } else {
      dispatch({
        type: "video/cleanCurrent",
        payload: {}
      });
    }

    // 初始加载信息
    dispatch({
        type: "video/initProjectList",
        payload: {}
    });
    
  };

  findProjectTowercranes = (value) => {
    const { dispatch } = this.props;
    if(!!value) {
      this.setState({
        currProUuid: value
      });
      new Promise((resolve) => {
        dispatch({
          type: 'video/getProjectTowercranes',
          payload: {
            resolve,
            proUuid: value,
          },
        });
      }).then((res) => {
      }).catch(() => {
        dispatch({
          type: 'cleanProjectTowercranes'
        })
      });
    } else {
      dispatch({
        type: 'cleanProjectTowercranes'
      })
    }
  };

  changeShowProjectTowercranes = (value) => {
    const { dispatch } = this.props;
    const { currProUuid } = this.state;
    if("1" === value) {
      var that = this;
      if(currProUuid === "") {
        message.warn("请先选择一个工地");return;
      }
      new Promise((resolve) => {
        dispatch({
          type: 'video/getProjectTowercranes',
          payload: {
            resolve,
            proUuid: currProUuid,
          },
        });
      }).then((res) => {
        that.setState({
          isEyeClient: true
        })
      }).catch(() => {
      });
    } else {
      this.setState({
        isEyeClient: false
      })
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { uuid } = this.state;
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      new Promise((resolve) => {
        dispatch({
          type: "video/saveOrUpdate",
          payload: {
            resolve,
            uuid,
            ...values
          }
        });
      }).then((res) => {
        if (res.code === 200) {
          Modal.confirm({
            content: "保存成功, 是否跳转至设备列表页？",
            okText: "确认",
            okType: "danger",
            cancelText: "取消",
            onOk() {
              router.push('/deviceMonitor/video')
            },
            onCancel() {
              if(!!uuid) {
                dispatch({
                  type: "video/initDevice",
                  payload: {
                    uuid: uuid
                  }
                });
              } else {
                form.resetFields();
              }
            }
          });
        } else {
          message.error(res.message)
        }
      });
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      video: { projects, towercranes, current },
      loading, creating
    } = this.props;
    const { uuid, isEyeClient } = this.state;

    return (
      <PageHeaderWrapper>
        <Card title={`${uuid === '' ? '新增' : '修改'}设备`} bordered={false} loading={loading}>
          <Form onSubmit={this.handleSubmit} layout="vertical" hideRequiredMark={false}>
            <Divider orientation="left"><Icon type="info-circle" /> 基本信息</Divider>
            <Row gutter={24}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="设备名称">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入设备名称' }],
                    initialValue: current.name
                  })(<Input placeholder="请输入设备名称" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="所属工地">
                  {getFieldDecorator('prouuid', {
                    rules: [{ required: true, message: '请选择所属工地' }],
                    initialValue: current.prouuid
                  })(
                    <Select style={{ width: '100%' }} showSearch placeholder="请选择所属工地" onChange={this.findProjectTowercranes}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      { projects.map(item => <Option key={item.key} value={item.key}>{item.name}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="设备品牌">
                  {getFieldDecorator('brandname', {
                    initialValue: current.brandname
                  })(<Input placeholder="请输入设备品牌" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="设备编码">
                  {getFieldDecorator('equipmentno', {
                    initialValue: current.equipmentno
                  })(<Input placeholder="请输入设备编码" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="安装时间">
                  {getFieldDecorator('deploytime', {
                    rules: [{ required: true, message: '请选择安装时间' }],
                    initialValue: current.deploytime && moment(current.deploytime, "YYYY-MM-DD")
                  })(<DatePicker style={{ width: '100%' }} placeholder="请选择安装时间" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="位置经度">
                  {getFieldDecorator('lng', {
                    initialValue: current.lng
                  })(<InputNumber style={{ width: '100%' }} placeholder="请输入位置经度" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="位置纬度">
                  {getFieldDecorator('lat', {
                    initialValue: current.lat
                  })(<InputNumber style={{ width: '100%' }} placeholder="请输入位置纬度" />)}
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left"><Icon type="deployment-unit" /> 监控配置</Divider>
            <Row gutter={24}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="设备类型">
                  {getFieldDecorator('type', {
                    rules: [{ required: true, message: '请选择设备类型' }],
                    initialValue: current.type
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择设备类型">
                      <Option value="1">球机</Option>
                      <Option value="2">枪机</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="塔吊眼">
                  {getFieldDecorator('iseyeclient', {
                    rules: [{ required: true, message: '请选择是否是塔吊眼' }],
                    initialValue: current.iseyeclient
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择是否是塔吊眼" onChange={this.changeShowProjectTowercranes}>
                      <Option value="1">是</Option>
                      <Option value="2">否</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="选择塔吊">
                  {getFieldDecorator('equipmentuuid', {
                    initialValue: current.equipmentuuid
                  })(
                    <Select disabled={!isEyeClient} style={{ width: '100%' }} showSearch placeholder="请选择塔吊"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                    { towercranes.map(item => <Option key={item.key} value={item.key}>{item.name}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="支持操作">
                  {getFieldDecorator('voperations', {
                    initialValue: current.voperations
                  })(
                    <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择支持操作">
                      <Option value="1">变焦</Option>
                      <Option value="2">旋转</Option>
                      <Option value="3">焦点</Option>
                      <Option value="4">光圈</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="一体机推流">
                  {getFieldDecorator('istowereye', {
                    rules: [{ required: true, message: '请选择是否是一体机推流' }],
                    initialValue: current.istowereye
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择是否是一体机推流">
                      <Option value="1">是</Option>
                      <Option value="2">否</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="连接方式">
                  {getFieldDecorator('pushflowmode', {
                    rules: [{ required: true, message: '请选择连接方式' }],
                    initialValue: current.pushflowmode
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择连接方式">
                      <Option value="0">呼叫</Option>
                      <Option value="1">长期</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="视频IP">
                  {getFieldDecorator('ip', {
                    initialValue: current.ip
                  })(<Input placeholder="请输入IP地址和端口" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="视频端口">
                  {getFieldDecorator('port', {
                    initialValue: current.port
                  })(<Input placeholder="请输入设备端口" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="视频拉流地址">
                  {getFieldDecorator('flowaddress', {
                    initialValue: current.flowaddress
                  })(<Input placeholder="请输入视频拉流地址" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="视频推流地址">
                  {getFieldDecorator('streamurl', {
                    initialValue: current.streamurl
                  })(<Input placeholder="请输入视频推流地址" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="视频播放地址">
                  {getFieldDecorator('playurl', {
                    initialValue: current.playurl
                  })(<Input placeholder="请输入视频播放地址" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="用户名">
                  {getFieldDecorator('username', {
                    initialValue: current.username
                  })(<Input placeholder="请输入用户名" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="密码">
                  {getFieldDecorator('password', {
                    initialValue: current.password
                  })(<Input placeholder="请输入密码" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={24} md={24} sm={24} style={{textAlign:'center'}}>
                <Button type="primary" htmlType="submit" loading={creating}>{`${uuid === '' ? '新增' : '修改'}设备信息`}</Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );

  }
}

export default VideoForm;
