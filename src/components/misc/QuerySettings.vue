<!-- eslint-disable no-tabs -->
<!-- eslint-disable vue/script-indent -->
<!-- eslint-disable vue/script-indent -->
<!-- eslint-disable no-tabs -->
<!-- eslint-disable vue/html-indent -->
<!-- eslint-disable no-tabs -->
<template>
    <div class="query-settings">
        <h3>Query-settings</h3>
        <br />
        <input
            type="number"
            name="max_tokens"
            min="50"
            max="1000"
            placeholder="200"
            value="200"
            @input="$emit('update:value', newOpts), show()"
        />
        <!--<select size="4" name="max_tokens" @input="show()" v-model="tokens">
      <option disabled>max_tokens</option>
      <option value="10">10</option>
      <option value="200">200</option>
      <option value="500">500</option>
      <option value="1000">1000</option>
    </select>-->
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
    computed: {},
    methods: {
        show() {
            if (this.changeMaxTokens) this.changeMaxTokens();
        },
    },
    // mounted() {},
});
</script>

<style lang="scss" scoped>
.query-settings {
    color: #000;
}
</style>
