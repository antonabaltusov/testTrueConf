<template>
  <div class="floor-wrap">
    <div class="floor">
      <div class="num">{{ floor.num + 1 }}</div>
      <button
        @click="HandlerCall"
        class="btn"
        :class="{
          'btn--waiting': floor.waiting,
          'btn--have-lift': floor.haveLift,
        }"
      ></button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    floor: {
      type: Object,
      required: true,
    },
  },
  methods: {
    HandlerCall() {
      if (!this.floor.waiting && !this.floor.haveLift) {
        this.callLift(this.floor.num);
      }
    },
    ...mapActions({
      callLift: "callLift",
    }),
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
.floor {
  display: flex;
  flex-direction: column;
  grid-area: 30px;
  align-items: center;
  width: fit-content;
  margin-left: 30px;
  min-height: 70px;
  &-wrap {
    display: flex;
    align-items: center;
    border-bottom: 1px solid gray;
  }
}
.num {
  font-size: 19px;
  font-weight: 700;
}
.btn {
  border: 3px solid green;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
  &::after {
    content: "";
    width: 50%;
    height: 50%;
    border-radius: 50%;
    background-color: green;
    display: block;
    transition: all 0.2s;
  }
  &:hover {
    & {
      cursor: pointer;
      border-color: rgb(196, 196, 0);
      transform: scale(1.1);
      &::after {
        background-color: rgb(196, 196, 0);
      }
    }
  }
  &--waiting {
    pointer-events: none;
    border-color: orange;
    &::after {
      background-color: orange;
    }
  }
}
</style>
