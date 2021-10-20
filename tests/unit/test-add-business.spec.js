import { mount, createLocalVue } from "@vue/test-utils";
import Vue from "vue";
const localVue = createLocalVue();
import ElementUI from "element-ui";
localVue.use(ElementUI);
import addBusiness from "@/views/businessManage/addBusiness.vue";

// 测试表单参数
describe("Test Form Parameter", () => {
  it("测试上传没有urid", () => {
    let wrapper = mount(addBusiness, {
      data: {
        searchData: {}
      },
      localVue
    });
    wrapper.find(".confirm").trigger("click");
    return Vue.nextTick().then(function() {
      expect(wrapper.findAll(".el-form-item__error").length).toBe(2);
    });
  });
  it("测试没有活动形式", () => {
    let wrapper = mount(addBusiness, {
      stubs: {
        transition: false
      },
      localVue,
      propsData: {
        initFormData: {
          name: "一起团建",
          type: ["地推活动"],
          desc: ""
        }
      }
    });
    wrapper.find(".confirm").trigger("click");
    return Vue.nextTick().then(function() {
      expect(wrapper.findAll(".el-form-item__error").length).toBe(1);
    });
  });
  it("测试没有活动形式, 并触发重置按钮", () => {
    let wrapper = mount(addBusiness, {
      stubs: {
        transition: false
      },
      localVue,
      propsData: {
        initFormData: {
          name: "一起团建",
          type: ["地推活动"],
          desc: ""
        }
      }
    });
    wrapper.find(".confirm").trigger("click");
    // 2秒后点击重置按钮
    setTimeout(() => {
      wrapper.find(".reset").trigger("click");
      return Vue.nextTick().then(function() {
        expect(wrapper.findAll(".el-form-item__error").length).toBe(0);
      });
    }, 2000);
  });
});
