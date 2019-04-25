// here I check how services interact with each other

const validator = require('validator');

const db = require('../../utils/database_test');

const Adress = require('../../components/adress/model/service');
const User = require('../../components/user/model/service');
const Email = require('../../components/email/model/service');
const Phone = require('../../components/phone/model/service');
const Token = require('../../components/token/model/service');
const Report = require('../../components/report/model/service');
const Auth = require('../../components/auth/model/service');

let jwtToken;
let idAuthUser;

describe('Check the interaction',()=>{
  beforeAll(async(done)=>{
    await db.execute('DELETE FROM adress');
    done();
  });

  afterAll(async(done)=>{
    await db.execute('DELETE FROM adress');
    done();
  });

  test('create user',async(done)=>{
    await new User('Ander','Stac','1111','ander11110@gmail.com','+380953601480','Ukraine','Dnipro','Yangela').save();
    expect(await new Auth('ander11110@gmail.com','1111').generateJwt()).toHaveProperty('err');
    const idEmail = await Email.getEmail(0,'ander11110@gmail.com');
    const confToken = await Token.getTokenByEmailId(idEmail[0][0].id_email);
    await Email.confirmEmail(confToken[0][0].token_conf);
    expect(await new Auth('ander11110@gmail.com','1111').generateJwt()).toHaveProperty('token');
    expect(await new Auth('ander11110@gmail.com','1111').generateJwt()).toHaveProperty('idUser');
    done();
  });
  test('try to enter',async(done)=>{
    const authData = await new Auth('ander11110@gmail.com','1111').generateJwt();
    expect(authData).toHaveProperty('token');
    expect(authData).toHaveProperty('idUser');
    await new Token((await Email.getEmail(0,'ander11110@gmail.com'))[0][0].id_email).saveReset();
    const idEmail = await Email.getEmail(0,'ander11110@gmail.com');
    const resetToken = await Token.getTokenByEmailId(idEmail[0][0].id_email);
    await User.changePassword(resetToken[0][0].token_reset,'1234');
    const authData2 = await new Auth('ander11110@gmail.com','1234').generateJwt();
    expect(authData2).toHaveProperty('token');
    expect(authData2).toHaveProperty('idUser');
    jwtToken=authData2.token;
    idAuthUser=authData2.idUser;
    expect(validator.isJWT(jwtToken)).toBe(true);
    expect((await User.getUsers(0,1,1))[0].id_user).toBe(idAuthUser);
    done();
  });
  test('get current auth user',async(done)=>{
    expect((await User.getUser(idAuthUser))[0][0].first_name).toBe('Ander');
    expect((await User.getUser(idAuthUser))[0][0].second_name).toBe('Stac');
    expect((await Email.getEmails(idAuthUser))[0].length).toBe(1);
    expect((await Phone.getPhones(idAuthUser))[0].length).toBe(1);
    expect((await Adress.giveById((await User.getUser(idAuthUser))[0][0].adress_id))[0].length).toBe(1);
    expect((await Adress.giveById((await User.getUser(idAuthUser))[0][0].adress_id))[0][0].street).toBe('Yangela');
    done();
  });
  test('add and change stuff inside auth user',async(done)=>{
    await new User(0,0,0,0,0,0,'Kiev','IT').changeUser(idAuthUser);
    expect((await db.execute('SELECT * FROM adress'))[0].length).toBe(1);
    expect((await db.execute('SELECT * FROM adress'))[0][0].city).toBe('Kiev');
    expect((await db.execute('SELECT * FROM adress'))[0][0].street).toBe('IT');
    expect((await Email.getEmails())[0].length).toBe(1);
    await new Email('fcdd227@gmail.com',idAuthUser).save();
    expect((await Email.getEmails())[0].length).toBe(2);
    // logout and try login again with new email
    expect(await new Auth('fcdd227@gmail.com','1234').generateJwt()).toHaveProperty('err','You must to confirm your email, we send you a letter again');
    const confToken = await Token.getTokenByEmailId((await Email.getEmail(0,'fcdd227@gmail.com'))[0][0].id_email);
    await Email.confirmEmail(confToken[0][0].token_conf);
    expect(await new Auth('fcdd227@gmail.com','1234').generateJwt()).toHaveProperty('token');
    await Email.delete(0,'ander11110@gmail.com');
    expect((await Email.getEmails())[0].length).toBe(1);
    expect((await Phone.getPhones())[0].length).toBe(1);
    await new Phone('+380504532420',idAuthUser).save();
    expect((await Phone.getPhones())[0].length).toBe(2);
    await Phone.delete(0,'+380953601480');
    expect((await Phone.getPhones())[0].length).toBe(1);
    done();
  });
  test('get other users',async(done)=>{
    expect((await User.getUsers(0,1,2)).length).toBe(2);
    expect((await User.getUsers(0,2,2)).length).toBe(1);
    done();
  });
  test('contact to support',async(done)=>{
    expect(await new Report('Hi man','I found a bag, but I will not show it to you').send()).toHaveProperty('message', 'success');
    done();
  });
});
