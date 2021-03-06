#!/usr/bin/env node
const tar = require('tar-fs')
const fs = require('fs')
const pascalcase = require('pascalcase');
const kebabCase = require('kebab-case');
const minimist = require('minimist');
const replaceInFile = require('replace-in-file');

var argv = minimist(process.argv.slice(2), {alias:{configure:'c'}, boolean:'c'})

const REPLACE_PASCAL_STR = /_SamplePascalName_/g;
const REPLACE_KEBAB_STR = /_SampleKebabName_/g;
const REPLACE_FILE_STR = /_SampleFileName_/g;
const REPLACE_PATH_STR = /_PATH_/g;
const STYLE_EXT = ".scss";
const SCRIPT_EXT = ".ts";
const TEMPLATE_EXT = ".html";
const VUE_EXT = ".vue";
const INDEX_FILE = "index"+ SCRIPT_EXT;
const SAMPLES_PATH = __dirname+"/SamplesFiles/";
const SAMPLES_STYLE_FILE = SAMPLES_PATH+'Sample'+ STYLE_EXT;
const SAMPLES_SCRIPT_FILE = SAMPLES_PATH+'Sample'+ SCRIPT_EXT;
const SAMPLES_TEMPLATE_FILE = SAMPLES_PATH+'Sample'+ TEMPLATE_EXT;
const SAMPLES_VUE_FILE = SAMPLES_PATH+'Sample'+ VUE_EXT;
const SAMPLES_INDEX_FILE = SAMPLES_PATH+INDEX_FILE;

const AT = "@";
const DOT = ".";
const COMPONENT_PATH = "/components";
const PAGE_PATH = "/pages";
const LAYOUT_PATH = "/layouts";

var name = '';
var pascalName = '';
var kebabName = '';
var dirName = '';
var parentDirPath = '';
var replaceAtPath = '';
var optionalPath;
var isUnderName = false;

var replaceKeyInFile = function(atPath, filesPath, pascalName, kebabName){
  const replace = [REPLACE_FILE_STR, REPLACE_PASCAL_STR, REPLACE_KEBAB_STR, REPLACE_PATH_STR];
  var by = []
  if(isUnderName){
    by = [name, pascalName, kebabName, atPath];
  } else {
    by = [pascalName, pascalName, kebabName, atPath];
  }
  
  console.log('replaceKeyInFile');
  console.log('by : ' + by);
  const options = {
    files: filesPath,
    from: replace,
    to: by,
  };
  replaceInFile.sync(options)
}

var createfiles = function(){
  var files = [];

  if (!fs.existsSync(dirName)){
    console.log('Creating folder %s', dirName);
    fs.mkdirSync(dirName, {recursive: true});
  }

  var stylePath = dirName+'/'+ pascalName + STYLE_EXT
  var scriptPath = dirName+'/'+ pascalName + SCRIPT_EXT
  var templatePath = dirName+'/'+ pascalName + TEMPLATE_EXT
  var vuePath = dirName+'/'+ pascalName + VUE_EXT

  if(isUnderName){
    var stylePath = dirName+'/'+ name + STYLE_EXT
    var scriptPath = dirName+'/'+ name + SCRIPT_EXT
    var templatePath = dirName+'/'+ name + TEMPLATE_EXT
    var vuePath = dirName+'/'+ name + VUE_EXT
  }
  var indexPath = dirName+'/'+ INDEX_FILE;
  
  console.log('Creating style (.scss) file');
  fs.copyFileSync(SAMPLES_STYLE_FILE, stylePath );
  files.push(stylePath);

  console.log('Creating typescript (.ts) file');
  fs.copyFileSync(SAMPLES_SCRIPT_FILE, scriptPath);
  files.push(scriptPath);

  console.log('Creating template (.html) file');
  fs.copyFileSync(SAMPLES_TEMPLATE_FILE, templatePath);
  files.push(templatePath);

  console.log('Creating vue import (.vue) file');
  fs.copyFileSync(SAMPLES_VUE_FILE, vuePath);
  files.push(vuePath);

  if(type !== 'page'){
    console.log('Creating index.ts file');
    fs.copyFileSync(SAMPLES_INDEX_FILE, indexPath);
    files.push(indexPath);
  }

  console.log('replace all default variables');
  replaceKeyInFile(replaceAtPath, files, pascalName, kebabName);

  process.exit(0);
}

var showHelp = function() {
  console.log('create-ntc component|page|layout component-name optional-path');
}

var switchFolder = function(folder){
  switch(folder){
    case 'page':
      console.log('Creating new page %s', name);
      parentDirPath += PAGE_PATH + optionalPath;
      dirName = parentDirPath +'/'+pascalName;
      if(isUnderName){
        dirName = parentDirPath+'/'+name;
        name = 'index';
      } else {
        dirName = parentDirPath +'/'+pascalName;
      }
      replaceAtPath += PAGE_PATH + optionalPath;
      createfiles();
      break;
    case 'layout':
      console.log('Creating new layout %s', name);
      parentDirPath += LAYOUT_PATH + optionalPath;
      dirName = parentDirPath +'/'+pascalName;
      replaceAtPath += LAYOUT_PATH + optionalPath;
      createfiles()
      break;
    default:
      console.log('Creating new component %s', name);
      parentDirPath += COMPONENT_PATH + optionalPath;
      dirName = parentDirPath +'/'+pascalName;
      replaceAtPath += COMPONENT_PATH + optionalPath;
      createfiles();
      break;
  }
}

if(argv._[0] == null){
  showHelp();
} else {
  if(argv._[0] == 'page' || argv._[0] == 'layout' || argv._[0] == 'component'){
    type = argv._[0]
    if(argv._[1]){
      name = argv._[1]
    } else {
      showHelp();
    }
    if(argv._[2]){
      optionalPath = argv._[2]
    } 
  } else {
    type = 'component'
    name = argv._[0]
    if(argv._[1]){
      optionalPath = argv._[1]
    }
  }
  isUnderName = name.startsWith('_')
  if(isUnderName && optionalPath){
      pascalName = pascalcase(optionalPath+ name);
  } else {
    pascalName = pascalcase(name);
  }
  optionalPath = (typeof optionalPath !== 'undefined')? '/'+ optionalPath : ''
  kebabName = kebabCase(pascalName).replace('-','');
  parentDirPath = DOT;
  replaceAtPath = AT;
  switchFolder(type);
}
process.exit(1);