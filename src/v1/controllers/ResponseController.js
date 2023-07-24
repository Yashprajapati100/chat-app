const messages = require('../../modules/exceptions/message.json')

class ResponseController {
    error(res, msg, language, data) {
      let response = {
        code: 0,
        status: 'FAIL',
        message: this.getMessage(msg, language) ? this.getMessage(msg, language) : msg,
      };
      let status_code = 200;
      if (msg == 'INVALID_TOKEN') {
        response.code = 403;
        status_code = 403;
      }
      if (msg == 'USER_BANNED') {
        response.code = 403;
        // status_code = 403
      }
      if (msg == 'USER_BLOCKED') {
        response.code = 406;
        // status_code = 406
      }
      if (msg == 'USER_DELETED') {
        response.code = 405;
        // status_code = 405
      }
      if (msg == 'INVALID_APP_VERSION' || msg == 'UPGRADE_APP') {
        response.code = 304;
        // status_code = 403
      }
      if (msg == 'TOKEN_EXPIRED') {
        response.code = 401;
        // status_code = 401
      }
      console.log('\n\n\n============================= FAIL RESPONSE=====================================');
      console.log(response);
      console.log('================================================================================\n\n\n');
      res.status(status_code).json(response);
    }
  
    success(res, msg, language, data, keyValue, total) {
      let response = {
        code: 1,
        status: 'SUCCESS',
        message: this.getMessage(msg, language),
        data: data,
        ...keyValue,
        total: total,
      };
      // console.log("\n\n\n============================= SUCCESS RESPONSE==================================")
      // console.log(response)
      // console.log("================================================================================\n\n\n")
      res.status(200).json(response);
    }
  
    getMessage(msg, language) {
      let lang = 'en';
      if (language) {
        lang = language;
      }
    //   if (msg.param && msg.param.includes('email')) {
    //     msg.param = 'email';
    //   }
    //   if (msg.type && msg.type.includes('and')) {
    //     return msg.message;
    //   }
  
      if (msg.param && msg.type) {
        if (msg.type.includes('required')) {
          return messages[lang]['PARAM_REQUIRED'].replace('PARAM', msg.param);
        } else if (msg.type.includes('min')) {
          return msg.message;
        } else {
          return messages[lang]['INVALID_PARAM'].replace('PARAM', msg.param);
        }
      } else if (msg.toString().includes('ReferenceError:')) {
        // console.log('======================ERROR=====================')
        // console.log(msg)
        // console.log('================================================')
        return messages[lang]['INTERNAL_SERVER_ERROR'];
      } else {
        return messages[lang][msg];
      }
    }
  }
  
  module.exports = new ResponseController();