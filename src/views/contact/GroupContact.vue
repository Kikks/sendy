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

            <div class="row align-center mt-4" v-for="(phone, index) in phones" :key="phone.id">
                <div class="col-1 text-center">
                    <icon name="delete" color="red" @click.native="deleteNumber(index)" v-if="phones.length > 1" />
                </div>
                <div class="col-10">
                    <tl-input class="new-contact-phone-input" :placeholder="`Phone Number ${index + 1}`" type="tel" v-model="phone.value" />
                </div>
                <div class="col-1 text-center" v-if="index == 0">
                    <icon name="plus" color="green" @click.native="createNewPhoneNumber()" />
                </div>
            </div>

            <tl-input class="mt-5" placeholder="Airtime Amount" type="number" v-model="airtimeAmount" />

            <div class="row mt-5 mb-5">
                <div class="col-6">
                    <div class="row">
                        <div class="col-10">
                            <date-picker 
                                v-model="startDate"
                                placeholder="Start Date"
                            ></date-picker>
                        </div>
                        <div class="col-2">
                            <icon name="chevron-down" primary/>
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="row">
                        <div class="col-10">
                            <date-picker 
                                v-model="endDate"
                                placeholder="End Date"
                            ></date-picker>
                        </div>
                        <div class="col-2">
                            <icon name="chevron-down" primary/>
                        </div>
                    </div>
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
                Status (Inactive)<toggle-button />
            </div>

            <button class="btn mt-5">Save Changes</button>
        </div>

    </div>
</template>
<script>
export default {
     data(){
        return{
            ticked:'daily',
            phones: [
                {id: 1, value: ""}
            ],
            airtimeAmount: "",
            startDate: "",
            endDate: "",
            status: ""

        }
    },
    methods: {
        changeIcon(data){
            this.ticked = data;
        },
        createNewPhoneNumber(){
            if(!this.phones[this.phones.length-1].value){
                return;
            }
            this.phones.push({
                value: "",
                id: Math.random()
            });
        },
        deleteNumber(index){
            this.phones.splice(index,1);
        }
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
            height: 54px;
        }
        .new-contact-phone-input {
            &:nth-child(1) {
                margin-top: 0px !important;
                background: red;
            }
        }
        .add-phone-number-icon{
            cursor: pointer;
        }
    }
</style>
