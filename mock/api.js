import { parse } from "url";

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 登录接口模拟返回数据
  "POST /api/login/account": (req, res) => {
    const { password, userName, type } = req.body;
    if (password === "123456" && userName === "admin") {
      res.send({
        status: "ok",
        type,
        currentAuthority: "admin"
      });
      return;
    }
    if (password === "123456" && userName === "user") {
      res.send({
        status: "ok",
        type,
        currentAuthority: "user"
      });
      return;
    }
    res.send({
      status: "error",
      type,
      currentAuthority: "guest"
    });
  },

  // 获取区域信息
  "GET /api/areas": [
    {
      value: "zhejiang",
      label: "浙江",
      children: [
        {
          value: "hangzhou",
          label: "杭州",
          children: [
            {
              value: "xihu",
              label: "西湖"
            }
          ]
        }
      ]
    },
    {
      value: "jiangsu",
      label: "江苏",
      children: [
        {
          value: "nanjing",
          label: "南京",
          children: [
            {
              value: "zhonghuamen",
              label: "中华门"
            }
          ]
        }
      ]
    }
  ],

  // 获取当前用户
  "GET /api/currentUser": {
    userid: "00000001",
    name: "管理员",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
    phone: "0752-268888888",
    email: "antdesign@alipay.com"
  },

  "GET /api/constructionAccount/list": (req, res, url) => {
    if (!url || Object.prototype.toString.call(url) !== "[object String]") {
      url = req.url; // eslint-disable-line
    }

    const params = parse(url, true).query;

    let dataSource = [];

    let pageSize = 10;
    let currentPage = parseInt(params.currentPage, 10) || 1;
    if (params.pageSize) {
      pageSize = params.pageSize * 1;
    }

    for (let i = 0; i < pageSize; i += 1) {
      dataSource.push({
        key: i + pageSize * currentPage,
        idNo: i + pageSize * currentPage,
        shortName: `工地 ${i + pageSize * currentPage}`,
        fullName: `工地 ${i + pageSize * currentPage}`,
        inAddress: "北京朝阳四惠",
        area: ["jiangsu", "nanjing", "zhonghuamen"],
        createdAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`)
      });
    }

    const result = {
      list: dataSource,
      pagination: {
        total: 120,
        pageSize,
        current: currentPage
      }
    };

    return res.json(result);
  },

  "GET /api/towerCrane/list": (req, res, url) => {
    if (!url || Object.prototype.toString.call(url) !== "[object String]") {
      url = req.url; // eslint-disable-line
    }

    const params = parse(url, true).query;

    let dataSource = [];

    let pageSize = 10;
    let currentPage = parseInt(params.currentPage, 10) || 1;
    if (params.pageSize) {
      pageSize = params.pageSize * 1;
    }

    for (let i = 0; i < pageSize; i += 1) {
      dataSource.push({
        key: i + pageSize * currentPage,
        idNo: i + pageSize * currentPage,
        owner: "司仲夏",
        logo:
          "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
        title: `工地 ${i + pageSize * currentPage}`,
        href: `工地 ${i + pageSize * currentPage}`,
        subDescription: "北京朝阳四惠",
        area: ["jiangsu", "nanjing", "zhonghuamen"],
        percent: 10,
        status: "normal", //"normal","exception","active","success"
        createdAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`)
      });
    }

    const result = {
      list: dataSource,
      pagination: {
        total: 120,
        pageSize,
        current: currentPage
      }
    };

    return res.json(result);
  },

  // 异常接口
  "GET /api/500": (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: "error",
      message: "error",
      path: "/base/category/list"
    });
  },

  "GET /api/404": (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: "Not Found",
      message: "No message available",
      path: "/base/category/list/2121212"
    });
  },

  "GET /api/403": (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: "Unauthorized",
      message: "Unauthorized",
      path: "/base/category/list"
    });
  },

  "GET /api/401": (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: "Unauthorized",
      message: "Unauthorized",
      path: "/base/category/list"
    });
  }
};
