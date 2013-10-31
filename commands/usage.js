/* jslint node: true */

var colors = require('colors');

module.exports = [
  ''
].concat(
  require('../assets/docker-logo.json')
  .join('')
  .split('\n')
).concat([
  '',
  'Docker for all your servers',
  '',
  'Usage:'.cyan.bold.underline,
  '',
  'wharfie <resource> <action> <param1> <param2> ...',
  '',
  'More help:'.cyan.bold.underline,
  '',
  'wharfie config',
  'wharfie endpoint'
]);
