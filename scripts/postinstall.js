/**
 * Post-install script for IKMI SOCIAL
 * Handles Prisma client generation with proper path resolution for various hosting environments
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the current working directory (application root)
const cwd = process.cwd();
const schemaPath = path.join(cwd, 'prisma', 'schema.prisma');

console.log('Current working directory:', cwd);
console.log('Looking for schema at:', schemaPath);

// Check if schema file exists
if (fs.existsSync(schemaPath)) {
  console.log('✓ Prisma schema found');
  console.log('Generating Prisma client...');
  
  try {
    execSync(`npx prisma generate --schema="${schemaPath}"`, {
      stdio: 'inherit',
      cwd: cwd
    });
    console.log('✓ Prisma client generated successfully');
  } catch (error) {
    console.error('✗ Failed to generate Prisma client');
    console.error(error.message);
    process.exit(1);
  }
} else {
  console.log('✗ Prisma schema not found at:', schemaPath);
  console.log('Skipping Prisma client generation');
  console.log('Please run "npm run db:generate" manually after setup');
}

// Also check for alternative schema locations
const altPaths = [
  path.join(cwd, 'schema.prisma'),
  path.join(cwd, 'prisma', 'schema.prisma'),
];

for (const altPath of altPaths) {
  if (fs.existsSync(altPath)) {
    console.log('Alternative schema location found:', altPath);
  }
}
