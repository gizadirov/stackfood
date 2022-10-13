<template>
    <div class="box_order mobile_fixed">
        <div class="head">
            <h3>Order Summary</h3>
            <a href="#0" class="close_panel_mobile"><i class="icon_close"></i></a>
        </div>
        <!-- /head -->
        <div class="main">
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
                        <div class="col-11">
                            <span class="d-inline-block float-none small">Variations:</span>&nbsp;
                            <span class="px-2 bg-light d-inline-block float-none small" v-for="variation_ in product.variation" :key="variation_.title">{{variation_.title}}: {{variation_.type}}</span>&nbsp;
                        </div>
                    </div>
                    <div class="row" v-if="product.add_ons.length">
                        <div class="col-1"></div>
                        <div class="col-11">
                            <span class="d-inline-block float-none small">Addons:</span>&nbsp;
                            <span class="px-2 bg-light d-inline-block float-none small" v-for="addon_ in product.add_ons" :key="addon_.title">{{addon_.quantity}}x {{addon_.name}}</span>&nbsp;
                        </div>
                    </div>
                </li>
            </ul>
            <ul class="clearfix">
                <li>Subtotal<span>${{ getFormattedPrice(subtotal) }}</span></li>
                <li>Delivery fee<span>$10</span></li>
                <li class="total">Total<span>${{ getFormattedPrice(total) }}</span></li>
            </ul>
            <div class="row opt_order">
                <div class="col-6">
                    <label class="container_radio">
                        Delivery
                        <input type="radio" value="option1" name="opt_order" checked>
                        <span class="checkmark"></span>
                    </label>
                </div>
                <div class="col-6">
                    <label class="container_radio">
                        Take away
                        <input type="radio" value="option1" name="opt_order">
                        <span class="checkmark"></span>
                    </label>
                </div>
            </div>
            <div class="dropdown day">
                <a href="#" data-bs-toggle="dropdown">Day <span id="selected_day"></span></a>
                <div class="dropdown-menu">
                    <div class="dropdown-menu-content">
                        <h4>Which day delivered?</h4>
                        <div class="radio_select chose_day">
                            <ul>
                                <li>
                                    <input type="radio" id="day_1" name="day" value="Today">
                                    <label for="day_1">Today<em>-40%</em></label>
                                </li>
                                <li>
                                    <input type="radio" id="day_2" name="day" value="Tomorrow">
                                    <label for="day_2">Tomorrow<em>-40%</em></label>
                                </li>
                            </ul>
                        </div>
                        <!-- /people_select -->
                    </div>
                </div>
            </div>
            <!-- /dropdown -->
            <div class="dropdown time">
                <a href="#" data-bs-toggle="dropdown">Time <span id="selected_time"></span></a>
                <div class="dropdown-menu">
                    <div class="dropdown-menu-content">
                        <h4>Lunch</h4>
                        <div class="radio_select add_bottom_15">
                            <ul>
                                <li>
                                    <input type="radio" id="time_1" name="time" value="12.00am">
                                    <label for="time_1">12.00<em>-40%</em></label>
                                </li>
                                <li>
                                    <input type="radio" id="time_2" name="time" value="08.30pm">
                                    <label for="time_2">12.30<em>-40%</em></label>
                                </li>
                                <li>
                                    <input type="radio" id="time_3" name="time" value="09.00pm">
                                    <label for="time_3">1.00<em>-40%</em></label>
                                </li>
                                <li>
                                    <input type="radio" id="time_4" name="time" value="09.30pm">
                                    <label for="time_4">1.30<em>-40%</em></label>
                                </li>
                            </ul>
                        </div>
                        <!-- /time_select -->
                        <h4>Dinner</h4>
                        <div class="radio_select">
                            <ul>
                                <li>
                                    <input type="radio" id="time_5" name="time" value="08.00pm">
                                    <label for="time_1">20.00<em>-40%</em></label>
                                </li>
                                <li>
                                    <input type="radio" id="time_6" name="time" value="08.30pm">
                                    <label for="time_2">20.30<em>-40%</em></label>
                                </li>
                                <li>
                                    <input type="radio" id="time_7" name="time" value="09.00pm">
                                    <label for="time_3">21.00<em>-40%</em></label>
                                </li>
                                <li>
                                    <input type="radio" id="time_8" name="time" value="09.30pm">
                                    <label for="time_4">21.30<em>-40%</em></label>
                                </li>
                            </ul>
                        </div>
                        <!-- /time_select -->
                    </div>
                </div>
            </div>
            <!-- /dropdown -->
            <div class="btn_1_mobile">
                <a href="order.html" class="btn_1 gradient full-width mb_5">Order Now</a>
                <div class="text-center"><small>No money charged on this steps</small></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            decProductCart(store_id) {
                this.$store.commit('dec_product_from_cart', store_id);
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
            }
        },
        computed: {
            subtotal() {
                let app = this;
                let sum = 0;
                this.$store.state.cart_list.forEach((product) => { sum += app.getTotalProductPrice(product); });
                return sum;
            },
            total() {
                //delivery fee
                return this.subtotal + 10;
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
</style>