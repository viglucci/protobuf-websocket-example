const path = require('path');
const {
    createContainer,
    InjectionMode,
    asClass,
    Lifetime
} = require('awilix');

module.exports = () => {
    const container = createContainer({
        injectionMode: InjectionMode.PROXY
    });

    container.loadModules([
        path.join(__dirname, '../managers/**/*.js'),
    ], {
        formatName: 'camelCase',
        resolverOptions: {
            lifetime: Lifetime.SINGLETON,
            register: asClass
        }
    });

    container.loadModules([
        path.join(__dirname, '../controllers/**/*.js'),
    ], {
        resolverOptions: {
            lifetime: Lifetime.SINGLETON,
            register: asClass
        }
    });

    return container;
};
