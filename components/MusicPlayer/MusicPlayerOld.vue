<template>
  <div id="audio-player-root">
    <!-- Hide the default audio player -->
    <div>
      <audio hidden controls ref="player" :id="playerid">
        <source :src="url" type="audio/mpeg" />
      </audio>
    </div>

    <!-- component -->
    <!-- This is an example component -->
    <div class="w-full">
      <div
        class="flex w-8/12 bg-white shadow-md rounded-lg overflow-hidden mx-auto"
      >
        <div class="flex flex-col w-full">
          <div class="flex p-5 border-b">
            <img
              class="w-20 h-20 object-cover"
              alt="User avatar"
              src="https://images.unsplash.com/photo-1477118476589-bff2c5c4cfbb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=200"
            />
            <div class="flex flex-col px-2 w-full">
              <span class="text-xs text-gray-700 uppercase font-medium">
                now playing
              </span>
              <span class="text-sm text-red-500 capitalize font-semibold pt-1">
                I think I need a sunrise, I'm tired of the sunset
              </span>
              <span class="text-xs text-gray-500 uppercase font-medium">
                -"Boston," Augustana
              </span>
              <div class="flex justify-end">
                <img
                  class="w-5 cursor-pointer"
                  src="https://www.iconpacks.net/icons/2/free-favourite-icon-2765-thumb.png"
                />
                <img
                  class="w-5 cursor-pointer mx-2"
                  src="https://www.iconpacks.net/icons/2/free-favourite-icon-2765-thumb.png"
                />
                <img
                  class="w-5 cursor-pointer"
                  src="https://www.iconpacks.net/icons/2/free-favourite-icon-2765-thumb.png"
                />
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center p-5">
            <div class="flex items-center">
              <div class="flex space-x-3 p-2">
                <button class="focus:outline-none">
                  <svg
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ef4444"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polygon points="19 20 9 12 19 4 19 20"></polygon>
                    <line x1="5" y1="19" x2="5" y2="5"></line>
                  </svg>
                </button>
                <button
                  class="rounded-full w-10 h-10 flex items-center justify-center pl-0.5 ring-1 ring-red-400 focus:outline-none"
                  @click="toggleAudio()"
                >
                  <svg
                    v-if="!isPlaying"
                    class="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ef4444"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    v-else
                    class="text-red-500 hover:text-red-500 cursor-pointer w-6 h-6"
                  >
                    <path
                      d="M15 7C15 6.44772 15.4477 6 16 6C16.5523 6 17 6.44772 17 7V17C17 17.5523 16.5523 18 16 18C15.4477 18 15 17.5523 15 17V7ZM7 7C7 6.44772 7.44772 6 8 6C8.55228 6 9 6.44772 9 7V17C9 17.5523 8.55228 18 8 18C7.44772 18 7 17.5523 7 17V7Z"
                    ></path>
                  </svg>
                </button>
                <button class="focus:outline-none">
                  <svg
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ef4444"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polygon points="5 4 15 12 5 20 5 4"></polygon>
                    <line x1="19" y1="5" x2="19" y2="19"></line>
                  </svg>
                </button>
              </div>
            </div>
            <div class="relative w-full sm:w-1/2 md:w-7/12 lg:w-4/6 ml-2">
              <div
                v-if="!audioLoaded"
                class="w-full top-0 bottom-0 right-0 left-0 px-2 pointer-events-none"
              >
                Loading please wait...
              </div>
              <div v-else class="bg-red-300 h-2 w-full rounded-lg">
                <input
                  v-model="playbackTime"
                  type="range"
                  min="0"
                  :max="audioDuration"
                  class="bg-red-500 h-2 w-1/2 rounded-lg overflow-hidden absolute top-0"
                  id="position"
                  name="position"
                />
              </div>
            </div>
            <div class="flex justify-end w-full sm:w-auto pt-1 sm:pt-0">
              <div
                class="flex text-xs text-gray-700 uppercase font-medium pl-2"
              >
                <span v-html="elapsedTime()"></span>/<span
                  v-html="totalTime()"
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- outer gray border -->
  </div>
  <!-- white bg -->

  <!-- root -->
</template>

<script>
//import { mapState } from 'vuex'
export default {
  props: ["url", "playerid"],
  /**
   * playbackTime = local var that syncs to audio.currentTime
   * audioDuration = duration of audio file in seconds
   * isPlaying = boolean (true if audio is playing)
   *
   **/
  data() {
    return {
      playbackTime: 0,
      audioDuration: 100,
      audioLoaded: false,
      isPlaying: false,
    };
  },
  methods: {
    //Set the range slider max value equal to audio duration
    initSlider() {
      var audio = this.$refs.player;
      if (audio) {
        this.audioDuration = Math.round(audio.duration);
      }
    },
    //Convert audio current time from seconds to min:sec display
    convertTime(seconds) {
      const format = (val) => `0${Math.floor(val)}`.slice(-2);
      var hours = seconds / 3600;
      var minutes = (seconds % 3600) / 60;
      return [minutes, seconds % 60].map(format).join(":");
    },
    //Show the total duration of audio file
    totalTime() {
      var audio = this.$refs.player;
      if (audio) {
        var seconds = audio.duration;
        return this.convertTime(seconds);
      } else {
        return "00:00";
      }
    },
    //Display the audio time elapsed so far
    elapsedTime() {
      var audio = this.$refs.player;
      if (audio) {
        var seconds = audio.currentTime;
        return this.convertTime(seconds);
      } else {
        return "00:00";
      }
    },
    //Playback listener function runs every 100ms while audio is playing
    playbackListener(e) {
      var audio = this.$refs.player;
      //Sync local 'playbackTime' var to audio.currentTime and update global state
      this.playbackTime = audio.currentTime;

      //console.log("update: " + audio.currentTime);
      //Add listeners for audio pause and audio end events
      audio.addEventListener("ended", this.endListener);
      audio.addEventListener("pause", this.pauseListener);
    },
    //Function to run when audio is paused by user
    pauseListener() {
      this.isPlaying = false;
      this.listenerActive = false;
      this.cleanupListeners();
    },
    //Function to run when audio play reaches the end of file
    endListener() {
      this.isPlaying = false;
      this.listenerActive = false;
      this.cleanupListeners();
    },
    //Remove listeners after audio play stops
    cleanupListeners() {
      var audio = this.$refs.player;
      audio.removeEventListener("timeupdate", this.playbackListener);
      audio.removeEventListener("ended", this.endListener);
      audio.removeEventListener("pause", this.pauseListener);
      //console.log("All cleaned up!");
    },
    toggleAudio() {
      var audio = this.$refs.player;
      //var audio = document.getElementById("audio-player");
      if (audio.paused) {
        audio.play();
        this.isPlaying = true;
      } else {
        audio.pause();
        this.isPlaying = false;
      }
    },
  },
  mounted: function () {
    // nextTick code will run only after the entire view has been rendered

    var audio = this.$refs.player;
    //Wait for audio to load, then run initSlider() to get audio duration and set the max value of our slider
    // "loademetadata" Event https://www.w3schools.com/tags/av_event_loadedmetadata.asp
    audio.addEventListener(
      "loadedmetadata",
      function (e) {
        this.initSlider();
      }.bind(this)
    );
    // "canplay" HTML Event lets us know audio is ready for play https://www.w3schools.com/tags/av_event_canplay.asp
    audio.addEventListener(
      "canplay",
      function (e) {
        this.audioLoaded = true;
        console.log(this.audioLoaded);
      }.bind(this)
    );
    //Wait for audio to begin play, then start playback listener function
    this.$watch("isPlaying", function () {
      if (this.isPlaying) {
        var audio = this.$refs.player;
        this.initSlider();
        //console.log("Audio playback started.");
        //prevent starting multiple listeners at the same time
        if (!this.listenerActive) {
          this.listenerActive = true;
          //for a more consistent timeupdate, include freqtimeupdate.js and replace both instances of 'timeupdate' with 'freqtimeupdate'
          audio.addEventListener("timeupdate", this.playbackListener);
        }
      }
    });
    //Update current audio position when user drags progress slider
    this.$watch("playbackTime", function () {
      var audio = this.$refs.player;
      var diff = Math.abs(this.playbackTime - this.$refs.player.currentTime);

      //Throttle synchronization to prevent infinite loop between playback listener and this watcher
      if (diff > 0.01) {
        this.$refs.player.currentTime = this.playbackTime;
      }
    });
  },
};
</script>

<style>
/* Play/Pause Button */
.play-button {
  height: 45px;
}
input[type="range"] {
  margin: auto;
  -webkit-appearance: none;
  overflow: hidden;
  width: 100%;
  cursor: pointer;
  outline: none;
  border-radius: 0; /* iOS */
  background: transparent;
  border-radius: 10px;
}
input[type="range"]::-webkit-slider-runnable-track {
  height: 10px;
  -webkit-appearance: none;
  color: #13bba4;
  margin-top: -1px;
}

input[type="range"]::-webkit-slider-thumb {
  width: 10px;
  -webkit-appearance: none;
  height: 10px;
  cursor: ew-resize;
  background: transparent;
  box-shadow: -80px 0 0 80px #ef4444;
}
input[type="range"]:focus {
  outline: none;
}

/*
 * 1. Set to 0 width and remove border for a slider without a thumb
 */
::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 0; /* 1 */
  height: 40px;
  background: #fff;
  box-shadow: -100vw 0 0 100vw dodgerblue;
  border: none; /* 2px solid #999; */
}
::-moz-range-track {
  height: 40px;
  background: #ddd;
}
::-moz-range-thumb {
  background: #fff;
  height: 40px;
  width: 0; /* 20px; */
  border: none; /* 3px solid #999; */
  border-radius: 0 !important;
  box-shadow: -100vw 0 0 100vw dodgerblue;
  box-sizing: border-box;
}
::-ms-fill-lower {
  background: dodgerblue;
}
::-ms-thumb {
  background: #fff;
  border: 2px solid #999;
  height: 40px;
  width: 20px;
  box-sizing: border-box;
}
::-ms-ticks-after {
  display: none;
}
::-ms-ticks-before {
  display: none;
}
::-ms-track {
  background: #ddd;
  color: transparent;
  height: 40px;
  border: none;
}
::-ms-tooltip {
  display: none;
}
</style>
