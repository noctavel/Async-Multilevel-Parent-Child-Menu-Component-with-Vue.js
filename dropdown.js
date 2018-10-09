const list = [{ "parent_id": null, "id":1, "name": "child1" }, { "parent_id": 1, "id":2, "name": "subchild1" }, { "parent_id": 1, "id":2, "name": "subchild2" }, { "parent_id": 2, "id":5, "name": "sub_subchild2" }];

document.addEventListener("mouseover", function (ev) {
    if (ev.target.matches("a")) {
      let a = $(ev.target);
      let ul = a.next('ul');
      if (ul.children().length == 0) ul.hide();
      else ul.toggle();
      ev.preventDefault();
      ev.stopPropagation();
    }
});

Vue.component('item', {
    props: ['model', 'api'],
    data: function () {
        return { children: [], loading: false}
    },
    created: async function () {
        if (!this.model) this.model = await this.getChildren(null);
    },
    template: `<li class="dropdown-submenu" >
                  <a class="dropper" v-on:mouseover="getChildren(model.id)" tabindex="-1" href="#"> {{model.name}} </a>
                  <ul v-if="children" class="dropdown-menu">
                      <item v-if="children.length > 0 " v-for="(child,index) in children" :key="index" :model="child"></item>
                      <div v-if="loading" class="text-center"><i class="fa fa-spin fa-spinner "></i></div>
                  </ul>
              </li>`,
    watch: {
        children: function () {
            this.model.children = this.children;
        }
    },
    methods: {
        getChildren: async function (id) {
          if (this.children && this.children.length == 0) {
              this.loading = true;
              if (this.api) {
                  this.children = await $.get(this.api, { ID: id });
                  if (this.children.length == 0) this.children = undefined;
                  this.loading = false;
              }
              else { //just for testing
                  setTimeout(() => {
                      this.children = list.filter(child => child.parent_id == id);
                      if (this.children.length == 0) this.children = undefined;
                      this.loading = false;
                  }, 500);
              }
          }
      }
    },
});
new Vue({
  el:".container",
});
