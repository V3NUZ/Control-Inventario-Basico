const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build para aplicación de escritorio...');

try {
  // 1. Build de Next.js
  console.log('📦 Build de Next.js...');
  execSync('npm run build', { stdio: 'inherit' });

  // 2. Copiar archivos necesarios al directorio .next
  console.log('📋 Copiando archivos necesarios...');
  
  const nextDir = path.join(__dirname, '.next');
  const outDir = path.join(__dirname, 'electron-app');

  // Crear directorio de salida
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Copiar archivos estáticos
  if (fs.existsSync(path.join(nextDir, 'static'))) {
    execSync(`cp -r "${path.join(nextDir, 'static')}" "${outDir}/"`, { stdio: 'inherit' });
  }

  // Copiar archivos de servidor
  fs.copyFileSync('public/electron.js', path.join(outDir, 'electron.js'));
  fs.copyFileSync('public/preload.js', path.join(outDir, 'preload.js'));
  fs.copyFileSync('public/server.js', path.join(outDir, 'server.js'));
  fs.copyFileSync('public/inventory-logo.png', path.join(outDir, 'inventory-logo.png'));

  // Copiar package.json (versión simplificada)
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const electronPackageJson = {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    main: 'electron.js',
    dependencies: {
      'express': packageJson.dependencies.express,
      '@prisma/client': packageJson.dependencies['@prisma/client']
    }
  };
  
  fs.writeFileSync(
    path.join(outDir, 'package.json'),
    JSON.stringify(electronPackageJson, null, 2)
  );

  // Copiar archivos de Prisma
  console.log('🗄️ Configurando Prisma...');
  const prismaDir = path.join(outDir, 'prisma');
  if (!fs.existsSync(prismaDir)) {
    fs.mkdirSync(prismaDir, { recursive: true });
  }
  
  if (fs.existsSync('prisma/schema.prisma')) {
    fs.copyFileSync(
      'prisma/schema.prisma',
      path.join(prismaDir, 'schema.prisma')
    );
  }

  // Crear directorio de base de datos
  const dbDir = path.join(outDir, 'db');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Generar Prisma Client
  console.log('🔧 Generando Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Copiar node_modules necesarios
  console.log('📦 Copiando dependencias...');
  if (fs.existsSync('node_modules/@prisma')) {
    execSync(`cp -r node_modules/@prisma "${outDir}/node_modules/"`, { stdio: 'inherit' });
  }
  if (fs.existsSync('node_modules/.prisma')) {
    execSync(`cp -r node_modules/.prisma "${outDir}/node_modules/"`, { stdio: 'inherit' });
  }

  console.log('✅ Build completado exitosamente!');
  console.log('📂 Los archivos están en el directorio "electron-app"');
  console.log('🎯 Ahora puedes ejecutar: npm run electron-pack');
  
} catch (error) {
  console.error('❌ Error durante el build:', error.message);
  process.exit(1);
}