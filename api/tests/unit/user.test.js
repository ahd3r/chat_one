const bcrypt = require('bcrypt');

const User = require('../../components/user/model/service');
const Token = require('../../components/token/model/service');

const db = require('../../utils/database_test');

// Check validation only with database
describe('Manipulation of users service and all another',()=>{
  beforeEach(async(done)=>{
    await db.execute('DELETE FROM adress');
    done();
  });

  afterAll(async(done)=>{
    await db.execute('DELETE FROM adress');
    done();
  });
  test('Create user',async(done)=>{
    await new User('ander','stac','1111','ander11110@gmail.com','+380953601480','USA','San-Francisco','Dnepr').save();
    expect((await db.execute('SELECT COUNT(*) AS total FROM users'))[0][0].total).toBe(1);
    expect((await db.execute('SELECT COUNT(*) AS total FROM email'))[0][0].total).toBe(1);
    expect((await db.execute('SELECT COUNT(*) AS total FROM phone'))[0][0].total).toBe(1);
    expect((await db.execute('SELECT COUNT(*) AS total FROM tokens'))[0][0].total).toBe(1);
    expect((await db.execute('SELECT COUNT(*) AS total FROM adress'))[0][0].total).toBe(1);
    done();
  });
  test('check hash',async(done)=>{
    const hash = await User.hash('123456789');
    expect(hash.length).toBe(60);
    expect(await bcrypt.compare('123456789',hash)).toBe(true);
    done();
  });
  test('change user',async(done)=>{
    const idUser = await new User('ander','stac','1111','ander11110@gmail.com','+380953601480','USA','San-Francisco','Dnepr').save();
    await new User('Andrey','Stacenko',0,0,0,0,0,'Silicon valey').changeUser(idUser[0].insertId);
    expect((await db.execute('SELECT * FROM users'))[0].length).toBe(1);
    expect((await db.execute('SELECT * FROM users'))[0][0].first_name).toBe('Andrey');
    expect((await db.execute('SELECT * FROM adress'))[0][0].street).toBe('Silicon valey');
    done();
  });
  test('change user wrong',async(done)=>{
    expect(await new User('Andrey','Stacenko',0,0,0,0,0,'Silicon valey').changeUser(1)).toHaveProperty('err');
    expect((await db.execute('SELECT * FROM users'))[0].length).toBe(0);
    done();
  });
  test('change users password',async(done)=>{
    const idUser = await new User('ander','stac','1111','ander11110@gmail.com','+380953601480','USA','San-Francisco','Dnepr').save();
    await db.execute('DELETE FROM tokens');
    const oldPass1111 = (await User.getUser(idUser[0].insertId))[0][0].password;
    expect(await bcrypt.compare('1111',oldPass1111)).toBe(true);
    const idEmail = await db.execute('SELECT * FROM email');
    await new Token(idEmail[0][0].id_email).saveReset();
    const token = await Token.getTokenByEmailId(idEmail[0][0].id_email);
    await User.changePassword(token[0][0].token_reset,'1234');
    const newPass1234 = (await User.getUser(idUser[0].insertId))[0][0].password;
    expect(await bcrypt.compare('1234',newPass1234)).toBe(true);
    expect((await Token.getTokenByEmailId(idEmail[0][0].id_email))[0].length).toBe(0);
    done();
  });
  test('change users password wrong',async(done)=>{
    const idUser = await new User('ander','stac','1111','ander11110@gmail.com','+380953601480','USA','San-Francisco','Dnepr').save();
    const oldPass1111 = (await User.getUser(idUser[0].insertId))[0][0].password;
    expect(await bcrypt.compare('1111',oldPass1111)).toBe(true);
    const idEmail = await db.execute('SELECT * FROM email');
    expect(await new Token(idEmail[0][0].id_email).saveReset()).toHaveProperty('err','You must to confirm your account at first, we send you email again');
    done();
  });
  test('delete user',async(done)=>{
    const idUser = await new User('ander','stac','1111','ander11110@gmail.com','+380953601480','USA','San-Francisco','Dnepr').save();
    expect((await db.execute('SELECT * FROM users'))[0].length).toBe(1);
    await User.delUser(idUser[0].insertId);
    expect((await db.execute('SELECT * FROM users'))[0].length).toBe(0);
    done();
  });
  test('delete user wrong',async(done)=>{
    await new User('ander','stac','1111','ander11110@gmail.com','+380953601480','USA','San-Francisco','Dnepr').save();
    expect((await db.execute('SELECT * FROM users'))[0].length).toBe(1);
    expect(await User.delUser(1)).toHaveProperty('err');
    expect((await db.execute('SELECT * FROM users'))[0].length).toBe(1);
    done();
  });
  test('get user',async(done)=>{
    const idUser = await new User('ander','stac','1111','ander11110@gmail.com','+380953601480','USA','San-Francisco','Dnepr').save();
    expect((await User.getUser(idUser[0].insertId))[0].length).toBe(1);
    expect((await User.getUser(idUser[0].insertId))[0][0].first_name).toBe('ander');
    expect((await User.getUser(idUser[0].insertId))[0][0].second_name).toBe('stac');
    done();
  });
  test('get users',async(done)=>{
    const idUser1 = await new User('ander','stac','1111','ander11110@gmail.com','+380953601480','USA','San-Francisco','Dnepr').save();
    const idUser2 = await new User('vel','gav','4321','ander1111@gmail.com','+380294562101','USA','San-Francisco','Selicon').save();
    const idUser3 = await new User('alex','ostp','123456789','ander1110@gmail.com','+380945689432','USA','San-Francisco','Palo').save();
    const idUser4 = await new User('bob','meme','1234','ander@gmail.com','+380978923154','USA','San-Francisco','Meme').save();
    const getedData1 = await User.getUsers(0,3,1);
    expect(getedData1.length).toBe(2);
    expect(getedData1[1].total).toBe(4);
    expect(getedData1[0].first_name).toBe('alex');
    const getedData2 = await User.getUsers([idUser1[0].insertId,idUser2[0].insertId,idUser3[0].insertId],2,1);
    expect(getedData2.length).toBe(2);
    expect(getedData2[1].total).toBe(3);
    expect(getedData2[0].first_name).toBe('vel');
    done();
  });
  test('get users by wrong array',async(done)=>{
    const arr = [1,2,3,4];
    expect((await User.getUsers(arr,1,1))[0].total).toBe(0);
    done();
  });
  test('get filtered users',async(done)=>{
    await new User('ander','stac','1111','ander11110@gmail.com','+380953601480','USA','San-Francisco','Dnepr').save();
    await new User('vel','gav','4321','ander1111@gmail.com','+380294562101','USA','San-Francisco','Selicon').save();
    await new User('alex','ostp','123456789','ander1110@gmail.com','+380945689432','USA','San-Francisco','Palo').save();
    await new User('bob','meme','1234','ander@gmail.com','+380978923154','USA','San-Francisco','Meme').save();
    expect((await new User('vel').getUsersByFilter(1,5)).length).toBe(2);
    expect((await new User('vel').getUsersByFilter(1,5))[1].total).toBe(1);
    expect((await new User('vel').getUsersByFilter(1,5))[0].first_name).toBe('vel');
    done();
  });
});


// Check validation
// describe('Manipulation of tokens controler',()=>{});
