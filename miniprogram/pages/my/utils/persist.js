'use strict';

const app = getApp();

const upsertProfile = (openid, data) => {
  return new Promise((resolve, reject) => {
    let userCol = app.db.collection("producers");
    let userDoc = userCol.doc(openid);

    userDoc.get()
      .then(res =>
        userDoc.update({
          // data 传入需要局部更新的数据
          data: {
            ...data
          }
        })
        .then(resolve)
        .catch(reject)
      )
      .catch(e =>
        userCol.add({
          // data 字段表示需新增的 JSON 数据
          data: {
            _id: openid,
            register_time: new Date(),
            ...data
          }
        })
        .then(resolve)
        .catch(reject)
      );
  });
}

module.exports = {
  upsertProfile
}