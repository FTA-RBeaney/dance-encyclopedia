<template>
  <div>
    <div class="flex flex-col justify-between text-neutral-900">
      <Card class="rounded-none">
        <Navbar />
      </Card>
    </div>
    <div class="border-t">
      <div class="bg-[--bodybg] dark:bg-background">
        <div class="lg:grid lg:grid-cols-6 max-w-screen-2xl min-h-screen">
          <Card class="rounded-none -mt-0.5 max-w-[300px]">
            <Sidebar class="hidden lg:block" />
          </Card>
          <div
            id="main-content"
            class="main-content col-span-4 lg:col-span-5 relative"
          >
            <div class="mx-auto">
              <div class="lg:w-12/12">
                <slot />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
