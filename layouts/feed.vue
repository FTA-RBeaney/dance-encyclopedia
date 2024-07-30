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
            <div>
              <slot />
            </div>
          </div>
          <Card class="p-4 mt-6 mr-4 self-start">
            <UserList class="p-4" />
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
