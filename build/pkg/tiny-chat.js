const { execSync } = require('child_process');
const path = require('path');
const { compile } = require('nexe');
const fs = require('fs-extra');

const config = {
  outputDir: 'dist',
  outputDirName: 'Tiny-RP-Chat',
  nodeModulesDir: 'node_modules',
  babelSourceDir: 'src/server',
  babelSourceDir2: 'src/proxy',
  babelSourceDir3: 'src/api',
};

// Run Babel
const transpileWithBabel = () => {
  console.log('🔨 Transpiling code with Babel...');
  execSync(
    `npx babel ${config.babelSourceDir} --out-dir ${config.outputDir}/${config.babelSourceDir} --copy-files`,
  );
  execSync(
    `npx babel ${config.babelSourceDir2} --out-dir ${config.outputDir}/${config.babelSourceDir2} --copy-files`,
  );
  execSync(
    `npx babel ${config.babelSourceDir3} --out-dir ${config.outputDir}/${config.babelSourceDir3} --copy-files`,
  );
};

// Package with Nexe
const packageWithNexe = async () => {
  console.log(`📦 Packaging with nexe...`);
  const rootFolder = path.join(__dirname, '../../');

  const cfgBase = {
    name: 'Tiny Roleplay Server Chat',
    rc: {
      CompanyName: 'JasminDreasond',
      ProductName: 'Tiny Roleplay Server Chat',
      FileDescription: 'Lightweight server for roleplay/RPG chat rooms.',
      OriginalFilename: 'tiny-chat.exe',
      InternalName: 'tiny-chat',
      LegalCopyright: 'GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007',
    },
    build: true, //required to use patches
  };

  await compile({
    resources: [path.join(rootFolder, './dist/src/server/config.ini')],
    input: path.join(rootFolder, './dist/src/server/index.js'),
    output: path.join(rootFolder, `./dist/${config.outputDirName}/tiny-chat`),
    ...cfgBase,
  });

  await compile({
    resources: [path.join(rootFolder, './dist/src/proxy/config.ini')],
    input: path.join(rootFolder, './dist/src/proxy/index.js'),
    output: path.join(rootFolder, `./dist/${config.outputDirName}/tiny-chat-proxy`),
    ...cfgBase,
  });
};

// Main build
const buildApp = async () => {
  console.log('🎯 Build Information:');
  console.log(`   - Dist Directory: ${config.outputDirName}`);
  console.log(`   - Output Directory: ${config.outputDir}`);
  console.log(`   - Server Directory: ${config.babelSourceDir}`);
  console.log(`   - Proxy Directory: ${config.babelSourceDir2}`);
  console.log(`   - API Directory: ${config.babelSourceDir3}`);

  transpileWithBabel();
  await packageWithNexe();

  console.log('🚀 Build completed successfully!');
};

buildApp();
