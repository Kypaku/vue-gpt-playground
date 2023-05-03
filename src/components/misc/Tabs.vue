<template>
    <ul class="tabs flex items-center">
        <li
            class="tab px-4 py-2 cursor-pointer flex-grow text-center bg-gray-50 hover:bg-gray-200"
            :class="{'active bg-gray-200': value ? (value === tab.value) : i === 0}"
            v-for="(tab, i) in tabs" :key="i"
            @click="$emit('update:value', tab.value)"
        >
            <span class="text-lg" >{{ tab.label }}</span>
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
