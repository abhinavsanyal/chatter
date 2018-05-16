const dependable = require('dependable');
const container = dependable.container();
const path = require('path');

var dependencies = [
    ['_','lodash'],
    ['passport','passport'],
    ['formidable','formidable'],
    ['Club','./models/club'],
    ['Users','./models/user'],
    ['aws','./helpers/AWSupload'],
    ['Message', './models/message'],
    ['GroupMessage', './models/groupMessage'],
    ['async','async'],

];

dependencies.forEach((dependency)=>{

    container.register(dependency[0],function(){
        return require(dependency[1]);
    })
})

container.load(path.join(__dirname,'/controllers'));
container.load(path.join(__dirname,'/helpers'));


container.register('container',function(){
    return container;
});

module.exports = container ;
