<template>
  <div class="lift-list">
    <lift-item v-for="lift in lifts" :lift="lift" :key="lift.id" />
  </div>
</template>

<script>
import LiftItem from "@/components/LiftItem";

import { mapGetters, mapMutations } from "vuex";
export default {
  components: { LiftItem },
  props: {
    liftCount: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      lifts: "getArrayLifts",
    }),
  },
  methods: {
    ...mapMutations({
      setInitLifts: "setInitLifts",
    }),
  },
  beforeMount() {
    window.localStorage.clear();
    this.setInitLifts(this.liftCount);
  },
};
</script>

<style lang="scss" scoped>
.lift-list {
  display: flex;
  align-items: stretch;
}
</style>
