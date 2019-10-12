<template>
    <div class="activity">
        <div class="recent-activity">
            <h2 class="mt-3">Fund Sendy Wallet</h2>

            <tl-input class="amount" placeholder="Enter Amount" />

            <button class="btn mt-5">Continue</button>

            <p class="mt-5 text-center pt-5">
                Having your wallet funded keeps your contacts credited recurrently
            </p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .activity{
        min-height: 100vh;
    }
    .recent-activity{
        padding: 20px;
        background-color: white;
        height: 800px;
        border-radius: 20px 20px 0px 0px;  
        .amount{
            margin-bottom:80px
        }
        h2{
            font-size: 17px;
            margin-bottom:120px;
        }
    }
</style>