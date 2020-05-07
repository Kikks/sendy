<template>
<div class="nav-container">
    <nav class="navbar">
        <img src="../assets/white-logo.svg" />
        <img src="../assets/images/menu.svg" @click="sideToggle = true" />
    </nav>
    <div class="sidemenu" :class="sideToggle?'visible':''">
        <div class="backdrop" @click="sideToggle = false"></div>
        <div class="sidebar-content">
            <div>
                <div class="text-right">
                    <icon name="close-circle" class="close-icon" size="2" @click.native="sideToggle = false" />
                </div>

                <div class="navs">
                    <router-link :to="{name: 'profile'}" tag="div" class="nav-item">
                        Profile
                    </router-link>
                    <router-link :to="{name: 'addcard'}" tag="div" class="nav-item">
                        Add Card
                    </router-link>
                    <router-link :to="{name: 'security'}" tag="div" class="nav-item">
                        Security
                    </router-link>
                    <router-link :to="{name: 'alert'}" tag="div" class="nav-item">
                        Alert
                    </router-link>
                    <div class="nav-item" @click="logout">
                        Logout
                    </div>
                </div>
            </div>

            <div class="bottom">
                <span class="social-icon">
                    <icon name="email" />
                </span>
                <span class="social-icon">
                    <icon name="instagram" />
                </span>
                <span class="social-icon">
                    <icon name="twitter" />
                </span>
                <div class="footer">
                    &copy; 2019 Tinylabs.<br />
                    All rights reserved.
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
            sideToggle: false,
        }
    },
    methods: {
        logout(){
            this.$store
                .dispatch('logout')
                .then(() => {
                    this.$router.push({ name: 'onboard' });
                    this.$toasted.show('Logout successful');
                });
        }
    }
}
</script>

<style lang="scss" scoped>
.nav-container{
    max-width: $full-width;
}
nav.navbar{
    background-color: $primary;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    width: 100%;
    z-index: 10;
    max-width: $full-width;

    img{
        height: 20px;
    }
}
.sidemenu{
    visibility: hidden;
    position: fixed;
    // right: 0;
    // left: 0;
    width: 100%;
    height: 100%;
    max-width: $full-width;
    z-index: 11;
    transition: visibility 260ms;
    
    &.visible{
        visibility: visible;
        // transition: visibility 4s ease-in;

        .backdrop{
            opacity: 0.5;
        }
        .sidebar-content{
            transform: translateX(0px);
        }
    }

    .backdrop{
        position: absolute;
        background-color: #000000;
        opacity: 0;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        transition: opacity 250ms ease-in;
    }
    .sidebar-content{
        background-color: white;
        float: right;
        position: relative;
        width: 250px;
        height: 100%;
        padding: 20px 20px;
        padding-left: 30px;
        transform: translateX(250px);
        transition: transform 250ms ease-in-out;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .close-icon{
            color: $primary;
        }
        .navs{
            padding-left: 10px;
            margin-top: 30px;
            .nav-item{
                padding: 15px 0px; 
                cursor: pointer;
            }
        }
        .bottom{
            .social-icon{
                width: 35px;
                height: 35px;
                margin-right: 20px;
                color: white;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                background-color: $primary;
                border-radius: 50%;
                .mdi{
                    font-size: 0.9rem !important;
                }
            }
            .footer{
                margin-top: 15px;
                color: $text-color;
                opacity: 0.4;
                font-size: 14px;
            }
        }
    }
}
</style>