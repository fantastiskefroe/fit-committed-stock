<script lang="ts">
  export default {

    data() {
      return {
        lines: [] as string[]
      }
    },
    methods: {
      refetch() {
        fetch("https://shopify-data.it.fantastiskefroe.dk/orders").then(
          data => {
            console.log(data);
          }
        ).catch(err => this.lines = ["foo"])
      }
    },
    mounted() {
      // methods can be called in lifecycle hooks, or other methods!
      this.refetch()
    }
  }

</script>

<template>
  <div class="container">
    <div class="row my-5">
      <h1 class="display-4">Committed stock</h1>
      <button class="btn-primary" @click="refetch()"></button>
    </div>

    <div class="row mb-3 justify-content-center">
      <ul>
        <li>Stock 1</li>
        <li>Stock 2</li>
        <li>Stock 3</li>
        <li>Stock 4</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
</style>
