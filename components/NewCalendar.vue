<template>
  <div class="px-8">
    <FullCalendar :options="calendarOptions" @eventClick="handleClick">
      <template v-slot:eventContent="arg">
        <Dialog>
          <DialogTrigger as-child>
            <Button
              variant="ghost"
              class="px-2 py-1 h-auto bg-amber-100 hover:bg-amber-200"
            >
              {{ arg.event.title }}
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{{ arg.event.title }}</DialogTitle>
              <DialogDescription>
                {{ arg.event.extendedProps.location }}
                <!-- <pre>{{ arg.event }}</pre> -->
              </DialogDescription>
            </DialogHeader>
            <p v-if="arg.event.extendedProps.description">
              {{ arg.event.extendedProps.description }}
            </p>
            <DialogFooter> </DialogFooter>
          </DialogContent>
        </Dialog>
      </template>
    </FullCalendar>
  </div>
</template>

<script lang="ts">
import FullCalendar from "@fullcalendar/vue3";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import iCalendarPlugin from "@fullcalendar/icalendar";
import googleCalendarPlugin from "@fullcalendar/google-calendar";

export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin, googleCalendarPlugin],
        initialView: "dayGridMonth",
        selectable: true,
        select: this.handleSelect,
        dateClick: this.handleDateClick,
        googleCalendarApiKey: "AIzaSyDPwdCSsl2eQdCa-gt7zlkvIaytjiT7Uwk",
        events: {
          googleCalendarId: "dalstonjump@gmail.com",
          color: "yellow", // an option!
          textColor: "black",
          className: "gcal-event",
        },
        eventTimeFormat: {
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        },
        firstDay: 1,
        eventClick: function (info) {
          info.jsEvent.preventDefault();
          console.log("Event: " + info.event.start);

          // change the border color just for fun
          info.el.style.borderColor = "red";
        },
        // events: [
        //   {
        //     title: "All Day Event",
        //     description: "description for All Day Event",
        //     start: "2024-08-01",
        //   },
        //   {
        //     title: "Long Event",
        //     description: "description for Long Event",
        //     start: "2024-08-07",
        //     end: "2024-08-10",
        //   },
        //   {
        //     groupId: "999",
        //     title: "Repeating Event",
        //     description: "description for Repeating Event",
        //     start: "2024-08-09T16:00:00",
        //   },
        //   {
        //     groupId: "999",
        //     title: "Repeating Event",
        //     description: "description for Repeating Event",
        //     start: "2024-08-16T16:00:00",
        //   },
        //   {
        //     title: "Conference",
        //     description: "description for Conference",
        //     start: "2024-08-11",
        //     end: "2024-08-13",
        //   },
        //   {
        //     title: "Meeting",
        //     description: "description for Meeting",
        //     start: "2024-08-12T10:30:00",
        //     end: "2024-08-12T12:30:00",
        //   },
        //   {
        //     title: "Lunch",
        //     description: "description for Lunch",
        //     start: "2024-08-12T12:00:00",
        //   },
        //   {
        //     title: "Meeting",
        //     description: "description for Meeting",
        //     start: "2024-08-12T14:30:00",
        //   },
        //   {
        //     title: "Birthday Party",
        //     description: "description for Birthday Party",
        //     start: "2024-08-13T07:00:00",
        //   },
        //   {
        //     title: "Click for Google",
        //     description: "description for Click for Google",
        //     url: "https://google.com/",
        //     start: "2024-08-28",
        //   },
        // ],
      },
    };
  },
  methods: {
    handleDateClick: function (info) {
      console.log(info);

      //   alert(info.dayEl.querySelector(".fc-event-title").innerText);
    },
  },
};
</script>

<style lang="scss">
.gcal-event {
  button {
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    font-weight: normal;
    font-size: 0.8rem;
    display: block;
  }
}
.fc-daygrid-dot-event.fc-event-mirror,
.fc-daygrid-dot-event:hover {
  background: none;
}
</style>
