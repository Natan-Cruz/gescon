<template>
    <div class="header">
        <div class="container-header">
            <div class="content-header">
                <!-- arrow back -->
                <button class="button__main button-back" @click="$emit('event-back')">
                    <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 24 24" width="36">
                        <path d="M0 0h24v24H0V0z" fill="none"/>
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                </button>
                
                <button class="button__main button-refresh" @click="$emit('event-refresh')">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                        <path d="M0 0h24v24H0V0z" fill="none"/>
                        <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    emits: ["event-back", "event-refresh", "event-more-detail"]
}
</script>

<style lang="less" scoped>
    // 
	.header{
        width: 100%;
        height: auto;
	}
    // Delimita e coloca uma sombra em toda "header"
    .container-header{
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
        grid-template-areas: 'back service_name refresh';
        grid-template-columns: auto 1fr 50px;
        grid-template-rows: 100%;

        position: relative;
    }
	.button-back{
		grid-area: back;
        // Herda medidas de header-grid
        &>svg{
            width: 30px;
            height: 30px;
        }
	}
    // BUTTON REFRESH
    .button-refresh{
        grid-area: refresh;
    }
</style>