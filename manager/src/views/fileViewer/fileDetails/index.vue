<template>
    <div class="file-details">
        <p class="sub-title">Informações do arquivo:</p>
            
        <ul class="list-informations" style="margin-bottom: 24px;">
            <li class="list-item">
                <p class="key">Nome do arquivo:</p>
                <p class="value">{{ file.file_name }}</p>
            </li>
            <li class="list-item">
                <p class="key">tipo:</p>
                <p class="value">{{ file.file_type }}</p>
            </li>
            <li class="list-item">
                <p class="key">Criada em:</p>
                <p class="value">{{ new Date(file.uploaded_at).toLocaleString() }}</p>
            </li>
            <li class="list-item">
                <p class="key">Caminho completo:</p>
                <p class="value">{{ file.path_name }}</p>
            </li>
        </ul>
    </div>
</template>

<script>

export default {
    name: "file-details",
    props:{
        file: Object
    }
}
</script>

<style lang="less" scoped>
    .wrapper{
        width: 100%;
        height: 100%;
        overflow:auto; 
        padding: 20px;
    }
    .title{
        font-size:2em;
        margin-bottom: 10px;
        text-align: center;
    }
    .sub-title{
        font-size: 1.8em;
        font-weight: bold;
        color: #555;
    }

    .list-informations{
        margin: 12px 0;
    }
    .list-item{
        border-bottom: 1px dashed #bebebe;
        padding: 10px 0;
      
        p{
            font-size: 1.8em;
        }
        .key{
            font-weight: bold;  
            display: inline-block;
            text-align: right;
            width: 160px;
            margin-right: 12px;
        }
        .value{
            display: inline-block;
            color: #707070;
        }
    }

    .span-title{
        position: relative;
        &:first-child::before{
            content: "";
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #696969;
            display: block;
            position: absolute;
            top: 8px;
            left: 0;
        }
        &:first-child{
            padding-left: 10px;
        }
        &:last-child{
            color: #a9a9a9;
            margin-left: 10px;
        }
    }
    .ctn-button{
        height: 50px;
        position:relative;
        margin-top: 20px;
    }
    .button{
        width: 180px;
        position: absolute;
        right: 0
    }
</style>