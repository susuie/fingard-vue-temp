import axios from "axios";
import { post } from "../api";

axios.defaults.timeout = 300000;
axios.defaults.withCredentials = true;

//组织列表
export const getOrgList = data => {
  return post("/system/group/queryList.do", data);
};

//组织结构
export const getOrgGroup = data => {
  return post("/system/group/queryAllGroupTree.do", data);
};
//新增
export const add = data => {
  return post("/system/group/add.do", data);
};
//编辑
export const edit = data => {
  return post("/system/group/edit.do", data);
};
//详情
export const detail = data => {
  return post("/system/group/queryDetail.do", data);
};
//删除
export const deleteOrg = data => {
  return post("/system/group/deleteGroups.do", data);
};
