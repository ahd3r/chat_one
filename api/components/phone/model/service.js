const repository = require('./repository');

class Phone{
  constructor(number,idUser){
    this.number=number;
    this.idUser=idUser;
  }

  async save(){
    try{
      if((await repository.getPhonesByUserId(this.idUser))[0].length < 5){
        return await repository.createPhone(this.number,this.idUser);
      }else{
        return {err:'You can have only 5 phones'}
      }
    }catch(err){
      return {err}
    }
  }
  static async delete(idPhone,number){
    try{
      if(idPhone){
        const idUser = await Phone.getPhone(idPhone);
        if((await Phone.getPhones(idUser[0][0].user_id))[0].length>1){
          return await repository.deletePhone(idPhone);
        }else{
          return {err:'You can not delete last your number'}
        }
      }else if(number){
        const idUser = await Phone.getPhone(0,number);
        if((await Phone.getPhones(idUser[0][0].user_id))[0].length>1){
          return await repository.deletePhoneByNumber(number);
        }else{
          return {err:'You can not delete last your number'}
        }
      }else{
        return {err:'Nothing provided'}
      }
    }catch(err){
      return {err}
    }
  }
  async filterPhone(){
    try {
      return await repository.getPhonesBySearch(this.number);
    } catch (err) {
      return {err}
    }
  }
  async getFilteredIds(){
    try {
      const filtered = await this.filterPhone();
      return filtered[0].map(phone=>phone.user_id);
    } catch (err) {
      return {err}
    }
  }
  static async getPhone(idPhone,number){
    try {
      if(idPhone){
        return await repository.getPhone(idPhone);
      }else if(number){
        return await repository.getPhoneByNumber(number);
      }else{
        return {err:'No data given'}
      }
    } catch (err) {
      return {err}
    }
  }
  static async getPhones(idUser){
    try {
      if(idUser){
        return await repository.getPhonesByUserId(idUser);
      }else{
        return await repository.getPhones();
      }
    } catch (err) {
      return {err}
    }
  }
}

module.exports=Phone;
