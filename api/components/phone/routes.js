const io = require('../../utils/sockets');
const controler = require('./controler');

io.getIo().on('add phone',controler);
io.getIo().on('delete phone',controler);
io.getIo().on('get phone',controler);
io.getIo().on('get phones',controler);
