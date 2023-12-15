import { setActivePinia, createPinia } from "pinia";
import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import Toolkit from "@/components/ToolKitComponent.vue";

beforeEach(() => {
    setActivePinia(createPinia());
});

describe("Toolkit", () => {
    it("mount component", async () => {
        mount(Toolkit);
    });

    it("contains buttons", async () => {
        const wrapper = mount(Toolkit);
        expect (wrapper.html()).toContain("button");
    });

    it("has cursor button",async () => {
        const wrapper = mount(Toolkit, {
            global: {
                plugins: [createTestingPinia()],
            },
        });

        const cursorButton = wrapper.find("button#cursor");
        cursorButton.trigger("click");
    });

    it("has text button",async () => {
        const wrapper = mount(Toolkit, {
            global: {
                plugins: [createTestingPinia()],
            },
        });

        const textButton = wrapper.find("button#text");
        textButton.trigger("click");
    });

    it("has shapes button", async () => {
        const wrapper = mount(Toolkit, {
            global: {
                plugins: [createTestingPinia()],
            },
        });

        const shapeButton = wrapper.find("button#shapes");
        shapeButton.trigger("click");
    });

    it("has pen button", async () => {
        const wrapper = mount(Toolkit, {
            global: {
                plugins: [createTestingPinia()],
            },
        });

        const penButton = wrapper.find("button#pen");
        penButton.trigger("click");
    });

    it("has delete button", async () => {
        const wrapper = mount(Toolkit, {
            global: {
                plugins: [createTestingPinia()],
            },
        });

        const deleteButton = wrapper.find("button#delete");
        deleteButton.trigger("click");
    });
});
