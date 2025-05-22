<template>
  <div class="flex items-center justify-around flex-col min-h-dvh w-full py-20">
    <div class="flex items-center justify-center flex-col gap-5">
      <h1 class="inline-flex items-center justify-center gap-3 sm:gap-6">
        <span v-for="(char, index) in 'SHORT.'" class="font-bold text-8xl sm:text-9xl wavy select-none" :style="{ animationDelay: `${index * 200}ms` }">{{ char }}</span>
      </h1>
      <h2 class="hidden sm:block text-xl md:text-2xl">no tracking or anything. not a scam, or a sham, or spam. just a URL shortener.</h2>
    </div>

    <Transition>
      <div class="flex flex-col items-center justify-center" v-if="generatedLink">
        <h3 class="text-3xl font-medium mb-6">All done!</h3>

        <div class="flex items-center justify-center gap-2">
          <p class="text-xl">{{ baseUrl }}/{{ generatedLink.short }}</p>
          <button class="size-9 p-2 hover:bg-green-100 transition rounded-full cursor-pointer" type="button" @click="copyToClipboard">
            <img class="size-5" src="/copy.svg" aria-hidden="true" />
          </button>
        </div>

        <p>Expires {{ generatedLink.expiresAt ? `on ${new Date(generatedLink.expiresAt).toLocaleString()}` : "never" }}</p>
      </div>
    </Transition>

    <form @submit.prevent="createLink" class="flex flex-col items-center justify-center gap-4">
      <div class="flex items-center justify-center gap-4 bg-neutral-100 px-5 py-3 rounded-xl hover:bg-neutral-200 transition focus-within:bg-neutral-200">
        <img class="size-5 select-none" draggable="false" src="/web.svg" aria-hidden="true" />
        <input class="focus:outline-0 w-64 sm:w-96" type="text" v-model="inputs.url" placeholder="https://" />
      </div>

      <div class="flex mx-4 sm:mx-auto items-center flex-wrap sm:flex-nowrap justify-center bg-neutral-100 pl-5 rounded-xl">
        <img class="size-5 mr-4 select-none" draggable="false" src="/calendar.svg" aria-hidden="true" />
        <button
          v-for="(option, hours) in expirationDates"
          class="py-3 px-3 last:pr-4 last:rounded-r-xl hover:bg-neutral-200 transition cursor-pointer"
          :class="{ '!bg-neutral-200': inputs.expires === hours }"
          type="button"
          @click="inputs.expires = hours">
          {{ option }}
        </button>
      </div>

      <button class="px-16 py-3 rounded-xl transition text-2xl font-medium" :class="canSubmit ? 'bg-green-400 hover:bg-green-500 cursor-pointer' : 'bg-neutral-300 cursor-not-allowed'" type="submit">
        {{ loading ? "Loading" : "Shorten" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { doc, getDoc, setDoc } from "firebase/firestore";

const globalStore = useGlobalStore();
const { activeToasts } = storeToRefs(globalStore);

const baseUrl = computed(() => window?.location.origin);

const expirationDates = {
  1: "1 hour",
  3: "3 hours",
  12: "12 hours",
  24: "1 day",
  48: "2 days",
  168: "7 days",
  720: "30 days",
  0: "Never",
} as const;

const inputs = reactive({
  url: "",
  /** in hours */
  expires: ref<keyof typeof expirationDates>(),
});
const canSubmit = computed(() => inputs.url && inputs.expires);

const loading = ref(false);
const generatedLink = ref<LinkData>();

async function createLink() {
  if (!canSubmit.value) return;

  loading.value = true;
  generatedLink.value = undefined;

  const code = generateCode();
  const exists = await checkCode(code);

  while (exists) return createLink();

  const link: LinkData = {
    long: inputs.url,
    short: code,
    createdAt: Date.now(),
    expiresAt: Number(inputs.expires) === 0 ? null : Date.now() + inputs.expires! * 60 * 60 * 1000,
  };

  const { error } = await tryCatch(setDoc(doc(db, "links", code), link));
  loading.value = false;
  if (error) {
    activeToasts.value.push(new Toast("error", "Something went wrong. Try again later."));
    return console.error(error);
  }

  generatedLink.value = link;
  inputs.url = "";
  inputs.expires = undefined;
}

function generateCode() {
  const length = 6;

  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" as const;

  for (let i = 0; i < length; i++) result += getRandomItem(characters);

  return result;
}

/** Checks whether a document with the code exists */
async function checkCode(code: string) {
  const docSnap = await getDoc(doc(db, "links", code));
  return docSnap.exists();
}

function copyToClipboard() {
  if (!generatedLink.value) return;

  navigator.clipboard.writeText(`${baseUrl.value}/${generatedLink.value.short}`);
  activeToasts.value.push(new Toast("success", "Copied to clipboard!"));
}
</script>

<style scoped>
@keyframes wavy {
  from {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-1.5rem);
  }
  to {
    transform: translateY(0);
  }
}
.wavy {
  animation: wavy 2s ease-in-out infinite;
}

.v-enter-active,
.v-leave-active {
  transition: transform 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  transform: scale(0);
}
</style>
