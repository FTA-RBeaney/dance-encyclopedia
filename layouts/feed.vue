<template>
  <div>
    <div class="flex flex-col justify-between text-neutral-900">
      <Navbar />
    </div>
    <div class="border-t">
      <div class="bg-background">
        <div class="lg:grid lg:grid-cols-5 min-h-screen">
          <Sidebar class="hidden lg:block" />
          <div
            id="main-content"
            class="main-content col-span-3 lg:col-span-3 lg:border-l relative"
          >
            <div class="max-w-2xl mx-auto">
              <slot />
            </div>
          </div>
          <div class="pr-4 mt-6">
            <Card class="p-4">
              <UserList class="px-2" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
