<template>
    <figure><img :src="'https://stackfood-admin.6amtech.com/storage/app/public/product/' + image" data-src="img/menu-thumb-1.jpg" alt="thumb" class="lazy"></figure>
    <h3>{{ name }}</h3>
    <p>{{ description }}</p>
    <span v-if="hasDiscount">
        <strong>${{ discounted_price }}&nbsp;<s>${{ normalPrice }}</s></strong>
    </span>
    <span v-else>
        <strong>${{ normalPrice }}</strong>
    </span>
</template>

<script>
    export default {
        props: ["product"],
        data() {
            return {
                name: undefined,
                description: undefined,
                image: undefined,
                hasDiscount: false,
                normalPrice: undefined,
                discounted_price: undefined
            }
        },
        created() {
            this.name = this.product.name;
            this.description = this.product.description;
            this.image = this.product.image;
            this.normalPrice = this.product.price;
            if (this.product.discount !== 0) {
                this.hasDiscount = true;
                if (this.product.discount_type == 'percent') {
                    this.discounted_price = Math.round(this.product.price - this.product.price * this.product.discount / 100);
                } else if (this.product.discount_type == 'amount') {
                    this.discounted_price = this.product.price - this.product.discount;
                }
            }
        }
    }
</script>
