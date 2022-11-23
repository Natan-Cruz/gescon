<template>
    <ul class="wrapper">
        <p class="title">Obras e seus módulos contratados</p>
        <div class="card" v-for="billing in billings" :key="billing.id">
            <div class="construction-name">{{ billing.construction_name }}</div>
            <ul class="list-modules">
                <item label="Serviços" :selected="activeModule(billing.modules, 'services')">
                    <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 0 48 48" fill="#f70"><path d="M38.4 42 25.85 29.45 28.7 26.6 41.25 39.15ZM9.35 42 6.5 39.15 21 24.65 15.65 19.3 14.5 20.45 12.3 18.25V22.5L11.1 23.7L5 17.6L6.2 16.4H10.5L8.1 14L14.65 7.45Q15.5 6.6 16.5 6.3Q17.5 6 18.7 6Q19.9 6 20.9 6.425Q21.9 6.85 22.75 7.7L17.4 13.05L19.8 15.45L18.6 16.65L23.8 21.85L29.9 15.75Q29.5 15.1 29.275 14.25Q29.05 13.4 29.05 12.45Q29.05 9.8 30.975 7.875Q32.9 5.95 35.55 5.95Q36.3 5.95 36.825 6.1Q37.35 6.25 37.7 6.5L33.45 10.75L37.2 14.5L41.45 10.25Q41.7 10.65 41.875 11.225Q42.05 11.8 42.05 12.55Q42.05 15.2 40.125 17.125Q38.2 19.05 35.55 19.05Q34.65 19.05 34 18.925Q33.35 18.8 32.8 18.55Z"/></svg>
                </item>
                <item label="Materiais" :selected="activeModule(billing.modules, 'materials')">
                    <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 0 48 48" fill="#f70"><path d="M11.2 39.95Q8.75 39.95 7.025 38.225Q5.3 36.5 5.3 34.05H2V11Q2 9.8 2.9 8.9Q3.8 8 5 8H33.95V16.35H39.2L46 25.4V34.05H42.45Q42.45 36.5 40.725 38.225Q39 39.95 36.55 39.95Q34.1 39.95 32.375 38.225Q30.65 36.5 30.65 34.05H17.1Q17.1 36.5 15.375 38.225Q13.65 39.95 11.2 39.95ZM11.2 36.95Q12.4 36.95 13.25 36.1Q14.1 35.25 14.1 34.05Q14.1 32.85 13.25 32Q12.4 31.15 11.2 31.15Q10 31.15 9.15 32Q8.3 32.85 8.3 34.05Q8.3 35.25 9.15 36.1Q10 36.95 11.2 36.95ZM5 31.05H6.1Q6.95 29.7 8.25 28.9Q9.55 28.1 11.15 28.1Q12.75 28.1 14.075 28.925Q15.4 29.75 16.25 31.05H30.95V11H5Q5 11 5 11Q5 11 5 11ZM36.55 36.95Q37.75 36.95 38.6 36.1Q39.45 35.25 39.45 34.05Q39.45 32.85 38.6 32Q37.75 31.15 36.55 31.15Q35.35 31.15 34.5 32Q33.65 32.85 33.65 34.05Q33.65 35.25 34.5 36.1Q35.35 36.95 36.55 36.95ZM33.95 26.75H43.25L37.7 19.35H33.95ZM18 21.55Q18 21.55 18 21.55Q18 21.55 18 21.55Q18 21.55 18 21.55Q18 21.55 18 21.55Q18 21.55 18 21.55Q18 21.55 18 21.55Z"/></svg>
                </item>
                <item label="Ocorrências" :selected="activeModule(billing.modules, 'occurrences')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52">
                        <path id="warning_black_24dp" d="M1,54H53L27,2Zm28.364-8.211H24.636V40.316h4.727Zm0-10.947H24.636V23.895h4.727Z" transform="translate(-1 -2)" fill="#f70"/>
                    </svg>
                </item>
                <item label="Cloud" :selected="activeModule(billing.modules, 'cloud')">
                    <svg id="cloud_black_24dp" xmlns="http://www.w3.org/2000/svg" width="52.1" height="52.1" viewBox="0 0 52.1 52.1">
                        <path id="Caminho_6404" data-name="Caminho 6404" d="M0,0H52.1V52.1H0Z" fill="none"/>
                        <path id="Caminho_6405" data-name="Caminho 6405" d="M26.05,8.342a11.946,11.946,0,0,1,11.7,9.617l.651,3.256,3.321.239a6.477,6.477,0,0,1-.478,12.938H13.025a8.677,8.677,0,0,1-.955-17.3l2.323-.239,1.085-2.062A11.872,11.872,0,0,1,26.05,8.342M26.05,4a16.272,16.272,0,0,0-14.436,8.77,13.02,13.02,0,0,0,1.411,25.963H41.246a10.823,10.823,0,0,0,.76-21.621A16.259,16.259,0,0,0,26.05,4Z" transform="translate(0 4.683)" fill="#f70"/>
                    </svg>
                </item>
            </ul>
        </div>
    </ul>
</template>

<script>
import item from "../components/module.vue"

export default {
    name: "wrapper-billing",
    components: { item },
    props: {
        billings: Array,
    },
    setup(){
        function activeModule(modules, moduleName){
            return modules.findIndex( mName => mName === moduleName ) > -1
        }

        return {
            activeModule
        }
    }
}
</script>

<style lang="less" scoped>
    .card{
        margin-bottom: 12px;

        &:last-child{
            margin-bottom: 0;
        }
    }
    .construction-name{
        font-size: 1.8em;
        font-weight: bold;
        margin-bottom: 8px;
        color: rgb(71, 71, 71);
    }
</style>