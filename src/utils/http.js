import axios from 'axios'
import {Message,Loading} from "element-ui";
// export const url = 'http://192.168.1.13:8000'
export const url = 'http://127.0.0.1:8080'
// axios默认环境
axios.defaults.baseURL = url; //开发环境

// 请求拦截器
axios.interceptors.request.use((config) => {
    if (config.url.indexOf('/api/') === -1) {
      if (sessionStorage.getItem('token')) {
        config.headers.Authorization = sessionStorage.getItem('token')
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error);
  })

// 重新获取token
axios.interceptors.response.use(
  response => {
    if (response.data.data && response.data.data.ecode === '401') {
      sessionStorage.removeItem('token');
      Message.warning('无权操作！')
    } else {
      return response;
    }
  }, error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          sessionStorage.removeItem('token');
          Message.warning('无权操作！')
      }
    }
    return Promise.reject(error.response.data)
  }
);

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    let Loadings = Loading.service({
      lock: true,
      text: '加载中...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    axios.get(url, {
      params: params
    })
      .then(res => {
        Loadings.close()
        if(res.data.code===200 || res.data.status === '1'){
          resolve(res.data)
        }else{
          Message.warning(res.data.msg || res.data.info)
        }
      })
      .catch(err => {
        Loadings.close()
        Message.error('服务异常，请稍后重试！')
        reject(err)
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    let Loadings = Loading.service({
      lock: true,
      text: '加载中...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    axios.post(url, data)
      .then(res => {
        Loadings.close()
        if(res.data.code===200){
          resolve(res.data)
        }else{
            resolve(res.data)
          Message.warning(res.data.msg)
        }
      })
      .catch(err => {
        Loadings.close()
        Message.error('服务异常，请稍后重试！')
        reject(err)
      })
  })
}



