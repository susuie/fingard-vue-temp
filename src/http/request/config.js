let BASE_URL = "";
const TIME_OUT = 10000;

if (process.env.NODE_ENV === "development") {
  BASE_URL = "/api/installment";
} else if (process.env.NODE_ENV === "production") {
  BASE_URL = "http://rbt.fingard.cn";
} else {
  BASE_URL = "http://rbttest.fingard.cn";
}

export { BASE_URL, TIME_OUT };
