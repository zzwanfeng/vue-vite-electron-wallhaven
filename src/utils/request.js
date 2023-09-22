import { ElMessage } from 'element-plus'


const isLogin = (url) => {
  return new Promise((resolve, reject) => {
    const baseURL = "https://acgn.zzhvv.com/serviceAcgn/novel/getWallpaperIsLogin";

    const xhr = new XMLHttpRequest();
    xhr.open('GET', baseURL);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200 || xhr.status === 304) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (error) {
          resolve(xhr.responseText);
        }
      } else {
        reject(new Error(xhr.responseText));
      }
    }
    xhr.send();
  })
}


const ajax = (url) => {
  return new Promise(async (resolve, reject) => {
    let loginState = await isLogin()
    if (!loginState || +loginState.code !== 0 || !loginState.data.isLogin) {
      ElMessage({
        message: loginState.data.remark || '服务维护中~~~',
        type: 'error',
        duration: 2000,
      })
      return
    }

    const baseURL = process.env.NODE_ENV === 'production' ? "https://wallhaven.cc/api/v1/" : "https://wallhaven.cc/api/v1/";

    const xhr = new XMLHttpRequest();
    xhr.open('GET', baseURL + url);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200 || xhr.status === 304) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (error) {
          resolve(xhr.responseText);
        }
      } else {
        reject(new Error(xhr.responseText));
      }
    }
    xhr.send();
  })
}

/**
 * 获取图片数据
 * @param {*} url 文件地址
 * @param {*} timeout 超时时间
 */
export const getImgBlod = (url, timeout = 60000) => {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";

    let timedout = false;
    let timer = setTimeout(function () {
      timedout = true;
      xhr.abort();
      reject('连接超时！！！')
    }, timeout);


    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (timedout) { return; }
      clearTimeout(timer);
      if (xhr.status === 200 || xhr.status === 304) {
        try {
          let blob = this.response;
          resolve(window.URL.createObjectURL(blob));
        }
        catch (error) {
          reject(xhr.responseText);
        }
      } else {
        reject(new Error(xhr.responseText));
      }
    };
    xhr.send();
  })
}

export default ajax;