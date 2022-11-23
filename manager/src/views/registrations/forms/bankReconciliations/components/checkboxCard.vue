<template>
    <div class="checkbox-card" :class="{ 'is-checked': IsChecked, 'is-disabled': disabled }">
        <label :for="uid" class="label"></label>
        <input type="checkbox" name="" :id="uid" class="checkbox" :disabled="disabled" v-model="IsChecked">
        <span class="marker" tabindex="1"></span>
        <span class="text text-medium" :class="{ 'disabled': disabled }">{{ text }}</span>
    </div>
</template>

<script>
export default {
    name: "checkbox-card",
    props: {
        text: {
            type: String
        },
        disabled: {
            type: Boolean
        },
        value: {
            type: String
        },
        roles:{
            type: Array
        }
    },
    data(){
        return {
            IsChecked: false,
            uid: this.$randomID()
        }
    },
    mounted(){
        this.roles.forEach( role => { if(role === this.value) this.IsChecked = true })
    },
    watch: {
        IsChecked(){
            if(this.IsChecked) this.$emit("add", this.value)
            else this.$emit("remove", this.value)
        }
    }
}
</script>

<style lang="less" scoped>
    .checkbox-card{
        width: 100%;
        height: 40px;
        border-radius: 12px;
        border: 1px solid gray;

        display: flex;
        align-items: center;
        flex-direction: row;

        padding: 0 12px;
        position: relative;

    }


    .is-checked{
        border: solid 2px #f70;
        font-weight: bold;
        color: #f70;
    }

    .label{
        width: 100%;
        height: 100%;
        
        position: absolute;
        top: 0;
        left: 0;
        cursor: pointer;

        z-index: 10;
    }   

    @checkbox-measure: 20px;
    .checkbox{
        width: @checkbox-measure;
        height: @checkbox-measure;
        display: none;
        &:checked ~ .marker {
            background-color: #f70;
            border-color: #f70;
        }
        &:checked ~ .marker:after {
            display: block;
        }
    }

    .marker {
        height: @checkbox-measure;
        width: @checkbox-measure;

        position: relative;

        border-radius: 5px;
        border: solid 1px gray;

        margin-right: 12px;
    } 
  
    .marker:after {
        content: "";
        width: 4px;
        height: 10px;
        position: absolute;

        display: none;
        left: 6px;
        bottom: 4px;
        border: solid #fff;
        border-width: 0 3px 3px 0;
        transform: rotate(45deg);
    }
    .disabled{
        color: gray;
    }
</style>