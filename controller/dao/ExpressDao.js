let sendVerifyCode = require('../sdk/sendVerifyCode').send_sms;let https = require('https');let qs = require('querystring');let _ = require('lodash');let LoginDao = require('../dao/LoginDao');let PayDao = require('../dao/PayDao');const util = require("../../util/util");const qiniu = require("qiniu");const moment = require("moment");const fs = require('fs');const path = require("path");class PayService{    async updateOrderStatus(ctx){        console.log("updateOrderStatus=====", ctx.request.body);    }    async aliUpdateOrderStatus(ctx){        console.log("aliUpdateOrderStatus=====", ctx.query);    }}module.exports = PayService;