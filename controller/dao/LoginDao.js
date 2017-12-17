/** * Created by liangxu on 2017/11/21. */let _ = require('lodash');let errorCode = require('../../config/errorCode');let pg = require('../../util/DB_Base');let knex = require('../../util/knex');let util = require('../../util/util');class LoginDao{    async addRestifyCode(params){        try{            console.log("======addRestifyCode=====params=====",params);            return await knex("enterprise_login").insert({                uuid: util.getUserUUID(),                nickname: params.nickname,                phone: params.phone,                verifyCode: params.verifyCode,                verifytime: util.getCurrentDate(),                regtime: util.getCurrentDate()            })        }catch(e){            console.log("======addRestifyCode===e==", e);            throw e;        }    }    async updateRestifyCodeByPhone(params){        try{            console.log("======updateRestifyCodeByPhone=====params=====", params);            return await knex("enterprise_login")                    .update({                        verifyCode: params.verifyCode,                        verifytime: util.getCurrentDate()                    }).where({                        phone: params.phone                    })        }catch(e){            throw e;        }    }    async getUserInfoByPhone(params){        return await knex("enterprise_login")                .column(                        "enterprise_login.id as userid",                        "enterprise_login.nickname",                        "enterprise_login.password",                        "enterprise_login.avatar",                        "enterprise_login.phone",                        "enterprise_login.regtime",                        "enterprise_login.verifytime"                ).where({phone: params.phone})                .select();    }    async getUserInfoByPhoneAndVerifyCode(params){        return await knex("enterprise_login")                .column(                        "enterprise_login.id as userid",                        "enterprise_login.nickname as username",                        "enterprise_login.password",                        "enterprise_login.avatar",                        "enterprise_login.phone",                        "enterprise_login.gender"                ).where({phone: params.phone, verifyCode: params.verifycode})                .select();    }    async updateRegtime(params){        return await knex("enterprise_login")                .update({regtime: util.currentDate(), password: params.password})                .where({phone: params.phone})                .select();    }    async getUserInfoByPhoneAndPassword(params){        return await knex("enterprise_login")                .column(                        "enterprise_login.id as userid",                        "enterprise_login.nickname as username",                        "enterprise_login.avatar",                        "enterprise_login.phone"                ).where({phone: params.phone, password: params.password})                .select();    }    async setupPassword(params){        //  await knex.transaction(async(trx) => {        //     try{        //         await trx.update({password: params.password})        //                 .from("enterprise_login")        //                 .where({"enterprise_login.phone": params.phone});        //         trx.commit;        //     }catch(e){        //         trx.rollback;        //     }        // });        return await knex("enterprise_login")                .update({                    password: params.password                })                .where({"enterprise_login.phone": params.phone});    }    async getPlatformServiceKindDao(){        return await knex("platform_servicekind")                .column(                        "platform_servicekind.id as serviceid",                        "platform_servicekind.name as name",                        "platform_servicekind.imgurl",                        "platform_servicekind.type"                )                .select();    }    async getSuDaServiceKindDao(){        return await knex("suda_servicekind")                .column(                        "suda_servicekind.id as serviceid",                        "suda_servicekind.name as name",                        "suda_servicekind.imgurl",                        "suda_servicekind.type"                )                .select();    }    async getSubServiceKindDao(type){        return await knex("sub_servicekind")                .column(                        "sub_servicekind.id as serviceid",                        "sub_servicekind.name as name",                        "sub_servicekind.imgurl",                        "sub_servicekind.subtype as subtype"                ).where("sub_servicekind.subtype", '>', type)                .where("sub_servicekind.subtype", '<', +type + 99)                .select();    }    async getShopServiceListDao(type){//{"shop_service.subtype": type}        return await knex("shop_service")                .column(                        "shop_service.id as serviceid",                        "shop_service.uuid",                        "shop_service.shopid",                        "shop_service.serviceimgurl as imgurl",                        "shop_service.name as servicename",                        "shop_service.description as servicecontent",                        "shop_service.price",                        "shop_service.unit",                        "shop_service.saledcount",                        "shop_setup.name as serviceshopname"                ).leftJoin("shop_setup", "shop_setup.id", "shop_service.shopid")                .select();    }    async getShopServiceDetailDao(serviceid){//{"shop_service.subtype": type}        return await knex("shop_service")                .column(                        "shop_service.id as serviceid",                        "shop_service.uuid",                        "shop_service.shopid",                        "shop_service.name as servicename",                        "shop_service.serviceimgurl as shopImgurl",                        "shop_service.description as servicecontent",                        "shop_service.price",                        "shop_service.unit",                        "shop_service.originalprice",                        "shop_service.minbuycount",                        "shop_service.servicetimes",                        "shop_service.platform_servicetype",                        "shop_service.subservice_subtype",                        "shop_service.shopkind",                        "shop_service.saledcount"                )                .select();    }    async getShopServiceInfoByIdDao(serviceid){//{"shop_service.subtype": type}        return await knex("shop_service")                .column(                        "shop_service.id as serviceid",                        "shop_service.uuid",                        "shop_service.shopid",                        "shop_service.name as servicename",                        "shop_service.serviceimgurl as imgurl",                        "shop_service.description as servicedesc",                        "shop_service.price",                        "shop_service.unit",                        "shop_service.originalprice",                        "shop_service.minbuycount",                        "shop_service.servicetimes",                        "shop_service.platform_servicetype",                        "shop_service.subservice_subtype",                        "shop_service.shopkind",                        "shop_service.city",                        "shop_service.sortno",                        "shop_service.saledcount"                ).leftJoin("shop_setup", "shop_setup.id", "shop_service.shopid")                .where({"shop_service.id": serviceid})                .select()    }//.where({id: serviceid})}module.exports = LoginDao;