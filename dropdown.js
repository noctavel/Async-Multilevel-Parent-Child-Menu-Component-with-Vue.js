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
    data() { return { children: []}},
    async created () {
        if (!this.model) this.model = await this.getChildren(null);
    },
    template: `<li class="dropdown-submenu" >
                  <a class="dropper" v-on:mouseover="getChildren(model)" tabindex="-1" href="#"> {{model.name}} </a>
                  <ul v-if="children" class="dropdown-menu">
                      <item v-if="children.length > 0 " v-for="child in children" :key="child.id" :model="child"></item>
                      <div v-if="children.length == 0" class="text-center"><i class="fa fa-spin fa-spinner "></i></div>
                  </ul>
              </li>`,
    watch: {
        children() { this.model.children = this.children;}
    },
    methods: {
        async getChildren(parent) {
          if (this.children && this.children.length == 0) {
              if (this.api) {
                  this.children = await $.get(this.api, { ID: parent.id });
                  if (this.children.length == 0) this.children = undefined;
              }
              else { //just for testing
                  setTimeout(() => {
                      this.children = list.filter(child => child.parent_id == parent.id);
                      if (this.children.length == 0) this.children = undefined;
                  }, 500);
              }
          }
      }
    },
});
new Vue({
  el:".container",
});
