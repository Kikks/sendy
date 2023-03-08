<template>
  <div class="activity">
    <div class="recent-activity">
      <div
        class="row align-items-center justify-content-space-between my-2 title-container"
      >
        <div class="col">
          <h2 class="title">All Contacts</h2>
        </div>
        <div class="col text-right">
          <button class="addBtn" @click="addNewContact()">+ Add New</button>
        </div>
      </div>

      <div
        class="d-flex flex-row mb-4 justify-content-between align-items-center"
      >
        <div></div>
        <div>
          <pagination
            :page="paginationMetaData.page || 0"
            :page-count="paginationMetaData.total_pages || 0"
            @nextData="nextData"
            @prevData="prevData"
          />
        </div>
      </div>
      <div
        v-if="isFetchingContacts"
        class="d-flex justify-content-center align-items-center"
        style="height: 50vh"
      >
        <icon name="loading" spin primary />
      </div>
      <div
        v-if="errorMessage"
        class="d-flex justify-content-center align-items-center"
        style="height: 50vh"
      >
        {{ errorMessage }}
      </div>
      <div
        v-if="
          !isFetchingContacts && !errorMessage && filteredContacts.length < 1
        "
        class="text-center"
      >
        <span>You do not have any contact yet.</span>
      </div>
      <div v-if="!isFetchingContacts && !errorMessage">
        <div
          v-for="item in filteredContacts"
          :key="item.id"
          class="activityRow"
        >
          <div class="row">
            <div class="col">
              <div class="row firstRow">
                <div class="col-6 blue flex-col">
                  <span class="bold">{{ item.name }}</span>
                  <span class="subtext">
                    {{
                      item.recipients.length === 1
                        ? '1 Phone Number'
                        : `${item.recipients.length} Phone Numbers`
                    }}
                  </span>
                </div>
                <div class="col-6 text-right flex-col">
                  <span class="bold">
                    {{
                      `${
                        item.recipients[0].currency_code
                      } ${item.recipients[0].amount.toLocaleString()}`
                    }}
                  </span>
                  <span class="subtext">
                    {{ item.frequency }}
                  </span>
                </div>
              </div>

              <div v-if="item.isDuplicate" class="row thirdRow">
                <div class="col-6 red">
                  <span @click="showDeleteContactModal(item)"
                    >Possible Duplicate (Delete)</span
                  >
                </div>
              </div>
            </div>
            <div class="col-1 ss">
              <div class="dropdown" @click="show(item)">
                <div>
                  <icon name="dots-vertical" />
                </div>
                <div :ref="`dropdown-menu-${item.id}`" class="dropdown-menu">
                  <div class="dropdown-item" @click="editContact(item)">
                    <span>Edit</span>
                  </div>
                  <div
                    class="dropdown-item"
                    @click="showDeleteContactModal(item)"
                  >
                    <span>Delete</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <tl-modal :name="deleteContactModal">
      <div class="row justify-content-center">
        <div class="col-11">
          <h2>Delete contact</h2>
          <span>
            Are you sure you want to delete
            <b>{{ contact.name }}</b>
          </span>
          <div class="row my-2 buttons">
            <div class="col">
              <button
                class="btn small btn--cancel"
                @click="hideDeleteContactModal"
              >
                No
              </button>
            </div>
            <div class="col">
              <button
                class="btn small block btn--delete"
                :disabled="isLoading"
                @click="deleteContact"
              >
                <icon v-if="isLoading" name="loading" spin size="0.7" />Yes,
                delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </tl-modal>
  </div>
</template>

<script>
import axios from 'axios';
import Helpers from '../../utils/Helpers';

export default {
  data() {
    return {
      tab: true,
      isFetchingContacts: false,
      isLoading: false,
      errorMessage: '',
      deleteContactModal: 'delete-contact-modal',
      contact: {},
    };
  },
  computed: {
    filteredContacts() {
      return this.$store.getters.getContacts;
    },
    paginationMetaData() {
      return this.$store.getters.getPaginationMetaData;
    },
  },
  watch: {
    tab() {
      return this.getContacts();
    },
  },
  mounted() {
    this.getContacts();
  },
  methods: {
    show(contact) {
      const elem = this.$refs[`dropdown-menu-${contact.id}`];
      if (elem[0]) {
        elem[0].classList.toggle('show');
      }
    },
    nextData() {
      if (this.paginationMetaData.nextPage) {
        this.$store.commit('setContacts', []);
        this.getContacts(this.paginationMetaData.nextPage);
      }
    },
    prevData() {
      if (this.paginationMetaData.previousPage) {
        this.$store.commit('setContacts', []);
        this.getContacts(this.paginationMetaData.previousPage);
      }
    },
    getContacts(page = 1) {
      this.isFetchingContacts = true;
      const type = this.tab ? '' : '';
      this.$store
        .dispatch('getContacts', { type, page })
        .then((response) => {
          this.isFetchingContacts = false;
          this.$store.commit(
            'setPaginationMetaData',
            response.data.data.page_info
          );
        })
        .catch((error) => {
          Helpers.errorResponse(error, (response) => {
            this.isFetchingContacts = false;
            this.errorMessage = response;
          });
        });
    },
    addNewContact() {
      this.$router.push({ name: 'new-group-contact' });
    },
    editContact(contact) {
      if (this.tab) {
        this.$router.push({
          name: 'edit.group.contact',
          params: { id: contact.id },
        });
      }
    },
    showDeleteContactModal(contact) {
      this.$modal.show(this.deleteContactModal);
      this.contact = contact;
    },
    hideDeleteContactModal() {
      this.$modal.hide(this.deleteContactModal);
    },
    deleteContact(page = 1) {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/contacts/${this.contact.id}`;
      axios
        .delete(url)
        .then((response) => {
          this.isLoading = false;
          this.$toasted.show(response.data.message);
          this.hideDeleteContactModal();
          const type = this.tab ? '' : '';
          this.$store.dispatch('getContacts', { type, page });
        })
        .catch((error) => {
          Helpers.errorResponse(error, (response) => {
            this.isLoading = false;
            this.$toasted.show(response);
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.activity {
  min-height: 100vh;
  .addBtn {
    color: $primary;
    font-weight: normal;
  }
}
.recent-activity {
  padding: 20px;
  background-color: white;

  h2 {
    font-size: 17px;
  }
  .switcher {
    border: 1px solid $primary;
    border-radius: 5px;
    text-align: center;
    display: flex;

    .switch {
      flex: 1;
      padding: 4px 0;
      color: $primary;
      font-size: 16px;
    }
    .active {
      background-color: $primary;
      color: #ffffff;
      //    border:1px solid blue;
      // border-radius:5px;
    }
  }
  .activityRow {
    position: relative;
    padding: 20px 0;
    border-bottom: 0.5px solid #e6edff;
    .blue {
      color: #030039;
    }

    .secondRow {
      font-size: 14px;
      opacity: 0.5;
    }
    .thirdRow {
      font-size: 14px;
      opacity: 0.9;
      .red {
        color: red;
      }
    }

    &:last-child {
      margin-bottom: 72px;
    }

    .contactOption {
      //position: relative;

      .contactOptionDropdown {
        position: absolute;
        background-color: white;
        border: 1px solid red;
        height: 400px;
        z-index: 340;
        width: 200px;
        right: 12px;
      }
    }

    .dropdown {
      .show {
        display: block;
      }

      &-item {
        cursor: pointer;
      }
    }
    .dropdown-menu {
      right: -6px;
      left: initial;
      top: initial;
      float: initial;
      min-width: 120px;
      z-index: 7;
    }
  }

  @media (min-width: 1024px) {
    .title {
      margin-top: 0 !important;
      font-size: 1.5rem;

      &-container {
        padding: 1rem 0;
        width: 100%;
        border-bottom: solid 1px rgba($color: #000000, $alpha: 0.1);
        margin: 0 !important;
      }
    }

    .switcher {
      margin-top: 1rem !important;
    }

    .switch {
      padding: 0.5rem !important;
      font-weight: 700;
      cursor: pointer;
    }

    .paragraph {
      max-width: 35ch !important;
      margin: 0 auto !important;
    }

    .recurring-cards {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      margin-top: 5rem;
    }

    .max-w {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }

    .or {
      margin-top: 3rem !important;
      margin-bottom: 3rem !important;
    }
  }
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.subtext {
  font-size: 0.8rem;
  text-transform: capitalize;
}

.bold {
  font-weight: 700;
}

.buttons {
  margin-top: 3rem !important;
}

.btn {
  &--delete {
    background-color: red !important;
    border: none !important;
  }
  &--cancel {
    background-color: transparent !important;
    border: none !important;
    color: black !important;
  }
}
</style>
