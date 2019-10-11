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
                <div class="row switcher">
                    <div @click="tab=!tab" class="col-6 switch" :class="tab ? 'active':''">
                        Individuals
                    </div>
                    <div @click="tab=!tab" class="col-6 switch" :class="!tab ? 'active':''">
                        Groups
                    </div>
                </div>
             <div v-for="(contact, i) in contacts" :key="i" class="activityRow">
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
                        {{contact.number}}
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
            tab:true,
            contacts:[
                {
                    name:'My Number',
                    amount:5000,
                    number:+2348092345676,
                    duration:'monthly'
                },
                {
                    name:'Wife',
                    amount:4000,
                   number:+2348092345676,
                    duration:'monthly'
                },
                {
                    name:'Nathan',
                    amount:3000,
                    number:+2348092345676,
                    duration:'weekly'
                },
                {
                    name:'Joshua',
                    amount:500,
                    number:+2348092345676,
                    duration:'monthly'
                },
                // {
                //     name:'My Number',
                //     amount:5000,
                //     recipients: 10,
                //     duration:'monthly'
                // },
                // {
                //     name:'Wife',
                //     amount:4000,
                //     recipients: 10,
                //     duration:'monthly'
                // },
                // {
                //     name:'My Number',
                //     amount:5000,
                //     recipients: 10,
                //     duration:'monthly'
                // },
                // {
                //     name:'My Number',
                //     amount:5000,
                //     recipients: 10,
                //     duration:'monthly'
                // },
            ]
        }
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
           border:1px solid blue;
           border-radius:5px;
           text-align:center;
           .switch{
               padding:10px 0;
               color:#006FFF;
           }
           .active{
               background-color:#006FFF;
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