// 引入vue和vuex
import Vue from "vue";
import Vuex from "vuex";
// 使用vuex
Vue.use(Vuex);

// 定义一个仓库来管理状态
let store = new Vuex.Store({
    // 定义状态数据的
    state: {
        User:''
    },
    // 定义改变状态的唯一方法
    mutations: {
        SetUser(state,val){
            state.User = val
        }
    },

});

// 暴露
export default store;

