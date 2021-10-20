import axios from "axios";
import { post, get, postFile } from "../api";

axios.defaults.timeout = 300000;
axios.defaults.withCredentials = true;

/*
 * common api of this system
 */

// get the menu data list
export const getMenuList = data => {
  return post("/system/menu/queryUserMenu.pub", data);
};
/*login by scan dingding code */
export const loginDo = data => {
  return post("/login/login.pub", data);
};
/*logout */
export const logOut = data => {
  return post("/login/logout.pub", data);
};

export const fileDelete = data => {
  return post("/file/deleteFile.pub", data);
};
//文件查询
export const fileQuery = data => {
  return post("/file/queryList.pub", data);
};
//data dictionary
export const getDataDic = data => {
  return post("/system/enum/getEnum.pub", data);
};
//perm
export const getPerms = data => {
  return post("/system/menuOperation/queryUserPermission.pub", data);
};
export const getColumns = data => {
  return post("/tableConfig/getSortedFieldConfig.pub", data);
};
//封装公共导出api
export const exportData = (url, data) => {
  return post(url, data);
};

//个人信息
export const getInfo = data => {
  return post("/system/user/queryPersonInfo.pub", data);
};
export const modifyPwd = data => {
  return post("/system/user/changePwd.pub", data);
};
//获取文件模板
export const getProposalType = data => {
  return get("ocr/proposal/templateList.pub", data);
};
export const getPolicyType = data => {
  return get("ocr/policy/templateList.pub", data);
};
//上传文件
export const proposal = data => {
  data.ispre = true;
  return postFile("ocr/proposal/upload.do", data);
};
export const policy = data => {
  data.ispre = true;
  return postFile("ocr/policy/upload.do", data);
};
