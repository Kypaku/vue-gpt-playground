<template>
  <div class="query-settings">
    Query-settings
    <select size="4" name="max_tokens" @input="show()" v-model="tokens">
      <option disabled>max_tokens</option>
      <option value="10">10</option>
      <option value="200">200</option>
      <option value="500">500</option>
      <option value="1000">1000</option>
    </select>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, ref } from "vue";

export default defineComponent({
  props: {
    opts: Object,
    changeMaxTokens: Function,
  },
  components: {},
  data() {
    return {
      tokens: "300",
      value: String,
    };
  },
  computed: {},
  methods: {
    show() {
      console.log("CHILD", this.tokens);
      if (this.changeMaxTokens) this.changeMaxTokens(+this.tokens);
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
