//生成唯一标识符uuid
export const getuuid = function() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
};
function change(t) {
  if (t < 10) {
    return "0" + t;
  } else {
    return t;
  }
}
export const formatDate = function(date, type) {
  let year = date.getFullYear();
  let month = change(date.getMonth() + 1);
  let day = change(date.getDate());
  let hour = change(date.getHours());
  let minute = change(date.getMinutes());
  let second = change(date.getSeconds());
  if (type.toLowerCase() === "yyyy-mm-dd hh:mm:ss") {
    return (
      year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
    );
  } else if (type.toLowerCase() === "yyyy-mm-dd") {
    return year + "-" + month + "-" + day;
  }
};
//默认一年后结束
export const getEndDate = function(date) {
  if (date.getDate() > 1)
    return (
      date.getFullYear() +
      1 +
      "-" +
      change(date.getMonth() + 1) +
      "-" +
      change(date.getDate() - 1)
    );
  else if (date.getMonth() + 1 > 1) {
    var finalDate = "";
    switch (date.getMonth()) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        finalDate =
          date.getFullYear() + 1 + "-" + change(date.getMonth()) + "-" + 31;
        break;
      case 4:
      case 6:
      case 9:
      case 11:
        finalDate =
          date.getFullYear() + 1 + "-" + change(date.getMonth()) + "-" + 30;
        break;
      case 2:
        if (
          ((date.getFullYear() + 1) % 100 === 0 &&
            (date.getFullYear() + 1) % 400 === 0) ||
          ((date.getFullYear() + 1) % 100 !== 0 &&
            (date.getFullYear() + 1) % 4 === 0)
        )
          finalDate =
            date.getFullYear() + 1 + "-" + change(date.getMonth()) + "-" + 29;
        else
          finalDate =
            date.getFullYear() + 1 + "-" + change(date.getMonth()) + "-" + 28;
    }
    return finalDate;
  } else if (date.getMonth() + 1 === 1)
    return date.getFullYear() + "-" + 12 + "-" + 31;
};
//格式化hh:mm:ss
export const getStartDate = function(date, type) {
  if (date.split(" ").length > 1) {
    return date;
  } else {
    return type === "start" ? date + " 00:00:00" : date + " 23:59:59";
  }
};

//文件转换成base64格式
export const getBase64 = function(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    let fileResult = "";
    reader.readAsDataURL(file);
    reader.onload = function() {
      fileResult = reader.result;
    };
    reader.onerror = function(error) {
      reject(error);
    };
    reader.onloadend = function() {
      resolve(fileResult);
    };
  });
};
//字符串base64加密
export const base64encode = str => {
  let base64EncodeChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var out, i, len;
  var c1, c2, c3;
  len = str.length;
  i = 0;
  out = "";
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i === len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt((c1 & 0x3) << 4);
      out += "==";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i === len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
      out += base64EncodeChars.charAt((c2 & 0xf) << 2);
      out += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    out += base64EncodeChars.charAt(c1 >> 2);
    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
    out += base64EncodeChars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
    out += base64EncodeChars.charAt(c3 & 0x3f);
  }
  return out;
};

//json数组字符串字段排序
export const sort = function(objArr, keyArr, type) {
  let arr = objArr.sort(function(objA, objB) {
    for (let i = 0; i < keyArr.length; i++) {
      var key = keyArr[i];
      if (objA[key] === objB[key]) {
        continue;
      }
      if (type === "desc") {
        return objB[key].localeCompare(objA[key]);
      } else {
        return objA[key].localeCompare(objB[key]);
      }
    }
  });
  return arr;
};
//金额格式化
export const formatAmount = function(amount) {
  amount = parseFloat(amount).toFixed(2) / 100 + "";
  let parts = amount.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  parts[1] = parts[1]
    ? parts[1].length < 2
      ? parts[1] + "0"
      : parts[1]
    : "00";
  return parts.join(".");
};
export const formatRate = function(rate) {
  if (rate.split(".")[1]) {
    return rate.split(".")[1].length < 4 && !!parseFloat(rate)
      ? parseFloat(rate).toFixed(4) + ""
      : rate;
  } else {
    return !!parseFloat(rate) ? parseFloat(rate).toFixed(4) + "" : rate;
  }
};
export const getTitle = function(menuList) {
  let title = {};
  const deepGet = node => {
    for (let i = 0; i < node.length; i++) {
      title[node[i].url] = node[i].title;
      if (node[i].childrenNode) {
        deepGet(node[i].childrenNode);
      }
    }
  };
  deepGet(menuList);
  return title;
};
//横杆转驼峰
export const camelize = function(str) {
  return str.replace(/-(\w)/g, function(_, c) {
    return c ? c.toUpperCase() : "";
  });
};
//首字母转大写
export const ftoup = function(str) {
  return str.replace(/\b(\w)|\s(\w)/g, function(c) {
    return c.toUpperCase();
  });
};
