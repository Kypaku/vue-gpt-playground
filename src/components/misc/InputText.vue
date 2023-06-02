<template>
    <div class="input-text">
        <div class="text-left" >
            <label :for="id" class="mr-2">{{label}}</label>
        </div>
        <div class="text-left">
            <input
                type="text"
                class="border-2 ym-disable-keys text-sm py-1 px-2 rounded w-full"
                :class="{error}"
                ref="input"
                :id="id"
                :value="value"
                v-bind="$attrs"
                :placeholder="placeholder"
                @keydown.tab.exact.prevent="suggestions && suggest(suggestionsFiltered[0])"
                @keypress.enter="$emit('end')"
                @input="ev => $emit('update:value', ev?.target?.value)"/>
            <div class="suggestions suggestions-action cursor-pointer flex flex-wrap justify-center mt-1">
                <div class="dummy">Dummy</div>
                <div
                    class="suggestion mr-2 text-sm"
                    v-for="(item, i) in suggestionsFiltered.slice(0, 7)"
                    :class="{first: !i}"
                    :key="i"
                    @click="$emit('update:value', item.value)">
                    {{item.name}}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
    import { defineComponent, PropType } from "vue";

    function localeIncludes(str1: string, str2: string) {
        return (str1.toLocaleLowerCase && str1.toLocaleLowerCase()).includes(str2.toLocaleLowerCase && str2.toLocaleLowerCase());
    }


    function localeStart(str1: string, str2: string) {
        return !(str1.toLocaleLowerCase && str1.toLocaleLowerCase()).indexOf(str2.toLocaleLowerCase && str2.toLocaleLowerCase());
    }

    export interface InputTextSuggestion {
        name: string
        value: string
    }

    export default defineComponent({
        props: {
            error: {
                type: Boolean,
                default: () => false
            },
            placeholder: String,
            label: String,
            value: String,
            suggestions: Object as PropType<InputTextSuggestion[]>,
        },
        components: {

        },
        data() {
            return {
                id: "input-text" + +new Date()
            };
        },
        computed: {
            suggestionsFiltered() {
                if (!this.suggestions) return [];
                const byStart = this.suggestions.filter((el) => this.value ? localeStart(el.name, this.value) : true);
                const byInclude = this.suggestions.filter((el) => this.value ? localeIncludes(el.name, this.value) : true);
                return [...byStart, ...byInclude];
            },
        },
        methods: {
            suggest(suggestion: InputTextSuggestion) {
                this.$emit("update:value", suggestion.value);
                this.$emit("suggest", suggestion);
            },
        },

        mounted () {
            this.$emit("mounted", this.$refs.input);
        },
    });

    </script>

<style lang="scss" scoped>
    .error{
        @apply border-red-400;
    }

    .first{
        font-weight: 700;
    }
    .suggestion{

    }
    .dummy{
        opacity: 0;
    }
</style>
