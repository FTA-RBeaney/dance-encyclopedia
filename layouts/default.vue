<template>
  <div>
    <div class="flex flex-col justify-between bg-neutral-50 text-neutral-900">
      <Navbar />
    </div>
    <div class="border-t">
      <div class="bg-background">
        <div class="lg:grid lg:grid-cols-5">
          <Sidebar class="hidden lg:block" />
          <div
            id="main-content"
            class="main-content col-span-3 lg:col-span-4 lg:border-l relative"
          >
            <Suspense>
              <div class="px-8 py-6 mx-auto bg-neutral-50 h-full">
                <slot />
              </div>

              <template #fallback>
                <LoadingCircle />
              </template>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
