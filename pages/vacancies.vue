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
          Add Vacancy
        </v-btn>
      </template>

      <v-card v-if="action === 'add'">
        <v-card-title class="text-h5">
          Add Vacancy
        </v-card-title>

        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="form.name"
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
            @click="dialog = false; createVacancy()"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-title class="text-h5">
          Edit Vacancy
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
            @click="dialog = false; updateVacancy()"
          >
            Save
          </v-btn>
          <v-btn
            color="danger"
            text
            @click="dialog = false; deleteVacancy()"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-data-table
      :headers="headers"
      :items="vacancies"
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
      },
      action: null,
      vacancies: [],
      headers: [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Date Created",
          value: "opened_at",
        },
        {
          text: "Status",
          value: "closed_at",
        },
        {
          text: "Actions",
          value: "actions"
        }
      ],
      form: {
        name: null,
        opened_at: null
      }
    };
  },
  mounted(){
    const date = new Date()
    this.form.opened_at = date.toISOString
  },
  async fetch() {
    console.log(this.$store.state.authUser.token)
    const vacancies = await this.$axios.$get(
      "https://openvacancy-dot-sandbox-opsy.uc.r.appspot.com/api/vacancies",
      {
        headers: {
          Authorization: `Bearer ${this.$store.state.authUser.token}`,
          accept: "application/json",
        },
      }
    );
    this.vacancies = vacancies.data;
  },
  methods: {
    async createVacancy(){
      const vacancy = await this.$axios.$post(
      "https://openvacancy-dot-sandbox-opsy.uc.r.appspot.com/api/vacancies",
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
    async updateVacancy(){
      const vacancy = await this.$axios.$put(
        `https://openvacancy-dot-sandbox-opsy.uc.r.appspot.com/api/vacancies/${this.selected.id}`,
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
    async deleteVacancy(){
      const vacancy = await this.$axios.$delete(
        `https://openvacancy-dot-sandbox-opsy.uc.r.appspot.com/api/vacancies/${this.selected.id}`,
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