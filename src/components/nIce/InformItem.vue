<template>
    <div class="inform-item">
        <p>{{ title }}</p>
        <p>{{ value }}</p>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        },
        value: {
            default: 0
        }
    },
}
</script>

<style lang="scss" scoped>
.inform-item {
    margin-top: 10px;
    border: 0.2px solid #A4DEFF;
    box-sizing: border-box;
    border-radius: 8px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    p {
        font-size: 14px;
        margin: 0;
    }
}
</style>