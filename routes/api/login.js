/** * Created by liangxu on 2017/11/16. */const LoginService = require('../../controller/service/login');const APIError = require('../../util/rest').APIError;module.exports = function(router){    router            .get('/api/getVerifyCode', async(ctx) => {                const loginService = new LoginService();                try{                    const result = await loginService.getVerifyCode(ctx);                    console.log("result000==========",result);                    if(!result){                        throw new APIError(1005)                    }                    ctx.rest(result);                }catch(e){                    console.log("getVerifyCode====eee==",e);                    throw new APIError(e);                }            })            .post('/api/regist', async(ctx) => {                console.log("------regist---======");                const loginService = new LoginService();               try{                   const result = await loginService.regist(ctx);                   console.log("result===regist=======",result);                   ctx.rest({result: result});               }catch(e){                   throw (e)               }            })            .post('/api/login', async(ctx) => {                const loginService = new LoginService();                try{                    const result = await loginService.login(ctx);                    console.log("=======result===login=======",result);                    if(!result){                        throw new APIError(1004)                    }                    ctx.rest(result);                }catch(e){                    throw (e)                }            })            .post('/api/setuppwd', async(ctx) => {                const loginService = new LoginService();                try{                    const result = await loginService.setupPwd(ctx);                    console.log("result===setuppwd=======",result);                    ctx.rest({result: result});                }catch(e){                    throw (e)                }            })            .post('/api/resetuppwd', async(ctx) => {                const loginService = new LoginService();                try{                    const result = await loginService.reSetupPwd(ctx);                    console.log("/api/resetuppwd22222=======",result);                    ctx.rest({result: result});                }catch(e){                    throw (e)                }            })            .post('/api/addshopsetupinfo', async(ctx) => {                const loginService = new LoginService();                try{                    const result = await loginService.addShopsetupService(ctx);                    ctx.rest(result);                }catch(e){                    throw (e)                }            })            .get('/api/getshopsetupinfo', async(ctx) => {                const loginService = new LoginService();                try{                    const result = await loginService.getShopSetupInfoService(ctx);                    ctx.rest(result);                }catch(e){                    throw (e)                }            })            .post('/api/updateshopsetup', async(ctx) => {                const loginService = new LoginService();                try{                    const result = await loginService.addShopsetupService(ctx);                    ctx.rest(result);                }catch(e){                    throw (e)                }            })            .post('/api/addshopcertifyInfo', async(ctx) => {                const loginService = new LoginService();                try{                    const result = await loginService.addShopcertifyService(ctx);                    ctx.rest(result);                }catch(e){                    throw (e)                }            })            .get('/api/getshopcertifyInfo', async(ctx) => {                const loginService = new LoginService();                try{                    const result = await loginService.getShopCertifyInfoService(ctx);                    ctx.rest(result);                }catch(e){                    throw (e)                }            })            .post('/api/updateshopcertifyInfo', async(ctx) => {                const loginService = new LoginService();                try{                    const result = await loginService.addShopsetupService(ctx);                    ctx.rest(result);                }catch(e){                    throw (e)                }            })};