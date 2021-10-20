import axios from "axios";
import { post } from "../api";

axios.defaults.timeout = 300000;
axios.defaults.withCredentials = true;

export const getList = data => {
  return post("/file/queryList.do", data);
};
export const getPolicyList = data => {
  return post("/policy/queryList.do", data);
};
export const edit = data => {
  return post("/policy/update.do", data);
};
export const getDetail = data => {
  return post("/file/queryDetail.do", data);
};
export const getPolicyDetail = data => {
  return post("/policy/queryDetail.do", data);
};
