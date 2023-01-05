<template>
  <div class="floor-list">
    <floor-item v-for="floor in floors" :floor="floor" :key="floor.num" />
  </div>
</template>

<script>
import FloorItem from "@/components/FloorItem";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: { FloorItem },
  props: {
    floorCount: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      floors: "getArrayFloors",
    }),
  },
  methods: {
    ...mapMutations({
      setInitFloors: "setInitFloors",
    }),
  },
  beforeMount() {
    window.localStorage.clear();
    if (!this.floors.length) {
      this.setInitFloors(this.floorCount);
    }
  },
};
</script>

<style scoped>
.floor-list {
  flex: 1;
  display: grid;
  min-height: 100vh;
  height: 100%;
}
</style>
