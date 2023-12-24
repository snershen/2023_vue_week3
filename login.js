import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const baseUrl = "https://vue3-course-api.hexschool.io/v2";

const app = {
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      const url = `${baseUrl}/admin/signin`;
      axios
        .post(url, this.user)
        .then((res) => {
          if (res.data.success) {
            const { token, expired } = res.data;
            document.cookie = `escaperoom=${token}; expires=${new Date(expired)}; path=/`;
            window.location = "product.html";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};

createApp(app).mount("#app");
