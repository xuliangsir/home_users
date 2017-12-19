/** * Created by liangxu on 2017/11/21. */let sendVerifyCode = require('../sdk/sendVerifyCode').send_sms;let https = require('https');let qs = require('querystring');let _ = require('lodash');let LoginDao = require('../dao/LoginDao');let VerifyCode = require('../../controller/sdk/verifyCode');const APIError = require('../../util/rest').APIError;const ErrorCode = require('../../config/errorCode');const util = require("../../util/util");const qiniu = require("qiniu");const moment = require("moment");class LoginService{    async getVerifyCode(ctx){        const {phone} = ctx.query;        if(!phone){            throw new APIError(ErrorCode.constant.PARAMERROR)        }        const userInfo = await new LoginDao().getUserInfoByPhone({phone:phone});        let newuser = false;        if(!!userInfo.length){            newuser = true;            console.log("======phone==========",new Date().getTime() - new Date(userInfo[0].verifytime).getTime(), new Date(userInfo[0].verifytime).getTime());            if((new Date().getTime() - userInfo[0].verifytime) <= 60*1000*5  ){                throw new APIError(ErrorCode.constant.VERIFYCODEERROR);            }        }        return new Promise((resolve, reject)=>{            //const {phone} = ctx.request.body;            const code = _.random(10001, 100000);            //verifyCode.sendMsg(mobile, code)            var post_data = {                'apikey': '9cc160bdb7a4c412734f4798504ce2f1',                'mobile': phone,                'text': '【家政圈】您的验证码是' + code            };//这是需要提交的数据            var content = qs.stringify(post_data);            console.log("content========",content);            var options = {                hostname: 'sms.yunpian.com',                port: 443,                path: '/v2/sms/single_send.json',                method: 'POST',                headers: {                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'                }            };            var req = https.request(options, function (res) {                // console.log('STATUS: ' + res.statusCode);                // console.log('HEADERS: ' + JSON.stringify(res.headers));                res.setEncoding('utf8');                res.on('data', function (chunk) {                    console.log('BODY: ' + chunk, JSON.parse(chunk).code);                    if(JSON.parse(chunk).http_status_code >0 ){                        console.error("yunpian request error chunk: ",JSON.parse(chunk).http_status_code);                        return reject(JSON.parse(chunk).http_status_code)                    }                    if(JSON.parse(chunk).code == 0){                        if(!newuser){                            const params = {                                uuid: util.getUserUUID(),                                nickname: "",                                phone: phone,                                verifyCode: code,                                gender: 0                            };                            try{                                new LoginDao().addRestifyCode(params);                            } catch(e){                                reject(false) ;                            }                        }else{                            try{                                new LoginDao().updateRestifyCodeByPhone({phone: phone, verifyCode: code});                            } catch(e){                                reject(false) ;                            }                        }                    }                });            });            req.on('error', (e) => {                console.error("yunpian request error==",e);                req.end();                return reject(false) ;            });            req.write(content);            req.end();            resolve({result:"OK"})        })    }    async registService(ctx) {        const {phone, verifycode, password} = ctx.request.body;        const params = {phone: phone, verifycode: verifycode, password: password};        const result = await new LoginDao().getUserInfoByPhoneAndVerifyCode(params);        if(!!result.length){            console.log("=====registService=====", result);            const updateResult = await new LoginDao().updateRegtime({phone: phone, password: password});            if(updateResult){                return result[0];            }        }else{            //没有此手机号，验证码错误            throw new ErrorCode(1006);        }    }    async setupPwd(ctx){        const {phone, password} = ctx.request.body;        if(!phone || !password){            throw new APIError(1);        }        console.log("==setupPwd==phonephone=======",phone);        const userInfo = await new LoginDao().getUserInfoByPhone({phone: phone});        console.log("==setupPwd==userInfo=======",userInfo);        if(!userInfo.length){            return 1002;        }        const result = await new LoginDao().setupPassword({phone: phone, password: password});        console.log("==setupPwd==result=======",result);        if(result == 0){            return false;        }        return true;    }    async reSetupPwd(ctx){        const {phone, oldpassword, password} = ctx.request.body;        console.log("==resetupPwd==userInfo000=======",phone, oldpassword, password);        const userInfo = await new LoginDao().getUserInfoByPhone({phone: phone});        console.log("==resetupPwd==userInfo000=======",userInfo[0]);        if(!userInfo.length){            throw new APIError(1002);        }        if(userInfo[0].password != oldpassword){            throw new APIError(1003);        }        const result = await new LoginDao().setupPassword({phone: phone,  password: password});        return result;    }    async login(ctx){        const {phone, password} = ctx.request.body;        console.log("=====login===password==",phone, password);        if(!phone || !password){            throw new APIError(1);        }        const userinfo = await new LoginDao().getUserInfoByPhoneAndPassword({phone: phone, password: password});        console.log("=====login===userinfo==",userinfo, userinfo[0].userid);        if(!userinfo.length){            return false;        }        if(!!userinfo.length){            return userinfo[0];        }    }    async getServicesKindService(ctx){        const serviceList = await new LoginDao().getPlatformServiceKindDao();        const sudaList = await new LoginDao().getSuDaServiceKindDao();        // if(!!serviceList.length){        //     return serviceList;        // }       return {menuList: serviceList,suDaList: sudaList, desc:"最快30分钟到达"}    }    async getSubServicesKindService(ctx){        const {type} = ctx.request.body;        console.log("=====getSubServicesKindService===type=typetype=",type);        if(!type){            throw new APIError(1);        }        const subserviceList = await new LoginDao().getSubServiceKindDao(type);        console.log("=====subserviceList===subserviceList==",subserviceList);        // if(!!serviceList.length){        //     return serviceList;        // }        return {serviceList: subserviceList}    }    async getShopServicesListService(ctx){        const {type, subtype, page, pagenum, lat, lon, cityname} = ctx.request.body;        console.log("======getShopServicesListService=====type===",type);        console.log("======getShopServicesListService=====subtype===",subtype);        if(!type){            throw new APIError(1);        }        const serviceList = await new LoginDao().getShopServiceListDao(type, subtype);        console.log("=====serviceList===serviceList==",serviceList);        _.each(serviceList, function(item){            item.goodcommentrate = 0;        });        // if(!!serviceList.length){        //     return serviceList;        // }        return {serviceList: serviceList}    }    async getShopServicesDetailService(ctx){        const {serviceid} = ctx.request.body;        console.log("======serviceidserviceid==serviceid======",serviceid);        if(!serviceid){            throw new APIError(1);        }        const serviceDetail = await new LoginDao().getShopServiceInfoByIdDao(serviceid);        serviceDetail[0].safeguard = "http://coach-10061631.image.myqcloud.com/404a7dde-c559-4479-9c20-7a927f8de7d2";        serviceDetail[0].acceptorderrate = 89; //TODO        serviceDetail[0].wellcommentrate = 90; //TODO        serviceDetail[0].orderinfo = "取消、退款、赔付规则  内容"; //TODO        serviceDetail[0].servicetime = "最近可约今天13:30"; //TODO        serviceDetail[0].maxordercount = 5;        serviceDetail[0].serviceTime = "20171208";        serviceDetail[0].serviceTimestamp = new Date().getTime();        console.log("======getShopServicesInfoByIdService==serviceDetail======",serviceDetail);        // if(!!serviceList.length){        //     return serviceList;        // }        return serviceDetail[0];    }    async  getShopServicesInfoByIdService(ctx){        const {type, subtype, serviceid} = ctx.request.body;        console.log("======getShopServicesDetailService==serviceid======",serviceid);        if(!serviceid){            throw new APIError(1);        }        const serviceDetail = await new LoginDao().getShopServiceDetailDao(serviceid);        serviceDetail[0].maxordercount = 5;        serviceDetail[0].serviceTime = "20171208";        serviceDetail[0].serviceTimestamp = new Date().getTime();        // if(!!serviceList.length){        //     return serviceList;        // }        let serviceInfo = serviceDetail[0];        console.log("=====getShopServicesDetailService===serviceInfo==",serviceInfo);        return serviceDetail[0];    }}module.exports = LoginService;