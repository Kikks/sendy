<template>
    <div>
        <GreyNavbar title="Add New Contact">
            <button class="p-0" slot="trailing">
                Delete
            </button>
        </GreyNavbar>

        <div class="new-contact">
            <p class="text-center">
                Enter group name, phone numbers and airtime frequency
            </p>

            <tl-input class="mt-5" placeholder="Group Name" />
            <tl-input class="mt-5" placeholder="Phone Numbers" type="tel" />
            <tl-input class="mt-5" placeholder="Airtime Amount" type="number" />
            <div class="row mt-4 mb-5">
                <div class="col-6">
                    <tl-input placeholder="Start Date" type="date" />
                </div>
                <div class="col-6">
                    <tl-input placeholder="End Date" type="date" />
                </div>
            </div>
            <div class="frequency mb-5">
                <div>Frequency</div>
                <div @click="changeIcon('daily')" class="freq">
                    <div>Daily</div>
                    <icon v-if="ticked =='daily'" name="check"></icon>
                </div>
                <div @click="changeIcon('weekly')" class="freq">
                     <div>Weekly</div>
                    <icon v-if="ticked =='weekly'" name="check"></icon>
                </div>
                <div @click="changeIcon('monthly')" class="freq">
                     <div>Monthly</div>
                    <icon v-if="ticked =='monthly'" name="check"></icon>
                </div>
            </div>
            <div>
                Status (Inactive)
            </div>

            <button class="btn mt-5">Save Changes</button>
        </div>

    </div>
</template>

<style lang="scss" scoped>
    .new-contact{
        margin-top: 55px;
        padding: 20px;
        .freq{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding:10px 0;
            border-bottom:1px solid #E6EDFF;
            color:#030039;
            font-size:16px;
            font-weight:bold;
        }
    }
</style>
<script>
export default {
     data(){
        return{
            ticked:'daily'
        }
    },
    methods: {
        changeIcon(data){
            this.ticked =data;
            // console.log(this.ticked)
        },
     }
}
</script>
