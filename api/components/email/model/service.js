const repository = require('./repository');

const Token = require('../../token/model/service');

class Email{
  constructor(mail,idUser){
    this.mail=mail;
    this.idUser=idUser;
  }

  async save(){
    try {
      if((await repository.getEmailsByUserId(this.idUser))[0].length < 5){
        const createdEmail = await repository.createEmail(this.mail,this.idUser);
        await new Token(createdEmail[0].insertId).saveConf();
        return createdEmail
      }else{
        return {err:'You can have only 5 emails'}
      }
    } catch (err) {
      return {err}
    }
  }
  static async delete(idEmail,email){
    try {
      if(idEmail){
        const idUser = await Email.getEmail(idEmail);
        if((await Email.getEmails(idUser[0][0].user_id))[0].length>1){
          return await repository.deleteEmail(idEmail);
        }else{
          return {err:'You can not delete last email'}
        }
      }else if(email){
        const idUser = await Email.getEmail(0,email);
        if((await Email.getEmails(idUser[0][0].user_id))[0].length>1){
          return await repository.deleteEmailByEmail(email)
        }else{
          return {err:'You can not delete last email'}
        }
      }
    } catch (err) {
      return {err}
    }
  }
  async filterEmail(){
    try {
      return await repository.getEmailBySearch(this.mail);
    } catch (err) {
      return {err}
    }
  }
  async getFilteredIds(){
    try {
      const filtered = await this.filterEmail();
      return filtered[0].map(email=>email.user_id);
    } catch (err) {
      return {err}
    }
  }
  static async getEmails(idUser){
    try {
      if(idUser){
        return await repository.getEmailsByUserId(idUser);
      }else{
        return await repository.getEmails();
      }
    } catch (err) {
      return {err}
    }
  }
  static async getEmail(idEmail,email){
    try {
      if(idEmail){
        return await repository.getEmail(idEmail)
      }else if(email){
        return await repository.getEmailByEmail(email)
      }
    } catch (err) {
      return {err}
    }
  }
  static async confirmEmail(confToken){
    try {
      if((await Token.getTokenByConf(confToken))[0].length===1){
        return await Token.delConf(confToken);
      }else{
        return {err:'This token does not exist'}
      }
    } catch (err) {
      return {err}
    }
  }
}

module.exports = Email;
