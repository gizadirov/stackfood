<template>
    <nav class="secondary_nav sticky_horizontal">
        <div class="container">
            <ul id="secondary_nav" style="line-height: 37px">
                <li v-for="categorie in categories" :key="categorie.id"><a :href="'#section-' + categorie.id">{{ categorie.name }}</a></li>
            </ul>
        </div>
        <span></span>
    </nav>
</template>

<script>
    export default {
        props: ["categories"]
    }
</script>
