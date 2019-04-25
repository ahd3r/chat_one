let db;
if(process.env.NODE_ENV==='test'){
  db=require('../../../utils/database_test');
}else{
  db=require('../../../utils/database');
}

class Repository{
  async getPhones(){
    try {
      return await db.execute('SELECT * FROM phone');
    } catch (err) {
      return {err}
    }
  }
  async getPhone(idPhone){
    try {
      return await db.execute(`SELECT * FROM phone WHERE id_phone=${idPhone}`);
    } catch (err) {
      return {err}
    }
  }
  async getPhoneByNumber(number){
    try {
      return await db.execute(`SELECT * FROM phone WHERE number='${number}'`);
    } catch (err) {
      return {err}
    }
  }
  async getPhonesByUserId(idUser){
    try {
      return await db.execute(`SELECT * FROM phone WHERE user_id=${idUser}`);
    } catch (err) {
      return {err}
    }
  }
  async getPhonesBySearch(number){
    try {
      return await db.execute(`SELECT * FROM phone WHERE number LIKE '%${number}%'`);
    } catch (err) {
      return {err}
    }
  }
  async createPhone(number,idUser){
    try {
      return await db.execute(`INSERT phone(number,user_id) VALUES ('${number}',${idUser})`);
    } catch (err) {
      return {err}
    }
  }
  async deletePhone(idPhone){
    try {
      return await db.execute(`DELETE FROM phone WHERE id_phone=${idPhone}`);
    } catch (err) {
      return {err}
    }
  }
  async deletePhoneByNumber(number){
    try {
      return await db.execute(`DELETE FROM phone WHERE number='${number}'`);
    } catch (err) {
      return {err}
    }
  }
}

module.exports = new Repository;
