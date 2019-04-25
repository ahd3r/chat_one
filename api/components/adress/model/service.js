const repository = require('./repository');

class Adress{
  constructor(country,city,street){
    this.country=country;
    this.city=city;
    this.street=street;
  }

  async save(){
    try {
      return await repository.createAdress(this.country,this.city,this.street);
    } catch (err) {
      return {err}
    }
  }
  async filterAll(){
    try {
      return await repository.getAdressByFilter(this.country,this.city,this.street);
    } catch (err) {
      return {err}
    }
  }
  async getFilteredIds(){
    const arrOfFilteredAdress = (await this.filterAll())[0];
    return arrOfFilteredAdress.map((adress)=>adress.id_adress);
  }
  static async delete(idAdress){
    try {
      return await repository.deleteAdress(idAdress);
    } catch (err) {
      return {err}
    }
  }
  async change(idAdress){
    try {
      return await repository.updateAdress(this.country,this.city,this.street,idAdress);
    } catch (err) {
      return {err}
    }
  }
  static async giveAllAdress(){
    try {
      return await repository.getAdresses();
    } catch (err) {
      return {err}
    }
  }
  static async giveById(idAdress){
    try {
      return await repository.getAdress(idAdress);
    } catch (err) {
      return {err}
    }
  }
}

module.exports = Adress;
