import winston from 'winston';

const transports = [
    new winston.transports.Console({
        colorize: true,
        level: 'silly'
    })
];

export default new winston.Logger({transports: transports});
