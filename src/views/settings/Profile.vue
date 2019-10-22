<template>
    <div>
        <GreyNavbar title="Profile" />

        <div class="profile">
            <div>
                
                <!-- <div class="profilepic">
                    <div class="cameraicon">
                        <icon name="camera"></icon>
                    </div>

                </div> -->
                <tl-input class="mb-5" placeholder="First Name" v-model="first_name" />
                <tl-input class="mb-5" placeholder="Last Name" v-model="last_name"  />
                <tl-input type="tel" class="mb-5" placeholder="Phone" v-model="phone" />
                <tl-input type="email" class="mb-5" placeholder="Email" v-model="email" />
            </div>

            <button 
                class="btn mt-5" 
                :disabled="canSubmit || isLoading" 
                @click="updateProfile"
            >  
                <icon name="loading" spin size="0.9" v-if="isLoading" class="mr-1" /> Save Changes
            </button>
        </div>

    </div>
</template>

<script>
import Helpers from '../../utils/Helpers';
export default {  
    data(){
        return {
            first_name: "",
            last_name: "",
            phone: "",
            email: "",
            isLoading: false
        }
    },
    //+23480609170253 danieel@gmail.com
    computed: {
        canSubmit(){
            if(this.first_name.length < 1 || 
                this.last_name.length < 1 || 
                this.phone.length < 1
            ){
                return true;
            }
            if(!Helpers.isValidEmail(this.email)) {
                return true;
            }
            return false;
        },
        user(){
            return this.$store.getters.getUser;
        },
    },
    methods: {
        updateProfile(){
            this.isLoading = true;

            const data = {
                firstName: this.first_name,
                lastName: this.last_name,
                phoneNumber: this.phone,
                email: this.email
            };

            this.$store.dispatch('updateUser', { data, type: 'update_info' })
                .then(response => {
                    this.isLoading = false;
                    this.$toasted.show(response.data.message);
                    this.$router.push({name: 'home'});
                })
                .catch(error => {
                    Helpers.errorResponse(error, response => {
                        this.isLoading = false;
                        this.$toasted.show(response);
                    });
                });
        },
        setDefaultFormValues(){
            this.first_name = this.user.firstName;
            this.last_name = this.user.lastName;
            this.phone = this.user.phoneNumber;
            this.email = this.user.email;
        }
    },
    mounted(){
        this.setDefaultFormValues();
    }
}
</script>
<style lang="scss" scoped>
    .profile{
        margin-top: 55px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 80vh;
        .profilepic{
            width:100px;
            height:100px;
            border-radius:50%;
            background-color: lightgray;
            margin:50px auto;
            display: flex;
            align-items: flex-end;
            text-align: center;
            .cameraicon{
                width:100%;
                height:40px;
                background-color: transparent;
            }
        }
    }
</style>