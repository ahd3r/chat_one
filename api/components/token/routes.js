const controler = require('./controler');
const io = require('../../utils/sockets');

io.getIo().on('create reset token',controler);
io.getIo().on('get token info by reset token',controler.getTokenByReset);
io.getIo().on('get token info by confirm token',controler.getTokenByConf);
io.getIo().on('get token info by email id',controler.getTokenByEmailId);
