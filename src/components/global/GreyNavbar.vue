<template>
    <div class="nav-container">
        <nav class="navbar">
            <div class="leading">
                <slot name="leading">
                    <button class="p-0" @click="pop()">
                        <icon name="chevron-left" size="1" />
                        Back
                    </button>
                </slot>
            </div>
            <div class="title">{{title}}</div>
            <div class="trailing text-right">
                <slot name="trailing"></slot>
            </div>
        </nav>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true,
        }
    },
    methods: {
        pop(){
            this.$router.go(-1);
        }
    },
}
</script>

<style lang="scss" scoped>
    .nav-container{
        max-width: $full-width;
    }
    nav.navbar{
        position: fixed;
        top: 0;
        background-color: $accent;
        padding: 15px 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: fixed;
        width: 100%;
        max-width: $full-width;
        z-index: 100;

        .title{
            text-align: center;
            flex: 1;
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        img{
            height: 20px;
        }

        .leading, .trailing{
            width: 80px;

            button{
                color: $primary;
                font-weight: normal;
            }
            // border: 1px solid red;
        }
    }
</style>