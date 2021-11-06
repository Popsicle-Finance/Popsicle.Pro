<template>
    <div class="application-success">
        <div class="popup-content">

            <img src="@/assets/images/close-popup-icon.svg" alt="" class="close-btn" @click="closePopup">

            <h4>Submission successful</h4>
            <p class="subtitle">You will be contacted via email</p>

            <img src="@/assets/images/app_popus_success.png" alt="" class="main-img">
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        closePopup() {
            this.$emit('closePopup')
        }
    }
}
</script>

<style lang="scss" scoped>
.application-success {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 500;
    display: grid;
    place-items: center;
    overflow-y: auto;
    padding: 70px 10px;
    background: rgba(0, 0, 0, 0.1);

    .popup-content {
        width: 95%;
        max-width: 520px;
        background-color: #fff;
        background-clip: padding-box;
        background: radial-gradient(
            151.64% 121.34% at 47.19% -0.63%,
            rgba(255, 255, 255, 0.8) 0%,
            rgba(255, 255, 255, 0.2) 100%
        );
        box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.05);
        backdrop-filter: blur(42px);
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px;
        padding-bottom: 70px;
        text-align: center;
        position: relative;

        .close-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            cursor: pointer;
            transition: all .3s ease;
            width: 18px;
            height: 18px;
            object-fit: contain;

            &:hover {
                transform: scale(1.1);
            }
        }

        h4 {
            margin-bottom: 10px;
            // color: #252423;
        }

        .subtitle {
            font-size: 16px;
            margin: 0;
            color: #868686;
        }

        .main-img {
            width: 220px;
            height: auto;
            margin: 30px;
        }
    }
}

@media screen and(max-width: 480px) {
    .application-success .popup-content {
        padding-left: 15px;
        padding-right: 15px;
        padding-bottom: 30px;

        .close-btn {
            top: 15px;
            right: 15px;
            width: 15px;
            height: 15px;
        }
    }
}
</style>