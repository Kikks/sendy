<template>
    <div>
        <GreyNavbar title="Profile" />

        <div class="profile">
            <div>
                
                <div class="profilepic">
                    <div class="cameraicon">
                        <icon name="camera"></icon>
                    </div>

                </div>
                <tl-input class="mb-5" placeholder="Full Name" />
                <tl-input type="tel" class="mb-5" placeholder="Phone" />
                <tl-input type="email" class="mb-5" placeholder="Email" />
            </div>

            <button class="btn mt-5">Save Changes</button>
        </div>

    </div>
</template>

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