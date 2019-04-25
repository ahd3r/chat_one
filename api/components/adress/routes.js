const io = require('../../utils/sockets');
const controler = require('./controler');

io.getIo().on('get all adresses',controler.backAllAdresses);
io.getIo().on('get adress by id',controler.backAdress);
io.getIo().on('change adress for user by id',controler.editAdressByUserId);
