<template>
    <div class="header">
        <div class="content-header" :class="{ 'detail-mode': detail_mode }">
            <!-- arrow back -->
            <button class="button__main button-back" @click="$emit('event-back')">
                <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 24 24" width="36">
                    <path d="M0 0h24v24H0V0z" fill="none"/>
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
            </button>

            <!-- current path -->
            <p class="service_name"> {{ name }} </p>
            
            <button class="button__main button-refresh" @click="$emit('event-refresh')">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                    <path d="M0 0h24v24H0V0z" fill="none"/>
                    <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
            </button>

            <button class="button__main button-more-option" @click="$emit('event-more-detail')">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
            </button>

            <button class="button__main button-close" @click="$emit('event-close')">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    emits: ["event-back", "event-refresh", "event-more-detail"],
    props:{
        name: String,
        path_name: String,
        detail_mode: Boolean
    }
}
</script>

<style lang="less" scoped>
	.header{
        width: 100%;
        height: auto;
        background-color: #fff;
        width: 100%;
        box-shadow: rgba(114, 114, 114, 0.3) 0px 8px 16px -8px;
	}
   
    // Estrutura a header
    .content-header{
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        height: 100%;

		display: grid;
        grid-template-areas: 'back service_name refresh more_option';
        grid-template-columns: auto 1fr repeat(2, 50px);
        grid-template-rows: 100%;

        position: relative;
        
        .button-close{
            display: none;
        }
    }

    .detail-mode{
        grid-template-areas: 'service_name  button_close';
		grid-template-columns: 1fr 50px;

        .service_name{
            margin-left: 20px;
        }
        .button-back, .button-refresh, .button-more-option{
            display: none;
        }

        .button-close{
            display: block;
        }
    }

	.button-back{
		grid-area: back;
        // Herda medidas de header-grid
        & > svg{
            width: 30px;
            height: 30px;
        }
	}

    .service_name{
        grid-area: service_name;
        font-size: 2em;
        font-weight: bold;
        white-space: nowrap;
        text-overflow: clip;
        overflow: hidden;
        align-self: center;
    }

    // BUTTON REFRESH
    .button-refresh{
        grid-area: refresh;
    }
    .button-more-option{
        grid-area: more_option;
    }
    .button-close{
        grid-area: button_close;
    }
</style>