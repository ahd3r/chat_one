const Report = require('../../components/report/model/service');

test('Send report',async(done)=>{
  const reportSend = await new Report('I want an admin status','<p>Hi, give me an admin status, please</p>').send();
  expect(reportSend).toHaveProperty('message','success');
  done();
});
