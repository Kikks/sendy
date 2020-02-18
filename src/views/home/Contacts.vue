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
            <div class="switcher my-1">
                <div @click="tab=true" class="switch" :class="tab ? 'active':''">
                    Individuals
                </div>
                <div @click="tab=false" class="switch" :class="!tab ? 'active':''">
                    Groups
                </div>
            </div>
            <div 
                class="d-flex justify-content-center align-items-center" 
                style="height: 50vh"
                v-if="isLoading"
            >
                <icon name="loading" spin primary />
            </div>
            <div 
                class="d-flex justify-content-center align-items-center" 
                style="height: 50vh"
                v-if="errorMessage"
            >
                {{errorMessage}}
            </div>
            <div class="text-center" v-if="!isLoading && filteredContacts.length < 1">
                <span>You currently have no {{ tab ? 'individual' : 'group' }} contacts</span>
            </div>
             <div v-for="(contact) in filteredContacts" :key="contact.id" class="activityRow">
                <div class="row firstRow">
                    <div class="col-6 blue">
                       {{contact.name}}
                    </div>
                    <!-- <div class="col-6 text-right" :class="{red: !activity.add, green: activity.add}"> -->
                    <div class="col-6 text-right">
                        {{ contact.currencyCode }}{{contact.airtimeAmount}}
                    </div>
                </div>
                <div class="row secondRow">
                    <div class="col-6 blue">
                        <span v-if="tab">{{contact.phoneNumber[0]}}</span>
                        <span v-else>{{ contact.phoneNumber.length }} Recipients</span>
                    </div>
                    <div class="col-6 text-right">
                        {{contact.frequency}}
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Helpers from '../../utils/Helpers';
export default {
    data(){
        return{
            tab: true,
            isLoading: false,
            errorMessage: ""
        }
    },
    computed: {
        filteredContacts(){
            return this.$store.getters.getContacts.filter(contact => {
                if(contact.type === "group" && !this.tab){
                    return true;
                }else if(contact.type === "individual" && this.tab){
                    return true;
                }
            }); 
        }
    },
    methods: {
        getContacts(){
            this.isLoading = true;
            this.$store
                    .dispatch('getContacts')
                    .then(response => {
                        this.isLoading = false;
                    })
                    .catch(error => {
                         Helpers.errorResponse(error, response => {
                            this.isLoading = false;
                            this.errorMessage = response;
                        });
                    });
        },
        addNewContact(){
            if(this.tab){
                this.$router.push({name: 'new-contact'});
            }else{
                this.$router.push({name: 'new-group-contact'});
            }
        }
    },
    mounted(){
        if(this.$store.getters.getContacts.length < 1) {
            this.getContacts();
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
        .switcher{
            border: 1px solid $primary;
            border-radius: 5px;
            text-align: center;
            display: flex;

            .switch{
                flex: 1;
                padding: 4px 0;
                color: $primary;
                font-size: 16px;
            }
            .active{
                background-color: $primary;
                color: #FFFFFF; 
                //    border:1px solid blue;
                    // border-radius:5px;
            }
        }
        .activityRow{
            padding: 20px 0;
            border-bottom: 0.5px solid #E6EDFF;
            .blue{
                color:#030039
            }

            .secondRow{
                font-size: 14px;
                opacity: 0.5;
            }

            &:last-child {
                margin-bottom: 72px;
            }
        }
        
    
    }
</style>