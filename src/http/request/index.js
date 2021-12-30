import axios from "axios";
import { Message, Loading } from "element-ui";

const DEAFULT_LOADING = true;

class HYRequest {
  constructor(config) {
    // 创建axios实例
    this.instance = axios.create(config);
    // 保存基本信息
    this.showLoading = config.showLoading ?? DEAFULT_LOADING;
    this.interceptors = config.interceptors;
    // 使用拦截器
    // 1.从config中取出的拦截器是对应的实例的拦截器
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    );
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    );
    // 2.添加所有的实例都有的拦截器
    this.instance.interceptors.request.use(
      config => {
        if (this.showLoading) {
          this.loading = Loading.service({
            lock: true,
            text: "正在请求数据....",
            background: "rgba(0, 0, 0, 0.5)"
          });
        }
        return config;
      },
      err => {
        return err;
      }
    );
    this.instance.interceptors.response.use(
      res => {
        // 将loading移除
        this.loading?.close();

        const data = res.data;
        if (data.code !== "0") {
          if (data.code === "3") {
            // under login
            localStorage.setItem("userInfo", "");
            window.location.href = "/Login";
          } else {
            Message({
              message: data.info,
              type: "error",
              showClose: true,
              dangerouslyUseHTMLString: true,
              duration: 5000
            });
          }
        } else {
          return data;
        }
      },
      err => {
        // 将loading移除
        this.loading?.close();

        // 例子: 判断不同的HttpErrorCode显示不同的错误信息
        if (err.response.status === 404) {
          console.log("404的错误~");
        }
        return err;
      }
    );
  }

  request(config) {
    return new Promise((resolve, reject) => {
      // 1.单个请求对请求config的处理
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config);
      }
      // 2.判断是否需要显示loading
      if (config.showLoading === false) {
        this.showLoading = config.showLoading;
      }

      this.instance
        .request(config)
        .then(res => {
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res);
          }
          this.showLoading = DEAFULT_LOADING;
          resolve(res);
        })
        .catch(err => {
          // 将showLoading设置true, 这样不会影响下一个请求
          this.showLoading = DEAFULT_LOADING;
          Message({
            message: "网络请求发生错误！",
            type: "error",
            showClose: true
          });
          reject(err);
          return err;
        });
    });
  }

  get(config) {
    return this.request({ ...config, method: "GET" });
  }

  post(config) {
    return this.request({ ...config, method: "POST" });
  }

  delete(config) {
    return this.request({ ...config, method: "DELETE" });
  }

  patch(config) {
    return this.request({ ...config, method: "PATCH" });
  }
}

export default HYRequest;
