const fleaHost = location.host
const fleaApiProtocol = 'http://'

const fleaApiUrl = {
  user: {
    register: fleaApiProtocol + fleaHost + '/api/user/register',
    authorize: fleaApiProtocol + fleaHost + '/api/user/authorize',
    logout: fleaApiProtocol + fleaHost + '/api/user/logout',
    modifyPassword: fleaApiProtocol + fleaHost + '/api/user/modifyPassword',
    modifyNickname: fleaApiProtocol + fleaHost + '/api/user/modifyNickname',
    modifyAvatar: fleaApiProtocol + fleaHost + '/api/user/modifyAvatar',
    addSocial: fleaApiProtocol + fleaHost + '/api/user/addSocial',
    removeSocial: fleaApiProtocol + fleaHost + '/api/user/removeSocial',
    getMyDetail: fleaApiProtocol + fleaHost + '/api/user/getMyDetail',
    getUserDetail: fleaApiProtocol + fleaHost + '/api/user/getUserDetail'
  },
  admin: {
    grantUser: fleaApiProtocol + fleaHost + '/api/admin/grantUser',
    banUser: fleaApiProtocol + fleaHost + '/api/admin/banUser',
    getCensoringProducts: fleaApiProtocol + fleaHost + '/api/admin/getCensoringProducts',
    censorProduct: fleaApiProtocol + fleaHost + '/api/admin/censorProduct',
    publishBulletin: fleaApiProtocol + fleaHost + '/api/admin/publishBulletin'
  },
  picture: {
    upload: fleaApiProtocol + fleaHost + '/api/picture/upload',
    download: fleaApiProtocol + fleaHost + '/api/picture/download'
  },
  chat: {
    startChatSession: fleaApiProtocol + fleaHost + '/api/chat/startChatSession',
    getChatSessions: fleaApiProtocol + fleaHost + '/api/chat/getChatSessions',
    sendMsg: fleaApiProtocol + fleaHost + '/api/chat/sendMsg',
    getMsg: fleaApiProtocol + fleaHost + '/api/chat/getMsg'
  },
  product: {
    getProductList: fleaApiProtocol + fleaHost + '/api/product/getProductList',
    getBoughtProductList: fleaApiProtocol + fleaHost + '/api/product/getBoughtProductList',
    getMyProductList: fleaApiProtocol + fleaHost + '/api/product/getMyProductList',
    getProductDetail: fleaApiProtocol + fleaHost + '/api/product/getProductDetail',
    newProduct: fleaApiProtocol + fleaHost + '/api/product/newProduct',
    deleteProduct: fleaApiProtocol + fleaHost + '/api/product/deleteProduct',
    editProduct: fleaApiProtocol + fleaHost + '/api/product/editProduct',
    editFinish: fleaApiProtocol + fleaHost + '/api/product/editFinish',
    editExpectedPrice: fleaApiProtocol + fleaHost + '/api/product/editExpectedPrice',
    editProductName: fleaApiProtocol + fleaHost + '/api/product/editProductName',
    editProductDetail: fleaApiProtocol + fleaHost + '/api/product/editProductDetail',
    editAddPic: fleaApiProtocol + fleaHost + '/api/product/editAddPic',
    editDeletePic: fleaApiProtocol + fleaHost + '/api/product/editDeletePic',
    orderProduct: fleaApiProtocol + fleaHost + '/api/product/orderProduct',
    cancelOrder: fleaApiProtocol + fleaHost + '/api/product/cancelOrder',
    confirmOrder: fleaApiProtocol + fleaHost + '/api/product/confirmOrder',
    comment: fleaApiProtocol + fleaHost + '/api/product/comment',
    getComments: fleaApiProtocol + fleaHost + '/api/product/getComments'
  }
}

const fleaApiParam = {
  user: {
    register: { username: null, nickname: null, password: null },
    authorize: { username: null, password: null },
    logout: { token: null },
    modifyPassword: { token: null, password: null },
    modifyNickname: { token: null, nickname: null },
    modifyAvatar: { token: null, avatarUrl: null },
    addSocial: { token: null, socialType: null, socialUrl: null },
    removeSocial: { token: null, socialId: null },
    getMyDetail: { token: null },
    getUserDetail: { username: null }
  },
  admin: {
    grantUser: { token: null, username: null },
    banUser: { token: null, username: null, day: null },
    getCensoringProducts: { token: null },
    censorProduct: { token: null, productId: null, pass: null },
    publishBulletin: { token: null, bulletinMsg: null }
  },
  picture: {
    // upload:{ pic: null },
    download: { picUid: null }
  },
  chat: {
    startChatSession: { token: null, username: null },
    getChatSessions: { token: null },
    sendMsg: { token: null, chatSessionId: null, content: null },
    getMsg: { token: null, chatSessionId: null }
  },
  product: {
    getProductList: {},
    getBoughtProductList: { token: null },
    getMyProductList: { token: null },
    getProductDetail: { productId: null },
    newProduct: { token: null },
    deleteProduct: { token: null, productId: null },
    editProduct: { token: null, productId: null },
    editFinish: { token: null, productId: null },
    editExpectedPrice: { token: null, productId: null, price: null },
    editProductName: { token: null, productId: null, productName: null },
    editProductDetail: { token: null, productId: null, productDetail: null },
    editAddPic: { token: null, productId: null, picUrl: null },
    editDeletePic: { token: null, productId: null, picId: null },
    orderProduct: { token: null, productId: null },
    cancelOrder: { token: null, productId: null },
    confirmOrder: { token: null, productId: null },
    comment: { token: null, productId: null, content: null },
    getComments: { productId: null }
  }
}

function fleaApiRequest (url, params) {
  const fetchReq = {
    method: 'POST',
    body: null
  }

  const fd = new FormData()
  for (const property in params) {
    fd.append(property, params[property])
  }

  fetchReq.body = fd
  return fetch(url, fetchReq)
}

async function fleaApiPictureUpload (picFile) {
  const handleUpload = function (body) {
    if (body.success === true) {
      return fleaApiUrl.picture.download + '?picUid=' + body.data
    } else {
      return ''
    }
  }

  const fd = new FormData()
  fd.append('pic', picFile)
  const fetchReq = {
    method: 'POST',
    body: fd
  }
  return fetch(fleaApiUrl.picture.upload, fetchReq)
    .then(res => res.json())
    .then(handleUpload)
}

const cookieUitls = {
  expireSec: 3600 * 24 * 7,
  parseCookie: function (cookieStr) {
    const res = {}
    if (!cookieStr.endsWith(';')) {
      cookieStr += ';'
    }

    while (cookieStr.length > 1) {
      const ie = cookieStr.indexOf('=')
      const is = cookieStr.indexOf(';')

      const key = cookieStr.substring(0, ie)
      const value = cookieStr.substring(ie + 1, is)
      res[key.trim()] = value

      cookieStr = cookieStr.substring(is + 1)
    }
    return res
  },
  get: function (name) {
    return this.parseCookie(document.cookie)[name]
  },
  set: function (name, value, expireSeconds) {
    let expireDate = null
    if (expireSeconds === undefined) {
      expireDate = new Date(Date.now() + 7 * 24 * 3600 * 1000)
    } else {
      expireDate = new Date(Date.now() + expireSeconds)
    }

    const tmpCookie = name + '=' + value + '; Expires=' + expireDate + '; SameSite=Strict; Path=/'
    document.cookie = tmpCookie
  }
}

const fleaUtils = {
  cloneObj: function (obj) {
    return Object.assign({}, obj)
  },
  cookie: cookieUitls
}

// export fleaApiParam;
// export fleaApiRequest;
// export fleaApiUrl;
// export fleaUtils;
// export {fleaApiUrl, fleaApiParam, fleaApiRequest, fleaUtils};

export default {
  api: {
    url: fleaApiUrl,
    param: fleaApiParam,
    request: fleaApiRequest,
    picture: {
      upload: fleaApiPictureUpload
    }
  },
  util: fleaUtils
}
