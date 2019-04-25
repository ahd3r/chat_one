const Token = require('../../components/token/model/service');

const db = require('../../utils/database_test');

// Check validation only with database
describe('Manipulation of tokens service',()=>{
  beforeEach(async(done)=>{
    await db.execute('DELETE FROM adress');
    const idCreatedAdress = await db.execute('INSERT adress(country,city,street) VALUES ("USA","Colifornia","Palo-Alto")');
    const idCreatedUser = await db.execute(`INSERT users(first_name,second_name,password,adress_id) VALUES ('Ander','Stac','$2a$07$7EyGTEv6ktOIe2SR27WZ6.PD..cAm/BJuGxxEOMXoYFujgm8X7Gfy',${idCreatedAdress[0].insertId})`);
    await db.execute(`INSERT email(email,user_id) VALUES ('ander11110@gmail.com',${idCreatedUser[0].insertId})`);
    done();
  });
  
  afterAll(async(done)=>{
    await db.execute('DELETE FROM adress');
    done();
  });

  test('Create conf token',async(done)=>{
    const idExistingEmail = (await db.execute('SELECT id_email FROM email'))[0][0].id_email;
    expect(await new Token(idExistingEmail).saveConf()).toHaveProperty('msg','Token created and sended');
    expect((await Token.getTokenByEmailId(idExistingEmail))[0][0].token_conf.length).toBe(40);
    expect((await Token.getTokenByEmailId(idExistingEmail))[0][0].token_reset).toBe(null);
    done();
  });
  test('Create reset token',async(done)=>{
    const idExistingEmail = (await db.execute('SELECT id_email FROM email'))[0][0].id_email;
    expect(await new Token(idExistingEmail).saveReset()).toHaveProperty('msg','Token created and sended');
    expect((await Token.getTokenByEmailId(idExistingEmail))[0][0].token_reset.length).toBe(40);
    expect((await Token.getTokenByEmailId(idExistingEmail))[0][0].token_conf).toBe(null);
    done();
  });
  test('Create reset token while exist conf',async(done)=>{
    const idExistingEmail = (await db.execute('SELECT id_email FROM email'))[0][0].id_email;
    expect(await new Token(idExistingEmail).saveConf()).toHaveProperty('msg','Token created and sended');
    expect(await new Token(idExistingEmail).saveReset()).toHaveProperty('err','You must to confirm your account at first, we send you email again');
    expect((await Token.getTokenByEmailId(idExistingEmail))[0][0].token_conf.length).toBe(40);
    expect((await Token.getTokenByEmailId(idExistingEmail))[0][0].token_reset).toBe(null);
    done();
  });
  test('Recreate reset token',async(done)=>{
    const idExistingEmail = (await db.execute('SELECT id_email FROM email'))[0][0].id_email;
    expect(await new Token(idExistingEmail).saveReset()).toHaveProperty('msg','Token created and sended');
    expect(await new Token(idExistingEmail).saveReset()).toHaveProperty('msg','Token created and sended');
    expect((await Token.getTokenByEmailId(idExistingEmail))[0][0].token_reset.length).toBe(40);
    expect((await Token.getTokenByEmailId(idExistingEmail))[0][0].token_conf).toBe(null);
    done();
  });
  test('Del reset and conf token',async(done)=>{
    const idExistingEmail = (await db.execute('SELECT id_email FROM email'))[0][0].id_email;
    expect(await new Token(idExistingEmail).saveReset()).toHaveProperty('msg','Token created and sended');
    await Token.delTokenByEmailId(idExistingEmail);
    expect((await Token.getTokenByEmailId(idExistingEmail))[0].length).toBe(0);
    expect(await new Token(idExistingEmail).saveConf()).toHaveProperty('msg','Token created and sended');
    await Token.delTokenByEmailId(idExistingEmail);
    expect((await Token.getTokenByEmailId(idExistingEmail))[0].length).toBe(0);
    expect(await new Token(idExistingEmail).saveReset()).toHaveProperty('msg','Token created and sended');
    await Token.delReset((await Token.getTokenByEmailId(idExistingEmail))[0][0].token_reset);
    expect((await Token.getTokenByEmailId(idExistingEmail))[0].length).toBe(0);
    expect(await new Token(idExistingEmail).saveConf()).toHaveProperty('msg','Token created and sended');
    await Token.delConf((await Token.getTokenByEmailId(idExistingEmail))[0][0].token_conf);
    expect((await Token.getTokenByEmailId(idExistingEmail))[0].length).toBe(0);
    done();
  });
  test('Get token by all way',async(done)=>{
    const idExistingEmail = (await db.execute('SELECT id_email FROM email'))[0][0].id_email;
    await new Token(idExistingEmail).saveConf();
    expect((await Token.getTokenByEmailId(idExistingEmail))[0].length).toBe(1);
    expect((await Token.getTokenByConf((await Token.getTokenByEmailId(idExistingEmail))[0][0].token_conf))[0].length).toBe(1);
    await Token.delTokenByEmailId(idExistingEmail);
    await new Token(idExistingEmail).saveReset();
    expect((await Token.getTokenByReset((await Token.getTokenByEmailId(idExistingEmail))[0][0].token_reset))[0].length).toBe(1);
    done();
  });
});

// Check validation
// describe('Manipulation of tokens controler',()=>{});
