const mongoose = require('mongoose');
const log4js = require('log4js');

log4js.configure({
    appenders: {
        miLoggerConsole: {type: 'console'},
        warnLog: {type: 'file', filename: 'warn.log'},
        errorLog: {type: 'file', filename: 'error.log'}
    },
    categories: {
        default: {appenders: ['miLoggerConsole'], level: 'trace'},
        console: {appenders: ['miLoggerConsole'], level: 'info'},
        warnLog: {appenders: ['warnLog'], level: 'warn'},
        errorLog: {appenders: ['errorLog'], level: 'error'}
    }
});

const logger = log4js.getLogger('console')

export const connectDB = () => {
    const URI = 'mongodb://localhost:27017/ecommerce';
    mongoose.connect(URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    logger.warn('DB conectada');
}