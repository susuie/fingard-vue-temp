import hyRequest from "../index";
import localCache from "@/utils/cache";

// get the menu data list
export const getMenuList = data => {
  return hyRequest.post({ url: "/system/menu/queryUserMenu.pub", data });
};
export const loginDo = data => {
  return hyRequest.post({
    url: "/login/verifySms.pub",
    data,
    headers: { token: localCache.getCookie("token") }
  });
};
/*logout */
export const logOut = data => {
  return hyRequest.post({ url: "/login/logout.pub", data });
};
//data dictionary
export const getDataDic = data => {
  return hyRequest.post({ url: "/system/enum/getEnum.pub", data });
};
//perm
export const getPerms = data => {
  return hyRequest.post({
    url: "/system/menuOperation/queryUserPermission.pub",
    data
  });
};
export const getColumns = data => {
  return hyRequest.post({ url: "/tableConfig/getSortedFieldConfig.pub", data });
};
