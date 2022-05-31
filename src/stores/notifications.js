import { defineStore } from "pinia";

export const useNotifications = defineStore("notifications", {
  state: () => {
    return {
      entries: [],
      idIncrement: 1,
      timeouts: [],
    };
  },
  actions: {
    getId() {
      return this.idIncrement++;
    },
    dismiss(dismissId) {
      const index = this.entries.findIndex(
        (notification) => notification.id === dismissId
      );

      if (
        "callback" in this.entries[index] &&
        typeof this.entries[index].callback === "function"
      ) {
        this.entries[index].callback();
      }

      if (typeof this.timeouts[dismissId] !== "undefined") {
        clearTimeout(this.timeouts[dismissId]);
      }

      this.entries.splice(index, 1);
    },
    notify(notification, body = null) {
      if (typeof notification === "string") {
        notification = {
          title: notification,
          body: body,
          sticky: false,
          callback: null,
          icon_color: false,
          icon: false,
          show: true,
        };
      }

      notification.id = this.getId();

      this.entries.push(notification);

      if (!notification.sticky) {
        this.timeouts[notification.id] = setTimeout(
          () => this.dismiss(notification.id),
          3000
        );
      }
    },
  },
});
