<template>
    <ul class="tabs flex items-center">
        <li
            class="tab px-4 py-2 cursor-pointer flex-grow text-center"
            :class="{
                'active bg-gray-200': value ? value === tab.value : i === 0,
            }"
            v-for="(tab, i) in tabs"
            :key="i"
            @click="handleChangeTab(tab.value)"
        >
            <span class="text-lg" >{{ tab.label }}</span>
        </li>
    </ul>
</template>

<script lang="ts">
    import { defineComponent, PropType } from "vue";

    export interface ITab {
        label: string;
        value: string;
    }

    export default defineComponent({
        props: {
            tabs: Object as PropType<ITab[]>,
            value: String,
        },
        components: {},
        data() {
            return {
                hash: window.location.hash,
            };
        },
        computed: {},
        methods: {
            handleChangeTab(value: string) {
                this.$emit("update:value", value);
                window.location.hash = value;
            },
        },

        watch: {
            // hash: {
            //     handler(newVal: string) {
            //         const hash = newVal;
            //         this.$emit("update:value", hash?.replace("#", "") || "");
            //     },
            //     immediate: true,
            //     deep: true,
            // }
        },

        created () {
            const hash = window.location.hash;
            this.$emit("update:value", hash?.replace("#", "") || "");
        },
    });
</script>

<style lang="scss" scoped>
    .tab{
        background: rgb(214, 249, 231);
        &:hover, &.active{
            background: rgb(216, 242, 227);
        }
    }

.active {
    border-bottom: 2px solid rgb(102, 102, 102);
}
</style>
