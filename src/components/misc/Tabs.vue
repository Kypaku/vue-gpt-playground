<template>
    <ul class="tabs flex items-center">
        <li
            class="tab px-2 py-1 cursor-pointer"
            :class="{active: value ? (value === tab.value) : i === 0}"
            v-for="(tab, i) in tabs" :key="i"
            @click="$emit('update:value', tab.value)"
        >
            <span>{{ tab.label }}</span>
        </li>
    </ul>
</template>

<script lang='ts'>
    import { defineComponent, PropType } from "vue"
    ;

    export interface ITab {
        label: string
        value: string
    }

    export default defineComponent({
        props: {
            tabs: Object as PropType<ITab[]>,
            value: String,

        },
        components: {

        },
        data() {
            return {

            };
        },
        computed: {

        },
        methods: {

        },

        watch: {

        },
    });

    </script>

<style lang="scss" scoped>
    .active{
        border-bottom: 2px solid rgb(102, 102, 102);
    }

</style>
