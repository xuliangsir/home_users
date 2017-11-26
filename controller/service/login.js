/** * Created by liangxu on 2017/11/21. */let sendVerifyCode = require('../sdk/sendVerifyCode').send_sms;let https = require('https');let qs = require('querystring');let _ = require('lodash');let LoginDao = require('../dao/LoginDao');let VerifyCode = require('../../controller/sdk/verifyCode');const APIError = require('../../util/rest').APIError;const ErrorCoe = require('../../config/errorCode');class LoginService{    async getVerifyCode(ctx){        const {phone} = ctx.query;        if(!phone){            throw new APIError(1)        }       const userInfo = await new LoginDao().getUserInfoByPhone({phone:phone});        console.log("===userInfo===phone=",userInfo);        if(!!userInfo.length){            if(userInfo[0].verifyCode && new Date(userInfo[0].verifytime)+ 60*1000*1 > new Date().getTime()){                return false;            }        }else{            return new Promise((resolve, reject)=>{                //const {phone} = ctx.request.body;                const code = _.random(10001, 100000);                console.log("===getVerifyCode===code===",code);                //verifyCode.sendMsg(mobile, code)                var post_data = {                    'apikey': '9cc160bdb7a4c412734f4798504ce2f1',                    'mobile': phone,                    'text': '【家政圈】您的验证码是' + code                };//这是需要提交的数据                var content = qs.stringify(post_data);                console.log("content========",content);                var options = {                    hostname: 'sms.yunpian.com',                    port: 443,                    path: '/v2/sms/single_send.json',                    method: 'POST',                    headers: {                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'                    }                };                var req = https.request(options, function (res) {                    // console.log('STATUS: ' + res.statusCode);                    // console.log('HEADERS: ' + JSON.stringify(res.headers));                    res.setEncoding('utf8');                    res.on('data', function (chunk) {                        console.log('BODY: ' + chunk, JSON.parse(chunk).code);                        if(JSON.parse(chunk).http_status_code >0 ){                            console.error("yunpian request error chunk: ",JSON.parse(chunk).http_status_code);                            return reject(JSON.parse(chunk).http_status_code)                        }                        console.error("-------0000000000000==");                        if(JSON.parse(chunk).code == 0){                            console.error("11111111111==");                            const params = {                                uuid: "werw35345345rewr",                                nickname: "xuliang",                                phone: phone,                                password: "123123123",                                verifyCode: code                            };                            try{                                new LoginDao().addRestifyCode(params);                            } catch(e){                                reject(false) ;                            }                        }                    });                });                req.on('error', (e) => {                    console.error("yunpian request error==",e);                    req.end();                    return reject(false) ;                });                req.write(content);                req.end();                resolve({result:"OK"})            })        }    }    async regist(ctx) {        const {phone, verifyCode} = ctx.request.body;        console.log("=====regist=====",phone, verifyCode);        const result = await new LoginDao().getUserInfoByPhoneAndVerifyCode({phone: phone, verifyCode: verifyCode});        console.log("===regist==result00000=====", result);        const updateResult = await new LoginDao().updateRegtime({phone: phone});        console.log("===regist==updateResult=====", updateResult);        if(!result.length){            return false;        }        return true;     }     async setupPwd(ctx){        const {phone, password} = ctx.request.body;        if(!phone || !password){            throw new APIError(1);        }         console.log("==setupPwd==phonephone=======",phone);        const userInfo = await new LoginDao().getUserInfoByPhone({phone: phone});         console.log("==setupPwd==userInfo=======",userInfo);        if(!userInfo.length){            return 1002;        }         const result = await new LoginDao().setupPassword({phone: phone, password: password});         console.log("==setupPwd==result=======",result);         if(result == 0){             return false;         }         return true;     }    async reSetupPwd(ctx){        const {phone, oldpassword, password} = ctx.request.body;        console.log("==resetupPwd==userInfo000=======",phone, oldpassword, password);        const userInfo = await new LoginDao().getUserInfoByPhone({phone: phone});        console.log("==resetupPwd==userInfo000=======",userInfo[0]);        if(!userInfo.length){            throw new APIError(1002);        }        if(userInfo[0].password != oldpassword){            throw new APIError(1003);        }        const result = await new LoginDao().setupPassword({phone: phone,  password: password});        console.log("======resetupPwd==result11111=======",result);        return result;    }    async login(ctx){        const {phone, password} = ctx.request.body;        console.log("=====login=====",phone, password);        const result = await new LoginDao().getUserInfoByPhoneAndPassword({phone: phone, password: password});        console.log("===regist==result=====",result);        if(!result.length){            return false;        }        let isSetupPassword = false;        if(!!result[0].password){            isSetupPassword = true;        }        return {userInfo: result[0], isSetupPassword: isSetupPassword};    }    async addShopsetupService(ctx){        const {userid, phone,name,album,orderattention,shopintro,servicemobile,servicetimebegin,servicetimeend,week,servicerange,minorderlimit,attachcost,exemptattachcost,appointmenttime} = ctx.request.body;        // if(!name || !shopintro || !servicemobile || !servicetimebegin || !servicetimeend ){        //     throw new APIError(1)        // }        const params = {            userid: userid,            phone: phone,            name: name,            album: album,            orderattention: orderattention,            shopintro :shopintro,            servicemobile: servicemobile,            servicetimebegin: servicetimebegin,            servicetimeend: servicetimeend,            week: week,            servicerange: servicerange,            minorderlimit: minorderlimit,            attachcost: attachcost,            exemptattachcost: exemptattachcost,            appointmenttime: appointmenttime        };        const result = await new LoginDao().addShopsetupDao(params);        console.log("===shopsetup==result=====",result);        if(!result){            return false;        }        return true;    }    async getShopSetupInfoService(ctx){        const {userid} = ctx.query;        const result = await new LoginDao().getShopSetupInfoDao({userid:userid});        console.log("===getShopSetupInfo==result=====",result);        if(!result.length){            return false;        }        return result[0];    }    async updateShopsetupService(ctx){        const {userid, phone, name, album, orderattention, shopintro, servicemobile, servicetimebegin, servicetimeend, week, servicerange, minorderlimit,attachcost,exemptattachcost,appointmenttime} = ctx.request.body;        if(!name || !shopintro || !servicemobile || !servicetimebegin || !servicetimeend ){            throw new APIError(1)        }        const params = {            userid: userid,            phone: phone,            name: name,            album: album,            orderattention: orderattention,            shopintro :shopintro,            servicemobile: servicemobile,            servicetimebegin: servicetimebegin,            servicetimeend: servicetimeend,            week: week,            servicerange: servicerange,            minorderlimit: minorderlimit,            attachcost: attachcost,            exemptattachcost: exemptattachcost,            appointmenttime: appointmenttime        };        const result = await new LoginDao().addShopsetupDao(params);        console.log("===shopsetup==result=====",result);        if(!result){            return false;        }        return true;    }    async addShopcertifyService(ctx){        const {userid, phone,licencename,type,licenceurl,creditcode,licenceregnum,licencelocation,legalentity,limittimebegin,limittimeend,identitycardphoto,name,identitycardnum} = ctx.request.body;        // if(!name || !shopintro || !servicemobile || !servicetimebegin || !servicetimeend ){        //     throw new APIError(1)        // }        const params = {            userid: userid,            phone: phone,            licencename: licencename,            type: type,            licenceurl: licenceurl,            creditcode :creditcode,            licenceregnum: licenceregnum,            licencelocation: licencelocation,            legalentity: legalentity,            limittimebegin: limittimebegin,            limittimeend: limittimeend,            identitycardphoto: identitycardphoto,            name: name,            identitycardnum: identitycardnum        };        const result = await new LoginDao().addShopCertifyDao(params);        console.log("===addShopcertifyService==result=====",result);        if(!result){            return false;        }        return true;    }    async getShopCertifyInfoService(ctx){        const {userid} = ctx.query;        if(!userid){            throw new APIError()        }        const result = await new LoginDao().getShopCertifyInfoDao({userid:userid});        console.log("===getShopSetupInfo==result=====",result);        if(!result.length){            return false;        }        return result[0];    }}module.exports = LoginService;