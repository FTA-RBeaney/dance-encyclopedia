<template>
  <div>
    <div class="flex flex-col justify-between bg-neutral-50 text-neutral-900">
      <Navbar />
    </div>
    <div class="border-t">
      <div class="bg-background">
        <div class="grid lg:grid-cols-5">
          <Sidebar class="hidden lg:block" />
          <div class="col-span-3 lg:col-span-4 lg:border-l">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
