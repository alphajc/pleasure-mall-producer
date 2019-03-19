import { basic } from '../mixins/basic';
import { observe } from '../mixins/observer/index';
function mapKeys(source, target, map) {
    Object.keys(map).forEach(key => {
        if (source[key]) {
            target[map[key]] = source[key];
        }
    });
}
function VantComponent(pmtOptions = {}) {
    const options = {};
    mapKeys(pmtOptions, options, {
        data: 'data',
        props: 'properties',
        mixins: 'behaviors',
        methods: 'methods',
        beforeCreate: 'created',
        created: 'attached',
        mounted: 'ready',
        relations: 'relations',
        destroyed: 'detached',
        classes: 'externalClasses'
    });
    const { relation } = pmtOptions;
    if (relation) {
        options.relations = Object.assign(options.relations || {}, {
            [`../${relation.name}/index`]: relation
        });
    }
    // add default externalClasses
    options.externalClasses = options.externalClasses || [];
    options.externalClasses.push('custom-class');
    // add default behaviors
    options.behaviors = options.behaviors || [];
    options.behaviors.push(basic);
    // map field to form-field behavior
    if (pmtOptions.field) {
        options.behaviors.push('wx://form-field');
    }
    // add default options
    options.options = {
        multipleSlots: true,
        addGlobalClass: true
    };
    observe(pmtOptions, options);
    Component(options);
}
export { VantComponent };
