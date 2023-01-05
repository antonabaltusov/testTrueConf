<template>
  <div class="house">
    <lift-list :liftCount="liftCount" />
    <floor-list :floorCount="floorCount" />
  </div>
</template>

<script>
import FloorList from "@/components/FloorList";
import LiftList from "@/components/LiftList";

export default {
  components: { FloorList, LiftList },
  data() {
    return {
      floorCount: 20,
      liftCount: 7,
    };
  },
  beforeCreate() {
    // window.localStorage.clear();
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.house {
  display: flex;
}
</style>
