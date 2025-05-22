export class Toast {
  public type: "success" | "error";
  public message: string;
  public show = false;

  constructor(type: "success" | "error", message: string) {
    this.type = type;
    this.message = message;
  }
}

export const useGlobalStore = defineStore("globalStore", () => {
  const activeToasts = ref<Toast[]>([]);

  return { activeToasts };
});
