<script setup>
const props = defineProps({
  error: Object,
  required: true,
});

const handleError = () => clearError({ redirect: "/account" });

const backgrounds = [
  "https://res.cloudinary.com/dgbn0ttzf/image/upload/v1721777582/451636138_1856865591467589_3547137860137697654_n_ixijcz.png",
  "https://res.cloudinary.com/dgbn0ttzf/image/upload/a_hflip/v1721777257/451958538_445659454960505_6586674871999271778_n_vsgbjk.png",
  "https://res.cloudinary.com/dgbn0ttzf/image/upload/v1721777585/449702907_1161973848370950_1788862568352482255_n_pou5fz.png",
  "https://res.cloudinary.com/dgbn0ttzf/image/upload/v1721777591/449980782_7952893248090691_4873418655634079320_n_stecda.png",
];

const bgImage = ref();

function changeBg() {
  const randIndex = Math.floor(Math.random() * backgrounds.length);
  bgImage.value = backgrounds[randIndex];
}
changeBg();
</script>
<template>
  <div class="h-screen w-screen bg-gray-100 flex items-end justify-end">
    <div
      class="w-8/12 flex flex-col md:flex-row items-center justify-end px-5 h-full text-gray-700"
    >
      <div class="max-w-xl">
        <div class="text-5xl font-dark font-bold">{{ error.statusCode }}</div>
        <p class="text-2xl md:text-3xl font-light leading-normal">
          {{ error.message }} @ {{ error.url }}
        </p>
        <p class="mb-8" v-html="error.stack"></p>

        <Button @click="handleError"> back to homepage </Button>
      </div>
      <div class="max-w-lg self-end">
        <img class="rounded-xl" :src="bgImage" />
      </div>
    </div>
  </div>
</template>

<style>
.cls-1 {
  fill: #d6b49a;
}
.cls-1,
.cls-10,
.cls-11,
.cls-13,
.cls-14,
.cls-15,
.cls-17,
.cls-2,
.cls-4,
.cls-5,
.cls-6 {
  stroke: #000;
}
.cls-1,
.cls-11,
.cls-13,
.cls-14,
.cls-16,
.cls-8 {
  stroke-linecap: round;
  stroke-linejoin: round;
}
.cls-1,
.cls-10,
.cls-11,
.cls-12,
.cls-13,
.cls-14,
.cls-15,
.cls-16,
.cls-17,
.cls-2,
.cls-3,
.cls-4,
.cls-5,
.cls-6,
.cls-7,
.cls-8,
.cls-9 {
  stroke-width: 3px;
}
.cls-2 {
  fill: #020202;
}
.cls-10,
.cls-12,
.cls-15,
.cls-17,
.cls-2,
.cls-3,
.cls-4,
.cls-5,
.cls-6,
.cls-7,
.cls-9 {
  stroke-miterlimit: 10;
}
.cls-3 {
  fill: #818181;
}
.cls-12,
.cls-16,
.cls-3,
.cls-7,
.cls-8,
.cls-9 {
  stroke: #191818;
}
.cls-4 {
  fill: #dcdbda;
}
.cls-5 {
  fill: #4ea7f1;
}
.cls-14,
.cls-6 {
  fill: #f8f3ed;
}
.cls-16,
.cls-7 {
  fill: #333;
}
.cls-13,
.cls-8 {
  fill: none;
}
.cls-9 {
  fill: #f8f59c;
}
.cls-10,
.cls-11 {
  fill: #f3d2c9;
}
.cls-15 {
  fill: #8bb174;
}
.cls-17 {
  fill: #da4e22;
}
</style>
