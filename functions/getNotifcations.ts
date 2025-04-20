import axios from "axios";

interface Notification {
  data: string;
  stamp: number;
  type: string;
}

interface GetNotificationsResponse {
  data: Notification[] | [];
  err?: string;
}

export const getNotifications = (
  orgId: string,
  apiLink: string,
  acsTok: string
): Promise<GetNotificationsResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      const req = await axios
        .post(
          `${apiLink}/fetch-notifications`,
          { orgId: orgId },
          {
            headers: {
              Authorization: `Bearer ${acsTok}`,
            },
            withCredentials: true,
          }
        )
        .catch((e) => {
          throw new Error("Fail to fetch notifications.");
        });
      const acs = req.data;
      let tmp: Notification[] = [];
      acs.data.forEach((notification: any) => {
        tmp.push({
          data: notification.data,
          stamp: notification.stamp,
          type: notification.type,
        });
      });
      resolve({
        data: [...tmp],
      });
    } catch (e: any) {
      reject({
        data: [],
        err: e.message,
      });
    }
  });
};
