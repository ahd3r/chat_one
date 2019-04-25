const Adress = require('../../components/adress/model/service');

const db = require('../../utils/database_test');

// Check validation only with database
describe('Manipulation of adress data in service',()=>{
  beforeEach(async (done)=>{
    await db.execute('DELETE FROM adress');
    await db.execute('INSERT adress(country,city,street) VALUES ("USA","Colifornia","Palo-Alto")');
    done();
  });

  afterAll(async(done)=>{
    await db.execute('DELETE FROM adress');
    done();
  });

  test('create adress',async (done)=>{
    const palo_alto = new Adress('USA','Colifornia','Palo-Alto');
    await palo_alto.save();
    await palo_alto.save();
    expect((await db.execute('SELECT COUNT(*) AS count FROM adress'))[0][0].count).toBe(3);
    expect((await db.execute('SELECT * FROM adress'))[0][0].country).toBe('USA');
    expect((await db.execute('SELECT * FROM adress'))[0][1].country).toBe('USA');
    expect((await db.execute('SELECT * FROM adress'))[0][2].country).toBe('USA');
    done();
  });
  test('get adress by id', async (done)=>{
    const idAdress = (await db.execute('SELECT id_adress FROM adress'))[0][0].id_adress;
    expect((await Adress.giveById(idAdress))[0][0]).toHaveProperty('id_adress',idAdress);
    expect((await Adress.giveById(idAdress))[0][0]).toHaveProperty('country','USA');
    done();
  });
  test('get all adresses',async(done)=>{
    const adress = new Adress('Fuck','Your','Ass');
    await adress.save();
    expect((await Adress.giveAllAdress())[0].length).toBe(2);
    expect((await Adress.giveAllAdress())[0][0]).toHaveProperty('country','USA');
    expect((await Adress.giveAllAdress())[0][1]).toHaveProperty('country','Fuck');
    done();
  });
  test('get filtered adress',async(done)=>{
    await new Adress('Ukraine','Dnipro','Yangela').save();
    await new Adress('Russia','Moscow','Someshit').save();
    await new Adress('Poland','Varshava','Neworker').save();
    await new Adress('Ukraine','Varshava','Someshit').save();
    const idAdresses = await new Adress('Ukraine').getFilteredIds();
    expect(idAdresses.length).toBe(2);
    done();
  });
  test('delete adress',async(done)=>{
    const idAdress = (await Adress.giveAllAdress())[0][0].id_adress;
    await Adress.delete(idAdress);
    expect((await Adress.giveAllAdress())[0].length).toBe(0);
    done();
  });
  test('change adress',async(done)=>{
    const adress = new Adress('Fuck','Your','Ass');
    const idAdress = (await Adress.giveAllAdress())[0][0].id_adress;
    await adress.change(idAdress);
    expect((await Adress.giveAllAdress())[0].length).toBe(1);
    expect((await Adress.giveAllAdress())[0][0].country).toBe('Fuck');
    done();
  });
});

// Check validation
// describe('Manipulation of adress controler',()=>{});
