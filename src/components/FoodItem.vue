<template>
    <figure><img :src="'https://stackfood-admin.6amtech.com/storage/app/public/product/' + image" data-src="img/menu-thumb-1.jpg" alt="thumb" class="lazy"></figure>
    <h3>{{ name }}</h3>
    <p>{{ description }}</p>
    <span v-if="hasDiscount">
        <strong>${{ discountedPrice }}&nbsp;<s>${{ normalPrice }}</s></strong>
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
                discountedPrice: undefined 
            }
        },
        created() {
            this.name = this.product.name;
            this.description = this.product.description;
            this.image = this.product.image;
            this.normalPrice = this.product.price;
            if (this.product.discount !== 0) {
                this.hasDiscount = true;
                this.discountedPrice = Math.round(this.product.price - this.product.price * this.product.discount / 100);
            } 
        }
    }
</script>
