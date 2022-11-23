<template>
    <div class="wrapper-scope">
        <div class="row">
            <input type="radio" class="input-radio" name="scope-occur" id="scope-occur-internal" value="internal" v-model="IScope" :disabled="disabled">
            <label for="scope-occur-internal" class="label" :class="{ 'disabled': disabled }">Interno</label>
        </div>

        <div class="row">
            <input type="radio" class="input-radio" name="scope-occur" id="scope-occur-external" value="external" v-model="IScope" :disabled="disabled">
            <label for="scope-occur-external" class="label" :class="{ 'disabled': disabled }">Externo</label>
        </div>
    </div>
</template>

<script>
import { computed, onMounted } from 'vue'
export default {
    name: "wrapper-scope",
    props: {
        scope: String,
        disabled: Boolean
    },
    setup(props, { emit }){
        const IScope = computed({
            get: () => props.scope,
            set: scope => emit("set", scope)
        })

        onMounted(() => {
            if(!props.scope) IScope.value = "internal"
        })

        return {
            IScope
        }
    }
}
</script>

<style lang="less" scoped>
    @input-measures: 17px;
    .row{
        display: flex;
        align-items: center;

        &:first-child{
            margin-bottom: 6px;
        }
    }
    .input-radio{
        width: @input-measures;
        height: @input-measures;

        &:checked + .label{
            color: #ea8832;
            font-weight: bold;
        }
    }
    .label{
        font-size: 1.7em;
        margin-left: 12px;
    }
    .disabled{
        color: gray;
    }
</style>