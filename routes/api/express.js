/** * Created by liangxu on 2017/11/25. */const LoginService = require('../../controller/service/login');const ShopService = require('../../controller/service/shopService');let PayService = require('../../controller/service/payService');let ExpressService = require('../../controller/service/ExpressService');const APIError = require('../../util/rest').APIError;const QiniuSDK = require("../../controller/sdk/qiniuCloud");var qcloud_cos = require('qcloud_cos');let appid = '10061631';   //1253210153let secret_id = 'AKIDyOodfIcmxmSMhgS7CeoZmD5kNXap9ylw';let secret_key = '2AxtftpiiyY2hLJjghJjhi243wFZcNme';let EXPIRED_SECONDS = 100; //过期时间module.exports = function(router){    router            .post('/api/user/getbannerurl', async(ctx) => {                try{                    const result = await new ExpressService().orderPayService(ctx);                    ctx.rest(result);                }catch(e){                    console.log("shopService====add==",e);                    throw new APIError(e);                }            })            .post('/api/service/callbackPay', async(ctx) => {                try{                    const result = await new PayService().updateOrderStatus(ctx);                    ctx.rest(result);                }catch(e){                    throw (e)                }            })            .get('/api/service/callbackPay', async(ctx) => {                try{                    const result = await new PayService().aliUpdateOrderStatus(ctx);                    ctx.rest(result);                }catch(e){                    throw (e)                }            })};