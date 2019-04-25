const app = require('express')();

const io = require('./utils/sockets');

io.init(app.listen(3000,()=>{ console.log('Runing on 3000...') }));


// done all with tests
// secure jwt of user (now it is in localstorage) (it careness frontend)
// then create relationship, country can by only from future table, create messaging with redis, create admin panel
