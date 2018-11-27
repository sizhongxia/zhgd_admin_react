export default [
  // user
  {
    path: "/user",
    component: "../layouts/UserLayout",
    routes: [{ path: "/user/login", component: "./Login/Login" }]
  },
  // admin
  {
    path: "/",
    component: "../layouts/BasicLayout",
    authority: ["admin"],
    routes: [
      { path: "/", redirect: "/home" },
      // home
      {
        path: "/home",
        name: "home",
        icon: "check-circle-o",
        component: "./Admin/Home"
      },
      // 工地账号
      {
        path: "/construction",
        name: "construction",
        icon: "check-circle-o",
        routes: [
          { path: "/construction", redirect: "/construction/data" },
          {
            path: "/construction/data",
            name: "constructionList", //工地数据
            component: "./Admin/Construction"
          },
          {
            path: "/construction/loginaccount",
            name: "loginaccount",
            component: "./Admin/LoginAccount",
          },
          {
            path: "/construction/create",
            name: "constructionCreate", //新增工地
            component: "./Admin/ConstructionForm",
            hideInMenu: true
          },
          {
            path: "/construction/edit/:proUuid",
            name: "constructionEdit", //修改工地
            component: "./Admin/ConstructionForm",
            hideInMenu: true
          }
        ]
      },
      // 设备监控
      {
        path: "/deviceMonitor",
        name: "deviceMonitor",
        icon: "check-circle-o",
        routes: [
          { path: "/deviceMonitor", redirect: "/deviceMonitor/dustNoise" },
          {
            path: "/deviceMonitor/dustNoise",
            name: "dustNoise", //扬尘噪音
            component: "./MonitorDevice/DustNoise"
          },
          {
            path: "/deviceMonitor/dustNoiseCreate",
            component: "./MonitorDevice/DustNoiseForm",
            hideInMenu: true
          },
          {
            path: "/deviceMonitor/dustNoiseEdit/:deviceUuid",
            component: "./MonitorDevice/DustNoiseForm",
            hideInMenu: true
          },
          {
            path: "/deviceMonitor/fogGun",
            name: "fogGun", //雾炮喷淋
            component: "./MonitorDevice/FogGun"
          },
          {
            path: "/deviceMonitor/fogGunCreate",
            component: "./MonitorDevice/FogGunForm",
            hideInMenu: true
          },
          {
            path: "/deviceMonitor/fogGunEdit/:deviceUuid",
            component: "./MonitorDevice/FogGunForm",
            hideInMenu: true
          },
          // {
          //   path: "/deviceMonitor/energy",
          //   name: "energy", //能源
          //   component: "./Admin/Empty",
          // },
          {
            path: "/deviceMonitor/video",
            name: "video", //视频
            component: "./MonitorDevice/Video"
          },
          {
            path: "/deviceMonitor/videoCreate",
            component: "./MonitorDevice/VideoForm",
            hideInMenu: true
          },
          {
            path: "/deviceMonitor/videoEdit/:deviceUuid",
            component: "./MonitorDevice/VideoForm",
            hideInMenu: true
          },
          {
            path: "/deviceMonitor/towercrane",
            name: "towercrane", //塔机
            component: "./MonitorDevice/Towercrane"
          },
          {
            path: "/deviceMonitor/towercraneCreate",
            component: "./MonitorDevice/TowercraneForm",
            hideInMenu: true
          },
          {
            path: "/deviceMonitor/towercraneEdit/:deviceUuid",
            component: "./MonitorDevice/TowercraneForm",
            hideInMenu: true
          },
          {
            path: "/deviceMonitor/elevator",
            name: "elevator", //升降机
            component: "./MonitorDevice/Elevator"
          },
          {
            path: "/deviceMonitor/elevatorCreate",
            component: "./MonitorDevice/ElevatorForm",
            hideInMenu: true
          },
          {
            path: "/deviceMonitor/elevatorEdit/:deviceUuid",
            component: "./MonitorDevice/ElevatorForm",
            hideInMenu: true
          },
          {
            path: "/deviceMonitor/unloadingPlatform",
            name: "unloadingPlatform", //卸料平台
            component: "./MonitorDevice/UnloadingPlatform"
          },
          {
            path: "/deviceMonitor/unloadingPlatformCreate",
            component: "./MonitorDevice/UnloadingPlatformForm",
            hideInMenu: true
          },
          {
            path: "/deviceMonitor/unloadingPlatformEdit/:deviceUuid",
            component: "./MonitorDevice/UnloadingPlatformForm",
            hideInMenu: true
          },
          // {
          //   path: "/deviceMonitor/smoke",
          //   name: "smoke", //烟感
          //   component: "./Admin/Empty",
          // },
          // {
          //   path: "/deviceMonitor/personPosition",
          //   name: "personPosition", //人员定位
          //   component: "./Admin/Empty",
          // },
          // {
          //   path: "/deviceMonitor/infraredRadiation",
          //   name: "infraredRadiation", //红外对射
          //   component: "./Admin/Empty",
          // },
          // {
          //   path: "/deviceMonitor/gasDetection",
          //   name: "gasDetection", //气体检测
          //   component: "./Admin/Empty",
          // },
          // {
          //   path: "/deviceMonitor/iris",
          //   name: "iris", //虹膜一体机
          //   component: "./Admin/Empty",
          // },
          // {
          //   path: "/deviceMonitor/electricity",
          //   name: "electricity", //强电检测
          //   component: "./Admin/Empty",
          // },
          // {
          //   path: "/deviceMonitor/electric",
          //   name: "electric", //电表
          //   component: "./Admin/Empty",
          // }
        ]
      },
      // 企业信息
      {
        path: "/company",
        name: "company",
        icon: "check-circle-o",
        routes: [
          { path: "/company", redirect: "/company/fiveEnter" },
          {
            path: "/company/fiveEnter",
            name: "fiveEnter", //单位
            component: "./Admin/Company"
          },
          {
            path: "/company/department/:companyUuid",
            name: "department", //部门
            component: "./Admin/Department",
            hideInMenu: true
          },
          {
            path: "/company/post/:deptUuid",
            name: "post", //岗位
            component: "./Admin/Post",
            hideInMenu: true
          },
        ]
      },
      // 权限管理
      // {
      //   path: "/jurisdiction",
      //   name: "jurisdiction",
      //   icon: "check-circle-o",
      //   routes: [
      //     { path: "/jurisdiction", redirect: "/jurisdiction/loginaccount" }
      //   ]
      // },
      // 系统管理
      {
        path: "/system",
        name: "system",
        icon: "check-circle-o",
        routes: [
          { path: "/system", redirect: "/system/dictionary" },
          {
            path: "/system/dictionary",
            name: "dictionary",
            component: "./Admin/Dictionary"
          },
          {
            path: "/system/area",
            name: "area",
            component: "./Admin/Area"
          },
          {
            path: "/system/logs",
            name: "logs",
            component: "./Admin/Empty"
          }
        ]
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
        ],
      },
    ]
  }
];
