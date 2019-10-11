<template>
    <div class="activity">
        <div class="recent-activity">
            <div class="row align-items-center justify-content-space-between my-2">
                <div class="col">
                    <h2>All Contacts</h2>
                </div>
                <div class="col text-right">
                    <button class="addBtn" @click="addNewContact()">+ Add New</button>
                </div>
            </div>

            
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        addNewContact(){
            this.$router.push({name: 'new-contact'});
        }
    }
}
</script>

<style lang="scss" scoped>
    .activity{
        min-height: 100vh;
        .addBtn{
            color: $primary;
            font-weight: normal;
        }
    }
    .recent-activity{
        padding: 20px;
        background-color: white;

        h2{
            font-size: 17px;
        }
    }
</style>