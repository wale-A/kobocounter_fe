import { Action } from "vuex";
import api from "@/api";

const subscribeUser: Action<any, any> = async (
  _,
  { subscription }: { subscription: string }
) => {
  try {
    await api.subscribe({ subscription });
  } catch (e) {
    console.error(e);
  }
};
const deleteSubscription: Action<any, any> = async (
  _,
  { subscription }: { subscription: string }
) => {
  try {
    await api.unsubscribe({ subscription });
  } catch (e) {
    console.error(e);
  }
};
export default {
  subscribeUser,
  deleteSubscription,
};
