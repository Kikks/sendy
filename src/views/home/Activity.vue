<template>
    <div class="activity">
        <div class="header">
            <h3 class="mb-3">Wallet Balance</h3>
            <h1 class="mb-4">NGN4,000</h1>
            <div class="px-5">
                <button class="btn outline">
                    Send Airtime
                </button>
            </div>
        </div>
        <div class="recent-activity">
            <h2 class="mb-4">Recent Actions</h2>
            <div v-for="(n, i) in 7" :key="i" class="activityRow">
                <div class="row activityRowf">
                    <div class="col-6 blue">
                        Airtime Sent
                    </div>
                    <div class="col-6 text-right red">
                        NGN6,000
                    </div>
                </div>
                <div class="row activityRows">
                    <div class="col-6">
                    30 Sep, 2019
                    </div>
                    <div class="col-6 text-right">
                        Cashier Group
                    </div>
                </div>
                 <hr>
            </div>
           
        </div>
    </div>
</template>

<style lang="scss" scoped>
// hr{
//     margin-top: 50px;
// }
    .activity{
        background-color: $primary;
        min-height: 100vh;
    }
    .header{
        background-color: $primary;
        color: white;
        text-align: center;
        padding-top: 30px;
        padding-bottom: 40px;
        h3{
            font-size: 16px;
            color: rgba(255, 255, 255, 0.7);
        }

        h1{
            color: white;
            font-weight: bold;
        }
    }
    .recent-activity{
        padding: 20px;
        background-color: white;
        height: 800px;
        border-radius: 20px 20px 0px 0px;  
        .activityRow{
            padding:5px 0;
            // background-color: red;
            .activityRowf{
                .red{
                    color:#F43939;
                }
                .blue{
                    color:#030039
                }
            }
            .activityRows{
                color:lightgray;
                font-size:14px;
            }
        }

        h2{
            font-size: 17px;
        }
    }
</style>