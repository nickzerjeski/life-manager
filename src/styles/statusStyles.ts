import { Status } from "@/types/Status";

export const containerStyle: Record<Status, string> = {
  [Status.ON_TRACK]: 'bg-green-50 border border-green-200',
  [Status.AT_RISK]: 'bg-yellow-50 border border-yellow-200',
  [Status.OFF_TRACK]: 'bg-red-50 border border-red-300',
  [Status.NOT_STARTED]: 'bg-gray-50 border border-gray-200',
  [Status.ACHIEVED]: 'bg-blue-50 border border-blue-200',
};

export const statusLabelStyle: Record<Status, string> = {
  [Status.ON_TRACK]: 'bg-green-200 text-green-800',
  [Status.AT_RISK]: 'bg-yellow-200 text-yellow-800',
  [Status.OFF_TRACK]: 'bg-red-200 text-red-800',
  [Status.NOT_STARTED]: 'bg-gray-200 text-gray-800',
  [Status.ACHIEVED]: 'bg-blue-200 text-blue-800',
};