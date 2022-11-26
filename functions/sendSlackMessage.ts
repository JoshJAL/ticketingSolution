import axios from "axios";

export async function sendSlackMessage(webhookUrl: string, user: any, title: string, description: string, selection: number | string) {
  const data = {
        username: 'Ticket Bot',
        icon_url:
        'https://camo.githubusercontent.com/6e466156683138348d4283ec8ab1a8a8a959dbb6e2f9c06c1300f06ab01c7504/687474703a2f2f66696c65732d6d6973632e73332e616d617a6f6e6177732e636f6d2f6c756e6368626f742e6a7067',
        text: `A new ticket was submitted by ${
            user.user_metadata.name
        }! \n Title: ${title} \n Description: ${description} \n Priority: ${
            selection == 3
            ? 'EMERGENCY'
            : selection == 2
            ? 'NEED TODAY OR TOMORROW'
            : selection == 1
            ? 'Need by the end of the week'
            : 'No rush'
        }`,
    };
    const res = await axios.post(webhookUrl, JSON.stringify(data), {
        withCredentials: false,
        transformRequest: [
            (data, headers) => {
                //@ts-ignore
                delete headers.post['Content-Type'];
                return data;
                },
            ],
    });
};

export async function sendSlackMessageReview(webhookUrl: string, ticket: any, urlText: any, user: any) {
  const data = {
    username: 'Ticket Bot',
    icon_url:
      'https://camo.githubusercontent.com/6e466156683138348d4283ec8ab1a8a8a959dbb6e2f9c06c1300f06ab01c7504/687474703a2f2f66696c65732d6d6973632e73332e616d617a6f6e6177732e636f6d2f6c756e6368626f742e6a7067',
    text: `A new ticket is ready for review from ${user.user_metadata.name}! \n Title: ${
      ticket.title
    } \n Description: ${ticket.description} \n Priority: ${
      ticket.priority_level == 3
        ? 'EMERGENCY'
        : ticket.priority_level == 2
        ? 'NEED TODAY OR TOMORROW'
        : ticket.priority_level == 1
        ? 'Need by the end of the week'
        : 'No rush'
    } ${urlText.trim() !== '' && urlText ? `\n Page URL: ${urlText}` : ``} `,
  };
  const res = await axios.post(webhookUrl, JSON.stringify(data), {
    withCredentials: false,
    transformRequest: [
      (data, headers) => {
        //@ts-ignore
        delete headers.post['Content-Type'];
        return data;
      },
    ],
  });
}
