export default defineNuxtRouteMiddleware((to, from) => {
  const supabaseUser = useSupabaseUser();

  if (to.params.id === "1") {
    return abortNavigation();
  }
  // In a real app you would probably not redirect every route to `/`
  // however it is important to check `to.path` before redirecting or you
  // might get an infinite redirect loop
  if (to.path === "/dsadsadasas" && !supabaseUser.value) {
    return navigateTo("/login");
  }
});
