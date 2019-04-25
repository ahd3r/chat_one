const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userService = require('../../user/model/service');
const emailService = require('../../email/model/service');
const tokenService = require('../../token/model/service');

class Auth{
  constructor(email,password){
    this.email = email;
    this.password = password;
  }

  async generateJwt(){
    try {
      const err = await this.validDataForEnter();
      if(err){
        return err
      }
      const tokenJwt = jwt.sign({email:this.email},'waterphonemouse');
      return {token:tokenJwt,idUser:(await emailService.getEmail(0,this.email))[0][0].user_id}
    } catch (err) {
      return {err}
    }
  }
  static async checkRightnessAuth(jwtToken,idUser){
    try {
      if(jwtToken){
        const email = jwt.verify(jwtToken,'waterphonemouse').email;
        if((await emailService.getEmail(0,email))[0].length !== 1){
          return {err:'Token is wrong'}
        }else if((await emailService.getEmail(0,email))[0][0].user_id !== idUser){
          return {err:'Token is wrong'}
        }
      }else{
        return {err:'You are not auth'}
      }
    } catch (err) {
      return {err}
    }
  }
  async validDataForEnter(){
    try {
      const userEmail = await emailService.getEmail(0,this.email);
      if(userEmail[0].length !== 1){
        return {err:'Wrong email'}
      }
      const emailToken=await tokenService.getTokenByEmailId(userEmail[0][0].id_email);
      if(emailToken[0].length===1){
        if(emailToken[0][0].token_conf){
          await new tokenService(userEmail[0][0].id_email).change();
          return {err:'You must to confirm your email, we send you a letter again'}
        }else if(emailToken[0][0].token_reset){
          await tokenService.delTokenByEmailId(userEmail[0][0].id_email);
        }
      }
      const userPassword = await userService.getUser(userEmail[0][0].user_id);
      const match = await bcrypt.compare(this.password, userPassword[0][0].password);
      if(!match){
        return {err:'Password is wrong'}
      }
    } catch (err) {
      return {err}
    }
  }
}

module.exports = Auth;
