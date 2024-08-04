import { h } from "vue";
import {
  CircleHelp,
  Circle,
  Timer,
  CircleCheck,
  Ban,
  SignalLow,
  SignalMedium,
  SignalHigh,
} from "lucide-vue-next";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: h(CircleHelp),
  },
  {
    value: "to do",
    label: "To Do",
    icon: h(Circle),
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: h(Timer),
  },
  {
    value: "testing",
    label: "Testing",
    icon: h(Timer),
  },
  {
    value: "done",
    label: "Done",
    icon: h(CircleCheck),
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: h(Ban),
  },
];

export const priorities = [
  {
    value: "low",
    label: "Low",
    icon: h(SignalLow),
  },
  {
    value: "medium",
    label: "Medium",
    icon: h(SignalMedium),
  },
  {
    value: "high",
    label: "High",
    icon: h(SignalHigh),
  },
];
