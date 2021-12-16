<template>
  <div>

    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="success"
          dark
          v-bind="attrs"
          v-on="on"
          @click="action = 'add'"
        >
          Add candidate
        </v-btn>
      </template>

      <v-card v-if="action === 'add'">
        <v-card-title class="text-h5">
          Add candidate
        </v-card-title>

        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="form.name"
              label="Name"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.email"
              label="Name"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            text
            @click="dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="dialog = false; createcandidate()"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-title class="text-h5">
          Edit candidate
        </v-card-title>

        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="selected.name"
              label="Name"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            text
            @click="dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="dialog = false; updatecandidate()"
          >
            Save
          </v-btn>
          <v-btn
            color="danger"
            text
            @click="dialog = false; deletecandidate()"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-data-table
      :headers="headers"
      :items="candidates"
      :items-per-page="5"
      class="elevation-1 mt-4"
    >
      <template v-slot:item.closed_at="{ item }">
        <v-chip :color="item.closed_at ? 'red' : 'green'" dark>
          {{ item.closed_at ? "Closed" : "Open" }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="openEditDialog(item)"
        >
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  middleware: "auth",
  data() {
    return {
      dialog: false,
      selected: {
        name: null,
        email: null
      },
      action: null,
      candidates: [],
      headers: [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Email",
          value: "email",
        },
        {
          text: "Description",
          value: "description",
        },
        {
          text: "Actions",
          value: "actions"
        }
      ],
      form: {
        name: null,
        opened_at: null,
        email: null,
        vacancy_id: '497003092253' + Math.random() * 1000
      }
    };
  },
  mounted(){
    const date = new Date()
    this.form.opened_at = date.toISOString
  },
  async fetch() {
    console.log(this.$store.state.authUser.token)
    const candidates = await this.$axios.$get(
      "https://openvacancy-dot-sandbox-opsy.uc.r.appspot.com/api/candidates",
      {
        headers: {
          Authorization: `Bearer ${this.$store.state.authUser.token}`,
          accept: "application/json",
        },
      }
    );
    this.candidates = candidates.data;
  },
  methods: {
    async createcandidate(){
      const candidate = await this.$axios.$post(
      "https://openvacancy-dot-sandbox-opsy.uc.r.appspot.com/api/candidates",
      this.form,
      {
        headers: {
          Authorization: `Bearer ${this.$store.state.authUser.token}`,
          accept: "application/json",
        },
      }
    );
    this.$fetch()
    },
    async updatecandidate(){
      const candidate = await this.$axios.$put(
        `https://openvacancy-dot-sandbox-opsy.uc.r.appspot.com/api/candidates/${this.selected.id}`,
        this.selected,
        {
          headers: {
            Authorization: `Bearer ${this.$store.state.authUser.token}`,
            accept: "application/json",
          },
        }
      );
      this.$fetch()
    },
    async deletecandidate(){
      const candidate = await this.$axios.$delete(
        `https://opencandidate-dot-sandbox-opsy.uc.r.appspot.com/api/candidates/${this.selected.id}`,
        {
          headers: {
            Authorization: `Bearer ${this.$store.state.authUser.token}`,
            accept: "application/json",
          },
        }
      );
      this.$fetch()
    },
    openEditDialog(item){
      this.selected = item
      this.action = "edit"
      this.dialog = true
    }
  }
};
</script>