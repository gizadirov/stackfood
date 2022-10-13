<template>
    <div class="box_order mobile_fixed">
        <div class="head">
            <h3>Order Summary</h3>
            <a href="#0" class="close_panel_mobile"><i class="icon_close"></i></a>
        </div>
        <!-- /head -->
        <div class="main">
            <ul class="clearfix">
                <li v-for="product, index in $store.state.cart_list" :key="index"><a href="#" @click="removeFromCart(product.id)">{{ product.quantity }}x {{ product.product.name }}</a><span>${{ product.discounted_price }}</span></li>
            </ul>
            <ul class="clearfix">
                <li>Subtotal<span>${{ subtotal }}</span></li>
                <li>Delivery fee<span>$10</span></li>
                <li class="total">Total<span>${{ total }}</span></li>
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
            removeFromCart(productId) {
                console.log(productId)
            }
        },
        computed: {
            subtotal() {
                let sum = 0;
                this.$store.state.cart_list.forEach((product) => { sum += product.discounted_price; });
                return sum;
            },
            total() {
                //delivey fee
                return this.subtotal + 10;
            }
        }

    }
</script>
