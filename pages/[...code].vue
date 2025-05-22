<template>
  <div></div>
</template>

<script setup lang="ts">
import { doc, getDoc } from "firebase/firestore";

const route = useRoute();
const router = useRouter();
const globalStore = useGlobalStore();
const { activeToasts } = storeToRefs(globalStore);
const code = String(route.params.code);

onMounted(async () => {
  const docSnap = await getDoc(doc(db, "links", code));
  console.log(docSnap);

  if (!docSnap.exists()) return returnToHome("Link not found. Try asking for the link again.");

  const data = docSnap.data() as LinkData;
  if (data.expiresAt && data.expiresAt <= Date.now()) return returnToHome("Link expired. Try asking for another link.");

  window.location.replace(data.long);
});

function returnToHome(message: string) {
  activeToasts.value.push(new Toast("error", message));
  router.replace("/");
}
</script>

<style scoped></style>
