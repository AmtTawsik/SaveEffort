<template>
	<div
		class="relative flex gap-32 justify-center items-center p-6 h-screen -left-8">
		<h1 class="font-extrabold text-6xl">Please wait</h1>
		<div class="snippet" data-title="dot-typing">
			<div class="stage">
				<div class="dot-typing"></div>
			</div>
		</div>
	</div>
</template>
<script setup>
	const { Realm } = useRealmApp();

	definePageMeta({
		layout: "blank",
	});

	onMounted(() => {
		Realm.handleAuthRedirect();
	});
</script>

<style>
	.dot-typing {
		position: relative;
		left: -9960px;
		width: 40px;
		height: 40px;
		border-radius: 100%;
		background-color: #9880ff;
		color: #9880ff;
		box-shadow: 9900px 0 0 0 #9880ff, 9960px 0 0 0 #9880ff,
			10020px 0 0 0 #9880ff;
		animation: dot-typing 1.5s infinite linear;
	}

	@keyframes dot-typing {
		0% {
			box-shadow: 9900px 0 0 0 #9880ff, 9960px 0 0 0 #9880ff,
				10020px 0 0 0 #9880ff;
		}
		16.667% {
			box-shadow: 9900px -10px 0 0 #9880ff, 9960px 0 0 0 #9880ff,
				10020px 0 0 0 #9880ff;
		}
		33.333% {
			box-shadow: 9900px 0 0 0 #9880ff, 9960px 0 0 0 #9880ff,
				10020px 0 0 0 #9880ff;
		}
		50% {
			box-shadow: 9900px 0 0 0 #9880ff, 9960px -10px 0 0 #9880ff,
				10020px 0 0 0 #9880ff;
		}
		66.667% {
			box-shadow: 9900px 0 0 0 #9880ff, 9960px 0 0 0 #9880ff,
				10020px 0 0 0 #9880ff;
		}
		83.333% {
			box-shadow: 9900px 0 0 0 #9880ff, 9960px 0 0 0 #9880ff,
				10020px -10px 0 0 #9880ff;
		}
		100% {
			box-shadow: 9900px 0 0 0 #9880ff, 9960px 0 0 0 #9880ff,
				10020px 0 0 0 #9880ff;
		}
	}
</style>
