<template>
    <div>
        <GreyNavbar title="Add New Contact">
            <button class="p-0" slot="trailing">
                Delete
            </button>
        </GreyNavbar>

        <div class="new-contact">
            <p class="text-center">
                Enter recipient's name, phone number and airtime frequency
            </p>

            <tl-input class="mt-5" placeholder="Name" v-model="name"/>
            <tl-input class="mt-5" placeholder="Phone" type="tel"  v-model="phone"/>
            <tl-input class="mt-5" placeholder="Airtime Amount" type="number" v-model="amount" />
            <div class="row mt-4 mb-5">
                <div class="col-6">
                    <tl-input placeholder="Start Date" type="date" v-model="start_date" />
                </div>
                <div class="col-6">
                    <tl-input placeholder="End Date" type="date" v-model="end_date" />
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
                Status (Active)
            </div>

            <button class="btn mt-5">Save Changes</button>
        </div>

    </div>
</template>
<script>
export default {
     data(){
        return{
            ticked:"daily",
            name: "",
            phone: "",
            amount: "",
            start_date: "",
            end_date: ""

        }
    },
    methods: {
        addContact(){
            const url = ``;
        },
        changeIcon(data){
            this.ticked =data;
            // console.log(this.ticked)
        },
     }
}
</script>
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
