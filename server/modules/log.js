import winston from 'winston';
import path from 'path';
import config from '../config';

const transports = [
    new winston.transports.Console({
        colorize: true,
        level: 'silly'
    })
];

export default new winston.Logger({transports: transports});
