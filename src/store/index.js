import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: () => ({
    floorCount: 0,
    liftCount: 0,
    lengthPause: 3,
    lift: {},
    floors: {},
  }),
  getters: {
    getArrayFloors(state) {
      return Object.values(state.floors).reverse();
    },
    getArrayLifts(state) {
      return Object.values(state.lift).reverse();
    },
  },
  mutations: {
    setInitLifts(state, numbers) {
      state.liftCount = numbers;
      for (let i = 0; i < numbers; i++) {
        if (!state.lift[i]) {
          state.lift[i] = {
            id: i,
            floor: 0,
            stack: [],
            motion: false,
            waiting: false,
            call: false,
          };
        }
      }
    },
    setInitFloors(state, numbers) {
      state.floorCount = numbers;
      for (let i = 0; i < numbers; i++) {
        state.floors[i] = {
          num: i,
          waiting: false,
          haveLift: false,
        };
      }
    },
    setWaitingFloor(state, { num, value }) {
      state.floors[num].waiting = value;
    },
    callLift(state, { num, liftId }) {
      state.lift[liftId].stack.push(num);
      state.lift[liftId].call = true;
    },
    setHaveLiftFloor(state, { num, value }) {
      state.floors[num].haveLift = value;
      state.floors[num].waiting = false;
    },
    setCurrentFloor(state, { goalFloor, idLift }) {
      state.lift[idLift].floor = goalFloor;
    },
    setMotion(state, { value, idLift }) {
      state.lift[idLift].motion = value;
    },
    setWaitingLift(state, { value, idLift }) {
      state.lift[idLift].waiting = value;
    },
    removeCallLift(state, idLift) {
      state.lift[idLift].call = false;
    },
    shiftStackLift(state, idLift) {
      state.lift[idLift].stack.shift();
    },
  },
  actions: {
    async callLift({ commit, state }, num) {
      const haveLift = Object.values(state.lift).findIndex(
        (item) => item.floor === num
      );
      if (haveLift < 0) {
        const [liftId] = Object.entries(state.lift).reduce(
          (accumulator, [key, lift]) => {
            if (lift.stack.length) {
              let diff =
                Math.abs(lift.floor - lift.stack[0]) + state.lengthPause;
              const dist = lift.stack.reduce((acc, current, index, array) => {
                if (index === array.length - 1) {
                  return acc;
                }
                return (
                  acc +
                  Math.abs(array[index] - array[index + 1]) +
                  state.lengthPause
                );
              }, 0);
              diff += dist;
              if (accumulator[1] > diff) {
                return [key, diff];
              } else {
                return accumulator;
              }
            } else {
              let diff = Math.abs(lift.floor - num);
              if (accumulator[1] > diff) {
                return [key, diff];
              } else {
                return accumulator;
              }
            }
          },
          [0, state.floorCount]
        );
        commit("setWaitingFloor", { num, value: true });
        commit("callLift", { num, liftId });
      }
    },
  },
  plugins: [createPersistedState()],
});
