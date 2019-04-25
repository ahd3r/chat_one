let db;
if(process.env.NODE_ENV==='test'){
  db = require('../../../utils/database_test');
}else{
  db = require('../../../utils/database');
}

class Repository{
  async getEmails(){
    try {
      return await db.execute('SELECT * FROM email');
    } catch (err) {
      return {err}
    }
  }
  async getEmailBySearch(email){
    try {
      return await db.execute(`SELECT * FROM email WHERE email LIKE '%${email}%'`);
    } catch (err) {
      return {err}
    }
  }
  async getEmail(idEmail){
    try {
      return await db.execute(`SELECT * FROM email WHERE id_email=${idEmail}`);
    } catch (err) {
      return {err}
    }
  }
  async getEmailByEmail(email){
    try {
      return await db.execute(`SELECT * FROM email WHERE email='${email}'`);
    } catch (err) {
      return {err}
    }
  }
  async getEmailsByUserId(idUser){
    try {
      return await db.execute(`SELECT * FROM email WHERE user_id=${idUser}`);
    } catch (err) {
      return {err}
    }
  }
  async createEmail(email,idUser){
    try {
      return await db.execute(`INSERT email(email,user_id) VALUES ('${email}',${idUser})`);
    } catch (err) {
      return {err}
    }
  }
  async deleteEmail(idEmail){
    try {
      return await db.execute(`DELETE FROM email WHERE id_email=${idEmail}`);
    } catch (err) {
      return {err}
    }
  }
  async deleteEmailByEmail(email){
    try {
      return await db.execute(`DELETE FROM email WHERE email='${email}'`);
    } catch (err) {
      return {err}
    }
  }
}

module.exports = new Repository;
