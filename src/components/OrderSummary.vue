<template>
    <div class="box_order mobile_fixed">
        <div class="head">
            <h3>Order Summary</h3>
            <a href="#0" class="close_panel_mobile"><i class="icon_close"></i></a>
        </div>
        <!-- /head -->
        <div class="main">
            <ul v-if="!thereIsProductsInCart" class="clearfix">
                <li>Please, choose products</li>
            </ul>
            <div v-if="thereIsProductsInCart">
                <ul class="clearfix">
                    <li v-for="product, index in $store.state.cart_list" :key="index">
                        <div class="row">
                            <div class="col-1">
                                <a href="#" @click.prevent="decProductCart(product.store_id)"></a>
                            </div>
                            <div class="col-9">
                                <a class="no_active" href="#" @click="editFoodDetails(product)">
                                    {{ product.quantity }}x {{ product.product.name }}
                                </a>
                            </div>
                            <div class="col-2">
                                <span>${{ getFormattedPrice(getTotalProductPrice(product)) }}</span>
                            </div>
                        </div>
                        <div class="row" v-if="product.variation.length">
                            <div class="col-1"></div>
                            <div class="col-11 d-flex">
                                <div class="small d-flex">Variations:</div>
                                <div class="px-1 mr-1 bg-light small d-flex" v-for="variation_ in product.variation" :key="variation_.title">{{variation_.title}}: {{variation_.type}}</div>
                            </div>
                        </div>
                        <div class="row" v-if="product.add_ons.length">
                            <div class="col-1"></div>
                            <div class="col-11 d-flex">
                                <div class="small d-flex">Addons:</div>
                                <div class="px-1 mr-1 bg-light float-none small d-flex" v-for="addon_ in product.add_ons" :key="addon_.title"><div v-if="addon_.quantity">{{addon_.quantity}}x {{addon_.name}}</div></div>
                            </div>
                        </div>
                    </li>
                </ul>

                <ul class="clearfix">
                    <li>Subtotal:<span>${{ getFormattedPrice(subtotal) }}</span></li>
                    <li>Delivery fee: <span v-if="deliveryFee">${{ deliveryFee }}</span><span v-else>Please, choose date and time</span></li>
                    <li class="total">Total<span>${{ getFormattedPrice(total) }}</span></li>
                </ul>
                <div class="dropdown day">
                    <a href="#" data-bs-toggle="dropdown">Day<span v-if="dayDelivered" class="float-none">: {{ dayDelivered.day }}</span><span id="selected_day"></span></a>
                    <div class="dropdown-menu">
                        <div class="dropdown-menu-content">
                            <h4>Which day delivered?</h4>
                            <div class="radio_select chose_day">
                                <ul>
                                    <li v-for="day, index in deliveryOptions.daysDelivered" :key="day.day" @click="setDayDelivered(index)">
                                        <label for="day_1">
                                            {{day.day}}
                                            <em>
                                                {{ getDiscountString(day.discount, day.discount_type) }}
                                            </em>
                                        </label>
                                    </li>
                                </ul>
                            </div>
                            <!-- /people_select -->
                        </div>
                    </div>
                </div>
                <!-- /dropdown -->
                <div class="dropdown time">
                    <a href="#" data-bs-toggle="dropdown">Time<span v-if="timeDelivered" class="float-none">: {{ timeDelivered.time }}</span> <span id="selected_time"></span></a>
                    <div class="dropdown-menu">
                        <div class="dropdown-menu-content">
                            <div v-for="timespan, index1 in deliveryOptions.timesDelivered" :key="timespan.timespan">
                                <h4>{{ timespan.timespan }}</h4>
                                <div class="radio_select add_bottom_15">
                                    <ul>
                                        <li v-for="time, index2 in timespan.times" :key="time.time" @click="setTimeDelivered(index1, index2)">
                                            <label for="time_1">
                                                {{ time.time }}
                                                <em>
                                                    {{ getDiscountString(time.discount, time.discount_type) }}
                                                </em>
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                                <!-- /time_select -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /dropdown -->
            <div class="btn_1_mobile">
                <a href="#" @click.prevent="orderNow()" class="btn_1 gradient full-width mb_5 disabled" :disabled="!thereIsProductsInCart || !deliveryFee">Order Now</a>
                <div class="text-center" v-show="thereIsProductsInCart"><small>No money charged on this steps</small></div>
            </div>
        </div>
    </div>
</template>

<script>
    const deliveyOptions = {
        deliveryFee: 10,
        daysDelivered: [
            {
                day: "Today",
                discount: 40,
                discount_type: "procent"

            },
            {
                day: "Tomorrow",
                discount: -40,
                discount_type: "procent"

            }
        ],
        timesDelivered: [
            {
                timespan: "LUNCH",
                times: [
                    {
                        time: "12.00",
                        discount: -40,
                        discount_type: "procent"

                    },
                    {
                        time: "12.30",
                        discount: -40,
                        discount_type: "procent"

                    },
                    {
                        time: "13.00",
                        discount: 2,
                        discount_type: "amount"
                    },
                    {
                        time: "13.30",
                        discount: -2,
                        discount_type: "amount"
                    }
                ]
            },
            {
                timespan: "DINNER",
                times: [
                    {
                        time: "20.00",
                        discount: 40,
                        discount_type: "procent"
                    },
                    {
                        time: "20.30",
                        discount: 40,
                        discount_type: "procent"
                    },
                    {
                        time: "21.00",
                        discount: -2,
                        discount_type: "amount"
                    },
                    {
                        time: "21.30",
                        discount: -2,
                        discount_type: "amount"
                    }]
            }
        ]
    };

    export default {
        data() {
            return {
                deliveryOptions: deliveyOptions,
                dayDelivered: this.$store.state.cart_delivery.day,
                timeDelivered: this.$store.state.cart_delivery.time
            }
        },
        methods: {
            decProductCart(store_id) {
                this.$store.commit('dec_product_from_cart', store_id);
            },
            setDayDelivered(index) {
                this.dayDelivered = this.deliveryOptions.daysDelivered[index];
                this.$store.commit('set_delivery_day', this.dayDelivered);

            },
            setTimeDelivered(index1, index2) {
                this.timeDelivered = this.deliveryOptions.timesDelivered[index1].times[index2];
                this.$store.commit('set_delivery_time', this.timeDelivered);
            },
            getDiscountString(amount, discount_type) {
                if (amount == 0) {
                    return symbol;
                }

                let symbol = "";

                if (discount_type == "procent") {
                    symbol = "%";
                } else if (discount_type == "amount") {
                    symbol = "$";
                }

                if (amount > 0) {
                    return `+${amount}${symbol}`;
                } else {
                    return `${amount}${symbol}`;
                }
            },
            getFormattedPrice(price) {
                return price.toFixed(2);
            },
            editFoodDetails(product) {
                this.emitter.emit("edit-food-details", product);
            },
            getTotalProductPrice(product) {
                let totalPrice = 0;
                if (product.variation.length) {
                    product.variation.forEach((variation) => {
                        totalPrice += (variation.price - variation.discount_amount) * product.quantity;
                    })
                } else {
                    totalPrice = product.discounted_price * product.quantity;
                }
                if (product.add_ons.length) {
                    product.add_ons.forEach((addon) => { totalPrice += addon.price * addon.quantity; })
                }
                return totalPrice;
            },
            orderNow() {
                alert('Order process')
            }
        },
        computed: {
            deliveryFee() {

                if (this.dayDelivered == null || this.timeDelivered == null) {
                    return 0;
                }

                let deliveryCost = this.deliveryOptions.deliveryFee;

                let discountAmount = 0;

                if (this.dayDelivered.discount_type == "procent") {
                    discountAmount = deliveryCost * this.dayDelivered.discount / 100.0;
                } else if (this.dayDelivered.discount_type == "amount") {
                    discountAmount = this.dayDelivered.discount;
                }
                if (this.timeDelivered.discount_type == "procent") {
                    discountAmount += deliveryCost * this.timeDelivered.discount / 100.0;
                } else if (this.timeDelivered.discount_type == "amount") {
                    discountAmount += this.timeDelivered.discount;
                }

                return this.getFormattedPrice(deliveryCost + discountAmount);
            },
            thereIsProductsInCart() {
                return this.$store.state.cart_list.length > 0;
            },
            subtotal() {
                let app = this;
                let sum = 0;
                this.$store.state.cart_list.forEach((product) => { sum += app.getTotalProductPrice(product); });
                return sum;
            },
            total() {
                return this.subtotal + parseFloat(this.deliveryFee);
            }
        }
    }
</script>
<style>
    .box_order a.no_active:before {
        content: none !important;
    }

    .box_order a.no_active {
        padding-left: 0 !important;
    }

    .box_order .main ul li a:before {
        top: -12px !important;
    }

    a.btn_1.gradient[disabled="true"] {
        background-image: linear-gradient(to right, #aaaaaa, #dddddd);
        color: gray;
        /* And disable the pointer events */
        pointer-events: none;
    }
</style>