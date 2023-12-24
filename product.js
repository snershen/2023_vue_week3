import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const api_baseUrl = "https://vue3-course-api.hexschool.io/";
const api_path = "escaperoom";
const token = document.cookie.replace(/(?:(?:^|.*;\s*)escaperoom\s*=\s*([^;]*).*$)|^.*$/, "$1");

axios.defaults.headers.common["Authorization"] = token;
// const config = {
//   headers: { Authorization: token },
// };

const app = {
  data() {
    return {
      productList: [],
      productModal: {},
      deleteModal: {},
      tempProduct: {},
      isNew: false,
    };
  },
  methods: {
    openModal(isNew, item) {
      this.productModal.show();
      this.isNew = isNew;
      if (this.isNew) {
        this.tempProduct = {};
        return;
      }
      if (!this.isNew) {
        this.tempProduct = { ...item };
      }
    },
    updateProduct() {
      let url = `${api_baseUrl}v2/api/${api_path}/admin/product`;
      if (this.isNew) {
        axios.post(url, { data: this.tempProduct }).then((res) => {
          this.getProducts();
          alert("產品新增成功");
        });
        this.productModal.hide();
        return;
      }
      url = `${api_baseUrl}v2/api/${api_path}/admin/product/${this.tempProduct.id}`;
      axios.put(url, { data: this.tempProduct }).then((res) => {
        this.getProducts();
        alert("產品更新成功");
      });
      this.productModal.hide();
    },
    deleteProduct(product) {
      this.tempProduct = product;
      this.deleteModal.show();
    },
    confirmDelete() {
      const url = `${api_baseUrl}v2/api/${api_path}/admin/product/${this.tempProduct.id}`;
      axios.delete(url).then((res) => {
        console.log(res);
        this.getProducts();
        this.deleteModal.hide();
      });
    },
    getProducts() {
      const url = `${api_baseUrl}v2/api/${api_path}/admin/products`;
      axios
        .get(url)
        .then((res) => {
          console.log(res);
          this.productList = res.data.products;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    checkLogin() {
      const url = "https://vue3-course-api.hexschool.io/v2/api/user/check";
      axios
        .post(url)
        .then((res) => {
          this.getProducts();
        })
        .catch((err) => {
          console.log(err);
          alert("驗證失敗");
          window.location = "login.html";
        });
    },
    createImages() {
      if (!this.tempProduct.imagesUrl) {
        this.tempProduct.imagesUrl = [];
        this.tempProduct.imagesUrl.push("");
        return;
      }
      this.tempProduct.imagesUrl.push("");
    },
  },
  created() {
    this.checkLogin();
  },
  mounted() {
    // this.productModal = new bootstrap.Modal(document.querySelector("#myModal"));
    this.productModal = new bootstrap.Modal(this.$refs.productModal, {
      keyboard: false,
    });
    this.deleteModal = new bootstrap.Modal(this.$refs.delProductModal, {
      keyboard: false,
    });
    this.getProducts();
  },
};

createApp(app).mount("#app");
