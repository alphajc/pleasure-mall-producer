// 云函数入口文件
const cloud = require('wx-server-sdk');
// const clients = require('restify-clients');

// const client = clients.createJsonClient({
//   url: 'https://api.weixin.qq.com'
// });

// const appid = process.env.APPID;
// const appSecret = process.env.APPSECRET;

cloud.init();

// 云函数入口函数
exports.main = async(event, context) => {
  // const {
  //   userInfo,
  //   code
  // } = event;
  // let path = '/sns/jscode2session?';

  // path += ['appid=' + appid, 'secret=' + appSecret, 'js_code=' + code, 'grant_type=authorization_code'].join('&');
  const wxContext = cloud.getWXContext();
  // const wxContext = await new Promise((resolve, reject) => {
  //   client.get(path, function(err, req, res, obj) {
  //     console.log('Res:', res);
  //     console.log('Obj:', obj);
  //     if (err) {
  //       reject(err);
  //     } else {
  //       resolve(obj);
  //     }
  //   });
  // })
  // .catch(e => console.error(e));

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}