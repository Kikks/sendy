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
             <div v-for="(contact) in filteredContacts" :key="contact.id" class="activityRow">
                <div class="row firstRow">
                    <div class="col-6 blue">
                       {{contact.name}}
                    </div>
                    <!-- <div class="col-6 text-right" :class="{red: !activity.add, green: activity.add}"> -->
                    <div class="col-6 text-right">
                        NGN{{contact.airtimeAmount}}
                    </div>
                </div>
                <div class="row secondRow">
                    <div class="col-6 blue">
                        <span v-if="tab">{{contact.phoneNumber[0]}}</span>
                        <span v-else>{{contact.recipients}} Recipients</span>
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
export default {
    data(){
        return{
            tab: true,
            isLoading: false,
            contacts:[]
        }
    },
    computed: {
        filteredContacts(){
            return this.contacts.filter(contact => {
                if(contact.recipients && !this.tab){
                    return true;
                }else if(!contact.recipients && this.tab){
                    return true;
                }
            }); 
        },
    },
    methods: {
        getContacts(){
            this.isLoading = true;
            const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/contact`;
            axios
            .get(url)
            .then(response => {
                this.isLoading = false;
                this.contacts = response.data.data;
                console.log(response);
            })
            .catch(error => {
                console.log(error);
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
        this.getContacts();
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