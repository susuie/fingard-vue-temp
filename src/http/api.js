import axios from "axios";
import { Message, Loading } from "element-ui";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "/api/insurance";
let loading = null,
  isLoading = 0;
function http(config) {
  return new Promise((resolve, reject) => {
    axios(config)
      .then(response => {
        if (isLoading) {
          isLoading--;
        }
        if (!isLoading) {
          loading.close();
        }
        if (response.data.code) {
          if (response.data.code !== "0") {
            if (response.data.code === "3") {
              // under login
              localStorage.setItem("userInfo", "");
              window.location.href = "/Login";
            } else {
              if (response.config.headers.ispre) {
                resolve(response.data);
              }
              Message({
                message: response.data.info,
                type: "error",
                showClose: true,
                dangerouslyUseHTMLString: true,
                duration: 5000
              });
            }
          } else {
            resolve(response.data);
          }
        }
      })
      .catch(err => {
        if (isLoading) {
          isLoading--;
        }
        if (!isLoading) {
          loading.close();
        }
        Message({
          message: "网络请求发生错误！",
          type: "error",
          showClose: true
        });
        reject(err);
      });
  });
}

/**
 *
 * @param url request url
 * @param params request params
 * @returns {Promise}
 */
export function fetch(url, params = {}) {
  return http({
    method: "POST",
    url: url,
    params: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
      //platform: "PC"
    }
  });
}
export function getT(url, data = {}) {
  const config = {
    method: "POST",
    url: url,
    data: data
  };
  return new Promise((resolve, reject) => {
    axios(config)
      .then(response => {
        if (!response.data.error) {
          resolve(response.data);
        } else {
          Message({ message: "获取失败！", showClose: true });
        }
      })
      .catch(err => {
        Message({ message: "网络请求发生错误！", showClose: true });
        reject(err);
      });
  });
}
/**
 * post
 * @param url request url
 * @param data request params
 * @returns {Promise}
 */
export function post(url, data = {}) {
  data.channelSource = "10";
  data.platform = "07";
  let token = window.$cookies.get("token");
  loading = Loading.service({
    lock: true,
    text: "正在处理中，请稍后...",
    spinner: "el-icon-loading",
    background: "rgba(0, 0, 0, 0.7)"
  });
  isLoading++;
  return http({
    method: "POST",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      token: token,
      channelSource: "10",
      ispre: data.ispre ? true : false
    },
    withCredentials: true
  });
}
export function postFile(url, data) {
  return http({
    method: "POST",
    url: url,
    data: data.file,
    onUploadProgress: event => {
      let num = ((event.loaded / event.total) * 100 - 1) | 0;
      data.param.onProgress({ percent: num });
    },
    headers: {
      "Content-Type": "multipart/form-data",
      fileMatchOcrTemplateIdType: data.type,
      ispre: true
    },
    withCredentials: true
  });
}
export function jsonPost(url, data = {}) {
  return http({
    method: "POST",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
export function filePost(url, data = {}) {
  return http({
    method: "POST",
    url: url,
    data: data,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}
/**
 * ORC识别
 * @param url request url
 * @param data request params
 * @returns {Promise}
 */

export function orc(url, data = {}) {
  const config = {
    method: "POST",
    url: url,
    data:
      "id_card_side=" +
      data.side +
      "&image=" +
      encodeURIComponent(data.image.split(",")[1]),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  return new Promise((resolve, reject) => {
    axios(config)
      .then(response => {
        if (!response.data.error_code) {
          resolve(response.data);
        } else {
          Message({ message: "图片解析失败！", showClose: true });
        }
      })
      .catch(err => {
        Message({ message: "网络请求发生错误！", showClose: true });
        reject(err);
      });
  });
}
/**
 * get
 * @param url request url
 * @param data request params
 * @returns {Promise}
 */

export function get(url, data = {}) {
  url += "?";
  for (let key in data) {
    url += `${key}=${data[key]}&`;
  }
  let token = window.$cookies.get("token");
  return http({
    method: "GET",
    url: url,
    headers: {
      "Content-Type": "application/json",
      platform: "PC",
      token: token,
      channelSource: "10"
    }
  });
}

/**
 * put
 * @param url request url
 * @param data request params
 * @returns {Promise}
 */

export function put(url, data = {}) {
  return http({
    method: "PUT",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      platform: "PC"
    }
  });
}
