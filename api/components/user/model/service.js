const bcrypt = require('bcrypt');

const repository = require('./repository');

const Adress = require('../../adress/model/service');
const Email = require('../../email/model/service');
const Phone = require('../../phone/model/service');
const Token = require('../../token/model/service');

class User{
  constructor(first_name,second_name,password,email,phone,country,city,street){
    this.first_name=first_name;
    this.second_name=second_name;
    this.password=password;
    this.email=email;
    this.phone=phone;
    this.country=country;
    this.city=city;
    this.street=street;
  }

  async save(){
    try {
      await this.hashPassword();
      const responseFromCreatedAdress=await new Adress(this.country,this.city,this.street).save();
      this.idAdress = responseFromCreatedAdress[0].insertId;
      const createdUser = await repository.createUser(this.first_name,this.second_name,this.password,this.idAdress);
      await new Phone(this.phone,createdUser[0].insertId).save();
      await new Email(this.email,createdUser[0].insertId).save();
      return createdUser
    } catch (err) {
      return {err}
    }
  }
  async changeUser(idUser){
    try {
      if(this.country || this.city || this.street){
        await new Adress(this.country,this.city,this.street).change((await repository.getUser(idUser))[0][0].adress_id);
      }
      if(this.password){
        await this.hashPassword();
      }
      return await repository.updateUser(this.first_name,this.second_name,this.password,idUser);
    } catch (err) {
      return {err}
    }
  }
  static async changePassword(resetToken,password){
    try {
      if((await Token.getTokenByReset(resetToken))[0].length===1){
        const hashedPassword = await User.hash(password);
        const idEmail = await Token.getTokenByReset(resetToken);
        const idUser = await Email.getEmail(idEmail[0][0].email_id);
        const response = await repository.updateUser(0,0,hashedPassword,idUser[0][0].user_id);
        await Token.delReset(resetToken);
        return response
      }else{
        return {err:'This token does not exist'}
      }
    } catch (err) {
      return {err}
    }
  }
  static async delUser(idUser){
    try {
      const userDate = await repository.getUser(idUser);
      return await Adress.delete(userDate[0][0].adress_id);
    } catch (err) {
      return {err}
    }
  }
  async hashPassword(){
    try {
      this.password = await User.hash(this.password);
    } catch (err) {
      return {err}
    }
  }
  static async hash(rawPassword){
    try {
      return await bcrypt.hash(rawPassword,7);
    } catch (err) {
      return {err}
    }
  }
  static async getUser(idUser){
    try {
      return await repository.getUser(idUser);
    } catch (err) {
      return {err}
    }
  }
  static async getUsers(idUserArr,page,amount){
    try {
      if(idUserArr){
        const total = await repository.getTotalUserCountByArr(idUserArr);
        const users = await repository.getUsersByArr(idUserArr,page,amount);
        return [...users[0],...total[0]]
      }else{
        const total = await repository.getTotalUserCount();
        const users = await repository.getUsers(page,amount);
        return [...users[0],...total[0]]
      }
    } catch (err) {
      return {err}
    }
  }
  async getUsersByFilter(page,amount){
    try {
      let idAdress;
      if(this.country || this.city || this.street){
        idAdress = await new Adress(this.country,this.city,this.street).getFilteredIds();
      }
      let idUsersByEmail;
      if(this.email){
        idUsersByEmail = await new Email(this.email).getFilteredIds();
      }else{
        idUsersByEmail = [];
      }
      let idUsersByPhone;
      if(idUsersByPhone){
        idUsersByPhone = await new Phone(this.phone).getFilteredIds();
      }else{
        idUsersByPhone=[];
      }
      const idUsers = [...new Set([...idUsersByEmail,...idUsersByPhone])];
      const users = await repository.getUsersBySearch(this.first_name,this.second_name,idAdress,idUsers.length?idUsers:0,page,amount);
      const total = await repository.getTotalUsersCountBySearch(this.first_name,this.second_name,idAdress,idUsers.length?idUsers:0);
      return [...users[0],...total[0]];
    } catch (err) {
      return {err}
    }
  }
}

module.exports = User;
