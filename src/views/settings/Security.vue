<template>
    <div>
        <GreyNavbar title="Security" />

        <div class="security">
            <div>
                <p class="text-center mt-1 mb-5">
                   Enter reciepient's name, phone number and airtime frequency
                </p>

                <tl-input type="password" class="mb-5" placeholder="Enter Password" />
                <tl-input type="password" class="mb-5" placeholder="Confirm Password" />
            </div>

            <button class="btn mt-5">Save Changes</button>
        </div>

    </div>
</template>

<style lang="scss" scoped>
    .security{
        margin-top: 55px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 80vh;
    }
</style>