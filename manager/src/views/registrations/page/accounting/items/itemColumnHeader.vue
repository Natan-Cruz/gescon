<template>
    <span class="column-name" @click="handleSort(key_label)">
        <slot />
        <div class="arrows" :class="setClass(key_label)">
            <!-- <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m7 14 5-5 5 5Z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m12 15-5-5h10Z"/></svg> -->
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m9 18-6-6 6-6 1.4 1.4L6.8 11H21v2H6.8l3.6 3.6Z"/></svg>
        </div>
    </span>
</template>

<script>
export default {
    props: { key_label: String, sortPreferences: Object },
    setup(props, { emit }){

        function handleSort(columnName){
            emit("event-sort-column", columnName)
        }
        function setClass(columnName){
            if(props.sortPreferences.columnName === columnName){
                if(props.sortPreferences.sortOrder === 1) return "arrow-up"
                if(props.sortPreferences.sortOrder === -1) return "arrow-down"
            }

        }

        return {
            handleSort,
            setClass
        }
    }
}
</script>

<style lang="less" scoped>
    // display flex herdado do grid-header 
    .column-name{
        width: 100%;
        cursor: pointer !important;

        &:hover{
            background-color: rgb(240, 240, 240);
        }
    }
    .arrows{
        display: flex;
        flex-direction: column;

        svg{
            fill: gray;
            opacity: 0;
            transition: transform 120ms;
        }
    }
    // 90 deg to bottom
    // -90 deg to top

    .arrow-up{
        svg:first-child{
            opacity: 1;
            transform: rotate(-90deg);
        }
    }
    .arrow-down{
        svg:last-child{
            opacity: 1;
            transform: rotate(90deg);
        }
    }
</style>