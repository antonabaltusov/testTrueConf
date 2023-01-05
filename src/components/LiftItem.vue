<template>
  <div class="lift-wrap">
    <div class="lift-floor" v-for="floor in floors" :key="floor.num">
      <div
        ref="lift"
        v-if="floor.num === 0"
        class="lift"
        :class="{
          'lift--waiting': lift.waiting,
        }"
      >
        <div class="lift-info" v-if="lift.motion">
          <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
          <svg
            :class="{ reverse: !direction }"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="10px"
            height="10px"
            viewBox="0 0 533.333 533.333"
            style="enable-background: new 0 0 533.333 533.333"
            xml:space="preserve"
          >
            <g>
              <path
                d="M266.667,0L0,266.667h166.667v266.665l200,0.001V266.667h166.667L266.667,0z"
              />
            </g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
          </svg>
          <p>{{ goal + 1 }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gsap from "gsap";
import { mapState, mapGetters, mapMutations } from "vuex";
export default {
  props: {
    lift: {
      id: Number,
      floor: Number,
      stack: Array,
      motion: Boolean,
      waiting: Boolean,
      call: Boolean,
    },
  },
  data() {
    return {
      goal: 0,
      direction: true,
    };
  },
  computed: {
    ...mapState({
      floorsCount: (state) => state.floorCount,
      lengthPause: (state) => state.lengthPause,
    }),
    ...mapGetters({
      floors: "getArrayFloors",
    }),
  },
  watch: {
    "lift.call"(newstack) {
      if (newstack === true && !this.lift.motion && !this.lift.waiting) {
        this.motionGo(this.lift.stack[0]);
      }
    },
  },
  methods: {
    ...mapMutations({
      setCurrentFloor: "setCurrentFloor",
      setWaitingFloor: "setWaitingFloor",
      setMotion: "setMotion",
      setWaitingLift: "setWaitingLift",
      removeCallLift: "removeCallLift",
      shiftStackLift: "shiftStackLift",
    }),
    async completeMotion(goalFloor) {
      this.setMotion({ value: false, idLift: this.lift.id });
      this.setWaitingFloor({ value: false, num: goalFloor });
      this.removeCallLift(this.lift.id);
      this.setWaitingLift({ value: true, idLift: this.lift.id });
      this.setCurrentFloor({ goalFloor, idLift: this.lift.id });
      setTimeout(() => {
        this.setWaitingLift({ value: false, idLift: this.lift.id });
        this.shiftStackLift(this.lift.id);
        if (this.lift.stack.length) {
          this.motionGo(this.lift.stack[0]);
        }
      }, this.lengthPause * 1000);
    },
    waitingGo() {},
    motionGo(goalFloor) {
      this.goal = goalFloor;
      const duration = this.lift.floor - goalFloor;
      this.direction = duration > 0 ? false : true;
      const distance =
        (document.documentElement.scrollHeight / this.floorsCount) * goalFloor;
      this.setMotion({ value: true, idLift: this.lift.id });
      gsap.to(this.$refs.lift, {
        duration: Math.abs(duration),
        ease: "none",
        y: -distance,
        onComplete: () => this.completeMotion(goalFloor),
      });
    },
  },
  mounted() {
    if (this.lift.stack.length) {
      this.motionGo(this.lift.stack[0]);
    }
    if (this.lift.waiting === false) {
      const distance =
        (document.documentElement.scrollHeight / this.floorsCount) *
        this.lift.floor;
      if (this.$refs.lift) {
        this.$refs.lift[0].style.transform = `translate(0 , ${-distance}px)`;
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@keyframes mig {
  0% {
    background-color: bisque;
  }
  50% {
    background-color: rgb(0, 255, 242);
  }
  100% {
    background-color: bisque;
  }
}
.lift {
  width: 100%;
  height: 100%;
  background-color: bisque;
  display: flex;
  justify-content: center;
  &-info {
    margin-top: 10px;
    font-weight: 700;
    & svg {
      height: 10px;
      &.reverse {
        transform: rotate(180deg);
      }
    }
  }
  &--waiting {
    animation: mig 0.5s linear infinite;
  }

  &-floor {
    border-bottom: 1px solid gray;
    min-height: 70px;
  }
  &-wrap {
    width: 100px;
    display: grid;
    height: 100%;
    border-right: 2px solid black;
  }
}
</style>
