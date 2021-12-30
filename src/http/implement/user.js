import hyRequest from "../index";

//用户列表
export const getUserList = data => {
  return hyRequest.post({ url: "/system/user/queryList.do", data });
};
