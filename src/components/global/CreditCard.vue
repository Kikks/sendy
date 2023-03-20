<template>
  <div
    class="card"
    :class="
      type === 'visa '
        ? 'card--visa'
        : type === 'mastercard '
        ? 'card--mastercard'
        : 'card--default'
    "
    @click="handleCick"
  >
    <div class="card__icon">
      <card-icon :type="type" />

      <div class="dropdown" @click="show()">
        <div>
          <icon name="dots-vertical" color="white" />
        </div>
        <div class="dropdown-menu" :class="showMenu ? 'show' : ''">
          <div class="dropdown-item" @click="showDeleteCardModal()">
            <span>Delete</span>
          </div>
        </div>
      </div>
    </div>
    <h3 class="card__number">
      <span>****</span> <span>****</span> <span>****</span>
      <span>{{ last4 }}</span>
    </h3>
    <div class="card__details">
      <span class="card__name">{{ name }}</span>

      <span>{{ month }}/{{ year }}</span>
    </div>

    <tl-modal :name="deleteCardModal">
      <div class="row justify-content-center">
        <div class="col-11">
          <h2>Delete Card</h2>
          <span style="color: black">
            Are you sure you want to delete this card?
          </span>
          <div class="row my-2 buttons">
            <div class="col">
              <button
                class="btn small btn--cancel"
                @click="hideDeleteCardModal"
              >
                No
              </button>
            </div>
            <div class="col">
              <button class="btn small block btn--delete" @click="deleteCard">
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </tl-modal>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: [String, Number],
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    last4: {
      type: String,
      default: '****',
    },
    name: {
      type: String,
      default: '',
    },
    month: {
      type: String,
      default: '',
    },
    year: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      deleteCardModal: 'delete-card-modal',
      loading: false,
      showMenu: false,
    };
  },
  methods: {
    handleCick() {
      this.$emit('click');
    },
    show() {
      this.showMenu = !this.showMenu;
    },
    showDeleteCardModal() {
      this.$modal.show(this.deleteCardModal);
    },
    hideDeleteCardModal() {
      this.$modal.hide(this.deleteCardModal);
    },
    deleteCard() {
      this.isLoading = true;
      this.$emit('delete', this.id);
      this.$modal.hide(this.deleteCardModal);
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  width: '100%';
  grid-column: span 1 / span 1;
  min-height: 250px;
  border-radius: 1rem;
  color: #fff;
  display: grid;
  gap: 2rem;
  padding: 1rem;
  align-content: center;

  @media (max-width: 600px) {
    gap: 1.5rem;
    min-height: 150px;
  }

  &__icon {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  &__number {
    font-weight: 900;
    font-size: 1.7rem;
    color: #fff;
    text-align: center;
    display: flex;
    justify-content: space-evenly;
    align-items: center;

    @media (max-width: 600px) {
      font-size: 1.2rem;
    }
  }

  &__details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 700;
    color: #fff;

    @media (max-width: 600px) {
      font-size: 0.8rem;
    }
  }

  .dropdown {
    cursor: pointer;
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

  &--visa {
    background: hsla(207, 80%, 59%, 1);

    background: linear-gradient(
      0deg,
      hsla(207, 80%, 59%, 1) 0%,
      hsla(344, 64%, 79%, 1) 50%,
      hsla(343, 93%, 69%, 1) 100%
    );

    background: -moz-linear-gradient(
      0deg,
      hsla(207, 80%, 59%, 1) 0%,
      hsla(344, 64%, 79%, 1) 50%,
      hsla(343, 93%, 69%, 1) 100%
    );

    background: -webkit-linear-gradient(
      0deg,
      hsla(207, 80%, 59%, 1) 0%,
      hsla(344, 64%, 79%, 1) 50%,
      hsla(343, 93%, 69%, 1) 100%
    );
  }

  &--mastercard {
    background: hsla(159, 82%, 55%, 1);

    background: linear-gradient(
      0deg,
      hsla(159, 82%, 55%, 1) 0%,
      hsla(206, 98%, 48%, 1) 100%
    );

    background: -moz-linear-gradient(
      0deg,
      hsla(159, 82%, 55%, 1) 0%,
      hsla(206, 98%, 48%, 1) 100%
    );

    background: -webkit-linear-gradient(
      0deg,
      hsla(159, 82%, 55%, 1) 0%,
      hsla(206, 98%, 48%, 1) 100%
    );
  }

  &--default {
    background: hsla(354, 95%, 24%, 1);

    background: linear-gradient(
      0deg,
      hsla(354, 95%, 24%, 1) 0%,
      hsla(234, 70%, 24%, 1) 100%
    );

    background: -moz-linear-gradient(
      0deg,
      hsla(354, 95%, 24%, 1) 0%,
      hsla(234, 70%, 24%, 1) 100%
    );

    background: -webkit-linear-gradient(
      0deg,
      hsla(354, 95%, 24%, 1) 0%,
      hsla(234, 70%, 24%, 1) 100%
    );
  }
}
</style>
