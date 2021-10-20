import RTable from "./r-table.vue";
import Query from "./query-conditions.vue";
import Upload from "./upload.vue";
import Tree from "./Tree.vue";
import PButton from "./p-button.vue";
import Tag from "./tag";
export { RTable, Query, Upload, Tree, PButton, Tag };

/*eslint-disable*/
let componentList = [
    'RTable',
    'Query',
    'Upload' ,
    'Tree',
    'PButton',
    'Tag'
]

export default {
    RTable,Query,Upload,Tree,PButton,Tag,
    install(Vue) {
        componentList.forEach(item => {
            Vue.component(item, this[item]);           
        });
    }
};
