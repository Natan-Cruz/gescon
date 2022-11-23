<template>
     <span class="menu-hamburger no_highlights" @click="$emit('event-open-menu')"> 
         <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
    </span>
</template>

<script>
export default {
    name: 'menu-hamburger',
}
</script>

<style lang="less" scoped>
    .menu-hamburger{
        display: block;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        transition: 100ms;
        padding: 3px;
        cursor: pointer;
        user-select: none;
        // margin-right: 4px;
        // Pela sobreposição 
        // position: absolute;
        
        svg{
            width: 100%;
            height: 100%;
            pointer-events: none;
        }
    }
</style>