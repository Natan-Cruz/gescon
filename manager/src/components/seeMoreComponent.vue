<template>
    <div>
        <div class="see-more" :style="!isShow && `max-height: ${ ctnHeight }px` ">
            <span class="span" ref="span">
                <slot />
            </span>
        </div>
        <button v-if="showButton" class="button-see-more" @click="isShow = !isShow">Mostrar {{ isShow ? 'menos' : 'mais' }}</button>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue'
export default {
    props: {
        maxHeight: {
            type: Number,
            required: false,
            default: 36
        }
    },
    setup(props){
        const isShow = ref(false);
        const showButton = ref(false);
        const span = ref(null);
        const ctnHeight = ref(0);

        onMounted(() => {
            const { height } = span.value.getBoundingClientRect();
            showButton.value = height > props.maxHeight
            const fontHeight = getFontHeight();
            const ratio = Math.floor(props.maxHeight / fontHeight) 
            ctnHeight.value = (ratio * fontHeight)
        })

        function getFontHeight(){
            var el = span.value
            var style = window.getComputedStyle(el, null).getPropertyValue('line-height');
            var fontSize = parseFloat(style); 
            // now you have a proper float for the font size (yes, it can be a float, not just an integer)
            return fontSize ;
        }

        return {
            isShow,
            showButton,
            span,
            ctnHeight
        }
    }
}
</script>
<style lang="less" scoped>
    .see-more{
        font-size: 1em;
        line-height: 1em;
        overflow: hidden;
    }
    span, p{
        font-size: 1em;
        line-height: 1em;
    }

    .button-see-more{
        font-weight: bold;
        color: #2A96D2;
        margin-top: 4px;
        padding-top: 4px;
        border: none;
        background-color: #fff;
        font-size: 1em;
        line-height: 1em;

        border-top: dashed 1px gray;
        cursor: pointer;
    }
</style>