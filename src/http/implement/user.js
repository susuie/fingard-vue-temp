import axios from "axios";
import { post } from "../api";

axios.defaults.timeout = 300000;
axios.defaults.withCredentials = true;

//用户列表
export const getUserList = data => {
  return post("/system/user/queryList.do", data);
};
//新增用户
export const saveUserInfo = data => {
  return post("/system/user/add.do", data);
};
//编辑用户
export const editUser = data => {
  return post("/system/user/edit.do", data);
};
//详情
export const getUserDetail = data => {
  return post("/system/user/queryDetail.do", data);
};
//启用、停用、注销
export const modify = data => {
  return post("/system/user/modifyStatus.do", data);
};
//权限分配
export const perm = data => {
  return post("/system/userRight/allocate.do", data);
};
//重置密码
export const resetPwd = data => {
  return post("/system/user/resetPwd.do", data);
};

//用户角色
export const roleList = data => {
  return post("/system/user/listRoleDrop.pub", data);
};
//获取权限
export const getPerm = data => {
  return post("/system/menuOperation/queryPermissionList.pub", data);
};
