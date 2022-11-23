<template>
	<div id="app">
		<router-view></router-view>

		<notifications position="bottom left" classes='global__notifications'/>
	</div>
</template>

<script>
export default{
	name: "app"
}
</script>

<style lang="less">
	@import "./components/styles/button.less";
	@import "./components/styles/buttonWithLoading.less";
	@import "./components/formPage/form.style.less";
	@import "./components/styles/vue3-notification.less";
	@import "./components/styles/transition-route-style.less";

	@background-color: #f1f1f1;

	*{
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		font-size: 10px;
		font-family: 'Roboto', cursive, Arial, sans-serif;
	}
	li{
		list-style: none;
	}
	a{
		text-decoration: none;
	}
	#app{
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}

	.text-medium {
		font-size: 1.7em;
		line-height: 1em;
		cursor: default;
	}

	.bold {
		font-weight: bold;
	}
	.text-15{
		font-size: 1.5em;
		line-height: 1em;
		cursor: default;
	}
	.sub-text {
		font-size: inherit;
		line-height: inherit;
	}
	.no_highlights{
		-webkit-tap-highlight-color: transparent;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	body{
		background-color: @background-color;
	}

	.skeleton {
		position: relative;
		overflow: hidden;
		width: 100%;
		height: 100%;
		background: #ccc;
		display: block;
		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: linear-gradient(90deg, #ccc, #dedede, #ccc);
			animation: progress 1s ease-in-out infinite;
		}
	}

	
	
    .container-error{
        width: 100%;
        height: auto;
        background-color: #FF9494;
        padding: 10px;
        margin-bottom: 20px;
        .msg{
            font-size: 1.7em;
            color: #6b081c
        }
    }

	@keyframes progress {
		0% {
			transform: translate3d(-100%, 0, 0);
		}
		100% {
			transform: translate3d(100%, 0, 0);
		}
	}


	.label{
		font-size: 1.6em;
		display: block;
		margin-bottom: 6px;
		color: #000;
	}
	.input{
		width: 100%;
		height: 40px;
		border-radius: 3px;
		border: 1px solid rgba(210, 210, 210);
		font-size: 1.6em;
		padding: 0 6px;
		outline: none;

		&:focus{
			box-shadow: inset 0 0 4px 0px #cbcbcb;
		}

		&:disabled{
			border-color: #fff;
			border-bottom: 1px solid rgba(165, 165, 165, .5);
			background-color: #fff;
			color: #303030;
		}
	}
	.select{
		width: 100%;
		height: 40px;
		border-radius: 3px;
		border: 1px solid rgba(210, 210, 210);
		font-size: 1.6em;
		padding: 0 6px;

		option, & > optgroup{
			font-size: 1em;
		}

		&:disabled{
			border: none;
			border-bottom: 1px solid rgba(210, 210, 210);
		}
	}
	.without-item{
        font-size: 1.7em;
        margin: 10px 0;
        color: rgb(78, 78, 78);
		text-align: center;
		margin-top: 24px;
    }

	// Class original da library
	.modal-container{
		&:extend(.no_highlights);
		background-color: rgba(41, 41, 41, 0.582);
		z-index: 10000
	}
	// Class proprietaria
	
	.global__modal{
		width: 100%;
		height: 100%;


		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		top: 0;
		left: 0;
		
		z-index: 2000;
    }
	.global__background-modal{
		background-color: rgba(0,0,0,.6);
			
		width: 100%;
		height: 100%;

		position: absolute;
		left: 0;
		top: 0;
	}
    .global__wrapper-modal{
        width: 90%;
		max-width: 800px;

		height: auto;
		max-height: 90%;

        padding: 20px;
		position: relative;

        background-color: #fff;
        border-radius: 5px;
		z-index: 100;

		overflow-x: hidden;
		overflow-y: auto;
    }

	.button__main{
        border-radius: 50%;
        width: 50px;
        height: 50px;
        align-self: center;
        cursor: pointer;
        border: none;
        background-color: #fff;
        transition: 150ms;

        &:hover{
            background-color: rgb(230, 230, 230);
        }
        &:active{
            transform: scale(.95);
        }
    }

	.skeleton-text {
		position: relative;
		overflow: hidden;
		background: #ccc;
        color: #ccc;
        display: inline-block;

		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: linear-gradient(90deg, #ccc, #dedede, #ccc);
			animation: progress 1s ease-in-out infinite;
		}
	}
    @keyframes progress {
		0% {
			transform: translate3d(-100%, 0, 0);
		}
		100% {
			transform: translate3d(100%, 0, 0);
		}
    }
</style>
