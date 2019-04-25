let db;
if(process.env.NODE_ENV==='test'){
  db=require('../../../utils/database_test');
}else{
  db=require('../../../utils/database');
}

class Repository{
  async getUsers(page,amount){
    try {
      return await db.execute(`SELECT * FROM users LIMIT ${(page-1)*amount},${amount}`);
    } catch (err) {
      return {err}
    }
  }
  async getTotalUserCount(){
    try {
      return await db.execute('SELECT COUNT(*) AS total FROM users');
    } catch (err) {
      return {err}
    }
  }
  async getUser(idUser){
    try {
      return await db.execute(`SELECT * FROM users WHERE id_user=${idUser}`);
    } catch (err) {
      return {err}
    }
  }
  async getUsersByArr(arr,page,amount){
    try {
      let request = 'SELECT * FROM users WHERE id_user IN (';
      arr.forEach(id => {
        request += id + ',';
      });
      request = request.slice(0,-1) + `) LIMIT ${(page-1)*amount},${amount}`;
      return await db.execute(request);
    } catch (err) {
      return {err}
    }
  }
  async getTotalUserCountByArr(arr){
    try {
      let request = 'SELECT COUNT(*) AS total FROM users WHERE id_user IN (';
      arr.forEach(id => {
        request += id + ',';
      });
      request = request.slice(0,-1) + ')';
      return await db.execute(request);
    } catch (err) {
      return {err}
    }
  }
  async getUsersBySearch(name,sername,adressesIdArr,usersIdArr,page,amount){
    try {
      let request = 'SELECT * FROM users WHERE ';
      if(name){
        request += `first_name LIKE '%${name}%' AND `
      }
      if(sername){
        request += `second_name LIKE '%${sername}%' AND `
      }
      if(usersIdArr){
        request += 'id_user IN (';
        usersIdArr.forEach(id=>{
          request += id + ',';
        });
        request = request.slice(0,-1)+') AND ';
      }
      if(adressesIdArr){
        request += 'adress_id IN (';
        usersIdArr.forEach(id=>{
          request += id + ',';
        });
        request = request.slice(0,-1) + ') AND ';
      }
      return await db.execute(`${request.slice(0,-5)} LIMIT ${(page-1)*amount},${amount}`);
    } catch (err) {
      return {err}
    }
  }
  async getTotalUsersCountBySearch(name,sername,adressesIdArr,usersIdArr){
    try {
      let request = 'SELECT COUNT(*) AS total FROM users WHERE ';
      if(name){
        request += `first_name LIKE '%${name}%' AND `
      }
      if(sername){
        request += `second_name LIKE '%${sername}%' AND `
      }
      if(usersIdArr){
        request += 'id_user IN (';
        usersIdArr.forEach(id=>{
          request += id + ',';
        });
        request = request.slice(0,-1)+') AND ';
      }
      if(adressesIdArr){
        request += 'adress_id IN (';
        usersIdArr.forEach(id=>{
          request += id + ',';
        });
        request = request.slice(0,-1) + ') AND ';
      }
      return await db.execute(`${request.slice(0,-5)}`);
    } catch (err) {
      return {err}
    }
  }
  async createUser(firstName,secondName,password,idAdress){
    try {
      return await db.execute(`INSERT users(first_name,second_name,password,adress_id) VALUES ('${firstName}','${secondName}','${password}',${idAdress})`);
    } catch (err) {
      return {err}
    }
  }
  async updateUser(firstName,secondName,password,idUser){
    try {
      let request = 'UPDATE users SET ';
      if(firstName){
        request+=`first_name='${firstName}', `;
      }
      if(secondName){
        request+=`second_name='${secondName}', `;
      }
      if(password){
        request+=`password='${password}', `;
      }
      request = request.slice(0,-2)+` WHERE id_user=${idUser}`;
      return await db.execute(request);
    } catch (err) {
      return {err}
    }
  }
  async deleteUser(idUser){
    try {
      return await db.execute(`DELETE FROM users WHERE id_user=${idUser}`);
    } catch (err) {
      return {err}
    }
  }
}

module.exports = new Repository;
