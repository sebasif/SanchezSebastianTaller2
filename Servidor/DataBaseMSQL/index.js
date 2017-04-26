
let mysql = require('mysql');
//var async = require('async');

let pool=mysql.createPool({
                              host: '200.3.193.22',
                              user: 'P09652_1_9',
                              password: 'mQ9YZPGe',
                              database: "P09652_1_9"
                          });


exports.get = function() {
    return pool;
};