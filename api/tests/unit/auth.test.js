const validator = require('validator');

const Auth = require('../../components/auth/model/service');
const Token = require('../../components/token/model/service');

const db = require('../../utils/database_test');

// Check validation only with database
describe('Manipulation auth users service',()=>{
  beforeEach(async(done)=>{
    await db.execute('DELETE FROM adress');
    const adressId = await db.execute(`INSERT adress(country,city,street) VALUES ('USA','Colifornia','Palo-Alto')`);
    const userId = await db.execute(`INSERT users(first_name,second_name,password,adress_id) VALUES ('Ander','Stac','$2a$07$7EyGTEv6ktOIe2SR27WZ6.PD..cAm/BJuGxxEOMXoYFujgm8X7Gfy',${adressId[0].insertId})`);
    await db.execute(`INSERT phone(number,user_id) VALUES ('+380953601480',${userId[0].insertId})`);
    await db.execute(`INSERT email(email,user_id) VALUES ('ander11110@gmail.com',${userId[0].insertId})`);
    done();
  });
  
  afterAll(async(done)=>{
    await db.execute('DELETE FROM adress');
    done();
  });

  test('Auth user',async(done)=>{
    const authed = await new Auth('ander11110@gmail.com','1111').generateJwt();
    expect(authed).toHaveProperty('token');
    expect(authed).toHaveProperty('idUser');
    expect(validator.isJWT(authed.token)).toBeTruthy();
    done();
  });
  test('Wrong auth user with wrong password',async(done)=>{
    const authed = await new Auth('ander11110@gmail.com','1234').generateJwt();
    expect(authed).toHaveProperty('err','Password is wrong');
    done();
  });
  test('Wrong auth user with unexisting email',async(done)=>{
    const authed = await new Auth('nder11110@gmail.com','1111').generateJwt();
    expect(authed).toHaveProperty('err','Wrong email');
    done();
  });
  test('Wrong auth user with unconfirmed status',async(done)=>{
    await new Token((await db.execute('SELECT id_email FROM email'))[0][0].id_email).saveConf();
    const authed = await new Auth('ander11110@gmail.com','1111').generateJwt();
    expect(authed).toHaveProperty('err','You must to confirm your email, we send you a letter again');
    done();
  });
  test('Auth user with reset token',async(done)=>{
    await new Token((await db.execute('SELECT id_email FROM email'))[0][0].id_email).saveReset();
    expect((await db.execute('SELECT * FROM tokens'))[0].length).toBe(1);
    const authed = await new Auth('ander11110@gmail.com','1111').generateJwt();
    expect(authed).toHaveProperty('token');
    expect((await db.execute('SELECT * FROM tokens'))[0].length).toBe(0);
    done();
  });
  test('Try to enter with later logining',async(done)=>{
    const idUser = await db.execute('SELECT * FROM users');
    const res = await Auth.checkRightnessAuth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFuZGVyMTExMTBAZ21haWwuY29tIn0.RS0Ae_sZ1OsUlu-rTEBEEN-NK_cY-60pqD4a3b8eNKA',idUser[0][0].id_user);
    expect(res).toBeUndefined();
    done();
  });
  test('Try to enter with right jwt but wrong user id',async(done)=>{
    const res = await Auth.checkRightnessAuth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFuZGVyMTExMTBAZ21haWwuY29tIn0.RS0Ae_sZ1OsUlu-rTEBEEN-NK_cY-60pqD4a3b8eNKA',1);
    expect(res).toHaveProperty('err','Token is wrong');
    done();
  });
  test('Try to enter without later logining',async(done)=>{
    const res = await Auth.checkRightnessAuth();
    expect(res).toHaveProperty('err','You are not auth');
    done();
  });
  test('Try to enter with wrong later logining',async(done)=>{
    const res1 = await Auth.checkRightnessAuth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFuZGVyMTExMTBAZ21haWwu29tIn0.RS0Ae_sZ1OsUlu-rTEBEEN-NK_cY-60pqD4a3b8eNKA');
    const res2 = await Auth.checkRightnessAuth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5kZXIxMTExMEBnbWFpbC5jb20ifQ.JLvOakWGZFTR-4V6rSSAFh3WyVdokQalbDyjd0wLs78');
    expect(res1).toHaveProperty('err');
    expect(res2).toHaveProperty('err','Token is wrong');
    done();
  });
});

// Check validation
// describe('Manipulation auth users controler',()=>{});
