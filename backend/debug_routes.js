const app = require('./src/app');

function printRoutes(stack, prefix = '') {
  stack.forEach(layer => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase()).join(',');
      console.log(`${methods} ${prefix}${layer.route.path}`);
    } else if (layer.name === 'router' && layer.handle.stack) {
      const routerPrefix = layer.regexp.toString()
        .replace('/^\\', '')
        .replace('\\/?(?=\\/|$)/i', '')
        .replace('\\/', '/');
      console.log(`--- Entering Router: ${routerPrefix} ---`);
      printRoutes(layer.handle.stack, prefix + routerPrefix);
    }
  });
}

console.log('--- Registering Route Audit ---');
printRoutes(app._router.stack);
process.exit(0);
