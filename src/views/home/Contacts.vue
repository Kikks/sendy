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

             <div v-for="(contact, i) in filteredContacts" :key="i" class="activityRow">
                <div class="row firstRow">
                    <div class="col-6 blue">
                       {{contact.name}}
                    </div>
                    <!-- <div class="col-6 text-right" :class="{red: !activity.add, green: activity.add}"> -->
                    <div class="col-6 text-right">
                        NGN{{contact.amount}}
                    </div>
                </div>
                <div class="row secondRow">
                    <div class="col-6 blue">
                        <span v-if="tab">{{contact.number}}</span>
                        <span v-else>{{contact.recipients}} Recipients</span>
                    </div>
                    <div class="col-6 text-right">
                        {{contact.duration}}
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            tab: true,
            contacts:[
                {
                    name:'My Number',
                    amount:5000,
                    number:+2348092345676,
                    duration:'Monthly'
                },
                {
                    name:'Wife',
                    amount:4000,
                    number:+2348092345676,
                    duration:'Monthly'
                },
                {
                    name:'Nathan',
                    amount:3000,
                    number:+2348092345676,
                    duration:'Weekly'
                },
                {
                    name:'Joshua',
                    amount:500,
                    number:+2348092345676,
                    duration:'Monthly'
                },
                {
                    name:'Fellowship Group',
                    amount:5000,
                    recipients: 10,
                    duration:'Monthly'
                },
                {
                    name:'Cashier Group',
                    amount:4000,
                    recipients: 10,
                    duration:'Monthly'
                },
                {
                    name:'National Commitee',
                    amount:5000,
                    recipients: 10,
                    duration:'Monthly'
                },
                {
                    name:'Receptionists',
                    amount:5000,
                    recipients: 10,
                    duration:'Monthly'
                },
            ]
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
        }
        
    
    }
</style>