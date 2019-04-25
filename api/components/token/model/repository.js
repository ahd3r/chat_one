let db;
if(process.env.NODE_ENV==='test'){
  db=require('../../../utils/database_test');
}else{
  db=require('../../../utils/database');
}

class Repository{
  async getTokenByConf(token){
    try {
      return await db.execute(`SELECT * FROM tokens WHERE token_conf='${token}'`);
    } catch (err) {
      return {err}
    }
  }
  async getTokenByReset(token){
    try {
      return await db.execute(`SELECT * FROM tokens WHERE token_reset='${token}'`);
    } catch (err) {
      return {err}
    }
  }
  async getTokenByEmailId(idEmail){
    try {
      return await db.execute(`SELECT * FROM tokens WHERE email_id=${idEmail}`);
    } catch (err) {
      return {err}
    }
  }
  async createConfForEmailId(idEmail,token){
    try {
      return await db.execute(`INSERT tokens(token_conf,email_id) VALUES ('${token}',${idEmail})`);
    } catch (err) {
      return {err}
    }
  }
  async createResetForEmailId(idEmail,token){
    try {
      return await db.execute(`INSERT tokens(token_reset,email_id) VALUES ('${token}',${idEmail})`);
    } catch (err) {
      return {err}
    }
  }
  async updtConfForEmailId(idEmail,token){
    try {
      return await db.execute(`UPDATE tokens SET token_conf='${token}' WHERE email_id=${idEmail}`);
    } catch (err) {
      return {err}
    }
  }
  async updtResetForEmailId(idEmail,token){
    try {
      return await db.execute(`UPDATE tokens SET token_reset='${token}' WHERE email_id=${idEmail}`);
    } catch (err) {
      return {err}
    }
  }
  async deleteTokenByConf(token){
    try {
      return await db.execute(`DELETE FROM tokens WHERE token_conf='${token}'`);
    } catch (err) {
      return {err}
    }
  }
  async deleteTokenByReset(token){
    try {
      return await db.execute(`DELETE FROM tokens WHERE token_reset='${token}'`);
    } catch (err) {
      return {err}
    }
  }
  async deleteTokenByEmailId(idEmail){
    try {
      return await db.execute(`DELETE FROM tokens WHERE email_id=${idEmail}`);
    } catch (err) {
      return {err}
    }
  }
}

module.exports = new Repository;
