<template>
    <div>
        <GreyNavbar title="Add New Contact">
            <button class="p-0" slot="trailing">
                Delete
            </button>
        </GreyNavbar>

        <div class="new-contact">
            <p class="text-center">
                Enter recipient's name, phone number and airtime frequency
            </p>

            <tl-input class="mt-5" placeholder="Name" />
            <tl-input class="mt-5" placeholder="Phone" type="tel" />
            <tl-input class="mt-5" placeholder="Airtime Amount" type="number" />
            <div class="row mt-4 mb-5">
                <div class="col-6">
                    <tl-input placeholder="Start Date" type="date" />
                </div>
                <div class="col-6">
                    <tl-input placeholder="End Date" type="date" />
                </div>
            </div>
            <div class="frequency mb-5">
                <div>Frequency</div>
                <div class="freq">
                    Daily
                </div>
                <div class="freq">
                    Weekly
                </div>
                <div class="freq">
                    Monthly
                </div>
            </div>
            <div>
                Status (Active)
            </div>

            <button class="btn mt-5">Save Changes</button>
        </div>

    </div>
</template>

<style lang="scss" scoped>
    .new-contact{
        margin-top: 55px;
        padding: 20px;
        .freq{
            padding:10px 0;
            border-bottom:1px solid #E6EDFF;
            color:#030039;
            font-size:16px;
            font-weight:bold
        }
    }
</style>