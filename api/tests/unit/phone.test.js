const Phone = require('../../components/phone/model/service');
const db = require('../../utils/database_test');

// Check validation only with database
describe('Manipulation of phone data in service',()=>{
  beforeEach(async(done)=>{
    await db.execute('DELETE FROM adress');
    const idAdress = await db.execute('INSERT adress(country,city,street) VALUES ("USA","San-Francisco","Palo-Alto")');
    await db.execute(`INSERT users(first_name,second_name,password,adress_id) VALUES('Ander','Stac','$2a$07$pfRNs6dkuF7Mio0ueaHjxu.CB273USbAA2ag7AgJdPPCpfFRexc9y',${idAdress[0].insertId})`);
    done();
  });

  afterAll(async(done)=>{
    await db.execute('DELETE FROM adress');
    done();
  });

  test('create phone',async(done)=>{
    const idUser = await db.execute('SELECT * FROM users');
    expect((await new Phone('+380953601480',idUser[0][0].id_user).save())[0]).toHaveProperty('insertId');
    expect((await db.execute('SELECT COUNT(*) AS total FROM phone'))[0][0].total).toBe(1);
    done();
  });
  test('create phone more then 5 for one user',async(done)=>{
    const idUser = await db.execute('SELECT * FROM users');
    await new Phone('+380953601480',idUser[0][0].id_user).save();
    await new Phone('+380953601479',idUser[0][0].id_user).save();
    await new Phone('+380953601478',idUser[0][0].id_user).save();
    await new Phone('+380953601477',idUser[0][0].id_user).save();
    await new Phone('+380953601476',idUser[0][0].id_user).save();
    expect(await new Phone('+380953601475',idUser[0][0].id_user).save()).toHaveProperty('err','You can have only 5 phones');
    expect((await db.execute('SELECT COUNT(*) AS total FROM phone'))[0][0].total).toBe(5);
    done();
  });
  test('create phone not uniq number',async(done)=>{
    const idUser = await db.execute('SELECT * FROM users');
    await new Phone('+380953601480',idUser[0][0].id_user).save();
    expect(await new Phone('+380953601480',idUser[0][0].id_user).save()).toHaveProperty('err');
    expect((await db.execute('SELECT COUNT(*) AS total FROM phone'))[0][0].total).toBe(1);
    done();
  });
  test('create phone wrong user id',async(done)=>{
    expect(await new Phone('+380953601480',1).save()).toHaveProperty('err');
    expect((await db.execute('SELECT COUNT(*) AS total FROM phone'))[0][0].total).toBe(0);
    done();
  });
  test('delete phone',async(done)=>{
    const idUser = await db.execute('SELECT * FROM users');
    await new Phone('+380953601480',idUser[0][0].id_user).save();
    await new Phone('+830645605642',idUser[0][0].id_user).save();
    expect((await db.execute('SELECT COUNT(*) AS total FROM phone'))[0][0].total).toBe(2);
    await Phone.delete(0,'+380953601480');
    expect((await db.execute('SELECT COUNT(*) AS total FROM phone'))[0][0].total).toBe(1);
    const idPhone = await new Phone('+380953601480',idUser[0][0].id_user).save();
    expect((await db.execute('SELECT COUNT(*) AS total FROM phone'))[0][0].total).toBe(2);
    await Phone.delete(idPhone[0].insertId);
    expect((await db.execute('SELECT COUNT(*) AS total FROM phone'))[0][0].total).toBe(1);
    done();
  });
  test('delete phone wrong',async(done)=>{
    const idUser = await db.execute('SELECT * FROM users');
    await new Phone('+380953601480',idUser[0][0].id_user).save();
    expect(await Phone.delete()).toHaveProperty('err','Nothing provided');
    done();
  });
  test('delete last phone',async(done)=>{
    const idUser = await db.execute('SELECT * FROM users');
    await new Phone('+380953601480',idUser[0][0].id_user).save();
    expect(await Phone.delete(0,'+380953601480')).toHaveProperty('err','You can not delete last your number');
    done();
  });
  test('get phone by id',async(done)=>{
    const idUser = await db.execute('SELECT * FROM users');
    const idPhone = await new Phone('+380953601480',idUser[0][0].id_user).save();
    expect((await Phone.getPhone(idPhone[0].insertId))[0][0].number).toBe('+380953601480');
    done();
  });
  test('get phone by phone',async(done)=>{
    const idUser = await db.execute('SELECT * FROM users');
    await new Phone('+380953601480',idUser[0][0].id_user).save();
    expect((await Phone.getPhone(0,'+380953601480'))[0][0].number).toBe('+380953601480');
    done();
  });
  test('get phones',async(done)=>{
    const idUser = await db.execute('SELECT * FROM users');
    await new Phone('+380953601480',idUser[0][0].id_user).save();
    await new Phone('+380953601481',idUser[0][0].id_user).save();
    await new Phone('+380953601482',idUser[0][0].id_user).save();
    await new Phone('+380953601483',idUser[0][0].id_user).save();
    expect((await Phone.getPhones(idUser[0][0].id_user))[0].length).toBe(4);
    expect((await Phone.getPhones())[0].length).toBe(4);
    done();
  });
  test('get phones by filter',async(done)=>{
    const idUser = await db.execute('SELECT * FROM users');
    await new Phone('+380953601480',idUser[0][0].id_user).save();
    await new Phone('+380953601479',idUser[0][0].id_user).save();
    await new Phone('+380504532420',idUser[0][0].id_user).save();
    await new Phone('+380677341204',idUser[0][0].id_user).save();
    expect((await new Phone('0953601480').getFilteredIds()).length).toBe(1);
    expect((await new Phone('09536014').getFilteredIds()).length).toBe(2);
    expect((await new Phone('+380').getFilteredIds()).length).toBe(4);
    done();
  });
});

// Check validation
// describe('Manipulation of phone controler',()=>{});
