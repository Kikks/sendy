<template>
    <div class="input-box mt-4">
        <label v-if="label" class="label">{{label}}</label>
        <div class="input-holder">
            <input :type="typeToShow" v-model="myValue" :placeholder="placeholder" />

            <icon v-if="icon" :name="icon" :size="iconSize" />
            <button v-if="type == 'password'" @click="togglePasswordVisible()">
                <icon :name="!passwordVisible ? 'eye-outline' : 'eye-off-outline' " size="1.2" />
            </button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: [Boolean, String],
            default: false,
        },
        icon: {
            type: [Boolean, String],
            default: false,
        },
        iconSize: {
            type: String,
            default: "1.2",
        },
        type: {
            type: String,
            default: "text",
        },
        value: {
            type: String,
            default: "",
        },
        placeholder: {
            type: String,
            default: "",
        },
    },
    data(){
        return {
            myValue: this.value,
            passwordVisible: false,
        }
    },
    computed: {
        typeToShow(){
            if(this.type == 'password' && this.passwordVisible){
                return 'text';
            }

            return this.type;
        }
    },
    watch: {
        myValue(v){
            this.$emit("input", v);
        }
    },
    methods: {
        togglePasswordVisible(){
            this.passwordVisible = !this.passwordVisible;
        },
    }
}
</script>

<style lang="scss" scoped>
.input-box {
    .input-holder {
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid lightgray;
        button{
            border: none;
            background-color: transparent;
            color: $text-color;
        }
    }

    input {
      width: 100%;
      border: none;
    }
}
</style>