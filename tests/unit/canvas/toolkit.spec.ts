import { setActivePinia, createPinia } from 'pinia'
import { mount } from "@vue/test-utils";
import { createTestingPinia } from '@pinia/testing';

import Toolkit from "@/components/ToolKitComponent.vue";
import { useCanvasStateStore } from '@/store';
import { Tools, Shapes } from '@/store/public_interfaces';

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("Toolkit", () => {
  it("mount component", async () => {
    const wrapper = mount(Toolkit);
  });

  it("contains buttons", async () => {
    const wrapper = mount(Toolkit);
    expect (wrapper.html()).toContain("button");
  });

  it("selects cursor",async () => {
    const wrapper = mount(Toolkit, {
      global: {
        plugins: [createTestingPinia()],
      },
    });
    const cursorButton = wrapper.find("button#cursor");
    cursorButton.trigger("click");
    const canvasStore = useCanvasStateStore();
    expect(canvasStore.selectedTool).toBe(Tools.Cursor);
  });

  it("selects text",async () => {
    const wrapper = mount(Toolkit, {
      global: {
        plugins: [createTestingPinia()],
      },
    });
    const textButton = wrapper.find("button#text");
    textButton.trigger("click");
    const canvasStore = useCanvasStateStore();
    expect(canvasStore.selectedTool).toBe(Tools.Text);
  });

  it("selects shapes", async () => {
    const wrapper = mount(Toolkit, {
      global: {
        plugins: [createTestingPinia()],
      },
    });
    const shapeButton = wrapper.find("button#shapes");
    shapeButton.trigger("click");
    const canvasStore = useCanvasStateStore();
    expect(canvasStore.selectedTool).toBe(Tools.Shapes);
  });

  it("selects pen", async () => {
    const wrapper = mount(Toolkit, {
      global: {
        plugins: [createTestingPinia()],
      },
    })
    const penButton = wrapper.find("button#pen");
    penButton.trigger("click");
    const canvasStore = useCanvasStateStore();
    expect(canvasStore.selectedTool).toBe(Tools.Pen);
  });

  it("selects eraser", async () => {
    const wrapper = mount(Toolkit, {
      global: {
        plugins: [createTestingPinia()],
      },
    })
    const eraserButton = wrapper.find("button#eraser");
    eraserButton.trigger("click");
    const canvasStore = useCanvasStateStore();
    expect(canvasStore.selectedTool).toBe(Tools.Eraser);
  });
});
