<template>
    <div>
        <div class="display_flex" style="align-items: flex-start;">
            <div class="ctn-image">
                <div v-if="isLoading" class="skeleton-text" style="width: 50px; height: 50px; display: block; margin-right: 10px;"></div>
                <img v-else :src="getImgUrl(weatherData.description)">
            </div>
            <div style="width: calc(100% - 60px); max-width: 240px">
                <template v-if="isLoading">
                    <p class="skeleton-text" style="width: 180px; height: 20px; display: block; margin-bottom: 6px;"></p>
                    <p class="skeleton-text" style="width: 120px; height: 18px; display: block; margin-bottom: 6px;"></p>
                    <p class="skeleton-text" style="width: 120px; height: 18px; display: block; margin-bottom: 6px;"></p>
                    <p class="skeleton-text" style="width: 120px; height: 18px; display: block; margin-bottom: 6px;"></p>
                </template>
                <template v-else>
                    <p class="description row">{{ weatherData.description }}</p>
                    <div class="display_flex row"  style="justify-content: space-between">
                        <div>
                            <span class="key" style="color: gray">Atual:</span>
                            <span class="value">{{ weatherData.temp }}º</span>
                        </div>
                        <div>
                            <span class="key" style="color: gray">Max:</span>
                            <span class="value" >{{ weatherData.forecast[0].max }}º</span>
                        </div>
                        <div>
                            <span class="key" style="color: gray">Min:</span>
                            <span class="value" >{{ weatherData.forecast[0].min }}º</span>
                        </div>
                    </div>
                    <div class="row">
                        <span class="key" style="color: gray">Vento:</span>
                        <span class="value" >{{ weatherData.wind_speedy }}</span>
                    </div>
                    <div class="row">
                        <span class="key" style="color: gray">Humidade:</span>
                        <span class="value" >{{ weatherData.humidity }}%</span>
                    </div>
                </template>
            </div>
        </div>
    </div>
    <ul v-if="isShowingMore">
        <p class="sub-title">Previsões para semana</p>
        <li class="item-forecast display_flex" v-for="(forecast, i ) in weatherData.forecast" :key="i">
            <img :src="getImgUrl(forecast.description)">
            <div style="width: calc(100% - 60px); max-width: 140px">
                <p class="description row">{{ forecast.description }}</p>
                <div class="row">
                    <span class="key" style="color: gray">Dia:</span>
                    <span class="value" >{{ forecast.weekday }}</span>
                </div>
                <div class="display_flex row" style="justify-content: space-between">
                    <div>
                        <span class="key" style="color: gray">Max:</span>
                        <span class="value" >{{ forecast.max }}º</span>
                    </div>
                    <div>
                        <span class="key" style="color: gray">Min:</span>
                        <span class="value" >{{ forecast.min }}º</span>
                    </div>
                </div>
            </div>
        </li>
    </ul>
</template>

<script>
export default {
    emits: ["refresh-masonry"],
    props: {
        weatherData: {
            type: Object,
            require: false,
            default: () => {}
        },
        isLoading: Boolean,
        isShowingMore: Boolean
    },
    setup(){

        function getImgUrl(weatherCondition){
            let name = '';
            switch(weatherCondition){
                case "Neve": name = "cloudy_with_light_snow"; break
                case "Parcialmente nublado": name = "sunny_intervals"; break
                case "Tempo nublado": name = "white_cloud"; break
                case "Chuvas esparsas": name = "cloudy_with_light_rain"; break
                case "Chuvas": name = "cloudy_with_heavy_rain"; break
                case "Chuva": name = "cloudy_with_heavy_rain"; break
                case "Tempo limpo": name = "sunny"; break
            }

            if(!name) return ""

            var images = require.context('../../../assets/svg', false, /\.svg$/)
            return images('./' + name + ".svg")
        }

        return { 
            getImgUrl
        }
    }
}
</script>

<style lang="less" scoped>
    .display_flex{
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .ctn-image{
        img {
            width: 60px;
            margin-left: -10px;
        }
    }
    .description{
        font-size: 1.8em;
        line-height: 1em;
        color: rgb(71, 71, 71);
    }

    .row{
        margin-bottom: 6px;
    }
    .key, .value{
        font-size: 1.5em;
    }
    .value{
        margin-left: 6px;
    }

    .sub-title{
        font-size: 1.8em;
        margin: 16px 0 6px 0;
        font-weight: bold;
    }
    // item forecast
    .item-forecast{
        img {
            width: 40px;
            margin-left: -10px;
            margin-right: 10px;
        }

        .description{
            font-size: 1.7em;
        }

        border-bottom: dashed 2px rgb(168, 168, 168);
        margin-bottom: 12px;
        padding-bottom: 12px;

        &:last-child{
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
    }

    // 

    .ctn-show-more{
        height: calc(100% - 41px - 110px);
        border-top: solid 1px rgb(179, 179, 179);
        margin-top: 10px;
        .button{
            height: auto;
            margin-top: 8px;
        }
    }
</style>