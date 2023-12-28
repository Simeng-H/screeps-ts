const subclassRegistry = new Map<string, Map<string, any>>();

export function RegisterAsSubclass<BaseClass>(baseClass: new (...args: any[]) => BaseClass) {
    return function <SubClassCtor extends new (...args: any[]) => BaseClass>(constructor: SubClassCtor) {
        const baseClassRegistry = subclassRegistry.get(baseClass.name) || new Map<string, SubClassCtor>();
        baseClassRegistry.set(constructor.name, constructor);
        subclassRegistry.set(baseClass.name, baseClassRegistry);
    }
}

export function getSubClasses(baseClass: string): Map<string, any> {
    return subclassRegistry.get(baseClass) || new Map<string, any>();
}
