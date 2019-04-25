const Email = require('../../components/email/model/service');

const db = require('../../utils/database_test');

// Check validation only with database
describe('Manipulation of email data in service',()=>{
  beforeEach(async(done)=>{
    await db.execute('DELETE FROM adress');
    const idAdress = await db.execute('INSERT adress(country,city,street) VALUES("USA","San-Francisco","Palo-Alto")');
    await db.execute(`INSERT users(first_name,second_name,password,adress_id) VALUES('ander','stac','$2a$07$KmtHpEbDrjHBmAnu/de1yOs/B2q.gciez4GyekdXABFitBfYcGkmC',${idAdress[0].insertId})`);
    done();
  });

  afterAll(async(done)=>{
    await db.execute('DELETE FROM adress');
    done();
  });

  test('create email',async(done)=>{
    const idUser=await db.execute('SELECT * FROM users');
    await new Email('ander11110@gmail.com',idUser[0][0].id_user).save();
    expect((await db.execute('SELECT * FROM tokens'))[0].length).toBe(1);
    done();
  });
  test('create wrong email',async(done)=>{
    expect(await new Email('ander11110@gmail.com',1).save()).toHaveProperty('err');
    done();
  });
  test('create email more then 5 and check uniqness',async(done)=>{
    const idUser=await db.execute('SELECT * FROM users');
    await new Email('ander11110@gmail.com',idUser[0][0].id_user).save();
    await new Email('afdssd@gmail.com',idUser[0][0].id_user).save();
    await new Email('sqewsd@gmail.com',idUser[0][0].id_user).save();
    expect(await new Email('sqewsd@gmail.com',idUser[0][0].id_user).save()).toHaveProperty('err');
    await new Email('asdqkl@gmail.com',idUser[0][0].id_user).save();
    await new Email('dsa43u@gmail.com',idUser[0][0].id_user).save();
    expect(await new Email('dsk43u@gmail.com',idUser[0][0].id_user).save()).toHaveProperty('err','You can have only 5 emails');
    expect((await db.execute('SELECT * FROM tokens'))[0].length).toBe(5);
    done();
  });
  test('delete email',async(done)=>{
    expect((await db.execute('SELECT * FROM email'))[0].length).toBe(0);
    const idUser=await db.execute('SELECT * FROM users');
    await new Email('ander11110@gmail.com',idUser[0][0].id_user).save();
    await new Email('ander1111@gmail.com',idUser[0][0].id_user).save();
    expect((await db.execute('SELECT * FROM email'))[0].length).toBe(2);
    const idEmail = await db.execute('SELECT * FROM email');
    await Email.delete(idEmail[0][0].id_email);
    expect((await db.execute('SELECT * FROM email'))[0].length).toBe(1);
    done();
  });
  test('delete last email',async(done)=>{
    expect((await db.execute('SELECT * FROM email'))[0].length).toBe(0);
    const idUser=await db.execute('SELECT * FROM users');
    await new Email('ander11110@gmail.com',idUser[0][0].id_user).save();
    const idEmail = await db.execute('SELECT * FROM email');
    expect(await Email.delete(idEmail[0][0].id_email)).toHaveProperty('err','You can not delete last email');
    expect((await db.execute('SELECT * FROM email'))[0].length).toBe(1);
    done();
  });
  test('change email',async(done)=>{
    const idUser=await db.execute('SELECT * FROM users');
    await new Email('ander11110@gmail.com',idUser[0][0].id_user).save();
    expect((await db.execute('SELECT * FROM email'))[0][0].email).toBe('ander11110@gmail.com');
    await new Email('ander1111@gmail.com',idUser[0][0].id_user).save();
    await Email.delete(0,'ander11110@gmail.com');
    expect((await db.execute('SELECT * FROM email'))[0].length).toBe(1);
    expect((await db.execute('SELECT * FROM email'))[0][0].email).toBe('ander1111@gmail.com');
    done();
  });
  test('confirm email',async(done)=>{
    const idUser=await db.execute('SELECT * FROM users');
    await new Email('ander11110@gmail.com',idUser[0][0].id_user).save();
    await Email.delete(0,'ander11110@gmail.com');
    await new Email('ander11110@gmail.com',idUser[0][0].id_user).save();
    const confToken = await db.execute('SELECT * FROM tokens');
    await Email.confirmEmail(confToken[0][0].token_conf);
    expect((await db.execute('SELECT * FROM email'))[0][0].email).toBe('ander11110@gmail.com');
    expect((await db.execute('SELECT * FROM tokens'))[0].length).toBe(0);
    done();
  });
  test('get email',async(done)=>{
    const idUser = await db.execute('SELECT * FROM users');
    const idEmail = await new Email('ander11110@gmail.com',idUser[0][0].id_user).save();
    expect((await Email.getEmail(idEmail[0].insertId))[0][0].email).toBe('ander11110@gmail.com');
    expect((await Email.getEmail(0,'ander11110@gmail.com'))[0][0].email).toBe('ander11110@gmail.com');
    done();
  });
  test('get emails',async(done)=>{
    const idUser = await db.execute('SELECT * FROM users');
    await new Email('ander11110@gmail.com',idUser[0][0].id_user).save();
    await new Email('fcdd227@gmail.com',idUser[0][0].id_user).save();
    await new Email('fcdd07@gmail.com',idUser[0][0].id_user).save();
    expect((await Email.getEmails(idUser[0][0].id_user))[0].length).toBe(3);
    expect((await Email.getEmails())[0].length).toBe(3);
    done();
  });
  test('get filtered emails id',async(done)=>{
    const idUser = await db.execute('SELECT * FROM users');
    await new Email('ander11110@gmail.com',idUser[0][0].id_user).save();
    await new Email('fcdd227@gmail.com',idUser[0][0].id_user).save();
    await new Email('fcdd07@gmail.com',idUser[0][0].id_user).save();
    expect((await new Email('fcdd').getFilteredIds()).length).toBe(2);
    done();
  });
});

// Check validation
// describe('Manipulation of email controler',()=>{});
