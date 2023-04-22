<template>
    <div class="query-settings">
        <b>DALL-E settings</b>
        <div class="settingsWrapper flex-col">
            <InputNumber
                name="n"
                min="0"
                max="5"
                :value="value"
                label="number of"
                @update:value="
                    (newVal) =>
                        $emit('update:value', {
                            value,
                            newVal,
                        })
                "
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import InputNumber from "../misc/InputNumber.vue";

export default defineComponent({
    props: {
        value: Number,
    },
    components: {
        InputNumber,
    },
    data() {
        return {};
    },
    computed: {},
    methods: {},
    // mounted() {},
});
</script>

<style lang="scss" scoped>
.query-settings {
    color: #000;
    .settingsWrapper {
        display: flex;
    }
}
</style>
