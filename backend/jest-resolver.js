// jest-resolver.js
const path = require('path');
const fs = require('fs');

/**
 * Custom resolver for Jest
 * This handles the mapping of import paths to actual file paths
 */
module.exports = (request, options) => {
  // Handle both relative and absolute paths
  if (request.startsWith('@/') || request.startsWith('src/')) {
    request = request.replace(/^(@\/|src\/)/, '');
    const resolvedPath = path.join(options.rootDir, 'src', request);
    if (fs.existsSync(resolvedPath)) {
      return resolvedPath;
    }
    if (fs.existsSync(`${resolvedPath}.js`)) {
      return `${resolvedPath}.js`;
    }
  }
  
  // Handle relative imports with .js extension in source files
  if (/^\.\.?\/.*\.js$/.test(request)) {
    const withoutExt = request.replace(/\.js$/, '');
    const basedir = options.basedir || options.rootDir;
    
    const possiblePaths = [
      path.join(basedir, withoutExt),
      path.join(basedir, request),
    ];
    
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        return possiblePath;
      }
    }
  }
  
  // Handle the case for socket/handlers/gameHandlers.js
  if (request.includes('socket/handlers')) {
    const basedir = options.basedir || options.rootDir;
    const possiblePaths = [
      path.join(options.rootDir, 'src', request),
      path.join(basedir, request),
      path.join(basedir, `${request}.js`)
    ];
    
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        return possiblePath;
      }
    }
  }

  // Default behavior - use Node's require.resolve to find the module
  return require.resolve(request, {
    ...options,
    paths: [
      ...(options.paths || []),
      options.basedir || options.rootDir,
      path.join(options.rootDir, 'node_modules'),
      ...module.paths
    ]
  });
};