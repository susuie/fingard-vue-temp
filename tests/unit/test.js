import { mount } from "@vue/test-utils";
import test from "./example.spec";

const wrapper = mount(test);
const vm = wrapper.vm;
console.log(vm);
