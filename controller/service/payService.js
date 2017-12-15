let sendVerifyCode = require('../sdk/sendVerifyCode').send_sms;let https = require('https');let qs = require('querystring');let _ = require('lodash');let LoginDao = require('../dao/LoginDao');let PayDao = require('../dao/PayDao');let VerifyCode = require('../../controller/sdk/verifyCode');const APIError = require('../../util/rest').APIError;const ErrorCode = require('../../config/errorCode');const util = require("../../util/util");const qiniu = require("qiniu");const moment = require("moment");const fs = require('fs');const Alipay = require('alipay-mobile');const path = require("path");class PayService{    async  orderPayService(ctx){        const {userid, serviceid, shopid, address, lat, lon, hoursenum, username, phone,            buytimestamp, buycount, comments, allprice} = ctx.request.body;        const params = {            uuid : util.getUUID(),            userid: userid,            serviceid: serviceid,            shopid: shopid || 0,            address: address,            lat: lat,            lon:lon,            hoursenum: hoursenum,            username: username,            phone: phone,            buytimestamp: buytimestamp,            buycount: buycount,            comments: comments,            allprice: allprice,  //验证对不对  TODO            paytype:0//0: 支付宝1：微信        };        // const params = JSON.parse(ctx.request.body);        // params.uuid = util.getUUID();        console.log("======orderPayService==params=111111=====", params);        if(!params.userid  || !params.serviceid){            throw new APIError(1);        }        const read = filename=>{            console.log("__dirname======",__dirname);            return fs.readFileSync(path.resolve(__dirname,filename), 'utf-8');        };        const options ={            app_id: "2017120500382590",            appPrivKeyFile: read('app_private_key.txt'),            alipayPubKeyFile: read('alipay_public_key.txt')        };        const service = new Alipay(options);        const data = {            subject: "家庭保洁",            out_trade_no: util.getCurrentDate().split('-').join("").split(':').join("").split(" ").join("")+util.getTimestamp()+params.userid+params.serviceid,            total_amount: params.allprice //交易金额        };        return new Promise((resolve, reject)=>{            return service.createOrder(data)                    .then(result => {                        console.log("=====result data=====", result.data);                        //console.log("=====result data=====",decodeURIComponent(result.data))                        params.orderid = data.out_trade_no;                        params.status = 0;                        params.allprice = data.total_amount;   //TODO  验证  total_amount对不对                       return  new PayDao().addOrderInfoDao(params)                               .then((addResult) => {                                 if(addResult){                                     return resolve({orderInfo: result.data, paytype: 0});                                 }                               })                    });        });        // if(!!serviceList.length){        //     return serviceList;        // }    }    async updateOrderStatus(ctx){        console.log("updateOrderStatus=====", ctx.request.body);}    async aliUpdateOrderStatus(ctx){        console.log("aliUpdateOrderStatus=====", ctx.query);    }}module.exports = PayService;