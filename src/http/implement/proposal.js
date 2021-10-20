import axios from "axios";
import { post } from "../api";

axios.defaults.timeout = 300000;
axios.defaults.withCredentials = true;

//列表
export const getList = data => {
  return post("/file/queryList.do", data);
};
//投保单列表
export const getProposalList = data => {
  return post("/proposal/queryList.do", data);
};
//详情
export const getProposalDetail = data => {
  return post("/proposal/queryDetail.do", data);
};
//上传文件详情
export const getDetail = data => {
  return post("/file/queryDetail.do", data);
};
//编辑
export const edit = data => {
  return post("/proposal/update.do", data);
};
