#!/usr/bin/env node

var PictureTube = require('picture-tube'),
  tube = new PictureTube({
    cols: 26
  }),
  fs = require('fs');

var docker;

var buff = [];

fs.createReadStream(__dirname + '/../assets/docker.png').pipe(tube);

tube.on('data', function (data) {
  data = data.toString();
  buff.push(data.toString());
});

tube.on('end', function () {

  docker = buff.join('');

  fs.writeFileSync(__dirname + '/../assets/docker-logo.json', JSON.stringify(
    chop(sew([""], docker.split('\n')).slice(1, 7).join('\n'), 20), true, 2));
});

function chop(str, n) {
  var stack = [],
    l;

  while (str.length) {
    l = Math.min(str.length, n);
    stack.push(str.substring(0, l));
    str = str.substring(l);
  }

  return stack;
}

function sew(a, b) {

  var min = Math.min(a.length, b.length),
    max = Math.max(a.length, b.length),
    favorA = a.length > b.length,
    fillWidth = favorA ? b[0].length : a[0].length,
    buff = [],
    i;

  for (i = 0; i < min; i++) {
    buff.push(a[i] + b[i]);
  }

  if (favorA) {
    for (i = min; i < max; i++) {
      buff.push(a[i] + Array(fillWidth + 1).join(' '));
    }
  } else {
    for (i = min; i < max; i++) {
      buff.push(Array(fillWidth + 1).join(' ') + b[i]);
    }
  }

  return buff;
}
