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

const clearDistFolder = () => {
  const distPath = path.resolve(config.outputDir);
  console.log('🧹 Clearing dist folder before build...');
  fs.emptyDirSync(distPath);
};

// ----------------------
// Babel Transpile
// ----------------------
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

// ----------------------
// Copy sqlite3 only
// ----------------------
const copySqlite3Modules = () => {
  const sourceDir = path.resolve('node_modules/sqlite3');
  const destDir = path.resolve(`dist/${config.outputDirName}/node_modules/sqlite3`);

  if (!fs.existsSync(sourceDir)) {
    console.log('⚠️ sqlite3 not found in node_modules.');
    return;
  }

  console.log('📂 Copying node_modules/sqlite3 to the final destination...');
  fs.ensureDirSync(destDir);
  fs.copySync(sourceDir, destDir);
};

// ----------------------
// Nexe package
// ----------------------
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
    build: true,
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

// ----------------------
// Build main
// ----------------------
const buildApp = async () => {
  console.log('🎯 Build Information:');
  console.log(`   - Dist Directory: ${config.outputDirName}`);
  console.log(`   - Output Directory: ${config.outputDir}`);
  console.log(`   - Server Directory: ${config.babelSourceDir}`);
  console.log(`   - Proxy Directory: ${config.babelSourceDir2}`);
  console.log(`   - API Directory: ${config.babelSourceDir3}`);

  clearDistFolder();
  transpileWithBabel();
  await packageWithNexe();

  // Copy sqlite3 after building
  copySqlite3Modules();

  console.log('🚀 Build completed successfully!');
};

buildApp();
