const repository = require('./repository');
const repositoryEmail = require('../../email/model/repository');

const Report = require('../../report/model/service');

class Token{
  constructor(idEmail){
    this.idEmail=idEmail;
  }

  createToken(){
    let text = '';
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 40; i++){
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  async createUniqToken(){
    try {
      let token;
      let done = true;
      while (done){
        token = this.createToken();
        if((await repository.getTokenByConf(token))[0].length===0 && (await repository.getTokenByReset(token))[0].length===0){
          done = false;
        }
      }
      this.token=token
    } catch (err) {
      return {err}
    }
  }
  async sendTokenToMail(type){
    try {
      return await Report.configForSendingEmail().sendMail({
        to:(await repositoryEmail.getEmail(this.idEmail))[0][0].email,
        from:'support@phone.book',
        subject:type==='conf'?'Confirm token':type==='reset'?'Reset token':'Just',
        html:`<h4>Here is your token ${this.token}, take it and push in your ass, because I dunno what you must to do it</h4>`
      });
    } catch (err) {
      return {err}
    }
  }
  static async delTokenByEmailId(idEmail){
    try {
      return await repository.deleteTokenByEmailId(idEmail);
    } catch (err) {
      return {err}
    }
  }
  static async delConf(token){
    try {
      return await repository.deleteTokenByConf(token);
    } catch (err) {
      return {err}
    }
  }
  static async delReset(token){
    try {
      return await repository.deleteTokenByReset(token);
    } catch (err) {
      return {err}
    }
  }
  async change(){
    try {
      await this.createUniqToken();
      if((await repository.getTokenByEmailId(this.idEmail))[0][0].token_conf){
        await repository.updtConfForEmailId(this.idEmail,this.token);
        await this.sendTokenToMail('conf');
        return {msg:'Token created and sended'}
      }else if((await repository.getTokenByEmailId(this.idEmail))[0][0].token_reset){
        await repository.updtResetForEmailId(this.idEmail,this.token);
        await this.sendTokenToMail('reset');
        return {msg:'Token created and sended'}
      }else{
        return {err:'You do not have token for changing'}
      }
    } catch (err) {
      return {err}
    }
  }
  async saveReset(){
    try {
      if((await repository.getTokenByEmailId(this.idEmail))[0].length!==0 && (await repository.getTokenByEmailId(this.idEmail))[0][0].token_conf){
        await this.change();
        return {err:'You must to confirm your account at first, we send you email again'}
      }else if((await repository.getTokenByEmailId(this.idEmail))[0].length!==0 && (await repository.getTokenByEmailId(this.idEmail))[0][0].token_reset){
        await Token.delTokenByEmailId(this.idEmail);
      }
      await this.createUniqToken();
      await repository.createResetForEmailId(this.idEmail,this.token);
      await this.sendTokenToMail('reset');
      return {msg:'Token created and sended'}
    } catch (err) {
      return {err}
    }
  }
  async saveConf(){
    try {
      if((await repository.getTokenByEmailId(this.idEmail))[0].length!==0){
        await repository.deleteTokenByEmailId(this.idEmail);
      }
      await this.createUniqToken();
      await repository.createConfForEmailId(this.idEmail,this.token);
      await this.sendTokenToMail('conf');
      return {msg:'Token created and sended'}
    } catch (err) {
      return {err}
    }
  }
  static async getTokenByConf(token){
    try {
      return await repository.getTokenByConf(token);
    } catch (err) {
      return {err}
    }
  }
  static async getTokenByEmailId(idEmail){
    try {
      return await repository.getTokenByEmailId(idEmail);
    } catch (err) {
      return {err}
    }
  }
  static async getTokenByReset(token){
    try {
      return await repository.getTokenByReset(token);
    } catch (err) {
      return {err}
    }
  }
}

module.exports = Token;
