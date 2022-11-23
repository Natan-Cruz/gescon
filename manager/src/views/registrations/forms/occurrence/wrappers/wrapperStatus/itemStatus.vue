<template>
    <li class="item-status">
        <p class="status-code">{{ status.status_code }}</p>
        <p class="status-name">{{ status.status_name }}</p>
        <p class="created-at">{{ status.created_at }}</p>
    </li>
</template>

<script>

export default {
    name: "item-status",
    props:{
        status: Object
    }
}
</script>

<style lang="less" scoped>
    .item-status{
        width: 100%;

        display: grid;
        grid-template-areas: "statusCode statusName createdAt";
        grid-template-columns: 36px repeat(2, 1fr);
        grid-template-rows: auto;
        column-gap: 20px;

        padding: 14px 10px;
        border-bottom: 1px dashed rgba(165, 165, 165, .5);
        &:last-child{
            border:none;
            padding-bottom: 0;
        }
    }

    .status-code{
        grid-area: statusCode;
        text-align: center;
    }
    .status-name{
        grid-area: statusName;
    }
    .created-at{
        grid-area: createdAt;
        text-align: center;
    }
    
    .status-code, .status-name, .created-at{
        font-size: 1.7em;
        align-self: center;
    }
    
</style>