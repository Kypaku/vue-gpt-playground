<template>
    <div class="query-settings">
        <h3>Query-settings</h3>
        <div class="settingsWrapper">
            <input
                type="number"
                name="max_tokens"
                min="50"
                max="1000"
                placeholder="200"
                :value="value?.max_tokens"
                @input="
                    $emit('update:value', {
                        ...value,
                        max_tokens: +$event.target?.value,
                    }),
                        show()
                "
            />
            <input
                type="number"
                name="temperature"
                min="0"
                max="2"
                step="0.1"
                placeholder="select temperature"
                :value="value?.temperature"
                @input="
                    $emit('update:value', {
                        ...value,
                        temperature: +$event.target?.value,
                    })
                "
            />
            <input
                type="number"
                name="n"
                min="0"
                max="5"
                placeholder="select number of completions"
                :value="value?.n"
                @input="
                    $emit('update:value', {
                        ...value,
                        n: +$event.target?.value,
                    })
                "
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { CreateCompletionRequest } from "openai";

export default defineComponent({
    props: {
        value: Object as PropType<Partial<CreateCompletionRequest>>,
        changeMaxTokens: Function,
    },
    components: {},
    data() {
        return {};
    },
    computed: {
        // getOptsNames() {
        //    return Object.keys(this.value);
        // },
    },
    methods: {
        show() {
            console.log(this.value);
            // if (this.changeMaxTokens) this.changeMaxTokens();
        },
    },
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
