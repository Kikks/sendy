<template>
    <div>
        <GreyNavbar title="Send Airtime" />

        <div class="send-airtime">
            <h3>
                <b>Select Categories</b>
            </h3>

            <div class="switcher mt-3">
                <div @click="tab=true" class="switch" :class="tab && 'active'">New Recipient</div>
                <div @click="tab=false" class="switch" :class="!tab && 'active'">Saved Recipients</div>
            </div>
            <div v-if="tab">
                <tl-input class="mt-5" placeholder="Name" v-model="name" />
                <tl-input class="mt-5" placeholder="Phone" type="tel" v-model="phoneNumber" />
                <tl-input
                    class="mt-5"
                    placeholder="Airtime Amount"
                    type="number"
                    v-model="airtimeAmount"
                />
            </div>
            <div v-else>
                <tl-input
                    class="mt-5"
                    v-model="searchTerm"
                    placeholder="Search Recipient"
                    icon="magnify"
                    type="text"
                    key="searchTerm"
                />
                <div class="search" v-if="shouldShowSearchBox">
                    <div class="searchbox px-3 pb-3" v-on-clickaway="away">
                        <div class="row pt-3" v-if="contacts.length < 1">
                            <div class="col-12">
                                Not found
                            </div>
                        </div>
                        <div class="searchitem pt-3" v-for="(contact) in contacts" :key="contact.id" @click="selectContact(contact)">
                            <div class="row">
                                <div class="col-6">{{contact.name}}</div>
                                <div class="col-6 text-right">{{contact.currencyCode}}{{contact.airtimeAmount}}</div>
                            </div>
                            <div class="row searchrow">
                                <div class="col-6">{{contact.phoneNumber[0]}}</div>
                                <div class="col-6 text-right">{{contact.frequency}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <tl-input
                    class="mt-5"
                    placeholder="Airtime Amount"
                    type="number"
                    v-model="airtimeAmount"
                />
            </div>

            <button class="btn mt-5" :disabled="canSubmit || isLoading" @click="transfer()">
                <icon name="loading" spin size="0.9" class="mr-1" v-if="isLoading" />Transfer
            </button>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import { directive as onClickaway } from 'vue-clickaway';
import Helpers from "../../utils/Helpers";
export default {
    directives: {
        onClickaway: onClickaway,
    },
    data() {
        return {
            tab: true,
            // search: true,
            searchTerm: "",
            name: "",
            phoneNumber: "+2348060917025",
            airtimeAmount: "",
            isLoading: false,
            selectedContactId: "",
            showSearch: false,
        };
    },
    watch: {
        contacts(newValue) {
            if(newValue.length < 1) {
                this.selectedContactId = "";
            }
        },
        searchTerm(v){
            if(v.length > 1){
                this.showSearch = true;
            }
        }
    },
    computed: {
        shouldShowSearchBox(){
            if(this.showSearch && this.searchTerm.length > 0){
                return true;
            }

            return false;
        },
        contacts(){
            return this.$store.getters.getContacts
                        .filter(contact => {
                            if(contact.type === 'individual') {
                                return true;
                            }
                        })
                        .filter(contact => {
                            if(!this.searchTerm) {
                                return true;
                            }
                             return (typeof contact.name === "string" && contact.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1) ||
                                    (typeof contact.phoneNumber === "string" && contact.phoneNumber.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1);
                        });
        },
        canSubmit() {
            if (
                this.tab && this.name.length < 1 ||
                this.tab && this.phoneNumber.length < 1
            ) {
                return true;
            }

            if (!this.tab && this.selectedContactId.length < 1) {
                return true;
            }

            if(this.airtimeAmount < 1) {
                return true;
            }

            return false;
        }
    },
    methods: {
        away(){
            this.searchTerm = "";
            this.showSearch = false;
        },
        selectContact(contact){
            this.searchTerm = contact.name;
            this.selectedContactId = contact.id;
            setTimeout(() => {
                this.showSearch = false;
            }, 0);
        },
        transfer() {
            if (this.isLoading) return;

            const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/airtime`;

            this.isLoading = true;

            const data = {
                value: Number(this.airtimeAmount),
                category: this.tab ? "newRecipient" : "savedRecipient",
                currencyCode: "NGN"
            };
            
            if(this.tab){
                data.phoneNumber = [this.phoneNumber];
            } else {
                data.contact = this.selectedContactId
            }
            axios
                .post(url, data)
                .then(response => {
                    this.isLoading = false;
                    this.$toasted.show(response.data.message);
                    this.$store.dispatch('getActivities');
                    this.$router.push({ name: "home" });
                })
                .catch(error => {
                    Helpers.errorResponse(error, response => {
                        this.isLoading = false;
                        this.$toasted.show(response);
                    });
                });
        }
    },
    mounted(){
        if(this.contacts.length < 1) {
            this.$store.dispatch('getContacts');
        }
    }
};
</script>

<style lang="scss" scoped>
.send-airtime {
    margin-top: 55px;
    padding: 20px;

    .switcher {
        border: 1px solid $primary;
        border-radius: 5px;
        text-align: center;
        display: flex;

        .switch {
            flex: 1;
            padding: 4px 0;
            color: $primary;
            font-size: 16px;
        }
        .active {
            background-color: $primary;
            color: #ffffff;
            //    border:1px solid blue;
            // border-radius:5px;
        }
    }
    .fixedbtn {
        position: fixed;
        top: 680px;
        left: 3.5px;
        width: 98%;
    }
    .search {
        position: absolute;
        width: 90%;
        // max-width: calc($full-width - 10px);
        max-width: $full-width;
        z-index: 1;
    }
    .searchbox {
        width: 100%;
        max-width: $full-width;
        height: auto;
        background: #ffffff;
        box-shadow: 0px 20px 50px #e9edee;
        border-radius: 0px 0px 10px 10px;
        overflow-y: scroll;

        .searchitem {
            border-bottom: 1px solid#E6EDFF;
            &:last-child {
                border-bottom: none;
            }
        }

        .searchrow {
            color: #d2d5db;
            font-size: 14px;
        }
    }
}
</style>