let db;
if(process.env.NODE_ENV==='test'){
  db = require('../../../utils/database_test');
}else{
  db = require('../../../utils/database');
}

class Repository{
  async getAdresses(){
    try {
      return await db.execute('SELECT * FROM adress');
    } catch (err) {
      return {err}
    }
  }
  async getAdress(idAdress){
    try {
      return await db.execute(`SELECT * FROM adress WHERE id_adress=${idAdress}`);
    } catch (err) {
      return {err}
    }
  }
  async getAdressByFilter(country,city,street){
    try {
      let request = 'SELECT * FROM adress WHERE ';
      if(country){
        request += `country LIKE '%${country}%' AND `
      }
      if(city){
        request += `city LIKE '%${city}%' AND `
      }
      if(street){
        request += `street LIKE '%${street}%' AND `
      }
      return await db.execute(request.slice(0,-5));
    } catch (err) {
      return {err}
    }
  }
  async createAdress(country,city,street){
    try {
      return await db.execute(`INSERT adress(country,city,street) VALUES ('${country}','${city}','${street}')`);
    } catch (err) {
      return {err}
    }
  }
  async updateAdress(country,city,street,idAdress){
    try {
      let request = 'UPDATE adress SET ';
      if(country){
        request += `country='${country}', `
      }
      if(city){
        request += `city='${city}', `
      }
      if(street){
        request += `street='${street}', `
      }
      return await db.execute(request.slice(0,-2) + ` WHERE id_adress=${idAdress}`);
    } catch (err) {
      return {err}
    }
  }
  async deleteAdress(idAdress){
    try {
      return await db.execute(`DELETE FROM adress WHERE id_adress=${idAdress}`);
    } catch (err) {
      return {err}
    }
  }
}

module.exports = new Repository;
