<template>
    <div class="container-buttons">
        <div class="ctn-buttons">
            <div v-show="isShow">
                <div class="background" @click="!isLoading && $emit('close')"></div>

                <ul class="wrapper-popup" :class="{ 'no-events': isLoading }">
					<slot />
                </ul>

            </div>
            <button class="btn-circle no_highlights" @click="isShow ? $emit('close') : $emit('open')" :class="{ 'is-open': isShow }" :disabled="isLoading">
                <span class="icon-plus" v-if="!isLoading">&#43;</span>
                <span class="spinner-loading" v-else></span>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'button-circle',
	emits: ['open', 'close'],
	props: {
		isShow: Boolean,
		isLoading: {
			type: Boolean,
			required: false,
			default: () => false
		}
	}
}
</script>

<style lang="less" scoped src="./button-circle.style.less"></style>
<style lang="less" scoped>
	.container-buttons{
        position: absolute;
        position: fixed;
		bottom: 20px;
		right: 20px;
        z-index: 1;
    }
    .ctn-buttons{
        position: relative;
    }
    .background{
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.4);
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
    }
    .wrapper-popup{
        width: auto;
        height: auto;
        border-radius: 5px;
        background-color: #ffffff;
        position: absolute;
        right: 0;
        bottom: 60px;
    }
	.no-events{
		:deep(li) {
			pointer-events: none;
		}
	}
    :deep(li){
        width: 100%;
        height: 44px;

        font-size: 1.9em;
        color: #FF7900;
        font-weight: bold;
        white-space: nowrap;
        cursor: pointer;

        padding: 10px;
        display:block;
        position: relative;

        border-bottom: 1px dashed rgb(211, 211, 211);

        &:last-child{
            border: none;
        }
    }
    .btn-circle{
        .icon-plus{
            font-size: 1em;
        }
    }
	.is-open{
        transform: rotate(45deg);
		width: 56px !important;
		height: 56px !important;
		bottom: 10px;
		right: 10px;
		border: none;
    }

    .spinner-loading {
        width: 28px;
        height: 28px;
        margin: 0 auto;
        border: solid 4px transparent;
        border-bottom: solid 4px #fff;
        border-radius: 50%;
        transform: rotate(0deg);
        animation: animation-reload 1250ms infinite;
        display: block;
    }

    @keyframes animation-reload {
        to {
            transform: rotate(0deg);
        }
        from {
            transform: rotate(1080deg);
        }
    }
</style>